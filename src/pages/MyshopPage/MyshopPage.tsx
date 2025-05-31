import React from 'react'
import { Outlet, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import ShopAdminHeader from '../../components/header/ShopAdminHeader'
import ProductPage from '../../components/Myshop/Product/ProductPage'
import CreateProduct from '../../components/Myshop/Product/Create/CreateProduct'
import OrderPage from '../../components/Myshop/Order/OrderPage'
import OrderDetailComp from '../../components/Myshop/Order/OrderDetail/OrderDetail'

const MyshopPage = () => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <div className="min-h-screen flex flex-col">
      <ShopAdminHeader />
      
      <div className="flex-1 bg-gray-50">
        <Routes>
          <Route index element={<Navigate to="/myshop/dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="sale" element={<div>Sales Overview</div>} />
          <Route path="products" element={<ProductPage />} />
          <Route path="product/create" element={<CreateProduct />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/details/:id" element={<OrderDetailComp />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default MyshopPage