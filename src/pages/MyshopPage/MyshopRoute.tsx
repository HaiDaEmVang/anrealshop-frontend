import { Suspense, lazy, useEffect } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
import showErrorNotification from '../../components/Toast/NotificationError';
import { APP_ROUTES } from '../../constant';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppRedux';
import { fetchCurrentShop } from '../../store/authSlice';
import OverlayLoading from '../../components/common/OverlayLoading';


const ShopAdminHeader = lazy(() => import('../../components/header/ShopAdminHeader'));
const MessagePage = lazy(() => import('../../components/Myshop/Message/MessagePage'));
// const OrderDetailComp = lazy(() => import('../../components/Myshop/Order/OrderDetailPage'));
const OrderPage = lazy(() => import('../../components/Myshop/Order/OrderPage'));
const CreateProduct = lazy(() => import('../../components/Myshop/Product/Create/CreateProduct'));
const ProductForm = lazy(() => import('../../components/Myshop/Product/Create/CreateProduct'));
const ProductPage = lazy(() => import('../../components/Myshop/Product/ProductPage'));
const Setting = lazy(() => import('../../components/Myshop/Setting/SettingPage'));
const OrderShippingPage = lazy(() => import('../../components/Myshop/Order/OrderShippingPage'));
const OrderPrintPage = lazy(() => import('../../components/Myshop/Order/OrderPrintPage'));

const MyshopPage = () => {
  const { isAuthenticated, shop, user, status } = useAppSelector((state) => state.auth);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  useEffect(() => {
    setTimeout(() => {
      if (!shop) {
        dispatch(fetchCurrentShop());
      }
    }, 1000);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      if (isAuthenticated && !shop && status === 'succeeded') {
        if (!user?.hasShop) {
          navigate(APP_ROUTES.SHOP_REGISTER);
          showErrorNotification("Thông báo", "Bạn cần đăng ký cửa hàng trước khi truy cập.");
        }
      }
    }, 2000);
  }, [navigate, isAuthenticated]);

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div></div>}>
        <ShopAdminHeader />
      </Suspense>

      <div className="flex-1 bg-gray-50">
        {isAuthenticated && shop ? (
          <Routes>
            <Route index element={<Navigate to="/myshop/dashboard" replace />} />
            <Route path="dashboard" element={<div>Dashboard Content</div>} />
            <Route path="sale" element={<div>Sales Overview</div>} />
            <Route path="products" element={<ProductPage />} />
            <Route path="products/create" element={<CreateProduct />} />
            <Route path="products/edit/:id" element={<ProductForm />} />
            <Route path="orders" element={<OrderPage />} />
            {/* <Route path="orders/:shopOrderId" element={<OrderDetailComp />} /> */}
            <Route path="orders/shipping" element={<OrderShippingPage />} />
            <Route path="orders/printing" element={<OrderPrintPage />} />
            <Route path="messages" element={<MessagePage />} />
            <Route path="settings" element={<Setting />} />
          </Routes>
        ) : (
          <OverlayLoading visible={true} />
        )}
      </div>
    </div>
  );
};

export default MyshopPage;