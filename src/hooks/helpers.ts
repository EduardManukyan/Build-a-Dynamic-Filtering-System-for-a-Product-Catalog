interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  popularity: number;
}

export const applySorting = (products: Product[], sortType: string) => {
  switch (sortType) {
    case 'PriceLowToHigh':
      return [...products].sort((a, b) => a.price - b.price);
    case 'PriceHighToLow':
      return [...products].sort((a, b) => b.price - a.price);
    case 'RatingHighToLow':
      return [...products].sort((a, b) => b.rating - a.rating);
    case 'RatingLowToHigh':
      return [...products].sort((a, b) => a.rating - b.rating);
    default:
      return products;
  }
};
