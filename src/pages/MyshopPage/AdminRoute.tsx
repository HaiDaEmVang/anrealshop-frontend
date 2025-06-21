import { Anchor, Box, Breadcrumbs, Flex, Group, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React, { Suspense, lazy } from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';

const CategoryManagement = lazy(() => import('../../components/Admin/Category/CategoryPage'));
const AdminHeader = lazy(() => import('../../components/Admin/Header/AdminHeader'));
const AdminSidebar = lazy(() => import('../../components/Admin/Header/AdminSideBar'));
const ProductApprovalPage = lazy(() => import('../../components/Admin/Product/ProductPage'));
const ShopApprovalPage = lazy(() => import('../../components/Admin/Shop/ShopPage'));

// const AdminDashboard = lazy(() => import('../../components/Admin/Dashboard/AdminDashboard'));
// const UserManagement = lazy(() => import('../../components/Admin/User/UserManagement'));
// const OrderManagement = lazy(() => import('../../components/Admin/Order/OrderManagement'));
// const ReportManagement = lazy(() => import('../../components/Admin/Report/ReportManagement'));
// const SystemSettings = lazy(() => import('../../components/Admin/Setting/SystemSettings'));
const AdminDashboard = () => <div>Dashboard Admin</div>;
const UserManagement = () => <div>Quản lý người dùng</div>;
const OrderManagement = () => <div>Quản lý đơn hàng</div>;
const ReportManagement = () => <div>Báo cáo và thống kê</div>;
const SystemSettings = () => <div>Cài đặt hệ thống</div>;



const AdminPage: React.FC = () => {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    const routeNames: Record<string, string> = {
      'admin': 'Quản trị',
      'dashboard': 'Tổng quan',
      'categories': 'Quản lý danh mục',
      'users': 'Quản lý người dùng',
      'shop-registrations': 'Đăng ký shop',
      'product-approvals': 'Duyệt sản phẩm',
      'orders': 'Quản lý đơn hàng',
      'reports': 'Báo cáo & Thống kê',
      'settings': 'Cài đặt hệ thống'
    };
    
    const items = [
      <Anchor component={Link} to="/" key="home">
        <Group gap={4}>
          <FiHome size={14} />
          <span>Trang chủ</span>
        </Group>
      </Anchor>
    ];
    
    let currentPath = '';
    
    pathSegments.forEach((segment, index) => {
      currentPath += `/${segment}`;
      const isLast = index === pathSegments.length - 1;
      
      items.push(
        isLast ? (
          <Text key={segment} fw={500}>
            {routeNames[segment] || segment}
          </Text>
        ) : (
          <Anchor component={Link} to={currentPath} key={segment}>
            {routeNames[segment] || segment}
          </Anchor>
        )
      );
    });
    
    return items;
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Suspense fallback={<div></div>}>
         <AdminHeader toggleSidebar={toggle} sidebarOpened={opened} />
      </Suspense>
      
      <Flex className="flex-1">
        <Suspense fallback={<div></div>}>
           <AdminSidebar opened={opened} onClose={close} />
        </Suspense>
        
        <Box className="flex-1 bg-gray-50 p-4">
          <Paper p="md" mb="md" radius="md" shadow="xs">
            <Breadcrumbs separator={<FiChevronRight size={14} />}>
              {generateBreadcrumbs()}
            </Breadcrumbs>
          </Paper>
          
          <Paper p="md" radius="md" shadow="xs">
            <Suspense fallback={<div>Loading...</div>}>
              <Routes>
                <Route index element={<Navigate to="/admin/dashboard" replace />} />
                <Route path="dashboard" element={<AdminDashboard />} />
                <Route path="categories" element={<CategoryManagement />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="shop-registrations" element={<ShopApprovalPage />} />
                <Route path="product-approvals" element={<ProductApprovalPage />} />
                <Route path="orders" element={<OrderManagement />} />
                <Route path="reports" element={<ReportManagement />} />
                <Route path="settings" element={<SystemSettings />} />
                <Route path="*" element={<div>Page not found</div>} />
              </Routes>
            </Suspense>
          </Paper>
        </Box>
      </Flex>
    </div>
  );
};

export default AdminPage;