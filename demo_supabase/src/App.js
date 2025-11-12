// Tên file: src/Auth.js
import React, { useState } from 'react';
import { supabase } from './supabaseClient'; // Import client bạn vừa tạo

export default function Auth() {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState(''); // Thêm state cho 'name'

  // --- HÀM XỬ LÝ ĐĂNG KÝ (SIGN UP) ---
  const handleSignUp = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          // Đây là phần quan trọng để trigger của bạn hoạt động!
          // Dữ liệu này sẽ được lưu vào 'raw_user_meta_data'
          data: { 
            name: name,
            avatar_url: 'https://example.com/default-avatar.png' // Có thể thêm avatar mặc định
          }
        }
      });

      if (error) throw error;
      
      alert('Đăng ký thành công! Vui lòng kiểm tra email để xác thực.');

    } catch (error) {
      alert('Lỗi đăng ký: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- HÀM XỬ LÝ ĐĂNG NHẬP (LOGIN) ---
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) throw error;

      alert('Đăng nhập thành công!');
      // data.user.id chính là 'id' liên kết với bảng 'profiles'
      console.log('Thông tin user:', data.user);

    } catch (error) {
      alert('Lỗi đăng nhập: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- GIAO DIỆN (JSX) ---
  return (
    <div style={{ display: 'flex', gap: '50px', padding: '20px' }}>
      
      {/* --- FORM ĐĂNG KÝ --- */}
      <div>
        <h2>Đăng ký</h2>
        <form onSubmit={handleSignUp}>
          <input
            type="text"
            placeholder="Tên của bạn"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          /><br/>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br/>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br/>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang tải...' : 'Đăng ký'}
          </button>
        </form>
      </div>

      {/* --- FORM ĐĂNG NHẬP --- */}
      <div>
        <h2>Đăng nhập</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          /><br/>
          <input
            type="password"
            placeholder="Mật khẩu"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          /><br/>
          <button type="submit" disabled={loading}>
            {loading ? 'Đang tải...' : 'Đăng nhập'}
          </button>
        </form>
      </div>
    </div>
  );
}