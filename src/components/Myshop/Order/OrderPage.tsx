import { Anchor, Box, Breadcrumbs, Card, Container, Group, Paper, Text, Title } from '@mantine/core';
import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { FiChevronRight, FiPackage } from 'react-icons/fi';
import { OrderStatusDefaultDataAdmin } from '../../../data/OrderData';
import { useOrder, type PreparingStatus, type SearchType } from '../../../hooks/useOrder';
import { useURLParams } from '../../../hooks/useURLParams';
import { ShipmentService } from '../../../service/ShipmentService';
import type { OrderRejectRequest, ShopOrderStatus } from '../../../types/OrderType';
import type { BaseCreateShipmentRequest } from '../../../types/ShipmentType';
import Pagination from '../Product/Managerment/ProductView/Pagination';
import { PaginationSkeleton, StatusFilterSkeleton } from '../Product/Managerment/Skeleton';
import FilterByStatus from './OrderPage/Filter/FilterByStatus';
import OrderFilter from './OrderPage/Filter/OrderFilter';
import NonOrderFound from './OrderPage/OrderView/NonOrderFond';
import OrderView from './OrderPage/OrderView/OrderView';
import SkeletonOrderView from './OrderPage/OrderView/SkeletonOrderView';



const OrderPage = () => {
  const { getParam, updateParams } = useURLParams();

  const [activeStatus, setActiveStatus] = useState<ShopOrderStatus | "all">(() =>
    (getParam('status') as ShopOrderStatus | "all") || 'all'
  );

  const [searchTerm, setSearchTerm] = useState(() => getParam('search') || '');
  const [searchTypeValue, setSearchTypeValue] = useState<SearchType>(() =>
    (getParam('searchType') as SearchType) || 'order_code'
  );
  const [sortBy, setSortBy] = useState<string | null>(() => getParam('sortBy') || 'newest');
  const [preparingStatus, setPreparingStatus] = useState<PreparingStatus>('all');

  const [activePage, setActivePage] = useState(() => {
    const page = getParam('page');
    return page ? parseInt(page, 10) : 1;
  });
  const [itemsPerPage] = useState(10);

  const [orderMetadataView] = useState(OrderStatusDefaultDataAdmin);
  const filterSectionRef = useRef<HTMLDivElement>(null);
  const scrollToTop = useCallback(() => {
    setTimeout(() => {
      if (filterSectionRef.current) {
        const elementPosition = filterSectionRef.current.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - 79;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    }, 100);
  }, []);

  const {
    totalCount,
    totalPages,
    isLoadingOrders: isLoading,

    orders,
    fetchOrders,
    orderMetadata,
    fetchOrderMetadata,
    reset,

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

  const loadOrders = useCallback((status?: ShopOrderStatus | "all", page?: number) => {
    const finalStatus = status ?? activeStatus;
    const finalPage = page ?? activePage;
    updateParams({
      status: finalStatus,
      search: searchTerm || null,
      searchType: searchTypeValue !== 'order_code' ? searchTypeValue : null,
      sortBy: sortBy !== 'newest' ? sortBy : null,
      page: finalPage > 1 ? finalPage : null,
    });

    fetchOrders({
      page: finalPage - 1,
      limit: itemsPerPage,
      mode: 'home',
      status: finalStatus,
      search: searchTerm,
      searchType: searchTypeValue,
      sortBy: sortBy || undefined,
      preparingStatus,
    });
  }, [activePage, activeStatus, sortBy, searchTypeValue, searchTerm, preparingStatus, fetchOrders, updateParams]);

  useEffect(() => {
    orderMetadataView.map(item => {
      if (item.id === 'PREPARING') {
        item.count = orderMetadata
          .filter(meta => meta.id === 'PREPARING' || meta.id === 'CONFIRMED')
          .reduce((sum, meta) => sum + meta.count, 0);
        return;
      }
      item.count = orderMetadata.find(meta => meta.id === item.id)?.count || 0;
    })
  }, [orderMetadata]);


  useEffect(() => {
    fetchOrderMetadata();
    loadOrders();
  }, []);

  useEffect(() => {
    if (orders.length !== orderMetadataView[0].count)
      fetchOrderMetadata();
  }, [orders]);

  const handleStatusChange = useCallback(
    (status: ShopOrderStatus | "all") => {
      if (status === activeStatus) return;
      setActiveStatus(status);
      setActivePage(1);
      if (orderMetadataView.find(item => item.id === status)?.count === 0) {
        reset();
      }
      else loadOrders(status, 1);
      scrollToTop();
    }, [activeStatus, loadOrders]);


  const handlePageChange = useCallback((page: number) => {
    if (page === activePage) return;
    setActivePage(page);
    loadOrders(activeStatus, page);
    scrollToTop();
  }, [activePage, activeStatus, loadOrders]);

  const handleClearAll = useCallback(() => {
    setSearchTerm('');
    setSortBy('newest');
    setSearchTypeValue('order_code');

    updateParams({
      search: null,
      searchType: null,
      sortBy: null
    }, { preserveOthers: false });

    if (activeStatus !== 'all') {
      updateParams({ status: activeStatus });
    }

    fetchOrders({
      page: 0,
      limit: itemsPerPage,
      mode: 'home',
      status: activeStatus
    });
    scrollToTop();
  }, [activeStatus, fetchOrders, updateParams]);

  const onFetchWithParam = useCallback(() => {
    setActivePage(1);
    loadOrders();
    scrollToTop();
  }, [loadOrders]);

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

  const handleCreateShipOrder = useCallback((orderId: string, pickupDate: string, note: string) => {
    const baseCreateShipOrder: BaseCreateShipmentRequest = {
      note,
      pickupDate,
    };
    ShipmentService.createShipmentForShopOrder(orderId, baseCreateShipOrder)
      .then(() => {
        fetchOrderMetadata();
        loadOrders();
      });
  }, [fetchOrderMetadata, loadOrders]);

  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý đơn hàng', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

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
        className="bg-white p-4"
        ref={filterSectionRef}
      >
        <Suspense fallback={<StatusFilterSkeleton />}>
          <FilterByStatus
            selectedStatus={activeStatus}
            onStatusChange={handleStatusChange}
            orderStatusData={orderMetadataView}
          />
        </Suspense>
        <OrderFilter
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          searchTypeValue={searchTypeValue}
          onSearchTypeValueChange={setSearchTypeValue}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          activeTab={activeStatus}
          onFetchWithParam={onFetchWithParam}
          onClearAll={handleClearAll}
          totalOrders={totalCount}
          onStatusFilterChange={setPreparingStatus}
        />

        <Box pt={"md"} className='min-h-[60vh]'>
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
                onCreateShipOrder={handleCreateShipOrder}
                currentStatus={activeStatus}
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