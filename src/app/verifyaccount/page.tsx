'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

const VerifyAccountConfirmation = () => {
  const router = useRouter();
  const handleLoginButton = () => {
    router.push('/login');
  };
  const handleCancelButton = () => {
    router.push('/');
  };
  return (
    <div className="fixed inset-0 bg-main-200 bg-opacity-50 flex items-center justify-center animate__animated animate__backInRight text-black">
      <div className="bg-white border-4 border-main-200 p-5 rounded-2xl">
        <h2 className="text-blue mb-2 text-center">Confimation Message</h2>
        <p className="text-center">
          Email verified successfully! Login to continue...
        </p>
        <div className="mt-4 flex justify-between gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded bg-main-300 hover:bg-slate-400"
            onClick={handleCancelButton}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-black px-4 py-2 rounded bg-main-200 hover:bg-opacity-100 cursor-pointer"
            onClick={handleLoginButton}
          >
            Login
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerifyAccountConfirmation;
