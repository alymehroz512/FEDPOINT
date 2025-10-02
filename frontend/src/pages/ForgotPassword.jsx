// ForgotPassword.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { forgot } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await forgot(email);
    if (result.success) {
      setMessage('OTP sent!');
      setTimeout(() => navigate('/reset-password'), 2000);
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="card p-4" style={{ width: '400px' }}>
      <h3 className="text-center mb-4">Forgot Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}
        <button type="submit" className="btn btn-primary w-100">Send OTP</button>
      </form>
    </div>
  );
};

export default ForgotPassword;