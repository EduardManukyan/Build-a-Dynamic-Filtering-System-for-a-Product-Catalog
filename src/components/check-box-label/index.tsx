import React from 'react';
import { Checkbox } from 'antd';
import './style.scss';

interface CheckboxWithLabelProps {
  label: string;
  checked: boolean;
  onChange: (e: any) => void;
}

const CheckboxWithLabel: React.FC<CheckboxWithLabelProps> = ({
  label,
  checked,
  onChange,
}) => (
  <div className='checkbox-with-label'>
    <span className='label'>{label}</span>
    <Checkbox checked={checked} onChange={onChange} />
  </div>
);

export default CheckboxWithLabel;
