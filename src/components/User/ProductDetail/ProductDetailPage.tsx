import {
  Button,
  Container,
  Grid,
  Group,
  Paper,
  Skeleton,
  Text,
  Title
} from '@mantine/core';
import { useEffect, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import { mockFeaturedProducts } from '../../../data/UserData';

// Các component con
import Breadcrumbs from './Breadcrumbs';
import ImageProduct from './ImageProduct';
import InforProduct from './InforProduct';
import ProductRate from './ProductRate';

// Định nghĩa các interface
interface AttributeValue {
  id: string;
  value: string;
  displayOrder: number;
  metadata?: string;
  attributeKeyId: string;
}

interface AttributeKey {
  id: string;
  keyName: 'COLOR' | 'MATERIAL' | 'SIZE';
  displayName: string;
  allowCustomValues: boolean;
}

interface ProductMedia {
  id: string;
  url: string;
  type: 'IMAGE' | 'VIDEO';
}

interface ProductReviewMedia {
  id: string;
  mediaUrl: string;
  mediaType: 'IMAGE' | 'VIDEO';
}

interface ProductReview {
  id: string;
  rating: number;
  comment?: string;
  createdAt: string;
  user: {
    id: string;
    username: string;
    fullName?: string;
    avatarUrl?: string;
  };
  media: ProductReviewMedia[];
}

interface ProductSku {
  id: string;
  sku: string;
  price: number;
  quantity: number;
  attributes: AttributeValue[];
}

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  quantity: number;
  sold: number;
  averageRating: number;
  totalReviews: number;
  thumbnailUrl: string;
  location?: string;
  weight: number;
  shop: {
    id: string;
    name: string;
    avatarUrl?: string;
    averageRating: number;
    responseTime?: string;
  };
  category: {
    id: string;
    name: string;
  };
  media: ProductMedia[];
  reviews: ProductReview[];
  skus: ProductSku[];
  attributeKeys: AttributeKey[];
}

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<any[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<ProductSku | null>(null);

  // Fetch product data (mock data for now)
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      // Mock data matching our schema
      const mockProduct: Product = {
        id: slug || '1',
        name: 'Laptop Gaming Acer Nitro 5 AN515-57-54MV NH.QENSV.003',
        description: '<p>Laptop Gaming Acer Nitro 5 AN515-57-54MV NH.QENSV.003 là một chiếc laptop gaming tầm trung với cấu hình mạnh mẽ, màn hình 144Hz đem đến trải nghiệm chơi game mượt mà. Thiết kế gaming hầm hố với hệ thống tản nhiệt hiệu quả giúp máy luôn mát mẻ trong các trận chiến game dài.</p><p>Hiệu năng mạnh mẽ với CPU Intel Core i5-11400H và GPU NVIDIA GeForce GTX 1650 4GB giúp máy xử lý tốt các tựa game phổ biến hiện nay với thiết lập đồ họa trung bình đến cao.</p>',
        price: 18990000,
        quantity: 50,
        sold: 120,
        averageRating: 4.7,
        totalReviews: 45,
        thumbnailUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302',
        location: 'Hà Nội',
        weight: 2.5,
        shop: {
          id: '1',
          name: 'Acer Official Store',
          avatarUrl: 'https://images.unsplash.com/photo-1560179304-6fc1d8749b23',
          averageRating: 4.8,
          responseTime: '12 giờ'
        },
        category: {
          id: '1',
          name: 'Laptop Gaming'
        },
        media: [
          { id: '1', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', type: 'IMAGE' },
          { id: '2', url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed', type: 'IMAGE' },
          { id: '3', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89', type: 'IMAGE' },
          { id: '4', url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', type: 'IMAGE' },
        ],
        reviews: [
          {
            id: '1',
            rating: 5,
            comment: 'Sản phẩm rất tốt, chơi game mượt, màn hình đẹp, không bị giật lag. Đặc biệt là hệ thống tản nhiệt rất ổn, máy không bị nóng khi chơi game lâu.',
            createdAt: '2023-05-20T14:30:00',
            user: {
              id: '101',
              username: 'gamer123',
              fullName: 'Nguyễn Văn A',
              avatarUrl: 'https://i.pravatar.cc/150?img=32'
            },
            media: [
              { id: 'rm1', mediaUrl: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302', mediaType: 'IMAGE' }
            ]
          },
          {
            id: '2',
            rating: 4,
            comment: 'Máy chạy khá ổn, pin trâu, chơi game nặng khoảng 3-4 tiếng. Thiết kế đẹp, bàn phím gõ thoải mái.',
            createdAt: '2023-05-15T10:15:00',
            user: {
              id: '102',
              username: 'techuser',
              fullName: 'Trần Văn B',
              avatarUrl: 'https://i.pravatar.cc/150?img=51'
            },
            media: []
          },
          {
            id: '3',
            rating: 5,
            comment: 'Laptop gaming tốt trong tầm giá, chạy mượt các game như PUBG, LOL với đồ họa cao.',
            createdAt: '2023-05-10T08:45:00',
            user: {
              id: '103',
              username: 'gamefan',
              fullName: 'Lê Thị C',
              avatarUrl: 'https://i.pravatar.cc/150?img=44'
            },
            media: []
          }
        ],
        skus: [
          {
            id: '101',
            sku: 'ACR-NT5-8GB-256GB',
            price: 18990000,
            quantity: 30,
            attributes: [
              { id: '201', value: '8GB', displayOrder: 1, attributeKeyId: '301' },
              { id: '202', value: '256GB', displayOrder: 1, attributeKeyId: '302' }
            ]
          },
          {
            id: '102',
            sku: 'ACR-NT5-16GB-256GB',
            price: 20990000,
            quantity: 15,
            attributes: [
              { id: '203', value: '16GB', displayOrder: 2, attributeKeyId: '301' },
              { id: '204', value: '256GB', displayOrder: 1, attributeKeyId: '302' }
            ]
          },
          {
            id: '103',
            sku: 'ACR-NT5-16GB-512GB',
            price: 22990000,
            quantity: 5,
            attributes: [
              { id: '205', value: '16GB', displayOrder: 2, attributeKeyId: '301' },
              { id: '206', value: '512GB', displayOrder: 2, attributeKeyId: '302' }
            ]
          }
        ],
        attributeKeys: [
          { id: '301', keyName: 'SIZE', displayName: 'RAM', allowCustomValues: false },
          { id: '302', keyName: 'SIZE', displayName: 'SSD', allowCustomValues: false }
        ]
      };

      setProduct(mockProduct);

      // Mock related products based on the same category
      setRelatedProducts(mockFeaturedProducts.slice(0, 6));

      setLoading(false);
    }, 1000);
  }, [slug]);

  // Group attributes by attribute keys
  const groupedAttributes = product?.attributeKeys.map(key => {
    const values = product.skus
      .flatMap(sku => sku.attributes)
      .filter(attr => attr.attributeKeyId === key.id)
      // Remove duplicates
      .filter((attr, index, self) =>
        index === self.findIndex(a => a.value === attr.value)
      )
      // Sort by display order
      .sort((a, b) => a.displayOrder - b.displayOrder);

    return {
      key,
      values
    };
  }) || [];

  // Handle attribute selection
  const handleAttributeSelect = (keyId: string, value: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [keyId]: value
    };
    setSelectedAttributes(newSelectedAttributes);

    // Find matching SKU based on selected attributes
    const matchingSku = product?.skus.find(sku => {
      const attributeKeyIds = Object.keys(newSelectedAttributes);
      return attributeKeyIds.every(keyId => {
        const attributeValue = sku.attributes.find(attr => attr.attributeKeyId === keyId);
        return attributeValue && attributeValue.value === newSelectedAttributes[keyId];
      });
    }) || null;

    setSelectedSku(matchingSku);
  };


  // Handlers for cart and purchase actions
  const handleAddToCart = () => {
    console.log("Added to cart:", product?.name);
    // Thêm logic thêm vào giỏ hàng ở đây
  };

  const handleBuyNow = () => {
    console.log("Buy now:", product?.name);
    // Thêm logic mua ngay ở đây
  };

  // Loading skeleton
  if (loading) {
    return (
      <Container size="xl" className="py-8">
        <Skeleton height={30} width="60%" className="mb-8" />

        <Grid gutter="xl">
          <Grid.Col span={{ base: 12, md: 5 }}>
            <Skeleton height={400} className="mb-4" />
            <Group>
              {[1, 2, 3, 4].map(i => (
                <Skeleton key={i} height={80} width={80} />
              ))}
            </Group>
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 7 }}>
            <Skeleton height={50} className="mb-4" />
            <Skeleton height={30} width="40%" className="mb-3" />
            <Skeleton height={40} width="30%" className="mb-4" />
            <Skeleton height={100} className="mb-4" />
            <Skeleton height={120} className="mb-4" />
            <Group>
              <Skeleton height={50} width="48%" />
              <Skeleton height={50} width="48%" />
            </Group>
          </Grid.Col>
        </Grid>
      </Container>
    );
  }

  if (!product) {
    return (
      <Container size="xl" className="py-8">
        <Paper withBorder p="xl" className="text-center">
          <FiAlertTriangle size={48} className="text-yellow-500 mb-4 mx-auto" />
          <Title order={3} className="mb-2">Sản phẩm không tồn tại</Title>
          <Text className="mb-4">Sản phẩm bạn đang tìm kiếm không tồn tại hoặc đã bị xóa.</Text>
          <Button
            component={Link}
            to="/products"
            variant="filled"
            color="blue"
            className="bg-primary hover:bg-primary-dark"
          >
            Quay lại danh sách sản phẩm
          </Button>
        </Paper>
      </Container>
    );
  }

  return (
    <Container size="xl" className="py-8">
      {/* Sử dụng component Breadcrumbs */}
      <Breadcrumbs
        productName={product.name}
        categoryId={product.category?.id}
        categoryName={product.category?.name}
      />

      <Grid gutter="xl">
        {/* Phần ảnh sản phẩm - sử dụng component ImageProduct */}
        <Grid.Col span={{ base: 12, md: 5 }} className=''>
          <Paper radius="md" className="!mb-8 bg-white shadow-sm sticky top-4">
            <div className="p-4">
              <ImageProduct
                media={product.media}
                thumbnailUrl={product.thumbnailUrl}
                productName={product.name}
              />
            </div>
          </Paper>
        </Grid.Col>

        {/* Thông tin sản phẩm - sử dụng component InforProduct */}
        <Grid.Col span={{ base: 12, md: 7 }}>
          <Paper radius="md" className="!mb-8 !bg-white !shadow-sm">
            <div className="p-4">
              <InforProduct
                name={product.name}
                description={product.description}
                price={product.price}
                quantity={product.quantity}
                sold={product.sold}
                averageRating={product.averageRating}
                totalReviews={product.totalReviews}
                shop={product.shop}
                groupedAttributes={groupedAttributes}
                selectedAttributes={selectedAttributes}
                selectedSku={selectedSku}
                onAttributeSelect={handleAttributeSelect}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
              />
            </div>
          </Paper>

        </Grid.Col>
      </Grid>

      {/* Component đánh giá sản phẩm */}
        <ProductRate
          reviews={product.reviews} 
          averageRating={product.averageRating}
          totalReviews={product.totalReviews}
          ratingDistribution={{
            5: Math.round(product.totalReviews * 0.6),
            4: Math.round(product.totalReviews * 0.25),
            3: Math.round(product.totalReviews * 0.1),
            2: Math.round(product.totalReviews * 0.03),
            1: Math.round(product.totalReviews * 0.02),
          }}
        />

    </Container>
  );
};



export default ProductDetailPage;