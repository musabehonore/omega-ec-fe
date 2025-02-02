import { configureStore, AnyAction } from '@reduxjs/toolkit';
import MockAdapter from 'axios-mock-adapter';
import productReducer, {
  addProduct,
  getReviews,
  addReview,
  addReply,
  getReply,
  Product,
  AddReviewInterface,
  AddReplyInterface
} from '../redux/slices/itemSlice';
import { ThunkDispatch } from 'redux-thunk';
import { axiosInstance } from '@/utils';

const store = configureStore({
  reducer: {
    product: productReducer
  }
});

type RootState = ReturnType<typeof store.getState>;
type AppDispatch = ThunkDispatch<RootState, unknown, AnyAction>;

describe('itemSlice thunks', () => {
  const mock = new MockAdapter(axiosInstance);

  beforeEach(() => {
    mock.resetHandlers();
    store.dispatch({ type: 'reset' });
  });

  it('should dispatch fulfilled when product is added successfully', async () => {
    const product: Product = {
      name: 'Sample Product',
      price: '100',
      quantity: '10',
      description: 'Sample description',
      categoryId: '2d854884-ea82-468f-9883-c86ce8d5a001',
      images: []
    };

    const response = {
      status: 'Success!',
      data: product,
      message: 'Product added successfully'
    };

    mock.onPost('/products').reply(200, response);

    await (store.dispatch as AppDispatch)(addProduct(product));

    const state = store.getState() as RootState;
    expect(state.product.status).toBe('succeeded');
  });

  it('should dispatch rejected when adding product fails', async () => {
    const product: Product = {
      name: 'Sample Product',
      price: '100',
      quantity: '10',
      description: 'Sample description',
      categoryId: 'category-1',
      images: []
    };

    const errorResponse = {
      message: 'Failed to add product'
    };

    mock.onPost('/products').reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(addProduct(product));

    const state = store.getState() as RootState;
    expect(state.product.status).toBe('failed');
  });

  it('should dispatch fulfilled when reviews are fetched successfully', async () => {
    const reviews = [
      {
        id: 'review-1',
        productId: 'product-1',
        rating: 5,
        feedback: 'Great product!',
        repliedBy: null,
        reviewedBy: {
          name: 'John Doe',
          email: 'john@example.com',
          photoUrl: null
        },
        repliesCount: 0,
        replies: [],
        createdAt: '2023-07-01T00:00:00Z',
        updatedAt: '2023-07-01T00:00:00Z'
      }
    ];

    const response = {
      status: 'Success!',
      data: { allReviews: reviews },
      message: 'Reviews fetched successfully'
    };

    mock.onGet('/reviews?productId=product-1').reply(200, response);

    await (store.dispatch as AppDispatch)(getReviews('product-1'));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
    expect(state.product.reviews).toEqual(reviews);
  });

  it('should dispatch rejected when fetching reviews fails', async () => {
    const errorResponse = {
      message: 'Failed to fetch reviews'
    };

    mock.onGet('/reviews?productId=product-1').reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(getReviews('product-1'));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
    expect(state.product.error).toBe(errorResponse.message);
  });

  it('should dispatch fulfilled when review is added successfully', async () => {
    const review: AddReviewInterface = {
      productId: 'product-1',
      rating: 5,
      feedback: 'Excellent product!'
    };

    const response = {
      status: 'Success!',
      data: review,
      message: 'Review added successfully'
    };

    mock.onPost('/reviews').reply(200, response);

    await (store.dispatch as AppDispatch)(addReview(review));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
  });

  it('should dispatch rejected when adding review fails', async () => {
    const review: AddReviewInterface = {
      productId: 'product-1',
      rating: 5,
      feedback: 'Excellent product!'
    };

    const errorResponse = {
      message: 'Failed to add review'
    };

    mock.onPost('/reviews').reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(addReview(review));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
  });

  it('should dispatch fulfilled when reply is added successfully', async () => {
    const replyData: AddReplyInterface = {
      reviewId: 'review-1',
      feedback: 'Thank you for your feedback!'
    };

    const response = {
      status: 'Success!',
      data: replyData,
      message: 'Reply added successfully'
    };

    mock.onPost(`/reviews/${replyData.reviewId}/replies`).reply(200, response);

    await (store.dispatch as AppDispatch)(addReply(replyData));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
  });

  it('should dispatch rejected when adding reply fails', async () => {
    const replyData: AddReplyInterface = {
      reviewId: 'review-1',
      feedback: 'Thank you for your feedback!'
    };

    const errorResponse = {
      message: 'Failed to add reply'
    };

    mock
      .onPost(`/reviews/${replyData.reviewId}/replies`)
      .reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(addReply(replyData));

    const state = store.getState() as RootState;
    expect(state.product.loadingReviews).toBe(false);
    expect(state.product.error).toBe(errorResponse.message);
  });

  it('should dispatch fulfilled when getting reply successfully', async () => {
    const replyData = {
      reviewId: 'review-1',
      feedback: 'Thank you for your feedback!'
    };

    const response = {
      status: 'Success!',
      data: replyData,
      message: 'Reply fetched successfully'
    };

    mock.onGet(`/reviews/${replyData.reviewId}/replies`).reply(200, response);

    await (store.dispatch as AppDispatch)(getReply(replyData.reviewId));

    const state = store.getState() as RootState;
    expect(state.product.loadingReplies).toBe(false);
    expect(state.product.replies).toEqual(response.data);
  });

  it('should dispatch rejected when getting reply fails', async () => {
    const replyData = {
      reviewId: 'review-1',
      feedback: 'Thank you for your feedback!'
    };

    const errorResponse = {
      message: 'Failed to fetch reply'
    };

    mock
      .onGet(`/reviews/${replyData.reviewId}/replies`)
      .reply(400, errorResponse);

    await (store.dispatch as AppDispatch)(getReply(replyData.reviewId));

    const state = store.getState() as RootState;
    expect(state.product.loadingReplies).toBe(false);
    expect(state.product.error).toBe(errorResponse.message);
  });
});
