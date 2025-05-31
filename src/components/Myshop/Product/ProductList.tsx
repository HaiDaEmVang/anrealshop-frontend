import { useState, useEffect } from 'react';
import FilterProduct from './FilterProduct';
import ListProduct from './ProductListView';
import ProductListGridView from './ProductListGridView';

const sampleProducts = [
  {
    id: '1',
    name: 'Áo thun nam basic',
    image: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100',
    category: 'Thời trang nam',
    price: 199000,
    stock: 45,
    sold: 120,
    status: 'active',
    createdAt: '2023-11-10'
  },
  {
    id: '2',
    name: 'Giày thể thao nữ',
    image: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=100',
    category: 'Giày dép',
    price: 450000,
    stock: 28,
    sold: 67,
    status: 'active',
    createdAt: '2023-12-05'
  },
  {
    id: '3',
    name: 'Túi xách nữ thời trang',
    image: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=100',
    category: 'Phụ kiện',
    price: 350000,
    stock: 15,
    sold: 42,
    status: 'pending',
    createdAt: '2024-01-18'
  },
  {
    id: '4',
    name: 'Áo khoác dù nam',
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100',
    category: 'Thời trang nam',
    price: 550000,
    stock: 0,
    sold: 89,
    status: 'hidden',
    createdAt: '2023-10-22'
  },
  {
    id: '5',
    name: 'Đồng hồ thông minh',
    image: 'https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?q=80&w=100',
    category: 'Điện tử',
    price: 1200000,
    stock: 7,
    sold: 31,
    status: 'violation',
    createdAt: '2024-02-01'
  },
  {
    id: '6',
    name: 'Tai nghe Bluetooth',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=100',
    category: 'Điện tử',
    price: 799000,
    stock: 22,
    sold: 67,
    status: 'active',
    createdAt: '2023-11-25'
  },
  {
    id: '7',
    name: 'Váy liền thân công sở',
    image: 'https://images.unsplash.com/photo-1496747611176-843222e1e57c?q=80&w=100',
    category: 'Thời trang nữ',
    price: 560000,
    stock: 18,
    sold: 45,
    status: 'active',
    createdAt: '2023-12-14'
  },
  {
    id: '8',
    name: 'Ví da nam cao cấp',
    image: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=100',
    category: 'Phụ kiện',
    price: 450000,
    stock: 32,
    sold: 28,
    status: 'active',
    createdAt: '2024-01-05'
  }
];

interface ProductListProps {
  viewMode: 'grid' | 'list';
}

const ProductList = ({ viewMode }: ProductListProps) => { 
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<string | null>(null);
  const [products, setProducts] = useState(sampleProducts);
  const [filteredProducts, setFilteredProducts] = useState(sampleProducts);
  const [selectedProducts, setSelectedProducts] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activePage, setActivePage] = useState(1);
  const [sortBy, setSortBy] = useState<string | null>(null);

  // Filter products when search query or category changes
  useEffect(() => {
    setIsLoading(true);
     
    // Simulate API delay
    const timer = setTimeout(() => {
      const filtered = products.filter(product => {
        const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = !category || product.category === category;
        return matchesSearch && matchesCategory;
      });
      
      // Apply sorting if necessary
      let sortedProducts = [...filtered];
      if (sortBy) {
        switch (sortBy) {
          case 'name-asc':
            sortedProducts.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            sortedProducts.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'price-asc':
            sortedProducts.sort((a, b) => a.price - b.price);
            break;
          case 'price-desc':
            sortedProducts.sort((a, b) => b.price - a.price);
            break;
          case 'newest':
            sortedProducts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            break;
          case 'bestseller':
            sortedProducts.sort((a, b) => b.sold - a.sold);
            break;
        }
      }
      
      setFilteredProducts(sortedProducts);
      setIsLoading(false);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [searchQuery, category, products, sortBy]);

  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProducts(filteredProducts.map(p => p.id));
    } else {
      setSelectedProducts([]);
    }
  };

  const handleSelectProduct = (id: string, checked: boolean) => {
    if (checked) {
      setSelectedProducts([...selectedProducts, id]);
    } else {
      setSelectedProducts(selectedProducts.filter(productId => productId !== id));
    }
  };

  const handleToggleStatus = (id: string) => {
    // Mark product as updating
    setProducts(prev => 
      prev.map(product => 
        product.id === id ? 
          { ...product, isUpdating: true } : 
          product
      )
    );
    
    // Simulate API call
    setTimeout(() => {
      setProducts(prev => 
        prev.map(product => 
          product.id === id ? 
            { 
              ...product, 
              status: product.status === 'active' ? 'hidden' : 'active',
              isUpdating: false
            } : 
            product
        )
      );
    }, 500);
  };

  const handleProductAction = (action: 'edit' | 'duplicate' | 'delete', productId: string) => {
    switch (action) {
      case 'edit':
        console.log(`Edit product ${productId}`);
        // Navigate to edit page or open modal
        break;
      case 'duplicate':
        // Mark product as updating
        setProducts(prev => 
          prev.map(product => 
            product.id === productId ? 
              { ...product, isUpdating: true } : 
              product
          )
        );
        
        // Simulate API call
        setTimeout(() => {
          const productToDuplicate = products.find(p => p.id === productId);
          if (productToDuplicate) {
            const duplicatedProduct = {
              ...productToDuplicate,
              id: `${productId}-copy-${Date.now().toString().slice(-4)}`,
              name: `${productToDuplicate.name} (Bản sao)`,
              isUpdating: false
            };
            
            setProducts(prev => [
              ...prev.map(p => p.id === productId ? {...p, isUpdating: false} : p),
              duplicatedProduct
            ]);
          }
        }, 800);
        break;
      case 'delete':
        // Mark product as updating
        setProducts(prev => 
          prev.map(product => 
            product.id === productId ? 
              { ...product, isUpdating: true } : 
              product
          )
        );
        
        // Simulate API call
        setTimeout(() => {
          setProducts(prev => prev.filter(product => product.id !== productId));
        }, 600);
        break;
    }
  };

  const handleBulkAction = (action: 'show' | 'hide' | 'duplicate' | 'delete') => {
    // Mark selected products as updating
    setProducts(prev => 
      prev.map(product => 
        selectedProducts.includes(product.id) ? 
          { ...product, isUpdating: true } : 
          product
      )
    );
    
    // Simulate API call
    setTimeout(() => {
      switch (action) {
        case 'show':
          setProducts(prev => 
            prev.map(product => 
              selectedProducts.includes(product.id) ? 
                { ...product, status: 'active', isUpdating: false } : 
                product
            )
          );
          break;
        case 'hide':
          setProducts(prev => 
            prev.map(product => 
              selectedProducts.includes(product.id) ? 
                { ...product, status: 'hidden', isUpdating: false } : 
                product
            )
          );
          break;
        case 'duplicate':
          // Create duplicates of selected products
          const duplicatedProducts = selectedProducts.map(id => {
            const original = products.find(p => p.id === id);
            if (!original) return null;
            return {
              ...original,
              id: `${id}-copy-${Date.now().toString().slice(-4)}`,
              name: `${original.name} (Bản sao)`,
              isUpdating: false
            };
          }).filter(Boolean);

          // Clear updating state and add new products
          setProducts(prev => [
            ...prev.map(p => selectedProducts.includes(p.id) ? {...p, isUpdating: false} : p),
            ...duplicatedProducts as any[]
          ]);
          break;
        case 'delete':
          setProducts(prev => prev.filter(product => !selectedProducts.includes(product.id)));
          setSelectedProducts([]);
          break;
      }
    }, 800);
  };

  return (
    <div>
      <FilterProduct 
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        category={category}
        onCategoryChange={setCategory}
        sortBy={sortBy}
        onSortChange={setSortBy}
        selectedProducts={selectedProducts}
        onBulkAction={handleBulkAction}
      />
      
      {/* Sử dụng prop viewMode để quyết định hiển thị loại nào */}
      {viewMode === 'list' ? (
        <ListProduct 
          products={filteredProducts}
          isLoading={isLoading}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
          activePage={activePage}
          onPageChange={setActivePage}
          onToggleStatus={handleToggleStatus}
          onProductAction={handleProductAction}
          totalPages={3}
        />
      ) : (
        <ProductListGridView
          products={filteredProducts}
          isLoading={isLoading}
          selectedProducts={selectedProducts}
          onSelectAll={handleSelectAll}
          onSelectProduct={handleSelectProduct}
          activePage={activePage}
          onPageChange={setActivePage}
          onToggleStatus={handleToggleStatus}
          onProductAction={handleProductAction}
          totalPages={3}
        />
      )}
    </div>
  );
};

export default ProductList;