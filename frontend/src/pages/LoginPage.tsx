import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(form.email, form.password);
      toast.success('Selamat datang kembali! 🎉', {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' },
      });
      navigate('/menu');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Email atau password salah', {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(239,68,68,0.3)' },
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#f5a623] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
        backgroundSize: '60px 60px',
      }} />

      <div className="relative w-full max-w-md animate-fade-up">
        {/* Logo */}
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gold-gradient items-center justify-center text-2xl font-bold text-[#0a0a0f] mb-4 shadow-[0_0_30px_rgba(245,166,35,0.3)]">
            K
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Selamat Datang</h1>
          <p className="text-[#7a7a8c] text-sm mt-2">Masuk ke akun Kuliner App kamu</p>
        </div>

        {/* Card */}
        <div className="rounded-3xl p-8" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="kamu@email.com"
                required
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="••••••••"
                  required
                  className="input-dark w-full px-4 py-3 pr-12 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a7a8c] hover:text-white transition-colors"
                >
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm mt-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                  </svg>
                  Memproses...
                </span>
              ) : 'Masuk Sekarang'}
            </button>
          </form>

          <div className="glow-divider my-6" />

          <p className="text-center text-sm text-[#7a7a8c]">
            Belum punya akun?{' '}
            <Link to="/register" className="text-[#f5a623] hover:text-[#f5c842] font-medium transition-colors">
              Daftar gratis
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
