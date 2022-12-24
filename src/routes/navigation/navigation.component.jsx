import { Fragment } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import CartIcon from '../../components/cart-icon/cart-icon.component';
import CartDropdown from '../../components/cart-dropdown/cart-dropdown.component';

import { selectCurrentUser } from '../../store/user/user.selector';
import { selectIsCartOpen } from '../../store/cart/cart.selector';

import { ReactComponent as CrwnLogo } from '../../assets/store-svgrepo-com.svg';
import { signOutUser } from '../../utils/server/serverService';

import {
  NavigationContainer,
  NavLinks,
  NavLink,
  LogoContainer,
} from './navigation.styles';

import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.action';

const Navigation = () => {
  const navigate = useNavigate();
  const currentUser = useSelector(selectCurrentUser);
  const isCartOpen = useSelector(selectIsCartOpen);
  const dispatch = useDispatch();
  const signout = () =>{
    dispatch(setCurrentUser(""));
    signOutUser();
    navigate("/")
  }


  return (
    <Fragment>
      <NavigationContainer>
        <LogoContainer to='/'>
          <CrwnLogo className='logo' style={{height:40,width:40}} />
        </LogoContainer>
        <NavLinks>
        {!currentUser?.isAdmin ? (
            <NavLink as='span'></NavLink>
          ) : (
            <NavLink to='/admin'>ADMIN</NavLink>
          )}
          <NavLink to='/shop'>SHOP</NavLink>
          {currentUser ? (
            <NavLink as='span' onClick={signout}>
              SIGN OUT
            </NavLink>
          ) : (
            <NavLink to='/auth'>SIGN IN</NavLink>
          )}
          <CartIcon />
        </NavLinks>
        {isCartOpen && <CartDropdown />}
      </NavigationContainer>
      <Outlet />
    </Fragment>
  );
};

export default Navigation;
