// api routes for react-query
const BASE_URL = 'http://localhost:5001/tasks';

export const fetchTasks = async () => {
  const response = await fetch(BASE_URL);
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
  // queryClient.invalidateQueries(['addTask']);
  return data;
};

export const editTask = async (taskId) => {
    const response = await fetch(BASE_URL, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    const data = await response.json();
    return data;
  };

export const deleteTask = async (taskId) => {
  const response = await fetch(`${BASE_URL}/${taskId}`, {
    method: 'DELETE',
  });
  const data = await response.json();
  return data;
};