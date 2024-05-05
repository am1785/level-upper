const BASE_URL = 'http://192.168.1.8:5001/users';

export const fetchUser = async (_id:string) => {
    const response = await fetch(BASE_URL + '/' + _id, {credentials: 'include'});
    const data = await response.json();
    return data;
  };

export const editUserData = async (userId:string, updateData:object) => {
    const response = await fetch(BASE_URL + '/' + userId, {
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

  export const deleteUser = async (userId:string) => {
    const response = await fetch(BASE_URL + '/' + userId, {
      method: 'DELETE',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    const data = await response.json();
    return data;
  };