'use client';
import React, { FormEvent, useState } from 'react';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { useAppDispatch } from '@/redux/hooks/hook';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import { resetpassword } from '@/redux/slices/ResetpasswordSlice';
import { testPassword } from '@/utils';
import { ResetpasswordErrorInterface } from '@/utils';
import router, { useRouter } from 'next/navigation';

export interface ResetPasswordFormDataInterface {
  password: string;
  confirmPassword: string;
}

export type ResetPasswordKeys = keyof ResetPasswordFormDataInterface;

const InitialFormValues: ResetPasswordFormDataInterface = {
  password: '',
  confirmPassword: ''
};

export default function ResetPassword() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { showSuccess, showError } = useToast();
  const { loading, error } = useSelector(
    (state: RootState) => state.Resetpassword
  );

  const [formData, setFormData] =
    useState<ResetPasswordFormDataInterface>(InitialFormValues);
  const [errors, setErrors] = useState<ResetpasswordErrorInterface[]>([]);

  const handleChange = (key: ResetPasswordKeys, value: string) => {
    setErrors([]);
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      validateField(key, value);
      return updatedFormData;
    });
    setTimeout(() => validateField(key, value), 0);
  };

  const validateField = (key: ResetPasswordKeys, value: string) => {
    const newErrors: ResetpasswordErrorInterface[] = [
      ...errors.filter(error => error.target !== key)
    ];

    if (key === 'password' || key === 'confirmPassword') {
      if (key === 'confirmPassword' && value !== formData.password) {
        newErrors.push({
          target: key,
          msg: 'Passwords do not match'
          // email: ''
        });
      } else if (!testPassword(value)) {
        newErrors.push({
          target: key,
          msg: 'Password must be at least 8 characters long'
        });
      }
    }

    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: ResetpasswordErrorInterface[] = [];

    if (formData.password !== formData.confirmPassword) {
      newErrors.push({
        target: 'confirmPassword',
        msg: 'Passwords do not match'
        // email: ''
      });
    }
    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }
    const result = await dispatch(resetpassword(formData));
    if (resetpassword.fulfilled.match(result)) {
      showSuccess(
        'Password Reset Successfully! Please login with your new password!'
      );
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else if (resetpassword.rejected.match(result)) {
      const errorMessage =
        (result.payload as { message: string }).message || 'An error occurred';
      if (errorMessage === 'Validation Errors!') {
        error?.data.forEach((err: { field: string; message: any }) => {
          newErrors.push({
            target: err.field as ResetPasswordKeys,
            msg: err.message
            // email: ''
          });
        });
        setErrors(newErrors);
      }
      showError(errorMessage || 'Password Reset Failed!');
    }
  };
  return (
    <>
      <div className="w-2/3 mx-auto flex flex-col align-middle animate__animated animate__backInLeft ">
        <div className="flex font-extrabold text-main-400 text-4xl mb-4 mx-auto">
          Reset Password
        </div>
        <form
          className="flex flex-col align-middle"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              label="password"
              placeholder="Enter your new password"
              type="password"
              value={formData.password}
              onChange={e => handleChange('password', e.target.value)}
              valid={!errors.some(error => error.target === 'password')}
            />
            {errors.map(
              error =>
                error.target === 'password' && (
                  <span key={error.target} className="text-red-600">
                    {error.msg}
                  </span>
                )
            )}
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              label="Confirm Password"
              placeholder="Confirm your new password"
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              valid={!errors.some(error => error.target === 'confirmPassword')}
            />
            {errors.map(
              error =>
                error.target === 'confirmPassword' && (
                  <span key={error.target} className="text-red-600">
                    {error.msg}
                  </span>
                )
            )}
          </div>

          <Button
            label="Reset"
            style={ButtonStyle.DARK}
            disabled={loading}
            loading={loading}
          />
        </form>
      </div>
      <ToastContainer />
    </>
  );
}
