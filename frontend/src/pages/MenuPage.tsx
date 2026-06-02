import { useEffect, useState } from 'react';
import { menuApi, kategoriApi } from '../services/api';
import MenuCard from '../components/MenuCard';

export default function MenuPage() {
  const [menus, setMenus] = useState<any[]>([]);
  const [kategoris, setKategoris] = useState<any[]>([]);
  const [selectedKategori, setSelectedKategori] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    kategoriApi.getAll().then(r => setKategoris(r.data));
  }, []);

  useEffect(() => {
    setLoading(true);
    menuApi.getAll({ kategoriId: selectedKategori || undefined, search: search || undefined })
      .then(r => setMenus(r.data))
      .finally(() => setLoading(false));
  }, [selectedKategori, search]);

  const filtered = menus;

  return (
    <div className="min-h-screen bg-[#0a0a0f] pt-24">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="mb-2">
          <span className="text-[#f5a623] text-sm font-medium tracking-widest uppercase">Pilih Favoritmu</span>
        </div>
        <h1 className="font-display text-4xl font-bold text-white mb-8">
          Menu <span className="gradient-text">Kami</span>
        </h1>

        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          {/* Search */}
          <div className="relative flex-1 max-w-sm">
            <svg className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#7a7a8c]" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"/><path d="M21 21l-4.35-4.35"/>
            </svg>
            <input
              type="text"
              placeholder="Cari menu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="input-dark w-full pl-10 pr-4 py-2.5 rounded-xl text-sm"
            />
          </div>
        </div>

        {/* Category tabs */}
        <div className="flex gap-2 flex-wrap mb-10">
          <FilterBtn active={selectedKategori === null} onClick={() => setSelectedKategori(null)}>
            Semua
          </FilterBtn>
          {kategoris.map(k => (
            <FilterBtn key={k.id} active={selectedKategori === k.id} onClick={() => setSelectedKategori(k.id)}>
              {k.nama}
            </FilterBtn>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden bg-[#13131a] animate-pulse">
                <div className="h-44 bg-[#1c1c27]" />
                <div className="p-4 space-y-2">
                  <div className="h-4 bg-[#1c1c27] rounded-lg w-3/4" />
                  <div className="h-3 bg-[#1c1c27] rounded-lg w-full" />
                  <div className="h-3 bg-[#1c1c27] rounded-lg w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-24">
            <div className="text-5xl mb-4 opacity-40">🔍</div>
            <p className="text-[#7a7a8c]">Menu tidak ditemukan</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
            {filtered.map((menu, i) => (
              <div key={menu.id} className="animate-fade-up" style={{ animationDelay: `${i * 0.04}s`, opacity: 0 }}>
                <MenuCard menu={menu} />
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
        active
          ? 'bg-gold-gradient text-[#0a0a0f] shadow-[0_4px_15px_rgba(245,166,35,0.3)]'
          : 'glass text-[#7a7a8c] hover:text-white hover:border-[rgba(245,166,35,0.2)]'
      }`}
    >
      {children}
    </button>
  );
}
