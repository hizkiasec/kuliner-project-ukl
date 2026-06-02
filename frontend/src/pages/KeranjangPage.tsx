import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { pesananApi } from '../services/api';
import { useNavigate, Link } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function KeranjangPage() {
  const { items, removeItem, updateJumlah, clearCart, total } = useCart();
  const [noMeja, setNoMeja] = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!noMeja) { toast.error('Masukkan nomor meja dulu'); return; }
    if (items.length === 0) { toast.error('Keranjang masih kosong'); return; }
    setLoading(true);
    try {
      await pesananApi.create({
        noMeja: parseInt(noMeja),
        catatan,
        items: items.map(i => ({ menuId: i.menuId, jumlah: i.jumlah, catatan: i.catatan })),
      });
      clearCart();
      toast.success('Pesanan berhasil! Silakan tunggu ya 🍜', {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' },
      });
      navigate('/pesanan-saya');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20">
        <div className="text-center animate-fade-up">
          <div className="text-7xl mb-6 animate-float">🛒</div>
          <h2 className="font-display text-2xl font-bold text-white mb-3">Keranjang Kosong</h2>
          <p className="text-[#7a7a8c] mb-8">Yuk tambahkan menu favoritmu!</p>
          <Link to="/menu" className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-semibold inline-block">
            Lihat Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-4xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-[#f5a623] text-sm font-medium tracking-widest uppercase">Checkout</span>
          <h1 className="font-display text-3xl font-bold text-white mt-1">Keranjang Pesanan</h1>
        </div>

        <div className="grid lg:grid-cols-5 gap-6">
          {/* Items list */}
          <div className="lg:col-span-3 space-y-3">
            {items.map((item) => (
              <div key={item.menuId} className="menu-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1c1c27] flex items-center justify-center text-xl flex-shrink-0">
                  🍽️
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white text-sm truncate">{item.nama}</p>
                  <p className="text-[#f5a623] text-xs font-semibold mt-0.5">
                    Rp {item.harga.toLocaleString('id-ID')}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <button
                    onClick={() => updateJumlah(item.menuId, item.jumlah - 1)}
                    className="w-7 h-7 rounded-full bg-[#1c1c27] hover:bg-[#252535] text-white font-bold flex items-center justify-center transition-colors"
                  >−</button>
                  <span className="w-6 text-center text-sm font-semibold text-white">{item.jumlah}</span>
                  <button
                    onClick={() => updateJumlah(item.menuId, item.jumlah + 1)}
                    className="w-7 h-7 rounded-full bg-[#1c1c27] hover:bg-[#252535] text-white font-bold flex items-center justify-center transition-colors"
                  >+</button>
                </div>
                <p className="text-white font-semibold text-sm w-20 text-right flex-shrink-0">
                  Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
                </p>
                <button onClick={() => removeItem(item.menuId)} className="text-[#7a7a8c] hover:text-[#f87171] transition-colors ml-1">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M18 6L6 18M6 6l12 12"/>
                  </svg>
                </button>
              </div>
            ))}
          </div>

          {/* Order summary */}
          <div className="lg:col-span-2">
            <div className="rounded-2xl p-6 sticky top-24" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.07)' }}>
              <h2 className="font-semibold text-white mb-5">Detail Pesanan</h2>

              <div className="space-y-4 mb-5">
                <div>
                  <label className="block text-xs font-medium text-[#7a7a8c] mb-2 uppercase tracking-wider">
                    Nomor Meja <span className="text-[#f87171]">*</span>
                  </label>
                  <input
                    type="number"
                    value={noMeja}
                    onChange={e => setNoMeja(e.target.value)}
                    placeholder="Contoh: 5"
                    min={1}
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-[#7a7a8c] mb-2 uppercase tracking-wider">
                    Catatan
                  </label>
                  <textarea
                    value={catatan}
                    onChange={e => setCatatan(e.target.value)}
                    placeholder="Tidak pedas, tambah nasi..."
                    className="input-dark w-full px-4 py-2.5 rounded-xl text-sm h-20 resize-none"
                  />
                </div>
              </div>

              <div className="glow-divider mb-5" />

              <div className="space-y-2 mb-5">
                {items.map(i => (
                  <div key={i.menuId} className="flex justify-between text-xs text-[#7a7a8c]">
                    <span>{i.nama} ×{i.jumlah}</span>
                    <span>Rp {(i.harga * i.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center mb-6">
                <span className="text-[#a0a0b0] text-sm">Total</span>
                <span className="text-xl font-bold gradient-text">Rp {total.toLocaleString('id-ID')}</span>
              </div>

              <button
                onClick={handleOrder}
                disabled={loading}
                className="btn-gold w-full py-3.5 rounded-xl font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"/>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"/>
                    </svg>
                    Memproses...
                  </span>
                ) : 'Pesan Sekarang 🚀'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
