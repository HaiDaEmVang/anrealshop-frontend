import React, { Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import ShopAdminHeader from '../../components/header/ShopAdminHeader';

const MessagePage = React.lazy(() => import('../../components/Myshop/Message/MessagePage'));
const OrderDetailComp = React.lazy(() => import('../../components/Myshop/Order/OrderDetail/OrderDetail'));
const OrderPage = React.lazy(() => import('../../components/Myshop/Order/OrderPage'));
const CreateProduct = React.lazy(() => import('../../components/Myshop/Product/Create/CreateProduct'));
const ProductPage = React.lazy(() => import('../../components/Myshop/Product/ProductPage'));
const Setting = React.lazy(() => import('../../components/Myshop/Setting/SettingPage'));

const DashboardContent = React.lazy(() => Promise.resolve({ default: () => <div>Dashboard Content</div> }));
const SalesOverview = React.lazy(() => Promise.resolve({ default: () => <div>Sales Overview</div> }));
const PageNotFound = React.lazy(() => Promise.resolve({ default: () => <div>Page not found</div> }));

const MyshopPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <ShopAdminHeader />
      
      <div className="flex-1 bg-gray-50">
        <Suspense fallback={<div>Đang tải trang...</div>}>
          <Routes>
            <Route index element={<Navigate to="/myshop/dashboard" replace />} />
            <Route path="dashboard" element={<DashboardContent />} />
            <Route path="sale" element={<SalesOverview />} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<CreateProduct />} />
            <Route path="orders" element={<OrderPage />} />
            <Route path="orders/:id" element={<OrderDetailComp />} />
            <Route path="messages" element={<MessagePage />} />
            <Route path="settings" element={<Setting />} />
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </div>
    </div>
  )
}

export default MyshopPage;