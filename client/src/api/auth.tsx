// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/auth';
// const BASE_URL = 'https://level-upper-server.vercel.app/auth';

// for showcasing via port forward
// const BASE_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/backlog';
// const BASE_FETCH_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/tasks'

export const registerUser = async (email:string, password:string) => {
  const response = await fetch(BASE_URL + "/register", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://192.168.1.8:5173/'
    },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });
  const data = await response.json();
  return data;
};

export const resetUserPassword = async (email:string, password:string) => {
  const response = await fetch(BASE_URL + "/resetpassword", {
    method: 'PUT',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });
  const data = await response.json();
  return data;
};

export const loginUser = async (email:string, password:string) => {
  const response = await fetch(BASE_URL + "/login", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      // 'Accept': 'application/json',
      // 'Access-Control-Allow-Origin': 'http://192.168.1.8:5173/'
    },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });
  const data = await response.json();
  return data;
};

export const logoutUser = async () => {
  const response = await fetch(BASE_URL + "/logout", {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};

export const fetchCurrentUserData = async () => {
  const response = await fetch(BASE_URL + "/login/success", {
    method: 'GET',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
  });
  const data = await response.json();
  return data;
};