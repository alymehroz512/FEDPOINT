import { User, Bell } from 'lucide-react';

const Header = () => {
  return (
    <header className="bg-light border-bottom p-3 d-flex justify-content-between align-items-center">
      <h5 className="mb-0">Welcome to Admin Panel</h5>
      <div className="d-flex align-items-center">
        <Bell size={20} className="me-3" />
        <User size={20} />
      </div>
    </header>
  );
};

export default Header;