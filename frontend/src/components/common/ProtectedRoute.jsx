import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="text-center mt-5">Loading...</div>;
  return user ? children : <Navigate to="/login" replace />;
};

export default ProtectedRoute;