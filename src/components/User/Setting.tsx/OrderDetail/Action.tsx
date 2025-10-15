import React from 'react';
import { Box, Button, Group, Text } from '@mantine/core';
import { FiShoppingBag, FiStar } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';

interface ActionProps {
    status: string;
    statusLabel: string;
    isReviewed: boolean;
}

const Action: React.FC<ActionProps> = ({ status, statusLabel, isReviewed }) => {
    const navigate = useNavigate();

    const getStatusDescription = () => {
        switch (status) {
            case 'PENDING_CONFIRMATION':
                return '(Shop sẽ xác nhận đơn hàng trong vòng 24 giờ)';
            case 'PREPARING':
                return '(Shop đang chuẩn bị hàng)';
            case 'SHIPPING':
            case 'IN_TRANSIT':
                return '(Đơn hàng đang được giao đến bạn)';
            case 'DELIVERED':
                return !isReviewed ? '(Đánh giá sản phẩm để nhận thêm điểm thưởng)' : '';
            default:
                return '';
        }
    };

    return (
        <Box className="mt-8 bg-gray-50 p-4 rounded-md">
            <Group justify="space-between" align="center">
                <div>
                    <Group gap="xs">
                        <Text size="sm" fw={600}>
                            {statusLabel}
                        </Text>
                        <Text size="xs" color="dimmed">
                            {getStatusDescription()}
                        </Text>
                    </Group>
                </div>
                <Group>
                    {/* Contact seller button - always visible */}
                    <Button
                        variant="light"
                        size="sm"
                        className="bg-gray-100 hover:bg-gray-200 text-gray-700"
                    >
                        Liên hệ người bán
                    </Button>

                    {/* Buy again button - visible for completed orders */}
                    {status === 'DELIVERED' && (
                        <Button
                            variant="outline"
                            size="sm"
                            leftSection={<FiShoppingBag size={14} />}
                            onClick={() => navigate('/products')}
                        >
                            Mua lại
                        </Button>
                    )}

                    {/* Review button - visible for delivered orders that haven't been reviewed */}
                    {status === 'DELIVERED' && !isReviewed && (
                        <Button
                            variant="filled"
                            size="sm"
                            leftSection={<FiStar size={14} />}
                        >
                            Đánh giá sản phẩm
                        </Button>
                    )}

                    {/* Cancel button - visible for pending orders */}
                    {status === 'PENDING_CONFIRMATION' && (
                        <Button
                            variant="outline"
                            color="red"
                            size="sm"
                        >
                            Hủy đơn hàng
                        </Button>
                    )}
                </Group>
            </Group>
        </Box>
    );
};

export default Action;
