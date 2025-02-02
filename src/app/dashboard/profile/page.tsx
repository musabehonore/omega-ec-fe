'use client';
import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { fetchProfile } from '@/redux/slices/profileSlice';
import { RootState } from '@/redux/store';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import Link from 'next/link';
import Image from 'next/image';
import defaultImage from '@/assets/images/defaultProfileImage.png';

const ProfileView: React.FC = () => {
  const dispatch = useAppDispatch();
  const { loading, profile, status } = useAppSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {}, [status, profile]);

  if (status === 'loading') {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2  border-gray text-[22px]">
        Loading...
      </div>
    );
  }

  if (status === 'failed') {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2  border-gray text-[22px]">
        Failed to load profile data.
      </div>
    );
  }

  if (!profile) {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2  border-gray text-[22px]">
        No profile data available.
      </div>
    );
  }
  if (!profile.data) {
    return (
      <div className=" flex justify-center items-center w-full h-full text-grayborder-b-2  border-gray text-[22px]">
        Unauthorized
      </div>
    );
  }

  // eslint-disable-next-line prettier/prettier
  const {
    email,
    name,
    phone,
    address,
    photoUrl,
    googleId,
    gender,
    birthdate,
    preferedcurrency,
    preferedlanguage
  } =
    // eslint-disable-next-line prettier/prettier
    profile.data;

  return (
    <div>
      <div className="w-full flex align-middle ">
        <div className="flex font-extrabold text-main-400 text-3xl md:text-4xl lg:text-4xl mb-4 mx-auto">
          My Profile
        </div>
      </div>
      <div className=" flex md:flex lg:flex flex-col md:flex-row lg:flex-row w-full align-middle ">
        <div className=" flex w-full mt-[-80px] md:mt-[0px] lg:mt-[0px] md:w-[30%] lg:w-[30%] align-middle">
          <div className=" mx-auto mt-[25%] w-[180px] rounded-full ">
            <Image
              className=" w-full object-cover rounded-full"
              src={photoUrl || defaultImage}
              alt="profile image"
              width={180}
              height={180}
            />
          </div>
        </div>

        <div className=" w-full md:w-2/3 lg:w-2/3 px-4 md:px-0 lg:px-0 flex flex-col align-middle animate__animated animate__backInLeft ">
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={name}
              label="Name"
              placeholder="Name"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={email}
              label="Email"
              placeholder="Email"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={address}
              label="Address"
              placeholder="Address"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={phone}
              label="Phone"
              placeholder="Phone"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={gender ? gender : ''}
              label="Gender"
              placeholder="Gender"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="date"
              value={birthdate ? birthdate : ''}
              label="Birthdate"
              placeholder="Birthdate"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={preferedcurrency ? preferedcurrency : ''}
              label="Prefered Currency"
              placeholder="Prefered Currency"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={preferedlanguage ? preferedlanguage : ''}
              label="Prefered Language"
              placeholder="Prefered Language"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="text"
              value={googleId ? googleId : ''}
              label="GoogleId"
              placeholder="GoogleId"
              valid={true}
              onChange={() => {}}
              readOnly
            />
          </div>
          <Link className="m-4" href="/dashboard/profile-edit">
            <Button
              label="Edit"
              style={ButtonStyle.DARK}
              disabled={loading}
              loading={loading}
            />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ProfileView;
