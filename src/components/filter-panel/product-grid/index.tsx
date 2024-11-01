import { FC } from 'react';
import ProductCard from '../prodact-card';
import { IProduct } from '../../types/types';

interface ProductGridProps {
  products: IProduct[];
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
