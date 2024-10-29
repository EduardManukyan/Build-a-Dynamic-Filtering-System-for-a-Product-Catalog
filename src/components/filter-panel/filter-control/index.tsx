import { Input, Select } from 'antd';
import { FC } from 'react';

const { Option } = Select;

interface Filters {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
}

interface FilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: Filters;
  setFilters: (filters: Filters) => void;
}

const FilterControls: FC<FilterControlsProps> = ({
  searchQuery,
  setSearchQuery,
  filters,
  setFilters,
}) => (
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
      {/* Categories would ideally be fetched from API */}
      <Option value='Electronics'>Electronics</Option>
      <Option value='Clothing'>Clothing</Option>
      <Option value='Footwear'>Footwear</Option>
      <Option value='Accessories'>Accessories</Option>
    </Select>
  </div>
);

export default FilterControls;
