import { 
  Table, 
  Image, 
  Text, 
  Badge, 
  ActionIcon, 
  Menu, 
  Checkbox,
  Switch,
  Pagination,
  Group,
  Loader
} from '@mantine/core';
import { 
  FiEdit2, 
  FiCopy, 
  FiTrash2, 
  FiMoreVertical,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiEyeOff
} from 'react-icons/fi';

interface Product {
  id: string;
  name: string;
  image: string;
  category: string;
  price: number;
  stock: number;
  sold: number;
  status: string;
  createdAt: string;
}

interface ListProductProps {
  products: Product[];
  isLoading: boolean;
  selectedProducts: string[];
  onSelectAll: (checked: boolean) => void;
  onSelectProduct: (id: string, checked: boolean) => void;
  activePage: number;
  onPageChange: (page: number) => void;
  onToggleStatus: (id: string) => void;
  onProductAction: (action: 'edit' | 'duplicate' | 'delete', productId: string) => void;
  totalPages: number;
}

const statusIcons = {
  active: <FiCheckCircle size={16} className="text-green-500" />,
  violation: <FiAlertTriangle size={16} className="text-red-500" />,
  pending: <FiClock size={16} className="text-yellow-500" />,
  hidden: <FiEyeOff size={16} className="text-gray-500" />
};

const statusLabels = {
  active: 'Đang hoạt động',
  violation: 'Vi phạm',
  pending: 'Chờ duyệt',
  hidden: 'Đang ẩn'
};

const statusColors = {
  active: 'green',
  violation: 'red',
  pending: 'yellow',
  hidden: 'gray'
};

const ListProduct = ({
  products,
  isLoading,
  selectedProducts,
  onSelectAll,
  onSelectProduct,
  activePage,
  onPageChange,
  onToggleStatus,
  onProductAction,
  totalPages
}: ListProductProps) => {
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden">
      {isLoading ? (
        <div className="p-8 flex justify-center">
          <Loader size="md" />
        </div>
      ) : products.length === 0 ? (
        <div className="p-8 text-center">
          <Text size="lg" fw={500} c="dimmed">Không tìm thấy sản phẩm nào</Text>
          <Text size="sm" c="dimmed" mt="xs">
            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
          </Text>
        </div>
      ) : (
        <Table highlightOnHover horizontalSpacing="md" verticalSpacing="sm">
          <Table.Thead>
            <Table.Tr>
              <Table.Th w={40}>
                <Checkbox
                  checked={selectedProducts.length === products.length && products.length > 0}
                  indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
                  onChange={(e) => onSelectAll(e.currentTarget.checked)}
                />
              </Table.Th>
              <Table.Th>Sản phẩm</Table.Th>
              <Table.Th>Danh mục</Table.Th>
              <Table.Th>Giá</Table.Th>
              <Table.Th>Tồn kho</Table.Th>
              <Table.Th>Đã bán</Table.Th>
              <Table.Th>Trạng thái</Table.Th>
              <Table.Th>Hoạt động</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {products.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Checkbox
                    checked={selectedProducts.includes(product.id)}
                    onChange={(e) => onSelectProduct(product.id, e.currentTarget.checked)}
                  />
                </Table.Td>
                <Table.Td>
                  <Group>
                    <Image 
                      src={product.image} 
                      alt={product.name} 
                      width={40} 
                      height={40} 
                      radius="sm"
                    />
                    <div>
                      <Text size="sm" fw={500}>{product.name}</Text>
                      <Text size="xs" c="dimmed">
                        ID: {product.id}
                      </Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>{product.category}</Table.Td>
                <Table.Td>{formatPrice(product.price)}</Table.Td>
                <Table.Td>
                  <Text 
                    size="sm" 
                    c={product.stock === 0 ? 'red' : undefined}
                    fw={product.stock === 0 ? 600 : undefined}
                  >
                    {product.stock}
                  </Text>
                </Table.Td>
                <Table.Td>{product.sold}</Table.Td>
                <Table.Td>
                  <Badge 
                    leftSection={statusIcons[product.status as keyof typeof statusIcons]}
                    color={statusColors[product.status as keyof typeof statusColors]}
                    variant="light"
                  >
                    {statusLabels[product.status as keyof typeof statusLabels]}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group gap="xs">
                    <Switch 
                      size="sm" 
                      checked={product.status === 'active'} 
                      onChange={() => onToggleStatus(product.id)}
                    />
                    <Menu shadow="md" position="bottom-end">
                      <Menu.Target>
                        <ActionIcon variant="subtle" size="sm">
                          <FiMoreVertical size={16} />
                        </ActionIcon>
                      </Menu.Target>
                      <Menu.Dropdown>
                        <Menu.Item 
                          leftSection={<FiEdit2 size={14} />}
                          onClick={() => onProductAction('edit', product.id)}
                        >
                          Chỉnh sửa
                        </Menu.Item>
                        <Menu.Item 
                          leftSection={<FiCopy size={14} />}
                          onClick={() => onProductAction('duplicate', product.id)}
                        >
                          Nhân bản
                        </Menu.Item>
                        <Menu.Divider />
                        <Menu.Item 
                          leftSection={<FiTrash2 size={14} />} 
                          color="red"
                          onClick={() => onProductAction('delete', product.id)}
                        >
                          Xóa
                        </Menu.Item>
                      </Menu.Dropdown>
                    </Menu>
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      )}
      
      {/* Pagination */}
      <div className="p-4 flex justify-between items-center border-t border-gray-200">
        <Text size="sm" c="dimmed">
          Hiển thị {Math.min(products.length, 5)} trên {products.length} sản phẩm
        </Text>
        
        <Pagination 
          value={activePage}
          onChange={onPageChange}
          total={totalPages}
          size="sm"
          radius="md"
        />
      </div>
    </div>
  );
};

export default ListProduct;