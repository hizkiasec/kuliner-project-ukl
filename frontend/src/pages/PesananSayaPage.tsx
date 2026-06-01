import { useEffect, useState } from 'react';
import { pesananApi } from '../services/api';
import { useAuth } from '../hooks/useAuth';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';

const statusLabel: Record<string, { label: string; color: string }> = {
  PENDING: { label: 'Menunggu', color: 'bg-yellow-100 text-yellow-700' },
  DIPROSES: { label: 'Diproses', color: 'bg-blue-100 text-blue-700' },
  SELESAI: { label: 'Selesai', color: 'bg-green-100 text-green-700' },
  DIBATALKAN: { label: 'Dibatalkan', color: 'bg-red-100 text-red-700' },
};

export default function PesananSayaPage() {
  const { user } = useAuth();
  const [pesanans, setPesanans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;
    pesananApi
      .getMine()
      .then((res) => setPesanans(res.data))
      .catch(() => toast.error('Gagal memuat pesanan'))
      .finally(() => setLoading(false));
  }, [user]);

  if (!user) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">🔒</div>
        <p className="text-gray-600 mb-4">Silakan login untuk melihat pesanan kamu</p>
        <Link
          to="/login"
          className="bg-primary-500 text-white px-6 py-2 rounded-xl font-medium hover:bg-primary-600 transition"
        >
          Login
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div className="text-center py-20 text-gray-400">Memuat pesanan...</div>;
  }

  if (pesanans.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-5xl mb-4">📋</div>
        <p className="text-gray-600 mb-4">Belum ada pesanan</p>
        <Link
          to="/menu"
          className="text-primary-600 hover:underline font-medium"
        >
          Pesan sekarang &rarr;
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Pesanan Saya</h1>

      <div className="space-y-4">
        {pesanans.map((p) => {
          const s = statusLabel[p.status] || { label: p.status, color: 'bg-gray-100 text-gray-700' };
          return (
            <div key={p.id} className="bg-white rounded-xl border shadow-sm p-5">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <p className="font-semibold text-gray-800">Pesanan #{p.id}</p>
                  <p className="text-sm text-gray-500">Meja {p.noMeja}</p>
                </div>
                <span className={`text-xs font-semibold px-3 py-1 rounded-full ${s.color}`}>
                  {s.label}
                </span>
              </div>

              <div className="space-y-1 mb-3">
                {p.items.map((item: any) => (
                  <div key={item.id} className="flex justify-between text-sm text-gray-600">
                    <span>
                      {item.menu.nama} × {item.jumlah}
                    </span>
                    <span>Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}</span>
                  </div>
                ))}
              </div>

              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-sm text-gray-500">
                  {new Date(p.createdAt).toLocaleDateString('id-ID', {
                    day: 'numeric', month: 'long', year: 'numeric',
                    hour: '2-digit', minute: '2-digit',
                  })}
                </span>
                <span className="font-bold text-primary-600">
                  Total: Rp {p.totalHarga.toLocaleString('id-ID')}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
