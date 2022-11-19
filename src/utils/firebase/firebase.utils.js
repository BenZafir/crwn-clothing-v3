import { initializeApp } from 'firebase/app';
import { Subject } from 'rxjs';
import {
  getAuth,
  signInWithRedirect,
  signInWithPopup,
  GoogleAuthProvider,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  collection,
  writeBatch,
  query,
  getDocs,
} from 'firebase/firestore';
import localStorage from 'redux-persist/es/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBCwX_TQfG-tVwS9fpjDg0LbzFlA5eEwis",
  authDomain: "crwn-ecom-db-6d5ed.firebaseapp.com",
  projectId: "crwn-ecom-db-6d5ed",
  storageBucket: "crwn-ecom-db-6d5ed.appspot.com",
  messagingSenderId: "800959956705",
  appId: "1:800959956705:web:e40b41de4c3b1596b1d9a0"
};

const firebaseApp = initializeApp(firebaseConfig);

const googleProvider = new GoogleAuthProvider();

googleProvider.setCustomParameters({
  prompt: 'select_account',
});

export const auth = getAuth();

export const db = getFirestore();

export const getCategoriesAndDocuments = async () => {
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

export const createUserDocumentFromAuth = async (
  userAuth,
  additionalInformation = {}
) => {
  if (!userAuth) return;

  const userDocRef = doc(db, 'users', userAuth.uid);

  const userSnapshot = await getDoc(userDocRef);

  if (!userSnapshot.exists()) {
    const { displayName, email } = userAuth;
    const createdAt = new Date();

    try {
      await setDoc(userDocRef, {
        displayName,
        email,
        createdAt,
        ...additionalInformation,
      });
    } catch (error) {
      console.log('error creating the user', error.message);
    }
  }

  return userDocRef;
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

  //return await createUserWithEmailAndPassword(auth, email, password);
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


  //return await signInWithEmailAndPassword(auth, email, password);
};



export const signOutUser = async () => {
  localStorage.setItem("token", "")

  //await signOut(auth)
};

// export const onAuthStateChangedListener = (callback) =>{
//   var subject = new Subject();
//   return subject.subscribe(callback.call(user))
// }
//   //onAuthStateChanged(auth, callback);
