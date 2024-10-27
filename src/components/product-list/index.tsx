import { useState, useEffect, FC } from 'react';

import { Input, Select, Card } from 'antd';
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
  const debouncedSearchQuery = useDebounce(searchQuery, 300); // Debounce search input with a 300ms delay
  const [filters, setFilters] = useState<Filters>({
    category: 'All',
    brands: [],
    priceRange: [0, 1000],
    rating: 0,
  });

  const {
    data: products = [],
    error,
    isLoading,
  } = useGetProductsQuery({
    searchQuery: debouncedSearchQuery,
    category: filters.category,
  });

  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);

  // Extract unique categories and brands
  const categories = Array.from(
    new Set(products.map((product) => product.category)),
  );
  const brands = Array.from(new Set(products.map((product) => product.brand)));

  const handleApplyFilters = (newFilters: Filters) => {
    setFilters(newFilters);
  };

  useEffect(() => {
    const filtered = products.filter((product) => {
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
  }, [filters, debouncedSearchQuery, products]);

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
      <div className='filter-and-product-wrapper'>
        <div className='sidebar'>
          <FilterPanel
            categories={categories}
            brands={brands}
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
              <Option value='All'>All</Option>
              {categories.map((cat) => (
                <Option key={cat} value={cat}>
                  {cat}
                </Option>
              ))}
            </Select>
          </div>

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
        </div>
      </div>
    </div>
  );
};

export default ProductList;
