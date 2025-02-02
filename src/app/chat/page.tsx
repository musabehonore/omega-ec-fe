'use client';
import { ChatForm } from '@/components/ChatForm';
import { ChatList } from '@/components/ChatList';
import { addChat, setChats } from '@/redux/slices/chatSlice';
import { axiosRequest } from '@/utils';
import React, { useEffect, useState } from 'react';
import { useAppDispatch } from '@/redux/hooks/hook';
import useSocket from '@/redux/hooks/userSocket';
import ChatHeader from '@/components/chatHeader';
import Image from 'next/image';

const fetchMessages = async () => {
  const messages = await axiosRequest('GET', `/chats`, '', true);
  return messages.data.data;
};

const Page = () => {
  const dispatch = useAppDispatch();
  const socket = useSocket();
  const [typingStatus, setTypingStatus] = useState('');

  useEffect(() => {
    fetchMessages().then(data => {
      dispatch(setChats(data));
    });

    socket.current?.on('typing', (isTyping, name) => {
      if (isTyping) {
        setTypingStatus(`${name} is Typing...`);
      } else {
        setTypingStatus('');
      }
    });

    socket.current?.on('receiveMessage', data => {
      dispatch(addChat(data));
    });

    socket.current?.on('sendUserId', getId => {
      localStorage.setItem('userId', getId);
    });

    return () => {
      socket.current?.disconnect();
    };
  }, [dispatch, socket]);

  return (
    <div>
      <ChatHeader typingStatus={typingStatus} />
      <div id="messages" className="sm:p-8 p-2">
        <ChatList />
      </div>
      <div className="relative">
        <div className="fixed md:bottom-0 sm:bottom-0 lg:bottom-0 bottom-12 right-0 sm:left-[245px] md:left-[245px] left-2 pr-[30px]">
          <ChatForm socket={socket} />
        </div>
      </div>
    </div>
  );
};

export default Page;
