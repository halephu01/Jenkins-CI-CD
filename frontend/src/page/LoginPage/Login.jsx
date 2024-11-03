import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();
  const location = useLocation(); // Thêm này để lấy state message từ Register

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const result = await login(username, password);
      if (result.success) {
        if (result.role === 'ADMIN') {
          navigate('/admin');
        } else {
          navigate('/');
        }
      }
    } catch (err) {
      setError('Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100 pt-16">
        <div className="w-full max-w-md px-4">
          <div className="bg-white shadow-lg rounded-lg p-8">
            <div className="text-center mb-8">
              <span className="text-4xl text-indigo-600">
                <ion-icon name="laptop-outline"></ion-icon>
              </span>
              <h2 className="text-3xl font-bold text-gray-800 mt-2">Đăng nhập</h2>
            </div>

            {/* Hiển thị thông báo thành công từ trang đăng ký */}
            {location.state?.message && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {location.state.message}
              </div>
            )}

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}
            <form onSubmit={handleLogin}>
              {/* Form fields giữ nguyên */}
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Tên đăng nhập
                </label>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Mật khẩu
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border rounded-lg focus:outline-none focus:border-indigo-500"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 transition duration-200"
              >
                Đăng nhập
              </button>
            </form>

            {/* Thêm phần đăng ký */}
            <div className="mt-6 text-center">
              <p className="text-gray-600">
                Chưa có tài khoản?{' '}
                <Link
                  to="/register"
                  className="text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Đăng ký ngay
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;