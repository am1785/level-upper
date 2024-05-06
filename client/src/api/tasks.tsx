// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/tasks';

// const BASE_URL = 'https://level-upper-server.vercel.app/tasks';

// for showcase vscode
// const BASE_URL = "https://l3n3cjbp-5001.use.devtunnels.ms/tasks";

export const fetchTasks = async (author:string) => {
  const response = await fetch(BASE_URL + '/' + author, {credentials: 'include'});
  const data = await response.json();
  return data;
};

export const fetchView = async (_id:string) => {
  const response = await fetch(BASE_URL + '/view/' + _id, {credentials: 'include'});
  const data = await response.json();
  return data;
};

export const fetchCollections = async (author:string) => {
  const response = await fetch(BASE_URL + '/collections/' + author, {credentials: 'include'});
  const data = await response.json();
  return data;
};

export const addTask = async (newTask:any) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(newTask),
  });
  const data = await response.json();
  return data;
};

export const editTask = async (taskId:string, updateData:object) => {
    const response = await fetch(BASE_URL + '/' + taskId, {
      method: 'PUT',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updateData),
    });
    const data = await response.json();
    return data;
  };

  // export const finishTask = async (taskId) => {
  //   const response = await fetch(BASE_URL + '/' + taskId, {
  //     method: 'PUT',
  //     headers: {
  //       'Content-Type': 'application/json',
  //     },
  //     body: JSON.stringify(updateData),
  //   });
  //   const data = await response.json();
  //   return data;
  // };

export const deleteTask = async (taskId:string) => {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: 'DELETE',
    credentials: 'include',
  });
  const data = await response.json();
  return data;
};