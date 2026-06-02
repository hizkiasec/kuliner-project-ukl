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
  const { addItem, items } = useCart();
  const inCart = items.find(i => i.menuId === menu.id);

  const handleAdd = () => {
    if (!menu.tersedia) return;
    addItem({ menuId: menu.id, nama: menu.nama, harga: menu.harga });
    toast.success(`${menu.nama} ditambahkan!`, {
      style: { background: '#13131a', color: '#f0ede8', border: '1px solid rgba(255,255,255,0.07)' },
      iconTheme: { primary: '#f5a623', secondary: '#0a0a0f' },
    });
  };

  return (
    <div className={`menu-card rounded-2xl overflow-hidden group ${!menu.tersedia ? 'opacity-50' : ''}`}>
      {/* Image */}
      <div className="relative h-44 bg-[#1c1c27] overflow-hidden">
        {menu.gambar ? (
          <img src={menu.gambar} alt={menu.nama} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-5xl"
            style={{ background: 'linear-gradient(135deg, #1c1c27, #252535)' }}>
            🍽️
          </div>
        )}
        {/* Category badge */}
        <div className="absolute top-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-xs font-medium"
            style={{ background: 'rgba(10,10,15,0.85)', color: '#f5a623', backdropFilter: 'blur(8px)', border: '1px solid rgba(245,166,35,0.2)' }}>
            {menu.kategori.nama}
          </span>
        </div>
        {!menu.tersedia && (
          <div className="absolute inset-0 flex items-center justify-center bg-[rgba(10,10,15,0.7)] backdrop-blur-sm">
            <span className="px-3 py-1.5 rounded-full text-xs font-semibold text-[#f87171]"
              style={{ background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)' }}>
              Habis
            </span>
          </div>
        )}
        {inCart && (
          <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-gold-gradient flex items-center justify-center text-xs font-bold text-[#0a0a0f] shadow-[0_0_10px_rgba(245,166,35,0.5)]">
            {inCart.jumlah}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-semibold text-white mb-1 group-hover:text-[#f5a623] transition-colors duration-200">
          {menu.nama}
        </h3>
        {menu.deskripsi && (
          <p className="text-xs text-[#7a7a8c] leading-relaxed line-clamp-2 mb-3">{menu.deskripsi}</p>
        )}

        <div className="flex items-center justify-between mt-auto pt-3 border-t border-[rgba(255,255,255,0.05)]">
          <div>
            <span className="text-lg font-bold gradient-text">
              Rp {menu.harga.toLocaleString('id-ID')}
            </span>
          </div>
          <button
            onClick={handleAdd}
            disabled={!menu.tersedia}
            className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all duration-200 ${
              menu.tersedia
                ? 'btn-gold'
                : 'bg-[#1c1c27] text-[#7a7a8c] cursor-not-allowed'
            }`}
          >
            {menu.tersedia ? '+ Tambah' : 'Habis'}
          </button>
        </div>
      </div>
    </div>
  );
}
