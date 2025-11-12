-- 1. TẠO BẢNG 'profiles'
-- Bảng này sẽ lưu trữ dữ liệu bổ sung cho 'auth.users'
CREATE TABLE public.profiles (
  -- 'id' là khóa chính VÀ là khóa ngoại tham chiếu đến 'auth.users'
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Các cột tùy chỉnh của bạn dựa trên thiết kế 'app_users'
  name TEXT,
  avatar_url TEXT, -- Đổi tên từ 'avatar' cho rõ nghĩa
  role TEXT NOT NULL DEFAULT 'user', -- 'role' rất quan trọng cho phân quyền
  status TEXT NOT NULL DEFAULT 'active', -- 'status' cho nghiệp vụ của bạn
  
  -- Các cột timestamp riêng cho profile (nên có)
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Ghi chú: Kích hoạt RLS ngay lập tức
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

---
-- 2. TẠO RLS (QUY TẮC BẢO MẬT)
-- Rất quan trọng: Mặc định không ai được làm gì
-- Cho phép mọi người đọc profile (nếu ứng dụng của bạn public)
CREATE POLICY "Public profiles are viewable by everyone."
  ON public.profiles FOR SELECT USING (true);

-- Cho phép người dùng tự tạo profile của mình
CREATE POLICY "Users can insert their own profile."
  ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);

-- Cho phép người dùng tự cập nhật profile của mình
CREATE POLICY "Users can update their own profile."
  ON public.profiles FOR UPDATE USING (auth.uid() = id);

---
-- 3. HÀM TỰ ĐỘNG CẬP NHẬT 'updated_at'
-- Tạo một hàm để tự động cập nhật cột 'updated_at'
CREATE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng 'profiles'
CREATE TRIGGER on_profile_updated
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

---
-- 4. HÀM TỰ ĐỘNG TẠO PROFILE KHI ĐĂNG KÝ
-- Tạo một hàm để sao chép user từ 'auth.users' sang 'public.profiles'
CREATE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data->>'name', -- Lấy 'name' từ metadata lúc đăng ký
    NEW.raw_user_meta_data->>'avatar_url' -- Lấy 'avatar_url' từ metadata lúc đăng ký
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Gắn trigger vào bảng 'auth.users'
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();