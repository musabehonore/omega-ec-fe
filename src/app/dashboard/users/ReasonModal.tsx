'use client';
import React, { useState } from 'react';
import { Input } from '@/components/formElements';
import { ReasonFields } from '@/utils';

interface ReasonModalProps {
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

const ReasonModal: React.FC<ReasonModalProps> = ({ onClose, onConfirm }) => {
  const [reason, setReason] = useState('');

  const handleConfirm = () => {
    onConfirm(reason);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-main-200 bg-opacity-50 flex items-center justify-center animate__animated animate__backInRight text-black">
      <div className="bg-white border-4 border-main-200 p-5 rounded-lg">
        <h2 className="text-black mb-2">Provide Reason to Disable Account</h2>
        {ReasonFields.map(field => (
          <Input
            key={field.placeholder}
            placeholder={field.placeholder}
            type={field.type}
            value={reason}
            onChange={e => setReason(e.target.value)}
            label={''}
            valid={false}
          />
        ))}
        <div className="mt-4 flex justify-between gap-2">
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded bg-main-300 hover:bg-slate-400"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="bg-blue-500 text-black px-4 py-2 rounded bg-main-200 hover:bg-opacity-100"
            onClick={handleConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReasonModal;
