import { Box, Title, Stack, Group, Image, Badge, Text, Divider, Paper, Button, ScrollArea } from '@mantine/core';
import { FiBox } from 'react-icons/fi';
import { Link } from 'react-router-dom';

// Interface cho sản phẩm trong giỏ hàng
export interface CartItem {
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

interface OrderSummary {
  subtotal: number;
  discount: number;
  shippingCost: number;
  total: number;
}

interface CheckoutReviewProps {
  cartItems: CartItem[];
  orderSummary: OrderSummary;
  onPlaceOrder: () => void;
  loading: boolean;
}

const CheckoutReview = ({ cartItems, orderSummary, onPlaceOrder, loading }: CheckoutReviewProps) => {
  const { subtotal, discount, shippingCost, total } = orderSummary;
  const showScroll = cartItems.length > 2;

  return (
    <Paper radius="lg" withBorder shadow="sm" p="md" className="bg-white mb-6">
      <Title order={4} className="!mb-4 flex items-center text-slate-900">
        <FiBox className="mr-2" size={18} /> Tổng quan
      </Title>
      
      {/* Danh sách sản phẩm với ScrollArea khi có nhiều sản phẩm */}
      <ScrollArea h={showScroll ? 220 : 'auto'} scrollbarSize={6} offsetScrollbars scrollHideDelay={500}>
        <Stack gap="md" pb={4}>
          {cartItems.map((item) => (
            <Box key={item.id} className="pb-3 border-b border-gray-100">
              <Group align="flex-start">
                <Box className="relative flex-shrink-0 w-[70px] h-[70px]">
                  <Image
                    src={item.thumbnailUrl}
                    alt={item.name}
                    width={70}
                    height={70}
                    radius="md"
                    fit="cover"
                    className="border border-gray-200"
                  />
                  <Badge
                    className="absolute -top-2 -right-2 bg-primary text-white"
                    radius="xl"
                    size="sm"
                  >
                    {item.quantity}
                  </Badge>
                </Box>
                
                <Stack className="flex-1 gap-1">
                  <Text size="sm" lineClamp={2} fw={500} className="text-slate-900">
                    {item.name}
                  </Text>
                  
                  <Group gap="xs">
                    {item.attributes.color && (
                      <Text size="xs" color="dimmed">
                        Màu: {item.attributes.color}
                      </Text>
                    )}
                    {item.attributes.size && (
                      <Text size="xs" color="dimmed">
                        Size: {item.attributes.size}
                      </Text>
                    )}
                  </Group>
                  
                  <Group justify="space-between" wrap="nowrap">
                    <Text size="sm" fw={600} className="text-primary">
                      {item.price.toLocaleString()}₫
                    </Text>
                    {item.price !== item.originalPrice && (
                      <Text size="xs" td="line-through" color="dimmed">
                        {item.originalPrice.toLocaleString()}₫
                      </Text>
                    )}
                  </Group>
                </Stack>
              </Group>
            </Box>
          ))}
        </Stack>
      </ScrollArea>
      
      {/* Tóm tắt đơn hàng */}
      <Box mt="xl">
        <Text fw={600} className="mb-3 text-slate-900">Tóm tắt đơn hàng</Text>
        
        <Box className="space-y-3 mb-3">
          <Group justify="space-between">
            <Text size="sm" className="text-contentText">Tạm tính:</Text>
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
            <Text size="sm" fw={500}>{shippingCost.toLocaleString()}₫</Text>
          </Group>
        </Box>
        
        <Divider className="my-4" />
        
        <Group justify="space-between">
          <Text fw={600} className="text-slate-900">Tổng cộng:</Text>
          <Text fw={700} size="lg" className="text-primary">{total.toLocaleString()}₫</Text>
        </Group>

        <Divider className="my-4" />

        {/* Nút đặt hàng - chuyển từ CheckoutPage */}
        <Box>
          <Button
            size="md"
            radius="md"
            fullWidth
            color="blue"
            onClick={onPlaceOrder}
            loading={loading}
            className="bg-primary hover:bg-picton-blue-600"
          >
            Đặt hàng
          </Button>
          <Text size="xs" color="dimmed" className="text-center !mt-3">
            Bằng việc đặt hàng, bạn đồng ý với <Link to="/terms" className="text-primary hover:underline">Điều khoản sử dụng</Link> và <Link to="/privacy" className="text-primary hover:underline">Chính sách bảo mật</Link> của chúng tôi.
          </Text>
        </Box>
      </Box>
    </Paper>
  );
};

export default CheckoutReview;