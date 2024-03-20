// api routes for react-query
const BASE_URL = 'http://192.168.1.8:5001/skills';

export const fetchSkills = async (author:string, collection:string) => {
  if(collection.length > 0) {
    const response = await fetch(BASE_URL + '/' + author + '?collection=' + collection);
    const data = await response.json();
    return data;
  } else {
    const response = await fetch(BASE_URL + '/' + author);
    const data = await response.json();
    return data;
  }
};