import React, { useState } from 'react';
import {
    Badge,
    Box,
    Button,
    Divider,
    Group,
    Image,
    Modal,
    ScrollArea,
    SimpleGrid,
    Stack,
    Table,
    Tabs,
    Text,
    Title,
    Card,
    Tooltip
} from '@mantine/core';
import { FiCheck, FiX, FiShoppingBag, FiBarChart2, FiImage, FiInfo, FiList, FiTag } from 'react-icons/fi';
import type { Product } from '../../../types/AdminProductType';

interface ProductReviewModalProps {
    opened: boolean;
    onClose: () => void;
    product: Product | null;
    onApprove: (product: Product) => void;
    onReject: () => void;
}

const ProductReviewModal: React.FC<ProductReviewModalProps> = ({
    opened,
    onClose,
    product,
    onApprove,
    onReject
}) => {
    const [activeTab, setActiveTab] = useState<string | null>('overview');
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    // Format price
    const formatPrice = (price: number) => {
        return price.toLocaleString('vi-VN') + '₫';
    };

    // Format date
    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleString('vi-VN', {
            year: 'numeric',
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric'
        });
    };

    // Status badge color
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'approved': return 'green';
            case 'rejected': return 'red';
            case 'pending': return 'yellow';
            default: return 'gray';
        }
    };

    // Status label
    const getStatusLabel = (status: string) => {
        switch (status) {
            case 'approved': return 'Đã phê duyệt';
            case 'rejected': return 'Đã từ chối';
            case 'pending': return 'Đang chờ duyệt';
            default: return 'Không xác định';
        }
    };

    if (!product) return null;

    // Xử lý media để hiển thị
    const allMedia = product.media || product.images.map(url => ({ id: url, type: 'IMAGE' as const, url }));
    const mainImageUrl = selectedImage || (allMedia.length > 0 ? allMedia[0].url : '');

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title={<Title order={3}>Chi tiết sản phẩm: {product.name}</Title>}
            size="xl"
            centered
        >
            <ScrollArea h={600} offsetScrollbars>
                <Stack gap="md">
                    <Tabs value={activeTab} onChange={setActiveTab}>
                        <Tabs.List>
                            <Tabs.Tab value="overview" leftSection={<FiInfo size={14} />}>
                                Tổng quan
                            </Tabs.Tab>
                            <Tabs.Tab value="media" leftSection={<FiImage size={14} />}>
                                Hình ảnh & Media
                            </Tabs.Tab>
                            <Tabs.Tab value="variants" leftSection={<FiTag size={14} />}>
                                Phiên bản & Kho hàng
                            </Tabs.Tab>
                            <Tabs.Tab value="details" leftSection={<FiList size={14} />}>
                                Chi tiết khác
                            </Tabs.Tab>
                        </Tabs.List>
                    </Tabs>

                    {activeTab === 'overview' && (
                        <Box>
                            <Group align="flex-start" gap="xl">
                                <Box style={{ width: 280, flexShrink: 0 }}>
                                    <Image
                                        src={product.images[0] || 'https://placehold.co/280x280?text=No+Image'}
                                        width={280}
                                        height={280}
                                        radius="md"
                                        fit="cover"
                                    />
                                    
                                    {product.images.length > 1 && (
                                        <SimpleGrid cols={4} mt="xs" spacing="xs">
                                            {product.images.slice(0, 4).map((image, index) => (
                                                <Image
                                                    key={index}
                                                    src={image}
                                                    width={60}
                                                    height={60}
                                                    radius="sm"
                                                    fit="cover"
                                                    style={{ cursor: 'pointer', border: index === 0 ? '2px solid blue' : 'none' }}
                                                />
                                            ))}
                                        </SimpleGrid>
                                    )}
                                </Box>

                                <Stack gap="xs" style={{ flex: 1 }}>
                                    <Group justify="apart" align="flex-start">
                                        <Box>
                                            <Title order={3}>{product.name}</Title>
                                            <Text size="sm" c="dimmed" mb="md">ID: {product.id}</Text>
                                        </Box>
                                        <Badge color={getStatusColor(product.status)} size="lg">
                                            {getStatusLabel(product.status)}
                                        </Badge>
                                    </Group>

                                    <Group mt="xs">
                                        <Badge color="blue" variant="light">Danh mục: {product.category?.name || 'Chưa phân loại'}</Badge>
                                        {product.visible ? (
                                            <Badge color="green" variant="light">Hiển thị</Badge>
                                        ) : (
                                            <Badge color="gray" variant="light">Ẩn</Badge>
                                        )}
                                    </Group>

                                    <Divider my="xs" />

                                    <Group>
                                        <Text fw={700} size="xl" c="red">{formatPrice(product.price)}</Text>
                                        <Text size="sm" c="dimmed">Tồn kho: {product.quantity}</Text>
                                        {product.sold && <Text size="sm" c="dimmed">Đã bán: {product.sold}</Text>}
                                    </Group>

                                    <Group gap="lg" mt="md">
                                        <Group>
                                            <FiShoppingBag size={18} />
                                            <Box>
                                                <Text size="sm" fw={500}>Cửa hàng</Text>
                                                <Text size="sm">{product.shop.name}</Text>
                                            </Box>
                                        </Group>
                                        
                                        <Group>
                                            <FiBarChart2 size={18} />
                                            <Box>
                                                <Text size="sm" fw={500}>Đánh giá</Text>
                                                <Text size="sm">
                                                    {product.averageRating ? `${product.averageRating}/5 (${product.totalReviews} đánh giá)` : 'Chưa có đánh giá'}
                                                </Text>
                                            </Box>
                                        </Group>
                                    </Group>

                                    <Box>
                                        <Text fw={500} mt="md">Mô tả sản phẩm:</Text>
                                        <Text size="sm" style={{ whiteSpace: 'pre-wrap' }}>{product.description}</Text>
                                    </Box>
                                    
                                    <Divider my="xs" />
                                    
                                    <Group justify="apart">
                                        <Text size="sm">Khối lượng: <Text span fw={500}>{product.weight} g</Text></Text>
                                        <Text size="sm">Ngày tạo: <Text span fw={500}>{formatDate(product.createdAt)}</Text></Text>
                                    </Group>

                                    {product.location && (
                                        <Text size="sm">Xuất xứ: <Text span fw={500}>{product.location}</Text></Text>
                                    )}

                                    {product.reviewNote && (
                                        <Box mt="md" p="sm" style={{ backgroundColor: '#f8f9fa', borderRadius: 4 }}>
                                            <Text fw={500}>Ghi chú đánh giá:</Text>
                                            <Text size="sm">{product.reviewNote}</Text>
                                        </Box>
                                    )}
                                </Stack>
                            </Group>
                        </Box>
                    )}

                    {activeTab === 'media' && (
                        <Box>
                            <Title order={4} mb="md">Hình ảnh & Media ({allMedia.length})</Title>
                            
                            <Box mb="md">
                                <Image
                                    src={mainImageUrl || 'https://placehold.co/600x400?text=No+Image'}
                                    width="100%"
                                    height={400}
                                    radius="md"
                                    fit="contain"
                                />
                            </Box>
                            
                            <SimpleGrid cols={6} spacing="xs">
                                {allMedia.map((media, index) => (
                                    <Card 
                                        key={media.id || index} 
                                        p={0} 
                                        withBorder
                                        style={{ 
                                            cursor: 'pointer',
                                            border: media.url === mainImageUrl ? '2px solid blue' : undefined
                                        }}
                                        onClick={() => setSelectedImage(media.url)}
                                    >
                                        <Image
                                            src={media.url}
                                            height={100}
                                            radius="sm"
                                            fit="cover"
                                        />
                                        <Text size="xs" ta="center" mt={4} mb={4}>
                                            {media.type === 'VIDEO' ? 'Video' : `Hình ${index + 1}`}
                                        </Text>
                                    </Card>
                                ))}
                            </SimpleGrid>
                        </Box>
                    )}

                    {activeTab === 'variants' && (
                        <Box>
                            <Title order={4} mb="md">Phiên bản & Kho hàng</Title>
                            
                            {product.variants && product.variants.length > 0 ? (
                                <Table striped highlightOnHover >
                                    <Table.Thead>
                                        <Table.Tr>
                                            <Table.Th>SKU</Table.Th>
                                            <Table.Th>Thuộc tính</Table.Th>
                                            <Table.Th>Giá</Table.Th>
                                            <Table.Th>SL tồn</Table.Th>
                                        </Table.Tr>
                                    </Table.Thead>
                                    <Table.Tbody>
                                        {product.variants.map((variant) => (
                                            <Table.Tr key={variant.id}>
                                                <Table.Td>{variant.sku}</Table.Td>
                                                <Table.Td>
                                                    {variant.attributes.map(attr => (
                                                        <Badge key={attr.key} mr={5}>
                                                            {attr.key}: {attr.value}
                                                        </Badge>
                                                    ))}
                                                </Table.Td>
                                                <Table.Td>{formatPrice(variant.price)}</Table.Td>
                                                <Table.Td>{variant.quantity}</Table.Td>
                                            </Table.Tr>
                                        ))}
                                    </Table.Tbody>
                                </Table>
                            ) : (
                                <Box p="lg" ta="center">
                                    <Text c="dimmed">Sản phẩm không có phiên bản</Text>
                                </Box>
                            )}
                            
                            <Box mt="md">
                                <Table >
                                    <Table.Tbody>
                                        <Table.Tr>
                                            <Table.Th style={{ width: 200 }}>Tổng số lượng</Table.Th>
                                            <Table.Td>{product.quantity}</Table.Td>
                                        </Table.Tr>
                                        <Table.Tr>
                                            <Table.Th>Đã bán</Table.Th>
                                            <Table.Td>{product.sold || 0}</Table.Td>
                                        </Table.Tr>
                                    </Table.Tbody>
                                </Table>
                            </Box>
                        </Box>
                    )}

                    {activeTab === 'details' && (
                        <Box>
                            <Title order={4} mb="md">Thông tin chi tiết</Title>
                            
                            <Table>
                                <Table.Tbody>
                                    <Table.Tr>
                                        <Table.Th style={{ width: 200 }}>ID sản phẩm</Table.Th>
                                        <Table.Td>{product.id}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Danh mục</Table.Th>
                                        <Table.Td>{product.category?.name || 'Chưa phân loại'}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Cửa hàng</Table.Th>
                                        <Table.Td>
                                            <Group>
                                                {product.shop.avatarUrl && (
                                                    <Image 
                                                        src={product.shop.avatarUrl} 
                                                        width={30} 
                                                        height={30} 
                                                        radius="xl" 
                                                    />
                                                )}
                                                <Text>{product.shop.name} (ID: {product.shop.id})</Text>
                                            </Group>
                                        </Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Ngày tạo</Table.Th>
                                        <Table.Td>{formatDate(product.createdAt)}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Tình trạng hiển thị</Table.Th>
                                        <Table.Td>{product.visible ? 'Đang hiển thị' : 'Đang ẩn'}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Xuất xứ</Table.Th>
                                        <Table.Td>{product.location || 'Không có thông tin'}</Table.Td>
                                    </Table.Tr>
                                    <Table.Tr>
                                        <Table.Th>Khối lượng</Table.Th>
                                        <Table.Td>{product.weight} g</Table.Td>
                                    </Table.Tr>
                                    {product.restrictedReason && (
                                        <Table.Tr>
                                            <Table.Th>Lý do hạn chế</Table.Th>
                                            <Table.Td>{product.restrictedReason}</Table.Td>
                                        </Table.Tr>
                                    )}
                                </Table.Tbody>
                            </Table>
                        </Box>
                    )}

                    <Divider my="md" />

                    <Group justify="space-between">
                        <Button variant="outline" onClick={onClose}>
                            Đóng
                        </Button>

                        {product.status === 'pending' && (
                            <Group>
                                <Tooltip label="Từ chối sản phẩm này">
                                    <Button
                                        variant="outline"
                                        color="red"
                                        leftSection={<FiX size={16} />}
                                        onClick={onReject}
                                    >
                                        Từ chối
                                    </Button>
                                </Tooltip>
                                <Tooltip label="Phê duyệt sản phẩm này">
                                    <Button
                                        color="green"
                                        leftSection={<FiCheck size={16} />}
                                        onClick={() => onApprove(product)}
                                    >
                                        Phê duyệt
                                    </Button>
                                </Tooltip>
                            </Group>
                        )}
                    </Group>
                </Stack>
            </ScrollArea>
        </Modal>
    );
};

export default ProductReviewModal;