export const isCurrentUser = (senderId: string | undefined): boolean => {
  const userId = localStorage.getItem('userId');
  return senderId !== undefined && userId !== null && senderId === userId;
};
