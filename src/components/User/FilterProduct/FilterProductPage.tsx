import {
  Box,
  Button,
  Container,
  Grid,
  LoadingOverlay,
  Pagination,
  Paper,
  Text
} from '@mantine/core';
import React, { useCallback, useEffect, useState } from 'react';
import {
  FiRefreshCw
} from 'react-icons/fi';
import { useLocation, useNavigate } from 'react-router-dom';
import { mockFeaturedProducts, type Product } from '../../../data/FilterData';

import ProductCard from '../Common/ProductCard';
import Breadcrumbs from './Breadcrumbs';
import Filter from './Filter';
import ModalFilter from './ModalFilter';

interface ApiFilterParams {
  priceRange: [number, number];
  brands: string[];
  colors: string[];
  sizes: string[];
  origins: string[];
  rating: number | null; // Added rating
  sort: string;
  page: number;
  limit: number;
}

interface ApiResponse {
  data: Product[];
  total: number;
}

const fetchProductsFromAPI = async (params: ApiFilterParams): Promise<ApiResponse> => {
  console.log('Fetching products with params:', params);
  return new Promise(resolve => {
    setTimeout(() => {
      let filtered = [...mockFeaturedProducts];

      filtered = filtered.filter(product => {
        const finalPrice = product.discountPrice || product.price;
        return finalPrice >= params.priceRange[0] && finalPrice <= params.priceRange[1];
      });
      if (params.brands.length > 0) {
        filtered = filtered.filter(product => params.brands.includes(product.brand?.toLowerCase() || ''));
      }
      if (params.colors.length > 0 && params.colors[0] !== '') {
        filtered = filtered.filter(product => {
          if (!product.colors) return false;
          return params.colors.some(color => product.colors?.includes(color));
        });
      }
      if (params.sizes.length > 0 && params.sizes[0] !== '') {
        filtered = filtered.filter(product => {
          if (!product.sizes) return false;
          return params.sizes.some(size => product.sizes?.includes(size));
        });
      }
      if (params.origins.length > 0) {
        filtered = filtered.filter(product => params.origins.includes(product.origin?.toLowerCase() || ''));
      }
      if (params.rating !== null && params.rating > 0) {
        const minRating = params.rating;
        filtered = filtered.filter(product => product.rating >= minRating);
      }

      switch (params.sort) {
        case 'price-asc':
          filtered.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-desc':
          filtered.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'name-asc':
          filtered.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          filtered.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating': // This sort option might conflict if not handled carefully
          filtered.sort((a, b) => b.rating - a.rating);
          break;
        default: // newest
          if (typeof filtered[0]?.id === 'string') {
            filtered.sort((a, b) => (b.id as string).localeCompare(a.id as string));
          } else {
            filtered.sort((a, b) => Number(b.id) - Number(a.id));
          }
      }
      
      const total = filtered.length;
      const startIndex = (params.page - 1) * params.limit;
      const endIndex = startIndex + params.limit;
      const paginatedData = filtered.slice(startIndex, endIndex);
      
      resolve({ data: paginatedData, total });
    }, 700);
  });
};

const FilterProductPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const productsPerPage = 12;

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 5000000]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedOrigins, setSelectedOrigins] = useState<string[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null); // Added rating state
  const [sortBy, setSortBy] = useState<string>('newest');
  
  
  const [allFiltersOpened, setAllFiltersOpened] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const updateUrlParams = useCallback(() => {
    const searchParams = new URLSearchParams();
    if (priceRange[0] > 0) searchParams.set('minPrice', priceRange[0].toString());
    if (priceRange[1] < 5000000) searchParams.set('maxPrice', priceRange[1].toString());
    if (selectedBrands.length > 0) searchParams.set('brands', selectedBrands.join(','));
    if (selectedColors.length > 0) searchParams.set('colors', selectedColors.join(','));
    if (selectedSizes.length > 0) searchParams.set('sizes', selectedSizes.join(','));
    if (selectedOrigins.length > 0) searchParams.set('origins', selectedOrigins.join(','));
    if (selectedRating !== null) searchParams.set('rating', selectedRating.toString()); // Added rating
    if (sortBy !== 'newest') searchParams.set('sort', sortBy);
    if (currentPage > 1) searchParams.set('page', currentPage.toString());
    navigate({ search: searchParams.toString() }, { replace: true });
  }, [ priceRange, selectedBrands, selectedColors, selectedSizes, selectedOrigins, selectedRating, sortBy, currentPage, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const apiParams: ApiFilterParams = {
        priceRange,
        brands: selectedBrands,
        colors: selectedColors,
        sizes: selectedSizes,
        origins: selectedOrigins,
        rating: selectedRating, // Added rating
        sort: sortBy,
        page: currentPage,
        limit: productsPerPage,
      };
      const response = await fetchProductsFromAPI(apiParams);
      setProducts(response.data);
      setTotalPages(Math.ceil(response.total / productsPerPage));
    } catch (error) {
      console.error("Failed to fetch products:", error);
      setProducts([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [ priceRange, selectedBrands, selectedColors, selectedSizes, selectedOrigins, selectedRating, sortBy, currentPage, productsPerPage]);


  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setPriceRange([
      Number(searchParams.get('minPrice') || 0),
      Number(searchParams.get('maxPrice') || 5000000)
    ]);
    setSelectedBrands(searchParams.get('brands')?.split(',') || []);
    setSelectedColors(searchParams.get('colors')?.split(',') || []);
    setSelectedSizes(searchParams.get('sizes')?.split(',') || []);
    setSelectedOrigins(searchParams.get('origins')?.split(',') || []);
    const ratingParam = searchParams.get('rating');
    setSelectedRating(ratingParam ? parseInt(ratingParam, 10) : null); // Added rating
    setSortBy(searchParams.get('sort') || 'newest');
    setCurrentPage(Number(searchParams.get('page') || 1));
    setInitialLoadComplete(true);
  }, [location.search]);
  
  useEffect(() => {
    if (initialLoadComplete) {
      fetchData();
      updateUrlParams();
    }
  }, [initialLoadComplete, fetchData, updateUrlParams]);


  const handleChangeFilters = (type: string, value?: string) => {
    let resetPage = true;

    switch (type) {
      case 'openAllFilters':
        setAllFiltersOpened(true);
        return; // No page reset needed
      
      case 'resetAll':
        setPriceRange([0, 5000000]);
        setSelectedBrands([]);
        setSelectedColors([]);
        setSelectedSizes([]);
        setSelectedOrigins([]);
        setSelectedRating(null); // Added rating reset
        setSortBy('newest');
        break;
        
      case 'addBrand':
        if (value && !selectedBrands.includes(value)) setSelectedBrands(prev => [...prev, value]);
        break;
      case 'removeBrand':
        if (value) setSelectedBrands(prev => prev.filter(b => b !== value));
        break;
      case 'addOrigin':
        if (value && !selectedOrigins.includes(value)) setSelectedOrigins(prev => [...prev, value]);
        break;
      case 'removeOrigin':
        if (value) setSelectedOrigins(prev => prev.filter(o => o !== value));
        break;
      case 'addSize':
        if (value && !selectedSizes.includes(value)) setSelectedSizes(prev => [...prev, value]);
        break;
      case 'removeSize':
        if (value) setSelectedSizes(prev => prev.filter(s => s !== value));
        break;
      // Cases for addColor/removeColor are here if needed by generic handlers,
      // but ModalFilter uses direct state setters.
      case 'addColor': 
        if (value && !selectedColors.includes(value)) setSelectedColors(prev => [...prev, value]);
        break;
      case 'removeColor':
        if (value) setSelectedColors(prev => prev.filter(c => c !== value));
        break;
      case 'sort':
        if (value) setSortBy(value);
        break;
      default:
        resetPage = false; // If type is not recognized, don't reset page
        return;
    }
    if (resetPage && currentPage !== 1) {
      setCurrentPage(1);
    }
  };

  const openAllFilters = () => handleChangeFilters('openAllFilters');
  const resetAllFiltersAction = () => handleChangeFilters('resetAll');
  
  const removeFilter = (type: string, value: string) => handleChangeFilters(`remove${type.charAt(0).toUpperCase() + type.slice(1)}`, value);
  const addFilter = (type: string, value: string) => handleChangeFilters(`add${type.charAt(0).toUpperCase() + type.slice(1)}`, value);
  const handleSortChange = (value: string) => handleChangeFilters('sort', value);

  return (
    <Container size="xl" className="py-6">
      <Breadcrumbs  />

      <Filter
        selectedBrands={selectedBrands}
        selectedOrigins={selectedOrigins}
        selectedSizes={selectedSizes}
        sortBy={sortBy}
        onOpenAllFilters={openAllFilters}
        onResetFilters={resetAllFiltersAction}
        onRemoveFilter={removeFilter}
        onAddFilter={addFilter}
        onSortChange={handleSortChange}
      />

      
      <Box pos="relative">
        <LoadingOverlay visible={loading} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
        {!loading && products.length > 0 ? (
          <Box>
            <Grid gutter="md">
                {products.map((product) => (
                  <Grid.Col key={product.id} span={{ base: 6, sm: 4, md: 3, lg: 3 }}>
                    <ProductCard product={product} />
                  </Grid.Col>
                ))}
              </Grid>
            {totalPages > 1 && (
              <Box className="flex justify-center mt-8">
                <Pagination
                  total={totalPages}
                  value={currentPage}
                  onChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                />
              </Box>
            )}
          </Box>
        ) : (
          !loading && (
            <Paper p="xl" radius="md" className="text-center">
              <Text size="lg" fw={500} mb="md">Không tìm thấy sản phẩm nào phù hợp</Text>
              <Text color="dimmed" mb="lg">Vui lòng thử lại với bộ lọc khác.</Text>
              <Button
                variant="outline"
                onClick={resetAllFiltersAction}
                leftSection={<FiRefreshCw size={16} />}
              >
                Đặt lại bộ lọc
              </Button>
            </Paper>
          )
        )}
      </Box>

      <ModalFilter
        opened={allFiltersOpened}
        onClose={() => setAllFiltersOpened(false)}
        
        initialPriceRange={priceRange}
        initialSelectedBrands={selectedBrands}
        initialSelectedColors={selectedColors}
        initialSelectedSizes={selectedSizes}
        initialSelectedOrigins={selectedOrigins}
        initialSelectedRating={selectedRating} 
        
        setPriceRange={setPriceRange}
        setSelectedBrands={setSelectedBrands}
        setSelectedColors={setSelectedColors}
        setSelectedSizes={setSelectedSizes}
        setSelectedOrigins={setSelectedOrigins}
        setSelectedRating={setSelectedRating} 
        
        onApplyFilters={() => {
          if (currentPage !== 1) {
            setCurrentPage(1); 
          }
          setAllFiltersOpened(false);
        }}
      />
    </Container>
  );
};

export default FilterProductPage;