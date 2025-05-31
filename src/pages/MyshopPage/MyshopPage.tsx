import React from 'react'
import { Outlet, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ShopAdminHeader from '../../components/header/ShopAdminHeader'
import ProductPage from '../../components/Myshop/Product/ProductPage'
import CreateProduct from '../../components/Myshop/Product/Create/CreateProduct'

const MyshopPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      <ShopAdminHeader />
      
      <div className="flex-1 bg-gray-50">
        <Routes>
          {/* Default redirect to dashboard when accessing /myshop */}
          <Route index element={<Navigate to="/myshop/dashboard" replace />} />
          
          {/* Dashboard route */}
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          
          {/* Sales routes */}
          <Route path="sale" element={<div>Sales Overview</div>} />
          
          {/* Product routes */}
          <Route path="products" element={<ProductPage />} />
          <Route path="product/create" element={<CreateProduct />} />
          
          {/* Fallback for undefined routes */}
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default MyshopPage