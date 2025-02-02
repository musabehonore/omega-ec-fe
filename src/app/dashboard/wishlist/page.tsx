'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import {
  addWishlist,
  fetchWishes,
  wishedDataResponse2
} from '@/redux/slices/wishlistSlice';
import Link from 'next/link';
import { FormErrorInterface } from '@/utils';
import useToast from '@/components/alerts/Alerts';
import Image from 'next/image';
import emptyWishlist from '@/assets/images/emptyWishlist.png';
import { ToastContainer } from 'react-toastify';
import { addToCart } from '@/redux/slices/cartSlice';

const Wishlist: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);

  const { wishlist, status } = useAppSelector(
    (state: RootState) => state.wishlist
  );
  const { wishlist2 } = useAppSelector((state: RootState) => state.wishlist);

  useEffect(() => {
    setLoading(true);
    dispatch(fetchWishes());
    setLoading(false);
  }, [dispatch]);

  const cartStatus = useAppSelector((state: RootState) => state.cart.status);

  if (loading) {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 mb-4 border-gray text-[22px]">
        Loading...
      </div>
    );
  }

  if (wishlist2) {
    if (wishlist2.count === 0 || !wishlist2.rows) {
      return (
        <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 border-gray text-[22px]">
          <div>
            <Image
              src={emptyWishlist}
              alt="EmptyWishlistIcon"
              width={130}
              height={130}
            />
          </div>
          <div> Wishlist is empty</div>
        </div>
      );
    }
  } else {
    if (!wishlist || wishlist.count === 0 || !wishlist.rows) {
      return (
        <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 border-gray text-[22px]">
          <div>
            <Image
              src={emptyWishlist}
              alt="EmptyWishlistIcon"
              width={130}
              height={130}
            />
          </div>
          <div> Wishlist is empty</div>
        </div>
      );
    }
  }

  const removeWishlist = async (productId: string) => {
    try {
      const result = await dispatch(addWishlist({ productId }));

      if (status === 'succeeded') {
        showSuccess('Product removed from wishlist');
      } else if (status === 'failed' && result.payload) {
        const errorMessage =
          (result.payload as FormErrorInterface).message || 'An error occurred';
        showError(errorMessage || 'Removing from wishlist failed!');
      }
    } catch (error) {
      showError('Error occurred while removing from wishlist');
    }
  };

  const addCart = async (e: React.MouseEvent, productId: string) => {
    e.stopPropagation();

    const result = await dispatch(
      addToCart({ productId: productId, quantity: '1' })
    );

    if (cartStatus === 'succeeded') {
      showSuccess('Product added to CART');
    } else if (cartStatus === 'failed' && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      showError(errorMessage || `Adding to cart failed!`);
    }
  };

  return (
    <div>
      <div className="w-full flex align-middle mt-[-20px] ">
        <div className="flex font-extrabold text-main-400 text-3xl md:text-4xl lg:text-4xl mb-4 mx-auto">
          Wish List
        </div>
      </div>
      {wishlist2 ? (
        <div>
          <div className="font-extrabold text-main-400 text-xl">
            <div>Items count: {wishlist2?.count || 0}</div>
          </div>
          <div className="flex flex-col space-y-3">
            {wishlist2?.rows.map(product => (
              <div
                key={product.product.id}
                className="bg-[#a5c9ca] p-3 rounded-md shadow-md flex flex-col md:flex-row items-start"
              >
                <img
                  src={product.product.images[0]}
                  alt={product.product.name}
                  className="w-full md:w-1/3 h-32 md:h-40 object-cover object-center mb-3 md:mb-0"
                />
                <div className="flex-grow px-4">
                  <div className="font-bold md:text-lg sm:text-base">
                    {product.product.name}
                  </div>
                  <span className="font-black text-lg text-main-400 flex items-center gap-2">
                    $
                    {product.product.bonus
                      ? (
                          product.product.price -
                          (product.product.price *
                            parseInt(product.product.bonus)) /
                            100
                        ).toLocaleString()
                      : product.product.price.toLocaleString()}
                    {product.product.bonus && (
                      <p className="font-thin text-sm line-through">
                        $ {product.product.price.toLocaleString()}
                      </p>
                    )}
                  </span>
                </div>
                <div className="flex flex-col justify-between p-4">
                  <div className="flex space-y-2 sm:space-y-0 sm:space-x-2">
                    <Link
                      href={`/products/details?productId=${product.product.id}`}
                      className="bg-main-400 text-main-100 font-medium py-1 px-3 rounded-full hover:bg-main-300 hover:shadow-md transition-all w-full sm:w-auto text-center"
                    >
                      {loading ? 'Loading...' : 'More'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div>
          <div className="font-extrabold text-main-400 text-xl">
            <div>Items count: {wishlist?.count || 0}</div>
          </div>
          <div className="flex flex-col space-y-3">
            {wishlist?.rows.map(product => (
              <div
                key={product.id}
                className="bg-[#a5c9ca] p-3 rounded-md shadow-md flex flex-col md:flex-row items-start"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full md:w-1/3 h-32 md:h-40 object-cover object-center mb-3 md:mb-0"
                />
                <div className="flex-grow px-4">
                  <div className="font-bold md:text-lg sm:text-base">
                    {product.name}
                  </div>
                  <span className="font-black text-lg text-main-400 flex items-center gap-2">
                    $
                    {product.bonus
                      ? (
                          product.price -
                          (product.price * parseInt(product.bonus)) / 100
                        ).toLocaleString()
                      : product.price.toLocaleString()}
                    {product.bonus && (
                      <p className="font-thin text-xm line-through">
                        $ {product.price.toLocaleString()}
                      </p>
                    )}
                  </span>
                </div>
                <div className="flex flex-col justify-between p-4">
                  <button
                    onClick={e => addCart(e, product.id)}
                    className="bg-main-400 text-main-100 font-medium py-1 px-3 rounded-full mb-2 hover:bg-main-300 hover:shadow-md transition-all"
                    disabled={loading}
                  >
                    {loading ? 'Loading...' : 'Add to cart'}
                  </button>
                  <div className="flex sm:space-y-0 ">
                    <button
                      onClick={() => removeWishlist(product.id)}
                      className="bg-main-400 text-main-100 mr-1 font-medium py-1 px-3 rounded-full hover:bg-main-300 hover:shadow-md transition-all w-full sm:w-auto"
                      disabled={loading}
                    >
                      {loading ? 'Loading...' : 'Remove'}
                    </button>
                    <Link
                      href={`/products/details?productId=${product.id}`}
                      className="bg-main-400 text-main-100 font-medium py-1 px-4 rounded-full hover:bg-main-300 hover:shadow-md transition-all w-full sm:w-auto text-center"
                    >
                      {loading ? 'Loading...' : 'More'}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Wishlist;
