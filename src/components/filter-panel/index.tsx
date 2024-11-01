import React, {
  FC,
  memo,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { Select, Slider, Rate, Button } from 'antd';
import CheckboxWithLabel from '../check-box-label';
import './style.scss';
import { IFilters } from '../types/types';
const { Option } = Select;

interface FilterPanelProps {
  onApplyFilters: (filters: IFilters) => void;
  onSortChange: (sortType: string) => void;
  brands: string[];
  categories: string[];
  initialFilters: IFilters;
}
const FilterPanel: FC<FilterPanelProps> = ({
  onApplyFilters,
  onSortChange,
  brands,
  categories,
  initialFilters,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 1000]);
  const [rating, setRating] = useState<number>(0);
  const [sortType, setSortType] = useState<string>('none');

  // Sync local state with initialFilters on component mount or when initialFilters changes
  useEffect(() => {
    setSelectedCategory(initialFilters.category);
    setSelectedBrands(initialFilters.brands);
    setPriceRange(initialFilters.priceRange);
    setRating(initialFilters.rating);
  }, [initialFilters]);

  const handleCategoryChange = useCallback((value: string) => {
    setSelectedCategory(value);
  }, []);

  const handleBrandChange = useCallback((brand: string, checked: boolean) => {
    setSelectedBrands((prev) =>
      checked ? [...prev, brand] : prev.filter((b) => b !== brand),
    );
  }, []);

  const handlePriceChange = useCallback((value: [number, number]) => {
    setPriceRange(value);
  }, []);

  const handleRatingChange = useCallback((value: number) => {
    setRating(value);
  }, []);

  const handleApplyFilters = useCallback(() => {
    onApplyFilters({
      category: selectedCategory,
      brands: selectedBrands,
      priceRange,
      rating,
    });
  }, [onApplyFilters, selectedCategory, selectedBrands, priceRange, rating]);

  const handleClearFilters = useCallback(() => {
    setSelectedCategory('All');
    setSelectedBrands([]);
    setPriceRange([0, 1000]);
    setRating(0);
    localStorage.removeItem('productFilters');
    onApplyFilters({
      category: 'All',
      brands: [],
      priceRange: [0, 1000],
      rating: 0,
    });
  }, [onApplyFilters]);

  const handleSortChange = useCallback(
    (value: string) => {
      setSortType(value);
      localStorage.setItem('sortType', value);
      onSortChange(value);
    },
    [onSortChange],
  );

  // Memoize options to avoid recalculating these each render
  const categoryOptions = useMemo(
    () =>
      categories.map((category) => (
        <Option key={category} value={category}>
          {category}
        </Option>
      )),
    [categories],
  );

  const brandCheckboxes = useMemo(
    () =>
      brands.map((brand) => (
        <CheckboxWithLabel
          key={brand}
          label={brand}
          checked={selectedBrands.includes(brand)}
          onChange={(e) => handleBrandChange(brand, e.target.checked)}
        />
      )),
    [brands, selectedBrands, handleBrandChange],
  );

  return (
    <div className='filter-panel'>
      <h3>Filter Options</h3>

      {/* Filter by Category */}
      <div className='filter-group'>
        <label>Category</label>
        <Select
          data-testid='category-select'
          value={selectedCategory}
          onChange={handleCategoryChange}
          style={{ width: '100%' }}
        >
          <Option value='All'>All</Option>
          {categoryOptions}
        </Select>
      </div>

      {/* Filter by Brand */}
      <div className='filter-group'>
        <label className='title-checkbox'>Brand</label>
        <div className='checkbox-group'>{brandCheckboxes}</div>
      </div>

      {/* Filter by Price Range */}
      <div className='filter-group'>
        <label>Price Range</label>
        <Slider
          range
          min={0}
          max={1000}
          value={priceRange}
          onChange={(value) => handlePriceChange(value as [number, number])}
        />
        <div>
          Price: ${priceRange[0]} - ${priceRange[1]}
        </div>
      </div>

      {/* Filter by Rating */}
      <div className='filter-group'>
        <label>Rating</label>
        <Rate value={rating} onChange={handleRatingChange} />
      </div>

      {/* Sort by Option */}
      <div className='filter-group'>
        <label>Sort By</label>
        <Select
          data-testid='sort-select'
          value={sortType}
          onChange={handleSortChange}
          style={{ width: '100%' }}
        >
          <Option value='none'>None</Option>
          <Option value='PriceLowToHigh'>Price: Low to High</Option>
          <Option value='PriceHighToLow'>Price: High to Low</Option>
          <Option value='RatingHighToLow'>Rating: High to Low</Option>
          <Option value='RatingLowToHigh'>Rating: Low to High</Option>
        </Select>
      </div>

      {/* Apply and Clear Filters Buttons */}
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

export default memo(FilterPanel);
