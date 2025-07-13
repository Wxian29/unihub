import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, clearError } from '../features/auth/authSlice';
import './LoginPage.css';

const LoginPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const [formErrors, setFormErrors] = useState({});

  // If already logged in, redirect to home page
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  // Clear error message
  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const validateForm = () => {
    const errors = {};
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

    console.log('Logging in...', formData);
    // Submit login
    const result = await dispatch(loginUser(formData));
    console.log('Login result:', result);
    
    if (loginUser.fulfilled.match(result)) {
      console.log('Login successful, redirecting to home page');
      navigate('/');
    } else if (loginUser.rejected.match(result)) {
      console.log('Login failed:', result.payload);
    }
  };

  return (
    <div className="login-page">
      <div className="container">
        <div className="login-form-container">
          <h2>Login to Uni Hub</h2>
          <form className="login-form" onSubmit={handleSubmit}>
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
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>
          <div className="login-footer">
            <p>
              Don't have an account? <Link to="/register">Register Now</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 