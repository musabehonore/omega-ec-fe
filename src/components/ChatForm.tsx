'use client';
import React, { useEffect, useState } from 'react';
import { Socket } from 'socket.io-client';
import { FaPaperPlane } from 'react-icons/fa';
import { fetchProfile } from '@/redux/slices/profileSlice';
import { useAppDispatch, useAppSelector } from '@/redux/hooks/hook';
import { RootState } from '@/redux/store';

export const ChatForm = ({
  socket
}: {
  socket?: React.MutableRefObject<Socket | null>;
}) => {
  const [message, setMessage] = useState('');

  const dispatch = useAppDispatch();
  const { loading, profile, status } = useAppSelector(
    (state: RootState) => state.profile
  );

  useEffect(() => {
    dispatch(fetchProfile());
  }, [dispatch]);

  const handleSendMessage = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    socket?.current?.emit('sentMessage', {
      messageDate: new Date(),
      content: message,
      socketId: socket?.current?.id
    });
    setMessage('');
  };

  const handleTyping = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
    socket?.current?.emit('typing', true, profile?.data.name);
    setTimeout(() => {
      socket?.current?.emit('typing', false);
    }, 1000);
  };

  return (
    <form className="flex gap-2 bg-main-100 p-4 " onSubmit={handleSendMessage}>
      <label className="flex-1 bg-main-200 rounded-md">
        <input
          type="text"
          name="message"
          id="message"
          className="w-full p-3 rounded-md border-2 border-none outline-none"
          placeholder="type your message"
          onChange={handleTyping}
          value={message}
        />
      </label>
      <button>
        <FaPaperPlane className="text-main-300" size={24} />
      </button>
    </form>
  );
};
