import {
    Box,
    Button,
    Divider,
    Group,
    Image,
    Paper,
    Rating,
    Skeleton,
    Stack,
    Text,
    Title
} from '@mantine/core';
import React, { useEffect, useState } from 'react';
import { FaStore } from 'react-icons/fa';
import {
    FiArrowLeft,
    FiMessageSquare
} from 'react-icons/fi';
import { useNavigate, useParams } from 'react-router-dom';
import { useOrderStatus } from '../../../../hooks/useOrderStatus';
import type { UserOrderDetailDto } from '../../../../types/OrderType';
import Action from './Action';
import AddressInfo from './AddressInfo';
import sampleOrderDetail from './DataSample';
import HistoryStatus from './HistoryStatus';
import LineStatus from './LineStatus';
import PaymentInfo from './PaymentInfo';

// Helper function to format price
const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' })
        .format(price)
        .replace('₫', '')
        .trim() + '₫';
};

export const OrderDetail = () => {
    const { orderId } = useParams<{ orderId: string }>();
    const navigate = useNavigate();
    const { getStatusLabel, getStatusColor } = useOrderStatus();
    const [loading, setLoading] = useState(true);
    const [orderDetail, setOrderDetail] = useState<UserOrderDetailDto>(sampleOrderDetail);
    const [activeStep, setActiveStep] = useState(0);

    // Convert orderHistory to history items for HistoryStatus component
    const historyItems = orderDetail.orderHistory.map(item => ({
        date: new Date(item.timestamp).toLocaleDateString('vi-VN'),
        time: new Date(item.timestamp).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }),
        status: item.status,
        title: item.title,
        description: item.title,
        hasImage: item.status === 'DELIVERED'
    }));

    useEffect(() => {
        // In a real app, you would fetch the order details here
        setLoading(true);

        // For demonstration, select a sample based on orderId or use default
        let selectedSample = sampleOrderDetail;
        // if (orderId) {
        //     if (orderId.includes('pending')) selectedSample = orderDetailSamples.pending;
        //     else if (orderId.includes('preparing')) selectedSample = orderDetailSamples.preparing;
        //     else if (orderId.includes('shipping')) selectedSample = orderDetailSamples.shipping;
        //     else if (orderId.includes('delivered')) selectedSample = orderDetailSamples.delivered;
        //     else if (orderId.includes('reviewed')) selectedSample = orderDetailSamples.reviewed;
        // }

        setTimeout(() => {
            setOrderDetail({
                ...selectedSample,
                shopOrderId: orderId || selectedSample.shopOrderId
            });
            setLoading(false);
        }, 500); // Added a small delay to simulate loading
    }, [orderId]);

    useEffect(() => {
        // Set active step based on order status
        if (orderDetail) {
            switch (orderDetail.shopOrderStatus) {
                case 'PENDING_CONFIRMATION':
                    setActiveStep(0);
                    break;
                case 'PREPARING':
                    setActiveStep(1);
                    break;
                case 'SHIPPING':
                case 'IN_TRANSIT':
                    setActiveStep(2);
                    break;
                case 'DELIVERED':
                    setActiveStep(orderDetail.isReviewed ? 4 : 3);
                    break;
                default:
                    setActiveStep(0);
            }
        }
    }, [orderDetail]);

    if (loading) {
        return (
            <Box>
                <Skeleton height={30} width={200} mb="lg" />
                <Skeleton height={200} mb="lg" />
                <Skeleton height={300} mb="lg" />
                <Skeleton height={200} />
            </Box>
        );
    }

    return (
        <Box>
            {/* Header with back button and order ID + status */}
            <Group justify="space-between" mb="md" wrap="nowrap">
                <Button
                    variant="subtle"
                    leftSection={<FiArrowLeft size={16} />}
                    onClick={() => navigate('/settings/orders')}
                >
                    Trở về
                </Button>
                <Group gap="md">
                    <Title order={4} fw={400} size={"sm"} className="">
                        Mã đơn: <span className='underline'> #{orderDetail.shopOrderId.substring(0, 13)}</span>
                    </Title>
                    | <Text size='sm' color={getStatusColor(orderDetail.shopOrderStatus)}>
                        {getStatusLabel(orderDetail.shopOrderStatus).toUpperCase()}
                    </Text>
                </Group>
            </Group>

            <Divider my={0} />

            {/* Order Progress Stepper */}
            <Box className='pt-10 pb-6'>
                <LineStatus activeStep={activeStep} />

                {/* Action Buttons Section */}
                <Action
                    status={orderDetail.shopOrderStatus}
                    statusLabel={getStatusLabel(orderDetail.shopOrderStatus)}
                    isReviewed={orderDetail.isReviewed}
                />
            </Box>

            <Divider my="lg" />

            {/* Combined Address and History Section */}
            <Box>
                <Group align="flex-start" gap="md" style={{ flexWrap: 'nowrap' }}>
                    {/* Left Column - Delivery Address */}
                    <Box style={{ flex: '3' }}>
                        <AddressInfo
                            name={orderDetail.address.receiverOrSenderName}
                            phone={orderDetail.address.phoneNumber}
                            address={orderDetail.address.detailAddress}
                            title="Địa chỉ nhận hàng"
                            shippingCarrier="SPX Express"
                            trackingNumber="SPXVN057427361409"
                        />
                    </Box>

                    {/* Right Column - Order History */}
                    <Box style={{ flex: '7' }}>
                        <HistoryStatus
                            historyItems={historyItems}
                            title="Lịch sử đơn hàng"
                            initialCollapsed={true}
                            itemsToShowWhenCollapsed={3}
                        />
                    </Box>
                </Group>
            </Box>

            <Divider my="lg" />

            {/* orderItemList */}
            <Box mb="lg">
                <Paper withBorder p="md" radius="md">
                    <Group justify="apart" mb="md">
                        <Group>
                            <FaStore size={18} className="text-blue-500" />
                            <Title order={4}>{orderDetail.shopName}</Title>
                        </Group>
                        <Group>
                            <Button
                                variant="light"
                                size="xs"
                                leftSection={<FiMessageSquare size={14} />}
                            >
                                Chat
                            </Button>
                            <Button
                                variant="outline"
                                size="xs"
                                leftSection={<FaStore size={14} />}
                                onClick={() => navigate(`/shop/${orderDetail.shopId}`)}
                            >
                                Xem Shop
                            </Button>
                        </Group>
                    </Group>

                    <Divider my="md" />

                    <Stack gap="sm" mb="md">
                        {orderDetail.productItems.map((product, index) => (
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

                    <Divider my="md" />

                    {/* Payment Information Table */}
                    <PaymentInfo
                        totalProductCost={orderDetail.totalProductCost}
                        shippingFee={orderDetail.shippingFee}
                        shippingDiscount={orderDetail.shippingDiscount}
                        totalCost={orderDetail.totalCost}
                        paymentMethod="SPayLater"
                    />
                </Paper>
            </Box>
        </Box>
    );
};

export default OrderDetail;
