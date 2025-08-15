import { ActionIcon, Box, Button, Group, Text } from '@mantine/core';
import { useState } from 'react';
import { FiMinus, FiPlus, FiShoppingCart } from 'react-icons/fi';

interface ProductActionsProps {
  availableQuantity: number;
  onAddToCart: (quantity: number) => void;
  onBuyNow: (quantity: number) => void;
}

const ProductActions = ({ availableQuantity, onAddToCart, onBuyNow }: ProductActionsProps) => {
  const [itemQuantity, setItemQuantity] = useState(1);

  return (
    <>
      <Box className="mb-6">
        <Group justify='start' align='center' className="mb-2" wrap='nowrap'>
          <Text fw={600} className="mb-3">Số lượng:</Text>
          <Group gap={0} className="!border !border-gray-300 !rounded">
            <ActionIcon size="sm"
              onClick={() => setItemQuantity(Math.max(1, itemQuantity - 1))}
              disabled={itemQuantity <= 1}
            >
              <FiMinus size={16} />
            </ActionIcon>
            <Box className="px-4 py-1 text-sm font-semibold">{itemQuantity}</Box>
            <ActionIcon size="sm"
              onClick={() => setItemQuantity(Math.min(availableQuantity, itemQuantity + 1))}
              disabled={itemQuantity >= availableQuantity}
            >
              <FiPlus size={16} />
            </ActionIcon>
          </Group>
        </Group>
      </Box>

      <Group className="mb-4">
        <Button
          leftSection={<FiShoppingCart size={20} />}
          variant="outline"
          color="blue"
          size="md"
          className="flex-1 border-primary text-primary"
          onClick={() => onAddToCart(itemQuantity)}
        >
          Thêm vào giỏ
        </Button>
        <Button
          size="md"
          color="blue"
          className="flex-1 bg-primary hover:bg-primary-dark"
          onClick={() => onBuyNow(itemQuantity)}
        >
          Mua ngay
        </Button>
      </Group>
    </>
  );
};

export default ProductActions;