export interface IFilters {
  category: string;
  brands: string[];
  priceRange: [number, number];
  rating: number;
}

export interface IProduct {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  popularity: number;
}
