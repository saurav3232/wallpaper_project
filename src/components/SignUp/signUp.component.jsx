import './signUp.styles.css'
import { useState } from 'react';
import { createAuthUserWithEmailAndPassword,createUserDocumentFromAuth } from '../../utils/Firebase/Firebase.utils';
import { NavLink } from 'react-router-dom';
const defaultFormFields = {
  displayName: "",
  email: "",
  password: "",
  confirmPassword: "",
};
const SignUp= () => {
  const [formFields, setFormFields] = useState(defaultFormFields);
  const { displayName, email, password, confirmPassword } = formFields;

  const resetFormFields = () => {
    setFormFields(defaultFormFields);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      alert('passwords do not match');
      return;
    }

    try {
      const { user } = await createAuthUserWithEmailAndPassword(
        email,
        password
      );

      await createUserDocumentFromAuth(user, { displayName });
      resetFormFields();
    } catch (error) {
      if (error.code === 'auth/email-already-in-use') {
        alert('Cannot create user, email already in use');
      } else {
        console.log('user creation encountered an error', error);
      }
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;

    setFormFields({ ...formFields, [name]: value });
  };

  return (
    <div className='signUp-form-container'>
    <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div className="input-group mb-3">
          <span className="input-group-text" id="basic-addon1">Display Name:</span>
          <input type="text" className="form-control" name="displayName" placeholder="DisplayName" aria-label="Username" aria-describedby="basic-addon1" onChange={handleChange} value={displayName} required/>
        </div>
        <div className="mb-3 ">
          <label  className="form-label">Email address:</label>
          <input type="email" className="form-control " aria-describedby="emailHelp" onChange={handleChange} value={email}  name='email' required/>
          <div id="emailHelp" className="form-text">We'll never share your email with anyone else.</div>
        </div>
        <div className="mb-3">
          <label  className="form-label">Password:</label>
          <input type="password" className="form-control" onChange={handleChange} name='password' value={password} required/>
        </div>
        <div className="mb-3">
          <label  className="form-label">Confirm password:</label>
          <input type="password" className="form-control" onChange={handleChange} name="confirmPassword" value={confirmPassword} required/>
        </div>
        <button type="submit" className="btn btn-primary" id="signInbutton">Sign Up</button>
      </form>
      <div>
          <h4>Already have an account <NavLink to='/signin'>Sign In</NavLink> </h4>
        </div>
      </div>
  )
}

export default SignUp;