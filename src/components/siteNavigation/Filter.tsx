'use client';

import React, { useEffect, useState } from 'react';
import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { Range, getTrackBackground } from 'react-range';
import { Button, ButtonStyle, Select } from '../formElements';
import { SellerInterface, getProducts } from '@/redux/slices/ProductSlice';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getSellers } from '@/redux/slices/sellerSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { IoFilterCircle } from 'react-icons/io5';

export interface FiltersInterface {
  max: number | null;
  min: number | null;
  seller: SellerInterface | null;
}

const initialState: FiltersInterface = {
  max: null,
  min: null,
  seller: null
};

const STEP = 100;
const MIN = 0;
const MAX = 50000;

interface FiltersProps {
  onClick: () => void;
}

const Filters: FC<FiltersProps> = ({ onClick }) => {
  const router = useRouter();
  const [filter, setFilter] = useState<FiltersInterface>(initialState);
  const [values, setValues] = useState<number[]>([MIN, MAX]);

  const dispatch = useAppDispatch();
  const { data, loadingSellers, error } = useSelector(
    (state: RootState) => state.sellers
  );

  const { loading } = useSelector((state: RootState) => state.products);

  useEffect(() => {
    const handler = setTimeout(() => {
      const currentParams = new URLSearchParams(window.location.search);
      const max = currentParams.get('priceLessThan');
      const min = currentParams.get('priceGreaterThan');
      const sellerId = currentParams.get('sellerId');

      if (filter.max === null) {
        setValues([Number(min) || MIN, Number(max) || MAX]);
        setFilter({ ...filter, max: Number(max) || null });
      }

      if (filter.min === null) {
        setValues([Number(min) || MIN, Number(max) || MAX]);
        setFilter({ ...filter, min: Number(min) || null });
      }

      if (filter.seller === null) {
        setFilter({
          ...filter,
          seller:
            data?.find((itm: { id: string | null }) => itm.id === sellerId) ||
            null
        });
      }

      if (data === null && !loadingSellers && error === null) {
        dispatch(getSellers());
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [data, dispatch, loadingSellers, error, filter]);

  const handlePriceChange = (newValues: number[]) => {
    if (newValues.length === 2) {
      setValues(newValues);
      setFilter(prevFilter => ({
        ...prevFilter,
        min: newValues[0],
        max: newValues[1]
      }));
    }
  };

  const handleSubmit = () => {
    const newParams = new URLSearchParams();

    if (filter.min !== null) {
      newParams.set('priceGreaterThan', filter.min.toString());
    }
    if (filter.max !== null) {
      newParams.set('priceLessThan', filter.max.toString());
    }
    if (filter.seller !== null) {
      newParams.set('sellerId', filter.seller.id);
    }

    if (filter.seller === null) {
      newParams.delete('sellerId');
    }

    const queryString = newParams.toString();
    const queryParamsObject: Record<string, string> = {};

    newParams.forEach((value, key) => {
      queryParamsObject[key] = value;
    });

    router.push(`?${queryString}`);

    dispatch(getProducts(queryParamsObject));
    onClick();
  };

  return (
    <>
      <div className="mb-4 mt-2 flex items-center gap-4 justify-between">
        <label className="block text-sm font-medium text-gray-700">
          Seller:
        </label>
        <Select<SellerInterface>
          placeholder="Select Seller"
          selected={filter.seller}
          loading={false}
          setSelected={(selected: SellerInterface | null) => {
            const currentParams = new URLSearchParams(window.location.search);

            const newParams = new URLSearchParams();
            currentParams.forEach((value, key) => newParams.append(key, value));
            if (currentParams.get('sellerId')) {
              newParams.delete('sellerId');
            }

            const queryString = newParams.toString();
            const queryParamsObject: Record<string, string> = {};
            newParams.forEach((value, key) => {
              queryParamsObject[key] = value;
            });

            router.push(`?${queryString}`);
            dispatch(getProducts(queryParamsObject));

            setFilter({ ...filter, seller: selected });
          }}
          data={data || []}
        />
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700">
          Price Range <span className="font-bold">USD</span>
        </label>
        <div className="mt-2">
          <Range
            values={values}
            step={STEP}
            min={MIN}
            max={MAX}
            onChange={handlePriceChange}
            renderTrack={({ props, children }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '4px',
                  width: '100%',
                  background: getTrackBackground({
                    values,
                    colors: ['#ccc', '#395B64', '#ccc'],
                    min: MIN,
                    max: MAX
                  })
                }}
              >
                {children}
              </div>
            )}
            renderThumb={({ props }) => (
              <div
                {...props}
                style={{
                  ...props.style,
                  height: '14px',
                  width: '14px',
                  borderRadius: '50%',
                  backgroundColor: '#395B64',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  boxShadow: '0px 2px 6px #AAA'
                }}
              />
            )}
          />
          <div className="flex justify-between mt-2">
            <span>{values[0]}</span>
            <span>{values[1]}</span>
          </div>
        </div>
      </div>
      <div onClick={() => handleSubmit()} className="w-full">
        <Button
          label="Filter"
          disabled={loading}
          loading={loading}
          style={ButtonStyle.DARK}
          icon={IoFilterCircle}
        />
      </div>
    </>
  );
};

export default Filters;
