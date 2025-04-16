import React, { useState } from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid email or password');
      }

      const data = await response.json();
      console.log('Login successful:', data);
      alert('Login Success!!!');
      localStorage.setItem('user', JSON.stringify(data));
  
      console.log("the session data:"+ localStorage.getItem('user'));
      navigate('/'); 
    } catch (err) {
      setError(err.message);  
      alert('Invalid email or password');
    }
    setSubmitting(false); 
  };

  return (
    <div className='login-page'>
      <div className='login-card'>
        <div className='logo-container'>
          <img src="logo3.png" alt='LogoM' className='logo-scholar' />
        </div>
        <div className='login-container'>
          <Formik
            initialValues={{ email: '', password: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            {({ isSubmitting }) => (
              <Form>
                <div>
                  <Field type="email" name="email" placeholder="Email" />
                  <ErrorMessage name="email" component="div" className="error" />
                </div>
                <div>
                  <Field type="password" name="password" placeholder="Password" />
                  <ErrorMessage name="password" component="div" className="error" />
                </div>
                {error && <div className="error">{error}</div>}
                <br />
                <div className='btnn'>
                  <button type="submit" className='login-btn' disabled={isSubmitting}>
                    {isSubmitting ? 'Logging In...' : 'Login'}
                  </button>
                </div>
              </Form>
            )}
          </Formik>

          <div className='Links'>
            <Link to="/forgot">Forgot Password?</Link>
            <p><Link to="/register">Register here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
