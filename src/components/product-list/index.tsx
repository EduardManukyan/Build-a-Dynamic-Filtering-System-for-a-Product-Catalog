import { useState, useEffect, FC } from 'react';
import { Button, Spin, Pagination } from 'antd';
import LoadingSpinner from '../loading';
import ErrorMessage from '../error-message';
import { useGetProductsQuery } from '../../store/products';
import FilterPanel from '../filter-panel';
import { useDebounce } from '../../hooks/redux';
import FilterControls from '../filter-panel/filter-control';
import ProductGrid from '../filter-panel/product-grid';
import { ITEM_PER_PAGE } from '../../constants';
import './style.scss';

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  imageUrl: string;
}

interface Filters {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
}

const ProductList: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
  });
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: allProducts = [],
    error,
    isLoading,
  } = useGetProductsQuery({
    searchQuery: debouncedSearchQuery,
  });

  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);

  useEffect(() => {
    setLoading(true);
    const timeoutId = setTimeout(() => {
      const filtered = allProducts.filter((product) => {
        const matchesCategory =
          filters.category === 'All' || product.category === filters.category;
        const withinPriceRange =
          product.price >= filters.priceRange[0] &&
          product.price <= filters.priceRange[1];
        const matchesBrands =
          filters.brands.length === 0 || filters.brands.includes(product.brand);
        const matchesRating = product.rating >= filters.rating;
        const matchesSearch = product.name
          .toLowerCase()
          .includes(debouncedSearchQuery.toLowerCase());

        return (
          matchesCategory &&
          withinPriceRange &&
          matchesBrands &&
          matchesRating &&
          matchesSearch
        );
      });

      setFilteredProducts(filtered);
      setLoading(false);
      setCurrentPage(1); // Reset to the first page after filtering
    }, 1000);

    return () => clearTimeout(timeoutId);
  }, [filters, debouncedSearchQuery, allProducts]);

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsFilterVisible(false);
    setCurrentPage(1); // Reset to the first page when filters are applied
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
  const paginatedProducts = filteredProducts.slice(
    startIndex,
    startIndex + ITEM_PER_PAGE,
  );

  if (isLoading) return <LoadingSpinner />;
  if (error) {
    return (
      <ErrorMessage
        message='Error'
        description='An error occurred while loading products.'
      />
    );
  }

  return (
    <div className='product-list-container'>
      <Button
        className='toggle-filter-btn'
        onClick={() => setIsFilterVisible(!isFilterVisible)}
      >
        {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <div className='filter-and-product-wrapper'>
        <div className={`sidebar ${isFilterVisible ? 'visible' : ''}`}>
          <FilterPanel
            categories={Array.from(
              new Set(allProducts.map((product) => product.category)),
            )}
            brands={Array.from(
              new Set(allProducts.map((product) => product.brand)),
            )}
            onApplyFilters={handleApplyFilters}
          />
        </div>

        <div className='product-content'>
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
          />

          <Spin spinning={loading} tip='Applying filters...'>
            <ProductGrid products={paginatedProducts} />
          </Spin>

          {/* Pagination Controls */}
          <Pagination
            current={currentPage}
            pageSize={ITEM_PER_PAGE}
            total={filteredProducts.length}
            onChange={handlePageChange}
            style={{ marginTop: '20px', textAlign: 'center' }}
          />
        </div>
      </div>
    </div>
  );
};

export default ProductList;
