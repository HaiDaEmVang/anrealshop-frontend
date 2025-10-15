import {
  Anchor, Box, Breadcrumbs, Container,
  Group, Paper, Text, Title
} from '@mantine/core';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FiChevronRight, FiTruck } from 'react-icons/fi';
import { useAppSelector } from '../../../hooks/useAppRedux';
import { useOrder, type OrderCountType, type PreparingStatus, type SearchType, type UseOrderParams } from '../../../hooks/useOrder';
import { useURLParams } from '../../../hooks/useURLParams';
import { ShipmentService } from '../../../service/ShipmentService';
import type { OrderItemDto } from '../../../types/OrderType';
import type { CreateShipmentRequest } from '../../../types/ShipmentType';
import { getErrorMessage } from '../../../untils/ErrorUntils';
import { formatDateForBe, getDefaultDateRange_Now_Yesterday } from '../../../untils/Untils';
import showErrorNotification from '../../Toast/NotificationError';
import showSuccessNotification from '../../Toast/NotificationSuccess';
import Pagination from '../Product/Managerment/ProductView/Pagination';
import { PaginationSkeleton } from '../Product/Managerment/Skeleton';
import NonOrderFound from './OrderPage/OrderView/NonOrderFond';
import Filter, { type SortByType } from './OrderShipping/Filter/Filter';
import OrderShippingProductList from './OrderShipping/OrderView/OrderShippingProductList';
import InfoPage from './OrderShipping/shopAddress/InfoPage';
import ShippingInfoForm from './OrderShipping/shopAddress/ShippingInfoForm';


const OrderShippingPage = () => {
  const { getParam, updateParams, clearParams } = useURLParams();

  const init_params: UseOrderParams = {
    orderType: (getParam('orderType', 'all') as OrderCountType),
    searchType: (getParam('searchType', 'order_code') as SearchType),
    search: getParam('search', ''),
    sortBy: (getParam('sortBy', 'newest') as SortByType),
    confirmSD: getParam('confirmSD', formatDateForBe(getDefaultDateRange_Now_Yesterday()[0])),
    confirmED: getParam('confirmED', formatDateForBe(getDefaultDateRange_Now_Yesterday()[1])),
    preparingStatus: (getParam('preparingStatus', 'all') as PreparingStatus),
  }

  const [selectedOrder, setSelectedOrder] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [activePage, setActivePage] = useState(parseInt(getParam('page', '1'), 10));
  const [itemsPerPage] = useState(10);

  const [params, setParams] = useState<UseOrderParams>(init_params);

  const [pickupDate, setPickupDate] = useState<string>(
    getParam('pickupDate', new Date().toISOString().split('T')[0])
  );
  const [note, setNote] = useState(getParam('note', ''));
  const { user } = useAppSelector((state) => state.auth);
  const [data, setData] = useState<OrderItemDto[]>([]);

  const {
    totalCount,
    totalPages,
    isLoading,

    orders,
    fetchOrders,

    rejectOrder
  } = useOrder({
    initialParams: {
      page: 0,
      limit: itemsPerPage,
      status: 'all',
    }
  });

  const loadOrders = useCallback(() => {
    updateParams({
      page: activePage > 1 ? activePage : null,
      orderType: params.orderType !== 'all' ? params.orderType : null,
      searchType: params.searchType !== 'order_code' ? params.searchType : null,
      search: params.search || null,
      sortBy: params.sortBy !== 'newest' ? params.sortBy : null,
      confirmSD: params.confirmSD || null,
      confirmED: params.confirmED || null,
      preparingStatus: params.preparingStatus !== 'all' ? params.preparingStatus : null,
    });

    fetchOrders({
      page: activePage - 1,
      limit: itemsPerPage,
      mode: 'shipping',
      ...params
    });
  }, [activePage, params, fetchOrders, updateParams]);

  useEffect(() => {
    loadOrders();
  }, [loadOrders, activePage, params.preparingStatus]);
  useEffect(() => {
    setData(orders);
  },[orders]);

  const handleSelectAll = () => {
    setSelectedOrder(selectAll ? [] : data.flatMap(order => order.shopOrderId));
    setSelectAll(!selectAll);
  };

  useEffect(() => {
    setSelectAll(selectedOrder.length === data.length && data.length > 0);
  }, [selectedOrder, data]);

  const handleSelectOrder = (orderId: string) => {
    setSelectedOrder(prev => {
      if (prev.includes(orderId)) {
        return prev.filter(id => id !== orderId);
      } else {
        return [...prev, orderId];
      }
    });
  };

  const handleParamsChange = (newParams: UseOrderParams) => {
    setParams(newParams);
    setActivePage(1);
  };

  const handleResetFilter = () => {
    const defaultParams: UseOrderParams = {
      orderType: 'all' as OrderCountType,
      searchType: 'order_code' as SearchType,
      search: '',
      sortBy: 'newest' as SortByType,
      confirmSD: formatDateForBe(getDefaultDateRange_Now_Yesterday()[0]),
      confirmED: formatDateForBe(getDefaultDateRange_Now_Yesterday()[1]),
      preparingStatus: 'all' as PreparingStatus,
    };

    setParams(defaultParams);
    setActivePage(1);
    clearParams(); // Clear all URL parameters
  };

  const handlePageChange = (page: number) => {
    setActivePage(page);
    updateParams({ page: page > 1 ? page : null });
  };

  const orderItemDtos = data.filter(order => selectedOrder.includes(order.shopOrderId));

  const handlePickupDateChange = (value: string | null) => {
    if (value) {
      setPickupDate(value);
      updateParams({ pickupDate: value });
    }
  };

  const handleNoteChange = (value: string) => {
    setNote(value);
    updateParams({ note: value || null });
  };

  const handleSubmitShipping = async () => {
    const createShipmentRequest: CreateShipmentRequest = {
      shopOrderIds: selectedOrder,
      addressId: user?.address?.id || '',
      note,
      pickupDate: formatDateForBe(new Date(pickupDate)),
    };
    setIsSubmitting(true);
    ShipmentService.createShipment(createShipmentRequest)
      .then(() => {
        setIsSubmitting(false);
        showSuccessNotification('Tạo đơn giao hàng thành công', 'Đơn giao hàng đã được tạo thành công.');
        loadOrders();
        setSelectedOrder([]);
      })
      .catch((error) => {
        const err = getErrorMessage(error);
        showErrorNotification('Lỗi khi tạo đơn giao hàng', err);
      })
      .finally(() => {
        setIsSubmitting(false);
      });
  }

  const handleRejectOrder = useCallback((orderItemId: string, reason: string) => {
    rejectOrder(orderItemId, reason)
      .then(() => {
        loadOrders();
      });
  }, [rejectOrder, loadOrders]);

  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý đơn hàng', href: '/myshop/orders' },
    { title: 'Giao hàng loạt', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  return (
    <Container fluid px="lg" py="md" >
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
            <FiTruck size={24} className="text-primary" />
            <Title order={2} size="h3">Giao hàng loạt</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Tạo và quản lý đơn giao hàng cho nhiều sản phẩm cùng lúc
          </Text>
        </Group>
      </Paper>

      <div className="grid grid-cols-12 gap-4">
        <div className="col-span-12 lg:col-span-9">
          <Filter
            initialParams={params}
            onFilterChange={handleParamsChange}
            onResetFilter={handleResetFilter}
            orderCount={data.length}
          />
          {data.length > 0 ? (
            <>
              <OrderShippingProductList
                orders={orders}
                selectedOrder={selectedOrder}
                selectAll={selectAll}
                isLoading={isLoading}
                onSelectAll={handleSelectAll}
                onSelectOrder={handleSelectOrder}
                onCancelOrder={handleRejectOrder}
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
          ) : (
            <NonOrderFound />
          )}
        </div>

        <div className="col-span-12 lg:col-span-3">
          <div className="sticky top-20">
            <ShippingInfoForm
              pickupDate={pickupDate}
              note={note}
              shopAddress={user?.address}
              selectedOrders={orderItemDtos}
              isSubmitting={isSubmitting}
              onPickupDateChange={handlePickupDateChange}
              onNoteChange={handleNoteChange}
              onSubmit={handleSubmitShipping}
            />
            <InfoPage />
          </div>
        </div>
      </div>
    </Container>
  );
};

export default OrderShippingPage;