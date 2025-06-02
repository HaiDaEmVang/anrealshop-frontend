import { Badge, Card, Group, Image, Rating, Text } from '@mantine/core';
import { Link } from 'react-router-dom';
import type { Product } from '../../../data/UserData';

interface ProductCardProps {
  product: Product;
  compact?: boolean;
}

const ProductCard: React.FC<ProductCardProps> = ({ product, compact = false }) => {
  const { id, name, price, discountPrice, images, rating, reviewCount, isNew } = product;
  const discountPercentage = discountPrice ? Math.round(((price - discountPrice) / price) * 100) : 0;

  return (
    <Card
      shadow="sm"
      padding={0}
      radius="md"
      withBorder
      className="h-full flex flex-col bg-white transition-all duration-300 hover:shadow-md overflow-hidden"
      style={{ width: compact ? '151px' : '100%' }}
    >
      <Link to={`/product/${id}`} className="block no-underline">
        {/* Card Wrapper */}
        <div className="flex flex-col h-full">
          {/* Image Section */}
          <div className="relative">
            <div className="overflow-hidden" style={{ aspectRatio: '1/1' }}>
              <Image
                src={images[0]}
                alt={name}
                className="transition-transform duration-300 hover:scale-105"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            </div>

            {/* Badges positioned on the image */}
            <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
              {isNew && (
                <Badge color="green" className="font-medium text-xs">
                  Mới
                </Badge>
              )}
            </div>
          </div>

          {/* Content Section */}
          <div className="p-3 flex flex-col flex-grow">
            {/* Product Name */}
            <Text
              fw={500}
              lineClamp={2}
              className="text-slate-900 text-sm !mb-1"
              style={{ minHeight: '2.75rem' }}
            >
              {name}
            </Text>

            {/* Rating */}
            <div className="mb-2">
              <Group gap={4} wrap="nowrap">
                <Rating value={rating} fractions={2} readOnly size="xs" />
                <Text size="xs" c="dimmed">({reviewCount})</Text>
              </Group>
            </div>

            {/* Price Section */}
            <div className="mt-auto">
              {/* Discounted Price */}
              {discountPrice ? (
                <>
                  <Text fw={700} className="text-red-500" size="sm">
                    {discountPrice.toLocaleString()}<sup>₫</sup>
                  </Text>
                  <Group gap={4}>
                    <Badge size="sm"  radius="sm" className="font-normal ">-{discountPercentage}%</Badge>
                    <Text td="line-through" c="dimmed" size="xs">
                      {price.toLocaleString()}<sup>₫</sup>
                    </Text>
                  </Group>
                </>
              ) : (
                <Text fw={700} className="text-slate-900" size="sm">
                  {price.toLocaleString()}<sup>₫</sup>
                </Text>
              )}
            </div>
          </div>
        </div>
      </Link>


    </Card>
  );
};

export default ProductCard;