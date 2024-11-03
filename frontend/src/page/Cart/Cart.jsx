import React from 'react'
import CartItem from './components/CartItem';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import { useState, useEffect } from 'react';
import axios from 'axios';

const Cart = () => {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
      const fetchCartItems = async () => {
          try {
              const storedItems = JSON.parse(localStorage.getItem('cartItems')) || [];
              const itemsWithDetails = await Promise.all(
                  storedItems.map(async (item) => {
                      const response = await axios.get(`http://localhost:9000/api/products/${item.productId}`);
                      return {
                          ...response.data,
                          quantity: item.quantity
                      };
                  })
              );
              setCartItems(itemsWithDetails);
          } catch (err) {
              setError('Không thể tải thông tin giỏ hàng');
              console.error('Error:', err);
          } finally {
              setLoading(false);
          }
      };

      fetchCartItems();
  }, []);

  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  if (loading) return <div className="min-h-screen pt-24 text-center">Đang tải...</div>;
  if (error) return <div className="min-h-screen pt-24 text-center text-red-500">{error}</div>;

  return (
      <div>
          <Navbar/>
          <div className="min-h-screen bg-gray-100 pt-24 flex justify-center items-start p-4">
              <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-2xl">
                  <h1 className="text-2xl font-semibold mb-6">Giỏ hàng</h1>
                  
                  {cartItems.length === 0 ? (
                      <div className="text-center py-4">Giỏ hàng trống</div>
                  ) : (
                      <>
                          {cartItems.map((item) => (
                              <CartItem key={item.id} item={item} />
                          ))}
                          
                          <div className="flex justify-between items-center mt-6 border-t pt-4">
                              <p className="text-lg font-medium">Tổng tiền</p>
                              <p className="text-lg font-medium text-indigo-600">
                                  {new Intl.NumberFormat('vi-VN', { 
                                      style: 'currency', 
                                      currency: 'VND' 
                                  }).format(subtotal)}
                              </p>
                          </div>

                          <button className="mt-6 bg-indigo-600 text-white py-3 px-6 rounded-md w-full text-center hover:bg-indigo-700 transition-colors">
                              Thanh toán
                          </button>
                      </>
                  )}

                  <div className="mt-4 text-center">
                      <a href="/" className="text-indigo-600 hover:text-indigo-800">
                          ← Tiếp tục mua sắm
                      </a>
                  </div>
              </div>
          </div>
          <Footer/>   
      </div>
  );
};

export default Cart;

