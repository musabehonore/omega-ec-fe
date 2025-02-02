'use client';

import React, { useState } from 'react';
import ProductCard from './ProductCard';
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';
import {
  ProductDataInterface,
  getProducts,
  deleteProduct
} from '@/redux/slices/ProductSlice';
import Pagination from '../pagination/Pagination';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { useRouter, useSearchParams } from 'next/navigation';
import { RootState } from '@/redux/store';
import { USER_ROLE } from '@/redux/slices/userSlice';
import { GetStars } from '../reviews/GetStars';
import { IoIosCloseCircle } from 'react-icons/io';
import { CiEdit } from 'react-icons/ci';
import { HiOutlineHome } from 'react-icons/hi2';
import Link from 'next/link';
import { MdOutlineAddchart } from 'react-icons/md';
import useToast from '@/components/alerts/Alerts';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import NotFound from '../Loading/ProductNotFound';
interface GridListingProps {
  data: ProductDataInterface;
}
const GridListing: React.FC<GridListingProps> = ({ data }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { products, totalItems, totalPages, from } = data;
  const items = Math.ceil(totalItems / totalPages);
  const currentPage =
    parseInt(searchParams.get('page') || '1') || Math.ceil(from / items);
  const dispatch = useAppDispatch();
  const setNewPage = (page: number) => {
    const currentParams = new URLSearchParams(window.location.search);
    const newParams = new URLSearchParams();
    currentParams.forEach((value, key) => newParams.append(key, value));
    newParams.set('page', page.toString());
    const queryString = newParams.toString();
    const queryParamsObject: Record<string, string> = {};
    newParams.forEach((value, key) => {
      queryParamsObject[key] = value;
    });
    router.push(`?${queryString}`);
    dispatch(getProducts(queryParamsObject));
    return;
  };

  const { role } = useAppSelector((state: RootState) => state.user);
  const { userRole } = useAppSelector((state: RootState) => state.otp);
  const { showSuccess, showError } = useToast();
  const { success } = useAppSelector((state: RootState) => state.products);
  const loggedIn = userRole || role || 'buyer';
  const [showModal, setShowModal] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [productList, setProductList] = useState(products);

  const confirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (deleteId) {
      const resultAction = await dispatch(deleteProduct(deleteId));
      if (success) {
        await dispatch(getProducts({}));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
      setShowModal(false);
      setDeleteId(null);
    }
  };

  const handleproduct = (e: React.MouseEvent, productId: string) => {
    router.push(`/dashboard/update-item?productId=${productId}`);
  };

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setDeleteId(null);
  };
  return (
    <>
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-4 rounded-lg">
            <p>Are you sure you want to delete this product?</p>
            <div className="flex justify-end gap-2 mt-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 bg-gray-300 rounded-lg"
              >
                Cancel
              </button>
              <button
                onClick={e => confirmDelete(e)}
                className="px-4 py-2 bg-red-500 text-white rounded-lg"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between  gap-4 min-w-screen  w-full z-0 pl-2">
        <section className="w-full pt-0 flex flex-col gap-2 b ">
          <div className="mt-4 flex justify-between w-full h-min px-2 z-50 bg-main-100">
            <h2 className="text-base font-bold flex gap-2 items-center">
              <Link href={'/'}>
                <HiOutlineHome
                  size={24}
                  className="hover:underline cursor-pointer text-sm hover:text-main-200"
                />
              </Link>
              <span>Products</span>
            </h2>
          </div>

          <div className=" w-full p-1 rounded-lg overflow-y-auto">
            {products?.length == 0 ? (
              <NotFound />
            ) : (
              <div className="w-full grid gap-3 rounded-xl overflow-y-auto overflow-x-hidden auto-fit-grid">
                {products &&
                  products.map((product, index) => (
                    <ProductCard product={product} key={index} />
                  ))}
              </div>
            )}
          </div>
          {totalPages > 1 && (
            <div className="mt-1 flex justify-between items-center self-center">
              <Pagination
                totalItems={totalItems}
                itemsPerPage={totalItems / totalPages}
                currentPage={currentPage}
                onPageChange={(page: number) => setNewPage(page)}
              />
            </div>
          )}
        </section>
        <ToastContainer />
      </div>
    </>
  );
};
export default GridListing;
