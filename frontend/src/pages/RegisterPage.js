import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser, clearError } from '../features/auth/authSlice';
import './RegisterPage.css';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    password_confirm: '',
    first_name: '',
    last_name: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // Clear error message
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
    
    if (!formData.username) {
      errors.username = 'Please enter a username';
    } else if (formData.username.length < 3) {
      errors.username = 'Username must be at least 3 characters';
    }
    
    if (!formData.email) {
      errors.email = 'Please enter your email address';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email address';
    }
    
    if (!formData.password) {
      errors.password = 'Please enter your password';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    }
    
    if (!formData.password_confirm) {
      errors.password_confirm = 'Please confirm your password';
    } else if (formData.password !== formData.password_confirm) {
      errors.password_confirm = 'Passwords do not match';
    }
    
    if (!formData.first_name) {
      errors.first_name = 'Please enter your first name';
    }
    
    if (!formData.last_name) {
      errors.last_name = 'Please enter your last name';
    }
    
    return errors;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
    // Clear the error for the corresponding field
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: '',
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    // Submit registration
    const result = await dispatch(registerUser(formData));
    if (registerUser.fulfilled.match(result)) {
      // Registration successful, redirect to login page
      navigate('/login');
    }
  };

  return (
    <div className="register-page">
      <div className="container">
        <div className="register-form-container">
          <h2>Register for Uni Hub</h2>
          <form className="register-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="first_name">First Name</label>
                <input
                  type="text"
                  id="first_name"
                  name="first_name"
                  className={`form-control ${formErrors.first_name ? 'error' : ''}`}
                  value={formData.first_name}
                  onChange={handleChange}
                  placeholder="Enter your first name"
                  disabled={loading}
                />
                {formErrors.first_name && (
                  <span className="error-message">{formErrors.first_name}</span>
                )}
              </div>
              <div className="form-group">
                <label htmlFor="last_name">Last Name</label>
                <input
                  type="text"
                  id="last_name"
                  name="last_name"
                  className={`form-control ${formErrors.last_name ? 'error' : ''}`}
                  value={formData.last_name}
                  onChange={handleChange}
                  placeholder="Enter your last name"
                  disabled={loading}
                />
                {formErrors.last_name && (
                  <span className="error-message">{formErrors.last_name}</span>
                )}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input
                type="text"
                id="username"
                name="username"
                className={`form-control ${formErrors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter your username"
                disabled={loading}
              />
              {formErrors.username && (
                <span className="error-message">{formErrors.username}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input
                type="email"
                id="email"
                name="email"
                className={`form-control ${formErrors.email ? 'error' : ''}`}
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                disabled={loading}
              />
              {formErrors.email && (
                <span className="error-message">{formErrors.email}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                name="password"
                className={`form-control ${formErrors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                disabled={loading}
              />
              {formErrors.password && (
                <span className="error-message">{formErrors.password}</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password_confirm">Confirm Password</label>
              <input
                type="password"
                id="password_confirm"
                name="password_confirm"
                className={`form-control ${formErrors.password_confirm ? 'error' : ''}`}
                value={formData.password_confirm}
                onChange={handleChange}
                placeholder="Re-enter your password"
                disabled={loading}
              />
              {formErrors.password_confirm && (
                <span className="error-message">{formErrors.password_confirm}</span>
              )}
            </div>
            {error && (
              <div className="alert alert-error">
                {error}
              </div>
            )}
            <button 
              type="submit" 
              className="btn btn-primary"
              disabled={loading}
            >
              {loading ? 'Registering...' : 'Register'}
            </button>
          </form>
          <div className="register-footer">
            <p>
              Already have an account? <Link to="/login">Login Now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage; 