import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import axios from 'axios';

const Profile = () => {
  const [userInfo, setUserInfo] = useState({
    username: '',
    email: '',
    firstName: '',
    lastName: '',
    phone: '',
    address: ''
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:9000/api/users/myinfo', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserInfo(response.data.result);
    } catch (error) {
      setError('Không thể tải thông tin người dùng');
    }
  };

  const handleChange = (e) => {
    setUserInfo({
      ...userInfo,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      delete userInfo.roles
      delete userInfo.username

      await axios.put('http://localhost:9000/api/users/myinfo', userInfo, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setSuccess('Cập nhật thông tin thành công!');
      setIsEditing(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      setError('Cập nhật thông tin thất bại');
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <div className="flex-grow container mx-auto px-4 py-8 pt-24">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md">
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-2xl font-bold text-gray-800">Thông tin cá nhân</h1>
              {!isEditing && (
                <button
                  onClick={() => setIsEditing(true)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Chỉnh sửa
                </button>
              )}
            </div>

            {error && (
              <div className="bg-red-100 text-red-700 p-3 rounded mb-4">
                {error}
              </div>
            )}

            {success && (
              <div className="bg-green-100 text-green-700 p-3 rounded mb-4">
                {success}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tên đăng nhập
                  </label>
                  <input
                    type="text"
                    name="username"
                    value={userInfo.username}
                    disabled
                    className="w-full px-3 py-2 border rounded-lg bg-gray-100"
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={userInfo.email}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      !isEditing ? 'bg-gray-100' : 'focus:outline-none focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Họ
                  </label>
                  <input
                    type="text"
                    name="firstName"
                    value={userInfo.firstName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      !isEditing ? 'bg-gray-100' : 'focus:outline-none focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Tên
                  </label>
                  <input
                    type="text"
                    name="lastName"
                    value={userInfo.lastName}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      !isEditing ? 'bg-gray-100' : 'focus:outline-none focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={userInfo.phone}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      !isEditing ? 'bg-gray-100' : 'focus:outline-none focus:border-blue-500'
                    }`}
                  />
                </div>

                <div>
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Địa chỉ
                  </label>
                  <input
                    type="text"
                    name="address"
                    value={userInfo.address}
                    onChange={handleChange}
                    disabled={!isEditing}
                    className={`w-full px-3 py-2 border rounded-lg ${
                      !isEditing ? 'bg-gray-100' : 'focus:outline-none focus:border-blue-500'
                    }`}
                  />
                </div>
              </div>

              {isEditing && (
                <div className="flex justify-end gap-4 mt-6">
                  <button
                    type="button"
                    onClick={() => {
                      setIsEditing(false);
                      fetchUserInfo(); // Reset form
                    }}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    Hủy
                  </button>
                  <button
                    type="submit"
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Lưu thay đổi
                  </button>
                </div>
              )}
            </form>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Profile;