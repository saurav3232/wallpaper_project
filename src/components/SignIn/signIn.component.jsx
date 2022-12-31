import './signIn.styles.css'
import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { signInWithGooglePopup,signInAuthUserWithEmailAndPassword} from "../../utils/Firebase/Firebase.utils";
const defaultFormFields = {
  email: '',
  password: '',
};
const SignIn = () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { email, password } = formFields;
  const resetFormFields = () => { 
    setFormFields(defaultFormFields);
  };
  const logGoogleUser = async () => {
    await signInWithGooglePopup();
  };
  const handleSubmit = async (event) => {
    event.preventDefault();
    // console.log(email, password);
    try {
      await signInAuthUserWithEmailAndPassword(
        email,
        password
      );
      resetFormFields();
      // console.log(resp);
    } catch (error) {
      switch (error.code) {
        case 'auth/wrong-password':
          alert('incorrect password for email');
          break;
        case 'auth/user-not-found':
          alert('no user associated with this email');
          break;
        default:
          console.log(error);
      }
    }
  };
  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };
  return (
    <div className='signIn-form-container'>
    <h1>Sign In</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-3 ">
          <label  className="form-label">Email address:</label>
          <input type="email" className="form-control " aria-describedby="emailHelp" onChange={handleChange}  name='email' value={email}/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label  className="form-label">Password:</label>
          <input type="password" className="form-control" onChange={handleChange} name='password' value={password}/>
        </div>
        <button type="submit" className="btn btn-primary" id="signInbutton">Sign in</button>
        <button type="button" className="btn btn-dark" onClick={logGoogleUser}>Google SignIn</button>
      </form>
        <div>
          <h4>Don't have an account <NavLink to='/signup'>Sign Up</NavLink> </h4>
        </div>
    </div>
  )
}

export default SignIn;