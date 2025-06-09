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
    FiShoppingBag
} from 'react-icons/fi';
import { Navigate, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import Breadcrumbs from './Breadcrumbs';
import Infor from './Infor';
import Notification from './Notification';
import Security from './Security';
import Preferences from './Preferences';
import OrderHistory from './OrderHistory/OrderHistory';

const SettingPage = () => {
    const location = useLocation();
    const navigate = useNavigate();
    
    // Determine which path is active
    const isActive = (path: string) => {
        return location.pathname === `/settings${path}`;
    };

    return (
        <Container size="xl" className="py-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            <Grid gutter="md">
                {/* Sidebar Navigation */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="sm" radius="md" className="overflow-hidden sticky top-4">
                        <div className="p-4">
                            <NavLink
                                label="Thông tin cá nhân"
                                leftSection={<FiUser size={16} />}
                                active={isActive('/info')}
                                onClick={() => navigate('/settings/info')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Bảo mật"
                                leftSection={<FiLock size={16} />}
                                active={isActive('/security')}
                                onClick={() => navigate('/settings/security')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Thông báo"
                                leftSection={<FiBell size={16} />}
                                active={isActive('/notifications')}
                                onClick={() => navigate('/settings/notifications')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Tùy chọn"
                                leftSection={<FiSettings size={16} />}
                                active={isActive('/preferences')}
                                onClick={() => navigate('/settings/preferences')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Quản lý đơn hàng"
                                leftSection={<FiShoppingBag size={16} />}
                                active={isActive('/orders')}
                                onClick={() => navigate('/settings/orders')}
                                className="font-medium rounded-md"
                            />
                        </div>
                    </Paper>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="bg-white">
                        <Routes>
                            <Route path="/" element={<Navigate to="/settings/info" replace />} />
                            <Route path="/info" element={<Infor />} />
                            <Route path="/security" element={<Security />} />
                            <Route path="/notifications" element={<Notification />} />
                            <Route path="/preferences" element={<Preferences />} />
                            <Route path="/orders" element={<OrderHistory />} />
                        </Routes>
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default SettingPage;