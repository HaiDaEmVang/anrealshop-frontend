import { Box, LoadingOverlay, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import ProductReviewModal from './ProductReviewModal';
import RejectModal from './RejectModal';
import SuccessModal from './SuccessModal';
import Filter from './Filter';
import ProductList from './ProductList';
import { mockProducts, type Product } from '../../../types/AdminProductType';

const ProductApprovalPage = () => {
    const [products, setProducts] = useState<Product[]>(mockProducts);
    const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [statusFilter, setStatusFilter] = useState<string | null>('pending');
    const [activeTab, setActiveTab] = useState('pending');
    const [rejectionReason, setRejectionReason] = useState('');
    const [date, setDate] = useState<[Date | null, Date | null]>([null, null]);
    const [searchTerm, setSearchTerm] = useState('');

    const handleDateRangeChange = (range: [Date | null, Date | null]) => {
        setDate(range);
        if (range) {
            setIsLoading(true);
            setTimeout(() => {
                setIsLoading(false);
            }, 500);
        }
    };

    const resetFilters = () => {
        setDate([null, null]);
        setStatusFilter('pending');
        setActiveTab('pending');
        setSearchTerm('');
        setIsLoading(true);
        setTimeout(() => {
            setIsLoading(false);
        }, 500);
    };

    // Modals
    const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
    const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false);
    const [successModalOpened, { open: openSuccessModal, close: closeSuccessModal }] = useDisclosure(false);

    useEffect(() => {
        // Simulate API call with mock data
        setTimeout(() => {
            const mockProducts: Product[] = [
                // ...existing mock data...
            ];
            setProducts(mockProducts);
            setIsLoading(false);
        }, 1000);
    }, []);

    const handleApprove = (product: Product) => {
        setIsLoading(true);
        setTimeout(() => {
            setProducts(prev =>
                prev.map(p =>
                    p.id === product.id ? { ...p, status: 'approved', reviewNote: 'Sản phẩm đạt chuẩn' } : p
                )
            );
            setSelectedProduct(null);
            setIsLoading(false);
            openSuccessModal();
        }, 800);
    };

    const handleReject = () => {
        if (!selectedProduct) return;
        setIsLoading(true);
        setTimeout(() => {
            setProducts(prev =>
                prev.map(p =>
                    p.id === selectedProduct.id ? { ...p, status: 'rejected', reviewNote: rejectionReason } : p
                )
            );
            setSelectedProduct(null);
            setRejectionReason('');
            closeRejectModal();
            setIsLoading(false);
            openSuccessModal();
        }, 800);
    };

    const openProductReview = (product: Product) => {
        setSelectedProduct(product);
        openReviewModal();
    };

    const handleTabChange = (tab: string | null) => {
        if (tab === null) return;
        setActiveTab(tab);
        setStatusFilter(tab === 'all' ? null : tab);
    };

    const filteredProducts = statusFilter
        ? products.filter(product => product.status === statusFilter)
        : products;

    return (
        <Box>
            <LoadingOverlay visible={isLoading} overlayProps={{ blur: 2 }} />

            <Paper p="md" radius="md" withBorder mb="md">
                <Filter
                    date={date}
                    searchTerm={searchTerm}
                    activeTab={activeTab}
                    products={products}
                    onDateChange={handleDateRangeChange}
                    onSearchChange={setSearchTerm}
                    onTabChange={handleTabChange}
                    onResetFilters={resetFilters}
                />

                <ProductList
                    products={mockProducts}
                    page={page}
                    onPageChange={setPage}
                    onViewProduct={openProductReview}
                    onApproveProduct={handleApprove}
                    onRejectProduct={(product) => {
                        setSelectedProduct(product);
                        openRejectModal();
                    }}
                />
            </Paper>

            <ProductReviewModal
                opened={reviewModalOpened}
                onClose={closeReviewModal}
                product={selectedProduct}
                onApprove={handleApprove}
                onReject={() => {
                    closeReviewModal();
                    openRejectModal();
                }}
            />

            <RejectModal
                opened={rejectModalOpened}
                onClose={closeRejectModal}
                onReject={handleReject}
                rejectionReason={rejectionReason}
                onReasonChange={setRejectionReason}
            />

            <SuccessModal
                opened={successModalOpened}
                onClose={closeSuccessModal}
            />
        </Box>
    );
};

export default ProductApprovalPage;