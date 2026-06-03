import { useEffect, useState } from 'react';
import { pesananApi, menuApi, kategoriApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const STATUS_CONFIG: Record<string, { label: string; cls: string; icon: string }> = {
  PENDING:    { label: 'Menunggu',   cls: 'badge-pending',    icon: '⏳' },
  DIPROSES:   { label: 'Diproses',   cls: 'badge-diproses',   icon: '👨‍🍳' },
  SELESAI:    { label: 'Selesai',    cls: 'badge-selesai',    icon: '✅' },
  DIBATALKAN: { label: 'Dibatalkan', cls: 'badge-dibatalkan', icon: '❌' },
};
const STATUS_OPTIONS = ['PENDING', 'DIPROSES', 'SELESAI', 'DIBATALKAN'];

type Tab = 'pesanan' | 'menu' | 'kategori';

const TOAST_STYLE = { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' };

// ── Modal tambah/edit menu ─────────────────────────────────────────
interface MenuFormData {
  nama: string; deskripsi: string; harga: string;
  gambar: string; tersedia: boolean; kategoriId: string;
}
const EMPTY_MENU: MenuFormData = { nama: '', deskripsi: '', harga: '', gambar: '', tersedia: true, kategoriId: '' };

function MenuModal({
  open, onClose, onSaved, kategoris, initial,
}: {
  open: boolean; onClose: () => void; onSaved: () => void;
  kategoris: any[]; initial?: any;
}) {
  const [form, setForm] = useState<MenuFormData>(EMPTY_MENU);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) {
      setForm(initial
        ? { nama: initial.nama, deskripsi: initial.deskripsi || '', harga: String(initial.harga),
            gambar: initial.gambar || '', tersedia: initial.tersedia, kategoriId: String(initial.kategoriId) }
        : EMPTY_MENU);
    }
  }, [open, initial]);

  const handleSave = async () => {
    if (!form.nama.trim()) { toast.error('Nama menu wajib diisi'); return; }
    if (!form.harga || isNaN(Number(form.harga)) || Number(form.harga) <= 0) { toast.error('Harga harus angka positif'); return; }
    if (!form.kategoriId) { toast.error('Pilih kategori'); return; }
    setSaving(true);
    try {
      const payload = {
        nama: form.nama.trim(), deskripsi: form.deskripsi || undefined,
        harga: Number(form.harga), gambar: form.gambar || undefined,
        tersedia: form.tersedia, kategoriId: Number(form.kategoriId),
      };
      if (initial) {
        await menuApi.update(initial.id, payload);
        toast.success('Menu berhasil diperbarui', { style: TOAST_STYLE });
      } else {
        await menuApi.create(payload);
        toast.success('Menu berhasil ditambahkan', { style: TOAST_STYLE });
      }
      onSaved();
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan menu');
    } finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-md rounded-3xl p-6 animate-fade-up" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white text-lg">{initial ? 'Edit Menu' : 'Tambah Menu Baru'}</h2>
          <button onClick={onClose} className="text-[#7a7a8c] hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Nama Menu *</label>
            <input value={form.nama} onChange={e => setForm(f => ({ ...f, nama: e.target.value }))}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="Nasi Goreng Spesial" />
          </div>
          <div>
            <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Deskripsi</label>
            <textarea value={form.deskripsi} onChange={e => setForm(f => ({ ...f, deskripsi: e.target.value }))}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-sm h-20 resize-none" placeholder="Deskripsi menu..." />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Harga (Rp) *</label>
              <input type="number" min={0} value={form.harga} onChange={e => setForm(f => ({ ...f, harga: e.target.value }))}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="25000" />
            </div>
            <div>
              <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Kategori *</label>
              <select value={form.kategoriId} onChange={e => setForm(f => ({ ...f, kategoriId: e.target.value }))}
                className="input-dark w-full px-4 py-2.5 rounded-xl text-sm">
                <option value="">Pilih...</option>
                {kategoris.map(k => <option key={k.id} value={k.id}>{k.nama}</option>)}
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">URL Gambar</label>
            <input value={form.gambar} onChange={e => setForm(f => ({ ...f, gambar: e.target.value }))}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="https://..." />
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setForm(f => ({ ...f, tersedia: !f.tersedia }))}
              className={`w-10 h-6 rounded-full transition-all duration-200 relative ${form.tersedia ? 'bg-[#4ade80]' : 'bg-[#2a2a3a]'}`}
            >
              <span className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-all duration-200 ${form.tersedia ? 'left-5' : 'left-1'}`} />
            </button>
            <span className="text-sm text-[#a0a0b0]">{form.tersedia ? 'Tersedia' : 'Tidak Tersedia'}</span>
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7a7a8c] hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            Batal
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? 'Menyimpan...' : initial ? 'Simpan Perubahan' : 'Tambah Menu'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Modal tambah/edit kategori ─────────────────────────────────────
function KategoriModal({ open, onClose, onSaved, initial }: {
  open: boolean; onClose: () => void; onSaved: () => void; initial?: any;
}) {
  const [nama, setNama] = useState('');
  const [deskripsi, setDeskripsi] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (open) { setNama(initial?.nama || ''); setDeskripsi(initial?.deskripsi || ''); }
  }, [open, initial]);

  const handleSave = async () => {
    if (!nama.trim()) { toast.error('Nama kategori wajib diisi'); return; }
    setSaving(true);
    try {
      const payload = { nama: nama.trim(), deskripsi: deskripsi || undefined };
      if (initial) {
        await kategoriApi.update(initial.id, payload);
        toast.success('Kategori diperbarui', { style: TOAST_STYLE });
      } else {
        await kategoriApi.create(payload);
        toast.success('Kategori ditambahkan', { style: TOAST_STYLE });
      }
      onSaved(); onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal menyimpan kategori');
    } finally { setSaving(false); }
  };

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(4px)' }}>
      <div className="w-full max-w-sm rounded-3xl p-6 animate-fade-up" style={{ background: '#13131a', border: '1px solid rgba(255,255,255,0.1)' }}>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-semibold text-white text-lg">{initial ? 'Edit Kategori' : 'Tambah Kategori'}</h2>
          <button onClick={onClose} className="text-[#7a7a8c] hover:text-white transition-colors text-xl leading-none">×</button>
        </div>
        <div className="space-y-4">
          <div>
            <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Nama Kategori *</label>
            <input value={nama} onChange={e => setNama(e.target.value)}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="Makanan Berat" />
          </div>
          <div>
            <label className="block text-xs text-[#7a7a8c] mb-1.5 uppercase tracking-wider">Deskripsi</label>
            <input value={deskripsi} onChange={e => setDeskripsi(e.target.value)}
              className="input-dark w-full px-4 py-2.5 rounded-xl text-sm" placeholder="Opsional..." />
          </div>
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm text-[#7a7a8c] hover:text-white transition-colors" style={{ border: '1px solid rgba(255,255,255,0.1)' }}>
            Batal
          </button>
          <button onClick={handleSave} disabled={saving} className="flex-1 btn-gold py-2.5 rounded-xl text-sm font-semibold disabled:opacity-50">
            {saving ? 'Menyimpan...' : initial ? 'Simpan' : 'Tambah'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Main AdminPage ─────────────────────────────────────────────────
export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>('pesanan');
  const [pesanans, setPesanans] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('');
  const [loadingId, setLoadingId] = useState<number | null>(null);

  // Modal states
  const [menuModalOpen, setMenuModalOpen] = useState(false);
  const [editingMenu, setEditingMenu] = useState<any>(null);
  const [kategoriModalOpen, setKategoriModalOpen] = useState(false);
  const [editingKategori, setEditingKategori] = useState<any>(null);

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!isAdmin) { navigate('/'); toast.error('Akses ditolak'); return; }
  }, [user, isAdmin]);

  useEffect(() => {
    if (tab === 'pesanan') fetchPesanan();
    if (tab === 'menu') { fetchMenu(); fetchKategori(); }
    if (tab === 'kategori') fetchKategori();
  }, [tab, filterStatus]);

  const fetchPesanan = async () => {
    try { const r = await pesananApi.getAll(filterStatus || undefined); setPesanans(r.data); }
    catch { toast.error('Gagal memuat pesanan'); }
  };
  const fetchMenu = async () => {
    try { const r = await menuApi.getAll(); setMenus(r.data); }
    catch { toast.error('Gagal memuat menu'); }
  };
  const fetchKategori = async () => {
    try { const r = await kategoriApi.getAll(); setKategoris(r.data); }
    catch { toast.error('Gagal memuat kategori'); }
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    setLoadingId(id);
    try {
      await pesananApi.updateStatus(id, status);
      toast.success(`Status diubah ke ${STATUS_CONFIG[status]?.label}`, { style: TOAST_STYLE });
      fetchPesanan();
    } catch { toast.error('Gagal update status'); }
    finally { setLoadingId(null); }
  };

  const handleToggleMenu = async (id: number) => {
    try { await menuApi.toggle(id); fetchMenu(); }
    catch { toast.error('Gagal update ketersediaan'); }
  };

  const handleDeleteMenu = async (id: number, nama: string) => {
    if (!confirm(`Hapus menu "${nama}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    try { await menuApi.delete(id); toast.success('Menu dihapus', { style: TOAST_STYLE }); fetchMenu(); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Gagal hapus menu'); }
  };

  const handleDeleteKategori = async (id: number, nama: string) => {
    if (!confirm(`Hapus kategori "${nama}"? Semua menu di kategori ini mungkin terpengaruh.`)) return;
    try { await kategoriApi.delete(id); toast.success('Kategori dihapus', { style: TOAST_STYLE }); fetchKategori(); }
    catch (err: any) { toast.error(err.response?.data?.message || 'Gagal hapus kategori'); }
  };

  const TABS: { key: Tab; label: string; icon: string }[] = [
    { key: 'pesanan', label: 'Pesanan', icon: '📋' },
    { key: 'menu', label: 'Menu', icon: '🍽️' },
    { key: 'kategori', label: 'Kategori', icon: '🏷️' },
  ];
  const pendingCount = pesanans.filter(p => p.status === 'PENDING').length;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24 pb-16">
      {/* Modals */}
      <MenuModal
        open={menuModalOpen}
        onClose={() => { setMenuModalOpen(false); setEditingMenu(null); }}
        onSaved={fetchMenu}
        kategoris={kategoris}
        initial={editingMenu}
      />
      <KategoriModal
        open={kategoriModalOpen}
        onClose={() => { setKategoriModalOpen(false); setEditingKategori(null); }}
        onSaved={fetchKategori}
        initial={editingKategori}
      />

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
            <button key={t.key} onClick={() => setTab(t.key)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-2 ${
                tab === t.key
                  ? 'bg-gold-gradient text-[#0a0a0f] shadow-[0_4px_15px_rgba(245,166,35,0.3)]'
                  : 'text-[#7a7a8c] hover:text-white'
              }`}>
              {t.icon} {t.label}
            </button>
          ))}
        </div>

        {/* ── PESANAN TAB ── */}
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
                            <span>{new Date(p.createdAt).toLocaleString('id-ID', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
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
                          <button key={s} onClick={() => handleUpdateStatus(p.id, s)}
                            disabled={loadingId === p.id}
                            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 disabled:opacity-50 ${STATUS_CONFIG[s]?.cls}`}>
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

        {/* ── MENU TAB ── */}
        {tab === 'menu' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-[#7a7a8c]">{menus.length} menu terdaftar</span>
              {/* FIX: tombol sekarang membuka modal, bukan link ke route yang tidak ada */}
              <button
                onClick={() => { setEditingMenu(null); setMenuModalOpen(true); }}
                className="btn-gold px-4 py-2 rounded-xl text-sm">
                + Tambah Menu
              </button>
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
                  {menus.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="px-5 py-10 text-center text-[#7a7a8c]">
                        Belum ada menu — klik "+ Tambah Menu"
                      </td>
                    </tr>
                  ) : menus.map(m => (
                    <tr key={m.id} className="hover:bg-[rgba(255,255,255,0.02)] transition-colors">
                      <td className="px-5 py-3.5 font-medium text-white">
                        <div className="flex items-center gap-2">
                          {m.gambar && <img src={m.gambar} alt="" className="w-8 h-8 rounded-lg object-cover" onError={e => { (e.target as any).style.display = 'none'; }} />}
                          {m.nama}
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[#7a7a8c]">{m.kategori.nama}</td>
                      <td className="px-5 py-3.5 font-semibold gradient-text">Rp {m.harga.toLocaleString('id-ID')}</td>
                      <td className="px-5 py-3.5">
                        <button onClick={() => handleToggleMenu(m.id)}
                          className={`px-3 py-1 rounded-full text-xs font-semibold transition-all ${m.tersedia ? 'badge-selesai' : 'badge-dibatalkan'}`}>
                          {m.tersedia ? '✅ Tersedia' : '❌ Habis'}
                        </button>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <button onClick={() => { setEditingMenu(m); setMenuModalOpen(true); }}
                            className="text-xs text-[#7a7a8c] hover:text-[#f5a623] transition-colors">
                            Edit
                          </button>
                          <button onClick={() => handleDeleteMenu(m.id, m.nama)}
                            className="text-xs text-[#7a7a8c] hover:text-[#f87171] transition-colors">
                            Hapus
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── KATEGORI TAB ── */}
        {tab === 'kategori' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <span className="text-sm text-[#7a7a8c]">{kategoris.length} kategori terdaftar</span>
              <button
                onClick={() => { setEditingKategori(null); setKategoriModalOpen(true); }}
                className="btn-gold px-4 py-2 rounded-xl text-sm">
                + Tambah Kategori
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {kategoris.length === 0 ? (
                <div className="col-span-full text-center py-16 text-[#7a7a8c]">
                  <div className="text-4xl mb-3 opacity-40">🏷️</div>
                  <p>Belum ada kategori — klik "+ Tambah Kategori"</p>
                </div>
              ) : kategoris.map(k => (
                <div key={k.id} className="menu-card rounded-2xl p-5 group">
                  <div className="w-10 h-10 rounded-xl bg-[rgba(245,166,35,0.1)] flex items-center justify-center text-xl mb-3">🏷️</div>
                  <h3 className="font-semibold text-white group-hover:text-[#f5a623] transition-colors">{k.nama}</h3>
                  {k.deskripsi && <p className="text-xs text-[#7a7a8c] mt-1">{k.deskripsi}</p>}
                  <div className="mt-3 text-xs font-medium text-[#f5a623]">{k._count?.menu ?? 0} menu</div>
                  <div className="flex gap-2 mt-4 pt-3 border-t border-[rgba(255,255,255,0.05)]">
                    <button onClick={() => { setEditingKategori(k); setKategoriModalOpen(true); }}
                      className="text-xs text-[#7a7a8c] hover:text-[#f5a623] transition-colors">
                      Edit
                    </button>
                    <button onClick={() => handleDeleteKategori(k.id, k.nama)}
                      className="text-xs text-[#7a7a8c] hover:text-[#f87171] transition-colors ml-auto">
                      Hapus
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function FilterBtn({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
        active ? 'bg-gold-gradient text-[#0a0a0f] shadow-[0_4px_15px_rgba(245,166,35,0.3)]' : 'glass text-[#7a7a8c] hover:text-white'
      }`}>
      {children}
    </button>
  );
}
