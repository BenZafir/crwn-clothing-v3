import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import './App.scss';
import { Routes, Route } from 'react-router-dom';
import Home from './routes/home/home.component';
import Navigation from './routes/navigation/navigation.component';
import Authentication from './routes/authentication/authentication.component';
import Shop from './routes/shop/shop.component';
import Checkout from './routes/checkout/checkout.component';
import Admin from './routes/admin/admin.component';
import { setCurrentUser } from './store/user/user.action';
import { isExpired, decodeToken } from "react-jwt";


const App = () => {
  const dispatch = useDispatch();
  let token = localStorage.getItem("token")
  const myDecodedToken = decodeToken(token);
  if(myDecodedToken){
    dispatch(setCurrentUser({name: myDecodedToken.name,isAdmin: myDecodedToken.isAdmin }));
  }
  return (
    <Routes>
      <Route path='/' element={<Navigation />}>
        <Route index element={<Home />} />
        <Route path='shop/*' element={<Shop />} />
        <Route path='auth' element={<Authentication />} />
        <Route path='checkout' element={<Checkout />} />
        <Route path='admin' element={<Admin />} />
      </Route>
    </Routes>
  );
};

export default App;
