import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Sidebar from '../../components/SideBar';
import ProductManagement from '../ProductManagement/ProductManagement';
import InventoryManagement from '../InventoryManagement/InventoryManagement';
import UserManagement from '../UserManagement/UserManagement';
import OrderManagement from '../OrderManagement/OrderManagement';
import InventoryEdit from '../InventoryManagement/InventoryEdit';
import UserEdit from '../UserManagement/UserEdit';
import CreateProduct from '../ProductManagement/CreateProduct';
import ProductEdit from '../ProductManagement/ProductEdit';
import OrderEdit from '../OrderManagement/OrderEdit';
const AdminDashboard = () => {
    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 ml-64 p-8">
                <Routes>
                    <Route path="/" element={<Navigate to="/admin/products" replace />} />
                    <Route path="/products" element={<ProductManagement />} />
                    <Route path="/products/:id" element={<ProductEdit />} />
                    <Route path="/products/create" element={<CreateProduct />} />
                    <Route path="/inventory" element={<InventoryManagement />} />
                    <Route path="/inventory/:skuCode" element={<InventoryEdit />} />
                    <Route path="/users" element={<UserManagement />} /> 
                    <Route path="/users/:id" element={<UserEdit />} />
                    <Route path="/orders" element={<OrderManagement />} />
                    <Route path="/orders/:orderNumber" element={<OrderEdit />} />
                </Routes>
            </div>
        </div>
    );
};

export default AdminDashboard;