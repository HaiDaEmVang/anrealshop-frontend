import React from 'react';
import { 
  Paper, 
  Title, 
  Text, 
  Box, 
  Group, 
  Button, 
  Divider, 
  Alert
} from '@mantine/core';
import { FiTruck, FiArrowRight, FiAlertCircle } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface SummerProps {
  selectedItemsCount: number;
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
  hasSelectedItems: boolean;
  freeShippingThreshold: number;
  freeShippingAmount: number;
}

const Summer: React.FC<SummerProps> = ({
  selectedItemsCount,
  subtotal,
  discount,
  shippingCost,
  total,
  hasSelectedItems,
  freeShippingThreshold,
  freeShippingAmount
}) => {
  return (
    <Paper radius="md" shadow="sm" p="md" className="bg-white mb-6">
      {/* Tiêu đề */}
      <Title order={4} className="mb-4 text-slate-800">
        Tóm tắt đơn hàng
      </Title>
      
      {/* Thông tin thanh toán - luôn hiển thị, ngay cả khi chưa chọn sản phẩm */}
      <Box className="space-y-3 mb-3">
        <Group justify="space-between">
          <Text size="sm" className="text-contentText">Tạm tính ({selectedItemsCount} sản phẩm):</Text>
          <Text size="sm" fw={500}>{subtotal.toLocaleString()}₫</Text>
        </Group>
        
        {discount > 0 && (
          <Group justify="space-between">
            <Text size="sm" className="text-contentText">Giảm giá:</Text>
            <Text size="sm" fw={500} className="text-green-600">-{discount.toLocaleString()}₫</Text>
          </Group>
        )}
        
        <Group justify="space-between">
          <Text size="sm" className="text-contentText">Phí vận chuyển:</Text>
          {hasSelectedItems ? (
            subtotal >= freeShippingThreshold ? (
              <Text size="sm" fw={500} className="text-green-600">Miễn phí</Text>
            ) : (
              <Text size="sm" fw={500}>{shippingCost.toLocaleString()}₫</Text>
            )
          ) : (
            <Text size="sm" fw={500}>0₫</Text>
          )}
        </Group>
      </Box>
      
      {/* Thông báo miễn phí vận chuyển - chỉ hiển thị khi có sản phẩm được chọn */}
      {hasSelectedItems && subtotal < freeShippingThreshold && subtotal > 0 && (
        <Alert className="mb-4 bg-amber-50 border-amber-100 text-amber-900" p="xs">
          <Group gap={6}>
            <FiTruck className="text-amber-600" />
            <Text size="xs">
              Mua thêm <strong>{freeShippingAmount.toLocaleString()}₫</strong> để được <strong>miễn phí vận chuyển</strong>!
            </Text>
          </Group>
        </Alert>
      )}
      
      {/* Thông báo khi chưa chọn sản phẩm */}
      {!hasSelectedItems && (
        <Alert className="mb-4 bg-blue-50 border-blue-100 text-blue-800" p="xs">
          <Group gap={6}>
            <FiAlertCircle className="text-blue-600" />
            <Text size="xs">
              Vui lòng chọn sản phẩm để tiến hành thanh toán
            </Text>
          </Group>
        </Alert>
      )}
      
      <Divider className="my-4" />
      
      {/* Tổng cộng - luôn hiển thị */}
      <Group justify="space-between" className="mb-6">
        <Text fw={600} className="text-slate-900">Tổng cộng:</Text>
        <Text fw={700} size="lg" className="text-primary">{total.toLocaleString()}₫</Text>
      </Group>
      
      {/* Nút thanh toán - vô hiệu hóa khi chưa chọn sản phẩm */}
      <Button
        component={Link}
        to={hasSelectedItems ? "/checkout" : "#"}
        size="md"
        color="blue"
        radius="md"
        fullWidth
        className={`${hasSelectedItems ? "bg-primary hover:bg-picton-blue-600" : "bg-gray-300 cursor-not-allowed"}`}
        rightSection={<FiArrowRight size={16} />}
        disabled={!hasSelectedItems}
        onClick={(e) => {
          if (!hasSelectedItems) {
            e.preventDefault();
          }
        }}
      >
        Tiến hành thanh toán
      </Button>
    </Paper>
  );
};

export default Summer;