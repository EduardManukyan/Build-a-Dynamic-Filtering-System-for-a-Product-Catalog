import React from 'react';
import ProductList from './components/product-list';

function App() {
  return (
    <React.Suspense fallback={'Loading...'}>
      <ProductList />
    </React.Suspense>
  );
}

export default App;
