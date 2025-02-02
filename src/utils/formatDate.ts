export const formatDate = (timeStamp: string) => {
  const getCurrentTime = new Date();
  const timeStampDate = new Date(timeStamp);
  const getDifference = getCurrentTime.getTime() - timeStampDate.getTime();
  const getCurrentSeconds = Math.floor(getDifference / 1000);
  const getMinutes = Math.floor(getCurrentSeconds / 60);
  const getHours = Math.floor(getMinutes / 60);
  const getDays = Math.floor(getHours / 24);

  if (getCurrentSeconds < 60) {
    return 'Just now';
  } else if (getMinutes === 1) {
    return `${getMinutes} minute ago`;
  } else if (getMinutes < 60) {
    return `${getMinutes} minutes ago`;
  } else if (getHours === 1) {
    return `${getHours} hour ago`;
  } else if (getHours < 24) {
    return `${getHours} hours ago`;
  } else if (getDays === 1) {
    return `${getDays} day ago`;
  } else {
    return `${getDays} days ago`;
  }
};
