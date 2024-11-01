import { Input, Select } from 'antd';
import { FC } from 'react';
import { IFilters } from '../../types/types';
const { Option } = Select;

interface IFilterControlsProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filters: IFilters;
  setFilters: (filters: IFilters) => void;
}

const FilterControls: FC<IFilterControlsProps> = ({
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
      <Option value='Electronics'>Electronics</Option>
      <Option value='Clothing'>Clothing</Option>
      <Option value='Footwear'>Footwear</Option>
      <Option value='Accessories'>Accessories</Option>
    </Select>
  </div>
);

export default FilterControls;
