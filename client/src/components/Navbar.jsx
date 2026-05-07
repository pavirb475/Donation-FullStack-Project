import { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { FaHandHoldingHeart } from 'react-icons/fa';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center text-primary-dark font-bold text-xl">
              <FaHandHoldingHeart className="mr-2 text-2xl text-amber-600" />
              GiveHope
            </Link>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/campaigns" className="text-gray-700 hover:text-amber-600 font-medium">Donate</Link>
            <Link to="/volunteer" className="text-gray-700 hover:text-amber-600 font-medium">Volunteer</Link>
            
            {user ? (
              <div className="flex items-center space-x-4">
                <Link to="/dashboard" className="text-gray-700 hover:text-amber-600 font-medium">Dashboard</Link>
                {user.role === 'admin' && (
                  <Link to="/admin" className="text-gray-700 hover:text-amber-600 font-medium">Admin Panel</Link>
                )}
                <button
                  onClick={handleLogout}
                  className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md font-medium hover:bg-gray-300 transition"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link to="/login" className="text-gray-700 hover:text-amber-600 font-medium">Login</Link>
                <Link to="/register" className="bg-amber-600 text-white px-4 py-2 rounded-md font-medium hover:bg-amber-700 transition shadow-sm">
                  Register
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
