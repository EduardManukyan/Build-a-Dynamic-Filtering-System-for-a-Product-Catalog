import React from 'react';
import { Spin } from 'antd';
import './style.scss';

const LoadingSpinner = () => {
  return (
    <div className='loading-spinner'>
      <Spin tip='Loading...' />
    </div>
  );
};

export default LoadingSpinner;
