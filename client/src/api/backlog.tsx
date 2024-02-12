// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/tasks';

export const fetchAllTasks = async (author:string) => {
  const response = await fetch(BASE_URL + '/' + author + '?all=1');
  const data = await response.json();
  return data;
};