import { useState } from 'react';
import {
    Title,
    Text,
    Badge,
    Button,
    Group,
    Paper,
    Pagination,
    Tabs,
    Skeleton,
    Card,
    Image,
    Stack,
    Grid,
    Rating
} from '@mantine/core';
import {
    FiEye,
    FiDownload,
    FiCalendar,
    FiClock,
    FiCheck,
    FiArchive,
    FiTruck,
    FiX,
    FiSearch,
    FiShoppingCart,
    FiStar,
    FiMessageCircle,
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { FaStore } from 'react-icons/fa';
import { formatDate, formatPrice } from '../../../../untils/Untils';

// Kiểu dữ liệu cho đơn hàng thời trang (1 đơn = 1 sản phẩm)
interface FashionOrder {
    id: string;
    shopName: string;
    shopId: string;
    date: string;
    status: 'completed' | 'processing' | 'shipping' | 'cancelled' | 'pending';
    product: {
        id: string;
        name: string;
        image: string;
        brand: string;
        category: string;
        size?: string;
        color?: string;
        quantity: number;
    };
    price: number;
    shippingFee: number;
    total: number;
    paymentMethod: string;
    isReviewed: boolean;
    rating?: number;
}

// Mock data cho đơn hàng thời trang
const mockFashionOrders: FashionOrder[] = [
    {
        id: 'ORD-12345',
        shopName: 'Fashion Store VN',
        shopId: 'shop-001',
        date: '2023-06-15',
        status: 'completed',
        product: {
            id: 'p1',
            name: 'Áo Thun Unisex Cotton Basic Form Rộng',
            image: 'https://picsum.photos/id/26/300/400',
            brand: 'Local Brand',
            category: 'Áo thun',
            size: 'M',
            color: 'Đen',
            quantity: 1
        },
        price: 250000,
        shippingFee: 30000,
        total: 280000,
        paymentMethod: 'COD',
        isReviewed: true,
        rating: 5
    },
    {
        id: 'ORD-12346',
        shopName: 'Levi\'s Official Store',
        shopId: 'shop-002',
        date: '2023-06-10',
        status: 'processing',
        product: {
            id: 'p2',
            name: 'Quần Jean Nam Slimfit',
            image: 'https://picsum.photos/id/21/300/400',
            brand: 'Levi\'s',
            category: 'Quần jean',
            size: '32',
            color: 'Xanh đậm',
            quantity: 1
        },
        price: 500000,
        shippingFee: 0,
        total: 500000,
        paymentMethod: 'Thẻ tín dụng',
        isReviewed: false
    },
    {
        id: 'ORD-12347',
        shopName: 'Nike Vietnam',
        shopId: 'shop-003',
        date: '2023-05-28',
        status: 'shipping',
        product: {
            id: 'p3',
            name: 'Giày Sneaker Nike Air Force 1',
            image: 'https://picsum.photos/id/15/300/400',
            brand: 'Nike',
            category: 'Giày sneaker',
            size: '42',
            color: 'Trắng',
            quantity: 1
        },
        price: 2800000,
        shippingFee: 50000,
        total: 2850000,
        paymentMethod: 'Chuyển khoản',
        isReviewed: false
    },
    {
        id: 'ORD-12348',
        shopName: 'Zara Fashion House',
        shopId: 'shop-004',
        date: '2023-05-15',
        status: 'cancelled',
        product: {
            id: 'p4',
            name: 'Đầm Maxi Hoa Nhí Nữ',
            image: 'https://picsum.photos/id/90/300/400',
            brand: 'Zara',
            category: 'Đầm',
            size: 'S',
            color: 'Hoa nhí',
            quantity: 2
        },
        price: 850000,
        shippingFee: 30000,
        total: 880000,
        paymentMethod: 'MoMo',
        isReviewed: false
    },
    {
        id: 'ORD-12349',
        shopName: 'Uniqlo Store',
        shopId: 'shop-005',
        date: '2023-06-01',
        status: 'pending',
        product: {
            id: 'p5',
            name: 'Áo Hoodie Nỉ Nam Oversize',
            image: 'https://picsum.photos/id/28/300/400',
            brand: 'Uniqlo',
            category: 'Áo hoodie',
            size: 'L',
            color: 'Xám',
            quantity: 1
        },
        price: 750000,
        shippingFee: 30000,
        total: 780000,
        paymentMethod: 'COD',
        isReviewed: false
    }
];

const OrderHistory = () => {
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState<string | null>('all');


    // Get status badge
    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'completed':
                return <Badge color="green" variant="light">Đã giao hàng</Badge>;
            case 'processing':
                return <Badge color="blue" variant="light">Đang xử lý</Badge>;
            case 'shipping':
                return <Badge color="indigo" variant="light">Đang giao hàng</Badge>;
            case 'cancelled':
                return <Badge color="red" variant="light">Đã hủy</Badge>;
            case 'pending':
                return <Badge color="yellow" variant="light">Chờ xác nhận</Badge>;
            default:
                return <Badge variant="light">Không xác định</Badge>;
        }
    };

    // Lọc đơn hàng theo tab
    const getFilteredOrders = () => {
        if (activeTab === 'all') return mockFashionOrders;
        return mockFashionOrders.filter(order => order.status === activeTab);
    };

    const filteredOrders = getFilteredOrders();

    return (
        <>
            <Title order={4} className="mb-4 text-slate-800">Đơn hàng của tôi</Title>

            <Tabs value={activeTab} onChange={setActiveTab} mb="md">
                <Tabs.List>
                    <Tabs.Tab value="all" leftSection={<FiArchive size={16} />}>
                        Tất cả
                    </Tabs.Tab>
                    <Tabs.Tab value="pending" leftSection={<FiClock size={16} />}>
                        Chờ xác nhận
                    </Tabs.Tab>
                    <Tabs.Tab value="processing" leftSection={<FiTruck size={16} />}>
                        Đang xử lý
                    </Tabs.Tab>
                    <Tabs.Tab value="shipping" leftSection={<FiTruck size={16} />}>
                        Đang giao hàng
                    </Tabs.Tab>
                    <Tabs.Tab value="completed" leftSection={<FiCheck size={16} />}>
                        Đã giao hàng
                    </Tabs.Tab>
                    <Tabs.Tab value="cancelled" leftSection={<FiX size={16} />}>
                        Đã hủy
                    </Tabs.Tab>
                </Tabs.List>
            </Tabs>

            <Group justify="space-between" mb="md">
                <Text size="sm" color="dimmed">
                    {filteredOrders.length} đơn hàng
                </Text>
                <Group>
                    <Button variant="outline" leftSection={<FiCalendar size={16} />} size="sm">
                        Khoảng thời gian
                    </Button>
                    <Button variant="outline" leftSection={<FiSearch size={16} />} size="sm">
                        Tìm kiếm
                    </Button>
                </Group>
            </Group>

            {loading ? (
                <Stack gap="md">
                    {[1, 2, 3].map(i => (
                        <Paper key={i} withBorder p="md">
                            <Group >
                                <Skeleton height={96} width={96} />
                                <div style={{ flex: 1 }}>
                                    <Skeleton height={20} mb="sm" width="60%" />
                                    <Skeleton height={15} mb="sm" width="40%" />
                                    <Skeleton height={15} mb="sm" width="30%" />
                                    <Skeleton height={30} width="25%" />
                                </div>
                            </Group>
                        </Paper>
                    ))}
                </Stack>
            ) : filteredOrders.length > 0 ? (
                <>
                    <Stack gap="md">
                        {filteredOrders.map((order) => (
                            <Paper key={order.id} withBorder p="md" radius="md">
                                <Group justify="space-between" mb="sm">
                                    <Group gap="sm">
                                        <Text size="sm" fw={600}>{order.shopName}</Text>
                                        <Text size="xs" color="dimmed">{formatDate(order.date)}</Text>
                                        <Button
                                            variant="outline"
                                            size="xs"
                                            component={Link}
                                            to={`/shop/${order.shopId}`}
                                            leftSection={<FaStore size={14} />}
                                        >
                                            Xem shop
                                        </Button>
                                        <Button
                                            variant="light"
                                            size="xs"
                                            leftSection={<FiMessageCircle size={14} />}
                                        >
                                            Chat shop
                                        </Button>
                                    </Group>
                                    {getStatusBadge(order.status)}
                                </Group>

                                <Group  align="flex-start" gap="md">
                                    <Image
                                        src={order.product.image}
                                        className="h-24 w-24 object-cover"
                                        radius="sm"
                                        alt={order.product.name}
                                    />

                                    <div style={{ flex: 1 }}>
                                        <Text fw={500} lineClamp={2} mb="xs">
                                            {order.product.name}
                                        </Text>

                                        <Group gap="md" mb="xs">
                                            {order.product.size && (
                                                <Text size="sm" color="dimmed">
                                                    Size: <Text component="span" fw={500}>{order.product.size}</Text>
                                                </Text>
                                            )}
                                            {order.product.color && (
                                                <Text size="sm" color="dimmed">
                                                    Màu: <Text component="span" fw={500}>{order.product.color}</Text>
                                                </Text>
                                            )}
                                        </Group>

                                        {order.isReviewed && order.rating && (
                                            <Group gap="xs" mb="xs">
                                                <Rating value={order.rating} size="sm" readOnly />
                                                <Text size="sm" color="dimmed">Đã đánh giá</Text>
                                            </Group>
                                        )}
                                    </div>

                                    <div className="text-right">
                                        <Text size="sm" color="dimmed" mb="xs">
                                            SL: <Text component="span" fw={500}>{order.product.quantity}</Text>
                                        </Text>
                                        <Text size="lg" fw={700} color="primary" mb="xs">
                                            {formatPrice(order.total)}
                                        </Text>

                                        {/* Các nút nằm trên 1 hàng ngang */}
                                        <Group gap="xs" justify="flex-end">
                                            <Button
                                                variant="light"
                                                size="xs"
                                                component={Link}
                                                to={`/orders/${order.id}`}
                                                leftSection={<FiEye size={14} />}
                                            >
                                                Chi tiết
                                            </Button>

                                            {order.status === 'completed' && (
                                                <>
                                                    <Button
                                                        variant="outline"
                                                        size="xs"
                                                        leftSection={<FiShoppingCart size={14} />}
                                                    >
                                                        Mua lại
                                                    </Button>
                                                    {!order.isReviewed && (
                                                        <Button
                                                            variant="filled"
                                                            size="xs"
                                                            leftSection={<FiStar size={14} />}
                                                        >
                                                            Đánh giá
                                                        </Button>
                                                    )}
                                                </>
                                            )}

                                            {order.status === 'pending' && (
                                                <Button
                                                    variant="outline"
                                                    color="red"
                                                    size="xs"
                                                    leftSection={<FiX size={14} />}
                                                >
                                                    Hủy đơn
                                                </Button>
                                            )}
                                        </Group>
                                    </div>
                                </Group>
                            </Paper>
                        ))}
                    </Stack>

                    <Group justify="center" mt="xl">
                        <Pagination total={Math.ceil(filteredOrders.length / 5)} value={page} onChange={setPage} />
                    </Group>
                </>
            ) : (
                <Paper withBorder p="xl" radius="md" className="text-center">
                    <FiArchive size={48} className="mx-auto mb-4 text-gray-400" />
                    <Title order={5} mb="xs">Không có đơn hàng nào</Title>
                    <Text size="sm" color="dimmed" mb="lg">
                        Bạn chưa có đơn hàng thời trang nào trong danh mục này
                    </Text>
                    <Button component={Link} to="/products">
                        Khám phá thời trang
                    </Button>
                </Paper>
            )}
        </>
    );
};

export default OrderHistory;