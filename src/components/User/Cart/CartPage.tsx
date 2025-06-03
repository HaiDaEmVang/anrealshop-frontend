import {
  Box,
  Button,
  Container,
  Divider,
  Grid,
  Group,
  Paper,
  Text,
  Title
} from '@mantine/core';
import { notifications } from '@mantine/notifications';
import React, { useState } from 'react';
import {
  FiChevronLeft,
  FiShoppingCart,
  FiTruck
} from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Import component ListProduct
import CartBreadcrumbs from './Breadcrumbs';
import ListProduct, { type CartItem } from './ListProduct';
import Summer from './Summer';

const CartPage: React.FC = () => {
  // Dữ liệu mẫu cho giỏ hàng
  const [cartItems, setCartItems] = useState<CartItem[]>([
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
      inStock: true,
      maxQuantity: 10,
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
      inStock: true,
      maxQuantity: 5,
    },
    {
      id: '3',
      productId: 'p3',
      skuId: 'sku3',
      name: 'Giày thể thao chạy bộ nam',
      price: 750000,
      originalPrice: 950000,
      quantity: 1,
      thumbnailUrl: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=1074',
      attributes: {
        color: 'Đen',
        size: '42',
      },
      inStock: false,
      maxQuantity: 0,
    }
  ]);

  // State để quản lý lựa chọn sản phẩm
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [selectAll, setSelectAll] = useState(false);

  // Xử lý chọn tất cả/bỏ chọn tất cả
  const handleSelectAll = (checked: boolean) => {
    setSelectAll(checked);
    if (checked) {
      // Chọn tất cả các sản phẩm còn hàng
      setSelectedItems(cartItems.filter(item => item.inStock).map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  // Xử lý chọn từng sản phẩm
  const handleSelectItem = (itemId: string, checked: boolean) => {
    if (checked) {
      setSelectedItems(prev => [...prev, itemId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== itemId));
    }
  };

  // Xử lý cập nhật số lượng
  const handleUpdateQuantity = (itemId: string, newQuantity: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxQuantity) }
          : item
      )
    );

    notifications.show({
      title: 'Giỏ hàng đã được cập nhật',
      message: 'Số lượng sản phẩm đã được cập nhật thành công',
      color: 'blue',
    });
  };

  // Xử lý xóa sản phẩm
  const handleRemoveItem = (itemId: string) => {
    setCartItems(prev => prev.filter(item => item.id !== itemId));
    setSelectedItems(prev => prev.filter(id => id !== itemId));

    notifications.show({
      title: 'Đã xóa sản phẩm',
      message: 'Sản phẩm đã được xóa khỏi giỏ hàng',
      color: 'red',
    });
  };

  // Xử lý xóa nhiều sản phẩm
  const handleRemoveSelected = () => {
    if (selectedItems.length === 0) return;

    setCartItems(prev => prev.filter(item => !selectedItems.includes(item.id)));
    setSelectedItems([]);
    setSelectAll(false);

    notifications.show({
      title: 'Đã xóa sản phẩm',
      message: `${selectedItems.length} sản phẩm đã được xóa khỏi giỏ hàng`,
      color: 'red',
    });
  };

  
  // Tính toán tổng thanh toán
  const subtotal = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + (item.price * item.quantity), 0);

  const discount = cartItems
    .filter(item => selectedItems.includes(item.id))
    .reduce((total, item) => total + ((item.originalPrice - item.price) * item.quantity), 0);

  const shippingCost = subtotal > 0 ? 30000 : 0; // Miễn phí vận chuyển cho đơn từ 500,000đ
  const freeShippingThreshold = 500000;
  const freeShippingAmount = Math.max(0, freeShippingThreshold - subtotal);
  const total = subtotal + shippingCost;

  // Kiểm tra xem có sản phẩm nào trong giỏ không
  const isCartEmpty = cartItems.length === 0;

  // Kiểm tra xem có sản phẩm được chọn không
  const hasSelectedItems = selectedItems.length > 0;

  return (
    <Container size="xl" className="py-6">
      <CartBreadcrumbs />

      {isCartEmpty ? (
        // Giỏ hàng trống
        <Paper radius="md" shadow="sm" p="xl" className="bg-white">
          <Box className="text-center py-10">
            <FiShoppingCart size={64} className="text-gray-300 mx-auto mb-4" />
            <Title order={3} className="text-slate-800 mb-3">Giỏ hàng của bạn đang trống</Title>
            <Text color="dimmed" className="mb-6">
              Bạn chưa thêm sản phẩm nào vào giỏ hàng.
            </Text>
            <Button
              component={Link}
              to="/"
              size="md"
              className="bg-primary hover:bg-picton-blue-600"
              leftSection={<FiChevronLeft size={18} />}
            >
              Tiếp tục mua sắm
            </Button>
          </Box>
        </Paper>
      ) : (
        // Giỏ hàng có sản phẩm
        <Grid gutter="xl">
          {/* Cột trái - danh sách sản phẩm */}
          <Grid.Col span={{ base: 12, md: 8 }}>
            <Paper radius="md" shadow="sm" p="md" className="bg-white mb-6">
              {/* Sử dụng component ListProduct */}
              <ListProduct
                cartItems={cartItems}
                selectedItems={selectedItems}
                selectAll={selectAll}
                onSelectAll={handleSelectAll}
                onSelectItem={handleSelectItem}
                onUpdateQuantity={handleUpdateQuantity}
                onRemoveItem={handleRemoveItem}
                onRemoveSelected={handleRemoveSelected}
              />
            </Paper>
          </Grid.Col>

          {/* Cột phải - tổng quan đơn hàng */}
          <Grid.Col span={{ base: 12, md: 4 }}>
            <Box className="sticky top-4">
              <Summer
                selectedItemsCount={selectedItems.length}
                subtotal={subtotal}
                discount={discount}
                shippingCost={shippingCost}
                total={total}
                hasSelectedItems={hasSelectedItems}
                freeShippingThreshold={freeShippingThreshold}
                freeShippingAmount={freeShippingAmount}
              />

              {/* Các chính sách */}
              <Paper radius="md" shadow="sm" p="md" className="bg-white">
                <Box className="space-y-4">
                  <Group gap="xs">
                    <FiTruck className="text-gray-500" size={18} />
                    <Text size="sm">Miễn phí vận chuyển cho đơn hàng từ 500.000₫</Text>
                  </Group>
                  <Divider />
                  <Text size="xs" color="dimmed">
                    Lưu ý: Đơn hàng của bạn có thể được giao thành nhiều đợt tùy thuộc vào kho hàng và địa điểm giao hàng.
                  </Text>
                </Box>
              </Paper>
            </Box>
          </Grid.Col>
        </Grid>
      )}
    </Container>
  );
};

export default CartPage;