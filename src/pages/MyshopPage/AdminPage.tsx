import { Anchor, Box, Breadcrumbs, Flex, Group, Paper, Text } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import React from 'react';
import { FiChevronRight, FiHome } from 'react-icons/fi';
import { Link, Navigate, Route, Routes, useLocation } from 'react-router-dom';
import CategoryManagement from '../../components/Admin/Category/CategoryPage';
import AdminHeader from '../../components/Admin/Header/AdminHeader';
import AdminSidebar from '../../components/Admin/Header/AdminSideBar';
import ProductApprovalPage from '../../components/Admin/Product/ProductPage';

// Placeholder components - sẽ được thay thế bằng các component thực tế sau
const AdminDashboard = () => <div>Dashboard Admin</div>;
const UserManagement = () => <div>Quản lý người dùng</div>;
const ShopRegistration = () => <div>Đăng ký shop</div>;
const OrderManagement = () => <div>Quản lý đơn hàng</div>;
const ReportManagement = () => <div>Báo cáo và thống kê</div>;
const SystemSettings = () => <div>Cài đặt hệ thống</div>;

const AdminPage: React.FC = () => {
  const location = useLocation();
  const [opened, { toggle, close }] = useDisclosure(false);
  
  // Định nghĩa breadcrumbs dựa vào location hiện tại
  const generateBreadcrumbs = () => {
    const pathSegments = location.pathname.split('/').filter(segment => segment);
    
    // Mapping tên hiển thị cho từng route
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
    
    // Tạo mảng breadcrumb items
    const items = [
      <Anchor component={Link} to="/" key="home">
        <Group gap={4}>
          <FiHome size={14} />
          <span>Trang chủ</span>
        </Group>
      </Anchor>
    ];
    
    // Build breadcrumb path
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
      <AdminHeader toggleSidebar={toggle} sidebarOpened={opened} />
      
      <Flex className="flex-1">
        {/* Sidebar - includes both desktop sidebar and mobile drawer */}
        <AdminSidebar opened={opened} onClose={close} />
        
        {/* Main Content */}
        <Box className="flex-1 bg-gray-50 p-4">
          {/* Breadcrumbs */}
          <Paper p="md" mb="md" radius="md" shadow="xs">
            <Breadcrumbs separator={<FiChevronRight size={14} />}>
              {generateBreadcrumbs()}
            </Breadcrumbs>
          </Paper>
          
          {/* Main Routes */}
          <Paper p="md" radius="md" shadow="xs">
            <Routes>
              <Route index element={<Navigate to="/admin/dashboard" replace />} />
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="categories" element={<CategoryManagement />} />
              <Route path="users" element={<UserManagement />} />
              <Route path="shop-registrations" element={<ShopRegistration />} />
              <Route path="product-approvals" element={<ProductApprovalPage />} />
              <Route path="orders" element={<OrderManagement />} />
              <Route path="reports" element={<ReportManagement />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route path="*" element={<div>Page not found</div>} />
            </Routes>
          </Paper>
        </Box>
      </Flex>
    </div>
  );
};

export default AdminPage;