import { useCallback, useMemo } from 'react';
import { FiBox, FiCheckCircle, FiClock, FiDollarSign, FiNavigation, FiPackage, FiSend, FiX } from 'react-icons/fi';
import type { OrderStatus } from '../types/OrderType';

export const useOrderStatusIcon = () => {
    return useMemo(() => ({
        getStatusIcon: (statusId: string) => {
            switch (statusId.toLowerCase()) {
                case 'all':
                    return FiPackage;
                case 'completed':
                    return FiCheckCircle;
                case 'processing':
                    return FiBox;
                case 'pending_confirmation':
                    return FiClock;
                case 'preparing':
                    return FiPackage;
                case 'awaiting_shipment':
                    return FiBox;
                case 'in_transit':
                    return FiSend;
                case 'out_for_delivery': 
                    return FiNavigation;
                case 'delivered':
                    return FiCheckCircle;
                case 'refund':
                    return FiDollarSign;
                case 'canceled':
                    return FiX;
                default:
                    return FiPackage;
            }
        }
    }), []);
};

export const useOrderStatusColor = () => {
    return useMemo(() => ({
        getStatusColor: (statusId: string) => {
            switch (statusId.toLowerCase()) {
                case 'all':
                    return 'gray';
                case 'completed':
                    return 'green';
                case 'processing':
                    return 'blue';
                case 'pending_confirmation':
                    return 'yellow';
                case 'preparing':
                    return 'cyan';
                case 'await_shipment':
                    return 'teal';
                case 'in_transit':
                    return 'indigo';
                case 'out_for_delivery':
                    return 'violet';
                case 'delivered':
                    return 'green';
                case 'refund':
                    return 'orange';
                case 'canceled':
                    return 'red';
                default:
                    return 'gray';
            }
        },
        getStatusIconColor: (statusId: string) => {
            switch (statusId.toLowerCase()) {
                case 'all':
                    return '#6b7280'; // gray
                case 'completed':
                    return '#22c55e'; // green
                case 'processing':
                    return '#3b82f6'; // blue
                case 'pending_confirmation':
                    return '#eab308'; // yellow
                case 'preparing':
                    return '#06b6d4'; // cyan
                case 'awaiting_shipment':
                    return '#14b8a6'; // teal
                case 'in_transit':
                    return '#4f46e5'; // indigo
                case 'out_for_delivery':
                    return '#7c3aed'; // violet
                case 'delivered':
                    return '#22c55e'; // green
                case 'refund':
                    return '#f97316'; // orange
                case 'canceled':
                    return '#ef4444'; // red
                default:
                    return '#6b7280'; // gray
            }
        }
    }), []);
};

export const useOrderStatusLabel = () => {
    return useMemo(() => ({
        getStatusLabel: (statusId: string) => {
            switch (statusId.toLowerCase()) {
                case 'all':
                    return 'Tất cả';
                case 'completed':
                    return 'Thành công';
                case 'processing':
                    return 'Đang xử lý';
                case 'pending_confirmation':
                    return 'Chờ xác nhận';
                case 'confirmed':
                    return 'Chưa xử lý';
                case 'preparing':
                    return 'Chờ lấy hàng';
                case 'wait_shipment':
                    return 'Chờ giao';
                case 'in_transit':
                    return 'Đang vận chuyển';
                case 'out_for_delivery':
                    return 'Đang giao';
                case 'delivered':
                    return 'Đã giao';
                case 'refund':
                    return 'Đã hoàn tiền';
                case 'canceled':
                    return 'Đã hủy';
                default:
                    return 'Không xác định';
            }
        }
    }), []);
};

export const useOrderStatus = () => {
    const { getStatusIcon } = useOrderStatusIcon();
    const { getStatusColor, getStatusIconColor } = useOrderStatusColor();
    const { getStatusLabel } = useOrderStatusLabel();

    const convertStatus = useCallback((status: string): OrderStatus => {
        const normalizedStatus = status.toUpperCase().replace(/-/g, '_');

        switch (normalizedStatus) {
            case 'ALL':
            case 'COMPLETED':
            case 'PROCESSING':
            case 'PENDING_CONFIRMATION':
            case 'CONFIRMED':
            case 'PREPARING':
            case 'AWAITING_SHIPMENT':
            case 'IN_TRANSIT':
            case 'OUT_FOR_DELIVERY':
            case 'DELIVERED':
            case 'REFUND':
            case 'CANCELED':
                return normalizedStatus as OrderStatus;
            default:
                return 'ALL';
        }
    }, []);

    return {
        getStatusIcon,
        getStatusColor,
        getStatusIconColor,
        getStatusLabel,
        convertStatus
    };
};