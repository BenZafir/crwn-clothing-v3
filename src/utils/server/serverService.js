
import localStorage from 'redux-persist/es/storage';

let token = "";



export const getCategories = async () => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/categories',requestOptions);
  const data = await response.json();
  return data;
};


export const getItems = async () => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/items',requestOptions);
  const data = await response.json();

  var items = {};
  data.forEach(d => {
    let categoryName = d.category.toLowerCase();
    delete d.category;
    if (items[categoryName] == undefined) {
      items[categoryName] = [];
    }
    items[categoryName].push(d);
  })
  return items;
};


export const createAuthUserWithEmailAndPassword = async (displayName, newEmail, newPassword) => {
  if (!displayName || !newEmail || !newPassword) return;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': token },
    body: JSON.stringify({ name: displayName, password: newPassword, email: newEmail })
  };

  const response = await fetch('http://localhost:4000/user', requestOptions);
  const data = await response.json();
};

export const signInAuthUserWithEmailAndPassword = async (userName, password) => {
  if (!userName || !password) return;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': token },
    body: JSON.stringify({ userName: userName, password: password })
  };

  const response = await fetch('http://localhost:4000/loggin', requestOptions);
  if (!response.ok){
    throw new Error("InvalidArgumentExcpetion");
  }
  const data = await response.json();
  localStorage.setItem("token", data.token)
  token = `Bearer ${data.token}`;
};



export const signOutUser = async () => {
  localStorage.setItem("token", "")
  token = "";
};

