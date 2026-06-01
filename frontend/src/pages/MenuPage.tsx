import { useEffect, useState } from 'react';
import { menuApi, kategoriApi } from '../services/api';
import MenuCard from '../components/MenuCard';
import toast from 'react-hot-toast';

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedKategori, setSelectedKategori] = useState<number | undefined>();

  const fetchMenus = async () => {
    try {
      const res = await menuApi.getAll({
        tersedia: true,
        search: search || undefined,
        kategoriId: selectedKategori,
      });
      setMenus(res.data);
    } catch {
      toast.error('Gagal memuat menu');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    kategoriApi.getAll().then((res) => setKategoris(res.data));
  }, []);

  useEffect(() => {
    fetchMenus();
  }, [search, selectedKategori]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Menu Kami</h1>

      {/* Filter & Search */}
      <div className="flex flex-wrap gap-3 mb-6">
        <input
          type="text"
          placeholder="Cari menu..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border rounded-lg px-4 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-primary-400"
        />

        <button
          onClick={() => setSelectedKategori(undefined)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
            !selectedKategori
              ? 'bg-primary-500 text-white'
              : 'bg-white border text-gray-600 hover:bg-gray-50'
          }`}
        >
          Semua
        </button>

        {kategoris.map((k) => (
          <button
            key={k.id}
            onClick={() => setSelectedKategori(k.id)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
              selectedKategori === k.id
                ? 'bg-primary-500 text-white'
                : 'bg-white border text-gray-600 hover:bg-gray-50'
            }`}
          >
            {k.nama}
          </button>
        ))}
      </div>

      {/* Grid Menu */}
      {loading ? (
        <div className="text-center py-20 text-gray-400">Memuat menu...</div>
      ) : menus.length === 0 ? (
        <div className="text-center py-20 text-gray-400">Menu tidak ditemukan</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {menus.map((menu) => (
            <MenuCard key={menu.id} menu={menu} />
          ))}
        </div>
      )}
    </div>
  );
}
