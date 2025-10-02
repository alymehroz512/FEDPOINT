import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X } from 'lucide-react';

const Sidebar = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { logout } = useAuth();

  return (
    <div className={`sidebar vh-100 p-3 border-end ${collapsed ? 'w-0' : ''}`} style={{ transition: 'width 0.3s', minWidth: collapsed ? '0' : '250px' }}>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className={`mb-0 ${collapsed ? 'd-none' : ''}`}>Admin Dashboard</h4>
        <button className="btn btn-link p-0" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <Menu size={20} /> : <X size={20} />}
        </button>
      </div>
      <nav className="nav flex-column">
        <Link className="nav-link" to="/">Dashboard</Link>
        <Link className="nav-link" to="/add-product">Add Product</Link>
        <Link className="nav-link" to="/products">All Products</Link>
        <hr />
        <button className="btn btn-link nav-link text-start" onClick={logout}>Logout</button>
      </nav>
    </div>
  );
};

export default Sidebar;