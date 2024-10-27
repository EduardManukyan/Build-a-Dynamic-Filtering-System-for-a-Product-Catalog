import React, { FC } from 'react';
import { Alert } from 'antd';
import './style.scss';

interface Props {
  message: string;
  description: string;
}
const ErrorMessage: FC<Props> = ({ message, description }) => {
  return (
    <div className='error-message'>
      <Alert
        message={message}
        description={description}
        type='error'
        showIcon
      />
    </div>
  );
};

export default ErrorMessage;
