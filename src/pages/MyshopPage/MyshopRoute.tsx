import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import { fetchCurrentUser } from '../../store/authSlice';


const ShopAdminHeader = lazy(() => import('../../components/header/ShopAdminHeader'));
const MessagePage = lazy(() => import('../../components/Myshop/Message/MessagePage'));
const OrderDetailComp = lazy(() => import('../../components/Myshop/Order/OrderDetailPage'));
const OrderPage = lazy(() => import('../../components/Myshop/Order/OrderPage'));
const CreateProduct = lazy(() => import('../../components/Myshop/Product/Create/CreateProduct'));
const ProductForm = lazy(() => import('../../components/Myshop/Product/Create/CreateProduct'));
const ProductPage = lazy(() => import('../../components/Myshop/Product/ProductPage'));
const Setting = lazy(() => import('../../components/Myshop/Setting/SettingPage'));
const OrderShippingPage = lazy(() => import('../../components/Myshop/Order/OrderShippingPage'));

const MyshopPage = () => {
  const { user, isAuthenticated } = useAppSelector((state) => state.auth);
  const useDispatch = useAppDispatch();
  useEffect(() => {
    console.log(isAuthenticated)
    if (!isAuthenticated && !user) {
      useDispatch(fetchCurrentUser());
    }
  }, [useDispatch, isAuthenticated]);


  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div></div>}>
        <ShopAdminHeader />
      </Suspense>

      <div className="flex-1 bg-gray-50">
        {/* <Suspense fallback={<div>Loading...</div>}> */}
        <Routes>
          <Route index element={<Navigate to="/myshop/dashboard" replace />} />
          <Route path="dashboard" element={<div>Dashboard Content</div>} />
          <Route path="sale" element={<div>Sales Overview</div>} />
          <Route path="products" element={<ProductPage />} />
          <Route path="products/create" element={<CreateProduct />} />
          <Route path="products/edit/:id" element={<ProductForm />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:shopOrderId" element={<OrderDetailComp />} />
          <Route path="orders/shipping" element={<OrderShippingPage />} />
          <Route path="messages" element={<MessagePage />} />
          <Route path="settings" element={<Setting />} />
          <Route path="*" element={<div>Page not found</div>} />
        </Routes>
        {/* </Suspense> */}
      </div>
    </div>
  );
};

export default MyshopPage;