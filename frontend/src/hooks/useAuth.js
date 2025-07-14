import { useSelector, useDispatch } from 'react-redux';
import { getUserProfile, logoutUser } from '../features/auth/authSlice';

/**
 * Custom hook for authentication state and actions
 */
const useAuth = () => {
  const dispatch = useDispatch();
  const { user, isAuthenticated, loading, error } = useSelector((state) => state.auth);

  const fetchProfile = () => dispatch(getUserProfile());
  const logout = () => dispatch(logoutUser());

  return {
    user,
    isAuthenticated,
    loading,
    error,
    fetchProfile,
    logout,
  };
};

export default useAuth; 