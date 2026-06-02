import { useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ nama: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password.length < 6) {
      toast.error('Password minimal 6 karakter');
      return;
    }
    setLoading(true);
    try {
      await register(form.nama, form.email, form.password);
      toast.success('Akun berhasil dibuat! Silakan login 🎉', {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' },
      });
      navigate('/login');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Registrasi gagal', {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(239,68,68,0.3)' },
      });
    } finally {
      setLoading(false);
    }
  };

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;
  const strengthLabel = ['', 'Lemah', 'Cukup', 'Kuat'][strength];
  const strengthColor = ['', '#ef4444', '#f5a623', '#4ade80'][strength];

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center px-4 relative overflow-hidden py-12">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#f5a623] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />

      <div className="relative w-full max-w-md animate-fade-up">
        <div className="text-center mb-10">
          <div className="inline-flex w-14 h-14 rounded-2xl bg-gold-gradient items-center justify-center text-2xl font-bold text-[#0a0a0f] mb-4 shadow-[0_0_30px_rgba(245,166,35,0.3)]">
            K
          </div>
          <h1 className="font-display text-3xl font-bold text-white">Buat Akun Baru</h1>
          <p className="text-[#7a7a8c] text-sm mt-2">Bergabung dan mulai memesan</p>
        </div>

        <div className="rounded-3xl p-8" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.07)' }}>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-sm font-medium text-[#a0a0b0] mb-2">Nama Lengkap</label>
              <input
                type="text"
                value={form.nama}
                onChange={e => setForm({ ...form, nama: e.target.value })}
                placeholder="Budi Santoso"
                required
                className="input-dark w-full px-4 py-3 rounded-xl text-sm"
              />
            </div>

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
                  placeholder="Min. 6 karakter"
                  required
                  className="input-dark w-full px-4 py-3 pr-12 rounded-xl text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#7a7a8c] hover:text-white transition-colors">
                  {showPass ? '🙈' : '👁️'}
                </button>
              </div>
              {form.password && (
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1 rounded-full bg-[#1c1c27] overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{ width: `${(strength / 3) * 100}%`, background: strengthColor }}
                    />
                  </div>
                  <span className="text-xs font-medium" style={{ color: strengthColor }}>{strengthLabel}</span>
                </div>
              )}
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
                  Membuat akun...
                </span>
              ) : 'Daftar Sekarang'}
            </button>
          </form>

          <div className="glow-divider my-6" />

          <p className="text-center text-sm text-[#7a7a8c]">
            Sudah punya akun?{' '}
            <Link to="/login" className="text-[#f5a623] hover:text-[#f5c842] font-medium transition-colors">
              Masuk di sini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
