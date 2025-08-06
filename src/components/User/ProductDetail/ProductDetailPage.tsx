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
import { useCallback, useEffect, useMemo, useState } from 'react';
import { FiAlertTriangle } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';

// Các component con
import { useGetProduct } from '../../../hooks/useProduct';
import type { MyShopProductSkuDto, ProductDetailDto } from '../../../types/ProductType';
import Breadcrumbs from './Breadcrumbs';
import ImageProduct from './ImageProduct';
import InforProduct from './productInfo/InforProduct';
import type { ProductAttribute } from '../../../types/AttributeType';

const ProductDetailPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [product, setProduct] = useState<ProductDetailDto | null>(null);
  const [media, setMedia] = useState<string[]>([]);
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({});
  const [selectedSku, setSelectedSku] = useState<MyShopProductSkuDto | null>(null);
  const [selectedImage, setSelectedImage] = useState<number>(0);

  const { isLoading, getProductById } = useGetProduct();

  const getOrderImageActive = useCallback((url: string) => {
      if (!url) return 0;
      const index = media.indexOf(url);
      return index !== -1 ? index : 0;
    }, [media]);


  const groupedAttributes = useMemo(() => {
    if (!product?.productSkus?.length) return [];

    const attributeMap = new Map<string, ProductAttribute>();

    product.productSkus.forEach(sku => {
      if (!sku.attributeForSku) return;

      sku.attributeForSku.forEach(attr => {
        if (!attributeMap.has(attr.attributeKeyName)) {
          attributeMap.set(attr.attributeKeyName, {
            attributeKeyName: attr.attributeKeyName,
            attributeKeyDisplay: attr.attributeKeyDisplay,
            values: new Set<string>(),
          });
        }

        attributeMap.get(attr.attributeKeyName)?.values.add(attr.values);
      });
    });

    return Array.from(attributeMap.values());
  }, [product]);

  // Handle attribute selection
  const handleAttributeSelect = (attributeId: string, value: string) => {
    const newSelectedAttributes = {
      ...selectedAttributes,
      [attributeId]: value
    };
    setSelectedAttributes(newSelectedAttributes);

    // Find matching SKU
    if (product?.productSkus) {
      const matchingSku = product.productSkus.find(sku => {
        if (!sku.attributeForSku) return false;
        if (sku.attributeForSku.length !== Object.keys(newSelectedAttributes).length) return false;
        return sku.attributeForSku.every(attr => {
          const attrKey = attr.attributeKeyName;
          return !newSelectedAttributes[attrKey] || newSelectedAttributes[attrKey] === attr.values;
        });
      });
      setSelectedSku(matchingSku || null);
      setSelectedImage(getOrderImageActive(matchingSku?.imageUrl || product.thumbnailUrl));
    }
  };

  const handleAddToCart = () => {
    // Implement add to cart functionality
    console.log("Adding to cart:", { product, selectedSku, selectedAttributes });
  }

  const handleBuyNow = () => {
    // Implement buy now functionality
    console.log("Buying now:", { product, selectedSku, selectedAttributes });
  }

  useEffect(() => {
    if (slug) {
      getProductById(slug)
        .then(productData => {
          setProduct(productData);
          const medias = new Set<string>();
          productData.medias?.forEach(media => {
            if (media.url) {
              medias.add(media.url);
            }
          });
          productData.productSkus?.forEach(sku => {
            if (sku.imageUrl) {
              medias.add(sku.imageUrl);
            }
          });
          setMedia(Array.from(medias));
        })
    }
  }, [slug, getProductById]);
  // Loading skeleton
  if (isLoading) {
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
    <Container size="xl" className="py-4">
      {/* Sử dụng component Breadcrumbs */}
      <Breadcrumbs
        productName={product.name}
        categoryId={product.categoryId}
        categoryName={product.categoryPath?.split(" > ").pop() || "Danh mục"}
      />
      <Grid gutter="md">
        {/* Phần ảnh sản phẩm - sử dụng component ImageProduct */}
        <Grid.Col span={{ base: 12, md: 4.6 }} className=''>
          <Paper radius="md" className="!mb-8 bg-white shadow-sm sticky top-4">
            <div className="p-4">
              <ImageProduct
                media={media}
                thumbnailUrl={product.thumbnailUrl}
                productName={product.name}
                selectedImage={selectedImage}
                setSelectedImage={setSelectedImage}
              />
            </div>
          </Paper>
        </Grid.Col>

        {/* Thông tin sản phẩm - sử dụng component InforProduct */}
        <Grid.Col span={{ base: 12, md: 7.4 }}>
          <Paper radius="md" className="!mb-8 !bg-white !shadow-sm">
            <div className="p-4">
              <InforProduct
                product={product}
                selectedAttributes={selectedAttributes}
                selectedSku={selectedSku}
                onAttributeSelect={handleAttributeSelect}
                onAddToCart={handleAddToCart}
                onBuyNow={handleBuyNow}
                groupedAttributes={groupedAttributes}
              />
            </div>
          </Paper>
        </Grid.Col>
      </Grid>
    </Container>
  );
};

export default ProductDetailPage;