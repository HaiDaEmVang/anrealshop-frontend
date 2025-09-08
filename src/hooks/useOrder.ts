import { useCallback, useEffect, useState } from 'react';
import showErrorNotification from '../components/Toast/NotificationError';
import showSuccessNotification from '../components/Toast/NotificationSuccess';
import { OrderService } from '../service/OrderService';
import type { MyShopOrderListResponse, OrderItemDto, OrderRejectRequest, OrderStatus, OrderStatusDto, ShopOrderStatus } from '../types/OrderType';
import { getErrorMessage } from '../untils/ErrorUntils';
import type { TypeMode } from '../constant';
import { OrderStatusDefaultDataAdmin } from '../data/OrderData';

export interface UseOrderParams {
    page?: number;
    limit?: number;
    status?: ShopOrderStatus | 'ALL';
    orderCode?: string;
    customerName?: string;
    productName?: string;
    sortBy?: string;
    dateRange?: [Date | null, Date | null];
}

interface UseOrderOptions {
    mode?: TypeMode;
    autoFetch?: boolean;
    initialParams?: UseOrderParams;
}

interface UseOrderState {
    orders: OrderItemDto[];
    totalCount: number;
    totalPages: number;
    currentPage: number;
    isLoading: boolean;
    error: string | null;
    isEmpty: boolean;
}

export const useOrder = (options: UseOrderOptions = {}) => {
    const { autoFetch = false, initialParams, mode = 'myshop' } = options;

    const [state, setState] = useState<UseOrderState>({
        orders: [],
        totalCount: 0,
        totalPages: 0,
        currentPage: 1,
        isLoading: false,
        error: null,
        isEmpty: true
    });

    const [orderMetadata, setOrderMetadata] = useState<OrderStatusDto[]>(OrderStatusDefaultDataAdmin);

    const fetchOrders = useCallback(async (params?: UseOrderParams) => {
        setState(prev => ({
            ...prev,
            isLoading: true,
            error: null
        }));
        try {

            console.log('Fetching orders with params:', params);
            const response: MyShopOrderListResponse = await OrderService.getMyShopOrders(params);
            const orderItems = Array.isArray(response.orderItemDtoSet) && response.orderItemDtoSet.length === 1 && response.orderItemDtoSet[0] === null ? [] : response.orderItemDtoSet;
            setState(prev => ({
                ...prev,
                orders: orderItems || [],
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0,
                currentPage: (params?.page || 0) + 1,
                isLoading: false,
                error: null,
                isEmpty: !orderItems || orderItems.length === 0
            }));

            return response;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);

            setState(prev => ({
                ...prev,
                isLoading: false,
                error: errorMessage,
                orders: [],
                totalCount: 0,
                totalPages: 0,
                isEmpty: true
            }));

            showErrorNotification('Lỗi tải đơn hàng', errorMessage);
            throw err;
        }
    }, []);

    const fetchOrderMetadata = useCallback(async () => {
        console.log('Fetching order metadata');
        try {
            const metadata = await OrderService.getOrderMetaData();
            setOrderMetadata(metadata);
            return metadata;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi tải thông tin đơn hàng', errorMessage);
            return orderMetadata;
        }
    }, [orderMetadata]);

    const approveOrder = useCallback(async (shopOrderId: string) => {
        try {
            console.log('Approving order:', shopOrderId);
            await OrderService.approveOrder(shopOrderId);
            showSuccessNotification('Duyệt đơn hàn', 'Đơn hàng đã được duyệt thành công.');
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi duyệt đơn hàng', errorMessage);
            return false;
        }
    }, []);

    const rejectOrder = useCallback( async (orderItemId: string, reason: string) => {
        try {
            console.log('Rejecting order:', orderItemId, 'with reason:', reason);
            await OrderService.rejectOrder(orderItemId, reason);
            showSuccessNotification('Từ chối đơn hàng', 'Đơn hàng đã được từ chối thành công.');
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi từ chối đơn hàng', errorMessage);
            return false;
        }
    }, []);

    const rejectOrders = useCallback( async (orderRejectRequest: OrderRejectRequest) => {
        try {
            await OrderService.rejectOrders(orderRejectRequest);
            showSuccessNotification('Từ chối đơn hàng', 'Các đơn hàng đã được từ chối thành công.');
            return true;
        } catch (err: any) {
            const errorMessage = getErrorMessage(err);
            showErrorNotification('Lỗi từ chối đơn hàng', errorMessage);
            return false;
        }
    }, []);

    const refresh = useCallback(async (params?: UseOrderParams) => {
        return fetchOrders(params || initialParams);
    }, [fetchOrders, initialParams]);

    const reset = useCallback(() => {
        setState({
            orders: [],
            totalCount: 0,
            totalPages: 0,
            currentPage: 1,
            isLoading: false,
            error: null,
            isEmpty: true
        });
    }, []);

    useEffect(() => {
        if (autoFetch) {
            fetchOrders(initialParams);
            fetchOrderMetadata();
        }
    }, [autoFetch, fetchOrders, fetchOrderMetadata, initialParams]);

    return {
        // State
        ...state,
        orderMetadata,

        // Actions
        fetchOrders,
        fetchOrderMetadata,
        // updateOrderStatus,
        refresh,
        reset,

        approveOrder,
        rejectOrder,
        rejectOrders,

        // Computed values 
        hasOrders: state.orders.length > 0,
        hasError: !!state.error,
        hasNextPage: state.currentPage < state.totalPages,
        hasPrevPage: state.currentPage > 1,
    };
};

// export const useOrderDetail = () => {
//     const [isLoading, setIsLoading] = useState(false);

//     const getOrderById = useCallback(async (id: string) => {
//         setIsLoading(true);
//         try {
//             const result = await OrderService.getOrderDetail(id);
//             return result;
//         } catch (err: any) {
//             const errorMessage = getErrorMessage(err);
//             showErrorNotification('Lỗi tải đơn hàng', errorMessage);
//             throw err;
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     return {
//         isLoading,
//         getOrderById
//     };
// };
