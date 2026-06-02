import { useEffect, useState } from 'react';
import { pesananApi, menuApi, kategoriApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  PENDING:    { label: 'Menunggu',   cls: 'badge-pending',    icon: '⏳' },
  DIPROSES:   { label: 'Diproses',   cls: 'badge-diproses',   icon: '👨‍🍳' },
  SELESAI:    { label: 'Selesai',    cls: 'badge-selesai',    icon: '✅' },
  DIBATALKAN: { label: 'Dibatalkan', cls: 'badge-dibatalkan', icon: '❌' },
};
const STATUS_OPTIONS = ['PENDING', 'DIPROSES', 'SELESAI', 'DIBATALKAN'];

type Tab = 'pesanan' | 'menu' | 'kategori';

export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('pesanan');
  const [pesanans, setPesanans] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); toast.error('Akses ditolak'); return; }
  }, [user, isAdmin]);

  useEffect(() => {
    if (tab === 'pesanan') fetchPesanan();
    if (tab === 'menu') fetchMenu();
    if (tab === 'kategori') fetchKategori();
  }, [tab, filterStatus]);

  const fetchPesanan = async () => {
    const r = await pesananApi.getAll(filterStatus || undefined);
    setPesanans(r.data);
  };
  const fetchMenu = async () => { const r = await menuApi.getAll(); setMenus(r.data); };
  const fetchKategori = async () => { const r = await kategoriApi.getAll(); setKategoris(r.data); };

  const handleUpdateStatus = async (id: number, status: string) => {
    setLoadingId(id);
    try {
      await pesananApi.updateStatus(id, status);
      toast.success(`Status diubah ke ${STATUS_CONFIG[status]?.label}`, {
        style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' },
      });
      fetchPesanan();
    } catch { toast.error('Gagal update status'); }
    finally { setLoadingId(null); }
  };

  const handleToggleMenu = async (id: number) => {
    try { await menuApi.toggle(id); fetchMenu(); }
    catch { toast.error('Gagal update'); }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Hapus menu ini?')) return;
    try { await menuApi.delete(id); toast.success('Menu dihapus'); fetchMenu(); }
    catch { toast.error('Gagal hapus menu'); }
  };

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'pesanan', label: 'Pesanan', icon: '📋' },
    { key: 'menu', label: 'Menu', icon: '🍽️' },
    { key: 'kategori', label: 'Kategori', icon: '🏷️' },
  ];

  const pendingCount = pesanans.filter(p => p.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <span className="text-[#f5a623] text-sm font-medium tracking-widest uppercase">Control Panel</span>
            <h1 className="font-display text-3xl font-bold text-white mt-1">Dashboard Admin</h1>
          </div>
          {pendingCount > 0 && tab === 'pesanan' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full badge-pending text-sm font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#f5a623] animate-pulse"></span>
              {pendingCount} pesanan menunggu
            </div>
          )}
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.07)' }}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                tab === t.key
                  ? 'bg-gold-gradient text-[#0a0a0f] shadow-[0_4px_15px_rgba(245,166,35,0.3)]'
                  : 'text-[#7a7a8c] hover:text-white'
              }`}
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* Pesanan Tab */}
        {tab === 'pesanan' && (
          <div>
            <div className="flex gap-2 mb-6 flex-wrap">
              <FilterBtn active={filterStatus === ''} onClick={() => setFilterStatus('')}>Semua</FilterBtn>
              {STATUS_OPTIONS.map(s => (
                <FilterBtn key={s} active={filterStatus === s} onClick={() => setFilterStatus(s)}>
                  {STATUS_CONFIG[s]?.icon} {STATUS_CONFIG[s]?.label}
                </FilterBtn>
              ))}
            </div>

            {pesanans.length === 0 ? (
              <div className="text-center py-20 text-[#7a7a8c]">
                <div className="text-5xl mb-4 opacity-40">📭</div>
                <p>Tidak ada pesanan</p>
              </div>
            ) : (
              <div className="space-y-4">
                {pesanans.map(p => {
                  const s = STATUS_CONFIG[p.status];
                  return (
                    <div key={p.id} className="menu-card rounded-2xl p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-semibold text-white">Pesanan #{p.id}</span>
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${s?.cls}`}>
                              {s?.icon} {s?.label}
                            </span>
                          </div>
                          <div className="text-sm text-[#7a7a8c] mt-0.5 flex items-center gap-2">
                            <span>Meja {p.noMeja}</span>
                            <span>·</span>
                            <span>{p.user ? p.user.nama : 'Tamu'}</span>
                            <span>·</span>
                            <span>{new Date(p.createdAt).toLocaleString('id-ID', { day:'numeric', month:'short', hour:'2-digit', minute:'2-digit' })}</span>
                          </div>
                        </div>
                        <span className="font-bold gradient-text text-lg">
                          Rp {p.totalHarga.toLocaleString('id-ID')}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-2 mb-4">
                        {p.items.map((item: any) => (
                          <div key={item.id} className="flex justify-between text-sm px-3 py-2 rounded-xl" style={{ background: '#1c1c27' }}>
                            <span className="text-[#a0a0b0]">{item.menu.nama} ×{item.jumlah}</span>
                            <span className="text-[#7a7a8c]">Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                          </div>
                        ))}
                      </div>

                      {p.catatan && (
                        <div className="text-xs text-[#7a7a8c] mb-4 px-3 py-2 rounded-xl italic" style={{ background: '#1c1c27' }}>
                          📝 {p.catatan}
                        </div>
                      )}

                      <div className="glow-divider mb-4" />

                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-[#7a7a8c] mr-2">Ubah status:</span>
                        {STATUS_OPTIONS.filter(s => s !== p.status).map(s => (
                          <button
                            key={s}
                            onClick={() => handleUpdateStatus(p.id, s)}
                            disabled={loadingId === p.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${STATUS_CONFIG[s]?.cls}`}
                          >
                            → {STATUS_CONFIG[s]?.icon} {STATUS_CONFIG[s]?.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Menu Tab */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-[#7a7a8c]">{menus.length} menu terdaftar</span>
              <Link to="/admin/menu/tambah" className="btn-gold px-4 py-2 rounded-xl text-sm">
                + Tambah Menu
              </Link>
            </div>
            <div className="rounded-2xl overflow-hidden" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.07)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                    {['Nama', 'Kategori', 'Harga', 'Status', 'Aksi'].map(h => (
                      <th key={h} className="px-5 py-3.5 text-left text-xs font-medium text-[#7a7a8c] uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(255,255,255,0.04)]">
                  {menus.map(m => (
                    <tr key={m.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white">{m.nama}</td>
                      <td className="px-5 py-3.5 text-[#7a7a8c]">{m.kategori.nama}</td>
                      <td className="px-5 py-3.5 font-semibold gradient-text">Rp {m.harga.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleToggleMenu(m.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${
                            m.tersedia ? 'badge-selesai' : 'badge-dibatalkan'
                          }`}
                        >
                          {m.tersedia ? '✅ Tersedia' : '❌ Habis'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <button
                          onClick={() => handleDeleteMenu(m.id)}
                          className="text-xs text-[#7a7a8c] hover:text-[#f87171] transition-colors"
                        >
                          Hapus
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Kategori Tab */}
        {tab === 'kategori' && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {kategoris.map(k => (
              <div key={k.id} className="menu-card rounded-2xl p-5 group">
                <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center text-xl mb-3">
                  🏷️
                </div>
                <h3 className="font-semibold text-white group-hover:text-[#f5a623] transition-colors">{k.nama}</h3>
                {k.deskripsi && <p className="text-xs text-[#7a7a8c] mt-1">{k.deskripsi}</p>}
                <div className="mt-3 text-xs font-medium text-[#f5a623]">
                  {k._count?.menu ?? 0} menu
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active ? 'bg-gold-gradient text-[#0a0a0f] shadow-[0_4px_15px_rgba(245,166,35,0.3)]' : 'glass text-[#7a7a8c] hover:text-white'
      }`}
    >
      {children}
    </button>
  );
}
