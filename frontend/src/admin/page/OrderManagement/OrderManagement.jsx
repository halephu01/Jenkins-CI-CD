import React, { useState, useEffect} from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const OrderManagement = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get('http://localhost:9000/api/orders', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            setOrders(response.data);
            setLoading(false);
        } catch (error) {
            setError('Không thể tải danh sách kho hàng');
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem('token');
            await axios.delete(`http://localhost:9000/api/orders/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            fetchOrders();
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="text-red-500">{error}</div>;

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Quản lý kho hàng</h2>
            </div>
            <div className="bg-white rounded-lg shadow-md">
                <table className="min-w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Id</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã SP</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Mã Đặt hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Giá</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Số lượng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Ngày đặt hàng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                        {orders.map((item) => (
                            <tr key={item.orderNumber}>
                                <td className="px-6 py-4">{item.id}</td>
                                <td className="px-6 py-4">{item.skuCode}</td>
                                <td className="px-6 py-4">{item.orderNumber}</td>
                                <td className="px-6 py-4">{item.price}</td>
                                <td className="px-6 py-4">{item.quantity}</td>
                                <td className="px-6 py-4">{item.orderDate}</td>
                                <td className="px-6 py-4">
                                    <button
                                    onClick={() => navigate(`/admin/orders/${item.orderNumber}`)}
                                    className="text-indigo-600 hover:text-indigo-900 mr-3">Sửa</button>
                                    <button 
                                        className="text-red-600 hover:text-red-900"
                                        onClick={() => handleDelete(item.orderNumber)}
                                    >
                                        Xóa
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default OrderManagement;