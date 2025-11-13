import { createClient } from '@supabase/supabase-js';

// Đọc các biến môi trường (environment variables)
// Lưu ý: create-react-app dùng REACT_APP_, Vite dùng VITE_
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Kiểm tra xem biến đã được set chưa
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase URL and Anon Key must be provided.");
}

// Tạo và export client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);