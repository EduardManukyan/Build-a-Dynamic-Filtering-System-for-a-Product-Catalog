import React from 'react';
import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '../../store/';
import ProductList from './index';
import CheckboxWithLabel from '../check-box-label';
beforeAll(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    }),
  });
});

test('renders ProductList component', async () => {
  render(
    <Provider store={store}>
      <ProductList />
    </Provider>,
  );

  await waitFor(() => {
    expect(screen.getByText(/Filter Options/i)).toBeInTheDocument();
  });
  expect(screen.getByPlaceholderText(/Search products/i)).toBeInTheDocument();
});

describe('CheckboxWithLabel Component', () => {
  test('renders with the correct label', () => {
    render(
      <CheckboxWithLabel label='Brand A' checked={false} onChange={() => {}} />,
    );
    expect(screen.getByText(/Brand A/i)).toBeInTheDocument();
  });

  test('checkbox is checked when checked prop is true', () => {
    render(
      <CheckboxWithLabel label='Brand A' checked={true} onChange={() => {}} />,
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(true);
  });

  test('checkbox is not checked when checked prop is false', () => {
    render(
      <CheckboxWithLabel label='Brand A' checked={false} onChange={() => {}} />,
    );
    const checkbox = screen.getByRole('checkbox') as HTMLInputElement;
    expect(checkbox.checked).toBe(false);
  });

  test('calls onChange handler when clicked', () => {
    const handleChange = jest.fn();
    render(
      <CheckboxWithLabel
        label='Brand A'
        checked={false}
        onChange={handleChange}
      />,
    );
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(handleChange).toHaveBeenCalledTimes(1);
  });
});

test('displays a checkbox with the correct grid changes', () => {
  render(
    <CheckboxWithLabel label='Brand A' checked={false} onChange={() => {}} />,
  );

  const checkboxLabel = screen.getByText(/Brand A/i);
  expect(checkboxLabel).toBeInTheDocument();
});

test('state when the checkbox is clicked', () => {
  const handleBrandChange = jest.fn();
  render(
    <CheckboxWithLabel
      label='Brand A'
      checked={false}
      onChange={handleBrandChange}
    />,
  );

  const checkboxInput = screen.getByRole('checkbox');
  fireEvent.click(checkboxInput);

  expect(handleBrandChange).toHaveBeenCalled();
});
