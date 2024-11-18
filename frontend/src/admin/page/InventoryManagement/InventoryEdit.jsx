import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const InventoryEdit = () => {
    const { skuCode } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [inventory, setInventory] = useState({
        skuCode: '',
        quantity: 0
    });

    useEffect(() => {
        fetchInventory();
    }, [skuCode]);

    const fetchInventory = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:9000/api/inventorys/${skuCode}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setInventory(response.data);
            console.log(skuCode)
            setLoading(false);
        } catch (error) {
            toast.error('Không thể tải thông tin kho hàng');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setInventory(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put(`http://localhost:9000/api/inventorys/${skuCode}`, inventory, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cập nhật thành công!');
            navigate('/admin/inventory');
        } catch (error) {
            toast.error('Cập nhật thất bại!');
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa kho hàng</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                    <input
                        type="text"
                        name="skuCode"
                        placeholder={inventory.skuCode}
                        value={inventory.skuCode}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Số lượng</label>
                    <input
                        type="number"
                        name="quantity"
                        placeholder={inventory.quantity}
                        value={inventory.quantity}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/inventory')}
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

export default InventoryEdit;