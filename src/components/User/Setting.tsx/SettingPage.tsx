import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    Group,
    NavLink,
    Paper,
    Select,
    Stack,
    Switch,
    Text,
    Title
} from '@mantine/core';
import { useState } from 'react';
import {
    FiBell,
    FiLock,
    FiSave,
    FiSettings,
    FiUser
} from 'react-icons/fi';
import Breadcrumbs from './Breadcrumbs';
import Infor from './Infor';
import Notification from './Notification';
import Security from './Security';

// Breadcrumbs component


const SettingPage = () => {
    // Tab hiện tại
    const [activeTab, setActiveTab] = useState<string>('profile');

    // Render nội dung tab
    const renderTabContent = () => {
        switch (activeTab) {
            case 'profile':
                return <Infor />;

            case 'security':
                return <Security />;

            case 'notifications':
                return <Notification />

            case 'preferences':
                return (
                    <>
                        <Title order={4} className="mb-4 text-slate-800">Tùy chọn người dùng</Title>

                        <Box>
                            <Text size="sm" fw={600} className="mb-3 text-slate-700">
                                Ngôn ngữ và khu vực
                            </Text>

                            <Group grow className="mb-4">
                                <Select
                                    label="Ngôn ngữ"
                                    placeholder="Chọn ngôn ngữ"
                                    data={[
                                        { value: 'vi', label: 'Tiếng Việt' },
                                        { value: 'en', label: 'English' },
                                    ]}
                                    defaultValue="vi"
                                />

                                <Select
                                    label="Múi giờ"
                                    placeholder="Chọn múi giờ"
                                    data={[
                                        { value: 'Asia/Ho_Chi_Minh', label: '(GMT+7) Hồ Chí Minh' },
                                        { value: 'Asia/Bangkok', label: '(GMT+7) Bangkok' },
                                        { value: 'Asia/Singapore', label: '(GMT+8) Singapore' },
                                        { value: 'Asia/Tokyo', label: '(GMT+9) Tokyo' },
                                    ]}
                                    defaultValue="Asia/Ho_Chi_Minh"
                                />
                            </Group>

                            <Divider className="my-4" />

                            <Text size="sm" fw={600} className="mb-3 text-slate-700">
                                Hiển thị
                            </Text>

                            <Stack gap="xs" className="mb-4">
                                <Group justify="apart">
                                    <Text size="sm">Chế độ tối</Text>
                                    <Switch />
                                </Group>

                                <Group justify="apart">
                                    <Text size="sm">Hiệu ứng chuyển động</Text>
                                    <Switch defaultChecked />
                                </Group>

                                <Group justify="apart">
                                    <Text size="sm">Hiển thị giá có VAT</Text>
                                    <Switch defaultChecked />
                                </Group>
                            </Stack>

                            <Button
                                className="mt-2 bg-primary hover:bg-picton-blue-600"
                                leftSection={<FiSave size={16} />}
                            >
                                Lưu cài đặt
                            </Button>
                        </Box>
                    </>
                );

            default:
                return null;
        }
    };

    return (
        <Container size="xl" className="py-6">
            {/* Breadcrumbs */}
            <Breadcrumbs />

            <Grid gutter="md">
                {/* Sidebar Navigation */}
                <Grid.Col span={{ base: 12, md: 3 }}>
                    <Paper shadow="sm" radius="md" className="overflow-hidden">
                        <div className="p-4">
                            <NavLink
                                label="Thông tin cá nhân"
                                leftSection={<FiUser size={16} />}
                                active={activeTab === 'profile'}
                                onClick={() => setActiveTab('profile')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Bảo mật"
                                leftSection={<FiLock size={16} />}
                                active={activeTab === 'security'}
                                onClick={() => setActiveTab('security')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Thông báo"
                                leftSection={<FiBell size={16} />}
                                active={activeTab === 'notifications'}
                                onClick={() => setActiveTab('notifications')}
                                className="font-medium rounded-md"
                            />
                            <NavLink
                                label="Tùy chọn"
                                leftSection={<FiSettings size={16} />}
                                active={activeTab === 'preferences'}
                                onClick={() => setActiveTab('preferences')}
                                className="font-medium rounded-md"
                            />
                        </div>
                    </Paper>
                </Grid.Col>

                {/* Main Content */}
                <Grid.Col span={{ base: 12, md: 9 }}>
                    <Paper shadow="sm" radius="md" p="lg" className="bg-white">
                        {renderTabContent()}
                    </Paper>
                </Grid.Col>
            </Grid>
        </Container>
    );
};

export default SettingPage;