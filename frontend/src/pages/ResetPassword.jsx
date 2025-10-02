// ResetPassword.jsx
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
  const [formData, setFormData] = useState({ email: '', otp: '', newPassword: '' });
  const [error, setError] = useState('');
  const { reset } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await reset(formData.email, formData.otp, formData.newPassword);
    if (result.success) {
      navigate('/login');
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="card p-4" style={{ width: '400px' }}>
      <h3 className="text-center mb-4">Reset Password</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="OTP" value={formData.otp} onChange={(e) => setFormData({ ...formData, otp: e.target.value })} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="New Password" value={formData.newPassword} onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Reset</button>
      </form>
    </div>
  );
};

export default ResetPassword;