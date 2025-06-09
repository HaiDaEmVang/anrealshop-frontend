import React from 'react';
import { Paper, Group, Box, Text, Badge, Rating, Image } from '@mantine/core';
import { Link } from 'react-router-dom';
import { type Product } from '../../../data/UserData';

interface ProductListItemProps {
  product: Product;
}

const ProductListItem: React.FC<ProductListItemProps> = ({ product }) => {
  const { id, name, price, discountPrice, images, rating, reviewCount, shop, category } = product;
  const discountPercentage = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;
  
  return (
    <Paper radius="md" withBorder p="md" className="transition-all hover:shadow-md">
      <Group wrap="nowrap" align="flex-start">
        <Link to={`/product/${id}`} style={{ width: '120px', minWidth: '120px' }}>
          <Box className="overflow-hidden rounded-md" style={{ aspectRatio: '1/1' }}>
            <Image
              src={images[0]}
              alt={name}
              className="transition-transform duration-300 hover:scale-105"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          </Box>
        </Link>
        
        <Box className="flex-1 min-w-0">
          <Link to={`/product/${id}`} className="no-underline">
            <Text fw={500} size="lg" lineClamp={2} className="text-slate-900">
              {name}
            </Text>
          </Link>
          
          <Group mt={4}>
            <Rating value={rating} fractions={2} readOnly size="sm" />
            <Text size="sm" c="dimmed">({reviewCount})</Text>
          </Group>
          
          <Group mt={8} gap={8}>
            {discountPrice ? (
              <>
                <Text fw={700} size="xl" className="text-red-500">
                  {discountPrice.toLocaleString()}₫
                </Text>
                <Group gap={8} wrap="nowrap">
                  <Badge size="lg" radius="sm" className="font-normal">-{discountPercentage}%</Badge>
                  <Text td="line-through" c="dimmed">
                    {price.toLocaleString()}₫
                  </Text>
                </Group>
              </>
            ) : (
              <Text fw={700} size="xl" className="text-slate-900">
                {price.toLocaleString()}₫
              </Text>
            )}
          </Group>
          
          <Group mt={12} className="text-sm text-gray-600">
            <Text>Cửa hàng: {shop.name}</Text>
            <Text>|</Text>
            <Text>Danh mục: {category.name}</Text>
          </Group>
        </Box>
      </Group>
    </Paper>
  );
};

export default ProductListItem;