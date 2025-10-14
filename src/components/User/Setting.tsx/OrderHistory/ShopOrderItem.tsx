import {
    Box,
    Button,
    Divider,
    Group,
    Image,
    Paper,
    Rating,
    Stack,
    Text
} from '@mantine/core';
import React, { useState } from 'react';
import { FaStore } from 'react-icons/fa';
import {
    FiEye,
    FiMessageCircle,
    FiShoppingCart,
    FiStar,
    FiX
} from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getRejectReasons } from '../../../../data/RejectData';
import { type UserOrderItemDto } from '../../../../types/OrderType';
import { formatDate, formatPrice } from '../../../../untils/Untils';
import RejectModal from '../../../RejectModal/RejectOrder';

// Map status to display labels
const getStatusLabel = (status: string): string => {
    switch (status.toUpperCase()) {
        case 'DELIVERED':
            return 'Đã giao hàng';
        case 'PREPARING':
            return 'Đang xử lý';
        case 'SHIPPING':
            return 'Đang giao hàng';
        case 'CLOSED':
            return 'Đã hủy';
        case 'PENDING_CONFIRMATION':
            return 'Chờ xác nhận';
        case 'INIT_PROCESSING':
            return 'Đang xử lý';
        default:
            return 'Không xác định';
    }
};

interface ShopOrderItemProps {
    order: UserOrderItemDto;
    onCancelOrder?: (orderId: string, reason: string) => void;
    onBuyAgain?: (productIds: string[]) => void;
    onReview?: (productId: string) => void;
}

const ShopOrderItem: React.FC<ShopOrderItemProps> = ({
    order,
    onCancelOrder,
    onBuyAgain,
    onReview
}) => {
    const [rejectModalOpen, setRejectModalOpen] = useState(false);
    const handleCancelOrder = () => {
        setRejectModalOpen(true);
    };

    const handleBuyAgain = () => {
        if (onBuyAgain) {
            const productIds = order.productOrderItemDtoSet.map(product => product.productId);
            onBuyAgain(productIds);
        }
    };

    const handleReview = (productId: string) => {
        if (onReview) {
            onReview(productId);
        }
    };

     const handleRejectConfirm = (reason: string) => {
        if (onCancelOrder) {
            onCancelOrder(order.shopOrderId, reason);
        }
    }

    // Get the primary order status
    const primaryStatus = order.orderStatus[0] || 'PENDING_CONFIRMATION';
    const isPending = primaryStatus === 'PENDING_CONFIRMATION';
    const isCompleted = primaryStatus === 'DELIVERED';

    return (
        <Paper withBorder p="md" radius="md">
            {/* Shop info and order status */}
            <Group justify="space-between" mb="sm">
                <Group gap="sm">
                    <Text size="sm" fw={600}>{order.shopOrderName}</Text>
                    <Text size="xs" color="dimmed"> {formatDate(order.updateAt)}</Text>
                    <Button
                        variant="outline"
                        size="xs"
                        component={Link}
                        to={`/shop/${order.shopOrderId}`}
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
                <Text size='sm'>{getStatusLabel(primaryStatus)}</Text>
            </Group>

            {/* Products */}
            <Stack gap="sm" mb="md">
                {order.productOrderItemDtoSet.map((product, index) => (
                    <React.Fragment key={index}>
                        {index > 0 && <Divider />}
                        <Group align="flex-start" gap="md">
                            <Image
                                src={product.productImage}
                                className="h-20 w-20 object-cover"
                                radius="sm"
                                alt={product.productName}
                            />

                            <div style={{ flex: 1 }}>
                                <Text fw={500} lineClamp={2} >
                                    {product.productName}
                                </Text>

                                <Group gap="md" mt="xs">
                                    {product.variant && (
                                        <Text size="xs" color="dimmed">
                                            {product.variant}
                                        </Text>
                                    )}
                                </Group>

                                {product.isReviewed && (
                                    <Group gap="xs" mb="xs">
                                        <Rating value={5} size="sm" readOnly />
                                        <Text size="xs" color="dimmed">Đã đánh giá</Text>
                                    </Group>
                                )}
                            </div>

                            <div className="text-right">
                                <Text size="xs" color="dimmed" mb="xs">
                                    SL: <Text component="span" fw={500}>{product.quantity}</Text>
                                </Text>
                                <Text size="sm" fw={600} color="primary" mb="xs">
                                    {formatPrice(product.price)}
                                </Text>
                            </div>
                        </Group>
                    </React.Fragment>
                ))}
            </Stack>

            {/* Order summary */}
            <Box className="bg-gray-50 p-2 rounded-md">
                <Group justify="space-between">
                    <Text size='sm' fw={500}>Tổng thanh toán:</Text>
                    <Text size="sm" fw={700} color="primary">
                        {formatPrice(order.totalPrice)}
                    </Text>
                </Group>
            </Box>

            {/* Action buttons */}
            <Group justify="flex-end" mt="sm">
                <Button
                    variant="light"
                    size="xs"
                    component={Link}
                    to={`/orders/${order.shopOrderId}`}
                    leftSection={<FiEye size={14} />}
                >
                    Chi tiết
                </Button>

                {isCompleted && (
                    <>
                        <Button
                            variant="outline"
                            size="xs"
                            leftSection={<FiShoppingCart size={14} />}
                            onClick={handleBuyAgain}
                        >
                            Mua lại
                        </Button>
                        {order.productOrderItemDtoSet.some(p => !p.isReviewed) && (
                            <Button
                                variant="filled"
                                size="xs"
                                leftSection={<FiStar size={14} />}
                                onClick={() => {
                                    const nonReviewedProduct = order.productOrderItemDtoSet.find(p => !p.isReviewed);
                                    if (nonReviewedProduct) {
                                        handleReview(nonReviewedProduct.productId);
                                    }
                                }}
                            >
                                Đánh giá
                            </Button>
                        )}
                    </>
                )}

                {isPending && (
                    <Button
                        variant="outline"
                        color="red"
                        size="xs"
                        leftSection={<FiX size={14} />}
                        onClick={handleCancelOrder}
                    >
                        Hủy đơn
                    </Button>
                )}
            </Group>
            <RejectModal
                data={getRejectReasons('order-user')}
                opened={rejectModalOpen}
                onClose={() => setRejectModalOpen(false)}
                onConfirm={handleRejectConfirm}
                orderId={order.shopOrderId}
            />
        </Paper>
    );
};

export default ShopOrderItem;
