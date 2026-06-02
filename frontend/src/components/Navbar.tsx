import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { totalItems } = useCart();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  const handleLogout = () => {
    logout();
    toast.success('Sampai jumpa! 👋');
    navigate('/');
  };

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-[#0a0a0f]/95 backdrop-blur-xl shadow-[0_1px_0_rgba(255,255,255,0.06)]'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-lg bg-gold-gradient flex items-center justify-center text-sm font-bold text-[#0a0a0f] shadow-[0_0_15px_rgba(245,166,35,0.4)] group-hover:shadow-[0_0_25px_rgba(245,166,35,0.6)] transition-all duration-300">
            K
          </div>
          <span className="font-display font-bold text-lg tracking-tight">
            <span className="text-white">Kuliner</span>
            <span className="gradient-text"> App</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden md:flex items-center gap-1">
          <NavLink to="/menu" active={isActive('/menu')}>Menu</NavLink>
          {user && <NavLink to="/pesanan-saya" active={isActive('/pesanan-saya')}>Pesanan Saya</NavLink>}
          {isAdmin && <NavLink to="/admin" active={isActive('/admin')}>⚡ Admin</NavLink>}
        </div>

        {/* Right side */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full glass">
                <div className="w-5 h-5 rounded-full bg-gold-gradient flex items-center justify-center text-[10px] font-bold text-[#0a0a0f]">
                  {user.nama.charAt(0).toUpperCase()}
                </div>
                <span className="text-sm text-[#7a7a8c]">
                  Halo, <span className="text-white font-medium">{user.nama.split(' ')[0]}</span>
                </span>
              </div>
              <button
                onClick={handleLogout}
                className="px-4 py-1.5 rounded-full border border-[rgba(255,255,255,0.1)] text-sm text-[#7a7a8c] hover:text-white hover:border-[rgba(255,255,255,0.2)] transition-all duration-200"
              >
                Logout
              </button>
            </>
          ) : (
            <Link
              to="/login"
              className="btn-gold px-5 py-2 rounded-full text-sm"
            >
              Masuk
            </Link>
          )}

          {/* Cart */}
          <Link to="/keranjang" className="relative group">
            <div className="w-9 h-9 rounded-full glass flex items-center justify-center hover:border-[rgba(245,166,35,0.3)] transition-all duration-200">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="text-[#7a7a8c] group-hover:text-white transition-colors">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
            </div>
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-gold-gradient rounded-full text-[9px] font-bold text-[#0a0a0f] flex items-center justify-center shadow-[0_0_8px_rgba(245,166,35,0.6)]">
                {totalItems}
              </span>
            )}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden w-9 h-9 glass rounded-full flex items-center justify-center"
        >
          <div className="space-y-1">
            <span className={`block w-4 h-0.5 bg-white transition-all ${menuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-white transition-all ${menuOpen ? 'opacity-0' : ''}`}></span>
            <span className={`block w-4 h-0.5 bg-white transition-all ${menuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
          </div>
        </button>
      </div>

      {/* Mobile menu */}
      {menuOpen && (
        <div className="md:hidden bg-[#13131a]/98 backdrop-blur-xl border-t border-[rgba(255,255,255,0.06)] px-6 py-4 space-y-2 animate-fade">
          <MobileNavLink to="/menu">Menu</MobileNavLink>
          {user && <MobileNavLink to="/pesanan-saya">Pesanan Saya</MobileNavLink>}
          {isAdmin && <MobileNavLink to="/admin">Admin Dashboard</MobileNavLink>}
          <MobileNavLink to="/keranjang">Keranjang {totalItems > 0 && `(${totalItems})`}</MobileNavLink>
          <div className="pt-2 border-t border-[rgba(255,255,255,0.06)]">
            {user ? (
              <button onClick={handleLogout} className="w-full text-left py-2 text-[#7a7a8c] text-sm">Logout</button>
            ) : (
              <Link to="/login" className="btn-gold block text-center py-2.5 rounded-xl text-sm">Masuk</Link>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}

function NavLink({ to, active, children }: { to: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active
          ? 'text-[#f5a623] bg-[rgba(245,166,35,0.1)]'
          : 'text-[#7a7a8c] hover:text-white hover:bg-[rgba(255,255,255,0.05)]'
      }`}
    >
      {children}
    </Link>
  );
}

function MobileNavLink({ to, children }: { to: string; children: React.ReactNode }) {
  return (
    <Link to={to} className="block py-2.5 text-sm text-[#a0a0b0] hover:text-white transition-colors border-b border-[rgba(255,255,255,0.04)]">
      {children}
    </Link>
  );
}
