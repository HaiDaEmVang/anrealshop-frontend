import { Navigate, Route, Routes } from 'react-router-dom'
import ShopAdminHeader from '../../components/header/ShopAdminHeader'
import MessagePage from '../../components/Myshop/Message/MessagePage'
import OrderDetailComp from '../../components/Myshop/Order/OrderDetail/OrderDetail'
import OrderPage from '../../components/Myshop/Order/OrderPage'
import { default as CreateProduct, default as ProductForm } from '../../components/Myshop/Product/Create/CreateProduct'
import ProductPage from '../../components/Myshop/Product/ProductPage'
import Setting from '../../components/Myshop/Setting/SettingPage'

const MyshopPage = () => {

  return (
    <div className="min-h-screen flex flex-col">
      <ShopAdminHeader />
      
      <div className="flex-1 bg-gray-50">
        <Routes>
          <Route index element={<Navigate to="/myshop/dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="sale" element={<div>Sales Overview</div>} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:id" element={<OrderDetailComp />} />
          <Route path="messages" element={<MessagePage />} />
          <Route path="settings" element={<Setting />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
      </div>
    </div>
  )
}

export default MyshopPage