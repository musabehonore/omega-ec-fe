'use client';
import React, { useState, useEffect } from 'react';
import { FiSearch } from 'react-icons/fi';
import { CiBrightnessDown } from 'react-icons/ci';
import { IoIosNotificationsOutline } from 'react-icons/io';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  fetchNotifications,
  markAllNotificationsAsRead
} from '@/redux/slices/notificationSlice';
import { BiMenuAltLeft } from 'react-icons/bi';
import Image from 'next/image';
import useSocket from '@/utils/useSocket';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';
import { DecodedInterface } from '@/redux/slices/userSlice';
import { formatDate } from '@/utils/formatDate';
import Link from 'next/link';
import { ReadMore } from './ReadMore';
import defaultImage from '@/assets/images/defaultProfileImage.png';
import SideNav from './SideNav';

const TopNav = () => {
  const dispatch = useAppDispatch();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { data } = useAppSelector(state => state.notifications);
  const { profile } = useAppSelector(state => state.profile);
  const [decoded, setDecoded] = useState<DecodedInterface | null>(null);
  const notifications = data?.data;
  const currentNotifications = notifications
    ?.filter(nots => !nots.isRead)
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

  useEffect(() => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const tokenData = JSON.parse(tokenString);
      const decodedToken = tokenData
        ? (jwtDecode(tokenData) as DecodedInterface)
        : null;
      setDecoded(decodedToken);
    }
  }, [dispatch]);

  const userId: any = decoded?.id;
  useSocket(userId);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const handleMarkAsAll = () => {
    dispatch(markAllNotificationsAsRead());
  };

  const handleNotificationClick = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
  };

  const handleViewAllClick = () => {
    setIsNotificationsOpen(false);
  };
  const numberOfUnreadNotifications =
    notifications?.filter(nots => !nots.isRead)?.length || 0;
  return (
    <div>
      <div className="flex justify-between items-center bg-[#A5C9CA] py-1 px-5 sm:mx-8 md:mx-8 lg:mx-8 mx-2 my-2 rounded-md shadow-md">
        <div className="flex align-middle">
          <BiMenuAltLeft
            className="text-2xl text-[#32475C] sm:hidden lg:hidden xl:hidden cursor-pointer"
            onClick={toggleSidebar}
          />
          <div className="w-full h-full"></div>
        </div>
        <div className="flex items-center space-x-4">
          <button
            className="text-lg cursor-pointer"
            onClick={handleNotificationClick}
          >
            <IoIosNotificationsOutline className="text-4xl text-black py-1 cursor-pointer" />
            <p className="text-xs font-extrabold absolute transform translate-y-[-15px] translate-x-[25px]">
              {numberOfUnreadNotifications}
            </p>
          </button>
          <Image
            src={profile?.data?.photoUrl || defaultImage}
            alt="Profile"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full cursor-pointer"
          />
        </div>
      </div>
      {isNotificationsOpen && (
        <>
          <div className="absolute top-20 right-5 bg-main-100 shadow-lg rounded-md p-4 w-80 transition-all duration-300 overflow-auto max-h-96 z-50">
            <p className="p-3 text-gray-500 text-blue font-bold">
              Unread notifications({numberOfUnreadNotifications}):
            </p>
            {numberOfUnreadNotifications && numberOfUnreadNotifications > 0 ? (
              <>
                {currentNotifications?.map((nots, index) => (
                  <div
                    key={index}
                    className="mb-2 p-3 border-b last:border-b-0 hover:bg-gray-100"
                  >
                    <h1 className="text-sm font-semibold pb-1">
                      TITLE:
                      {nots.event === 'PRODUCT_WISHLIST_UPDATE' ? (
                        <>WISHLIST UPDATED</>
                      ) : nots.event === 'PAYMENT_COMPLETED' ? (
                        <>PAYMENT COMPLETED</>
                      ) : nots.event === 'ORDER_STATUS' ? (
                        <>ORDER STATUS UPDATED</>
                      ) : nots.event === 'STOCK_LEVEL_REACH_ZERO' ? (
                        <>STOCK LEVEL REACH ZERO</>
                      ) : (
                        ''
                      )}
                    </h1>
                    <p className="text-sm">
                      <ReadMore message={nots.message} id={nots.id} />
                    </p>
                    <p className="text-xs text-gray-500 pt-2">
                      Received:
                      <strong>{formatDate(nots.createdAt)}</strong>
                    </p>
                  </div>
                ))}
                <div className="flex justify-between bg-white bottom-[-25px] p-4 sticky left-0 right-0 w-full">
                  <Link
                    href="../../../dashboard/notifications"
                    className="text-xs text-blue font-bold"
                    onClick={handleViewAllClick}
                  >
                    View All
                  </Link>
                  <Link
                    href=""
                    className="text-xs text-blue font-bold"
                    onClick={handleMarkAsAll}
                  >
                    Mark all as read
                  </Link>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-left">
                <Link
                  href="../../../dashboard/notifications"
                  className="text-xs p-3 text-gray-500 text-blue font-bold mt-2"
                  onClick={handleViewAllClick}
                >
                  View All
                </Link>
              </div>
            )}
          </div>
          <div
            className={`${
              isNotificationsOpen
                ? 'fixed inset-0 bg-black opacity-50 z-40'
                : 'hidden'
            }`}
            onClick={handleNotificationClick}
          />
        </>
      )}
      <div className="w-[430px]">{isSidebarOpen && <SideNav />}</div>
    </div>
  );
};

export default TopNav;
