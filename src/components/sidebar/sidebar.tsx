import React from 'react';
import {
  FaChartBar,
  FaHeart,
  FaShoppingCart,
  FaSignOutAlt,
  FaTachometerAlt,
  FaUserCog,
  FaUserPlus
} from 'react-icons/fa';

const Sidebar: React.FC = () => {
  return (
    <div className="w-1/5 bg-[#A5C9CA] p-4">
      <div className="text-xl font-bold mb-4">alpha-team</div>
      <ul>
        <SidebarLink icon={<FaTachometerAlt />} href="/" label="Dashboard" />
        <SidebarLink
          icon={<FaUserCog />}
          href="/account-settings"
          label="Account Settings"
        />
        <SidebarLink icon={<FaSignOutAlt />} href="/logout" label="Logout" />
        <SidebarLink
          icon={<FaUserPlus />}
          href="/assignrole"
          label="Assign Role"
        />
        <SidebarLink
          icon={<FaChartBar />}
          href="/statistics"
          label="Statistics"
        />
        <SidebarLink icon={<FaHeart />} href="/wishlist" label="Wish List" />
        <SidebarLink icon={<FaShoppingCart />} href="/order" label="Order" />
      </ul>
    </div>
  );
};

interface SidebarLinkProps {
  icon: React.ReactNode;
  href: string;
  label: string;
}

const SidebarLink: React.FC<SidebarLinkProps> = ({ icon, href, label }) => {
  return (
    <li className="mb-2">
      <a
        href={href}
        className="flex items-center text-black hover:text-gray-900"
      >
        {icon && <span className="mr-2">{icon}</span>}
        <span className="ml-2">{label}</span>
      </a>
    </li>
  );
};

export default Sidebar;
