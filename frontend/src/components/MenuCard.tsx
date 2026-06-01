import { useCart } from '../hooks/useCart';
import toast from 'react-hot-toast';

interface Menu {
  id: number;
  nama: string;
  deskripsi?: string;
  harga: number;
  gambar?: string;
  tersedia: boolean;
  kategori: { nama: string };
}

export default function MenuCard({ menu }: { menu: Menu }) {
  const { addItem } = useCart();

  const handleAdd = () => {
    if (!menu.tersedia) return;
    addItem({ menuId: menu.id, nama: menu.nama, harga: menu.harga });
    toast.success(`${menu.nama} ditambahkan ke keranjang`);
  };

  return (
    <div
      className={`bg-white rounded-xl shadow-sm border overflow-hidden transition hover:shadow-md ${
        !menu.tersedia ? 'opacity-60' : ''
      }`}
    >
      <div className="h-40 bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center text-5xl">
        {menu.gambar ? (
          <img src={menu.gambar} alt={menu.nama} className="w-full h-full object-cover" />
        ) : (
          '🍽️'
        )}
      </div>

      <div className="p-4">
        <span className="text-xs bg-primary-100 text-primary-700 px-2 py-0.5 rounded-full font-medium">
          {menu.kategori.nama}
        </span>
        <h3 className="font-semibold text-gray-800 mt-1">{menu.nama}</h3>
        {menu.deskripsi && (
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{menu.deskripsi}</p>
        )}

        <div className="flex items-center justify-between mt-3">
          <span className="font-bold text-primary-600">
            Rp {menu.harga.toLocaleString('id-ID')}
          </span>
          <button
            onClick={handleAdd}
            disabled={!menu.tersedia}
            className="bg-primary-500 text-white px-3 py-1.5 rounded-lg text-sm font-medium hover:bg-primary-600 transition disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            {menu.tersedia ? '+ Tambah' : 'Habis'}
          </button>
        </div>
      </div>
    </div>
  );
}
