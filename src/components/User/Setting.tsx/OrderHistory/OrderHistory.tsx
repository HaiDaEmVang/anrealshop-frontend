import {
    Button,
    Paper,
    Stack,
    Text,
    Title
} from '@mantine/core';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { OrderStatusDefaultDataUser } from '../../../../data/OrderData';
import { useOrder, type SearchType } from '../../../../hooks/useOrder';
import type { ShopOrderStatus, UserOrderItemDto } from '../../../../types/OrderType';
import FilterByStatus from '../../../Myshop/Order/OrderPage/Filter/FilterByStatus';
import Pagination from '../../../Myshop/Product/Managerment/ProductView/Pagination';
import { PaginationSkeleton } from '../../../Myshop/Product/Managerment/Skeleton';
import OrderFilter from './OrderFilter';
import ShopOrderItem from './ShopOrderItem';
import OrderSkeleton from './Skeleton';



const OrderHistory = () => {
    const [activePage, setActivePage] = useState(1);
    const [activeStatus, setActiveStatus] = useState<ShopOrderStatus>("PENDING_CONFIRMATION");
    const [searchTerm, setSearchTerm] = useState('');
    const [searchType, setSearchType] = useState<SearchType>("order_code");
    const [sortBy, setSortBy] = useState<string | null>("newest");

    const [itemsPerPage] = useState(10);
    const [data, setData] = useState<UserOrderItemDto[]>([]);
    const {
        totalCount,
        totalPages,
        isLoading,

        orders,
        fetchOrders,
    } = useOrder({
        initialParams: {
            page: 0,
            limit: itemsPerPage,
            status: activeStatus,
        },
        mode: 'user',
    });

    const loadOrders = useCallback(() => {

        fetchOrders({
            page: activePage - 1,
            limit: itemsPerPage,
            status: activeStatus,
            search: searchTerm,
            searchType: searchType,
            sortBy: sortBy || undefined,
        });
    }, [activePage, activeStatus, sortBy, searchTerm, fetchOrders]);

    useEffect(() => {
        loadOrders();
    }, [activeStatus, activePage]);

    useEffect(() => {
        setData(orders);
    }, [orders]);

    const handleStatusChange = (status: ShopOrderStatus | "all") => {
        setActiveStatus(status.toUpperCase() as ShopOrderStatus);
        setActivePage(1);
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setSortBy("newest");
        loadOrders();
    };

    const handleApplyFilters = () => {
        loadOrders();
    };

    // Handlers for ShopOrderItem actions
    const handleCancelOrder = (orderId: string) => {
        console.log(`Cancel order: ${orderId}`);
        // Implement cancel order logic
    };

    const handleBuyAgain = (productIds: string[]) => {
        console.log(`Buy again products: ${productIds.join(', ')}`);
        // Implement buy again logic
    };

    const handleReview = (productId: string) => {
        console.log(`Review product: ${productId}`);
        // Implement review logic
    };

    return (
        <>
            <Title order={4} className="!mb-4 text-slate-800">Đơn hàng của tôi</Title>

            {/* Filter by status */}
            <FilterByStatus
                selectedStatus={activeStatus}
                onStatusChange={handleStatusChange}
                orderStatusData={OrderStatusDefaultDataUser}
                isShowCount={false}
            />

            {/* Search and sort */}
            <OrderFilter
                searchTerm={searchTerm}
                searchTypeValue={searchType}
                sortBy={sortBy}
                onSearchChange={setSearchTerm}
                onSearchTypeValueChange={setSearchType}
                onSortByChange={setSortBy}
                onClearAll={handleClearFilters}
                onFetchWithParam={handleApplyFilters}
            />

            {isLoading ? (
                <OrderSkeleton count={3} />
            ) : data.length > 0 ? (
                <>
                    <Stack gap="md" mt="md">
                        {data.map((order) => (
                            <ShopOrderItem
                                key={order.shopOrderId}
                                order={order}
                                onCancelOrder={handleCancelOrder}
                                onBuyAgain={handleBuyAgain}
                                onReview={handleReview}
                            />
                        ))}
                    </Stack>

                    <Suspense fallback={<PaginationSkeleton />}>
                        <Pagination
                            currentPage={activePage}
                            totalPages={totalPages}
                            totalItems={totalCount}
                            itemsPerPage={itemsPerPage}
                            onPageChange={setActivePage}
                        />
                    </Suspense>
                </>
            ) : (
                <Paper withBorder p="xl" radius="md" className="text-center">
                    <Text size="lg" fw={500} mb="xs">Không có đơn hàng nào</Text>
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