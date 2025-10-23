import { Box, Divider, Drawer, NavLink, ScrollArea, Text, ThemeIcon } from '@mantine/core';
import React, { useState } from 'react';
import {
  FiBarChart2,
  FiCheckSquare,
  FiHome,
  FiLayers,
  FiLogOut,
  FiPlusCircle,
  FiSettings,
  FiShoppingCart,
  FiUsers
} from 'react-icons/fi';
import { Link, useLocation } from 'react-router-dom';

interface NavItemProps {
  icon: React.ReactNode;
  label: string;
  to: string;
  active?: boolean;
  onClick?: () => void;
  children?: React.ReactNode;
}

const NavItem: React.FC<NavItemProps> = ({ icon, label, to, active, onClick, children }) => {
  const [opened, setOpened] = useState(active);

  return (
    <>
      <NavLink
        label={label}
        active={active}
        leftSection={
          <ThemeIcon variant="light" color={active ? "blue" : "gray"} size="sm">
            {icon}
          </ThemeIcon>
        }
        component={Link}
        to={to}
        opened={opened}
        onChange={setOpened}
        childrenOffset={28}
        my={4}
        onClick={onClick}
        className='rounded-md hover:bg-gray-100 transition-colors duration-200'
      >
        {children}
      </NavLink>
    </>
  );
};

interface AdminSidebarProps {
  opened: boolean;
  onClose: () => void;
}

const AdminSidebar: React.FC<AdminSidebarProps> = ({ opened, onClose }) => {
  const location = useLocation();

  const navItems = [
    { icon: <FiHome size={16} />, label: 'Tổng quan', path: '/admin/dashboard' },
    { icon: <FiLayers size={16} />, label: 'Danh mục', path: '/admin/categories' },
    { icon: <FiUsers size={16} />, label: 'Người dùng', path: '/admin/users' },
    {
      icon: <FiPlusCircle size={16} />,
      label: 'Đăng ký shop',
      path: '/admin/shop-registrations'
    },
    {
      icon: <FiCheckSquare size={16} />,
      label: 'Duyệt sản phẩm',
      path: '/admin/product-approvals'
    },
    { icon: <FiShoppingCart size={16} />, label: 'Đơn hàng', path: '/admin/orders' },
    { icon: <FiBarChart2 size={16} />, label: 'Báo cáo & Thống kê', path: '/admin/reports' },
    { icon: <FiSettings size={16} />, label: 'Cài đặt', path: '/admin/settings' }
  ];

  // Sidebar để hiển thị trên desktop
  const desktopSidebar = (
    <Box
      w={250}
      h="calc(100vh - 65px)"
      bg="white"
      style={{
        borderRight: '1px solid #eaeaea',
        position: 'sticky',
        top: '65px',
        left: 0,
        zIndex: 2,
        overflow: 'hidden'
      }}
      p="xs"
      className="hidden md:block"
    >
      <ScrollArea h="100vh" scrollbarSize={6} offsetScrollbars>
        <Box py="md">
          <Text fw={700} size="sm" c="dimmed" mb="xs" px="md">
            QUẢN TRỊ HỆ THỐNG
          </Text>

          {navItems.map((item) => (
            <NavItem
              key={item.path}
              icon={item.icon}
              label={item.label}
              to={item.path}
              active={location.pathname === item.path}
            />
          ))}
        </Box>
      </ScrollArea>
    </Box>
  );

  // Drawer sidebar cho mobile
  const mobileSidebar = (
    <Drawer
      opened={opened}
      onClose={onClose}
      size="xs"
      title={
        <div className="flex items-center gap-2">
          <img src="/images/logo.jfif" alt="AnrealShop" className="h-8 w-auto" />
          <div className="font-semibold text-lg">
            <span className="text-primary">Admin</span>
            <span className="text-slate-700">System</span>
          </div>
        </div>
      }
      className="md:hidden"
    >
      <div className="mt-4">
        {navItems.map((item) => (
          <NavItem
            key={item.path}
            icon={item.icon}
            label={item.label}
            to={item.path}
            active={location.pathname === item.path}
            onClick={onClose}
          />
        ))}
        <Divider my="sm" />
        <Link
          to="/"
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          <ThemeIcon variant="light" color="gray" size="sm">
            <FiHome size={16} />
          </ThemeIcon>
          Quay lại cửa hàng
        </Link>
        <div
          className="flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-100"
          onClick={onClose}
        >
          <ThemeIcon variant="light" color="red" size="sm">
            <FiLogOut size={16} />
          </ThemeIcon>
          Đăng xuất
        </div>

      </div>
    </Drawer>
  );

  return (
    <>
      {desktopSidebar}
      {mobileSidebar}
    </>
  );
};

export default AdminSidebar;