import {
    ActionIcon,
    Badge,
    Box,
    Button,
    Group,
    Image,
    LoadingOverlay,
    Menu,
    Modal,
    Pagination,
    Paper,
    Stack,
    Table,
    Tabs,
    Text,
    Textarea,
    TextInput,
    Title,
    Tooltip
} from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import {
    FiCalendar,
    FiCheck,
    FiCheckCircle,
    FiClock,
    FiEye,
    FiFilter,
    FiMoreVertical,
    FiRefreshCcw,
    FiSearch,
    FiX
} from 'react-icons/fi';
import ProductReviewModal from './ProductReviewModal';
import type { Product } from '../../../types/AdminProductType';


const ProductApprovalPage = () => {
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>('pending');
    const [activeTab, setActiveTab] = useState('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [date, setDate] = useState<Date | null>(new Date());
    const [searchTerm, setSearchTerm] = useState('');

    const handleDateRangeChange = (range: Date | null) => {
        setDate(range);

        // Nếu có dateRange hợp lệ, thực hiện lọc
        if (range) {
            setIsLoading(true);

            // Giả lập API call lọc theo ngày từ DB
            setTimeout(() => {
                // Trong thực tế: gọi API với params là range[0] và range[1]
                // Ví dụ: fetchProductsByDateRange(range[0], range[1])

                // Chỉ để demo: lọc từ data có sẵn
                const startDate = range?.getTime();

                // // Ví dụ sử dụng data mockup đơn giản để lọc
                // const filteredByDate = products.filter(product => {
                //     const productDate = new Date(product.createdAt).getTime();
                //     return productDate >= startDate! && productDate <= endDate!;
                // });

                // Trong thực tế, đây sẽ là response từ API
                setIsLoading(false);
            }, 500);
        }
    };

    // Thêm hàm reset bộ lọc
    const resetFilters = () => {
        setDate(null);
        setStatusFilter('pending');
        setActiveTab('pending');
        setSearchTerm('');

        // Reload data gốc
        setIsLoading(true);
        setTimeout(() => {
            // Trong thực tế: fetchProducts() - lấy lại dữ liệu gốc
            setIsLoading(false);
        }, 500);
    };

    // Modals
    const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
    const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false);
    const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] = useDisclosure(false);

    useEffect(() => {
        // Simulate API call
        setTimeout(() => {
            const mockProducts: Product[] = [
                {
                    id: 'PRD001',
                    name: 'Áo thun nam basic',
                    shop: { 
                        id: 'SHP001', 
                        name: 'Fashion Store',
                        avatarUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?q=80&w=100'
                    },
                    category: { id: 'CAT001', name: 'Thời trang nam' },
                    price: 199000,
                    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100'],
                    media: [
                        { id: 'M001', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100' },
                        { id: 'M002', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=100' },
                    ],
                    description: 'Áo thun nam basic chất liệu cotton 100%, thiết kế đơn giản, phù hợp với nhiều phong cách.',
                    createdAt: '2023-05-15T08:30:00Z',
                    status: 'pending',
                    quantity: 150,
                    weight: 200,
                    location: 'Việt Nam',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: true,
                    variants: [
                        {
                            id: 'V001',
                            sku: 'ATNAM-S-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'S' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V002',
                            sku: 'ATNAM-M-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'M' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V003',
                            sku: 'ATNAM-L-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'L' },
                                { key: 'Color', value: 'White' }
                            ]
                        }
                    ]
                },
                {
                    id: 'PRD002',
                    name: 'Giày thể thao nữ',
                    shop: { 
                        id: 'SHP002', 
                        name: 'Sportland',
                        avatarUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=100'
                    },
                    category: { id: 'CAT002', name: 'Giày dép' },
                    price: 450000,
                    images: [
                        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=100',
                        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100'
                    ],
                    media: [
                        { id: 'M003', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=100' },
                        { id: 'M004', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100' },
                        { id: 'M005', type: 'VIDEO', url: 'https://example.com/video.mp4' },
                    ],
                    description: 'Giày thể thao nữ thoáng khí, nhẹ, phù hợp đi chơi, tập thể thao.',
                    createdAt: '2023-05-16T10:15:00Z',
                    status: 'pending',
                    quantity: 100,
                    weight: 600,
                    location: 'Trung Quốc',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: true,
                    variants: [
                        {
                            id: 'V004',
                            sku: 'GIAYTTN-37-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '37' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V005',
                            sku: 'GIAYTTN-38-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '38' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V006',
                            sku: 'GIAYTTN-39-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '39' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V007',
                            sku: 'GIAYTTN-40-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '40' },
                                { key: 'Color', value: 'White' }
                            ]
                        }
                    ]
                },
                {
                    id: 'PRD003',
                    name: 'Túi xách nữ thời trang',
                    shop: { 
                        id: 'SHP003', 
                        name: 'Accessories World',
                        avatarUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=100'
                    },
                    category: { id: 'CAT003', name: 'Phụ kiện' },
                    price: 350000,
                    images: ['https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=100'],
                    media: [
                        { id: 'M006', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=100' },
                    ],
                    description: 'Túi xách nữ thời trang, chất liệu da PU cao cấp, có nhiều ngăn đựng đồ.',
                    createdAt: '2023-05-17T09:45:00Z',
                    status: 'approved',
                    reviewNote: 'Sản phẩm đạt chuẩn, hình ảnh rõ nét.',
                    quantity: 80,
                    weight: 450,
                    location: 'Hàn Quốc',
                    sold: 15,
                    averageRating: 4.7,
                    totalReviews: 8,
                    visible: true,
                    variants: []
                },
                {
                    id: 'PRD004',
                    name: 'Áo khoác dù nam',
                    shop: { 
                        id: 'SHP001', 
                        name: 'Fashion Store',
                        avatarUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?q=80&w=100'
                    },
                    category: { id: 'CAT001', name: 'Thời trang nam' },
                    price: 550000,
                    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100'],
                    media: [
                        { id: 'M007', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100' },
                    ],
                    description: 'Áo khoác dù nam chống thấm nước, giữ ấm tốt trong thời tiết se lạnh.',
                    createdAt: '2023-05-18T14:20:00Z',
                    status: 'rejected',
                    reviewNote: 'Hình ảnh không rõ nét, thiếu thông tin kích thước.',
                    quantity: 0,
                    weight: 700,
                    location: 'Việt Nam',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: false,
                    restrictedReason: 'Hình ảnh mờ, không đạt tiêu chuẩn'
                },
            ];

            setProducts(mockProducts);
            setIsLoading(false);
        }, 1000);
    }, []);

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

    // Handle status change
    const handleApprove = (product: Product) => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setProducts(prev =>
                prev.map(p =>
                    p.id === product.id ? { ...p, status: 'approved', reviewNote: 'Sản phẩm đạt chuẩn' } : p
                )
            );
            setSelectedProduct(null);
            setIsLoading(false);
            openSuccessModal();
        }, 800);
    };

    const handleReject = () => {
        if (!selectedProduct) return;

        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            setProducts(prev =>
                prev.map(p =>
                    p.id === selectedProduct.id ? { ...p, status: 'rejected', reviewNote: rejectionReason } : p
                )
            );
            setSelectedProduct(null);
            setRejectionReason('');
            closeRejectModal();
            setIsLoading(false);
            openSuccessModal();
        }, 800);
    };

    // Open product review
    const openProductReview = (product: Product) => {
        setSelectedProduct(product);
        openReviewModal();
    };

    // Handle tab change
    const handleTabChange = (tab: string | null) => {
        if (tab === null) return;
        setActiveTab(tab);
        setStatusFilter(tab === 'all' ? null : tab);
    };

    // Filter products by status
    const filteredProducts = statusFilter
        ? products.filter(product => product.status === statusFilter)
        : products;

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

    return (
        <Box>
            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

            <Paper p="md" radius="md" withBorder mb="md">
                <Group justify="space-between" align="flex-start" mb="md">
                    <Stack gap="xs">
                        <Title order={3} size="h4">Xác nhận sản phẩm</Title>
                        <Text size="sm" c="dimmed">
                            Xem xét và phê duyệt các sản phẩm mới được đăng ký bởi người bán.
                        </Text>
                    </Stack>

                    <Stack gap="xs">
                        <Group>
                            <DatePickerInput
                                placeholder="Lọc theo ngày đăng ký"
                                value={date}
                                onChange={handleDateRangeChange}
                                clearable
                                valueFormat="DD/MM/YYYY"
                                locale="vi"
                                leftSection={<FiCalendar size={16} />}
                                rightSection={date ? (
                                    <ActionIcon size="sm" variant="subtle" onClick={() => setDate(null)}>
                                        <FiX size={14} />
                                    </ActionIcon>
                                ) : null}
                                style={{ minWidth: '300px' }}
                            />
                            <TextInput
                                placeholder="Tìm kiếm theo tên, ID, cửa hàng..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.currentTarget.value)}
                                leftSection={<FiSearch size={16} />}
                                style={{ minWidth: '300px' }}
                            />

                            <Tooltip label="Reset bộ lọc">
                                <ActionIcon
                                    variant="light"
                                    color="gray"
                                    onClick={resetFilters}
                                    disabled={!date && statusFilter === 'pending'}
                                >
                                    <FiRefreshCcw size={16} />
                                </ActionIcon>
                            </Tooltip>

                        </Group>
                    </Stack>
                </Group>


                <Tabs value={activeTab} onChange={handleTabChange} mb="md">
                    <Tabs.List>
                        <Tabs.Tab value="pending" leftSection={<FiClock size={14} />}>
                            Chờ duyệt ({products.filter(p => p.status === 'pending').length})
                        </Tabs.Tab>
                        <Tabs.Tab value="approved" leftSection={<FiCheckCircle size={14} />}>
                            Đã duyệt ({products.filter(p => p.status === 'approved').length})
                        </Tabs.Tab>
                        <Tabs.Tab value="rejected" leftSection={<FiX size={14} />}>
                            Đã từ chối ({products.filter(p => p.status === 'rejected').length})
                        </Tabs.Tab>
                        <Tabs.Tab value="all" leftSection={<FiFilter size={14} />}>
                            Tất cả ({products.length})
                        </Tabs.Tab>
                    </Tabs.List>
                </Tabs>

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
                        {filteredProducts.length === 0 ? (
                            <Table.Tr>
                                <Table.Td colSpan={7} style={{ textAlign: 'center', padding: '20px' }}>
                                    <Text fw={500} c="dimmed">Không có sản phẩm nào</Text>
                                </Table.Td>
                            </Table.Tr>
                        ) : (
                            filteredProducts.map((product) => (
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
                                                    onClick={() => openProductReview(product)}
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
                                                            onClick={() => handleApprove(product)}
                                                        >
                                                            Phê duyệt
                                                        </Menu.Item>
                                                        <Menu.Item
                                                            leftSection={<FiX size={14} color="red" />}
                                                            onClick={() => {
                                                                setSelectedProduct(product);
                                                                openRejectModal();
                                                            }}
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
                    <Pagination total={5} value={page} onChange={setPage} />
                </Group>
            </Paper>

            <ProductReviewModal
                opened={reviewModalOpened}
                onClose={closeReviewModal}
                product={selectedProduct}
                onApprove={handleApprove}
                onReject={() => {
                    closeReviewModal();
                    openRejectModal();
                }}
            />
            {/* Reject Modal */}
            <Modal
                opened={rejectModalOpened}
                onClose={closeRejectModal}
                title="Từ chối sản phẩm"
                centered
            >
                <Stack>
                    <Text size="sm">Vui lòng cung cấp lý do từ chối sản phẩm:</Text>

                    <Textarea
                        placeholder="Nhập lý do từ chối..."
                        minRows={4}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.currentTarget.value)}
                        required
                    />

                    <Group justify="space-between" mt="md">
                        <Button variant="outline" onClick={closeRejectModal}>
                            Hủy
                        </Button>
                        <Button
                            color="red"
                            leftSection={<FiX size={16} />}
                            onClick={handleReject}
                            disabled={!rejectionReason.trim()}
                        >
                            Từ chối sản phẩm
                        </Button>
                    </Group>
                </Stack>
            </Modal>

            {/* Success Modal */}
            <Modal
                opened={successModalOpened}
                onClose={closeSuccessModal}
                title="Thao tác thành công"
                centered
            >
                <Stack align="center">
                    <FiCheckCircle size={48} color="green" />
                    <Text>Trạng thái sản phẩm đã được cập nhật thành công!</Text>
                    <Button onClick={closeSuccessModal} mt="md" fullWidth>
                        Đóng
                    </Button>
                </Stack>
            </Modal>
        </Box>
    );
};

export default ProductApprovalPage;