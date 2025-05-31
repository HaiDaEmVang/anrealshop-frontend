import { Anchor, Badge, Box, Breadcrumbs, Container, Group, Paper, Tabs, Text, Title } from '@mantine/core';
import { useState } from 'react';
import { FiCheckCircle, FiChevronRight, FiClock, FiDollarSign, FiPackage, FiTruck, FiX } from 'react-icons/fi';
import OrderTable from './OrderTable';

type OrderStatus = 'all' | 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded';

// Dữ liệu mẫu về số lượng đơn hàng theo trạng thái
const orderCounts = {
  all: 128,
  pending: 15,
  processing: 32,
  shipping: 24,
  completed: 47,
  cancelled: 8,
  refunded: 2
};

const OrderPage = () => {
  // State cho trạng thái đơn hàng đang được chọn
  const [activeStatus, setActiveStatus] = useState<OrderStatus>('all');
  // State cho bộ lọc đơn hàng
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  // State cho khoảng thời gian
  const [timeRange, setTimeRange] = useState<string>('all');

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý đơn hàng', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  // Hàm xử lý khi chọn trạng thái đơn hàng
  const handleStatusChange = (status: OrderStatus) => {
    setActiveStatus(status);
  };

  // Config cho icon và màu sắc của từng trạng thái
  const statusConfig = {
    all: { icon: <FiPackage size={16} />, color: 'gray' },
    pending: { icon: <FiClock size={16} />, color: 'yellow' },
    processing: { icon: <FiPackage size={16} />, color: 'blue' },
    shipping: { icon: <FiTruck size={16} />, color: 'indigo' },
    completed: { icon: <FiCheckCircle size={16} />, color: 'green' },
    cancelled: { icon: <FiX size={16} />, color: 'red' },
    refunded: { icon: <FiDollarSign size={16} />, color: 'orange' }
  };

  // Tạo danh sách tab cho các trạng thái đơn hàng
  const statusTabs = [
    { value: 'all', label: 'Tất cả', count: orderCounts.all },
    { value: 'pending', label: 'Chờ xác nhận', count: orderCounts.pending },
    { value: 'processing', label: 'Đang xử lý', count: orderCounts.processing },
    { value: 'shipping', label: 'Đang giao hàng', count: orderCounts.shipping },
    { value: 'completed', label: 'Đã hoàn thành', count: orderCounts.completed },
    { value: 'cancelled', label: 'Đã hủy', count: orderCounts.cancelled },
    { value: 'refunded', label: 'Hoàn tiền', count: orderCounts.refunded },
  ];


  return (
    <Container fluid px="lg" py="md">
      {/* Page Header */}
      <Paper 
        shadow="xs" 
        p="md" 
        mb="md" 
        radius="md"
        className="border-b border-gray-200"
      >
        <Box mb="xs">
          <Breadcrumbs separator={<FiChevronRight size={14} />}>
            {breadcrumbItems}
          </Breadcrumbs>
        </Box>
        
        <Group justify="space-between" align="center">
          <Group>
            <FiPackage size={24} className="text-primary" />
            <Title order={2} size="h3">Quản lý đơn hàng</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Xem và quản lý tất cả đơn hàng của cửa hàng
          </Text>
        </Group>
      </Paper>

      {/* Order Status Tabs */}
      <Paper shadow="xs" radius="md" className="bg-white overflow-hidden">
        <Box>
          <Tabs
            value={activeStatus}
            onChange={(value) => handleStatusChange(value as OrderStatus)}
            variant="outline"
            classNames={{
              tab: "py-3 px-4 font-medium",
              tabLabel: "flex items-center gap-2"
            }}
          >
            <Tabs.List>
              {statusTabs.map((status) => (
                <Tabs.Tab
                  key={status.value}
                  value={status.value}
                  leftSection={statusConfig[status.value as OrderStatus].icon}
                  rightSection={
                    <Badge size="sm" variant="light" color={statusConfig[status.value as OrderStatus].color}>
                      {status.count}
                    </Badge>
                  }
                >
                  {status.label}
                </Tabs.Tab>
              ))}
            </Tabs.List>
          </Tabs>
        </Box>
        
        {/* Orders Table */}
        <Box p="md">
          <OrderTable status={activeStatus} timeRange={timeRange} />
        </Box>
      </Paper>

      {/* Summary Stats */}
      <Paper shadow="xs" p="md" mt="md" radius="md" className="bg-white">
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">Tổng số đơn hàng: {orderCounts.all}</Text>
          <Group gap="md">
            <Text size="sm" c="dimmed">Doanh thu: <span className="font-semibold text-primary">47,250,000₫</span></Text>
            <Text size="sm" c="dimmed">Đơn thành công: <span className="font-semibold text-green-600">{orderCounts.completed}</span></Text>
          </Group>
        </Group>
      </Paper>


    </Container>
  );
};

export default OrderPage;