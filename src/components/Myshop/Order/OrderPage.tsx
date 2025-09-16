import { Anchor, Box, Breadcrumbs, Card, Container, Group, Paper, Text, Title } from '@mantine/core';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FiChevronRight, FiPackage } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { useOrder, type PreparingStatus, type SearchType } from '../../../hooks/useOrder';
import type { OrderRejectRequest, ShopOrderStatus } from '../../../types/OrderType';
import Pagination from '../Product/Managerment/ProductView/Pagination';
import { PaginationSkeleton, StatusFilterSkeleton } from '../Product/Managerment/Skeleton';
import NonOrderFound from './OrderPage/OrderView/NonOrderFond';
import OrderView from './OrderPage/OrderView/OrderView';
import SkeletonOrderView from './OrderPage/OrderView/SkeletonOrderView';
import FilterByStatus from './OrderPage/Filter/FilterByStatus';
import OrderFilter from './OrderPage/Filter/OrderFilter';



const OrderPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [activeStatus, setActiveStatus] = useState<ShopOrderStatus | "all">(
    (searchParams.get('status') as ShopOrderStatus | "all") || 'all'
  );

  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [searchTypeValue, setSearchTypeValue] = useState<SearchType>(
    (searchParams.get('searchType') as SearchType) || 'order_code'
  );
  const [sortBy, setSortBy] = useState<string | null>(searchParams.get('sortBy') || 'newest');
  const [preparingStatus, setPreparingStatus] = useState<PreparingStatus>('all');

  const [activePage, setActivePage] = useState(
    parseInt(searchParams.get('page') || '1', 10)
  );
  const [itemsPerPage] = useState(10);

  const updateURLParams = useCallback((updates: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams);

    Object.entries(updates).forEach(([key, value]) => {
      if (value === null || value === '' || value === 'all') {
        newParams.delete(key);
      } else {
        newParams.set(key, value); 
      }
    });

    setSearchParams(newParams, { replace: true });
  }, [searchParams, setSearchParams]);

  const {
    totalCount,
    totalPages,
    isLoading,

    orders,
    fetchOrders,
    orderMetadata,
    fetchOrderMetadata,

    approveOrder,
    rejectOrder,
    rejectOrders,
  } = useOrder({
    initialParams: {
      page: 0,
      limit: itemsPerPage,
      status: activeStatus,
    }
  });

  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý đơn hàng', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  const loadOrders = useCallback(() => {
    updateURLParams({
      status: activeStatus,
      search: searchTerm || null,
      searchType: searchTypeValue !== 'order_code' ? searchTypeValue : null,
      sortBy: sortBy !== 'newest' ? sortBy : null,
      page: activePage > 1 ? activePage.toString() : null
    });

    fetchOrders({
      page: activePage - 1,
      limit: itemsPerPage,
      mode: 'home',
      status: activeStatus,
      search: searchTerm,
      searchType: searchTypeValue,
      sortBy: sortBy || undefined,
      preparingStatus: preparingStatus
    });
  }, [activePage, activeStatus, sortBy, searchTypeValue, searchTerm, fetchOrders, updateURLParams]);

  useEffect(() => {
    loadOrders();
  }, [activeStatus, activePage]);

  useEffect(() => {
    fetchOrderMetadata();
  }, []);

  const handleStatusChange = (status: ShopOrderStatus | "all") => {
    setActiveStatus(status);
    setActivePage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setActivePage(1);
  };

  const handleSearchTypeChange = (value: SearchType) => {
    setSearchTypeValue(value);
    setActivePage(1);
  };

  const handleSortByChange = (value: string | null) => {
    setSortBy(value);
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
  };

  const onFetchWithParam = useCallback(() => {
    setActivePage(1);
    loadOrders();
  }, [searchTerm, sortBy, loadOrders]);

  const handleClearAll = useCallback(() => {
    setSearchTerm('');
    setSortBy('newest');
    setSearchTypeValue('order_code');

    const newParams = new URLSearchParams();
    if (activeStatus !== 'all') {
      newParams.set('status', activeStatus);
    }
    setSearchParams(newParams, { replace: true });

    fetchOrders({
      page: 0,
      limit: itemsPerPage,
      mode: 'home',
      status: activeStatus
    });
  }, [activeStatus, fetchOrders, setSearchParams]);

  const handleApproveOrder = useCallback((shopOrderId: string) => {
    approveOrder(shopOrderId)
      .then(() => {
        fetchOrderMetadata();
        loadOrders();
      });
  }, [approveOrder, fetchOrderMetadata, loadOrders]);

  const handleRejectOrder = useCallback((orderItemId: string, reason: string) => {
    rejectOrder(orderItemId, reason)
      .then(() => {
        fetchOrderMetadata();
        loadOrders();
      });
  }, [rejectOrder, fetchOrderMetadata, loadOrders]);

  const handleRejectOrders = useCallback((orderRejectRequest: OrderRejectRequest) => {
    rejectOrders(orderRejectRequest)
      .then(() => {
        fetchOrderMetadata();
        loadOrders();
      });
  }, [rejectOrders, fetchOrderMetadata, loadOrders]);

  const handlePreparingStatusChange = (value : PreparingStatus) => {
    setPreparingStatus(value);
  }
  return (
    <Container fluid px="lg" py="md" className='relative'>
      <Paper
        shadow="xs"
        p="md"
        mb="md"
        radius="md"
        className="border-b border-gray-200"
      >
        <Box mb="xs">
          <Breadcrumbs separator={<FiChevronRight size={14} />}>
            {breadcrumbItems}
          </Breadcrumbs>
        </Box>

        <Group justify="space-between" align="center">
          <Group>
            <FiPackage size={24} className="text-primary" />
            <Title order={2} size="h3">Tất cả đơn hàng</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Xem và quản lý tất cả đơn hàng của cửa hàng
          </Text>
        </Group>
      </Paper>

      <Paper
        radius="md"
        className="bg-white"
      >
        <Suspense fallback={<StatusFilterSkeleton />}>
          <FilterByStatus
            selectedStatus={activeStatus}
            onStatusChange={handleStatusChange}
            orderStatusData={orderMetadata}
          />
        </Suspense>
        <OrderFilter
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          searchTypeValue={searchTypeValue}
          onSearchTypeValueChange={handleSearchTypeChange}
          sortBy={sortBy}
          onSortByChange={handleSortByChange}
          activeTab={activeStatus}
          onFetchWithParam={onFetchWithParam}
          onClearAll={handleClearAll}
          totalOrders={totalCount}
          onStatusFilterChange={handlePreparingStatusChange}
        />

        <Box p="md" className='min-h-[60vh]'>
          <Card withBorder p={0} className="!bg-gray-50">
            <Box className="px-4 py-3">
              <div className="grid grid-cols-12 gap-4">
                <div className="col-span-4">
                  <Group gap="sm">
                    <Text size="sm" fw={500}>
                      Sản phẩm
                    </Text>
                  </Group>
                </div>
                <div className="col-span-2">
                  <Text size="sm" fw={500}>
                    Thanh toán
                  </Text>
                </div>
                <div className="col-span-2">
                  <Text size="sm" fw={500}>
                    Trạng thái
                  </Text>
                </div>
                <div className="col-span-2">
                  <Text size="sm" fw={500}>
                    Vận chuyển
                  </Text>
                </div>
                <div className="col-span-2 text-center">
                  <Text size="sm" fw={500}>
                    Thao tác
                  </Text>
                </div>
              </div>
            </Box>
          </Card>
          {isLoading ? (
            <SkeletonOrderView />
          ) : !orders || orders.length === 0 ? (
            <NonOrderFound
              searchTerm={searchTerm}
              onClearFilters={handleClearAll}
            />
          ) : (
            <>
              <OrderView
                items={orders}
                onApproveOrder={handleApproveOrder}
                onRejectOrder={handleRejectOrder}
                onRejectOrders={handleRejectOrders}
              />

              <Suspense fallback={<PaginationSkeleton />}>
                <Pagination
                  currentPage={activePage}
                  totalPages={totalPages}
                  totalItems={totalCount}
                  itemsPerPage={itemsPerPage}
                  onPageChange={handlePageChange}
                />
              </Suspense>
            </>
          )}
        </Box>
      </Paper>

    </Container>
  );
};

export default OrderPage;