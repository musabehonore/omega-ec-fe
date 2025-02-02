'use client';
import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import {
  fetchProfile,
  updateProfile,
  ProfileFormData
} from '@/redux/slices/profileSlice';
import { RootState } from '@/redux/store';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import useToast from '@/components/alerts/Alerts';
import { useRouter } from 'next/navigation';
import { FormErrorInterface } from '@/utils';
import { ToastContainer } from 'react-toastify';
import Image from 'next/image';
import defaultImage from '@/assets/images/defaultProfileImage.png';

const today = new Date().toISOString().split('T')[0] as unknown as number;

const formatDate = (dateString: string | null) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const ProfileEdit: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, profile } = useAppSelector(
    (state: RootState) => state.profile
  );
  const { showSuccess, showError } = useToast();

  const [imagePreview, setImagePreview] = useState<string | undefined>(
    undefined
  );

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    birthdate: '',
    gender: '',
    address: '',
    preferedcurrency: '',
    preferedlanguage: '',
    image: undefined
  });

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  useEffect(() => {
    if (profile && profile.data) {
      setFormData({
        name: profile.data.name || '',
        email: profile.data.email || '',
        phone: profile.data.phone || '',
        birthdate: formatDate(profile.data.birthdate),
        gender: profile.data.gender || '',
        address: profile.data.address || '',
        preferedcurrency: profile.data.preferedcurrency || '',
        preferedlanguage: profile.data.preferedlanguage || '',
        image: undefined
      });
    }
  }, [profile]);

  const handleChange = (key: string, value: string | File) => {
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      return updatedFormData;
    });
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const file: File = e.target.files[0];
      handleChange('image', file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const profileData = {
      ...formData
    };
    const formData2 = new FormData();
    for (const key in profileData) {
      if (
        profileData[key as keyof ProfileFormData] !== undefined &&
        profileData[key as keyof ProfileFormData] !== null
      ) {
        formData2.append(
          key,
          profileData[key as keyof ProfileFormData] as Blob | string
        );
      }
    }

    const result = await dispatch(updateProfile(formData2));

    if (updateProfile.fulfilled.match(result)) {
      showSuccess('Profile updated successfully!');
      setTimeout(() => {
        router.push('/dashboard/profile');
      }, 2000);
    } else if (updateProfile.rejected.match(result) && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';
      showError(errorMessage || `Updating profile failed!`);
    }
  };

  return (
    <div>
      <div className="w-full flex align-middle ">
        <div className="flex font-extrabold text-main-400 text-3xl md:text-4xl lg:text-4xl mb-4 mx-auto">
          My Profile
        </div>
      </div>
      <div className=" flex md:flex lg:flex flex-col md:flex-row lg:flex-row w-full h-full align-middle ">
        <div className=" flex w-full mt-[-80px] md:mt-[0px] lg:mt-[0px] md:w-[30%] lg:w-[30%] align-middle">
          <div className="relative mx-auto mt-[25%] w-[180px] rounded-full">
            <Image
              className=" w-full object-cover rounded-full"
              src={imagePreview || profile.data.photoUrl || defaultImage}
              alt="profile image"
              width={180}
              height={180}
            />
          </div>
          <div className="absolute w-[180px] mx-[20%] md:mx-[0%] lg:mx-[0%] flex align-middle justify-center h-[180px] mt-[15%] md:mt-[5%] lg:mt-[5%] group">
            <input
              className="flex w-full z-20 cursor-pointer opacity-0"
              type="file"
              onChange={handleFileChange}
              placeholder="Image"
            />
          </div>
        </div>

        <div className=" w-full md:w-2/3 lg:w-2/3 px-4 md:px-0 lg:px-0 flex flex-col align-middle animate__animated animate__backInLeft ">
          <form
            className="flex flex-col align-middle"
            onSubmit={e => handleSubmit(e)}
          >
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.name}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('name', e.target.value)
                }
                label="Name"
                placeholder="Name"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="date"
                value={formData.birthdate}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('birthdate', e.target.value)
                }
                label="Date"
                placeholder="Date"
                valid={true}
                max={today}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.email}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('email', e.target.value)
                }
                label="Email"
                placeholder="Email"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.phone}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('phone', e.target.value)
                }
                label="Phone"
                placeholder="Phone number"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.gender}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('gender', e.target.value)
                }
                label="Gender"
                placeholder="Gender"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.address}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('address', e.target.value)
                }
                label="Address"
                placeholder="Address"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.preferedcurrency}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('preferedcurrency', e.target.value)
                }
                label="Prefered Currency"
                placeholder="Prefered Currency"
                valid={true}
              />
            </div>
            <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
              <Input
                type="text"
                value={formData.preferedlanguage}
                onChange={(e: { target: { value: any } }) =>
                  handleChange('preferedlanguage', e.target.value)
                }
                label="Prefered Language"
                placeholder="Prefered Language"
                valid={true}
              />
            </div>
            <div className="m-4">
              <Button
                label="Update Profile"
                style={ButtonStyle.DARK}
                disabled={loading}
                loading={loading}
              />
            </div>
          </form>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ProfileEdit;
