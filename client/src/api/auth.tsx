// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/auth';

// for showcasing via port forward
// const BASE_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/backlog';
// const BASE_FETCH_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/tasks'

export const registerUser = async (email:string, password:string) => {
  const response = await fetch(BASE_URL + "/register", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });
  const data = await response.json();
  return data;
};

export const loginUser = async (email:string, password:string) => {
  const response = await fetch(BASE_URL + "/login", {
    method: 'POST',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userEmail: email, userPassword: password })
  });
  const data = await response.json();
  return data;
};