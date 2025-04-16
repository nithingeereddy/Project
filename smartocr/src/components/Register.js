import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import { Link, useNavigate } from 'react-router-dom';
import * as Yup from 'yup';
import './Register.css';
import Login from './Login';

const Register = () => {
  const navigate = useNavigate();

  const validationSchema = Yup.object({
    firstName: Yup.string().required('First Name is required'),
    lastName: Yup.string().required('Last Name is required'),
    email: Yup.string().email('Invalid email format').required('Email is required'),
    password: Yup.string().required('Password is required').min(6, 'Password should be at least 6 characters'),
    confirmPassword: Yup.string()
      .oneOf([Yup.ref('password'), null], 'Passwords must match')
      .required('Confirm Password is required'),
  });

  const handleSubmit = async (values, { setSubmitting }) => {
    try {
      const response = await fetch('http://localhost:8080/api/user/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          password: values.password,
        }),
      });

      if (!response.ok) {
        throw new Error('Registration failed');
      }

      const data = await response.json();
      console.log('Registration successful:', data);
      alert('Registration Successful!');
      navigate('/login'); // Redirect to login page after registration
    } catch (err) {
      alert('Registration failed');
    }
    setSubmitting(false);
  };

  return (
    <div className='register-page'>
      <div className='register-card'>
        <h2 className='title'>Sign up</h2>
        <div className='register-container'>
          <Formik
            initialValues={{ firstName: '', lastName: '', email: '', password: '', confirmPassword: '' }}
            validationSchema={validationSchema}
            onSubmit={handleSubmit}
          >
            <Form>
              <div>
                <Field type="text" name="firstName" placeholder="First Name" />
                <ErrorMessage name="firstName" component="div" className="error" />
              </div>
              <div>
                <Field type="text" name="lastName" placeholder="Last Name" />
                <ErrorMessage name="lastName" component="div" className="error" />
              </div>
              <div>
                <Field type="email" name="email" placeholder="Email" />
                <ErrorMessage name="email" component="div" className="error" />
              </div>
              <div>
                <Field type="password" name="password" placeholder="Password" />
                <ErrorMessage name="password" component="div" className="error" />
              </div>
              <div>
                <Field type="password" name="confirmPassword" placeholder="Re-enter Password" />
                <ErrorMessage name="confirmPassword" component="div" className="error" />
              </div>
              <div className='btnn'>
                <button type="submit" className='register-btn'>Register</button>
              </div>
            </Form>
          </Formik>

          <div className='Links'>
            <p><Link to="/login">Already have an account? Login here</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
