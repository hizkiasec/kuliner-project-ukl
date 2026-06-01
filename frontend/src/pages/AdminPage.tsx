import { useEffect, useState } from 'react';
import { pesananApi, menuApi, kategoriApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusLabel: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  DIPROSES: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
  SELESAI: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
  DIBATALKAN: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

const statusOptions = ['PENDING', 'DIPROSES', 'SELESAI', 'DIBATALKAN'];

export default function AdminPage() {
  const { isAdmin, user } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState<'pesanan' | 'menu' | 'kategori'>('pesanan');

  const [pesanans, setPesanans] = useState<any[]>([]);
  const [menus, setMenus] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [filterStatus, setFilterStatus] = useState('');

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
    const res = await pesananApi.getAll(filterStatus || undefined);
    setPesanans(res.data);
  };

  const fetchMenu = async () => {
    const res = await menuApi.getAll();
    setMenus(res.data);
  };

  const fetchKategori = async () => {
    const res = await kategoriApi.getAll();
    setKategoris(res.data);
  };

  const handleUpdateStatus = async (id: number, status: string) => {
    try {
      await pesananApi.updateStatus(id, status);
      toast.success('Status diperbarui');
      fetchPesanan();
    } catch {
      toast.error('Gagal update status');
    }
  };

  const handleToggleMenu = async (id: number) => {
    try {
      await menuApi.toggle(id);
      toast.success('Ketersediaan diperbarui');
      fetchMenu();
    } catch {
      toast.error('Gagal update');
    }
  };

  const handleDeleteMenu = async (id: number) => {
    if (!confirm('Hapus menu ini?')) return;
    try {
      await menuApi.delete(id);
      toast.success('Menu dihapus');
      fetchMenu();
    } catch {
      toast.error('Gagal hapus menu');
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Dashboard Admin</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 border-b">
        {(['pesanan', 'menu', 'kategori'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2.5 font-medium capitalize transition border-b-2 -mb-px ${
              tab === t
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {t === 'pesanan' ? '📋 Pesanan' : t === 'menu' ? '🍽️ Menu' : '🏷️ Kategori'}
          </button>
        ))}
      </div>

      {/* Tab Pesanan */}
      {tab === 'pesanan' && (
        <div>
          <div className="flex gap-2 mb-4">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
            >
              <option value="">Semua Status</option>
              {statusOptions.map((s) => (
                <option key={s} value={s}>{statusLabel[s]?.label}</option>
              ))}
            </select>
          </div>

          <div className="space-y-4">
            {pesanans.length === 0 && (
              <p className="text-gray-400 text-center py-10">Tidak ada pesanan</p>
            )}
            {pesanans.map((p) => {
              const s = statusLabel[p.status];
              return (
                <div key={p.id} className="bg-white rounded-xl border shadow-sm p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="font-semibold">Pesanan #{p.id} — Meja {p.noMeja}</p>
                      <p className="text-sm text-gray-500">
                        {p.user ? p.user.nama : 'Tamu'} •{' '}
                        {new Date(p.createdAt).toLocaleString('id-ID')}
                      </p>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s?.color}`}>
                      {s?.label}
                    </span>
                  </div>

                  <div className="space-y-1 text-sm text-gray-600 mb-3">
                    {p.items.map((item: any) => (
                      <div key={item.id} className="flex justify-between">
                        <span>{item.menu.nama} × {item.jumlah}</span>
                        <span>Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                      </div>
                    ))}
                  </div>

                  <div className="flex items-center justify-between border-t pt-3">
                    <span className="font-bold text-primary-600">
                      Total: Rp {p.totalHarga.toLocaleString('id-ID')}
                    </span>
                    <div className="flex gap-2">
                      {statusOptions.filter((s) => s !== p.status).map((s) => (
                        <button
                          key={s}
                          onClick={() => handleUpdateStatus(p.id, s)}
                          className="text-xs border px-3 py-1 rounded-lg hover:bg-gray-50 transition"
                        >
                          → {statusLabel[s]?.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab Menu */}
      {tab === 'menu' && (
        <div>
          <div className="flex justify-between items-center mb-4">
            <p className="text-sm text-gray-500">{menus.length} menu terdaftar</p>
            <Link
              to="/admin/menu/tambah"
              className="bg-primary-500 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary-600 transition"
            >
              + Tambah Menu
            </Link>
          </div>

          <div className="bg-white rounded-xl border shadow-sm overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 text-gray-600 font-medium">
                <tr>
                  <th className="px-4 py-3 text-left">Nama</th>
                  <th className="px-4 py-3 text-left">Kategori</th>
                  <th className="px-4 py-3 text-right">Harga</th>
                  <th className="px-4 py-3 text-center">Tersedia</th>
                  <th className="px-4 py-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {menus.map((m) => (
                  <tr key={m.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{m.nama}</td>
                    <td className="px-4 py-3 text-gray-500">{m.kategori.nama}</td>
                    <td className="px-4 py-3 text-right">
                      Rp {m.harga.toLocaleString('id-ID')}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleToggleMenu(m.id)}
                        className={`text-xs font-semibold px-3 py-1 rounded-full cursor-pointer ${
                          m.tersedia
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {m.tersedia ? 'Tersedia' : 'Habis'}
                      </button>
                    </td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleDeleteMenu(m.id)}
                        className="text-red-400 hover:text-red-600 text-xs underline"
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

      {/* Tab Kategori */}
      {tab === 'kategori' && (
        <div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {kategoris.map((k) => (
              <div key={k.id} className="bg-white rounded-xl border shadow-sm p-5">
                <h3 className="font-semibold text-gray-800">{k.nama}</h3>
                {k.deskripsi && (
                  <p className="text-sm text-gray-500 mt-1">{k.deskripsi}</p>
                )}
                <p className="text-xs text-primary-600 mt-2 font-medium">
                  {k._count?.menu ?? 0} menu
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
