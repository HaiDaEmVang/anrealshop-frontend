import {
    Anchor, Box, Breadcrumbs, Card, Container,
    Group, Paper, Text, Title
} from '@mantine/core';
import { Suspense, useCallback, useEffect, useState } from 'react';
import { FiChevronRight, FiPrinter } from 'react-icons/fi';
import { useSearchParams } from 'react-router-dom';
import { type SearchType } from '../../../hooks/useOrder';
import { useShipping, type shipParams } from '../../../hooks/useShipping';
import Pagination from '../Product/Managerment/ProductView/Pagination';
import { PaginationSkeleton } from '../Product/Managerment/Skeleton';
import { type PreparingShippingStatus } from './Data';
import NonOrderFound from './OrderPage/OrderView/NonOrderFond';
import Filter, { type SortByType } from './OrderPrint/Filter';
import HeaderListView from './OrderPrint/HeaderListView';
import OrderPrintList from './OrderPrint/OrderPrintList';
import PrintInfoForm from './OrderPrint/PrintInfoForm';
import PrintInfoPage from './OrderPrint/PrintInfoPage';
import showErrorNotification from '../../Toast/NotificationError';


const OrderPrintPage = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const init_params: shipParams = {
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: 10,
        searchType: (searchParams.get('searchType') as SearchType) || 'order_code',
        search: searchParams.get('search') || '',
        sortBy: (searchParams.get('sortBy') as SortByType) || 'newest',
        preparingStatus: (searchParams.get('preparingStatus') as PreparingShippingStatus) || 'all',
    }

    const [selectedShipping, setSelectedShipping] = useState<string[]>([]);
    const [selectAll, setSelectAll] = useState(false);
    const [isPrinted, setIsPrinted] = useState(false);

    const [activePage, setActivePage] = useState(parseInt(searchParams.get('page') || '1', 10));
    const [itemsPerPage] = useState(10);

    const [params, setParams] = useState<shipParams>(init_params);



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
        data: shippingLists,
        fetchShipping,
    } = useShipping({
        initialParams: init_params
    });

    const loadShipping = useCallback(() => {
        updateURLParams({
            page: activePage > 1 ? activePage.toString() : null,
            searchType: params.searchType && params.searchType != 'order_code' ? params.searchType : null,
            search: params.search || null,
            sortBy: params.sortBy && params.sortBy != 'newest' ? params.sortBy : null,
            preparingStatus: params.preparingStatus && params.preparingStatus != 'all' ? params.preparingStatus : null,
        });

        const paramsForFetch: shipParams = {
            ...params,
            page: activePage - 1,
            limit: itemsPerPage
        }

        fetchShipping(paramsForFetch)
    }, [activePage, params, fetchShipping, updateURLParams]);

    useEffect(() => {
        loadShipping();
    }, [ activePage, params.preparingStatus]);

    const handleSelectAll = () => {
        setSelectedShipping(selectAll ? [] : shippingLists.flatMap(order => order.shippingId));
        setSelectAll(!selectAll);
    };

    useEffect(() => {
        setSelectAll(selectedShipping.length === shippingLists.length && shippingLists.length > 0);
    }, [selectedShipping, shippingLists]);

    const handleSelectShipping = (shippingId: string) => {
        setSelectedShipping(prev => {
            if (prev.includes(shippingId)) {
                return prev.filter(id => id !== shippingId);
            } else {
                return [...prev, shippingId];
            }
        });
    };

    const handleParamsChange = (newParams: shipParams) => {
        setParams(newParams);
        setActivePage(1);
    };

    const handleResetFilter = () => {
        const defaultParams: shipParams = {
            searchType: 'order_code' as SearchType,
            search: '',
            sortBy: 'newest' as SortByType,
            preparingStatus: 'all' as PreparingShippingStatus,
        };

        setParams(defaultParams);
        setActivePage(1);

        setSearchParams({}, { replace: true });
    };

    const handlePrintShipping = () => {
        showErrorNotification("Nhac Nho", "Chức năng đang được phát triển");
    };

    const breadcrumbItems = [
        { title: 'Trang chủ', href: '/myshop' },
        { title: 'Quản lý đơn hàng', href: '/myshop/orders' },
        { title: 'In phiếu giao hàng', href: '#' },
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
                        <FiPrinter size={24} className="text-primary" />
                        <Title order={2} size="h3">In phiếu giao hàng</Title>
                    </Group>
                    <Text c="dimmed" size="sm">
                        In phiếu giao hàng cho đơn hàng đã chọn
                    </Text>
                </Group>
            </Paper>

            <div className="grid grid-cols-12 gap-4">
                <div className="col-span-12 lg:col-span-9">
                    <Filter
                        initialParams={params}
                        onFilterChange={handleParamsChange}
                        onResetFilter={handleResetFilter}
                        orderCount={shippingLists.length}
                    />
                    <Card shadow="xs" p="md" radius="md" bg={"white"}>

                        <HeaderListView
                            selectAll={selectAll}
                            onSelectAll={handleSelectAll}
                        />
                        {shippingLists.length > 0 ? (
                            <>
                                <OrderPrintList
                                    shippingData={shippingLists}
                                    selectedShipping={selectedShipping}
                                    selectAll={selectAll}
                                    onSelectShipping={handleSelectShipping}
                                />

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
                            <NonOrderFound />
                        )}
                    </Card>
                </div>

                <div className="col-span-12 lg:col-span-3">
                    <div className="sticky top-20">
                        <PrintInfoForm
                            selectedShipping={selectedShipping}
                            isPrinting={isPrinted}
                            onPrint={handlePrintShipping}
                        />
                        <PrintInfoPage />
                    </div>
                </div>
            </div>
        </Container>
    );
};

export default OrderPrintPage;