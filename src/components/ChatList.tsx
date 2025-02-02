'use client';
import React from 'react';
import { useAppSelector } from '@/redux/hooks/hook';
import { ChatMessage } from './ChatMessage';

export const ChatList = () => {
  const chats = useAppSelector(({ chat }) => chat.chats);
  return (
    <div className="flex flex-col gap-4 pb-24">
      {chats?.map((message, index) => (
        <ChatMessage
          key={index}
          {...message}
          isSelf={message.senderId === localStorage.getItem('userId')}
        />
      ))}
    </div>
  );
};
