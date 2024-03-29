import { useState } from 'react';
import FormInput from '../form-input/form-input.component';
import Button, { BUTTON_TYPE_CLASSES } from '../button/button.component';
import { useNavigate } from "react-router-dom";
import { isExpired, decodeToken } from "react-jwt";
import {
  signInAuthUserWithEmailAndPassword,
} from '../../utils/server/serverService';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../../store/user/user.action';


import { SignInContainer, ButtonsContainer } from './sign-in-form.styles';

const defaultFormFields = {
  userName: '',
  password: '',
};

const SignInForm = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { userName, password } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const token = await signInAuthUserWithEmailAndPassword(userName, password);
      const myDecodedToken = decodeToken(token);

      
      resetFormFields();
      dispatch(setCurrentUser({name: myDecodedToken.name, isAdmin: myDecodedToken.isAdmin }));
      navigate("/")

    } catch (error) {
      console.log('user sign in failed', error);
      alert('wrong user name or password')
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    
    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <SignInContainer>
      <h2>Already have an account?</h2>
      <span>Sign in with your user name and password</span>
      <form onSubmit={handleSubmit}>
        <FormInput
          label='user name'
          type='text'
          required
          onChange={handleChange}
          name='userName'
          value={userName}
        />

        <FormInput
          label='Password'
          type='password'
          required
          onChange={handleChange}
          name='password'
          value={password}
        />
        <ButtonsContainer>
          <Button type='submit'>Sign In</Button>
        </ButtonsContainer>
      </form>
    </SignInContainer>
  );
};

export default SignInForm;
