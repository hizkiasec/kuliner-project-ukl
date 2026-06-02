import { Link } from 'react-router-dom';
import { useEffect, useRef } from 'react';

const FEATURES = [
  { icon: '🍽️', title: 'Menu Pilihan', desc: 'Ratusan pilihan makanan & minuman premium dari dapur terbaik kami' },
  { icon: '⚡', title: 'Pesan Kilat', desc: 'Dari tap ke meja dalam hitungan menit. Tanpa antri, tanpa repot' },
  { icon: '📡', title: 'Live Tracking', desc: 'Pantau status pesananmu secara real-time dari Menunggu sampai Selesai' },
];

const FOODS = ['🍜', '🍛', '🥗', '🍣', '☕', '🧋', '🍰', '🥩'];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const handler = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      el.style.setProperty('--mx', `${x}%`);
      el.style.setProperty('--my', `${y}%`);
    };
    el.addEventListener('mousemove', handler);
    return () => el.removeEventListener('mousemove', handler);
  }, []);

  return (
    <div className="min-h-screen bg-[#0a0a0f]">
      {/* Hero */}
      <section
        ref={heroRef}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
        style={{
          background: 'radial-gradient(ellipse at var(--mx, 50%) var(--my, 40%), rgba(245,166,35,0.08) 0%, transparent 60%), #0a0a0f',
        }}
      >
        {/* Floating food emojis */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {FOODS.map((emoji, i) => (
            <div
              key={i}
              className="absolute text-3xl opacity-10 animate-float"
              style={{
                left: `${10 + (i * 11) % 85}%`,
                top: `${8 + (i * 17) % 75}%`,
                animationDelay: `${i * 0.4}s`,
                animationDuration: `${3 + (i % 3)}s`,
                filter: 'blur(0.5px)',
              }}
            >
              {emoji}
            </div>
          ))}
        </div>

        {/* Glow orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#f5a623] opacity-[0.04] rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-[#e8872a] opacity-[0.05] rounded-full blur-3xl pointer-events-none" />

        {/* Grid lines */}
        <div
          className="absolute inset-0 pointer-events-none opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)',
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative text-center px-6 max-w-4xl mx-auto pt-20">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass mb-8 animate-fade-up stagger-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#4ade80] shadow-[0_0_6px_#4ade80]"></span>
            <span className="text-xs text-[#7a7a8c] font-medium tracking-wider uppercase">Sistem Pemesanan Online</span>
          </div>

          {/* Heading */}
          <h1 className="font-display text-5xl md:text-7xl font-bold leading-tight mb-6 animate-fade-up stagger-2">
            <span className="text-white">Nikmati Kuliner</span>
            <br />
            <span className="gradient-text">Terbaik Kami</span>
          </h1>

          <p className="text-[#7a7a8c] text-lg md:text-xl max-w-xl mx-auto mb-10 leading-relaxed animate-fade-up stagger-3">
            Pesan makanan dan minuman favorit langsung dari meja kamu.
            Cepat, mudah, dan selalu fresh dari dapur.
          </p>

          {/* CTA */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-up stagger-4">
            <Link
              to="/menu"
              className="btn-gold px-8 py-4 rounded-2xl text-base inline-flex items-center gap-2 justify-center"
            >
              Jelajahi Menu
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <path d="M5 12h14M12 5l7 7-7 7"/>
              </svg>
            </Link>
            <Link
              to="/register"
              className="px-8 py-4 rounded-2xl text-base glass hover:bg-[rgba(255,255,255,0.06)] transition-all duration-200 inline-flex items-center gap-2 justify-center text-[#a0a0b0] hover:text-white"
            >
              Daftar Gratis
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-16 grid grid-cols-3 gap-4 max-w-sm mx-auto animate-fade-up stagger-5">
            {[['12+', 'Menu Pilihan'], ['⚡', 'Order Cepat'], ['24/7', 'Selalu Buka']].map(([val, label]) => (
              <div key={label} className="text-center">
                <div className="text-2xl font-display font-bold gradient-text">{val}</div>
                <div className="text-xs text-[#7a7a8c] mt-0.5">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
          <span className="text-xs text-[#7a7a8c] tracking-widest uppercase">Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-[#f5a623] to-transparent animate-pulse"></div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 max-w-6xl mx-auto">
        <div className="text-center mb-16">
          <p className="text-[#f5a623] text-sm font-medium tracking-widest uppercase mb-3">Kenapa Kami?</p>
          <h2 className="font-display text-3xl md:text-4xl font-bold text-white">
            Pengalaman Makan yang <span className="gradient-text">Berbeda</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {FEATURES.map((f, i) => (
            <div
              key={i}
              className="menu-card rounded-2xl p-8 group relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-[rgba(245,166,35,0.03)] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="text-4xl mb-5">{f.icon}</div>
              <h3 className="font-semibold text-lg text-white mb-2">{f.title}</h3>
              <p className="text-[#7a7a8c] text-sm leading-relaxed">{f.desc}</p>
              <div className="mt-6 w-8 h-0.5 bg-gold-gradient rounded-full group-hover:w-16 transition-all duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA Banner */}
      <section className="px-6 pb-24 max-w-6xl mx-auto">
        <div
          className="relative rounded-3xl overflow-hidden p-12 text-center"
          style={{ background: 'linear-gradient(135deg, #1c1c27, #252535)' }}
        >
          <div className="absolute inset-0 opacity-30" style={{
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(245,166,35,0.15) 0%, transparent 50%), radial-gradient(circle at 80% 50%, rgba(232,135,42,0.1) 0%, transparent 50%)'
          }} />
          <div className="relative">
            <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-4">
              Siap Untuk Memesan? 🍜
            </h2>
            <p className="text-[#7a7a8c] mb-8 max-w-md mx-auto">
              Bergabunglah dan nikmati kemudahan memesan makanan favorit kamu
            </p>
            <Link to="/menu" className="btn-gold px-8 py-4 rounded-2xl text-base inline-block">
              Mulai Pesan Sekarang
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-[rgba(255,255,255,0.05)] py-8 px-6 text-center">
        <div className="text-sm text-[#7a7a8c]">
          <span className="gradient-text font-semibold">Kuliner App</span> — Dibuat dengan ❤️ untuk pengalaman makan terbaik
        </div>
      </footer>
    </div>
  );
}
