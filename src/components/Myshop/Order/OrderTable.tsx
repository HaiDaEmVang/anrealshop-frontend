import { Button, Group, Pagination, Skeleton, Text } from '@mantine/core';
import { useState } from 'react';
import { FiCheckCircle, FiClock, FiDollarSign, FiPackage, FiTruck, FiX } from 'react-icons/fi';
import GridView from './GridView';
import ListView from './ListView';
import OrderFilter from './OrderFilter';

interface OrderTableProps {
  status: string;
  timeRange?: string;
}

// Khai báo interface cho OrderItem
interface OrderItem {
  id: string;
  productId: string;
  productName: string;
  productImage: string;
  category: string;
  sku: string;
  variant: string;
  quantity: number;
  price: number;
  totalPrice: number;
  
  // Thông tin đơn hàng liên quan
  orderId: string;
  orderNumber: string;
  orderDate: string;
  orderStatus: 'pending' | 'processing' | 'shipping' | 'completed' | 'cancelled' | 'refunded';
  paymentStatus: 'paid' | 'unpaid' | 'partial' | 'refunded';
  customerName: string;
  customerPhone: string;
  shippingAddress: string;
}

// Cấu hình hiển thị cho các trạng thái
const statusConfig = {
  pending: { icon: <FiClock size={16} />, color: 'yellow', label: 'Chờ xác nhận' },
  processing: { icon: <FiPackage size={16} />, color: 'blue', label: 'Đang xử lý' },
  shipping: { icon: <FiTruck size={16} />, color: 'indigo', label: 'Đang giao hàng' },
  completed: { icon: <FiCheckCircle size={16} />, color: 'green', label: 'Hoàn thành' },
  cancelled: { icon: <FiX size={16} />, color: 'red', label: 'Đã hủy' },
  refunded: { icon: <FiDollarSign size={16} />, color: 'orange', label: 'Hoàn tiền' }
};

// Cấu hình hiển thị cho trạng thái thanh toán
const paymentStatusConfig = {
  paid: { color: 'green', label: 'Đã thanh toán' },
  unpaid: { color: 'red', label: 'Chưa thanh toán' },
  partial: { color: 'yellow', label: 'Thanh toán một phần' },
  refunded: { color: 'gray', label: 'Đã hoàn tiền' }
};

// Dữ liệu mẫu
const sampleOrderItems: OrderItem[] = [
  // Đơn hàng 1
  {
    id: '101',
    productId: 'P001',
    productName: 'Áo thun nam cổ tròn basic',
    productImage: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=100',
    category: 'Thời trang nam',
    sku: 'ATN001',
    variant: 'Đen / XL',
    quantity: 2,
    price: 220000,
    totalPrice: 440000,
    orderId: '1',
    orderNumber: 'ORD-23065',
    orderDate: '2023-12-05 14:30',
    orderStatus: 'pending',
    paymentStatus: 'unpaid',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM'
  },
  {
    id: '102',
    productId: 'P002',
    productName: 'Quần jeans nam slim fit',
    productImage: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=100',
    category: 'Thời trang nam',
    sku: 'QJN002',
    variant: 'Xanh đậm / 32',
    quantity: 1,
    price: 830000,
    totalPrice: 830000,
    orderId: '1',
    orderNumber: 'ORD-23065',
    orderDate: '2023-12-05 14:30',
    orderStatus: 'pending',
    paymentStatus: 'unpaid',
    customerName: 'Nguyễn Văn A',
    customerPhone: '0901234567',
    shippingAddress: '123 Nguyễn Văn Linh, Quận 7, TP.HCM'
  },
  // Đơn hàng 2
  {
    id: '201',
    productId: 'P003',
    productName: 'Váy liền thân công sở',
    productImage: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?q=80&w=100',
    category: 'Thời trang nữ',
    sku: 'VLT003',
    variant: 'Đen / M',
    quantity: 1,
    price: 510000,
    totalPrice: 510000,
    orderId: '2',
    orderNumber: 'ORD-23066',
    orderDate: '2023-12-05 15:12',
    orderStatus: 'processing',
    paymentStatus: 'paid',
    customerName: 'Trần Thị B',
    customerPhone: '0912345678',
    shippingAddress: '456 Lê Văn Lương, Quận 7, TP.HCM'
  },
  // Đơn hàng 3
  {
    id: '301',
    productId: 'P004',
    productName: 'Áo khoác nam dù chống nước',
    productImage: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100',
    category: 'Thời trang nam',
    sku: 'AKD004',
    variant: 'Xanh rêu / L',
    quantity: 1,
    price: 650000,
    totalPrice: 650000,
    orderId: '3',
    orderNumber: 'ORD-23067',
    orderDate: '2023-12-04 10:25',
    orderStatus: 'shipping',
    paymentStatus: 'paid',
    customerName: 'Lê Văn C',
    customerPhone: '0923456789',
    shippingAddress: '789 Điện Biên Phủ, Quận 3, TP.HCM'
  },
  {
    id: '302',
    productId: 'P005',
    productName: 'Giày thể thao nam',
    productImage: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?q=80&w=100',
    category: 'Giày dép',
    sku: 'GTT005',
    variant: 'Trắng / 42',
    quantity: 1,
    price: 1250000,
    totalPrice: 1250000,
    orderId: '3',
    orderNumber: 'ORD-23067',
    orderDate: '2023-12-04 10:25',
    orderStatus: 'shipping',
    paymentStatus: 'paid',
    customerName: 'Lê Văn C',
    customerPhone: '0923456789',
    shippingAddress: '789 Điện Biên Phủ, Quận 3, TP.HCM'
  },
  {
    id: '303',
    productId: 'P006',
    productName: 'Tất nam cổ ngắn',
    productImage: 'https://images.unsplash.com/photo-1586350977771-b3b0abd50c82?q=80&w=100',
    category: 'Phụ kiện',
    sku: 'TN006',
    variant: 'Đen / Free size',
    quantity: 5,
    price: 100000,
    totalPrice: 500000,
    orderId: '3',
    orderNumber: 'ORD-23067',
    orderDate: '2023-12-04 10:25',
    orderStatus: 'shipping',
    paymentStatus: 'paid',
    customerName: 'Lê Văn C',
    customerPhone: '0923456789',
    shippingAddress: '789 Điện Biên Phủ, Quận 3, TP.HCM'
  },
  // Đơn hàng 4
  {
    id: '401',
    productId: 'P007',
    productName: 'Túi xách nữ công sở',
    productImage: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?q=80&w=100',
    category: 'Phụ kiện',
    sku: 'TXN007',
    variant: 'Đen / Trung',
    quantity: 1,
    price: 750000,
    totalPrice: 750000,
    orderId: '4',
    orderNumber: 'ORD-23068',
    orderDate: '2023-12-04 09:18',
    orderStatus: 'completed',
    paymentStatus: 'paid',
    customerName: 'Phạm Thị D',
    customerPhone: '0934567890',
    shippingAddress: '101 Võ Văn Ngân, Quận 9, TP.HCM'
  },
  // Đơn hàng 5
  {
    id: '501',
    productId: 'P008',
    productName: 'Đồng hồ nam cao cấp',
    productImage: 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=100',
    category: 'Phụ kiện',
    sku: 'DH008',
    variant: 'Bạc / Free size',
    quantity: 1,
    price: 1670000,
    totalPrice: 1670000,
    orderId: '5',
    orderNumber: 'ORD-23069',
    orderDate: '2023-12-03 16:45',
    orderStatus: 'cancelled',
    paymentStatus: 'refunded',
    customerName: 'Hoàng Văn E',
    customerPhone: '0945678901',
    shippingAddress: '202 Nguyễn Hữu Cảnh, Quận Bình Thạnh, TP.HCM'
  },
  // Đơn hàng 6
  {
    id: '601',
    productId: 'P009',
    productName: 'Tai nghe Bluetooth',
    productImage: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100',
    category: 'Điện tử',
    sku: 'TN009',
    variant: 'Đen / Free size',
    quantity: 1,
    price: 920000,
    totalPrice: 920000,
    orderId: '6',
    orderNumber: 'ORD-23070',
    orderDate: '2023-12-03 11:30',
    orderStatus: 'refunded',
    paymentStatus: 'refunded',
    customerName: 'Đỗ Thị F',
    customerPhone: '0956789012',
    shippingAddress: '303 Trường Chinh, Quận Tân Bình, TP.HCM'
  },
];


const OrderTable = ({ status, timeRange }: OrderTableProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<string | null>('newest');
  const [detailView, setDetailView] = useState<boolean>(false);

  // Lọc các sản phẩm dựa trên trạng thái đơn hàng
  const filteredItems = sampleOrderItems.filter((item) => {
    // Lọc theo trạng thái đơn hàng
    if (status !== 'all' && item.orderStatus !== status) {
      return false;
    }

    // Lọc theo từ khóa tìm kiếm
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        item.productName.toLowerCase().includes(searchLower) ||
        item.sku.toLowerCase().includes(searchLower) ||
        item.orderNumber.toLowerCase().includes(searchLower) ||
        item.customerName.toLowerCase().includes(searchLower);

      if (!matchesSearch) return false;
    }

    // Lọc theo danh mục sản phẩm
    if (categoryFilter && item.category !== categoryFilter) {
      return false;
    }

    return true;
  });

  // Sắp xếp các sản phẩm
  const sortedItems = [...filteredItems].sort((a, b) => {
    switch (sortBy) {
      case 'newest':
        return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
      case 'oldest':
        return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
      case 'price-asc':
        return a.price - b.price;
      case 'price-desc':
        return b.price - a.price;
      case 'name-asc':
        return a.productName.localeCompare(b.productName);
      case 'name-desc':
        return b.productName.localeCompare(a.productName);
      default:
        return 0;
    }
  });

  // Phân trang
  const itemsPerPage = 10;
  const totalPages = Math.ceil(sortedItems.length / itemsPerPage);
  const paginatedItems = sortedItems.slice((page - 1) * itemsPerPage, page * itemsPerPage);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedItems(paginatedItems.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, id]);
    } else {
      setSelectedItems(prev => prev.filter(itemId => itemId !== id));
    }
  };

  // Cập nhật trạng thái sản phẩm
  const handleUpdateStatus = (itemId: string, newStatus: string) => {
    console.log(`Cập nhật sản phẩm ${itemId} sang trạng thái ${newStatus}`);
    // Thực hiện API call để cập nhật trạng thái
  };

  // Xử lý cập nhật trạng thái hàng loạt
  const handleBulkStatusUpdate = (newStatus: string) => {
    console.log(`Cập nhật ${selectedItems.length} sản phẩm sang trạng thái ${newStatus}`);
    // Thực hiện API call để cập nhật nhiều sản phẩm
  };

  // Xử lý in đơn hàng
  const handlePrint = () => {
    console.log('In đơn hàng cho các sản phẩm đã chọn:', selectedItems);
    // Thực hiện logic in
  };

  // Xử lý xuất Excel
  const handleExport = () => {
    console.log('Xuất Excel cho các sản phẩm đã chọn:', selectedItems);
    // Thực hiện logic xuất Excel
  };

  // Format tiền tệ
  const formatPrice = (amount: number) => {
    return amount.toLocaleString('vi-VN') + '₫';
  };

  // Format ngày giờ
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Danh mục để lọc
  const categories = [...new Set(sampleOrderItems.map(item => item.category))].map(
    category => ({ value: category, label: category })
  );

  if (isLoading) {
    return (
      <Skeleton height={400} radius="sm" />
    );
  }

  return (
    <div>
      {/* Sử dụng component OrderFilter */}
      <OrderFilter
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortByChange={setSortBy}
        detailView={detailView}
        onDetailViewChange={setDetailView}
        selectedItems={selectedItems}
        totalItems={paginatedItems.length}
        onSelectAll={handleSelectAll}
        onBulkStatusUpdate={handleBulkStatusUpdate}
        onPrint={handlePrint}
        onExport={handleExport}
        categories={categories}
      />

      {filteredItems.length === 0 ? (
        <div className="text-center py-10">
          <FiPackage size={48} className="mx-auto text-gray-300 mb-4" />
          <Text size="lg" fw={500} c="dimmed">Không tìm thấy sản phẩm nào</Text>
          <Text size="sm" c="dimmed" mt="xs">
            Không có sản phẩm nào trong trạng thái đã chọn
          </Text>
          {(searchTerm || categoryFilter) && (
            <Button 
              variant="outline" 
              mt="md" 
              onClick={() => {
                setSearchTerm('');
                setCategoryFilter(null);
              }}
            >
              Xóa bộ lọc
            </Button>
          )}
        </div>
      ) : detailView ? (
        // Sử dụng component ListView
        <ListView
          items={paginatedItems}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onUpdateStatus={handleUpdateStatus}
          statusConfig={statusConfig}
          paymentStatusConfig={paymentStatusConfig}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      ) : (
        // Sử dụng component GridView
        <GridView
          items={paginatedItems}
          selectedItems={selectedItems}
          onSelectItem={handleSelectItem}
          onSelectAll={handleSelectAll}
          onUpdateStatus={handleUpdateStatus}
          statusConfig={statusConfig}
          formatPrice={formatPrice}
          formatDate={formatDate}
        />
      )}

      {/* Phân trang */}
      {filteredItems.length > 0 && (
        <Group justify="apart" mt="lg">
          <Text size="sm" c="dimmed">
            Hiển thị {paginatedItems.length} trên tổng số {filteredItems.length} sản phẩm
          </Text>
          <Pagination value={page} onChange={setPage} total={totalPages} size="sm" radius="md" />
        </Group>
      )}
    </div>
  );
};

export default OrderTable;