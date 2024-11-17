import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const ProductEdit = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [files, setFiles] = useState([]);
    const [product, setProduct] = useState({
        name: '',
        description: '',
        price: '',
        skuCode: '',
        type: '',
        imageUrl: []
    });

    useEffect(() => {
        fetchProduct();
    }, [id]);

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:9000/api/products/${id}`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setProduct(response.data);
            setLoading(false);
        } catch (error) {
            toast.error('Không thể tải thông tin sản phẩm');
            setLoading(false);
        }
    };

    const handleChange = (e) => {
        setProduct(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleImageUpload = async () => {
        try {
            const list = await Promise.all(
                Object.values(files).map(async (file) => {
                    const data = new FormData();
                    data.append("file", file);
                    data.append("upload_preset", "upload");
                    const uploadRes = await axios.post(
                        "https://api.cloudinary.com/v1_1/amiby/image/upload",
                        data
                    );
                    const { url } = uploadRes.data;
                    return url;
                })
            );
            return list;
        } catch (error) {
            console.error('Error uploading images:', error);
            throw error;
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            let updatedProduct = { ...product };

            if (files.length > 0) {
                const imageUrls = await handleImageUpload();
                updatedProduct.imageUrl = imageUrls;
            }

            await axios.put(`http://localhost:9000/api/products/${id}`, updatedProduct, {
                headers: { Authorization: `Bearer ${token}` }
            });
            toast.success('Cập nhật sản phẩm thành công!');
            navigate('/admin/products');
        } catch (error) {
            toast.error('Cập nhật sản phẩm thất bại!');
        }
    };

    if (loading) return <div>Đang tải...</div>;

    return (
        <div className="max-w-2xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6">Chỉnh sửa sản phẩm</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tên sản phẩm</label>
                    <input
                        type="text"
                        name="name"
                        value={product.name}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mã sản phẩm</label>
                    <input
                        type="text"
                        name="skuCode"
                        value={product.skuCode}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                        disabled
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Mô tả</label>
                    <textarea
                        name="description"
                        value={product.description}
                        onChange={handleChange}
                        rows={3}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Giá</label>
                    <input
                        type="number"
                        name="price"
                        value={product.price}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Loại</label>
                    <select
                        name="type"
                        value={product.type}
                        onChange={handleChange}
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                        required
                    >
                        <option value="">Chọn loại sản phẩm</option>
                        <option value="laptop">Laptop</option>
                        <option value="pc">PC - Máy tính bàn</option>
                        <option value="monitor">Màn hình máy tính</option>
                        <option value="pc-components">Linh kiện máy tính</option>
                        <option value="pc-accessories">Phụ kiện máy tính</option>
                        <option value="gear">Gaming Gear</option>
                        <option value="phone">Điện thoại</option>
                        <option value="phone-accessories">Linh kiện điện thoại</option>
                        <option value="audio">Thiết bị âm thanh</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Hình ảnh hiện tại</label>
                    <div className="grid grid-cols-3 gap-4 mt-2">
                        {product.imageUrl.map((url, index) => (
                            <img key={index} src={url} alt={`Product ${index + 1}`} className="w-full h-32 object-cover rounded" />
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm font-medium text-gray-700">Thêm hình ảnh mới</label>
                    <input
                        type="file"
                        multiple
                        onChange={(e) => setFiles(e.target.files)}
                        className="mt-1 block w-full"
                    />
                </div>
                <div className="flex justify-end space-x-3">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
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

export default ProductEdit;