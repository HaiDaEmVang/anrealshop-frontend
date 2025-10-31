import {
    Container,
    Grid,
    NavLink,
    Paper
} from '@mantine/core';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import {
    FiAward,
    FiBell,
    FiCreditCard,
    FiHeart,
    FiLock,
    FiMapPin,
    FiRotateCcw,
    FiSettings,
    FiShoppingBag,
    FiStar,
    FiTag,
    FiUser
} from 'react-icons/fi';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Notification from './Notification';
import { OrderDetail } from './OrderDetail/OrderDetailPage';
import OrderHistory from './OrderHistory/OrderHistoryPage';
import Preferences from './Preferences';
import Security from './Security/Security';
import { AddressPage } from './Address/AddressPage';
import Profile from './Profile/Profile';

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
            path: '/profile',
            label: 'Thông tin cá nhân',
            icon: <FiUser size={16} />,
            component: <Profile />
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
            component: <AddressPage />
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

    const isActive = (path: string) => {
        return location.pathname.substring(0, `/settings${path}`.length) === `/settings${path}`;
    };

    // Animation variants
    const containerVariants: Variants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.05
            }
        }
    };

    const itemVariants: Variants = {
        hidden: { opacity: 0, x: -20 },
        visible: {
            opacity: 1,
            x: 0,
            transition: {
                duration: 0.3,
                ease: "easeOut"
            }
        }
    };

    const contentVariants: Variants = {
        initial: { opacity: 0, y: 20 },
        animate: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.4,
                ease: [0.4, 0, 0.2, 1]
            }
        },
        exit: {
            opacity: 0,
            y: -20,
            transition: {
                duration: 0.2,
                ease: [0.4, 0, 1, 1]
            }
        }
    };

    return (
        <Container size="xl" className="pt-6">
            {/* Breadcrumbs */}
            <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Breadcrumbs />
            </motion.div>

            <Grid gutter="md" mb={"md"}>
                {/* Sidebar Navigation */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut" }}
                    >
                        <Paper shadow="sm" radius="md" className="overflow-hidden h-full">
                            <motion.div
                                className="p-4"
                                variants={containerVariants}
                                initial="hidden"
                                animate="visible"
                            >
                                {navItems.map((item) => (
                                    <motion.div
                                        key={item.path}
                                        variants={itemVariants}
                                        whileHover={{
                                            scale: 1.02,
                                            transition: { duration: 0.2 }
                                        }}
                                        whileTap={{ scale: 0.98 }}
                                    >
                                        <NavLink
                                            label={item.label}
                                            leftSection={item.icon}
                                            active={isActive(item.path)}
                                            onClick={() => navigate(`/settings${item.path}`)}
                                            className="font-medium rounded-md"
                                        />
                                    </motion.div>
                                ))}
                            </motion.div>
                        </Paper>
                    </motion.div>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 9 }} className='min-h-[100vh]'>
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.4, ease: "easeOut", delay: 0.1 }}
                    >
                        <Paper shadow="sm" radius="md" p="lg" className="bg-white">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={location.pathname}
                                    variants={contentVariants}
                                    initial="initial"
                                    animate="animate"
                                    exit="exit"
                                >
                                    <Routes>
                                        <Route path="/" element={<Navigate to="/settings/info" replace />} />
                                        {navItems.map((item) => (
                                            <Route
                                                key={item.path}
                                                path={item.path}
                                                element={item.component}
                                            />
                                        ))}
                                        <Route path="/orders/:orderId" element={<OrderDetail />} />
                                    </Routes>
                                </motion.div>
                            </AnimatePresence>
                        </Paper>
                    </motion.div>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default SettingPage;