// api routes for react-query
const BASE_URL = 'http://localhost:5001/skills';

export const fetchSkills = async (author:string) => {
  const response = await fetch(BASE_URL + '/' + author);
  const data = await response.json();
  return data;
};