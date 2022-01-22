const getToken = () => {
  return window.sessionStorage.getItem("token");
};
const setToken = (token) => {
  return window.sessionStorage.setItem("token", token);
};
const clearToken = () => {
  window.sessionStorage.clear();
};
export { getToken, setToken, clearToken };
