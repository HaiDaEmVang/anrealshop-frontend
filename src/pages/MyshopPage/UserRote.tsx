import { Route, Routes } from 'react-router-dom'
import { Header } from '../../components/header/Header'
import { Footer } from '../../components/Footer/Footer'
import ProductDetailPage from '../../components/User/ProductDetail/ProductDetailPage'
import HomePage from '../../components/User/HomePage/HomePage'
import ListProduct from '../../components/User/HomePage/Products/ListProduct'
import CheckoutPage from '../../components/User/Checkout/CheckoutPage'
import CartPage from '../../components/User/Cart/CartPage'

const UserPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <div className="flex-1 bg-gray-50">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/products" element={<ListProduct />} />
          <Route path="/products/:slug" element={<ProductDetailPage />} />
          <Route path="/category/:categoryId" element={<ListProduct />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/carts" element={<CartPage />} />
        </Routes>
      </div>
      <Footer />
    </div>
  )
}

export default UserPage