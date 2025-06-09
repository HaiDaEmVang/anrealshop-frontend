import {
  Container,
  Grid
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import { useState } from 'react';
import { BsBank, BsCashCoin, BsCreditCard2Front } from 'react-icons/bs';
import { FiAlertTriangle, FiClock, FiTruck } from 'react-icons/fi';
import { SiZalo } from 'react-icons/si';

// Import Address component
import Address, { type ShippingAddress } from './Address';
import CheckoutBreadcrumbs from './CheckoutBreadcrumbs';
import CheckoutReview from './CheckoutReview';
import ListProduct from './ListProduct';
import PaymentMethod from './PaymentMethod';
import PaymentResult from './PaymentResult';
import Transport from './Transsport';

// Interface cho phương thức vận chuyển
interface ShippingMethod {
  id: string;
  name: string;
  price: number;
  estimatedDelivery: string;
  icon: React.ReactNode;
  description: string;
  badge?: string;
  badgeColor?: string;
}

// Interface cho phương thức thanh toán
interface PaymentMethod {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

// Interface cho sản phẩm trong giỏ hàng
interface CartItem {
  id: string;
  productId: string;
  skuId: string;
  name: string;
  price: number;
  originalPrice: number;
  quantity: number;
  thumbnailUrl: string;
  attributes: {
    color?: string;
    size?: string;
    [key: string]: string | undefined;
  };
}

// Sample saved addresses
const savedAddresses: ShippingAddress[] = [
  {
    fullName: 'Nguyễn Văn A',
    phone: '0912345678',
    email: 'nguyenvana@gmail.com',
    province: 'hochiminh',
    district: 'district1',
    ward: 'bennghe',
    streetAddress: '123 Lê Lợi',
    isDefault: true,
  },
  {
    fullName: 'Nguyễn Văn A',
    phone: '0923456789',
    email: 'nguyenvana@gmail.com',
    province: 'hochiminh',
    district: 'district7',
    ward: 'bennghe',
    streetAddress: '456 Nguyễn Văn Linh',
    isDefault: false,
  },
  {
    fullName: 'Nguyễn Văn C',
    phone: '0923456789',
    email: 'nguyenvana@gmail.com',
    province: 'hochiminh',
    district: 'district7',
    ward: 'bennghe',
    streetAddress: '456 Nguyễn Văn Linh',
    isDefault: false,
  },
  {
    fullName: 'Nguyễn Văn B',
    phone: '0923456789',
    email: 'nguyenvana@gmail.com',
    province: 'hochiminh',
    district: 'district7',
    ward: 'bennghe',
    streetAddress: '456 Nguyễn Văn Linh',
    isDefault: false,
  },
];

// Sample cart items
const cartItems: CartItem[] = [
  {
    id: '1',
    productId: 'p1',
    skuId: 'sku1',
    name: 'Áo thun nam cotton cổ tròn basic',
    price: 199000,
    originalPrice: 250000,
    quantity: 2,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074',
    attributes: {
      color: 'Trắng',
      size: 'L',
    },
  },
  {
    id: '2',
    productId: 'p2',
    skuId: 'sku2',
    name: 'Quần jean nam slim fit',
    price: 350000,
    originalPrice: 350000,
    quantity: 1,
    thumbnailUrl: 'https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074',
    attributes: {
      color: 'Xanh đậm',
      size: '32',
    },
  }
];

// Dữ liệu mẫu về phương thức vận chuyển
const shippingMethods: ShippingMethod[] = [
  {
    id: 'standard',
    name: 'Giao hàng tiêu chuẩn',
    price: 30000,
    estimatedDelivery: '3-5 ngày',
    icon: <FiTruck size={24} className="text-blue-500" />,
    description: 'Phù hợp cho các đơn hàng thông thường'
  },
  {
    id: 'express',
    name: 'Giao hàng nhanh',
    price: 55000,
    estimatedDelivery: '1-2 ngày',
    icon: <FiClock size={24} className="text-amber-500" />,
    description: 'Giao hàng ưu tiên, nhanh hơn so với tiêu chuẩn',
    badge: 'Nên chọn',
    badgeColor: 'yellow'
  },
  {
    id: 'same_day',
    name: 'Giao hàng trong ngày',
    price: 100000,
    estimatedDelivery: 'Trong ngày',
    icon: <FiTruck size={24} className="text-green-600" />,
    description: 'Nhận hàng trong ngày (áp dụng với đơn đặt trước 14:00)',
    badge: 'Nhanh nhất',
    badgeColor: 'green'
  },
];

// Dữ liệu mẫu về phương thức thanh toán
const paymentMethods: PaymentMethod[] = [
  {
    id: 'cod',
    name: 'Thanh toán khi nhận hàng',
    description: 'Thanh toán bằng tiền mặt khi nhận hàng',
    icon: <BsCashCoin size={24} />
  },
  {
    id: 'bank_transfer',
    name: 'Chuyển khoản ngân hàng',
    description: 'Chuyển khoản trực tiếp đến tài khoản ngân hàng của chúng tôi',
    icon: <BsBank size={24} />
  },
  {
    id: 'zalopay',
    name: 'ZaloPay',
    description: 'Thanh toán qua ví điện tử ZaloPay',
    icon: <SiZalo size={24} />
  },
  {
    id: 'credit_card',
    name: 'Thẻ tín dụng / Ghi nợ',
    description: 'Thanh toán qua thẻ tín dụng hoặc ghi nợ',
    icon: <BsCreditCard2Front size={24} />
  }
];

// Dữ liệu mẫu của tỉnh/thành, quận/huyện, phường/xã
const dummyVietnamProvinces = [
  { value: 'hanoi', label: 'Hà Nội' },
  { value: 'hochiminh', label: 'Thành phố Hồ Chí Minh' },
  { value: 'danang', label: 'Đà Nẵng' },
  { value: 'haiphong', label: 'Hải Phòng' },
  { value: 'cantho', label: 'Cần Thơ' },
];

const dummyVietnamDistricts: Record<string, { value: string; label: string }[]> = {
  'hanoi': [
    { value: 'badinh', label: 'Ba Đình' },
    { value: 'hoankien', label: 'Hoàn Kiếm' },
    { value: 'haibatrung', label: 'Hai Bà Trưng' },
    { value: 'dongda', label: 'Đống Đa' },
    { value: 'tayho', label: 'Tây Hồ' },
  ],
  'hochiminh': [
    { value: 'district1', label: 'Quận 1' },
    { value: 'district3', label: 'Quận 3' },
    { value: 'district4', label: 'Quận 4' },
    { value: 'district5', label: 'Quận 5' },
    { value: 'district7', label: 'Quận 7' },
    { value: 'binhthanh', label: 'Bình Thạnh' },
    { value: 'phunhuan', label: 'Phú Nhuận' },
  ],
};

const dummyVietnamWards: Record<string, { value: string; label: string }[]> = {
  'district1': [
    { value: 'bennghe', label: 'Phường Bến Nghé' },
    { value: 'bendthanh', label: 'Phường Bến Thành' },
    { value: 'dakao', label: 'Phường Đa Kao' },
    { value: 'cauchongoi', label: 'Phường Cầu Ông Lãnh' },
  ],
  'badinh': [
    { value: 'phucxa', label: 'Phường Phúc Xá' },
    { value: 'truongbach', label: 'Phường Trúc Bạch' },
    { value: 'vinhphuc', label: 'Phường Vĩnh Phúc' },
  ],
};

const CheckoutPage = () => {
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('cod');
  const [selectedShippingMethod, setSelectedShippingMethod] = useState('standard');
  const [selectedAddress, setSelectedAddress] = useState<ShippingAddress | null>(
    savedAddresses.find(addr => addr.isDefault) || null
  );
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderFailed, setOrderFailed] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>('');

  const handleUpdateAddress = (oldAddress: ShippingAddress, newAddress: ShippingAddress) => {
    // Cập nhật địa chỉ trong danh sách địa chỉ đã lưu
    const updatedAddresses = savedAddresses.map(addr => {
      if (addr === oldAddress) {
        return newAddress;
      }
      // Nếu địa chỉ mới được đặt làm mặc định, đảm bảo không có địa chỉ nào khác là mặc định
      if (newAddress.isDefault && addr.isDefault && addr !== oldAddress) {
        return { ...addr, isDefault: false };
      }
      return addr;
    });

    // Cập nhật state (giả sử bạn có một state setSavedAddresses)
    // setSavedAddresses(updatedAddresses);

    // Thông báo cập nhật thành công
    notifications.show({
      title: 'Địa chỉ đã được cập nhật',
      message: 'Thông tin địa chỉ đã được cập nhật thành công',
      color: 'green',
    });
  };

  // Thông tin tổng thanh toán
  const subtotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  const discount = cartItems.reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);
  const shippingCost = shippingMethods.find(method => method.id === selectedShippingMethod)?.price || 0;
  const total = subtotal + shippingCost;

  const handleAddNewAddress = (values: ShippingAddress) => {
    // Trong ứng dụng thực tế, chúng ta sẽ lưu địa chỉ mới vào database
    // Nhưng ở đây chúng ta sẽ chỉ cập nhật địa chỉ đã chọn
    setSelectedAddress(values);
  };

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      notifications.show({
        title: 'Lỗi',
        message: 'Vui lòng chọn địa chỉ giao hàng',
        color: 'red',
        icon: <FiAlertTriangle />,
      });
      return;
    }

    setLoading(true);

    // Giả lập API call
    setTimeout(() => {
      setLoading(false);
      // setOrderSuccess(true);
      setOrderFailed(true);
      setErrorMessage('Hệ thống thanh toán tạm thời không khả dụng.');
    }, 1500);
  };



  // Trang đặt hàng thành công
  if (orderSuccess) {

    const orderNumber = `ANR-${Math.floor(Math.random() * 1000000)}`;
    const orderDate = new Date();

    return (
      <PaymentResult
        status="success"
        orderNumber={orderNumber}
        orderDate={orderDate}
        paymentMethod={selectedPaymentMethod}
        total={total}
        paymentMethods={paymentMethods}
      />
    );
  }
  if (orderFailed) {
    return (
      <PaymentResult
        status="failure"
        paymentMethods={paymentMethods}
        errorMessage={errorMessage}
      />
    );
  }

return (
  <Container size="xl" className="py-6">
    <CheckoutBreadcrumbs />
    <Grid gutter="xl">
      <Grid.Col span={{ base: 12, md: 8 }}>

        {/* Sử dụng component Address */}
        <Address
          savedAddresses={savedAddresses}
          selectedAddress={selectedAddress}
          setSelectedAddress={setSelectedAddress}
          onAddNewAddress={handleAddNewAddress}
          onUpdateAddress={handleUpdateAddress}
          dummyVietnamProvinces={dummyVietnamProvinces}
          dummyVietnamDistricts={dummyVietnamDistricts}
          dummyVietnamWards={dummyVietnamWards}
        />

        <ListProduct cartItems={cartItems} />

        <Transport
          shippingMethods={shippingMethods}
          selectedShippingMethod={selectedShippingMethod}
          setSelectedShippingMethod={setSelectedShippingMethod}
        />

        <PaymentMethod
          paymentMethods={paymentMethods}
          selectedPaymentMethod={selectedPaymentMethod}
          setSelectedPaymentMethod={setSelectedPaymentMethod}
        />


      </Grid.Col>

      <Grid.Col span={{ base: 12, md: 6, lg: 4 }}>
        <div className="sticky top-4">
          <CheckoutReview
            cartItems={cartItems}
            orderSummary={{
              subtotal,
              discount,
              shippingCost,
              total
            }}
            onPlaceOrder={handlePlaceOrder}
            loading={loading}
          />
        </div>
      </Grid.Col>
    </Grid>
  </Container>
);
}

export default CheckoutPage;