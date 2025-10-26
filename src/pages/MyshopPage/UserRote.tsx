import { lazy, useEffect } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import LandingPage from '../../components/User/LandingPage/LandingPage';
import { APP_ROUTES } from '../../constant';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import { fetchCurrentUser } from '../../store/authSlice';

const CartPage = lazy(() => import('../../components/User/Cart/CartPage'));
const CategoryPage = lazy(() => import('../../components/User/CategoryPage/CategoryPage'));
const CheckoutPage = lazy(() => import('../../components/User/Checkout/CheckoutPage'));
const FilterProductPage = lazy(() => import('../../components/User/FilterProduct/FilterProductPage'));
// const HomePage = lazy(() => import('../../components/User/HomePage/HomePage'));
// const ListProduct = lazy(() => import('../../components/User/HomePage/Products/ListProduct'));
const ProductDetailPage = lazy(() => import('../../components/User/ProductDetail/ProductDetailPage'));
const SettingPage = lazy(() => import('../../components/User/Setting.tsx/SettingPage'));
const ShopPage = lazy(() => import('../../components/User/Shop/ShopPage'));
const PaymentResultPage = lazy(() => import('../../components/User/paymentResult/PaymentResultPage'));
const RegisterShopPage = lazy(() => import('../../components/User/RegisterShopPage/RegisterShopPage'));

const UserPage = () => {
  const { user, isAuthenticated, shop } = useAppSelector((state) => state.auth);
  const dispatch = useAppDispatch();
  useEffect(() => {
    if (!isAuthenticated && !user) {
      console.log('User not authenticated. Fetching current user...');
      dispatch(fetchCurrentUser());
    }
  }, [dispatch, isAuthenticated, user, shop]);

  return (
    <div className="min-h-screen flex flex-col">
      {/* {navigate.pathname !== APP_ROUTES.HOME && <Header />} */}
      <div className="flex-1 bg-gray-50">
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Routes>
          <Route path="/" element={<LandingPage />} />
          {/* <Route path={APP_ROUTES.HOME} element={<HomePage />} /> */}
          {/* <Route path="/products" element={<ListProduct />} /> */}
          <Route path={APP_ROUTES.PRODUCT_DETAIL} element={<ProductDetailPage />} />
          <Route path={APP_ROUTES.CHECKOUT} element={<CheckoutPage />} />
          <Route path={APP_ROUTES.CART} element={<CartPage />} />
          <Route path={APP_ROUTES.USER_SETTINGS} element={<SettingPage />} />
          <Route path="/search" element={<FilterProductPage />} />
          <Route path="/category/:slug" element={<CategoryPage />} />
          <Route path="/shop/:slug" element={<ShopPage />} />
          <Route path={APP_ROUTES.PAYMENT_RESULT(':orderId')} element={<PaymentResultPage />} />
          <Route path={APP_ROUTES.SHOP_REGISTER} element={<RegisterShopPage />} />
        </Routes>
        {/* </Suspense> */}
      </div>
      {/* <Footer /> */}
    </div>
  );
};

export default UserPage;