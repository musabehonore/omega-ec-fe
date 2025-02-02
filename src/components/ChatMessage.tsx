'use client';
import React from 'react';
import { ChatMessagesInterface } from '@/redux/slices/chatSlice';
import MessageCard from './Card';
import { cn } from 'tailwind-cn';
import unknown from '../assets/images/unknown.png';
import Image from 'next/image';

export const ChatMessage = ({
  content,
  senderId,
  name,
  sender,
  createdAt,
  isSelf
}: ChatMessagesInterface & { isSelf: boolean }) => {
  const className = cn('rounded-md shadow-md p-2 max-w-[80%] min-w-fit', {
    'bg-green-200': isSelf,
    'bg-[#a5c9ca]': !isSelf
  });
  return (
    <MessageCard senderId={senderId}>
      <div className="flex gap-4 items-start ">
        {!isSelf && (
          <Image
            className="mt-2"
            src={sender?.image || unknown}
            width={36}
            height={36}
            alt="unknown"
          />
        )}
        <div>
          <small>{isSelf ? 'Me' : name || sender?.name}</small>
          <p className={className}>{content}</p>
          <small className="mt-2">
            {createdAt ? new Date(createdAt).toLocaleString() : 'now'}
          </small>
        </div>
      </div>
    </MessageCard>
  );
};
