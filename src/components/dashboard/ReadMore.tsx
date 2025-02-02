import { useAppDispatch } from '@/redux/hooks/hook';
import { markNotificationAsRead } from '@/redux/slices/notificationSlice';
import React, { useState } from 'react';

interface ReadMoreProps {
  message: string;
  id: string;
}

export const ReadMore: React.FC<ReadMoreProps> = ({ message, id }) => {
  const maxWords = 2;
  const words = message.split(' ');
  const truncated = words.slice(0, maxWords).join(' ');
  const remaining = words.slice(maxWords).join(' ');

  const dispatch = useAppDispatch();
  const [showFullText, setShowFullText] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [isRead, setIsRead] = useState<{ [key: string]: boolean }>({});
  const [removeTimeout, setRemoveTimeout] = useState<NodeJS.Timeout | null>(
    null
  );

  const toggleFullText = (
    id: string,
    event: React.MouseEvent<HTMLAnchorElement, MouseEvent>
  ) => {
    event.preventDefault();
    setShowFullText(prevState => ({
      ...prevState,
      [id]: !prevState[id]
    }));
    if (!isRead[id]) {
      setIsRead(prevState => ({
        ...prevState,
        [id]: true
      }));
      const timeout = setTimeout(() => {
        dispatch(markNotificationAsRead(id));
      }, 5000);
      setRemoveTimeout(timeout);
    }
  };

  return (
    <div>
      {showFullText[id] ? (
        <div style={{ color: isRead[id] ? 'grey' : 'black' }}>
          {message}{' '}
          <span className="text-blue">
            <a href="#" onClick={event => toggleFullText(id, event)}>
              show less
            </a>
          </span>
        </div>
      ) : (
        <div style={{ color: isRead[id] ? 'grey' : 'black' }}>
          {truncated}{' '}
          {remaining && (
            <span className="text-blue">
              <a href="#" onClick={event => toggleFullText(id, event)}>
                ...
              </a>
            </span>
          )}
        </div>
      )}
    </div>
  );
};
