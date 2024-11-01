import { Card } from 'antd';
import { FC } from 'react';
import { IProduct } from '../../types/types';

interface ProductCardProps {
  product: IProduct;
}

const ProductCard: FC<ProductCardProps> = ({ product }) => (
  <Card
    className='product-card'
    style={{ width: '275px' }}
    title={product.name}
  >
    <p>Category: {product.category}</p>
    <p>Brand: {product.brand}</p>
    <p>Price: ${product.price.toFixed(2)}</p>
    <p>Rating: {product.rating} stars</p>
  </Card>
);

export default ProductCard;
