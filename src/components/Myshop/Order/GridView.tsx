import { ActionIcon, Badge, Checkbox, Group, Image, Menu, Table, Text, Tooltip } from '@mantine/core';
import type { JSX } from 'react';
import { FiCheckCircle, FiClock, FiEye, FiMoreVertical, FiPackage, FiTruck, FiX } from 'react-icons/fi';

// Interface cho OrderItem
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

// Props cho GridView component
interface GridViewProps {
  items: OrderItem[];
  selectedItems: string[];
  onSelectItem: (id: string, checked: boolean) => void;
  onSelectAll: (checked: boolean) => void;
  onUpdateStatus: (id: string, status: string) => void;
  statusConfig: Record<string, { icon: JSX.Element; color: string; label: string }>;
  formatPrice: (amount: number) => string;
  formatDate: (dateString: string) => string;
}

const GridView = ({
  items,
  selectedItems,
  onSelectItem,
  onSelectAll,
  onUpdateStatus,
  statusConfig,
  formatPrice,
  formatDate
}: GridViewProps) => {
  return (
    <Table highlightOnHover>
      <Table.Thead>
        <Table.Tr>
          <Table.Th w={40}>
            <Checkbox
              checked={selectedItems.length === items.length && items.length > 0}
              indeterminate={selectedItems.length > 0 && selectedItems.length < items.length}
              onChange={(e) => onSelectAll(e.currentTarget.checked)}
            />
          </Table.Th>
          <Table.Th>Sản phẩm</Table.Th>
          <Table.Th>Mã SKU</Table.Th>
          <Table.Th>Danh mục</Table.Th>
          <Table.Th>Số lượng</Table.Th>
          <Table.Th>Thành tiền</Table.Th>
          <Table.Th>Đơn hàng</Table.Th>
          <Table.Th>Trạng thái</Table.Th>
          <Table.Th>Ngày đặt</Table.Th>
          <Table.Th>Thao tác</Table.Th>
        </Table.Tr>
      </Table.Thead>
      <Table.Tbody>
        {items.map((item) => (
          <Table.Tr key={item.id}>
            <Table.Td>
              <Checkbox
                checked={selectedItems.includes(item.id)}
                onChange={(e) => onSelectItem(item.id, e.currentTarget.checked)}
              />
            </Table.Td>
            <Table.Td>
              <Group gap="sm">
                <Image src={item.productImage} width={40} height={40} radius="sm" alt={item.productName} />
                <div>
                  <Text size="sm" fw={500} lineClamp={2}>
                    {item.productName}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {item.variant}
                  </Text>
                </div>
              </Group>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{item.sku}</Text>
            </Table.Td>
            <Table.Td>
              <Badge size="sm" variant="outline">{item.category}</Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={600} ta="center">
                {item.quantity}
              </Text>
            </Table.Td>
            <Table.Td>
              <Text size="sm" fw={600} c="red">
                {formatPrice(item.totalPrice)}
              </Text>
            </Table.Td>
            <Table.Td>
              <Tooltip label={`Khách hàng: ${item.customerName}`} withArrow position="top">
                <Text size="sm" c="blue" className="cursor-pointer" fw={500}>
                  {item.orderNumber}
                </Text>
              </Tooltip>
            </Table.Td>
            <Table.Td>
              <Badge
                leftSection={statusConfig[item.orderStatus].icon}
                color={statusConfig[item.orderStatus].color}
                variant="light"
                size="sm"
              >
                {statusConfig[item.orderStatus].label}
              </Badge>
            </Table.Td>
            <Table.Td>
              <Text size="sm">{formatDate(item.orderDate)}</Text>
            </Table.Td>
            <Table.Td>
              <Group gap="xs">
                <ActionIcon variant="subtle" color="blue" size="sm" title="Xem chi tiết">
                  <FiEye size={16} />
                </ActionIcon>
                <Menu position="bottom-end" withArrow shadow="md">
                  <Menu.Target>
                    <ActionIcon variant="subtle" size="sm">
                      <FiMoreVertical size={16} />
                    </ActionIcon>
                  </Menu.Target>
                  <Menu.Dropdown>
                    <Menu.Item rightSection={<FiEye size={14} />}>
                      Chi tiết sản phẩm
                    </Menu.Item>
                    <Menu.Item rightSection={<FiEye size={14} />}>
                      Chi tiết đơn hàng
                    </Menu.Item>
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
            </Table.Td>
          </Table.Tr>
        ))}
      </Table.Tbody>
    </Table>
  );
};

export default GridView;