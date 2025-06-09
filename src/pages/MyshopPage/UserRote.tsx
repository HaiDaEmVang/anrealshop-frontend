import { Route, Routes } from 'react-router-dom'
import { Footer } from '../../components/Footer/Footer'
import { Header } from '../../components/header/Header'
import CartPage from '../../components/User/Cart/CartPage'
import CategoryPage from '../../components/User/CategoryPage/CategoryPage'
import CheckoutPage from '../../components/User/Checkout/CheckoutPage'
import FilterProductPage from '../../components/User/FilterProduct/FilterProductPage'
import HomePage from '../../components/User/HomePage/HomePage'
import ListProduct from '../../components/User/HomePage/Products/ListProduct'
import ProductDetailPage from '../../components/User/ProductDetail/ProductDetailPage'
import SettingPage from '../../components/User/Setting.tsx/SettingPage'
import ShopPage from '../../components/User/Shop/ShopPage'

const UserPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
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
      </div>
      <Footer />
    </div>
  )
}

export default UserPage