'use client';

import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  Notification,
  fetchNotifications
} from '@/redux/slices/notificationSlice';
import { formatDate } from '@/utils/formatDate';
import React, { useEffect } from 'react';

const NotificationPage = () => {
  const dispatch = useAppDispatch();
  const { data, loading, success, message } = useAppSelector(
    state => state.notifications
  );
  const fetchedData = data?.data
    .slice()
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  return (
    <div className="flex-1 p-4 flex flex-col h-full">
      <h1 className="text-2xl font-bold mb-4">
        All notifications({data?.data.length || 0})
      </h1>
      {loading && <p className="text-blue-500">Loading...</p>}
      {success && (
        <div className="overflow-auto flex-1 bg-main-100">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Message
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  ACTIVITY
                </th>
                <th
                  scope="col"
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-main-100">
              {Array.isArray(fetchedData) &&
                fetchedData.map((notification: Notification, index: number) => (
                  <tr key={notification.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      {index + 1}. {notification.message}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {notification.event === 'PRODUCT_WISHLIST_UPDATE' ? (
                        <>WISHLIST UPDATED</>
                      ) : notification.event === 'PAYMENT_COMPLETED' ? (
                        <>PAYMENT COMPLETED</>
                      ) : notification.event === 'ORDER_STATUS' ? (
                        <>ORDER STATUS UPDATED</>
                      ) : notification.event === 'STOCK_LEVEL_REACH_ZERO' ? (
                        <>STOCK LEVEL REACH ZERO</>
                      ) : (
                        ''
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {formatDate(notification.createdAt)}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default NotificationPage;
