// api routes for react-query
const BASE_URL = 'http://localhost:5001/tasks';

export const fetchTasks = async (author) => {
  const response = await fetch(BASE_URL + '/' + author);
  const data = await response.json();
  return data;
};

export const addTask = async (newTask) => {
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

export const editTask = async (taskId, updateData) => {
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

export const deleteTask = async (taskId) => {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
};