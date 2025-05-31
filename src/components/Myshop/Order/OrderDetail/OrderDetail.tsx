import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Container, Text, Group, Badge, Card, Button, ActionIcon, 
  Avatar, Timeline, Divider, Grid, Paper, Table, Image, Title,
  Tooltip, Menu, Tabs
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { 
  FiArrowLeft, FiUser, FiMapPin, FiPhone, FiMail, FiPackage, 
  FiClock, FiTruck, FiCheckCircle, FiX, FiDollarSign, 
  FiPrinter, FiDownload, FiShare2, FiEdit, FiMessageSquare,
  FiCalendar, FiFile, FiBox, FiFileText
} from 'react-icons/fi';

// Types
interface OrderDetailType {
  id: string;
  orderNumber: string;
  orderDate: string;
  status: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'unpaid' | 'partial' | 'refunded';
  paymentMethod: string;
  shippingMethod: string;
  shippingFee: number;
  discount: number;
  subtotal: number;
  total: number;
  note: string;
  
  // Thông tin khách hàng
  customer: {
    id: string;
    name: string;
    email: string;
    phone: string;
    avatar: string;
  };
  
  // Địa chỉ
  shippingAddress: {
    fullName: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    province: string;
    note?: string;
  };
  
  // Các sản phẩm trong đơn hàng
  items: Array<{
    id: string;
    productId: string;
    productName: string;
    productImage: string;
    sku: string;
    variant: string;
    price: number;
    quantity: number;
    total: number;
  }>;
  
  // Lịch sử trạng thái
  history: Array<{
    status: string;
    timestamp: string;
    note?: string;
    user?: string;
  }>;
}

// Cấu hình hiển thị trạng thái
const statusConfig = {
  pending: { icon: <FiClock size={16} />, color: 'yellow', label: 'Chờ xác nhận' },
  processing: { icon: <FiPackage size={16} />, color: 'blue', label: 'Đang xử lý' },
  shipping: { icon: <FiTruck size={16} />, color: 'indigo', label: 'Đang giao hàng' },
  completed: { icon: <FiCheckCircle size={16} />, color: 'green', label: 'Hoàn thành' },
  cancelled: { icon: <FiX size={16} />, color: 'red', label: 'Đã hủy' },
  refunded: { icon: <FiDollarSign size={16} />, color: 'orange', label: 'Hoàn tiền' }
};

// Cấu hình hiển thị trạng thái thanh toán
const paymentStatusConfig = {
  paid: { color: 'green', label: 'Đã thanh toán' },
  unpaid: { color: 'red', label: 'Chưa thanh toán' },
  partial: { color: 'yellow', label: 'Thanh toán một phần' },
  refunded: { color: 'gray', label: 'Đã hoàn tiền' }
};

// Dữ liệu mẫu
const sampleOrderDetail: OrderDetailType = {
  id: '12345',
  orderNumber: 'ORD-23065',
  orderDate: '2023-12-05 14:30',
  status: 'processing',
  paymentStatus: 'paid',
  paymentMethod: 'Chuyển khoản ngân hàng',
  shippingMethod: 'Giao hàng nhanh',
  shippingFee: 30000,
  discount: 50000,
  subtotal: 1270000,
  total: 1250000,
  note: 'Giao hàng vào buổi tối sau 18h',
  
  customer: {
    id: 'CUS-001',
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0901234567',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=80',
  },
  
  shippingAddress: {
    fullName: 'Nguyễn Văn A',
    phone: '0901234567',
    address: '123 Nguyễn Văn Linh',
    ward: 'Phường Tân Phong',
    district: 'Quận 7',
    province: 'TP. Hồ Chí Minh',
    note: 'Gọi trước khi giao 15 phút',
  },
  
  items: [
    {
      id: 'ITEM-001',
      productId: 'P001',
      productName: 'Áo thun nam cổ tròn basic',
      productImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=100',
      sku: 'ATN001',
      variant: 'Đen / XL',
      price: 220000,
      quantity: 2,
      total: 440000
    },
    {
      id: 'ITEM-002',
      productId: 'P002',
      productName: 'Quần jeans nam slim fit',
      productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=100',
      sku: 'QJN002',
      variant: 'Xanh đậm / 32',
      price: 830000,
      quantity: 1,
      total: 830000
    }
  ],
  
  history: [
    {
      status: 'pending',
      timestamp: '2023-12-05 14:30:00',
      user: 'Hệ thống'
    },
    {
      status: 'processing',
      timestamp: '2023-12-05 15:45:00',
      note: 'Xác nhận đã nhận thanh toán',
      user: 'Nhân viên: Trần Thị B'
    }
  ]
};

const OrderDetailComp = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<OrderDetailType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string | null>('overview');

  useEffect(() => {
    // Trong thực tế, đây sẽ là API call để lấy thông tin đơn hàng
    const fetchOrderDetail = async () => {
      try {
        setLoading(true);
        console.log("Fetching order with ID:", id); // Thêm log để debug
        
        // API call sẽ ở đây
        // const response = await api.get(`/orders/${id}`);
        // setOrder(response.data);
        
        // Giả lập delay API
        setTimeout(() => {
          // Giả lập xử lý ID đơn hàng
          // Nếu ID là ID của item, ta tìm order chứa item đó
          if (id?.includes("ITEM-")) {
            // Mock: Tìm order có item này
            setOrder({
              ...sampleOrderDetail,
              items: sampleOrderDetail.items.filter(item => item.id === id)
            });
          } else {
            // Trường hợp ID thông thường
            setOrder({
              ...sampleOrderDetail,
              id: id || '12345' // Sử dụng ID từ param hoặc giá trị mặc định
            });
          }
          setLoading(false);
        }, 500);
      } catch (error) {
        console.error('Error fetching order details:', error);
        notifications.show({
          title: 'Lỗi',
          message: 'Không thể tải thông tin đơn hàng. Vui lòng thử lại.',
          color: 'red'
        });
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [id]);

  // Format tiền tệ
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Format ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleUpdateStatus = (newStatus: string) => {
    if (!order) return;

    // Trong thực tế, đây sẽ là API call để cập nhật trạng thái
    console.log(`Cập nhật đơn hàng ${order.id} sang trạng thái ${newStatus}`);
    notifications.show({
      title: 'Thành công',
      message: `Đã cập nhật trạng thái đơn hàng sang ${newStatus}`,
      color: 'green'
    });

    // Cập nhật state để hiển thị trạng thái mới
    setOrder(prev => {
      if (!prev) return null;
      return {
        ...prev,
        status: newStatus as any,
        history: [
          ...prev.history,
          {
            status: newStatus,
            timestamp: new Date().toISOString(),
            user: 'Người dùng hiện tại'
          }
        ]
      };
    });
  };
if (loading) {
    return (
      <Container size="xl" my="md">
        <div className="animate-pulse">
          <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
          <div className="h-32 bg-gray-200 rounded mb-4"></div>
          <div className="h-64 bg-gray-200 rounded"></div>
        </div>
      </Container>
    );
  }

  if (!order) {
    return (
      <Container size="xl" my="md">
        <Card withBorder p="xl" radius="md">
          <div className="text-center py-8">
            <FiFile size={48} className="mx-auto text-gray-300 mb-4" />
            <Text fw={700} size="xl">Không tìm thấy đơn hàng</Text>
            <Text c="dimmed" mt="xs">
              Đơn hàng bạn đang tìm không tồn tại hoặc đã bị xóa
            </Text>
            <Button 
              variant="outline" 
              leftSection={<FiArrowLeft size={16} />}
              onClick={() => navigate('/myshop/orders')}
              mt="lg"
            >
              Quay lại danh sách đơn hàng
            </Button>
          </div>
        </Card>
      </Container>
    );
  }

  // Component hiển thị tab Tổng quan
  const OverviewTab = () => (
    <Grid>
      {/* Thông tin cơ bản và khách hàng */}
      <Grid.Col span={{ base: 12, md: 8 }}>
        {/* Thông tin sản phẩm */}
        <Paper withBorder p="md" radius="md" mb="md">
          {/* Giữ nguyên nội dung */}
          <Group justify="apart" mb="md">
            <Text fw={700}>Sản phẩm</Text>
            <Text fw={500}>Tổng: {order.items.length} sản phẩm</Text>
          </Group>
          
          <Table>
            {/* Giữ nguyên Table.Thead và Table.Tbody */}
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Sản phẩm</Table.Th>
                <Table.Th>Đơn giá</Table.Th>
                <Table.Th>Số lượng</Table.Th>
                <Table.Th>Thành tiền</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {order.items.map((item) => (
                <Table.Tr key={item.id}>
                  <Table.Td>
                    <Group gap="sm">
                      <Image src={item.productImage} width={50} height={50} radius="md" alt={item.productName} />
                      <div>
                        <Text size="sm" fw={500} lineClamp={2}>
                          {item.productName}
                        </Text>
                        <Text size="xs" c="dimmed" mt={4}>
                          SKU: {item.sku} | Phân loại: {item.variant}
                        </Text>
                      </div>
                    </Group>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm">{formatPrice(item.price)}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={500}>{item.quantity}</Text>
                  </Table.Td>
                  <Table.Td>
                    <Text size="sm" fw={700} c="red">
                      {formatPrice(item.total)}
                    </Text>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        </Paper>

        {/* Thông tin về khách hàng và địa chỉ giao hàng */}
        <Grid>
          {/* Giữ nguyên các Grid.Col */}
          <Grid.Col span={{ base: 12, sm: 6 }}>
            {/* ... giữ nguyên nội dung */}
            <Paper withBorder p="md" radius="md" h="100%">
              <Group mb="md" gap="xs">
                <FiUser size={16} />
                <Text fw={700}>Thông tin khách hàng</Text>
              </Group>
              
              <Group align="flex-start" mb="md">
                <Avatar src={order.customer.avatar} size="lg" radius="xl" />
                <div>
                  <Text fw={500} size="md">{order.customer.name}</Text>
                  <Group gap="xs" mt={4}>
                    <FiPhone size={14} />
                    <Text size="sm">{order.customer.phone}</Text>
                  </Group>
                  <Group gap="xs" mt={4}>
                    <FiMail size={14} />
                    <Text size="sm">{order.customer.email}</Text>
                  </Group>
                </div>
              </Group>
              
              <Button 
                variant="light" 
                leftSection={<FiMessageSquare size={14} />}
                fullWidth
              >
                Liên hệ khách hàng
              </Button>
            </Paper>
          </Grid.Col>
          
          <Grid.Col span={{ base: 12, sm: 6 }}>
            {/* ... giữ nguyên nội dung */}
            <Paper withBorder p="md" radius="md" h="100%">
              <Group mb="md" gap="xs">
                <FiMapPin size={16} />
                <Text fw={700}>Địa chỉ giao hàng</Text>
              </Group>
              
              <div className="space-y-2">
                <Text fw={500} size="md">{order.shippingAddress.fullName}</Text>
                <Text size="sm">{order.shippingAddress.phone}</Text>
                <Text size="sm">
                  {order.shippingAddress.address}, {order.shippingAddress.ward}, {order.shippingAddress.district}, {order.shippingAddress.province}
                </Text>
                {order.shippingAddress.note && (
                  <Text size="sm" c="dimmed" fs="italic">
                    Ghi chú: {order.shippingAddress.note}
                  </Text>
                )}
              </div>
              
              <Button 
                variant="light"
                leftSection={<FiTruck size={14} />}
                fullWidth
                mt="lg"
              >
                Xem trên bản đồ
              </Button>
            </Paper>
          </Grid.Col>
        </Grid>
      </Grid.Col>
      
      {/* Thông tin thanh toán và trạng thái */}
      <Grid.Col span={{ base: 12, md: 4 }}>
        {/* ... giữ nguyên nội dung */}
        <Paper withBorder p="md" radius="md" mb="md">
          <Text fw={700} mb="md">Thanh toán</Text>
          {/* ... giữ nguyên nội dung bên trong */}
        </Paper>
        
        <Paper withBorder p="md" radius="md">
          <Text fw={700} mb="md">Thông tin đơn hàng</Text>
          {/* ... giữ nguyên nội dung bên trong */}
        </Paper>
      </Grid.Col>
    </Grid>
  );

  // Component hiển thị tab Timeline
  const TimelineTab = () => (
    <Paper withBorder p="md" radius="md">
      <Text fw={700} mb="xl">Lịch sử đơn hàng</Text>
      
      <Timeline active={order.history.length - 1} bulletSize={24} lineWidth={2}>
        {order.history.map((item, index) => {
          const status = item.status as keyof typeof statusConfig;
          return (
            <Timeline.Item 
              key={index}
              bullet={statusConfig[status]?.icon || <FiClock size={12} />}
              title={
                <Group gap="xs">
                  <Text fw={500}>{statusConfig[status]?.label || status}</Text>
                  <Badge color={statusConfig[status]?.color || 'gray'} size="xs">
                    {formatDate(item.timestamp)}
                  </Badge>
                </Group>
              }
            >
              <Text size="sm" c="dimmed" mt="xs">
                {item.user && `${item.user} `}
                {item.note || `Đơn hàng đã chuyển sang trạng thái ${statusConfig[status]?.label || status}`}
              </Text>
            </Timeline.Item>
          );
        })}
      </Timeline>
      
      {/* Nút cập nhật trạng thái */}
      {order.status !== 'completed' && order.status !== 'cancelled' && order.status !== 'refunded' && (
        <div className="mt-6 pt-6 border-t border-gray-200">
          <Text fw={500} mb="md">Cập nhật trạng thái đơn hàng</Text>
          <Group>
            {order.status !== 'processing' && (
              <Button 
                leftSection={<FiPackage size={16} />}
                onClick={() => handleUpdateStatus('processing')}
                variant="outline"
              >
                Đang xử lý
              </Button>
            )}
            {order.status !== 'shipping' && (
              <Button 
                leftSection={<FiTruck size={16} />}
                onClick={() => handleUpdateStatus('shipping')}
                variant="outline"
              >
                Đang giao hàng
              </Button>
            )}
            {/* {order.status !== 'completed' && (
              <Button 
                leftSection={<FiCheckCircle size={16} />}
                onClick={() => handleUpdateStatus('completed')}
                variant="outline"
                color="green"
              >
                Hoàn thành
              </Button>
            )}
            {(order.status !== 'cancelled' && order.status !== 'completed') && (
              <Button 
                leftSection={<FiX size={16} />}
                onClick={() => handleUpdateStatus('cancelled')}
                variant="outline"
                color="red"
              >
                Hủy đơn hàng
              </Button>
            )} */}
          </Group>
        </div>
      )}
    </Paper>
  );

  return (
    <Container size="xl" my="md">
      {/* Nút quay lại và thông tin cơ bản */}
      <Group justify="apart" mb="md">
        <Group>
          <Button 
            variant="default" 
            leftSection={<FiArrowLeft size={16} />}
            onClick={() => navigate('/myshop/orders')}
          >
            Quay lại
          </Button>
          <Text fw={700} size="xl">
            Đơn hàng #{order.orderNumber}
          </Text>
        </Group>
        <Group>
          <Badge 
            leftSection={statusConfig[order.status].icon}
            color={statusConfig[order.status].color}
            variant="light"
            size="lg"
          >
            {statusConfig[order.status].label}
          </Badge>
          <Badge
            color={paymentStatusConfig[order.paymentStatus].color}
            variant="light"
            size="lg"
          >
            {paymentStatusConfig[order.paymentStatus].label}
          </Badge>
          <Menu shadow="md" width={200}>
            <Menu.Target>
              <Button variant="default">Thao tác</Button>
            </Menu.Target>
            <Menu.Dropdown>
              {/* Giữ nguyên nội dung menu */}
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>

      {/* Fix phần Tabs - đảm bảo cấu trúc đúng */}
      <Tabs value={activeTab} onChange={setActiveTab} mb="md">
        <Tabs.List>
          <Tabs.Tab value="overview" leftSection={<FiFileText size={14} />}>
            Tổng quan
          </Tabs.Tab>
          <Tabs.Tab value="timeline" leftSection={<FiClock size={14} />}>
            Lịch sử đơn hàng
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview" pt="md">
          <OverviewTab />
        </Tabs.Panel>
        
        <Tabs.Panel value="timeline" pt="md">
          <TimelineTab />
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
};

export default OrderDetailComp;