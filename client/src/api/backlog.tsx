// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/backlog';
const BASE_FETCH_URL = 'http://192.168.1.8:5001/tasks';

// for showcasing via port forward
// const BASE_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/backlog';
// const BASE_FETCH_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/tasks'

export const fetchAllTasks = async (author:string) => {
  const response = await fetch(BASE_FETCH_URL + '/' + author + '?all=1');
  const data = await response.json();
  return data;
};

export const deleteTasks = async (_ids:string[]) => {
  const response = await fetch(BASE_URL, {
    method: 'DELETE',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_ids: _ids })
  });
  const data = await response.json();
  return data;
};

export const editTaskCollections = async (_ids:string[], collection:string, operation:string) => {
  const response = await fetch(BASE_URL, {
    method: 'PUT',
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ task_ids: _ids, task_collection: collection, operation: operation })
  });
  const data = await response.json();
  return data;
};