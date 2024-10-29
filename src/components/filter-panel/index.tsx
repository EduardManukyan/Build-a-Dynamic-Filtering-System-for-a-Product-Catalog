import React, { useState } from 'react';
import { Select, Slider, Rate, Button } from 'antd';
import CheckboxWithLabel from '../check-box-label';
import './style.scss';

const { Option } = Select;

interface Filters {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
}

interface FilterPanelProps {
  onApplyFilters: (filters: Filters) => void;
  brands: string[];
  categories: string[];
}

const FilterPanel: React.FC<FilterPanelProps> = ({
  onApplyFilters,
  brands,
  categories,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);

  const handlePriceChange = (value: number[]) => {
    if (value.length === 2) {
      setPriceRange([value[0], value[1]]);
    }
  };

  const handleApplyFilters = () => {
    onApplyFilters({
      category: selectedCategory,
      brands: selectedBrands,
      priceRange,
      rating,
    });
  };

  const handleClearFilters = () => {
    // Reset all filters to default values
    setSelectedCategory('All');
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setRating(0);
    onApplyFilters({
      category: 'All',
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
    });
  };

  return (
    <div className='filter-panel'>
      <h3>Filter Options</h3>

      <div className='filter-group'>
        <label>Category</label>
        <Select
          value={selectedCategory}
          onChange={setSelectedCategory}
          style={{ width: '100%' }}
        >
          <Option value='All'>All</Option>
          {categories.map((category) => (
            <Option key={category} value={category}>
              {category}
            </Option>
          ))}
        </Select>
      </div>

      <div className='filter-group'>
        <label className='title-checkbox'>Brand</label>
        <div className='checkbox-group'>
          {brands.map((brand) => (
            <CheckboxWithLabel
              key={brand}
              label={brand}
              checked={selectedBrands.includes(brand)}
              onChange={(e) => {
                setSelectedBrands((prev) =>
                  e.target.checked
                    ? [...prev, brand]
                    : prev.filter((b) => b !== brand),
                );
              }}
            />
          ))}
        </div>
      </div>

      <div className='filter-group'>
        <label>Price Range</label>
        <Slider
          range
          min={0}
          max={1000}
          value={priceRange}
          onChange={handlePriceChange}
        />
        <div>
          Price: ${priceRange[0]} - ${priceRange[1]}
        </div>
      </div>

      <div className='filter-group'>
        <label>Rating</label>
        <Rate value={rating} onChange={setRating} />
      </div>

      <div className='filter-buttons'>
        <Button
          type='primary'
          onClick={handleApplyFilters}
          style={{ marginTop: '10px', marginRight: '10px' }}
        >
          Apply Filters
        </Button>
        <Button onClick={handleClearFilters} style={{ marginTop: '10px' }}>
          Clear All Filters
        </Button>
      </div>
    </div>
  );
};

export default FilterPanel;
