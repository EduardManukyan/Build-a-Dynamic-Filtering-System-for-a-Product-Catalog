import { FC } from 'react';
import ProductCard from '../prodact-card';

interface Product {
  id: number;
  name: string;
  category: string;
  brand: string;
  price: number;
  rating: number;
  imageUrl: string;
}

interface ProductGridProps {
  products: Product[];
}

const ProductGrid: FC<ProductGridProps> = ({ products }) =>
  products.length === 0 ? (
    <div className='no-products-message'>
      No products found matching your criteria.
    </div>
  ) : (
    <div className='product-grid'>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );

export default ProductGrid;
