import { useState, FC, useMemo, useCallback, memo, useEffect } from 'react';
import { Button, Spin, Pagination } from 'antd';
import LoadingSpinner from '../loading';
import ErrorMessage from '../error-message';
import { useGetProductsQuery } from '../../store/products';
import FilterPanel from '../filter-panel';
import { useDebounce, useFilteredProducts } from '../../hooks/redux';
import FilterControls from '../filter-panel/filter-control';
import ProductGrid from '../filter-panel/product-grid';
import { ITEM_PER_PAGE } from '../../constants';
import './style.scss';
import { IFilters } from '../types/types';

const ProductList: FC = () => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const debouncedSearchQuery = useDebounce(searchQuery, 300);
  const [filters, setFilters] = useState<IFilters>(() => {
    const savedFilters = localStorage.getItem('productFilters');
    return savedFilters
      ? JSON.parse(savedFilters)
      : { category: 'All', brands: [], priceRange: [0, 1000], rating: 0 };
  });
  const [sortType, setSortType] = useState<string>(() => {
    return localStorage.getItem('sortType') || 'none';
  });
  const [isFilterVisible, setIsFilterVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const {
    data: allProducts = [],
    error,
    isLoading,
  } = useGetProductsQuery({
    searchQuery: debouncedSearchQuery,
  });

  const filteredProducts = useFilteredProducts(
    allProducts,
    filters,
    debouncedSearchQuery,
    sortType,
  );

  const paginatedProducts = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEM_PER_PAGE;
    return filteredProducts.slice(startIndex, startIndex + ITEM_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const handleApplyFilters = useCallback((newFilters: IFilters) => {
    setFilters(newFilters);
    setIsFilterVisible(false);
    setCurrentPage(1);
  }, []);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  // Save filters and sortType to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('productFilters', JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    localStorage.setItem('sortType', sortType);
  }, [sortType]);

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
        onClick={() => setIsFilterVisible((visible) => !visible)}
      >
        {isFilterVisible ? 'Hide Filters' : 'Show Filters'}
      </Button>

      <div className='filter-and-product-wrapper'>
        <div className={`sidebar ${isFilterVisible ? 'visible' : ''}`}>
          <FilterPanel
            categories={Array.from(new Set(allProducts.map((p) => p.category)))}
            brands={Array.from(new Set(allProducts.map((p) => p.brand)))}
            onApplyFilters={handleApplyFilters}
            onSortChange={setSortType}
            initialFilters={filters} // Pass the filters to FilterPanel
          />
        </div>

        <div className='product-content'>
          <FilterControls
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            filters={filters}
            setFilters={setFilters}
          />

          <Spin spinning={isLoading} tip='Applying filters...'>
            <ProductGrid products={paginatedProducts} />
          </Spin>

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

export default memo(ProductList);
