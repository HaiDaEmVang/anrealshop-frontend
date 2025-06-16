import { Button, Container, Paper } from '@mantine/core';

// Components
import HeroBanner from './Banner/HeroBanner';
import PromotionBanner from './Banner/PromationBanner';
import Categories from './Category/Categories';
import NewsletterSignup from '../Common/NewLetterSignup';
import FeaturedProducts from './Products/FeatureProduct';
import ListProduct from './Products/ListProduct';
import NewArrivals from './Products/NewArrivals';
import SearchTop from './SearchTop';
import TrendingProducts from './Products/TrendingProduct';

const HomePage = () => {
    return (
        <div className="bg-gray-50 py-6">
            <Container size="xl" className="px-4">
                {/* Hero Banner */}
                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <HeroBanner />
                    </div>
                </Paper>

                {/* Categories Section */}
                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <Categories />
                    </div>
                </Paper>

                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <SearchTop />
                    </div>
                </Paper>

                {/* Featured Products */}
                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <FeaturedProducts />
                    </div>
                </Paper>

                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <PromotionBanner />
                    </div>
                </Paper>

                {/* New Arrivals */}
                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <NewArrivals />
                    </div>
                </Paper>

                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <NewsletterSignup />
                    </div>
                </Paper>

                {/* Trending Products */}
                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <TrendingProducts />
                    </div>
                </Paper>

                <Paper radius="md" className="mb-8 bg-white shadow-sm">
                    <div className="p-4">
                        <ListProduct />
                    </div>
                </Paper>

                <Button
                    variant="outline"
                    color="blue"
                    className="!border-primary !text-primary !hover:bg-blue-50 !mx-auto !block"
                >
                    Xem thêm sản phẩm
                </Button>
            </Container>
        </div>
    );
};

export default HomePage;