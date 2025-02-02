import React from 'react';
import { render, fireEvent } from '@testing-library/react';
import Pagination from '../components/pagination/Pagination';

describe('Pagination Component', () => {
  const onPageChangeMock = jest.fn();

  test('renders pagination correctly', () => {
    const { getByText } = render(
      <Pagination
        totalItems={20}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={onPageChangeMock}
      />
    );
    expect(getByText('1')).toBeTruthy();
    expect(getByText('2')).toBeTruthy();
    expect(getByText('Next')).toBeTruthy();
  });

  test('clicking on Next button updates current page', () => {
    const { getByText } = render(
      <Pagination
        totalItems={20}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={onPageChangeMock}
      />
    );

    fireEvent.click(getByText('Next'));
    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });

  test('clicking on Previous button updates current page', () => {
    const { getByText } = render(
      <Pagination
        totalItems={20}
        itemsPerPage={5}
        currentPage={2}
        onPageChange={onPageChangeMock}
      />
    );

    fireEvent.click(getByText('Previous'));

    expect(onPageChangeMock).toHaveBeenCalledWith(1);
  });

  test('clicking on a page number updates current page', () => {
    const { getByText } = render(
      <Pagination
        totalItems={20}
        itemsPerPage={5}
        currentPage={1}
        onPageChange={onPageChangeMock}
      />
    );

    fireEvent.click(getByText('2'));

    expect(onPageChangeMock).toHaveBeenCalledWith(2);
  });
});
