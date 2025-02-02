'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  showSideNav,
  getProducts,
  updateProductStatus,
  deleteProduct
} from '@/redux/slices/ProductSlice';
import { USER_ROLE } from '@/redux/slices/userSlice';
import ProductLoading from '@/components/Loading/ProductsLoading';
import Image from 'next/image';
import { GetStars } from '@/components/reviews/GetStars';
import { CiEdit } from 'react-icons/ci';
import { IoIosCloseCircle } from 'react-icons/io';
import NotFound from '@/components/Loading/ProductNotFound';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Pagination from '@/components/pagination/Pagination';
import StatusModal from './StatusModal';

const Home: React.FC = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState<'status' | 'delete' | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    null
  );
  const [newStatus, setNewStatus] = useState<boolean>(false);

  useEffect(() => {
    dispatch(showSideNav(true));
    dispatch(getProducts({ page: 1 }));
  }, [dispatch]);

  const { data, loading, error } = useSelector(
    (state: RootState) => state.products
  );
  const { role } = useSelector((state: RootState) => state.user);
  const { userRole } = useSelector((state: RootState) => state.otp);
  const { success } = useAppSelector((state: RootState) => state.products);

  const loggedIn = userRole || role || 'buyer';

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

  const handleStatusClick = async (
    productId: string,
    currentStatus: boolean
  ) => {
    setSelectedProductId(productId);
    setNewStatus(!currentStatus);
    setModalType('status');
    setShowModal(true);
  };

  const handleStatusChange = () => {
    if (selectedProductId !== null) {
      dispatch(updateProductStatus(selectedProductId)).then(() => {
        setShowModal(false);
        setSelectedProductId(null);
        router.push('/dashboard/products');
      });
    }
  };

  const handleProductEdit = (e: React.MouseEvent, productId: string) => {
    e.preventDefault();
    router.push(`/dashboard/update-item?productId=${productId}`);
  };

  const confirmDelete = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (selectedProductId) {
      const resultAction = await dispatch(deleteProduct(selectedProductId));
      if (success) {
        await dispatch(getProducts({}));
        toast.success('Product deleted successfully');
      } else {
        toast.error('Failed to delete product');
      }
      setShowModal(false);
      setSelectedProductId(null);
    }
  };

  const handleDeleteClick = (id: string) => {
    setSelectedProductId(id);
    setModalType('delete');
    setShowModal(true);
  };

  const handleCancel = () => {
    setShowModal(false);
    setSelectedProductId(null);
  };

  // if (loading) return <ProductLoading />;
  if (error) return <div>Error: {error.message}</div>;

  if (data) {
    const { products, totalItems, totalPages, from } = data;
    const items = Math.ceil(totalItems / totalPages);
    const currentPage =
      parseInt(
        new URLSearchParams(window.location.search).get('page') || '1'
      ) || Math.ceil(from / items);

    return (
      <>
        {showModal && modalType === 'delete' && (
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
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 text-white rounded-lg"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showModal && modalType === 'status' && (
          <StatusModal
            onClose={handleCancel}
            onConfirm={handleStatusChange}
            status={newStatus}
          />
        )}

        <div className="flex justify-between gap-4 min-w-screen w-full z-0 pl-2">
          <section className="w-full flex flex-col gap-0 pt-0">
            <div className="w-full p-1 rounded-lg overflow-y-auto mt-10">
              {products?.length === 0 ? (
                <NotFound />
              ) : (
                <table className="min-w-full text-sm text-left mt-2">
                  <thead>
                    <tr>
                      <th className="p-2 w-min">Image</th>
                      <th className="hidden md:table-cell p-2 truncate">
                        Name
                      </th>
                      <th className="p-2 truncate">Price</th>
                      <th className="p-2 truncate">Quantity</th>
                      <th className="p-2 truncate">Status</th>
                      <th className="p-2 truncate">Action</th>
                    </tr>
                  </thead>
                  <tbody className="gap-2">
                    {products &&
                      products.map((product, i) => (
                        <tr
                          key={i}
                          className="cursor-pointer text-gray-700 hover:bg-accent-200 hover:text-accent-900 bg-white rounded-md text-lg p-2 mb-2 border-b border-main-200"
                        >
                          <td className="hidden md:table-cell p-2 font-bold h-full overflow-hidden items-center">
                            <Image
                              width={120}
                              height={120}
                              src={product.images[0]}
                              alt="Product image"
                              className="object-cover transition-transform duration-300 hover:scale-125"
                            />
                          </td>
                          <td className="p-2 truncate font-bold">
                            <p className="font-bold text-sm md:text-sm lg:text-lg uppercase truncate">
                              {product.name}
                            </p>
                            <GetStars rating={product.averageRatings || 0} />
                          </td>
                          <td className="p-2 truncate text-sm md:text-sm lg:text-lg font-bold">
                            $ {product.price.toLocaleString()}
                          </td>
                          <td className="p-2 truncate">{product.quantity}</td>
                          <td
                            className="p-1 truncate cursor-pointer"
                            onClick={() =>
                              handleStatusClick(product.id, product.status)
                            }
                          >
                            <span
                              className={`p-1 rounded-lg ${product.status ? 'bg-green-600' : 'bg-red-600'} text-white`}
                            >
                              {product.status ? 'True' : 'False'}
                            </span>
                          </td>
                          <td className="p-2 font-bold h-full gap-4 items-center mt-1 md:flex">
                            <button
                              onClick={e => handleProductEdit(e, product.id)}
                            >
                              <CiEdit
                                size={34}
                                className="hover:bg-green-500 rounded-lg "
                              />
                            </button>
                            <button
                              onClick={() => handleDeleteClick(product.id)}
                            >
                              <IoIosCloseCircle
                                size={34}
                                className="hover:bg-red-500 rounded-lg "
                              />
                            </button>
                          </td>
                        </tr>
                      ))}
                  </tbody>
                </table>
              )}
            </div>
            {totalPages > 1 && (
              <div className="mt-1 flex justify-between items-center self-end">
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
  }

  return <div>No product found.</div>;
};

export default Home;
