import { ActionIcon, Badge, Group, Image, Menu, Table, Text, Tooltip } from '@mantine/core';
import { FiCheck, FiEye, FiFileText, FiMoreVertical, FiX } from 'react-icons/fi';
import { useProductForAdStatusColor, useProductForAdStatusLabel } from '../../../hooks/useProductStatus';
import type { MyShopProductDto } from '../../../types/ProductType';
import { formatDate, formatPrice } from '../../../untils/Untils';

interface ProductListProps {
    products: MyShopProductDto[];
    onViewProduct: (product: MyShopProductDto) => void;
    onApproveProduct: (product: MyShopProductDto) => void;
    onRejectProduct: (product: MyShopProductDto) => void;
    onViewRejectionReason: (product: MyShopProductDto) => void;
}

const ProductList: React.FC<ProductListProps> = ({
    products,
    onViewProduct,
    onApproveProduct,
    onRejectProduct,
    onViewRejectionReason,
}) => {
    const { getStatusColor } = useProductForAdStatusColor();
    const { getStatusLabel } = useProductForAdStatusLabel();

    return (
        <>
            <Table striped highlightOnHover withColumnBorders>
                <Table.Thead>
                    <Table.Tr>
                        <Table.Th>Sản phẩm</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Cửa hàng</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Danh mục</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Giá</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Ngày tạo</Table.Th>
                        <Table.Th style={{ textAlign: 'center' }}>Trạng thái</Table.Th>
                        <Table.Th style={{ width: '100px', textAlign: 'center' }}>Thao tác</Table.Th>
                    </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                    {products.length === 0 ? (
                        <Table.Tr>
                            <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                <Text my={20} fw={500} c="dimmed">Không có sản phẩm nào</Text>
                            </Table.Td>
                        </Table.Tr>
                    ) : (
                        products.map((product) => (
                            <Table.Tr key={product.id}>
                                <Table.Td>
                                    <Group className='flex !flex-nowrap' >
                                        <div className="w-20 h-20 flex-shrink-0 object-cover rounded-sm overflow-hidden">
                                            <Image
                                                src={product.thumbnailUrl}
                                                alt={product.name}
                                                width={40}
                                                height={40}
                                                radius="sm"
                                            />
                                        </div>
                                        <Tooltip label={product.name}>
                                            <div>
                                                <Text size="sm" fw={500} lineClamp={1}>{product.name}</Text>
                                                <Text size="xs" c="dimmed">ID: {product.id}</Text>
                                            </div>
                                        </Tooltip>
                                    </Group>
                                </Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{product.baseShopDto?.name}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{product.categoryPath?.split(' > ').pop()}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatPrice(product.discountPrice)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>{formatDate(product.createdAt)}</Table.Td>
                                <Table.Td style={{ textAlign: 'center' }}>
                                    <Badge color={getStatusColor(product.status, product.restrictedReason)}>
                                        {getStatusLabel(product.status, product.restrictedReason)}
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

                                        {product.status === 'PENDING' && (
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
                                        {product.status === 'VIOLATION' && (
                                            <Tooltip label="Xem lý do từ chối">
                                                <ActionIcon
                                                    variant="subtle"
                                                    color="red"
                                                    onClick={() => onViewRejectionReason(product)}
                                                >
                                                    <FiFileText size={16} />
                                                </ActionIcon>
                                            </Tooltip>
                                        )}
                                    </Group>
                                </Table.Td>
                            </Table.Tr>
                        ))
                    )}
                </Table.Tbody>
            </Table>

        </>
    );
};

export default ProductList;