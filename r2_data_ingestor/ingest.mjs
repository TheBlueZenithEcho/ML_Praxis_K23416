import { createClient } from '@supabase/supabase-js';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';
import 'dotenv/config'; // Tải biến .env
import * as path from 'path';

// --- Cấu hình (Đọc từ file .env) ---
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_KEY;
const R2_ENDPOINT = process.env.R2_ENDPOINT;
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID;
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY;
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME;

// --- Khởi tạo Clients ---
// Dùng Service Key để có quyền admin (cần để INSERT vào các bảng có RLS)
const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
    auth: {
        // Tắt auto-refresh token, không cần thiết cho script
        autoRefreshToken: false,
        persistSession: false
    }
});

const s3Client = new S3Client({
    region: 'auto',
    endpoint: R2_ENDPOINT,
    credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
    },
});

console.log('Khởi tạo clients... OK');

/**
 * Hàm list tất cả file trong R2 Bucket
 */
async function listAllFiles(bucket) {
    console.log(`Bắt đầu quét R2 bucket: ${bucket}...`);
    const files = [];
    let isTruncated = true;
    let continuationToken;

    while (isTruncated) {
        const command = new ListObjectsV2Command({
            Bucket: bucket,
            ContinuationToken: continuationToken,
        });
        const response = await s3Client.send(command);

        if (response.Contents) {
            files.push(...response.Contents);
        }

        isTruncated = response.IsTruncated;
        continuationToken = response.NextContinuationToken;
    }
    console.log(`Đã tìm thấy ${files.length} files trong R2.`);
    return files;
}

/**
 * Lấy hoặc tạo Category và trả về ID
 * (Dùng cache để giảm query)
 */
const categoryCache = new Map();
async function getOrCreateCategory(name, type, parentId = null) {
    const cacheKey = `${type}::${name}`;
    if (categoryCache.has(cacheKey)) {
        return categoryCache.get(cacheKey);
    }

    let { data, error } = await supabase
        .from('categories')
        .select('id')
        .eq('name', name)
        .eq('type', type)
        .maybeSingle();

    if (error) throw new Error(`Lỗi khi tìm category '${name}': ${error.message}`);

    if (data) {
        categoryCache.set(cacheKey, data.id);
        return data.id;
    }

    console.log(` -> Đang tạo Category [${type}]: ${name}`);
    let { data: newData, error: insertError } = await supabase
        .from('categories')
        .insert({
            name: name,
            type: type,
            parent_id: parentId,
        })
        .select('id')
        .single();

    if (insertError) throw new Error(`Lỗi khi tạo category '${name}': ${insertError.message}`);

    categoryCache.set(cacheKey, newData.id);
    return newData.id;
}

/**
 * (MỚI) Helper tạo giá ngẫu nhiên (bội số của 1000)
 */
function generatePrice() {
    const minThousands = 99; // 99,000
    const maxThousands = 6800; // 6,800,000
    // Tính số lượng "nghìn"
    const randThousands = Math.floor(Math.random() * (maxThousands - minThousands + 1)) + minThousands;
    // Nhân với 1000
    return randThousands * 1000;
}

/**
 * (MỚI) Helper tạo SKU 12 ký tự
 * vd: (Name: "Babies Tableware", ID: "00319526") -> "BT0000319526"
 */
function generateSKU(productName, originalId) {
    // 1. Lấy chữ cái đầu: "Babies Tableware" -> "BT"
    const acronym = productName.split(' ')
        .map(word => word[0])
        .join('')
        .toUpperCase();

    // 2. Tính số 0 cần đệm
    const targetLength = 12;
    const paddingLength = targetLength - acronym.length - originalId.length;

    let padding = '';
    if (paddingLength > 0) {
        padding = '0'.repeat(paddingLength);
    }

    // 3. Ghép lại: "BT" + "00" + "00319526"
    const sku = `${acronym}${padding}${originalId}`;

    // 4. Đảm bảo 12 ký tự (cắt bớt nếu quá dài, hiếm khi xảy ra)
    return sku.substring(0, 12);
}


/**
 * Xử lý chính: Parse 1 đường dẫn và chèn vào CSDL
 */
async function processR2Key(r2File) {
    const r2Key = r2File.Key; // "Baby Children/Baby/Babies Tableware/00319526.jpg"

    if (!r2Key) return;

    // Lọc file: Chỉ xử lý file ảnh, bỏ qua file .txt
    const ext = path.extname(r2Key).toLowerCase();
    if (ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png' && ext !== '.webp') {
        console.warn(`Bỏ qua file không phải ảnh: ${r2Key}`);
        return;
    }

    // Phân tích đường dẫn
    const parts = r2Key.split('/');
    if (parts.length < 3) { // Phải có C1/C2/filename.jpg
        console.warn(`Đường dẫn không hợp lệ, bỏ qua: ${r2Key}`);
        return;
    }

    // Trích xuất thông tin
    const filename = parts[parts.length - 1]; // "00319526.jpg"
    const original_id = filename.split('.')[0]; // "00319526"
    const category1_name = parts[0]; // "Baby Children" (Giả định là STYLE)
    const category2_name = parts[1]; // "Baby" (Giả định là ROOM_TYPE)
    const category3_name = parts[parts.length - 2]; // "Babies Tableware" (Giả định là PRODUCT_TYPE)

    console.log(`\nĐang xử lý: ${original_id} (${category3_name})`);

    try {
        // --- 1. Xử lý Categories ---
        const cat1_id = await getOrCreateCategory(category1_name, 'STYLE');
        const cat2_id = await getOrCreateCategory(category2_name, 'ROOM_TYPE', cat1_id);
        const cat3_id = await getOrCreateCategory(category3_name, 'PRODUCT_TYPE', cat2_id);

        // --- 2. Tạo Product (mẹ) ---
        // (Giả định: 'name' sản phẩm là tên category cuối)
        const product_name = category3_name;

        // Lấy hoặc tạo Product
        let { data: product } = await supabase
            .from('products')
            .select('id')
            .eq('name', product_name)
            .maybeSingle();

        if (!product) {
            console.log(` -> Tạo Product (mẹ): ${product_name}`);
            let { data: newProduct, error: pError } = await supabase
                .from('products')
                .insert({
                    name: product_name,
                    category_id: cat3_id
                })
                .select('id')
                .single();
            if (pError) throw new Error(`Lỗi tạo Product: ${pError.message}`);
            product = newProduct;
        }
        const product_id = product.id;


        // --- 3. Tạo Product Variant (THEO LOGIC MỚI) ---
        // (Giả định: 1 ảnh = 1 variant)
        const variant_name = `${product_name} ${original_id}`;
        const sku = generateSKU(product_name, original_id);
        const price = generatePrice();

        const { data: variant, error: vError } = await supabase
            .from('product_variants')
            .insert({
                product_id: product_id,
                sku: sku,
                original_id: original_id,
                name: variant_name,
                price: price,
                currency: 'VND',
                stock_qty: 1
            })
            .select('id')
            .single();
        if (vError) {
            if (vError.code === '23505') { // Lỗi 'unique constraint' (đã tồn tại)
                console.warn(` -> Variant ${original_id} đã tồn tại, bỏ qua.`);
                return; // Bỏ qua file này vì đã xử lý rồi
            }
            throw new Error(`Lỗi tạo Variant: ${vError.message}`);
        }
        const variant_id = variant.id;

        // --- 4. Tạo 'files' (Metadata R2) (THEO LOGIC MỚI) ---
        const { data: file, error: fError } = await supabase
            .from('files')
            .insert({
                bucket_id: R2_BUCKET_NAME,
                path_key: r2Key,
                mime_type: r2File.Key.endsWith('.jpg') ? 'image/jpeg' : 'image/png',
                size_bytes: r2File.Size,
                // owner_id: null (chưa biết ai upload)
                // embedding: null (sẽ chạy sau)
                // thumbnails_json: null (sẽ chạy sau)
            })
            .select('id')
            .single();
        if (fError) {
            if (fError.code === '23505') { // Lỗi 'unique constraint' (đã tồn tại)
                console.warn(` -> File ${r2Key} đã tồn tại trong CSDL, bỏ qua.`);
                return;
            }
            throw new Error(`Lỗi tạo File: ${fError.message}`);
        }
        const file_id = file.id;

        // --- 5. Liên kết 'product_images' ---
        const { error: piError } = await supabase
            .from('product_images')
            .insert({
                variant_id: variant_id,
                file_id: file_id,
                is_primary: true // Giả định ảnh đầu tiên là ảnh chính
            });
        if (piError) throw new Error(`Lỗi tạo Product Image: ${piError.message}`);

        console.log(` -> Thành công: ${original_id} (SKU: ${sku}, Giá: ${price}) đã được chèn.`);

    } catch (error) {
        console.error(`*** Xảy ra lỗi khi xử lý ${r2Key}: ${error.message} ***`);
    }
}

/**
 * Hàm Main để chạy
 */
async function main() {
    if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY || !R2_ENDPOINT) {
        console.error("Thiếu các biến môi trường. Vui lòng kiểm tra file .env");
        return;
    }

    const allFiles = await listAllFiles(R2_BUCKET_NAME);

    if (allFiles.length === 0) {
        console.error("Không tìm thấy file nào trong R2 bucket.");
        return;
    }

    console.log(`--- Bắt đầu xử lý ${allFiles.length} files ---`);

    // Chạy tuần tự (for...of) để tránh quá tải CSDL
    for (const file of allFiles) {
        await processR2Key(file);
    }

    console.log("--- Hoàn tất xử lý ---");
}

main().catch(console.error);