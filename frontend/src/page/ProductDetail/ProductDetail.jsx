import React, { useState, useEffect } from 'react'
import { useParams,useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAuth } from '../../contexts/AuthContext';

const ProductDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [activeImg, setActiveImage] = useState('');
    const [amount, setAmount] = useState(1);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await axios.get(`http://localhost:9000/api/products/${id}`);
                setProduct(response.data);
                if (response.data.imageUrl && response.data.imageUrl.length > 0) {
                    setActiveImage(response.data.imageUrl[0]);
                }
            } catch (err) {
                setError('Không thể tải thông tin sản phẩm');
                console.error('Error:', err);
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProduct();
        }
    }, [id]);

    if (loading) return <div className="pt-24 text-center">Đang tải...</div>;
    if (error) return <div className="pt-24 text-center text-red-500">{error}</div>;
    if (!product) return <div className="pt-24 text-center">Không tìm thấy sản phẩm</div>;

    const handleOrder = async () => {
        if (!user) {
            toast.error('Vui lòng đăng nhập để đặt hàng!', {
                position: "top-right",
                autoClose: 2000,
            });
            setTimeout(() => {
                navigate('/login');
            }, 2000);
            return;
        }
    
        try {
            const token = localStorage.getItem('token');
            
            // Lấy thông tin user
            const userResponse = await axios.get('http://localhost:9000/api/users/myinfo', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            
            const userInfo = {
                firstName: userResponse.data.result.firstName,
                lastName: userResponse.data.result.lastName,
                email: userResponse.data.result.email
            };
            console.log(userInfo);
            // Gửi order request
            await axios.post('http://localhost:9000/api/orders', {
                skuCode: product.skuCode,
                quantity: amount,
                price: product.price,
                userDetails: userInfo,
                orderDate: new Date().toISOString()
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
    
            toast.success('Đặt hàng thành công!', {
                position: "top-right",
                autoClose: 2000,
            });
            
        } catch (error) {
            console.error('Error:', error);
            toast.error('Đặt hàng thất bại!', {
                position: "top-right",
                autoClose: 2000,
            });
        }
    }

    return (
        <div className='pt-24 font-[Poppins]'>
            <ToastContainer />
            <Navbar/>
            <div className='flex flex-col justify-between lg:flex-row gap-16 lg:items-center px-8 md:px-24 mb-28'>
                <div className='flex flex-col gap-6 lg:w-2/4'>
                    <img 
                        src={activeImg} 
                        alt={product.name} 
                        className='w-full h-full aspect-square object-cover rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300'
                    />
                    <div className='flex flex-row justify-between h-24'>
                        {product.imageUrl.map((img, index) => (
                            <img 
                                key={index}
                                src={img} 
                                alt={`${product.name}-${index}`} 
                                className='w-24 h-24 rounded-md cursor-pointer shadow-md hover:shadow-lg transition-shadow duration-300' 
                                onClick={() => setActiveImage(img)}
                            />
                        ))}
                    </div>
                </div>

                {/* ABOUT */}
                <div className='flex flex-col gap-4 lg:w-2/4'>
                    <div>
                        <h1 className='text-3xl font-bold'>{product.name}</h1>
                        <span className='text-indigo-600 font-semibold text-xl block mt-4'>
                            {new Intl.NumberFormat('vi-VN', { 
                                style: 'currency', 
                                currency: 'VND' 
                            }).format(product.price)}
                        </span>
                    </div>
                    <p className='text-gray-700'>{product.description}</p>
                    <div className='flex flex-row items-center gap-12'>
                        <div className='flex flex-row items-center'>
                            <button 
                                className='bg-gray-200 py-2 px-5 rounded-lg text-indigo-800 text-3xl'
                                onClick={() => setAmount(prev => Math.max(prev - 1, 1))}
                            >
                                -
                            </button>
                            <span className='py-4 px-6 rounded-lg'>{amount}</span>
                            <button 
                                className='bg-gray-200 py-2 px-4 rounded-lg text-indigo-800 text-3xl'
                                onClick={() => setAmount(prev => prev + 1)}
                            >
                                +
                            </button>
                        </div>
                        <button className='bg-indigo-600 text-white font-semibold py-3 px-16 rounded-xl h-full'
                          onClick={handleOrder}
                        >
                            Đặt hàng
                        </button>
                    </div>
                </div>
            </div>
            <Footer/>
        </div>
    )
}

export default ProductDetail;