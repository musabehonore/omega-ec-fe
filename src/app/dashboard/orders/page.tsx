'use client';

import React, { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { axiosRequest } from '@/utils';
import { setError, setLoading, setorders } from '@/redux/slices/ordersSlice';
import { useAppSelector, useAppDispatch } from '@/redux/hooks/hook';
import OrderCard from '@/components/order/orderCard';
import PageLoading from '@/components/Loading/PageLoading';

const Page: React.FC = () => {
  const params = useSearchParams();
  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(setLoading(true));
    axiosRequest('GET', '/product-orders', null, true)
      .then(res => {
        dispatch(setorders(res.data.data));
        dispatch(setLoading(false));
        console.log(res.data.data);
      })
      .catch(err => {
        dispatch(setError(err.message));
        dispatch(setLoading(false));
      });
  }, [dispatch]);

  const { error, loading, orders } = useAppSelector(({ orders }) => orders);

  const status = params.get('status');

  return (
    <div className="container mx-auto p-4">
      {status === 'paid' && (
        <h1 className="text-4xl font-bold text-center my-4">Orders 👍</h1>
      )}
      {loading && <PageLoading />}
      {!loading && !error && orders.length > 0 && (
        <h1 className="text-4xl font-bold text-center my-0">Orders ��</h1>
      )}
      {error && <h1 className="text-red-500 text-center">Error: {error}</h1>}
      {!loading && !error && orders.length === 0 && (
        <h1 className="text-center">No orders found.</h1>
      )}

      <div className="orders-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {!loading &&
          !error &&
          orders.map(order => <OrderCard key={order.id} order={order} />)}
      </div>
    </div>
  );
};

export default Page;
