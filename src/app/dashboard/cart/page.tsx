'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import { FormErrorInterface, axiosInstance, axiosRequest } from '@/utils';
import useToast from '@/components/alerts/Alerts';
import {
  cartFormData,
  removeFromCart,
  updateCart,
  deleteCart
} from '@/redux/slices/cartSlice';
import { checkoutNow } from '@/redux/slices/payment';
import { IoAdd } from 'react-icons/io5';
import { HiMinusSmall } from 'react-icons/hi2';
import Image from 'next/image';
import stripeIcon from '@/assets/images/stripe-payment-icon.png';
import momoIcon from '@/assets/images/momo.png';
import emptyCart from '@/assets/images/emptyCart.png';
import { ToastContainer } from 'react-toastify';

const Cart: React.FC = () => {
  const { showSuccess, showError } = useToast();

  const dispatch = useAppDispatch();

  const [loading, setLoading] = useState(false);
  const [quantity, setQuantity] = useState<number>(1);
  const { cart, status } = useAppSelector((state: RootState) => state.cart);
  const { loading: paymentLoading, error: paymentError } = useAppSelector(
    (state: RootState) => state.payment
  );

  const handleCheckout = () => {
    dispatch(checkoutNow());
  };

  if (loading) {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 mb-4 border-gray text-[22px]">
        Loading...
      </div>
    );
  }

  if (!cart || !cart.products) {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 gap-5  border-gray text-[22px]">
        <div>
          <Image src={emptyCart} alt="EmptyCartIcon" width={130} height={130} />
        </div>
        <div>Cart is empty</div>
      </div>
    );
  }

  const removeOneCart = async (productId: string) => {
    const result = await dispatch(removeFromCart(productId));

    if (status === 'succeeded') {
      showSuccess('Product removed from cart');
    } else if (status === 'failed' && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      showError(errorMessage || `Removing from cart failed!`);
    }
  };

  const addQuantity = async (
    cartId: string,
    productId: string,
    quantity2: string
  ) => {
    const quantity = parseInt(quantity2, 10) + 1;
    const formData2: cartFormData = {
      productId,
      quantity: quantity.toString()
    };

    await dispatch(updateCart({ cartId, formData2 }));
  };

  const reduceQuantity = async (
    cartId: string,
    productId: string,
    quantity2: string
  ) => {
    const quantity = parseInt(quantity2, 10) - 1;
    const formData2: cartFormData = {
      productId,
      quantity: quantity.toString()
    };
    if (quantity === 0) {
      showError('Quantity can not be 0. Remove it instead');
    }
    await dispatch(updateCart({ cartId, formData2 }));
  };

  const deleteCarts = async (cartId: string) => {
    const result = await dispatch(deleteCart(cartId));

    if (status === 'succeeded') {
      showSuccess('Cart cleared successfully!');
    } else if (status === 'failed' && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      showError(errorMessage || `Clearing cart failed!`);
    }
  };

  return (
    <div>
      <div className="w-full flex align-middle mt-[-20px] ">
        <div className="flex font-extrabold text-main-400 text-3xl md:text-4xl lg:text-4xl mb-4 mx-auto">
          Shopping Cart
        </div>
      </div>
      <div className="flex flex-col md:flex-row flex-start gap-4 ">
        <div className="w-full md:w-8/12 space-y-4 p-0 ">
          <div className="flex flex-col space-y-3">
            {cart.products.map(product => (
              <div
                key={product.id}
                className="bg-[#a5c9ca] rounded-md shadow-md p-3 pr-3 md:pr-0  lg:pr-0 flex flex-col md:flex-row items-start"
              >
                <img
                  src={product.images[0]}
                  alt={product.name}
                  className="w-full md:w-1/3 h-32 md:h-38 object-cover object-center mb-3 md:mb-0"
                />
                <div className="flex-grow pl-4">
                  <div className="font-bold md:text-lg sm:text-base">
                    {product.name}
                  </div>
                  <span className="font-black text-lg text-main-400 flex items-center gap-2">
                    ${' '}
                    {product.bonus
                      ? (
                          product.price -
                          (product.price * parseInt(product.bonus)) / 100
                        ).toLocaleString()
                      : product.price.toLocaleString()}
                    {product.bonus && (
                      <p className="font-thin text-xs line-through">
                        $ {product.price.toLocaleString()}
                      </p>
                    )}
                  </span>
                </div>
                <div className="flex flex-col items-center justify-between w-[120px] gap-1 ">
                  <button
                    onClick={() => removeOneCart(product.id)}
                    className=" text-[#BB1616] underline hover:text-main-300 active:text-blue transition-all w-full sm:w-auto"
                  >
                    {loading ? 'Loading...' : 'Remove'}
                  </button>
                  <div className="w-[100px] relative truncate flex justify-between items-center p-0 border border-black border-1 cursor-pointer rounded-md">
                    <HiMinusSmall
                      onClick={() =>
                        reduceQuantity(cart.id, product.id, product.quantity)
                      }
                      className="w-10 hover:bg-black hover:text-white active:bg-slate-600 h-full p-0.5"
                    />
                    <input
                      value={product.quantity || 1}
                      onChange={e => setQuantity(Number(e.target.value))}
                      className="w-10 bg-transparent text-center h-full "
                    />
                    <IoAdd
                      onClick={() =>
                        addQuantity(cart.id, product.id, product.quantity)
                      }
                      className="w-10 hover:bg-black hover:text-white active:bg-slate-600 h-full p-0.5 "
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
          <button
            onClick={() => {
              deleteCarts(cart?.id);
            }}
            className="bg-red-900 text-main-100 font-medium py-1 px-3 rounded-full hover:bg-main-400 shadow-md active:bg-slate-600 transition-all w-[130px] "
          >
            Clear Cart
          </button>
        </div>
        <div className=" flex-row w-full md:w-4/12 space-y-3 rounded-lg p-0 ">
          <div className="bg-[#a5c9ca] rounded-md shadow-md space-y-2  p-4 py-2">
            <div className="font-extrabold text-main-400 text-xl mb-3">
              Summary
            </div>
            <div className=" flex justify-between font-bold text-lg text-main-400">
              <span className="font-medium text-main-400">Total</span>
              <span
                id="total-price"
                className="font-black text-lg text-main-400"
              >
                ${cart?.totalprice.toLocaleString() || 0}
              </span>
            </div>
            <button
              onClick={handleCheckout}
              className="bg-main-400 text-main-100 font-medium py-2 px-4 rounded-full hover:bg-main-300 hover:shadow-md active:bg-slate-500 transition-all w-full"
              disabled={paymentLoading}
            >
              {paymentLoading ? 'Processing...' : 'Checkout'}
            </button>
            {paymentError && <p className="text-red-500">{paymentError}</p>}
          </div>
          <div className="bg-[#a5c9ca] rounded-md shadow-md p-4">
            <div className="font-extrabold text-main-400 text-xl">Pay with</div>
            <div className="flex justify-between mt-1">
              <div>
                <Image
                  src={stripeIcon}
                  alt="StripeIcon"
                  width={130}
                  height={130}
                />
              </div>
              <div>
                <Image src={momoIcon} alt="MomoIcon" width={75} height={75} />
              </div>
            </div>

            <div className="font-medium text-main-400 mt-4">
              <div className="font-extrabold text-main-400 text-xl">
                Buyer protection
              </div>
              Get full refund if the item is not as described or if not
              delivered.
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Cart;
