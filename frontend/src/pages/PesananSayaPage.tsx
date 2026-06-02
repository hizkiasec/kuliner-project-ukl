import { useEffect, useState } from 'react';
import { pesananApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  PENDING:    { label: 'Menunggu',  cls: 'badge-pending',    icon: '⏳' },
  DIPROSES:   { label: 'Diproses',  cls: 'badge-diproses',   icon: '👨‍🍳' },
  SELESAI:    { label: 'Selesai',   cls: 'badge-selesai',    icon: '✅' },
  DIBATALKAN: { label: 'Dibatalkan',cls: 'badge-dibatalkan', icon: '❌' },
};

export default function PesananSayaPage() {
  const { user } = useAuth();
  const [pesanans, setPesanans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    pesananApi.getMine()
      .then(r => setPesanans(r.data))
      .catch(() => toast.error('Gagal memuat pesanan'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) return (
    <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center pt-20">
      <div className="text-center animate-fade-up">
        <div className="text-6xl mb-6">🔒</div>
        <h2 className="font-display text-2xl font-bold text-white mb-3">Login Dulu Ya</h2>
        <p className="text-[#7a7a8c] mb-8">Kamu perlu login untuk melihat pesanan</p>
        <Link to="/login" className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-semibold inline-block">Login</Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-3xl mx-auto px-6">
        <div className="mb-8">
          <span className="text-[#f5a623] text-sm font-medium tracking-widest uppercase">Riwayat</span>
          <h1 className="font-display text-3xl font-bold text-white mt-1">Pesanan Saya</h1>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1,2,3].map(i => (
              <div key={i} className="rounded-2xl p-6 bg-[#13131a] animate-pulse">
                <div className="flex justify-between mb-4">
                  <div className="h-4 w-32 bg-[#1c1c27] rounded-lg"/>
                  <div className="h-4 w-20 bg-[#1c1c27] rounded-full"/>
                </div>
                <div className="h-3 w-full bg-[#1c1c27] rounded-lg mb-2"/>
                <div className="h-3 w-2/3 bg-[#1c1c27] rounded-lg"/>
              </div>
            ))}
          </div>
        ) : pesanans.length === 0 ? (
          <div className="text-center py-24 animate-fade-up">
            <div className="text-7xl mb-6 animate-float">📋</div>
            <h2 className="font-display text-2xl font-bold text-white mb-3">Belum Ada Pesanan</h2>
            <p className="text-[#7a7a8c] mb-8">Yuk mulai pesan makanan favoritmu!</p>
            <Link to="/menu" className="btn-gold px-8 py-3.5 rounded-2xl text-sm font-semibold inline-block">Pesan Sekarang</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {pesanans.map((p, i) => {
              const s = STATUS_CONFIG[p.status] || { label: p.status, cls: 'badge-pending', icon: '❓' };
              return (
                <div
                  key={p.id}
                  className="menu-card rounded-2xl p-5 animate-fade-up"
                  style={{ animationDelay: `${i * 0.06}s`, opacity: 0 }}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-white">Pesanan #{p.id}</span>
                        <span className="text-[#7a7a8c] text-sm">· Meja {p.noMeja}</span>
                      </div>
                      <span className="text-xs text-[#7a7a8c] mt-0.5 block">
                        {new Date(p.createdAt).toLocaleDateString('id-ID', {
                          day: 'numeric', month: 'long', year: 'numeric',
                          hour: '2-digit', minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1.5 rounded-full flex items-center gap-1.5 ${s.cls}`}>
                      {s.icon} {s.label}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    {p.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between text-sm">
                        <span className="text-[#a0a0b0]">{item.menu.nama} <span className="text-[#7a7a8c]">×{item.jumlah}</span></span>
                        <span className="text-[#a0a0b0]">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="glow-divider mb-4" />

                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      {p.status === 'PENDING' && (
                        <div className="flex items-center gap-1.5 text-xs text-[#f5a623]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#f5a623] animate-pulse"></span>
                          Menunggu konfirmasi...
                        </div>
                      )}
                      {p.status === 'DIPROSES' && (
                        <div className="flex items-center gap-1.5 text-xs text-[#60a5fa]">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#60a5fa] animate-pulse"></span>
                          Sedang dimasak...
                        </div>
                      )}
                    </div>
                    <span className="font-bold gradient-text text-base">
                      Rp {p.totalHarga.toLocaleString('id-ID')}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
