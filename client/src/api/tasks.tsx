// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/tasks';

export const fetchTasks = async (author:string) => {
  const response = await fetch(BASE_URL + '/' + author);
  const data = await response.json();
  return data;
};

export const addTask = async (newTask:any) => {
  const response = await fetch(BASE_URL, {
    method: 'POST',
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
  });
  const data = await response.json();
  return data;
};