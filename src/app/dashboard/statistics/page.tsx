'use client';

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../../redux/hooks/hook';
import { fetchStats } from '@/redux/slices/stasticsSlice';
import { ResponsiveContainer, PieChart, Pie, Legend } from 'recharts';
import MyBarChart from '@/components/barchart/BarChart';

const StatsPage = () => {
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const dispatch = useAppDispatch();

  const { stats, loading, error } = useAppSelector(state => state.stats);

  const handleFetchStats = () => {
    dispatch(fetchStats({ startDate, endDate }));
  };

  const pieChartData = [
    { name: 'New Products', value: stats?.newProducts || 0 },
    { name: 'Expired Products', value: stats?.expiredProducts || 0 },
    { name: 'Stock Increment', value: stats?.stockIncrement || 0 },
    { name: 'Stock Reduction', value: stats?.stockReduction || 0 },
    { name: 'Products Wished', value: stats?.productWished || 0 }
  ];

  const barChartData = [
    { name: 'New Products', value: stats?.newProducts || 0 },
    { name: 'Expired Products', value: stats?.expiredProducts || 0 },
    { name: 'Stock Increment', value: stats?.stockIncrement || 0 },
    { name: 'Stock Reduction', value: stats?.stockReduction || 0 },
    { name: 'Products Wished', value: stats?.productWished || 0 }
  ];

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Product Statistics</h1>
      <div className="flex justify-between w-1/2 gap-4">
        <div className="mb-1 flex-1">
          <label className="block mb-2">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={e => setStartDate(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-1 flex-1">
          <label className="block mb-2">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={e => setEndDate(e.target.value)}
            className="border p-2 w-full"
          />
        </div>
        <div className="mb-1 flex-none">
          <button
            onClick={handleFetchStats}
            className="bg-[#395B64] text-white px-7 py-2 mt-[38px] rounded"
            disabled={loading}
          >
            {loading ? 'Fetching...' : 'Filter'}
          </button>
        </div>
      </div>

      {error && <div className="text-red-500 mt-4">{error}</div>}
      {stats && (
        <div className="mt-4">
          <div className="w-full h-[300px]">
            <ResponsiveContainer>
              <PieChart>
                <Pie dataKey="value" data={pieChartData} fill="#395B64" label />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="w-full h-[300px] mt-6">
            <MyBarChart data={barChartData} />
          </div>
        </div>
      )}
    </div>
  );
};

export default StatsPage;
