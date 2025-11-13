// Tên file: src/supabaseClient.js (hoặc đặt ở đâu bạn muốn)

import { createClient } from '@supabase/supabase-js';

// Dán URL và Key của bạn vào đây
const supabaseUrl = 'https://ygukbzzjaonbijhfillc.supabase.co'; // Thay bằng URL của bạn
const supabaseKey = '';   // Thay bằng Key của bạn

// Tạo ra một client để dùng chung trong toàn bộ ứng dụng
export const supabase = createClient(supabaseUrl, supabaseKey);