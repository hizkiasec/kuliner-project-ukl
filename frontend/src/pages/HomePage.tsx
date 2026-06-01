import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="bg-gradient-to-br from-primary-500 to-primary-700 text-white py-20 px-4 text-center">
        <h1 className="text-4xl font-bold mb-4">🍜 Selamat Datang di Kuliner App</h1>
        <p className="text-xl text-primary-100 mb-8 max-w-xl mx-auto">
          Pesan makanan dan minuman favorit kamu dengan mudah dan cepat langsung dari meja
        </p>
        <Link
          to="/menu"
          className="bg-white text-primary-600 px-8 py-3 rounded-full font-bold text-lg hover:bg-primary-50 transition inline-block"
        >
          Lihat Menu
        </Link>
      </section>

      {/* Fitur */}
      <section className="max-w-4xl mx-auto px-4 py-16 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-5xl mb-4">📋</div>
          <h3 className="font-bold text-lg mb-2">Menu Lengkap</h3>
          <p className="text-gray-500 text-sm">Berbagai pilihan makanan dan minuman tersedia untuk kamu</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-5xl mb-4">⚡</div>
          <h3 className="font-bold text-lg mb-2">Pesan Cepat</h3>
          <p className="text-gray-500 text-sm">Proses pemesanan yang mudah dan langsung ke dapur</p>
        </div>
        <div className="p-6 bg-white rounded-2xl shadow-sm border">
          <div className="text-5xl mb-4">📊</div>
          <h3 className="font-bold text-lg mb-2">Pantau Status</h3>
          <p className="text-gray-500 text-sm">Lihat status pesanan kamu secara real-time</p>
        </div>
      </section>
    </div>
  );
}
