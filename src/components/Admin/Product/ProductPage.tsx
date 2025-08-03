import { Box, Group, LoadingOverlay, Pagination, Paper } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { useCallback, useEffect, useState } from 'react';
import { useProduct } from '../../../hooks/useProduct';
import { useProductApproval } from '../../../hooks/useProduct'
import type { MyShopProductDto, ProductStatus } from '../../../types/ProductType';
import { getDefaultDateRange_Now_Yesterday } from '../../../untils/Untils';
import Filter from './Filter';
import ProductList from './ProductList';
import RejectModal from './RejectModal'; 



const ProductApprovalPage = () => {
    const [selectedProduct, setSelectedProduct] = useState<MyShopProductDto | null>(null);
    const [rejectionReason, setRejectionReason] = useState('');
    const [activeTab, setActiveTab] = useState('ALL');
    const [searchTerm, setSearchTerm] = useState('');
    const [page, setPage] = useState(1);
    const { approvalProduct, rejectProduct } = useProductApproval();

    const [date, setDate] = useState<[Date | null, Date | null]>(getDefaultDateRange_Now_Yesterday());

    const {
        products,
        totalPages,
        currentPage,
        isLoading,
        fetchProducts,
        fetchStatusMetadata,
        statusMetadata
    } = useProduct({
        mode: 'admin',
        autoFetch: false,
        initialParams: {
            page: 0,
            status: 'ALL' as ProductStatus,
            limit: 40,
            dateRange: getDefaultDateRange_Now_Yesterday()
        }
    });

    const fetchProductData = useCallback(() => {
        fetchStatusMetadata(date)
        return fetchProducts({
            page: page - 1,
            status: (activeTab === 'ALL' ? undefined : activeTab) as ProductStatus,
            search: searchTerm,
            limit: 10,
            dateRange: date
        });
    }, [fetchProducts, activeTab, searchTerm, date]);


    useEffect(() => {
        fetchProductData();
    }, [page]);

    useEffect(() => {
        setPage(1);
        fetchProductData();
    }, [activeTab])

    const handleApplyFilters = () => {
        fetchProductData();
    };

    const resetFilters = () => {
        const defaultRange = getDefaultDateRange_Now_Yesterday();
        setDate(defaultRange);
        setActiveTab('ALL');
        setSearchTerm('');
        setPage(1);
        fetchProductData();
    };

    const handleTabChange = (tab: string | null) => {
        if (tab === null) return;
        setActiveTab(tab);
    }; 

    // Modals
    const [reviewModalOpened, { open: openReviewModal, close: closeReviewModal }] = useDisclosure(false);
    const [rejectModalOpened, { open: openRejectModal, close: closeRejectModal }] = useDisclosure(false); 

    // Handle approve product
    const handleApprove = async (product: MyShopProductDto | null) => {
        if (!product) return; 
        await approvalProduct(product.id)
            .then(() => {
                fetchProductData();
            })
    };

    // Handle reject product
    const handleReject = async () => {
        if (!selectedProduct) return;

        await rejectProduct(selectedProduct.id, rejectionReason)
            .then(() => { 
                fetchProductData();
            })
            .finally(() => { 
                closeRejectModal();
                setSelectedProduct(null);
                setRejectionReason('');
            })
    };

    const openProductReview = (product: MyShopProductDto) => {
        
        openReviewModal();
    };

    const handleViewRejectionReason = (product: MyShopProductDto) => {
        if (product.restrictedReason) {
            setSelectedProduct(product);
            setRejectionReason(product.restrictedReason)
            openRejectModal();
        }
    };

    return (
        <Box>
            <Paper p="md" radius="md" withBorder mb="md">
                <Filter
                    date={date}
                    searchTerm={searchTerm}
                    activeTab={activeTab}
                    productStatusData={statusMetadata}
                    onDateChange={setDate}
                    onSearchChange={setSearchTerm}
                    onTabChange={handleTabChange}
                    onResetFilters={resetFilters}
                    onApplyFilters={handleApplyFilters}
                />

                <ProductList
                    products={products}
                    onViewProduct={openProductReview}
                    onApproveProduct={handleApprove}
                    onRejectProduct={(product) => {
                        setSelectedProduct(product);
                        openRejectModal();
                    }}
                    onViewRejectionReason={handleViewRejectionReason}
                />

                <Group justify="flex-end" mt="md">
                    <Pagination
                        total={totalPages}
                        value={currentPage}
                        onChange={setPage}
                        size="sm"
                    />
                </Group>
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
                existsProductReason={selectedProduct?.restrictedReason ? true : false}
                onApprove={() => handleApprove(selectedProduct )}
            />

        </Box>
    );
};

export default ProductApprovalPage;