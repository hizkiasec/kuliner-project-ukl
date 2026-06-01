import { useState } from 'react';
import { useCart } from '../hooks/useCart';
import { pesananApi } from '../services/api';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function KeranjangPage() {
  const { items, removeItem, updateJumlah, clearCart, total } = useCart();
  const [noMeja, setNoMeja] = useState('');
  const [catatan, setCatatan] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleOrder = async () => {
    if (!noMeja) {
      toast.error('Masukkan nomor meja dulu');
      return;
    }
    if (items.length === 0) {
      toast.error('Keranjang masih kosong');
      return;
    }

    setLoading(true);
    try {
      await pesananApi.create({
        noMeja: parseInt(noMeja),
        catatan,
        items: items.map((i) => ({
          menuId: i.menuId,
          jumlah: i.jumlah,
          catatan: i.catatan,
        })),
      });
      clearCart();
      toast.success('Pesanan berhasil dibuat!');
      navigate('/pesanan-saya');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <h2 className="text-xl font-semibold text-gray-600 mb-4">Keranjang kamu kosong</h2>
        <a href="/menu" className="text-primary-600 hover:underline font-medium">
          Lihat menu &rarr;
        </a>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Keranjang Pesanan</h1>

      <div className="bg-white rounded-xl shadow-sm border divide-y mb-6">
        {items.map((item) => (
          <div key={item.menuId} className="flex items-center gap-4 p-4">
            <div className="flex-1">
              <p className="font-medium">{item.nama}</p>
              <p className="text-sm text-gray-500">
                Rp {item.harga.toLocaleString('id-ID')} / porsi
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateJumlah(item.menuId, item.jumlah - 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center"
              >
                −
              </button>
              <span className="w-6 text-center font-semibold">{item.jumlah}</span>
              <button
                onClick={() => updateJumlah(item.menuId, item.jumlah + 1)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 font-bold text-lg flex items-center justify-center"
              >
                +
              </button>
            </div>

            <p className="w-28 text-right font-semibold text-primary-600">
              Rp {(item.harga * item.jumlah).toLocaleString('id-ID')}
            </p>

            <button
              onClick={() => removeItem(item.menuId)}
              className="text-red-400 hover:text-red-600 text-lg"
            >
              ✕
            </button>
          </div>
        ))}
      </div>

      {/* Form checkout */}
      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-4">
        <h2 className="font-bold text-lg">Detail Pesanan</h2>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Nomor Meja <span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            value={noMeja}
            onChange={(e) => setNoMeja(e.target.value)}
            placeholder="Contoh: 5"
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-400"
            min={1}
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Catatan (opsional)
          </label>
          <textarea
            value={catatan}
            onChange={(e) => setCatatan(e.target.value)}
            placeholder="Contoh: tidak pedas, tambah nasi..."
            className="border rounded-lg px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-primary-400 h-20 resize-none"
          />
        </div>

        <div className="flex items-center justify-between pt-2 border-t">
          <div>
            <p className="text-gray-500 text-sm">Total Pembayaran</p>
            <p className="text-2xl font-bold text-primary-600">
              Rp {total.toLocaleString('id-ID')}
            </p>
          </div>
          <button
            onClick={handleOrder}
            disabled={loading}
            className="bg-primary-500 text-white px-8 py-3 rounded-xl font-bold hover:bg-primary-600 transition disabled:opacity-50"
          >
            {loading ? 'Memproses...' : 'Pesan Sekarang'}
          </button>
        </div>
      </div>
    </div>
  );
}
