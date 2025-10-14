import {
    Box,
    Container,
    Grid,
    NavLink,
    Paper,
} from '@mantine/core';
import {
    FiBell,
    FiLock,
    FiSettings,
    FiUser,
    FiShoppingBag,
    FiHeart,
    FiCreditCard,
    FiMapPin,
    FiStar,
    FiTag,
    FiRotateCcw,
    FiAward
} from 'react-icons/fi';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Infor from './Infor';
import Notification from './Notification';
import Security from './Security';
import Preferences from './Preferences';
import OrderHistory from './OrderHistory/OrderHistory';

// Define navigation item interface
interface NavItem {
    path: string;
    label: string;
    icon: React.ReactNode;
    component: React.ReactNode;
}

const SettingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();

    // Navigation configuration
    const navItems: NavItem[] = [
        {
            path: '/info',
            label: 'Thông tin cá nhân',
            icon: <FiUser size={16} />,
            component: <Infor />
        },
        {
            path: '/security',
            label: 'Bảo mật',
            icon: <FiLock size={16} />,
            component: <Security />
        },
        {
            path: '/notifications',
            label: 'Thông báo',
            icon: <FiBell size={16} />,
            component: <Notification />
        },
        {
            path: '/preferences',
            label: 'Tùy chọn',
            icon: <FiSettings size={16} />,
            component: <Preferences />
        },
        {
            path: '/orders',
            label: 'Quản lý đơn hàng',
            icon: <FiShoppingBag size={16} />,
            component: <OrderHistory />
        },
        {
            path: '/wishlist',
            label: 'Sản phẩm yêu thích',
            icon: <FiHeart size={16} />,
            component: <div>Sản phẩm yêu thích</div> // Placeholder component
        },
        {
            path: '/payment',
            label: 'Phương thức thanh toán',
            icon: <FiCreditCard size={16} />,
            component: <div>Phương thức thanh toán</div> // Placeholder component
        },
        {
            path: '/addresses',
            label: 'Địa chỉ giao hàng',
            icon: <FiMapPin size={16} />,
            component: <div>Địa chỉ giao hàng</div> // Placeholder component
        },
        {
            path: '/reviews',
            label: 'Đánh giá của tôi',
            icon: <FiStar size={16} />,
            component: <div>Đánh giá của tôi</div> // Placeholder component
        },
        {
            path: '/coupons',
            label: 'Mã giảm giá',
            icon: <FiTag size={16} />,
            component: <div>Mã giảm giá</div> // Placeholder component
        },
        {
            path: '/returns',
            label: 'Trả hàng & Hoàn tiền',
            icon: <FiRotateCcw size={16} />,
            component: <div>Trả hàng & Hoàn tiền</div> // Placeholder component
        },
        {
            path: '/loyalty',
            label: 'Điểm thưởng',
            icon: <FiAward size={16} />,
            component: <div>Điểm thưởng</div> // Placeholder component
        }
    ];

    // Determine which path is active
    const isActive = (path: string) => {
        return location.pathname === `/settings${path}`;
    };

    return (
        <Container size="xl" className="pt-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            <Grid gutter="md">
                {/* Sidebar Navigation */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="sm" radius="md" className="overflow-hidden sticky top-4 h-[96vh]">
                        <div className="p-4">
                            {navItems.map((item) => (
                                <NavLink
                                    key={item.path}
                                    label={item.label}
                                    leftSection={item.icon}
                                    active={isActive(item.path)}
                                    onClick={() => navigate(`/settings${item.path}`)}
                                    className="font-medium rounded-md"
                                />
                            ))}
                        </div>
                    </Paper>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="bg-white">
                        <Routes>
                            <Route path="/" element={<Navigate to="/settings/info" replace />} />
                            {navItems.map((item) => (
                                <Route
                                    key={item.path}
                                    path={item.path}
                                    element={item.component}
                                />
                            ))}
                        </Routes>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default SettingPage;