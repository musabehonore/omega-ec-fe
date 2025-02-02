'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  fetchAllUsers,
  disableAccount,
  assignRole
} from '@/redux/slices/disableaccount';
import Image from 'next/image';
import unKnownImage from '@/assets/images/unknown.png';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import Pagination from '@/components/pagination/Pagination';
import ReasonModal from './ReasonModal';
import ToggleSwitch from './ToggleSwitch';
import Select, { SingleValue } from 'react-select';

interface EmptyDataType {
  message: string;
}

const EmptyData: React.FC<EmptyDataType> = ({ message }) => {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="bg-main-200 rounded-lg shadow-lg p-6 text-center">
        <p className="text-black text-lg">{message}</p>
      </div>
    </div>
  );
};
const Users: React.FC = () => {
  const dispatch = useAppDispatch();
  const [toggles, setToggles] = useState<{ [key: string]: boolean }>({});
  const [filter, setFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 3;
  const { users, message, success, error } = useAppSelector(
    state => state.registereUsers
  );
  const [showModal, setShowModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const { showSuccess, showError } = useToast();

  useEffect(() => {
    dispatch(fetchAllUsers());
  }, [dispatch]);

  useEffect(() => {
    if (users?.data) {
      const initialToggles = users.data.reduce(
        (acc: { [key: string]: boolean }, user: any) => {
          acc[user.id] = user.status === false;
          return acc;
        },
        {}
      );
      setToggles(initialToggles);
    }
  }, [users]);

  useEffect(() => {
    if (success && message === 'Status has been updated to SUSPENDED') {
      const updatedToggles = { ...toggles };
      Object.keys(updatedToggles).forEach(userId => {
        if (users?.data.find(user => user.id === userId)?.status === false) {
          updatedToggles[userId] = true;
        }
      });
      setToggles(updatedToggles);
    }
  }, [message, success, toggles, users]);

  const handleToggleChange = async (userId: string) => {
    if (!toggles[userId]) {
      setCurrentUserId(userId);
      setShowModal(true);
    } else {
      const previousState = toggles[userId];
      setToggles(prevToggles => ({
        ...prevToggles,
        [userId]: !prevToggles[userId]
      }));
      const result = await handleDisableAccount(userId, '');
      if (!result) {
        setToggles(prevToggles => ({
          ...prevToggles,
          [userId]: previousState
        }));
      } else {
        dispatch(fetchAllUsers());
      }
    }
  };
  const handleDisableAccount = async (userId: string, reason: string) => {
    try {
      const reasons = [reason];
      const result = await dispatch(disableAccount({ userId, reasons }));
      const showMessage = (result.payload as any).message;
      if (result.meta.requestStatus === 'fulfilled') {
        showSuccess(showMessage);
        return result;
      } else if (result.meta.requestStatus === 'rejected') {
        showError(showMessage);
      }
    } catch (error) {
      return null;
    }
  };

  const handleConfirmReason = (reason: string) => {
    if (currentUserId) {
      setToggles(prevToggles => ({
        ...prevToggles,
        [currentUserId]: !prevToggles[currentUserId]
      }));
      handleDisableAccount(currentUserId, reason);
    }
    setCurrentUserId(null);
  };

  const handleFilterChange = (filter: 'all' | 'active' | 'inactive') => {
    setFilter(filter);
    setCurrentPage(1);
  };

  const filteredUsers = users?.data.filter((user: any) => {
    if (filter === 'active') return user.status === true;
    if (filter === 'inactive') return user.status === false;
    if (filter === 'all') return true;
    return true;
  });

  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers?.slice(indexOfFirstUser, indexOfLastUser);
  const totalpages = () => {
    if (filteredUsers) {
      return Math.ceil(filteredUsers?.length / usersPerPage);
    }
  };

  const totalPages = totalpages() || 0;
  const totalItems = filteredUsers?.length || 0;

  const activeCount =
    users?.data.filter((user: any) => user.status === true).length || 0;
  const inactiveCount =
    users?.data.filter((user: any) => user.status === false).length || 0;
  const allUsers = users?.data.length || 0;

  const roleOptions = [
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0852', label: 'Buyer' },
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0851', label: 'Seller' },
    { value: 'd290f1ee-6c54-4b01-90e6-d701748f0853', label: 'Admin' }
  ];

  const mapRoleIdToRole = (roleId: string) => {
    const role = roleOptions.find(option => option.value === roleId);
    return role ? role.label : 'Buyer';
  };

  const handleRoleChange = async (
    userId: string,
    option: SingleValue<{ value: string; label: string }>
  ) => {
    if (option) {
      await dispatch(assignRole({ userId, roleId: option.value }));
      if (success) {
        showSuccess(
          `${mapRoleIdToRole(option.value)} role assigned successfully ` ||
            'Role assigned successfully'
        );
      } else if (error) {
        showError(error || 'Assigning role failed');
      }
    }
  };

  return (
    <>
      <div className=" w-full sm:p-0  p-3 h-[100%] sm:h-4/6 lg:w-full md:w-full">
        <div className="flex flex-col justify-start sm:flex-row sm:gap-3 sm:items-baseline items-center text-xs sm:text-lg mb-4">
          <button
            onClick={() => handleFilterChange('all')}
            className={`p-3 ${filter === 'inactive' ? 'border border-main-200' : 'border border-main-200'} text-black rounded sm:h-fit sm:w-fit  flex gap-1 active:opacity-10`}
          >
            <span className="bg-main-200 text-black text-sm px-2 py-0.5 font-extrabold">
              {allUsers}
            </span>
            <span>all</span>
          </button>
          <button
            onClick={() => handleFilterChange('active')}
            className={`p-3 ${filter === 'active' ? 'bg-main-200' : 'bg-main-200'} text-black rounded h-fit w-fit flex gap-1 active:opacity-10 sm:mb-0 mb-4`}
          >
            <span className="bg-main-300 text-white text-sm px-2 py-0.5">
              {activeCount}
            </span>
            <span>Active</span>
          </button>
          <button
            onClick={() => handleFilterChange('inactive')}
            className={`p-3 ${filter === 'inactive' ? 'border border-main-200' : 'border border-main-200'} text-black rounded sm:h-fit sm:w-fit  flex gap-1 active:opacity-10`}
          >
            <span className="bg-main-200 text-black text-sm px-2 py-0.5 font-extrabold">
              {inactiveCount}
            </span>
            <span>Inactive</span>
          </button>
        </div>
        <div className="min-h-[460px]">
          <div className="hidden sm:flex sm: flex-wrap px-4 justify-between p-5 text-black bg-main-100 rounded-lg font-medium md:flex md:flex-wrap">
            <p className="w-1/12 text-left">Picture</p>
            <p className="w-3/12 text-left">Name/Email</p>
            <p className="w-2/12 text-left">Gender</p>
            <p className="w-2/12 text-left">Date of Birth</p>
            <p className="w-2/12 text-left">Status</p>
            <p className="w-2/12 text-left">Role</p>
          </div>
          {currentUsers?.map((user: any) => (
            <div
              key={user.id}
              className="sm:flex sm:justify-between sm:flex-wrap sm:text-lg text-xs items-center p-2 lg:p-4 bg-main-100 my-2 rounded-lg text-main-300 font-medium"
            >
              <div className="w-full sm:w-1/12 flex justify-center sm:justify-start items-center mb-3 sm:mb-0">
                <Image
                  src={user.photoUrl || unKnownImage}
                  alt={user.name}
                  width={40}
                  height={40}
                  className="rounded-full w-10 h-10 m-auto"
                />
              </div>
              <div className="sm:w-3/12 w-12/12 sm:text-left text-center mb-3 sm:mb-0">
                <p className="mb-3 sm:mb-0">{user.name}</p>
                <p className="text-black font-normal text-sm">{user.email}</p>
              </div>
              <p className="sm:w-2/12 sm:text-left w-12/12 text-center mb-3 sm:mb-0">
                {user.gender || 'Missing'}
              </p>
              <p className="sm:w-2/12 sm:text-left w-12/12 text-center">
                {user.birthdate || 'Missing'}
              </p>
              <div className="sm:w-2/12 w-full flex justify-center sm:justify-start items-center mt-2 sm:mt-0">
                <ToggleSwitch
                  onChange={() => handleToggleChange(user.id)}
                  value={toggles[user.id]}
                />
              </div>
              <div className="sm:w-2/12 w-full flex justify-center sm:justify-start items-center mt-2 sm:mt-0">
                <Select
                  options={roleOptions}
                  onChange={option => handleRoleChange(user.id, option)}
                  placeholder={mapRoleIdToRole(user.roleId)}
                ></Select>
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center inset-x-0 pb-4">
          {totalPages > 1 && (
            <Pagination
              totalItems={totalItems}
              itemsPerPage={usersPerPage}
              currentPage={currentPage}
              onPageChange={(page: number) => setCurrentPage(page)}
            />
          )}
        </div>
      </div>
      {showModal && (
        <ReasonModal
          onClose={() => setShowModal(false)}
          onConfirm={handleConfirmReason}
        />
      )}
      <ToastContainer />
    </>
  );
};

export default Users;
