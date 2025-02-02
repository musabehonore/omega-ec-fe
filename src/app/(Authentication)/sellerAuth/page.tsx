'use client';
import React, { FormEvent, useState, useEffect } from 'react';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { verifyOtp, setUserToken } from '@/redux/slices/otpSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export interface OtpFormDataInterface {
  otp: string;
}

const InitialFormValues: OtpFormDataInterface = {
  otp: ''
};

export default function VerifyOtp() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();
  const [formData, setFormData] =
    useState<OtpFormDataInterface>(InitialFormValues);

  const { loading, error, success, token, userToken } = useAppSelector(
    state => state.otp
  );

  useEffect(() => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      try {
        const tokenData = JSON.parse(tokenString);
        dispatch(setUserToken(tokenData));
      } catch (error) {
        showError('Invalid token format. Please login again.');
      }
    } else {
      showError('Token not found. Please login again.');
    }
  }, [dispatch, showError]);

  const handleChange = (value: string) => {
    setFormData({ otp: value });
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.otp) {
      showError('OTP is required');
      return;
    }

    if (!userToken) {
      showError('Token not found. Please login again.');
      return;
    }

    const payload = {
      otp: formData.otp,
      token: userToken
    };

    dispatch(verifyOtp(payload));
  };

  useEffect(() => {
    if (success) {
      showSuccess('OTP Verified Successfully!');

      if (token) {
        const decodedToken = jwtDecode(token) as any;
        const userRole = decodedToken.role;
        localStorage.setItem('userRole', userRole);
      }

      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 2030);
    } else if (error) {
      showError(error.message || 'Verification Failed!');
    }
  }, [success, error, router, showSuccess, showError]);

  useEffect(() => {
    if (success && token) {
      localStorage.setItem('token', JSON.stringify(token));
    }
  }, [success, token]);

  return (
    <>
      <div className="w-2/3 mx-auto flex flex-col align-middle animate__animated animate__backInLeft ">
        <div className="flex font-extrabold text-main-400 text-4xl mb-4 mx-auto">
          Verify OTP
        </div>
        <form className="flex flex-col align-middle" onSubmit={handleSubmit}>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              label="OTP"
              placeholder="Enter your OTP"
              type="text"
              value={formData.otp}
              onChange={e => handleChange(e.target.value)}
              valid={!error}
            />
            {error && (
              <span className="text-xs text-red-600 px-2 animate__animated animate__fadeInDown">
                {error.message}
              </span>
            )}
          </div>
          <Button
            label="Verify"
            style={ButtonStyle.DARK}
            disabled={loading}
            loading={loading}
          />
        </form>
        <span className="mt-6 mx-auto text-sm text-black">
          <Link
            href="/login"
            className="text-main-400 font-bold hover:underline hover:font-extrabold"
          >
            Resend OTP
          </Link>
        </span>
      </div>
      <ToastContainer />
    </>
  );
}
