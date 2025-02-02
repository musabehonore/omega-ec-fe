'use client';

import React, { useEffect, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { updatePassword as UpdatePasswordAction } from '@/redux/slices/updatePasswordSlice';
import { RootState } from '@/redux/store';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import useToast from '@/components/alerts/Alerts';
import { useRouter } from 'next/navigation';
import { FormErrorInterface } from '@/utils';
import { ToastContainer } from 'react-toastify';
import { jwtDecode } from 'jwt-decode';

export interface FormDataInterface {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
}

export interface ErrorInterface {
  target: keyof FormDataInterface;
  msg: string;
}

const getErrorForField = (errors: ErrorInterface[], key: string) => {
  const error = errors.find(error => error.target === key);
  return error ? error.msg : null;
};

const UpdatePassword: React.FC = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, error } = useAppSelector(
    (state: RootState) => state.updatePassword
  );
  const { showSuccess, showError } = useToast();
  const [errors, setErrors] = useState<ErrorInterface[]>([]);

  const [formData, setFormData] = useState<FormDataInterface>({
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleChange = (key: keyof FormDataInterface, value: string) => {
    setFormData(prevFormData => ({
      ...prevFormData,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const passwords = { ...formData };
    const result = await dispatch(UpdatePasswordAction(passwords));

    if (UpdatePasswordAction.fulfilled.match(result)) {
      showSuccess('Password changed successfully!');
      setTimeout(() => {
        router.push('/');
      }, 2000);
    } else if (UpdatePasswordAction.rejected.match(result) && result.payload) {
      const errorMessage = result.payload as FormErrorInterface;
      showError(errorMessage.message);
      console.log('error', errorMessage);

      if (errorMessage.message === 'Validation Errors!' && errorMessage.data) {
        const newErrors: ErrorInterface[] = [];
        errorMessage.data.forEach((err: { field: string; message: string }) => {
          newErrors.push({
            target: err.field as keyof FormDataInterface,
            msg: err.message
          });
        });
        setErrors(newErrors);
      }
    }
  };

  const [authenticated, setAuthenticated] = useState<boolean>(false);

  useEffect(() => {
    const tokenString = localStorage.getItem('token');
    if (tokenString) {
      const tokenData = JSON.parse(tokenString);
      const decoded = tokenData ? jwtDecode(tokenData) : null;

      if (decoded) {
        setAuthenticated(true);
      }
    }
  }, [dispatch]);

  if (!authenticated) {
    return <div>Not authenticated</div>;
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="w-full max-w-lg p-4 md:p-8">
        <div className="text-center font-extrabold text-main-400 text-3xl md:text-4xl mb-4">
          Update Password
        </div>
        <form className="flex flex-col" onSubmit={handleSubmit}>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="password"
              value={formData.oldPassword}
              onChange={e => handleChange('oldPassword', e.target.value)}
              label="Old Password"
              placeholder="Old Password"
              valid={true}
            />
            {errors.find(error => error.target === 'oldPassword') && (
              <span className="text-xs text-red-600 px-2 animate__animated animate__fadeInDown">
                {getErrorForField(errors, 'oldPassword')}
              </span>
            )}
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="password"
              value={formData.newPassword}
              onChange={e => handleChange('newPassword', e.target.value)}
              label="New Password"
              placeholder="New Password"
              valid={true}
            />
            {errors.find(error => error.target === 'newPassword') && (
              <span className="text-xs text-red-600 px-2 animate__animated animate__fadeInDown">
                {getErrorForField(errors, 'newPassword')}
              </span>
            )}
          </div>
          <div className="w-full mt-2 flex flex-col gap-1 animate__animated animate__fadeInDown">
            <Input
              type="password"
              value={formData.confirmPassword}
              onChange={e => handleChange('confirmPassword', e.target.value)}
              label="Confirm Password"
              placeholder="Confirm Password"
              valid={true}
            />
            {errors.find(error => error.target === 'confirmPassword') && (
              <span className="text-xs text-red-600 px-2 animate__animated animate__fadeInDown">
                {getErrorForField(errors, 'confirmPassword')}
              </span>
            )}
          </div>
          <div className="mt-4">
            <Button
              label="Update"
              style={ButtonStyle.DARK}
              disabled={loading}
              loading={loading}
            />
          </div>
        </form>
      </div>
      <ToastContainer />
    </div>
  );
};

export default UpdatePassword;
