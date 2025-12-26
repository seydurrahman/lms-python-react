export const getUserRole = () => {
  const token = localStorage.getItem("access");
  if (!token) return null;

  const payload = JSON.parse(atob(token.split(".")[1]));
  return payload.role;
};
