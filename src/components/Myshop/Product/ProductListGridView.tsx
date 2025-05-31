import {
  Grid,
  Card,
  Image,
  Text,
  Badge,
  Group,
  ActionIcon,
  Menu,
  Switch,
  Checkbox,
  Pagination,
  Box,
  Loader,
  Stack,
  Skeleton
} from '@mantine/core';
import {
  FiEdit2,
  FiCopy,
  FiTrash2,
  FiMoreVertical,
  FiCheckCircle,
  FiAlertTriangle,
  FiClock,
  FiEyeOff,
  FiShoppingBag
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
  isUpdating?: boolean;
}

interface GridProductViewProps {
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

const ProductListGridView = ({
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
}: GridProductViewProps) => {
  
  const formatPrice = (price: number) => {
    return price.toLocaleString('vi-VN') + '₫';
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-md shadow-sm overflow-hidden p-4">
        <Grid gutter="md">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }} key={i}>
              <Card padding="md" radius="md" withBorder>
                <Skeleton height={160} mb="md" />
                <Skeleton height={20} width="70%" mb="sm" />
                <Skeleton height={15} width="50%" mb="lg" />
                <Group justify="space-between" mb="md">
                  <Skeleton height={25} width={80} />
                  <Skeleton height={15} width={60} />
                </Group>
                <Group justify="space-between">
                  <Skeleton height={30} width={100} />
                  <Skeleton height={30} circle />
                </Group>
              </Card>
            </Grid.Col>
          ))}
        </Grid>
      </div>
    );
  }

  if (products.length === 0) {
    return (
      <div className="bg-white rounded-md shadow-sm overflow-hidden">
        <div className="p-12 text-center">
          <FiShoppingBag size={48} className="mx-auto mb-4 text-gray-300" />
          <Text size="lg" fw={500} c="dimmed">Không tìm thấy sản phẩm nào</Text>
          <Text size="sm" c="dimmed" mt="xs">
            Thử tìm kiếm với từ khóa khác hoặc xóa bộ lọc
          </Text>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-md shadow-sm overflow-hidden p-4">
      <Group justify="space-between" mb="md">
        <Checkbox
          checked={selectedProducts.length === products.length && products.length > 0}
          indeterminate={selectedProducts.length > 0 && selectedProducts.length < products.length}
          onChange={(e) => onSelectAll(e.currentTarget.checked)}
          label={`Chọn tất cả (${products.length})`}
        />
        {selectedProducts.length > 0 && (
          <Text size="sm" fw={500} c="blue">
            Đã chọn {selectedProducts.length} sản phẩm
          </Text>
        )}
      </Group>

      <Grid gutter="md">
        {products.map((product) => (
          <Grid.Col span={{ base: 12, xs: 6, sm: 4, lg: 3 }} key={product.id}>
            <Card 
              padding="md" 
              radius="md" 
              withBorder
              style={{ 
                position: 'relative',
                opacity: product.isUpdating ? 0.7 : 1,
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                cursor: 'default',
                height: '100%',
                display: 'flex',
                flexDirection: 'column'
              }}
              className="hover:shadow-md"
            >
              {/* Overlay loading cho sản phẩm đang cập nhật */}
              {product.isUpdating && (
                <div style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  backgroundColor: 'rgba(255,255,255,0.7)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  zIndex: 2,
                  borderRadius: '8px'
                }}>
                  <Loader size="sm" />
                </div>
              )}
              
              {/* Checkbox selection */}
              <Box style={{ position: 'absolute', top: 8, left: 8, zIndex: 1 }}>
                <Checkbox
                  checked={selectedProducts.includes(product.id)}
                  onChange={(e) => onSelectProduct(product.id, e.currentTarget.checked)}
                  disabled={product.isUpdating}
                />
              </Box>

              {/* Status Badge */}
              <Box style={{ position: 'absolute', top: 8, right: 8, zIndex: 1 }}>
                <Badge 
                  leftSection={statusIcons[product.status as keyof typeof statusIcons]}
                  color={statusColors[product.status as keyof typeof statusColors]}
                  variant="light"
                  size="sm"
                >
                  {statusLabels[product.status as keyof typeof statusLabels]}
                </Badge>
              </Box>
              
              {/* Product Image */}
              <Card.Section className="relative" onClick={() => onProductAction('edit', product.id)}>
                <div style={{ 
                  height: '160px', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  background: '#f8f9fa',
                  overflow: 'hidden'
                }}>
                  <Image
                    src={product.image}
                    height={160}
                    fallbackSrc="https://placehold.co/400x300?text=No+Image"
                    alt={product.name}
                    style={{ 
                      objectFit: 'cover',
                      transition: 'transform 0.3s ease',
                      width: '100%',
                      height: '100%'
                    }}
                    className="hover:scale-105"
                  />
                </div>
              </Card.Section>

              {/* Product Info */}
              <Stack gap="xs" mt="md" mb="xs" style={{ flexGrow: 1 }}>
                <div onClick={() => onProductAction('edit', product.id)} style={{ cursor: 'pointer' }}>
                  <Text fw={500} lineClamp={2} className="hover:text-blue-600">
                    {product.name}
                  </Text>
                </div>
                <Text size="sm" c="dimmed">{product.category}</Text>
                <Group justify="space-between" mt="auto">
                  <Text fw={700} size="lg" c="red">
                    {formatPrice(product.price)}
                  </Text>
                  <Group gap="xs">
                    <Text size="xs" c="dimmed">Đã bán:</Text>
                    <Text size="sm" fw={500}>
                      {product.sold}
                    </Text>
                  </Group>
                </Group>
                <Group justify="space-between">
                  <Text size="sm" c={product.stock === 0 ? 'red' : 'dimmed'} fw={product.stock === 0 ? 500 : 400}>
                    {product.stock > 0 ? `Còn ${product.stock}` : 'Hết hàng'}
                  </Text>
                </Group>
              </Stack>

              {/* Actions */}
              <Group justify="space-between" mt="md" pt="sm" style={{ borderTop: '1px solid #f0f0f0' }}>
                <Switch 
                  size="sm" 
                  checked={product.status === 'active'} 
                  onChange={() => onToggleStatus(product.id)}
                  disabled={product.isUpdating}
                  label="Hiển thị"
                  labelPosition="left"
                />
                <Menu shadow="md" position="bottom-end" withArrow>
                  <Menu.Target>
                    <ActionIcon variant="subtle" disabled={product.isUpdating}>
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
            </Card>
          </Grid.Col>
        ))}
      </Grid>
      
      {/* Pagination */}
      <div className="p-4 flex justify-between items-center border-t border-gray-200 mt-4">
        <Text size="sm" c="dimmed">
          Hiển thị {Math.min(products.length, 12)} trên {products.length} sản phẩm
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

export default ProductListGridView;