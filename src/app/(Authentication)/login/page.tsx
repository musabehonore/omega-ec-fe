'use client';

import React, { useEffect } from 'react';
import _ from 'lodash';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { logInFields } from '@/utils/logInFormFields';
import {
  regExPatterns,
  FormErrorInterface,
  ErrorInterface,
  getErrorForField
} from '@/utils';
import { useRouter } from 'next/navigation';
import { useSelector } from 'react-redux';
import { logInUser } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import Google from '@/assets/images/Google.png';
import Image from 'next/image';
import PageLoading from '@/components/Loading/PageLoading';
import { handleRedirect } from '@/utils/checkAuth';
import { jwtDecode } from 'jwt-decode';

export interface FormDataInterface {
  email: string;
  password: string;
}

export type logInKeys = keyof FormDataInterface;

const InitialFormValues: FormDataInterface = {
  email: '',
  password: ''
};

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const { showSuccess, showError } = useToast();

  const {
    loading,
    success,
    error,
    role: userRole
  } = useAppSelector((state: RootState) => state.user);

  const [formData, setFormData] =
    useState<FormDataInterface>(InitialFormValues);
  const [errors, setErrors] = useState<ErrorInterface[]>([]);

  useEffect(() => {
    handleRedirect(router);
  }, [router]);

  const handleChange = (key: logInKeys, value: string) => {
    setErrors([]);
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      return updatedFormData;
    });
  };

  const handleGoogleAuth = () => {
    router.push(`${process.env.NEXT_PUBLIC_API_URL}/api/users/google-auth`);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: ErrorInterface[] = [];

    if (!regExPatterns.email.test(formData.email)) {
      newErrors.push({
        target: 'email',
        msg: 'please enter a valid email',
        message: ''
      });
    }
    if (!regExPatterns.password.test(formData.password)) {
      newErrors.push({
        target: 'password',
        msg: 'please enter a valid password',
        message: ''
      });
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await dispatch(logInUser(formData));

    if (logInUser.fulfilled.match(result)) {
      const payload = result.payload as unknown as
        | FormErrorInterface
        | undefined;
      if (payload?.message === 'Verify OTP sent to your email to continue') {
        router.push('/sellerAuth');
      } else {
        showSuccess('Login Successful!');
        const token = localStorage.getItem('token');

        if (token) {
          const decodedToken = jwtDecode(token) as any;
          const userRole = decodedToken.role;

          localStorage.setItem('userRole', userRole);

          if (userRole === 'buyer') {
            setTimeout(() => {
              setPageLoading(true);
              window.location.href = '/products';
              setPageLoading(false);
            }, 2030);
          } else {
            setTimeout(() => {
              setPageLoading(true);
              window.location.href = '/dashboard';
              setPageLoading(false);
            }, 2030);
          }
        }
      }
    } else if (logInUser.rejected.match(result) && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';

      if (errorMessage === 'Validation Errors!') {
        const newErrors: ErrorInterface[] = [];
        error?.data.forEach((err: { field: string; message: string }) => {
          return newErrors.push({
            target: err.field as keyof FormDataInterface,
            msg: err.message,
            message: ''
          });
        });
        setErrors(newErrors);
      }
      showError(errorMessage || `login Failed!`);
    }
  };

  if (pageLoading) return <PageLoading />;

  return (
    <>
      <div className="w-2/3 mx-auto flex flex-col align-middle animate__animated animate__backInLeft ">
        <div className="flex font-extrabold text-main-400 text-4xl mb-4 mx-auto">
          {' '}
          Login{' '}
        </div>
        <form
          className="flex flex-col align-middle"
          onSubmit={e => handleSubmit(e)}
        >
          {logInFields.map((field, i) => (
            <div
              className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown"
              key={i}
            >
              <Input
                label={field.label}
                placeholder={field.placeholder}
                type={field.type}
                value={formData[field.key]}
                onChange={(e: { target: { value: any } }) =>
                  handleChange(field.key, e.target.value)
                }
                valid={getErrorForField(errors, field.key) ? false : true}
              />
              {getErrorForField(errors, field.key) && (
                <span className="text-xs text-red-600 px-2 animate__animated animate__fadeInDown">
                  {getErrorForField(errors, field.key)}
                </span>
              )}
            </div>
          ))}

          <div className="flex justify-between items-center mt-0">
            <div></div>
            <Link
              href="/forgot-password"
              className="text-gray text-xs underline mt-3"
            >
              Forgot Password?
            </Link>
          </div>
          <Button
            label="login"
            style={ButtonStyle.DARK}
            disabled={loading}
            loading={loading}
          />
        </form>
        <div className="flex items-center justify-center space-x-0">
          <span className="text-main-300 font-bold">or login with</span>
          <button onClick={handleGoogleAuth} className="rounded-md">
            <Image src={Google} alt="google image" />
          </button>
        </div>

        <span className="mt-6 mx-auto text-sm text-black">
          Or create an account?{' '}
          <Link
            href="/register"
            className="text-main-400 font-bold hover:underline hover:font-extrabold"
          >
            register
          </Link>
        </span>
      </div>
      <ToastContainer />
    </>
  );
}
