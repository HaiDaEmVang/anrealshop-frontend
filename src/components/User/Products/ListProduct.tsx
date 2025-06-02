import { Box, Group, SimpleGrid, Title } from '@mantine/core';
import { FiTrendingUp } from 'react-icons/fi';
import { mockTrendingProducts } from '../../../data/UserData';
import ProductCard from './ProductCard';

const ListProduct = () => {
    return (
        <Box>
            <Group justify="start" className="mb-4">
                <Title order={4} className="flex items-center gap-2 text-slate-900">
                    <FiTrendingUp size={20} className="text-red-500" />
                    <span>Gợi ý cho bạn</span>
                </Title>
            </Group>

            <SimpleGrid
                cols={{ base: 1, sm: 2, md: 3, lg: 5, xl: 6 }}
                spacing="md"
            >
                {mockTrendingProducts.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </SimpleGrid>
        </Box>
    );
};

export default ListProduct;
