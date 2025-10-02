import { Routes, Route } from 'react-router-dom';
import { BrowserRouter as Router } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/common/ProtectedRoute';
import Sidebar from './components/common/Sidebar';
import Header from './components/common/Header';
import Dashboard from './pages/Dashboard';
import AddProduct from './pages/AddProduct';
import Products from './pages/Products';
import CategoryProducts from './pages/CategoryProducts';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import ErrorBoundary from '../ErrorBoundary';

// Protected Layout (Sidebar + Header)
const ProtectedLayout = ({ children }) => (
  <div className="d-flex min-vh-100">
    <Sidebar />
    <div className="flex-grow-1">
      <Header />
      <main className="main-content p-4">
        {children}
      </main>
    </div>
  </div>
);

// Auth Layout (Centered, No Sidebar)
const AuthLayout = ({ children }) => (
  <div className="min-vh-100 d-flex align-items-center justify-content-center">
    {children}
  </div>
);

// 404 Fallback
const NotFound = () => <h1 className="text-center mt-5">404 - Page Not Found</h1>;

function App() {
  return (
    <ErrorBoundary>
      <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <AuthProvider>
          <Routes>
            {/* Auth Pages */}
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
            </Route>
            {/* Protected Pages */}
            <Route element={<ProtectedRoute />}>
              <Route element={<ProtectedLayout />}>
                <Route path="/" element={<Dashboard />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/products" element={<Products />} />
                <Route path="/category/:slug" element={<CategoryProducts />} />
                <Route path="/products/:slug" element={<CategoryProducts />} />
              </Route>
            </Route>
            {/* Fallback */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </Router>
    </ErrorBoundary>
  );
}

export default App;