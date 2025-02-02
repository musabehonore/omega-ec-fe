import React from 'react';

interface StatusModalProps {
  onClose: () => void;
  onConfirm: () => void;
  status: boolean;
}

const StatusModal: React.FC<StatusModalProps> = ({
  onClose,
  onConfirm,
  status
}) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg p-5 w-1/3">
        <h2 className="text-xl font-bold mb-4">Update Product status</h2>
        <p>
          Are you sure you want to change the status to{' '}
          {status ? 'True' : 'False'}?
        </p>
        <div className="mt-4 flex justify-end">
          <button
            className="mr-2 px-2 py-2 bg-gray-600 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-2 py-2 bg-blue-600 text-red rounded"
            onClick={onConfirm}
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default StatusModal;
