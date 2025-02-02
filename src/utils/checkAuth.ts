export const handleRedirect = (router: any) => {
  const token = localStorage.getItem('token');

  if (token) {
    router.push('/dashboard/profile');
  }
};
