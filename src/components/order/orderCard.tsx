'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import useToast from '@/components/alerts/Alerts';
import { toast, ToastContainer } from 'react-toastify';
import { updateProductOrderStatus } from '@/redux/slices/updateorderstatusSlice';

interface OrderCardProps {
  order: {
    id: string;
    orderBuyer: {
      name: string;
      photoUrl: string | null;
    };
    orderedProduct: {
      images: string[];
      name: string;
      price: number;
    };
    quantity: number;
    status: string;
    createdAt: string;
    updatedAt: string;
  };
}

export interface updateData {
  orderId: string;
  newStatus: string;
}

interface StatusUpdateModalProps {
  orderId: string;
  currentStatus: string;
  onClose: () => void;
  onUpdate: (newStatus: string) => void;
  quantity: number;
  productImage: string;
  productName: string;
}

const StatusUpdateModal: React.FC<StatusUpdateModalProps> = ({
  orderId,
  currentStatus,
  onClose,
  onUpdate,
  quantity,
  productImage,
  productName
}) => {
  const [newStatus, setNewStatus] = useState(currentStatus);
  const { showSuccess, showError } = useToast();
  const dispatch = useAppDispatch();
  const { loading, success, error } = useAppSelector(
    (state: RootState) => state.updateorderstatus
  );

  const handleUpdate = () => {
    dispatch(updateProductOrderStatus({ orderId, newStatus }))
      .then(response => {
        if (response.payload) {
          onUpdate(newStatus);
          onClose();
        }
      })
      .catch(error => {
        console.error('Error updating status:', error);
        onUpdate(currentStatus);
        toast.error('Error updating status');
      });
  };

  if (success) {
    showSuccess('Status updated successfully!');
  } else if (error) {
    showError(`Updating status failed!`);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-4 rounded-lg w-80">
        <h2 className="text-lg font-extrabold mb-4 text-center px-5">
          Update Status
        </h2>
        <img
          src={productImage}
          alt={productName}
          className="w-60 h-40 mb-4 ml-3 rounded"
        />
        <p className="text-lg text-center px-5 font-bold uppercase mb-4">
          {productName}
        </p>
        <p className="text-lg text-center  px-5 font-bold  mb-4">
          Qty:🛒 {quantity}
        </p>
        <select
          value={newStatus}
          onChange={e => setNewStatus(e.target.value)}
          className="mb-4 p-2 border rounded w-full"
        >
          <option
            className="bg-yellow-200 font-semibold text-center px-4 py-2"
            value="pending"
          >
            Pending
          </option>
          <option
            className="bg-green-200 font-semibold text-center px-4 py-2"
            value="accepted"
          >
            Accepted
          </option>
          <option
            className="bg-red-300 font-semibold text-center px-4 py-2"
            value="rejected"
          >
            Rejected
          </option>
        </select>
        <div className="flex justify-end px-4 gap-9">
          <button
            onClick={handleUpdate}
            className="px-4 py-2 bg-blue-500 text-white   bg-slate-800 rounded"
            disabled={loading}
          >
            Update
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 text-white bg-red-600 rounded"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
const OrderCard: React.FC<OrderCardProps> = ({ order }) => {
  const { id, orderBuyer, orderedProduct, quantity, status } = order;
  const productImage = orderedProduct.images[0];

  const { role } = useAppSelector((state: RootState) => state.user);
  const { userRole } = useAppSelector((state: RootState) => state.otp);
  const loggedIn = userRole || role || 'buyer';

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [orderStatus, setOrderStatus] = useState(status);

  const [loggedInRole, setLoggedInRole] = useState<string | null>(null);

  useEffect(() => {
    const storedRole = localStorage.getItem('userRole');
    if (storedRole) {
      setLoggedInRole(storedRole);
    } else if (userRole || role) {
      const roleToStore = userRole || role;
      if (roleToStore) {
        setLoggedInRole(roleToStore);
        localStorage.setItem('userRole', roleToStore);
      }
    } else {
      setLoggedInRole('buyer');
    }
  }, [role, userRole]);

  const handleCardClick = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleUpdateStatus = (newStatus: string) => {
    setOrderStatus(newStatus);
  };

  return (
    <div>
      {loggedInRole === 'seller' && (
        <div
          className="order-card border min-w-3 rounded-lg p-4 m-[4px]"
          onClick={handleCardClick}
        >
          <div className="order-header flex justify-between gap-2">
            <span className="order-id font-normal text-[10px] uppercase">
              Order ID # {id.slice(0, 5)}
            </span>
            <span
              className={`order-status cursor-pointer ${
                orderStatus.trim() === 'accepted'
                  ? 'bg-green-200'
                  : orderStatus.trim() === 'pending'
                    ? 'bg-yellow-200'
                    : orderStatus.trim() === 'rejected'
                      ? 'bg-red-300 '
                      : ''
              } px-2 rounded`}
            >
              {orderStatus.trim()}
            </span>
          </div>
          <div className="order-content flex items-center mt-4 sm:gap-3 md:gap-3">
            <img
              width={150}
              height={180}
              src={productImage}
              alt={orderedProduct.name}
              className="w-20 h-20 mr-4"
            />
            <div className="order-details">
              <h2 className="font-bold truncate">{orderedProduct.name}</h2>
              <p>Price: ${orderedProduct.price}</p>
              <p>Quantity: {quantity}</p>
              <p className="text-sm">Name: {orderBuyer.name}</p>
            </div>
          </div>
        </div>
      )}
      {loggedInRole === 'admin' && (
        <div
          className="order-card border rounded-lg p-4 m-[4px] "
          onClick={handleCardClick}
        >
          <div className="order-header flex justify-between gap-2">
            <span className="order-id font-normal text-[10px] uppercase">
              Order ID # {id.slice(0, 5)}
            </span>
            <span
              className={`order-status ${
                orderStatus.trim() === 'accepted'
                  ? 'bg-green-200'
                  : orderStatus.trim() === 'pending'
                    ? 'bg-yellow-200'
                    : orderStatus.trim() === 'rejected'
                      ? 'bg-red-300 '
                      : ''
              } px-2 rounded`}
            >
              {orderStatus.trim()}
            </span>
          </div>
          <div className="order-content flex items-center mt-4 sm:gap-3 md:gap-3">
            <img
              width={150}
              height={180}
              src={productImage}
              alt={orderedProduct.name}
              className="w-20 h-20 mr-4"
            />
            <div className="order-details">
              <h2 className="font-bold truncate">{orderedProduct.name}</h2>
              <p>Price: ${orderedProduct.price}</p>
              <p>Quantity: {quantity}</p>
              <p className="text-sm">Buyer: {orderBuyer.name}</p>
            </div>
          </div>
        </div>
      )}
      {loggedInRole === 'buyer' && (
        <div className="order-card border rounded-lg p-4 m-[4px]">
          <div className="order-header flex justify-between gap-2">
            <span className="order-id font-normal text-[10px] uppercase">
              Order ID # {id.slice(0, 5)}
            </span>
            <span
              className={`order-status ${
                orderStatus.trim() === 'accepted'
                  ? 'bg-green-200'
                  : orderStatus.trim() === 'pending'
                    ? 'bg-yellow-200'
                    : orderStatus.trim() === 'rejected'
                      ? 'bg-red-300 '
                      : ''
              } px-2 rounded`}
            >
              {orderStatus.trim()}
            </span>
          </div>
          <div className="order-content flex items-center mt-4 sm:gap-3 md:gap-3">
            <img
              width={150}
              height={180}
              src={productImage}
              alt={orderedProduct.name}
              className="w-20 h-20 mr-4"
            />
            <div className="order-details">
              <h2 className="font-bold truncate">{orderedProduct.name}</h2>
              <p>Price: ${orderedProduct.price}</p>
              <p>Quantity: {quantity}</p>
              <p className="text-sm">Buyer: {orderBuyer.name}</p>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <StatusUpdateModal
          orderId={id}
          currentStatus={orderStatus}
          onClose={handleCloseModal}
          onUpdate={handleUpdateStatus}
          quantity={quantity}
          productImage={productImage}
          productName={orderedProduct.name}
        />
      )}
      {/* <ToastContainer /> */}
    </div>
  );
};

export default OrderCard;
