// api routes for react-query
const BASE_URL = 'https://level-upper-server.vercel.app/skills';

// for showcase vscode
// const BASE_URL = 'https://l3n3cjbp-5001.use.devtunnels.ms/skills';

export const fetchSkills = async (author:string, collection:string) => {
  if(collection.length > 0) {
    const response = await fetch(BASE_URL + '/' + author + '?collection=' + collection, {credentials: 'include'});
    const data = await response.json();
    return data;
  } else {
    const response = await fetch(BASE_URL + '/' + author, {credentials: 'include'});
    const data = await response.json();
    return data;
  }
};