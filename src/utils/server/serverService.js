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


export const deleteFromTable = async (tableString, td) => {

  const requestOptions = {
    method: 'DELETE',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch(`http://localhost:4000/${tableString}/${td.id}`,requestOptions);
  if(response.status != 200){
    throw new Error(`couldn't delete id: ${td.id} \nfrom table: ${tableString}`)
  }
  let data = await response.json();
  return data;
};

export const updateValueInTable = async (tableString, object) => {

  const requestOptions = {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json','Authorization': token },
    body: JSON.stringify(object)
  };

  const response = await fetch(`http://localhost:4000/${tableString}/${object.id}`,requestOptions);
  if(response.status != 200){
    throw new Error(`couldn't update a value in table: ${tableString}`)
  }
  let data = await response.json();
  return data;
};

export const setNewValueInTable = async (tableString, object) => {

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json','Authorization': token },
    body: JSON.stringify(object)
  };

  const response = await fetch(`http://localhost:4000/${tableString}`,requestOptions);
  if(response.status != 200){
    throw new Error(`couldn't post a value in table: ${tableString}`)
  }
  let data = await response.json();
  return data;
};

export const getCategories = async () => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/categories',requestOptions);
  if(response.status != 200){
    throw new Error("couldn't get the categories")
  }
  const data = await response.json();
  return data;
};

export const getOrders = async () => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/orders',requestOptions);
  if(response.status != 200){
    throw new Error("couldn't get the categories")
  }
  const data = await response.json();
  return data;
};


export const getUsers = async () => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/users',requestOptions);
  if(response.status != 200){
    throw new Error("couldn't get the usrs")
  }
  const data = await response.json();

  var users = [];
  data.forEach(d => {
    //delete d.ordersId;
    users.push(d);
  })
  return users;
};


export const getItems = async (isForAdminPage = false) => {

  const requestOptions = {
    method: 'GET',
    headers: { 'Content-Type': 'application/json','Authorization': token },
  };

  const response = await fetch('http://localhost:4000/items',requestOptions);
  if(response.status != 200){
    throw new Error("couldn't get the items")
  }
  const data = await response.json();

  var items = {};
  if(isForAdminPage){
    if(!items.list){
      items.list =[];
    }
    data.forEach(d => {
      delete d.imageUrl;
      items.list.push(d);
    })
  }
  else{
    data.forEach(d => {
      let categoryName = d.category.toLowerCase();
      delete d.category;
      if (items[categoryName] == undefined) {
        items[categoryName] = [];
      }
      items[categoryName].push(d);
    })
  }
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
  return data.token;
};



export const signOutUser = async () => {
  localStorage.setItem("token", "")
  token = "";
};

