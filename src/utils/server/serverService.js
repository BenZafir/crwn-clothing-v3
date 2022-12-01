import localStorage from 'redux-persist/es/storage';

let token;
localStorage.getItem("token")
.then(data => token=data);

export const setNewOrder = async (selectCartItems) => {
  selectCartItems = selectCartItems;
  let itemsId =[];
  selectCartItems.forEach(i => {
    for (let index = 0; index < i.quantity; index++) {
      itemsId.push(i.id)
    }
  })
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': token },
    body: JSON.stringify({itemsId: itemsId })
  };

  const response = await fetch('http://localhost:4000/order',requestOptions);
  const data = await response.json();
  return data;
};

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
  if(response.status == '404'){
    return data;
  }
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
  if(response.status != 200){
    throw new Error("already-in-use");
  }
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
  if (response.status != 200){
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

