import React, { PropsWithChildren } from 'react';
import { cn } from 'tailwind-cn';
import { isCurrentUser } from '@/utils/checkUser';

const MessageCard = ({
  children,
  senderId
}: PropsWithChildren<{ senderId: string }>) => {
  const isSelf = isCurrentUser(senderId);
  const className = cn({
    'self-end': isSelf,
    'self-start': !isSelf
  });
  return <div className={className}>{children}</div>;
};

export default MessageCard;
