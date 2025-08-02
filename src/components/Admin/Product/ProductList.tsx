import { ActionIcon, Badge, Group, Image, Menu, Pagination, Table, Text, Tooltip } from '@mantine/core';
import { FiCheck, FiEye, FiMoreVertical, FiX } from 'react-icons/fi';
import type { Product } from '../../../types/AdminProductType';
import { useProductStatusColor, useProductStatusLabel } from '../../../hooks/useProductStatus';
import { formatDate, formatPrice } from '../../../untils/Untils';

interface ProductListProps {
  products: Product[];
  page: number;
  onPageChange: (page: number) => void;
  onViewProduct: (product: Product) => void;
  onApproveProduct: (product: Product) => void;
  onRejectProduct: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  page,
  onPageChange,
  onViewProduct,
  onApproveProduct,
  onRejectProduct
}) => {
  const { getStatusColor } = useProductStatusColor();
  const { getStatusLabel } = useProductStatusLabel();

  return (
    <>
      <Table striped highlightOnHover withColumnBorders>
        <Table.Thead>
          <Table.Tr>
            <Table.Th>Sản phẩm</Table.Th>
            <Table.Th>Cửa hàng</Table.Th>
            <Table.Th>Danh mục</Table.Th>
            <Table.Th>Giá</Table.Th>
            <Table.Th>Ngày tạo</Table.Th>
            <Table.Th>Trạng thái</Table.Th>
            <Table.Th style={{ width: '100px', textAlign: 'center' }}>Thao tác</Table.Th>
          </Table.Tr>
        </Table.Thead>
        <Table.Tbody>
          {products.length === 0 ? (
            <Table.Tr>
              <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                <Text my={20    } fw={500} c="dimmed">Không có sản phẩm nào</Text>
              </Table.Td>
            </Table.Tr>
          ) : (
            products.map((product) => (
              <Table.Tr key={product.id}>
                <Table.Td>
                  <Group>
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      width={40}
                      height={40}
                      radius="sm"
                    />
                    <div>
                      <Text size="sm" fw={500} lineClamp={1}>{product.name}</Text>
                      <Text size="xs" c="dimmed">ID: {product.id}</Text>
                    </div>
                  </Group>
                </Table.Td>
                <Table.Td>{product.shop.name}</Table.Td>
                <Table.Td>{product.category.name}</Table.Td>
                <Table.Td>{formatPrice(product.price)}</Table.Td>
                <Table.Td>{formatDate(product.createdAt)}</Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(product.status)}>
                    {getStatusLabel(product.status)}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Group justify="center">
                    <Tooltip label="Xem chi tiết">
                      <ActionIcon
                        variant="subtle"
                        onClick={() => onViewProduct(product)}
                      >
                        <FiEye size={16} />
                      </ActionIcon>
                    </Tooltip>

                    {product.status === 'pending' && (
                      <Menu position="bottom-end" withinPortal>
                        <Menu.Target>
                          <ActionIcon variant="subtle">
                            <FiMoreVertical size={16} />
                          </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                          <Menu.Item
                            leftSection={<FiCheck size={14} color="green" />}
                            onClick={() => onApproveProduct(product)}
                          >
                            Phê duyệt
                          </Menu.Item>
                          <Menu.Item
                            leftSection={<FiX size={14} color="red" />}
                            onClick={() => onRejectProduct(product)}
                          >
                            Từ chối
                          </Menu.Item>
                        </Menu.Dropdown>
                      </Menu>
                    )}
                  </Group>
                </Table.Td>
              </Table.Tr>
            ))
          )}
        </Table.Tbody>
      </Table>

      <Group justify="flex-end" mt="md">
        <Pagination total={5} value={page} onChange={onPageChange} />
      </Group>
    </>
  );
};

export default ProductList;