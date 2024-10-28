import { useState, useEffect, FC } from 'react';
import { Input, Select, Card, Button, Spin } from 'antd';
import LoadingSpinner from '../loading';
import ErrorMessage from '../error-message';
import './style.scss';
import { useGetProductsQuery } from '../../store/products';
import FilterPanel from '../filter-panel';
import { useDebounce } from '../../hooks/redux';

const { Option } = Select;

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
  const [loading, setLoading] = useState<boolean>(false); // Loading state for filter application

  // Fetch all products from the API
  const {
    data: allProducts = [],
    error,
    isLoading,
  } = useGetProductsQuery({
    searchQuery: debouncedSearchQuery,
  });

  const [filteredProducts, setFilteredProducts] =
    useState<Product[]>(allProducts);

  // Apply filters and search criteria to the full product list
  useEffect(() => {
    setLoading(true); // Start loading spinner before applying filters

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
      setLoading(false); // Stop loading spinner after 1 second
    }, 1000); // Delay spinner for 1 second

    return () => clearTimeout(timeoutId); // Cleanup timeout on unmount
  }, [filters, debouncedSearchQuery, allProducts]);

  // Handle applying filters
  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
    setIsFilterVisible(false); // Hide the filter panel on mobile after applying filters
  };

  // Ensure the loading and error states are handled first
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
      {/* Button to toggle filter panel visibility on mobile */}
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
          <div className='controls'>
            <Input
              placeholder='Search products'
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className='search-input'
            />
            <Select
              value={filters.category}
              onChange={(value) => setFilters({ ...filters, category: value })}
              className='category-select'
            >
              {/* Generate dropdown options from allProducts to ensure all categories are available */}
              <Option value='All'>All</Option>
              {Array.from(
                new Set(allProducts.map((product) => product.category)),
              ).map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </div>

          {/* Wrap the product grid with the Spin component to show a loading spinner during filter application */}
          <Spin spinning={loading} tip='Applying filters...'>
            {filteredProducts.length === 0 ? (
              <div className='no-products-message'>
                No products found matching your criteria.
              </div>
            ) : (
              <div className='product-grid'>
                {filteredProducts.map((product) => (
                  <Card
                    key={product.id}
                    className='product-card'
                    title={product.name}
                  >
                    <p>Category: {product.category}</p>
                    <p>Brand: {product.brand}</p>
                    <p>Price: ${product.price.toFixed(2)}</p>
                    <p>Rating: {product.rating} stars</p>
                  </Card>
                ))}
              </div>
            )}
          </Spin>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
