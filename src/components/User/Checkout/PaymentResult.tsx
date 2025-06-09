import React from 'react';
import { Box, Button, Container, Group, Paper, Text, Title } from '@mantine/core';
import { FiCheckCircle, FiXCircle, FiHome, FiShoppingBag } from 'react-icons/fi';
import { Link } from 'react-router-dom';

interface PaymentMethodInfo {
  id: string;
  name: string;
}

interface PaymentResultProps {
  status: 'success' | 'failure';
  orderNumber?: string;
  orderDate?: Date;
  paymentMethod?: string;
  total?: number;
  paymentMethods: PaymentMethodInfo[];
  errorMessage?: string;
}

const PaymentResult: React.FC<PaymentResultProps> = ({
  status,
  orderNumber,
  orderDate = new Date(),
  paymentMethod,
  total = 0,
  paymentMethods,
  errorMessage
}) => {
  const getPaymentMethodName = (id: string) => {
    const method = paymentMethods.find(m => m.id === id);
    return method ? method.name : id;
  };

  return (
    <Container size="md" className="py-16">
      <Paper radius="lg" p={0} className="overflow-hidden shadow-xl">
        {/* Header with gradient background */}
        <div className={`h-24 bg-gradient-to-r ${
          status === 'success'
            ? 'from-primary to-picton-blue-400'
            : 'from-red-500 to-orange-400'
        } relative`}>
          <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-white rounded-full p-2 shadow-lg">
            <div className={`rounded-full p-3 ${
              status === 'success'
                ? 'bg-gradient-to-r from-green-400 to-green-500'
                : 'bg-gradient-to-r from-red-400 to-red-500'
            }`}>
              {status === 'success' ? (
                <FiCheckCircle size={46} className="text-white" />
              ) : (
                <FiXCircle size={46} className="text-white" />
              )}
            </div>
          </div>
        </div>

        <Box className="px-6 pt-16 pb-8 text-center">
          <Title order={2} className="!text-2xl !font-bold !mb-3 !text-slate-900">
            {status === 'success' ? 'Đặt hàng thành công!' : 'Đặt hàng không thành công'}
          </Title>

          <Text className="!text-contentText !mb-6 !max-w-md !mx-auto">
            {status === 'success' ? (
              'Cảm ơn bạn đã mua hàng. Đơn hàng của bạn đã được đặt thành công và đang được xử lý. Một email xác nhận sẽ được gửi tới hộp thư của bạn.'
            ) : (
              `Đã xảy ra lỗi trong quá trình đặt hàng. ${errorMessage || 'Vui lòng thử lại sau hoặc liên hệ với bộ phận hỗ trợ.'}`
            )}
          </Text>

          {status === 'success' && orderNumber && (
            <div className="mb-8 bg-picton-blue-50 py-4 px-6 rounded-lg text-left max-w-md mx-auto">
              <Text fw={600} className="text-slate-800 mb-2">Mã đơn hàng: #{orderNumber}</Text>
              <Text size="sm" color="dimmed">Ngày đặt hàng: {orderDate.toLocaleDateString('vi-VN')}</Text>
              {paymentMethod && (
                <Text size="sm" color="dimmed">
                  Phương thức thanh toán: {getPaymentMethodName(paymentMethod)}
                </Text>
              )}
              <Text size="sm" color="dimmed">
                Tổng thanh toán: <span className="font-bold text-primary">{total.toLocaleString()}₫</span>
              </Text>
            </div>
          )}

          <Group justify="center" gap="md">
            {status === 'success' ? (
              <>
                <Button
                  leftSection={<FiShoppingBag size={18} />}
                  variant="outline"
                  color="blue"
                  component={Link}
                  to="/account/orders"
                  size="md"
                >
                  Xem đơn hàng
                </Button>
                <Button
                  rightSection={<FiHome size={18} />}
                  component={Link}
                  to="/"
                  variant="filled"
                  className="bg-primary hover:bg-picton-blue-600"
                  size="md"
                >
                  Tiếp tục mua sắm
                </Button>
              </>
            ) : (
              <>
                <Button
                  leftSection={<FiShoppingBag size={18} />}
                  variant="outline"
                  color="blue"
                  component={Link}
                  to="/checkout"
                  size="md"
                >
                  Thử lại
                </Button>
                <Button
                  rightSection={<FiHome size={18} />}
                  component={Link}
                  to="/"
                  variant="filled"
                  className="bg-primary hover:bg-picton-blue-600"
                  size="md"
                >
                  Trở về trang chủ
                </Button>
              </>
            )}
          </Group>
        </Box>
      </Paper>
    </Container>
  );
};

export default PaymentResult;