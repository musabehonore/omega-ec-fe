'use client';
import React from 'react';
import _ from 'lodash';
import { Button, ButtonStyle, Input } from '@/components/formElements';
import { FormEvent, useState } from 'react';
import Link from 'next/link';
import { RegistrationFields } from '@/utils/FormFields';
import {
  regExPatterns,
  testPassword,
  FormErrorInterface,
  ErrorInterface,
  getErrorForField
} from '@/utils';
import { useRouter } from 'next/navigation';
import { registerUser } from '@/redux/slices/userSlice';
import { RootState } from '@/redux/store';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';

export interface FormDataInterface {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

export type RegistrationKeys = keyof FormDataInterface;

const InitialFormValues: FormDataInterface = {
  name: '',
  email: '',
  password: '',
  phone: '',
  address: ''
};

export default function Register() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const { showSuccess, showError } = useToast();

  const { loading, success, error } = useAppSelector(
    (state: RootState) => state.user
  );

  const [formData, setFormData] =
    useState<FormDataInterface>(InitialFormValues);
  const [errors, setErrors] = useState<ErrorInterface[]>([]);

  const handleChange = (key: RegistrationKeys, value: string) => {
    setErrors([]);
    setFormData(prevFormData => {
      const updatedFormData = { ...prevFormData, [key]: value };
      validateField(key, value);
      return updatedFormData;
    });
  };

  const validateField = (key: RegistrationKeys, value: string) => {
    const newErrors = [...errors.filter(error => error.target !== key)];
    if (key === 'password') {
      const error = testPassword(value) || '';
      newErrors.push({ target: key, msg: error });
    } else if (!regExPatterns[key].test(value)) {
      const errorMsg =
        RegistrationFields.find(field => field.key === key)?.message ||
        'Invalid input';
      newErrors.push({ target: key, msg: errorMsg });
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrors([]);
    const newErrors: ErrorInterface[] = [];

    for (const key in formData) {
      const typedKey = key as RegistrationKeys;
      if (!regExPatterns[typedKey].test(formData[typedKey])) {
        const errorMsg =
          RegistrationFields.find(field => field.key === typedKey)?.message ||
          'Invalid input';
        newErrors.push({ target: typedKey, msg: errorMsg });
      }
    }

    if (newErrors.length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await dispatch(registerUser(formData));

    if (registerUser.fulfilled.match(result)) {
      showSuccess('Registered Successfully! Please verify your email!');
      setTimeout(() => {
        router.push('/login');
      }, 2000);
    } else if (registerUser.rejected.match(result) && result.payload) {
      const errorMessage =
        (result.payload as FormErrorInterface).message || 'An error occurred';

      if (errorMessage === 'Validation Errors!') {
        const newErrors: ErrorInterface[] = [];
        error?.data.forEach((err: { field: string; message: string }) => {
          newErrors.push({
            target: err.field as keyof FormDataInterface,
            msg: err.message
          });
        });
        setErrors(newErrors);
      } else if (errorMessage === 'A user with this email already exists.') {
        setErrors([...errors, { target: 'email', msg: errorMessage }]);
      }

      showError(errorMessage || `Registration Failed!`);
    }
  };

  return (
    <>
      <div className="w-2/3 mx-auto flex flex-col align-middle animate__animated animate__backInLeft ">
        <div className="flex font-extrabold text-main-400 text-4xl mb-4 mx-auto">
          {' '}
          Register{' '}
        </div>
        <form
          className="flex flex-col align-middle"
          onSubmit={e => {
            e.preventDefault();
            handleSubmit(e);
          }}
        >
          {RegistrationFields.map((field, i) => (
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
          <Button
            label="Register"
            style={ButtonStyle.DARK}
            disabled={loading}
            loading={loading}
          />
        </form>
        <span className="mt-6 mx-auto text-sm text-black">
          Already have an account?{' '}
          <Link
            href="/login"
            className="text-main-400 font-bold hover:underline hover:font-extrabold"
          >
            Login
          </Link>
        </span>
      </div>
      <ToastContainer />
    </>
  );
}
