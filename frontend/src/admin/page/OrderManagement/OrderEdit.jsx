import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const OrderEdit = () => {
    const { orderNumber } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState({
        orderNumber: '',
        skuCode: '',
        price: 0,
        quantity: 0,
        orderDate: '',
    });

    useEffect(() => {
        fetchOrder();
    }, [orderNumber]);

    const fetchOrder = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:9000/api/orders/${orderNumber}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setOrder(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Không thể tải thông tin đơn hàng');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setOrder(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:9000/api/orders/${orderNumber}`, order, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cập nhật thành công!');
            navigate('/admin/orders');
        } catch (error) {
            toast.error('Cập nhật thất bại!');
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa đơn hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mã đơn hàng</label>
                    <input
                        type="text"
                        name="orderNumber"
                        value={order.orderNumber}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                    <input
                        type="text"
                        name="skuCode"
                        value={order.skuCode}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá</label>
                    <input
                        type="number"
                        name="price"
                        value={order.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                    <input
                        type="number"
                        name="quantity"
                        value={order.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Ngày đặt hàng</label>
                    <input
                        type="text"
                        name="orderDate"
                        value={order.orderDate}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/orders')}
                        className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                    >
                        Hủy
                    </button>
                    <button
                        type="submit"
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
                    >
                        Lưu
                    </button>
                </div>
            </form>
        </div>
    );
};

export default OrderEdit;