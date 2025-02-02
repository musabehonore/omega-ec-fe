import { useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAppDispatch } from '@/redux/hooks/hook';
import { addNotification } from '@/redux/slices/notificationSlice';

const useSocket = (userId: string) => {
  const dispatch = useAppDispatch();
  const URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    const socket: Socket = io(URL!);

    socket.on('connect', () => {
      console.log('connected');
    });

    socket.on(userId, notification => {
      console.log('notification received', notification);
      const { event, createdAt, message } = notification;
      dispatch(
        addNotification({
          id: userId,
          event,
          createdAt,
          message,
          isRead: false
        })
      );
    });

    return () => {
      socket.disconnect();
    };
  }, [dispatch, userId]);

  return null;
};

export default useSocket;
