import React, { Suspense } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Footer } from '../../components/Footer/Footer';
import { Header } from '../../components/header/Header';

const CartPage = React.lazy(() => import('../../components/User/Cart/CartPage'));
const CategoryPage = React.lazy(() => import('../../components/User/CategoryPage/CategoryPage'));
const CheckoutPage = React.lazy(() => import('../../components/User/Checkout/CheckoutPage'));
const FilterProductPage = React.lazy(() => import('../../components/User/FilterProduct/FilterProductPage'));
const HomePage = React.lazy(() => import('../../components/User/HomePage/HomePage'));
const ListProduct = React.lazy(() => import('../../components/User/HomePage/Products/ListProduct'));
const ProductDetailPage = React.lazy(() => import('../../components/User/ProductDetail/ProductDetailPage'));
const SettingPage = React.lazy(() => import('../../components/User/Setting.tsx/SettingPage'));
const ShopPage = React.lazy(() => import('../../components/User/Shop/ShopPage'));

const UserPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <Suspense fallback={<div>Đang tải trang...</div>}>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/products" element={<ListProduct />} />
            <Route path="/products/:slug" element={<ProductDetailPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/carts" element={<CartPage />} />
            <Route path="/settings/*" element={<SettingPage />} />
            <Route path="/search" element={<FilterProductPage />} />
            <Route path="/category/:slug" element={<CategoryPage />} />
            <Route path="/shop/:slug" element={<ShopPage />} />
          </Routes>
        </Suspense>
      </div>
      <Footer />
    </div>
  )
}

export default UserPage;