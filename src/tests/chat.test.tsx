import React from 'react';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { store } from '@/redux/store';
import Card from '../components/Card';
import { ChatForm } from '../components/ChatForm';
import { ChatMessage } from '../components/ChatMessage';
import ChatHeader from '@/components/chatHeader';

describe('Test chat page', () => {
  test('renders message card correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <Card senderId={'random'}>
          <p>Hello</p>
        </Card>
      </Provider>
    );
    expect(getByText('Hello')).toBeTruthy();
  });

  // test('renders ChatForm correctly', () => {
  //   const { getAllByRole } = render(
  //     <Provider store={store}>
  //       <ChatForm />
  //     </Provider>
  //   );
  //   expect(getAllByRole('button')).toBeTruthy();
  // });

  test('renders ChatMessage correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ChatMessage
          id={'random'}
          content={'Hello'}
          senderId={'random'}
          createdAt={new Date()}
          sender={{ name: 'user name' }}
          isSelf={false}
        />
      </Provider>
    );
    expect(getByText('user name')).toBeTruthy();
    expect(getByText('Hello')).toBeTruthy();
  });
  test('renders ChatMessage correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ChatMessage
          id={'random'}
          content={'Hello'}
          senderId={'random'}
          createdAt={new Date()}
          sender={{ name: 'user name' }}
          isSelf={true}
        />
      </Provider>
    );
    expect(getByText('Me')).toBeTruthy();
    expect(getByText('Hello')).toBeTruthy();
  });
  test('renders ChatHeader correctly', () => {
    const { getByText } = render(
      <Provider store={store}>
        <ChatHeader typingStatus="Hello" />
      </Provider>
    );
    expect(getByText('Hello')).toBeTruthy();
  });
});
