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
import showSuccessNotification from '../../../Toast/NotificationSuccess';



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
        rejectShopOrder,
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

    const handleCancelOrder = useCallback((orderItemId: string, reason: string) => {
        rejectShopOrder(orderItemId, reason)
            .then(() => {
                loadOrders();
            });
    }, [rejectShopOrder, loadOrders]);

    const handleBuyAgain = (productIds: string[]) => {
        showSuccessNotification("Hệ thống", "Chức năng mua lại đang được phát triển")
    };

    const handleReview = (productId: string) => {
        showSuccessNotification("Hệ thống", "Chức năng mua lại đang được phát triển")
    };

    return (
        <div className=' overflow-hidden h-[94vh]'>
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
                <div className='flex flex-col h-[77vh]'>
                    <Stack gap="md" mt="md" className='overflow-y-scroll'>
                        {data.map((order) => (
                            <ShopOrderItem
                                key={order.shopOrderId}
                                order={order}
                                onCancelOrder={handleCancelOrder}
                                onBuyAgain={handleBuyAgain}
                                onReview={handleReview}
                            />
                        ))}
                    <div className="flex-1">
                        <Suspense fallback={<PaginationSkeleton />} >
                            <Pagination
                                currentPage={activePage}
                                totalPages={totalPages}
                                totalItems={totalCount}
                                itemsPerPage={itemsPerPage}
                                onPageChange={setActivePage}
                            />
                        </Suspense>
                    </div>
                    </Stack>

                </div>
            ) : (
                <Paper withBorder p="xl" radius="md" className="text-center h-[72vh]">
                    <Text size="lg" fw={500} mb="xs">Không có đơn hàng nào</Text>
                    <Text size="sm" color="dimmed" mb="lg">
                        Bạn chưa có đơn hàng thời trang nào trong danh mục này
                    </Text>
                    <Button component={Link} to="/products">
                        Khám phá thời trang
                    </Button>
                </Paper>
            )}
        </div>
    );
};

export default OrderHistory;