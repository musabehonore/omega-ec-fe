import chatsReducer, {
  setChats,
  setLoading,
  setError,
  addChat
} from '@/redux/slices/chatSlice';
import { ChatMessagesInterface } from '@/redux/slices/chatSlice';

describe('chats slice', () => {
  const initialState = {
    chats: [],
    loading: false,
    error: null
  };

  const mockChat: ChatMessagesInterface = {
    id: '1',
    name: 'Test User',
    content: 'Test message',
    senderId: 'user1',
    createdAt: new Date(),
    sender: { name: 'Test User', image: '' }
  };

  it('should handle initial state', () => {
    expect(chatsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setChats', () => {
    const actual = chatsReducer(initialState, setChats([mockChat]));
    expect(actual.chats).toEqual([mockChat]);
  });

  it('should handle setLoading', () => {
    const actual = chatsReducer(initialState, setLoading(true));
    expect(actual.loading).toEqual(true);
  });

  it('should handle setError', () => {
    const error = 'Test error';
    const actual = chatsReducer(initialState, setError(error));
    expect(actual.error).toEqual(error);
  });

  it('should handle addChat', () => {
    const actual = chatsReducer(initialState, addChat(mockChat));
    expect(actual.chats).toEqual([mockChat]);
  });
});
