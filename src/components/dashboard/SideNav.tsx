'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { FiHome, FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { MdOutlineManageAccounts } from 'react-icons/md';
import { FcStatistics } from 'react-icons/fc';
import { AiOutlineProduct } from 'react-icons/ai';
import { RiAccountCircleLine, RiLogoutBoxRLine } from 'react-icons/ri';
import { IoIosHelpCircleOutline } from 'react-icons/io';
import { IoCalendarNumberOutline } from 'react-icons/io5';
import { useRouter, usePathname } from 'next/navigation';
import { FaHeart, FaUserPlus } from 'react-icons/fa';
import { BsCart3 } from 'react-icons/bs';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';
import useLogout from '@/app/(Authentication)/logout/page';
import { jwtDecode } from 'jwt-decode';
import {
  DecodedInterface,
  updateUserRole,
  USER_ROLE
} from '@/redux/slices/userSlice';

type SidebarButtonProps = {
  paths: string[];
  icon?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
};

interface SideNavProps1 {
  className?: string;
}

const SidebarButton: React.FC<SidebarButtonProps> = ({
  paths,
  icon,
  children,
  className,
  onClick
}) => {
  const router = useRouter();
  const pathname = usePathname();

  const isActive = paths.includes(pathname);

  const handleClick = () => {
    if (paths.length > 0) {
      router.push(paths[0]);
    }
    if (onClick) {
      onClick();
    }
  };

  return (
    <div
      onClick={handleClick}
      className={`flex cursor-pointer items-center gap-2 ml-[-10px] p-2 ${
        isActive
          ? 'bg-[#40586A] text-white rounded'
          : 'text-black hover:bg-[#40586A]/50 hover:text-white hover:rounded active:bg-[#40586A]/70 transition duration-200 ease-in-out'
      }`}
    >
      {icon}
      {children}
    </div>
  );
};

const SideNav: React.FC<SideNavProps1> = ({ className }) => {
  type DropdownKeys = 'products' | 'settings' | 'roles';

  const dispatch = useAppDispatch();

  useEffect(() => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const tokenData = JSON.parse(tokenString);
      const decoded = tokenData
        ? (jwtDecode(tokenData) as DecodedInterface)
        : null;

      if (decoded && decoded.role === USER_ROLE.ADMIN) {
        dispatch(updateUserRole(USER_ROLE.ADMIN));
      }
    }
  }, [dispatch]);

  const { role } = useAppSelector((state: RootState) => state.user);
  const { userRole } = useAppSelector((state: RootState) => state.otp);

  const [isDropdownOpen, setIsDropdownOpen] = useState<
    Record<DropdownKeys, boolean>
  >({
    products: false,
    settings: false,
    roles: false
  });

  const [loggedInRole, setLoggedInRole] = useState<string | null>(null);
  const logout = useLogout();

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

  const toggleDropdown = (dropdown: DropdownKeys) => {
    setIsDropdownOpen(prevState => ({
      ...prevState,
      [dropdown]: !prevState[dropdown]
    }));
  };

  if (!loggedInRole) {
    return null;
  }

  return (
    <div
      className={`bg-[#a5c9ca] h-full p-5 fixed sm:relative md:relative overflow-x-auto shadow-md ${className}`}
    >
      <div>
        <Link href="/">
          <h1 className="text-2xl font-bold text-[#32475C]">alpha-team</h1>
        </Link>
      </div>
      <nav className="space-y-4 pl-[-38px] text-black z-99">
        <div>
          <SidebarButton paths={['/dashboard']}>
            <FiHome className="text-2xl" />
            <p>Dashboard</p>
          </SidebarButton>
        </div>

        <div className="mt-6">
          <h2 className="text-xl font-semibold">Activities</h2>
          {loggedInRole === 'buyer' && (
            <>
              <SidebarButton paths={['/dashboard/cart']}>
                <BsCart3 className="text-xl" />
                <p className="text-nowrap">Cart</p>
              </SidebarButton>
              <SidebarButton paths={['/dashboard/wishlist']}>
                <FaHeart className="text-xl" />
                <p className="text-nowrap">Wishlist</p>
              </SidebarButton>
              <SidebarButton paths={['/dashboard/orders']}>
                <RiAccountCircleLine className="text-xl" />
                <p className="text-nowrap">Orders</p>
              </SidebarButton>
              <SidebarButton paths={['/products']}>
                <AiOutlineProduct className="text-xl" />
                <p className="text-nowrap">Products</p>
              </SidebarButton>
            </>
          )}
          {loggedInRole === 'seller' && (
            <>
              <SidebarButton paths={['/dashboard/statistics']}>
                <FcStatistics className="text-xl" />
                <p className="text-nowrap">Statistics</p>
              </SidebarButton>
              <SidebarButton paths={['/dashboard/wishlist']}>
                <FaHeart className="text-xl" />
                <p className="text-nowrap">Wishlist</p>
              </SidebarButton>
              <SidebarButton paths={['/dashboard/orders']}>
                <RiAccountCircleLine className="text-xl" />
                <p className="text-nowrap">Orders</p>
              </SidebarButton>
              <div className="relative">
                <SidebarButton
                  paths={[]}
                  onClick={() => toggleDropdown('products')}
                >
                  <AiOutlineProduct className="text-xl" />
                  <p className="text-nowrap">Products</p>
                  {isDropdownOpen.products ? (
                    <FiChevronUp className="ml-1" />
                  ) : (
                    <FiChevronDown className="ml-1" />
                  )}
                </SidebarButton>
                {isDropdownOpen.products && (
                  <div className="ml-4 mt-2 flex flex-col space-y-0">
                    <SidebarButton paths={['/dashboard/add-items']}>
                      <p>Add Product</p>
                    </SidebarButton>
                    <SidebarButton paths={['/dashboard/products']}>
                      <p>View Products</p>
                    </SidebarButton>
                  </div>
                )}
              </div>
            </>
          )}
          {loggedInRole === 'admin' && (
            <>
              <SidebarButton paths={['/dashboard/users']}>
                <RiAccountCircleLine className="text-xl" />
                <p className="text-nowrap">Users</p>
              </SidebarButton>
            </>
          )}
        </div>
        <div>
          <h2 className="text-xl font-semibold">More Info</h2>
          <div className="relative">
            <SidebarButton
              paths={[]}
              onClick={() => toggleDropdown('settings')}
            >
              <MdOutlineManageAccounts className="text-2xl" />
              <p>Setting</p>
              {isDropdownOpen.settings ? (
                <FiChevronUp className="ml-1" />
              ) : (
                <FiChevronDown className="ml-1" />
              )}
            </SidebarButton>
            {isDropdownOpen.settings && (
              <div className="ml-4 mt-2 flex flex-col space-y-0">
                <SidebarButton paths={['/dashboard/profile']}>
                  <p>Profile</p>
                </SidebarButton>
                <SidebarButton paths={['/dashboard/update-password']}>
                  <p>Update Password</p>
                </SidebarButton>
              </div>
            )}
          </div>
          <SidebarButton paths={[]} onClick={logout}>
            <RiLogoutBoxRLine className="text-xl" />
            <p className="text-nowrap">Logout</p>
          </SidebarButton>
        </div>
      </nav>
    </div>
  );
};

export default SideNav;
