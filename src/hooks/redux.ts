import { useState, useEffect, useMemo } from 'react';
import { applySorting } from './helpers';
import { IFilters, IProduct } from '../components/types/types';

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => {
      clearTimeout(handler);
    };
  }, [value, delay]);

  return debouncedValue;
}

export const useFilteredProducts = (
  products: IProduct[],
  filters: IFilters,
  searchQuery: string,
  sortType: string,
) => {
  return useMemo(() => {
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
        .includes(searchQuery.toLowerCase());

      return (
        matchesCategory &&
        withinPriceRange &&
        matchesBrands &&
        matchesRating &&
        matchesSearch
      );
    });

    return applySorting(filtered, sortType);
  }, [products, filters, searchQuery, sortType]);
};
