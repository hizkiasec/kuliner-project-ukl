import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('Berhasil logout');
    navigate('/');
  };

  return (
    <nav className="bg-primary-600 text-white shadow-md">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-xl font-bold flex items-center gap-2">
          🍜 Kuliner App
        </Link>

        <div className="flex items-center gap-4">
          <Link to="/menu" className="hover:text-primary-100 transition">
            Menu
          </Link>

          {user ? (
            <>
              <Link to="/pesanan-saya" className="hover:text-primary-100 transition">
                Pesanan Saya
              </Link>
              {isAdmin && (
                <Link to="/admin" className="hover:text-primary-100 transition font-semibold">
                  Admin
                </Link>
              )}
              <span className="text-primary-200 text-sm">Halo, {user.nama}</span>
              <button
                onClick={handleLogout}
                className="bg-white text-primary-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-50 transition"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="bg-white text-primary-600 px-3 py-1 rounded-md text-sm font-medium hover:bg-primary-50 transition"
            >
              Login
            </Link>
          )}

          <Link to="/keranjang" className="relative">
            <span className="text-2xl">🛒</span>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                {totalItems}
              </span>
            )}
          </Link>
        </div>
      </div>
    </nav>
  );
}
