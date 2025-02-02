import { useEffect, useRef } from 'react';
import { io } from 'socket.io-client';

const useSocket = () => {
  const socket = useRef<ReturnType<typeof io> | null>(null);

  useEffect(() => {
    socket.current = io(process.env.NEXT_PUBLIC_API_URL as string, {
      auth: {
        token: JSON.parse(localStorage.getItem('token') ?? '')
      },
      autoConnect: true
    });

    return () => {
      socket.current?.disconnect();
    };
  }, []);

  return socket;
};

export default useSocket;
