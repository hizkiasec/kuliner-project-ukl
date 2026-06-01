import { Routes, Route } from 'react-router-dom';
import { AuthProvider } from './hooks/useAuth';
import { CartProvider } from './hooks/useCart';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import KeranjangPage from './pages/KeranjangPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import PesananSayaPage from './pages/PesananSayaPage';
import AdminPage from './pages/AdminPage';

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/menu" element={<MenuPage />} />
            <Route path="/keranjang" element={<KeranjangPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/pesanan-saya" element={<PesananSayaPage />} />
            <Route path="/admin" element={<AdminPage />} />
          </Routes>
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
