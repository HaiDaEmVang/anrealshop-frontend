export type RejectType = 'order' | 'shipping';

export interface ItemList {
  key: string;
  value: string;
}

export const defaultRejectOrderReasons: ItemList[] = [
  { key: 'out_of_stock', value: 'Hết hàng' },
  { key: 'price_incorrect', value: 'Giá sản phẩm không chính xác' },
  { key: 'unable_to_fulfill', value: 'Không thể đáp ứng yêu cầu khách hàng' },
  { key: 'shipping_issue', value: 'Vấn đề về vận chuyển' },
  { key: 'other', value: 'Lý do khác' }
];

export const defaultRejectShippingReasons: ItemList[] = [
  { key: 'delayed_pickup', value: 'Lấy hàng chậm' },
  { key: 'address_issue', value: 'Vấn đề địa chỉ' },
  { key: 'unable_to_contact', value: 'Không thể liên hệ người nhận' },
  { key: 'weather_conditions', value: 'Điều kiện thời tiết xấu' },
  { key: 'other', value: 'Lý do khác' }
];

export const getRejectReasons = (type: RejectType): ItemList[] => {
  return type === 'order' ? defaultRejectOrderReasons : defaultRejectShippingReasons;
};