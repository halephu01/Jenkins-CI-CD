import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
    const location = useLocation();
    
    const menuItems = [
        {
            path: '/admin/products',
            name: 'Sản phẩm',
            icon: 'laptop-outline'
        },
        {
            path: '/admin/inventory',
            name: 'Kho hàng',
            icon: 'cube-outline'
        },
        {
            path: '/admin/users',
            name: 'Người dùng',
            icon: 'people-outline'
        },
        {
            path: '/admin/orders',
            name: 'Đơn hàng',
            icon: 'cart-outline'
        }
    ];

    return (
        <div className="bg-white h-screen w-64 fixed left-0 top-0 shadow-md">
            <div className="p-4 border-b">
                <h2 className="text-2xl font-bold text-indigo-600 flex items-center">
                    <ion-icon name="settings-outline" class="mr-2"></ion-icon>
                    Quản trị
                </h2>
            </div>
            <nav className="p-4">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center p-3 mb-2 rounded-lg transition-colors
                            ${location.pathname === item.path 
                                ? 'bg-indigo-100 text-indigo-600' 
                                : 'hover:bg-gray-100'}`}
                    >
                        <ion-icon name={item.icon} class="text-xl mr-2"></ion-icon>
                        {item.name}
                    </Link>
                ))}
            </nav>
        </div>
    );
};

export default Sidebar;