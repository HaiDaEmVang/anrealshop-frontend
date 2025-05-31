import { ActionIcon, Badge, Button, Card, Checkbox, Divider, Group, Image, Menu, Text, Tooltip } from '@mantine/core';
import { FiCalendar, FiCheckCircle, FiClock, FiEye, FiFileText, FiMoreVertical, FiPackage, FiTruck, FiUser, FiX } from 'react-icons/fi';
import type { JSX } from 'react/jsx-runtime';

// Interface cho OrderItem được tái sử dụng từ OrderTable
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  sku: string;
  variant: string;
  quantity: number;
  price: number;
  totalPrice: number;
  
  // Thông tin đơn hàng liên quan
  orderId: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'unpaid' | 'partial' | 'refunded';
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}

interface ListViewProps {
  items: OrderItem[];
  selectedItems: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
  statusConfig: Record<string, { icon: JSX.Element; color: string; label: string }>;
  paymentStatusConfig: Record<string, { color: string; label: string }>;
  formatPrice: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const ListView = ({
  items,
  selectedItems,
  onSelectItem,
  onUpdateStatus,
  statusConfig,
  paymentStatusConfig,
  formatPrice,
  formatDate
}: ListViewProps) => {
  return (
    <div className="space-y-4">
      {items.map((item) => (
        <Card key={item.id} withBorder p="md">
          <div className="flex flex-col md:flex-row">
            {/* Thông tin sản phẩm */}
            <div className="flex-grow p-2">
              <Group justify="apart" mb="md">
                <Group>
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onChange={(e) => onSelectItem(item.id, e.currentTarget.checked)}
                  />
                  <div>
                    <Text fw={600} size="sm">Sản phẩm</Text>
                  </div>
                </Group>
                <Badge
                  leftSection={statusConfig[item.orderStatus].icon}
                  color={statusConfig[item.orderStatus].color}
                  variant="light"
                  size="md"
                >
                  {statusConfig[item.orderStatus].label}
                </Badge>
              </Group>

              <div className="flex gap-4">
                <Image src={item.productImage} width={100} height={100} radius="md" alt={item.productName} />
                <div>
                  <Text fw={600} lineClamp={2}>{item.productName}</Text>
                  <Group gap="xs" mt="xs">
                    <Text size="sm" c="dimmed">SKU: {item.sku}</Text>
                    <Text size="sm" c="dimmed">|</Text>
                    <Badge size="sm" variant="outline">{item.category}</Badge>
                  </Group>
                  <Text size="sm" mt="xs">Phân loại: <span className="font-semibold">{item.variant}</span></Text>
                  <Group mt="sm">
                    <Text fw={700} size="lg" c="red">{formatPrice(item.price)}</Text>
                    <Text size="sm">× {item.quantity}</Text>
                    <Text fw={700} size="md" c="red">=</Text>
                    <Text fw={700} size="md" c="red">{formatPrice(item.totalPrice)}</Text>
                  </Group>
                </div>
              </div>
            </div>

            <Divider orientation="vertical" mx="md" className="hidden md:block" />
            <Divider my="md" className="block md:hidden" />

            {/* Thông tin đơn hàng */}
            <div className="w-full md:w-[400px] p-2">
              <Group gap="apart" mb="md">
                <Group>
                  <FiFileText size={16} />
                  <Text fw={600} size="sm">Thông tin đơn hàng</Text>
                </Group>
                <Badge
                  color={paymentStatusConfig[item.paymentStatus].color}
                  variant="light"
                >
                  {paymentStatusConfig[item.paymentStatus].label}
                </Badge>
              </Group>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <FiCalendar size={14} className="text-gray-500" />
                  <Text size="sm">Ngày đặt: {formatDate(item.orderDate)}</Text>
                </div>
                <div className="flex items-center gap-2">
                  <FiFileText size={14} className="text-gray-500" />
                  <Text size="sm">Mã đơn hàng: <span className="font-semibold text-blue-600">{item.orderNumber}</span></Text>
                </div>
                <div className="flex items-center gap-2">
                  <FiUser size={14} className="text-gray-500" />
                  <Text size="sm">Khách hàng: {item.customerName} - {item.customerPhone}</Text>
                </div>
                <div className="flex items-start gap-2">
                  <FiPackage size={14} className="text-gray-500 mt-1" />
                  <Text size="sm">Địa chỉ giao hàng: {item.shippingAddress}</Text>
                </div>
              </div>

              <Group justify="right" mt="md">
                <Tooltip label="Xem chi tiết đơn hàng" withArrow>
                  <Button 
                    component="a" 
                    href={`/myshop/orders/${item.orderId}`}
                    variant="outline" 
                    size="xs" 
                    leftSection={<FiEye size={14} />}
                  >
                    Xem đơn hàng
                  </Button>
                </Tooltip>
                <Menu withArrow position="bottom-end">
                  <Menu.Target>
                    <ActionIcon variant="subtle">
                      <FiMoreVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item rightSection={<FiEye size={14} />}>Chi tiết sản phẩm</Menu.Item>
                    <Menu.Item rightSection={<FiCheckCircle size={14} />}>Đánh dấu hoàn thành</Menu.Item>
                    <Menu.Divider />
                    <Menu.Label>Cập nhật trạng thái</Menu.Label>
                    {item.orderStatus !== 'pending' && (
                      <Menu.Item
                        rightSection={<FiClock size={14} />}
                        onClick={() => onUpdateStatus(item.id, 'pending')}
                      >
                        Chờ xác nhận
                      </Menu.Item>
                    )}
                    {item.orderStatus !== 'processing' && (
                      <Menu.Item
                        rightSection={<FiPackage size={14} />}
                        onClick={() => onUpdateStatus(item.id, 'processing')}
                      >
                        Đang xử lý
                      </Menu.Item>
                    )}
                    {item.orderStatus !== 'shipping' && (
                      <Menu.Item
                        rightSection={<FiTruck size={14} />}
                        onClick={() => onUpdateStatus(item.id, 'shipping')}
                      >
                        Đang giao hàng
                      </Menu.Item>
                    )}
                    {item.orderStatus !== 'completed' && (
                      <Menu.Item
                        rightSection={<FiCheckCircle size={14} />}
                        onClick={() => onUpdateStatus(item.id, 'completed')}
                      >
                        Hoàn thành
                      </Menu.Item>
                    )}
                    {(item.orderStatus !== 'cancelled' && item.orderStatus !== 'completed') && (
                      <Menu.Item
                        rightSection={<FiX size={14} />}
                        color="red"
                        onClick={() => onUpdateStatus(item.id, 'cancelled')}
                      >
                        Hủy sản phẩm
                      </Menu.Item>
                    )}
                  </Menu.Dropdown>
                </Menu>
              </Group>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ListView;