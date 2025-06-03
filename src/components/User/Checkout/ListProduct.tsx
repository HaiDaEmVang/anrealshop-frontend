import { useState } from 'react';
import { Paper, Text, Group, Stack, Image, Box, Divider, Button, ThemeIcon, Collapse } from '@mantine/core';
import { FiShoppingBag, FiChevronUp, FiChevronDown, FiPackage } from 'react-icons/fi';

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

interface ListProductProps {
  cartItems?: CartItem[];
}

const ListProduct = ({ cartItems = [] }: ListProductProps) => {
  const [expanded, setExpanded] = useState(true);
  
  // Nếu không có sản phẩm nào, hiển thị thông báo
  if (!cartItems || cartItems.length === 0) {
    return (
      <Paper radius="md" shadow="sm" p="md" className="bg-white mb-6">
        <Group justify="space-between" className="mb-3">
          <Text fw={600} size="md" className="text-slate-800 flex items-center">
            <FiShoppingBag className="inline-block mr-2" size={16} />
            Sản phẩm
          </Text>
        </Group>
        <Text color="dimmed" className="text-center py-6">
          Không có sản phẩm nào trong giỏ hàng
        </Text>
      </Paper>
    );
  }

  const totalItems = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  
  // Hiển thị sản phẩm đầu tiên khi thu gọn
  const firstItem = cartItems[0];
  const hasMoreItems = cartItems.length > 1;

  return (
    <Paper radius="md" shadow="sm" p="md" className="bg-white mb-6">
      <Group justify="space-between" className="mb-3">
        <Text fw={600} size="md" className="text-slate-800 flex items-center">
          <FiShoppingBag className="inline-block mr-2" size={16} />
          Sản phẩm ({totalItems})
        </Text>
        
        {/* Nút ẩn/hiện danh sách sản phẩm, chỉ hiển thị khi có từ 2 sản phẩm trở lên */}
        {hasMoreItems && (
          <Button
            variant="subtle"
            color="gray"
            size="xs"
            onClick={() => setExpanded(!expanded)}
            rightSection={expanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
          >
            {expanded ? "Thu gọn" : "Xem tất cả"}
          </Button>
        )}
      </Group>

      {/* Item đầu tiên luôn hiển thị */}
      <Box >
        <ProductItem item={firstItem} />
      </Box>

      {/* Các item còn lại hiển thị khi mở rộng */}
      {hasMoreItems && (
        <>
          {!expanded && (
            <>
              <Divider my="xs" />
              <Group py="xs" justify="center" onClick={() => setExpanded(true)} className="cursor-pointer hover:bg-gray-50 rounded-md">
                <ThemeIcon variant="light" color="gray" size="sm" radius="xl">
                  <FiPackage size={14} />
                </ThemeIcon>
                <Text size="sm" color="dimmed">
                  và {cartItems.length - 1} sản phẩm khác
                </Text>
              </Group>
            </>
          )}
          
          <Collapse in={expanded}>
            <Stack gap={0} mt={hasMoreItems ? "md" : 0}>
              {cartItems.slice(1).map((item, index) => (
                <Box key={`${item.id}-${index}`} className="">
                  {index === 0 && <Divider mb="md" />}
                  <ProductItem item={item} />
                  {index < cartItems.length - 2 && <Divider mt="xs" />}
                </Box>
              ))}
            </Stack>
          </Collapse>
        </>
      )}
    </Paper>
  );
};

// Component con để hiển thị từng sản phẩm
const ProductItem = ({ item }: { item: CartItem }) => {
  if (!item) return null;
  try {
    const formattedPrice = item.price.toLocaleString();
    const formattedOriginalPrice = item.originalPrice.toLocaleString();
    const hasDiscount = item.originalPrice > item.price;

    return (
      <Group wrap="nowrap" gap="md" align="flex-start">
        <Image
          src={item.thumbnailUrl}
          alt={item.name}
          radius="md"
          className="w-28 h-28 object-cover border border-gray-200"
        />

        <Box style={{ flex: 1 }}>
          <Text lineClamp={2} size="lg" fw={500} className="text-slate-800 min-h-[2.75rem]">
            {item.name}
          </Text>

          {/* Hiển thị màu và size bằng Text thay vì Badge */}
          <Text size="xs" color="dimmed" mt={4}>
            {item.attributes.color && item.attributes.size 
              ? `${item.attributes.color}, ${item.attributes.size}`
              : item.attributes.color || item.attributes.size || ''}
          </Text>

          <Group mt={6} justify="space-between">
            <Group gap={8}>
              <Text size="sm" fw={600} className="!text-primary">
                {formattedPrice}₫
              </Text>
              
              {hasDiscount && (
                <Text size="xs" td="line-through" color="dimmed">
                  {formattedOriginalPrice}₫
                </Text>
              )}
            </Group>

            <Text size="sm" color="dimmed">
              x{item.quantity}
            </Text>
          </Group>
        </Box>
      </Group>
    );
  } catch (error) {
    console.error("Error rendering ProductItem:", error);
    return (
      <Text color="red" size="sm">Lỗi hiển thị sản phẩm</Text>
    );
  }
};

export default ListProduct;