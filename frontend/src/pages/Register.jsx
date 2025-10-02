import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const { register: reg } = useAuth();  // Alias to avoid conflict

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await reg(formData.name, formData.email, formData.password);
    if (!result.success) setError(result.error);
  };

  return (
    <div className="card p-4" style={{ width: '400px' }}>
      <h3 className="text-center mb-4">Register</h3>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <input type="text" className="form-control" placeholder="Name" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required />
        </div>
        <div className="mb-3">
          <input type="email" className="form-control" placeholder="Email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} required />
        </div>
        <div className="mb-3">
          <input type="password" className="form-control" placeholder="Password" value={formData.password} onChange={(e) => setFormData({ ...formData, password: e.target.value })} required />
        </div>
        {error && <div className="alert alert-danger">{error}</div>}
        <button type="submit" className="btn btn-primary w-100">Register</button>
      </form>
      <div className="text-center mt-3">
        <a href="/login">Login</a>
      </div>
    </div>
  );
};

export default Register;