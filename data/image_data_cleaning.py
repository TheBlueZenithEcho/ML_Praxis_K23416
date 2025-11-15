import json
import os
import re

def parse_ikea_text_simple(content):
    """
    Phân tích file text lộn xộn và trả về một dict theo ID.
    (Hàm này giữ nguyên như cũ, dùng để đọc file .txt)
    """
    products = {}
    current_id = None
    package_data = {}
    package_list = []
    
    id_regex = re.compile(r'^(\d{8})$')
    lines = content.split('\n')
    
    for line in lines:
        line = line.strip()
        if "----------------------------------" in line:
            if current_id and package_list:
                products[current_id] = package_list
            current_id = None
            package_list = []
            continue

        match = id_regex.match(line)
        if match:
            if current_id and package_list:
                products[current_id] = package_list
            current_id = line
            package_list = [] 
            package_data = {} 
            continue

        if not current_id: continue
        if "Package Number:" in line:
            if package_data:
                package_list.append(package_data)
            package_data = {}
        
        if ":" in line:
            try:
                key, value = line.split(':', 1)
                key = key.strip().replace(" ", "_").lower()
                value = value.strip()
                package_data[key] = value
            except ValueError: pass
    
    if current_id:
        if package_data:
            package_list.append(package_data)
        if package_list:
            products[current_id] = package_list
            
    return products

# --- SCRIPT CHÍNH (CHẠY Ở LOCAL) ---

# 1. Đặt đường dẫn đến thư mục gốc chứa ảnh VÀ file .txt
# (ví dụ: Desktop/NoiThat/Sofa/, Desktop/NoiThat/Ban/)
IMAGE_ROOT_FOLDER = "Desktop/NoiThat" 
# 2. Nơi lưu file metadata.jsonl SẠCH
OUTPUT_FOLDER = "Desktop/Metadata_Clean" 
os.makedirs(OUTPUT_FOLDER, exist_ok=True)

print("Bắt đầu quét ảnh và file .txt...")

# 3. Duyệt qua các thư mục con (Sofa, Ban, Ghe...)
for category_name in os.listdir(IMAGE_ROOT_FOLDER):
    category_dir = os.path.join(IMAGE_ROOT_FOLDER, category_name)
    
    if not os.path.isdir(category_dir):
        continue

    print(f"\n--- Đang xử lý Category: {category_name} ---")
    
    # 4. Tìm và Parse file .txt (chỉ 1 lần)
    parsed_metadata = {}
    for file in os.listdir(category_dir):
        if file.lower().endswith('.txt'):
            txt_path = os.path.join(category_dir, file)
            try:
                with open(txt_path, 'r', encoding='utf-8') as f:
                    metadata_content = f.read()
                parsed_metadata = parse_ikea_text_simple(metadata_content)
                print(f"  Đã parse file: {file} (Tìm thấy {len(parsed_metadata)} mục metadata)")
                break # Giả sử chỉ có 1 file txt mỗi thư mục
            except Exception as e:
                print(f"  [LỖI] Không thể đọc file txt: {txt_path}. Lỗi: {e}")

    # 5. Chuẩn bị file output .jsonl
    # File này sẽ được tải lên R2 với tên 'metadata.jsonl'
    output_jsonl_path = os.path.join(OUTPUT_FOLDER, f"{category_name}_metadata.jsonl")
    
    image_count = 0
    entries_with_meta = 0
    entries_without_meta = 0

    with open(output_jsonl_path, 'w', encoding='utf-8') as f_out:
        # 6. Quét tất cả file ảnh trong thư mục
        for file in os.listdir(category_dir):
            if file.lower().endswith(('.png', '.jpg', '.jpeg', '.webp')):
                image_count += 1
                
                # Lấy ID từ tên file ảnh (ví dụ: 40084861)
                img_id = os.path.splitext(file)[0]
                
                # 7. Lấy package_info (Giải quyết Vấn đề 2)
                # Dùng .get() sẽ trả về 'None' nếu không tìm thấy ID trong file txt
                package_info = parsed_metadata.get(img_id) 
                
                if package_info:
                    entries_with_meta += 1
                else:
                    entries_without_meta += 1 # Đây là các ảnh bị thiếu metadata

                # 8. Tạo JSON line (Giải quyết Vấn đề 1 & 2)
                json_line = {
                    "id": img_id,
                    "category": category_name, # <-- VĐ 1: Thêm category
                    "package_info": package_info # <-- VĐ 2: Sẽ là 'null' nếu thiếu
                }
                f_out.write(json.dumps(json_line, ensure_ascii=False) + '\n')

    print(f"  Hoàn tất: {output_jsonl_path}")
    print(f"  Tổng cộng: {image_count} ảnh.")
    print(f"  - {entries_with_meta} ảnh có metadata.")
    print(f"  - {entries_without_meta} ảnh BỊ THIẾU metadata.")

print(f"\nQUÁ TRÌNH HOÀN TẤT. Vui lòng tải các file .jsonl trong '{OUTPUT_FOLDER}' lên R2.")
print("Ví dụ: Tải 'Sofa_metadata.jsonl' lên R2 với tên 'Sofa/metadata.jsonl'")