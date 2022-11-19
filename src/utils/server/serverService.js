
import localStorage from 'redux-persist/es/storage';


export const getCategories = async () => {
  const response = await fetch('http://localhost:4000/items');
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
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: displayName, password: newPassword, email: newEmail })
  };

  const response = await fetch('http://localhost:4000/user', requestOptions);
  const data = await response.json();
};

export const signInAuthUserWithEmailAndPassword = async (userName, password) => {
  if (!userName || !password) return;

  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ userName: userName, password: password })
  };

  const response = await fetch('http://localhost:4000/loggin', requestOptions);
  if (!response.ok){
    throw new Error("InvalidArgumentExcpetion");
  }
  const data = await response.json();
  localStorage.setItem("token", data.token)
};



export const signOutUser = async () => {
  localStorage.setItem("token", "")
};

