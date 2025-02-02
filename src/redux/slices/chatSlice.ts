import { createSlice } from '@reduxjs/toolkit';

export interface ChatMessagesInterface {
  id: string;
  name?: string;
  content: string;
  senderId: string;
  createdAt: Date;
  sender: { name: string; image?: string };
}

interface ChatsState {
  chats: ChatMessagesInterface[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatsState = {
  chats: [],
  loading: false,
  error: null
};

const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    setChats: (state, action) => {
      state.chats = action.payload;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    addChat: (state, action) => {
      state.chats = [...state.chats, action.payload];
    }
  }
});

export const { setChats, setLoading, setError, addChat } = chatsSlice.actions;

export default chatsSlice.reducer;
