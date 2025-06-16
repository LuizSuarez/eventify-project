
export const getUserFromStorage = () => {
  const token = localStorage.getItem('token');
  const userJson = localStorage.getItem('user');
  let user = null;
  try {
    user = userJson ? JSON.parse(userJson) : null;
  } catch {
    user = null;
  }
  return { token, user };
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

export const getUserRole = () => {
  const userJson = localStorage.getItem('user');
  if (!userJson) return null;
  try {
    const user = JSON.parse(userJson);
    return user?.role || null;
  } catch {
    return null;
  }
};
