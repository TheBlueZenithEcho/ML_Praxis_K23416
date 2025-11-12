// Tên file: app.js

// --- HÃY DÁN URL VÀ KEY CỦA BẠN VÀO ĐÂY ---
const SUPABASE_URL = 'https://ygukbzzjaonbijhfillc.supabase.co'; // Thay bằng URL của bạn
const SUPABASE_ANON_KEY = '_anon_key_on_google_sheet_ML|TASK';   // Thay bằng Key của bạn

// Khởi tạo Supabase client
// (File HTML đã tải thư viện qua CDN, nên ta có thể dùng `supabase.createClient`)
const { createClient } = supabase;
const supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Lấy các phần tử DOM ---
const signupForm = document.getElementById('signup-form');
const loginForm = document.getElementById('login-form');
const messageBoard = document.getElementById('message-board');

// --- Hàm hiển thị thông báo ---
function showMessage(message, isError = false) {
    messageBoard.textContent = message;
    messageBoard.className = isError ? 'error' : 'success';
}

// --- 1. XỬ LÝ ĐĂNG KÝ (SIGN UP) ---
signupForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn form tự gửi đi

    // Lấy giá trị từ form đăng ký
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;

    showMessage('Đang xử lý...', false);

    // Dùng Supabase để Đăng Ký
    const { data, error } = await supabaseClient.auth.signUp({
        email: email,
        password: password,
        options: {
            // Đây là phần quan trọng để trigger của bạn hoạt động!
            // Supabase sẽ lưu 'name' vào 'raw_user_meta_data'
            data: { 
                name: name 
            }
        }
    });

    if (error) {
        showMessage('Lỗi đăng ký: ' + error.message, true);
    } else {
        // Mặc định, Supabase sẽ gửi email xác thực
        // Bạn cần vào Dashboard -> Auth -> Providers -> Email và TẮT "Confirm email"
        // nếu muốn đăng nhập ngay lập tức khi test.
        showMessage('Đăng ký thành công! Vui lòng kiểm tra email (hoặc đăng nhập nếu bạn đã tắt xác thực).', false);
        console.log('Đăng ký thành công:', data);
    }
});

// --- 2. XỬ LÝ ĐĂNG NHẬP (LOGIN) ---
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); // Ngăn form tự gửi đi

    // Lấy giá trị từ form đăng nhập
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    showMessage('Đang xử lý...', false);

    // Dùng Supabase để Đăng Nhập
    const { data, error } = await supabaseClient.auth.signInWithPassword({
        email: email,
        password: password,
    });

    if (error) {
        showMessage('Lỗi đăng nhập: ' + error.message, true);
    } else {
        showMessage('Đăng nhập thành công! Chào mừng trở lại.', false);
        console.log('Đăng nhập thành công:', data.user);
        // data.user.id chính là 'id' liên kết với bảng 'profiles'
    }
});