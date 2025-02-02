'use client';
import { useSearchParams } from 'next/navigation';
import React, { ChangeEvent, Suspense, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { getAverage, getProductDetails } from '@/redux/slices/ProductSlice';
import {
  Button,
  ButtonSize,
  ButtonStyle,
  Input
} from '@/components/formElements';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import ProductCard from '@/components/products/ProductCard';
import {
  getReviews,
  addReview,
  AddReviewInterface,
  ReviewInterface,
  addReply,
  getReply
} from '@/redux/slices/itemSlice';
import Slider from '@/components/Images/Slider'; //@ts-ignore
import ReactStars from 'react-rating-stars-component';
import PageLoading from '@/components/Loading/PageLoading';
import { addWishlist, fetchWishes } from '@/redux/slices/wishlistSlice';
import { FormErrorInterface } from '@/utils';
import { FaCartPlus, FaHeart } from 'react-icons/fa';
import { addToCart, fetchCart } from '@/redux/slices/cartSlice';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import useToast from '@/components/alerts/Alerts';
import { GetStars } from '@/components/reviews/GetStars';
import { IoAdd } from 'react-icons/io5';
import { HiMinusSmall } from 'react-icons/hi2';
import { CiHeart } from 'react-icons/ci';
import Image from 'next/image';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faEnvelope, faPhone } from '@fortawesome/free-solid-svg-icons';
import { setAuthToken } from '@/redux/slices/userSlice';
import { getUserToken } from '@/redux/hooks/selectors';
import NotFound from '@/components/Loading/ProductNotFound';
import MainNav from '@/components/siteNavigation/MainNav';
import AdsListing from '@/components/products/adsListing';
import LineLoading from '@/components/Loading/LineLoading';
import { Section } from '@/components/products/FashionListing';

interface ReviewForm {
  rating?: number;
  feedback: string;
}

interface ReplyForm {
  reviewId: string;
  reply: string;
}

const Details = () => {
  const dispatch = useAppDispatch();

  const { showSuccess, showError } = useToast();

  const {
    reviews,
    replies,
    loadingReviews: loadingReviews,
    error: reviewError,
    status
  } = useAppSelector((state: RootState) => state.product);

  const [quantity, setQuantity] = useState<number>(1);
  const searchParams = useSearchParams();
  const productId = searchParams.get('productId');

  const { selectedProduct, loading, error } = useSelector(
    (state: RootState) => state.products
  );

  const wishlist = useAppSelector(
    (state: RootState) => state.wishlist.wishlist?.rows || []
  );

  const wishStatus = useAppSelector(
    (state: RootState) => state.wishlist.status
  );

  const cartStatus = useAppSelector((state: RootState) => state.cart.status);

  const isAuthenticated = useAppSelector(getUserToken) !== null;

  const isInWishlist = wishlist.some(
    wishlistItem => wishlistItem.id === productId
  );
  const [displayedReviews, setDisplayedReviews] = useState<number>(5);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    if (
      selectedProduct == null &&
      productId &&
      loading === false &&
      error == null
    ) {
      dispatch(getProductDetails(productId));
    }
  }, [dispatch, productId, selectedProduct, loading]);

  useEffect(() => {
    if (productId && loading === false && error == null) {
      dispatch(getReviews(productId));
    }
  }, [dispatch, productId]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);
          dispatch(setAuthToken(token));
        } catch (error) {
          console.error('Failed to parse token from localStorage', error);
        }
      }
    }
  }, [dispatch]);

  const [reviewForm, setReviewForm] = useState<ReviewForm>({
    feedback: ''
  });

  const [expandedReplies, setExpandedReplies] = useState<{
    [key: string]: boolean;
  }>({});

  const [newReply, setNewReply] = useState<{
    [key: string]: string;
  }>({});

  const handleReplyChange = (
    event: ChangeEvent<HTMLInputElement>,
    reviewId: string
  ) => {
    setNewReply(prev => ({
      ...prev,
      [reviewId]: event.target.value
    }));
  };

  const handleReplySubmit = async (reviewId: string) => {
    try {
      if (!productId) {
        throw new Error('Product ID is missing.');
      }

      const replyData: ReplyForm = {
        reviewId,
        reply: newReply[reviewId]
      };

      if (!replyData.reply) return;

      await dispatch(
        addReply({ reviewId: replyData.reviewId, feedback: replyData.reply })
      );

      await dispatch(getReply(replyData.reviewId));

      await dispatch(getReviews(productId));

      setNewReply(prev => ({
        ...prev,
        [reviewId]: ''
      }));
    } catch (error) {
      showError('Failed to add reply. Please try again.');
    }
  };

  const ratingChanged = (newRating: any) => {
    setRating(newRating);
  };

  const handleReviewChange = (event: ChangeEvent<HTMLInputElement>) => {
    setReviewForm({ ...reviewForm, feedback: event.target.value });
  };

  const handleAddReview = async () => {
    try {
      if (!productId) {
        throw new Error('Product ID is missing.');
      }

      const reviewData: AddReviewInterface = {
        productId,
        rating: rating,
        feedback: reviewForm.feedback
      };

      await dispatch(addReview(reviewData));

      await dispatch(getReviews(productId));

      if (status === 'succeeded') {
        toast.success(`Review added successfully`, {
          position: 'top-left',
          style: {
            marginTop: '60px'
          },
          autoClose: 2000
        });
      } else if (status === 'failed') {
        toast.error((error as unknown as string) || `Please login!`, {
          position: 'top-left',
          style: {
            marginTop: '60px'
          },
          autoClose: 2000
        });
      }

      setReviewForm({ rating: 0, feedback: '' });
      setRating(0);
    } catch (error) {
      console.error('Failed to add review:', error);
      alert('Failed to add review. Please try again.');
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };

  const userToken = useAppSelector(getUserToken);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const tokenString = localStorage.getItem('token');
      if (tokenString) {
        try {
          const token = JSON.parse(tokenString);
          dispatch(setAuthToken(token));
        } catch (error) {
          console.error('Failed to parse token from localStorage', error);
        }
      }
    }
  }, [dispatch]);

  useEffect(() => {
    if (userToken !== null) {
      const handler = setTimeout(() => {
        dispatch(fetchWishes());
        dispatch(fetchCart());
      }, 1000);

      return () => {
        clearTimeout(handler);
      };
    }
  }, [dispatch, userToken]);

  const handleLoadMore = () => {
    setDisplayedReviews(prev => prev + 5);
  };

  const handleLoadLess = () => {
    setDisplayedReviews(prev => Math.max(5, prev - 5));
  };

  const handleAdd = () => {
    setQuantity(prevQuantity => prevQuantity + 1);
  };

  const handleRemove = () => {
    setQuantity(prevQuantity => (prevQuantity > 1 ? prevQuantity - 1 : 1));
  };
  const toggleWishlist = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!productId) {
      return (
        <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 mb-4 border-gray text-[22px]">
          No product id available
        </div>
      );
    }
    const result = await dispatch(addWishlist({ productId: productId }));

    if (wishStatus === 'succeeded') {
      const successMessage = result.payload.message;
      toast.success(successMessage || `Product added to wishlist`, {
        position: 'top-left',
        style: {
          marginTop: '60px'
        },
        autoClose: 2000
      });
    } else if (wishStatus === 'failed' && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      toast.error(errorMessage || `Adding to wishlist failed!`, {
        position: 'top-left',
        style: {
          marginTop: '60px'
        },
        autoClose: 2000
      });
    }
  };

  const addCart = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!productId) {
      return (
        <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2 mb-4 border-gray text-[22px]">
          No product id available
        </div>
      );
    }

    const result = await dispatch(
      addToCart({ productId: productId, quantity: quantity.toString() })
    );

    if (cartStatus === 'succeeded') {
      toast.success(`Product added to CART`, {
        position: 'top-left',
        style: {
          marginTop: '60px'
        },
        autoClose: 2000
      });
    } else if (cartStatus === 'failed' && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      toast.error(errorMessage || `Adding to cart failed!`, {
        position: 'top-left',
        style: {
          marginTop: '60px'
        },
        autoClose: 2000
      });
    }
  };

  return (
    <div className="w-full">
      {selectedProduct === null && loading === true ? (
        <PageLoading />
      ) : selectedProduct === null && error !== null ? (
        <div className="min-h-screen w-full">
          <NotFound />
        </div>
      ) : selectedProduct ? (
        <>
          <MainNav />
          <div className="flex w-full flex-col gap-4 lg:flex-row justify-between p-2 md:p-6  min-h-screen pt-16">
            <div className="w-full h-full lg:w-3/5 flex-col items-center justify-center gap-2 relative animate__animated animate__fadeIn animate__slow">
              <Slider images={selectedProduct.product.images} />
            </div>
            <div className="w-full lg:mt-0 lg:w-2/5 p-0 pt-10 lg:p-4 flex flex-col items-start gap-2 text-black animate__animated animate__fadeInTop animate__slow">
              <span className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold md:text-3xl truncate">
                  {selectedProduct.product.name}
                </h2>
              </span>
              <span className="font-semibold text-xl text-main-400 flex items-center gap-2 min-h-12 px-2 w-min truncate rounded-md shadow-md">
                ${' '}
                {selectedProduct.product.bonus
                  ? (
                      selectedProduct.product.price -
                      (selectedProduct.product.price *
                        parseInt(selectedProduct.product.bonus)) /
                        100
                    ).toLocaleString()
                  : selectedProduct.product.price.toLocaleString()}
                {selectedProduct.product.bonus && (
                  <p className="font-thin text-base line-through">
                    $ {selectedProduct.product.price.toLocaleString()}
                  </p>
                )}
              </span>

              {selectedProduct.product.description !== '' && (
                <p className="text-lg font-normal gap-4 flex  flex-col">
                  {selectedProduct.product.description}
                </p>
              )}

              <div className="flex flex-col items-start gap-2 overflow-hidden ">
                <h2 className="font-bold text-base md:text-lg  ">
                  Seller information
                </h2>

                <span className="gap-2">
                  <FontAwesomeIcon icon={faUser} />{' '}
                  {selectedProduct.sellerInfo.name}
                </span>

                <span>
                  <FontAwesomeIcon icon={faEnvelope} />{' '}
                  {selectedProduct.sellerInfo.email}
                </span>
                <span>
                  <FontAwesomeIcon icon={faPhone} />{' '}
                  {selectedProduct.sellerInfo.phone}
                </span>
              </div>

              <div className="flex flex-col items-start gap-3 w-full mt-5">
                <div className="flex flex-col xs:flex-row items-center gap-1 sm:gap-2">
                  <div className="w-1/2 max-w-52 min-w-44 min-h-9 sm:min-h-12 lg:w-1/3 relative truncate flex justify-between items-center p-0 border border-black border-1 cursor-pointer rounded-md">
                    <HiMinusSmall
                      onClick={handleRemove}
                      className="w-12 hover:scale-110 hover:bg-black hover:text-white h-full p-2 transition-colors ease-in-out"
                    />
                    <input
                      value={quantity}
                      onChange={e => {
                        if (Number(e.target.value) > 100) {
                          setQuantity(Number(e.target.value));
                        }
                      }}
                      className="w-12 bg-transparent text-center min-h-9 sm:min-h-12 "
                    />
                    <IoAdd
                      onClick={handleAdd}
                      className="w-12 hover:scale-110 hover:bg-black hover:text-white h-full p-2 transition-colors ease-in-out"
                    />
                  </div>
                  <span className="font-semibold sm:text-base md:text-xl text-main-400 flex items-center gap-1 md:gap-2 min-h-9 sm:min-h-12 px-2 w-min truncate rounded-md">
                    ${' '}
                    {selectedProduct.product.bonus
                      ? (
                          (selectedProduct.product.price -
                            (selectedProduct.product.price *
                              parseInt(selectedProduct.product.bonus)) /
                              100) *
                          quantity
                        ).toLocaleString()
                      : selectedProduct.product.price.toLocaleString()}
                    <span
                      className=" flex items-center gap-1 cursor-pointer font-thin hover:font-light truncate"
                      onClick={toggleWishlist}
                    >
                      {isInWishlist ? (
                        <FaHeart size={34} className="text-main-300" />
                      ) : (
                        <CiHeart
                          size={34}
                          className="text-main-300 hover:scale-125 transition-all ease-in-out"
                        />
                      )}{' '}
                    </span>
                  </span>
                </div>

                <button
                  type={'submit'}
                  onClick={e => {
                    addCart(e);
                  }}
                  className={`rounded-full text-sm sm:text-lg w-full min-h-12 sm:min-h-14 flex items-center gap-2 justify-center bg-main-400 text-main-100 font-medium hover:bg-main-300 hover:shadow-md `}
                >
                  <FaCartPlus size={20} /> Add to cart
                </button>
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col ">
            <div className="mt-20 pb-4 sm:pb-6 w-full bg-main-150 flex justify-between gap-40 ">
              <div className="w-full first-letter:flex min-h-full flex-col p-2 sm:p-6">
                {/* <div className=" gap-2 flex flex-row justify-between w-full">
                  
                </div> */}

                <div className="mt-10 gap-4 flex flex-col md:flex-row justify-between items-start min-h-max min-w-full">
                  <div className=" flex flex-col gap-2 w-full md:w-1/2">
                    <h3 className="font-bold text-base md:text-lg">
                      Reviews & Ratings
                    </h3>
                    <div>
                      <span className="flex flex-row gap-4">
                        <div className="font-bold truncate flex items-center gap-2">
                          {GetStars({
                            rating: reviews ? getAverage(reviews) : 0
                          })}{' '}
                          {reviews ? getAverage(reviews).toFixed(1) : 0}{' '}
                        </div>
                        {reviews ? reviews.length : 0} Reviews{' '}
                      </span>
                    </div>

                    {isAuthenticated && (
                      <div className="flex flex-col gap-2 mt-4  ">
                        <form
                          onSubmit={e => {
                            e.preventDefault();
                            handleAddReview();
                          }}
                          className="flex flex-col w-full lg:w-1/2 p-2 bg-main-100 gap-2 mb-10 items-center"
                        >
                          <ReactStars
                            count={5}
                            onChange={ratingChanged}
                            size={24}
                            isHalf={false}
                            emptyIcon={
                              <i className="far fa-star text-main-200"></i>
                            }
                            halfIcon={<i className="fa fa-star-half-alt"></i>}
                            fullIcon={<i className="fa fa-star text-star"></i>}
                            activeColor="#ffd700"
                          />
                          <div className="w-full gap-2 flex-col flex">
                            <Input
                              type="text"
                              placeholder="Add your review"
                              label=""
                              onChange={handleReviewChange}
                              value={reviewForm.feedback}
                              valid={true}
                            />
                            <Button
                              label="Submit Review"
                              style={ButtonStyle.DARK}
                              disabled={false}
                              loading={false}
                            />
                          </div>
                        </form>
                      </div>
                    )}
                    <div className="w-full flex flex-col gap-3 mt-4 ">
                      {reviews &&
                        Array.isArray(reviews) &&
                        reviews
                          .slice(0, displayedReviews)
                          .map((rev: ReviewInterface, index: number) => (
                            <div
                              className=" w-full mt-2 flex flex-col gap-2"
                              key={index}
                            >
                              <div className="flex flex-col gap-2 ">
                                <div className="flex flex-row gap-2">
                                  <div className="w-12 h-12 truncate rounded-full bg-main-300 text-white ">
                                    {rev.reviewedBy?.photoUrl !== null ? (
                                      <Image
                                        width={100}
                                        height={100}
                                        alt=""
                                        src={rev.reviewedBy?.photoUrl}
                                        className="w-18 h-22 rounded-full"
                                      />
                                    ) : (
                                      <span className="font-semibold text-base md:text-xl w-full p-1 h-full flex items-center justify-center">
                                        {rev.reviewedBy?.name
                                          .toUpperCase()
                                          .slice(0, 1)}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="flex flex-row gap-2 md:gap-4">
                                      <span className="font-bold">
                                        {rev.reviewedBy?.name}
                                      </span>

                                      <span className="text-sm font-light">
                                        {rev.reviewedBy?.email}
                                      </span>
                                    </span>

                                    <span>
                                      {GetStars({ rating: rev.rating || 0 })}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              <span>{rev.feedback}</span>
                              <div className="flex flex-col mr-auto mb-0 w-full items-start font-semibold">
                                <button
                                  onClick={() => {
                                    dispatch(getReply(rev.id));
                                    setExpandedReplies(prevReplies => {
                                      const newReplies = { ...prevReplies };
                                      const isCurrentlyExpanded =
                                        newReplies[rev.id];
                                      Object.keys(newReplies).forEach(key => {
                                        newReplies[key] = false;
                                      });
                                      newReplies[rev.id] = !isCurrentlyExpanded;
                                      return newReplies;
                                    });
                                  }}
                                  className="text-blue-500 text-sm"
                                >
                                  {rev.repliesCount && rev.repliesCount}
                                  {expandedReplies[rev.id]
                                    ? ' Hide Replies'
                                    : ' Replies >'}
                                </button>

                                {expandedReplies[rev.id] && (
                                  <div className="pl-3 pt-4 overflow-hidden bg-main-100 opacity-50 p-2 w-full rounded-md animate__animated animate__fadeInUp animate__faster">
                                    {replies &&
                                      Array.isArray(replies) &&
                                      replies?.map((reply, index) => (
                                        <div
                                          className="w-full flex flex-col gap-1 mb-2"
                                          key={index}
                                        >
                                          <div className="flex flex-row gap-2">
                                            <div className="w-10 h-10 truncate rounded-full bg-main-300 text-white">
                                              {reply.repliedBy.photoUrl ? (
                                                <Image
                                                  width={100}
                                                  height={100}
                                                  alt=""
                                                  src={reply.repliedBy.photoUrl}
                                                  className="w-18 h-22 rounded-full"
                                                />
                                              ) : (
                                                <span className="font-semibold text-lg w-full p-1 h-full flex items-center justify-center">
                                                  {reply.repliedBy?.name
                                                    .toUpperCase()
                                                    .slice(0, 1)}
                                                </span>
                                              )}
                                            </div>
                                            <div className="flex flex-col">
                                              <span className="font-bold">
                                                {reply.repliedBy?.name}
                                              </span>
                                              <span className="text-sm font-light">
                                                {reply.repliedBy?.email}
                                              </span>
                                            </div>
                                          </div>
                                          <span className="font-normal">
                                            {reply.feedback}
                                          </span>
                                        </div>
                                      ))}
                                    {isAuthenticated && (
                                      <form
                                        className="flex flex-col mt-2 font-medium"
                                        onClick={e => {
                                          e.preventDefault();
                                          handleReplySubmit(rev.id);
                                        }}
                                      >
                                        <Input
                                          type="text"
                                          value={newReply[rev.id] || ''}
                                          onChange={e =>
                                            handleReplyChange(e, rev.id)
                                          }
                                          placeholder="Type your reply here..."
                                          valid={true}
                                          label="Reply"
                                        />

                                        <Button
                                          disabled={false}
                                          label="Submit Reply"
                                          loading={false}
                                          style={ButtonStyle.DARK}
                                        />
                                      </form>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                    </div>
                    {reviews && reviews.length > displayedReviews && (
                      <button
                        onClick={handleLoadMore}
                        className="text-blue-500 w-1/4 h-10 border-2 "
                      >
                        View more Review
                      </button>
                    )}
                    {displayedReviews > 5 && (
                      <button
                        onClick={handleLoadLess}
                        className="text-blue-500 w-1/4 h-10 border-2 "
                      >
                        View less Review
                      </button>
                    )}
                  </div>
                  <div className="w-full md:w-1/3 gap-4">
                    <h2 className="font-bold text-base md:text-lg">
                      Related Products
                    </h2>
                    <div className="flex flex-wrap gap-2 w-full mt-4 ">
                      {selectedProduct &&
                        selectedProduct.relatedProducts.map(
                          (product, index) => (
                            <ProductCard product={product} key={index} />
                          )
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* <Suspense
            fallback={<LineLoading title="ali express" bgColor={150} />}
          >
            <AdsListing
              title="Aliexpress"
              bgColor={100}
              section={Section.ADS}
            />
          </Suspense> */}
        </>
      ) : (
        <PageLoading />
      )}
      <ToastContainer />
    </div>
  );
};
export default Details;
