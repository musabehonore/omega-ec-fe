'use client';
import React, { FormEvent, useState } from 'react';
import { Button, ButtonStyle, Input } from '@/components/formElements';
// import { useRouter } from 'next/navigation';
import useToast from '@/components/alerts/Alerts';
import { ToastContainer } from 'react-toastify';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { forgotpassword } from '@/redux/slices/ForgotpasswordSlice';

import { regExPatterns } from '@/utils';

export default function ForgotPassword() {
  // const router = useRouter();
  const dispatch = useAppDispatch();
  const { showSuccess, showError } = useToast();

  const [email, setEmail] = useState<string>('');
  const { loading } = useAppSelector(state => state.forgotPassword);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!regExPatterns.email.test(email))
      return showError('Enter a valid email');
    const result = await dispatch(forgotpassword(email));

    if (forgotpassword.fulfilled.match(result)) {
      showSuccess('Reset password email sent!');
    } else if (forgotpassword.rejected.match(result) && result.payload) {
      const errorMessage =
        (result.payload as { message: string }).message ||
        'Failed to send a reset email';
      showError(errorMessage);
    }
  };

  return (
    <>
      <div className="w-2/3 mx-auto flex flex-col align-middle animate__animated animate__backInLeft">
        <div className="flex font-extrabold text-main-400 text-4xl mb-4 mx-auto">
          Forgot Password
        </div>
        <form className="flex flex-col align-middle" onSubmit={handleSubmit}>
          <Input
            label="Email"
            placeholder="Enter your email"
            type="text"
            value={email}
            onChange={e => setEmail(e.target.value)}
            valid={false}
          />
          <Button
            label="Send"
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
