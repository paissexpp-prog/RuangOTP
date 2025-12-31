import Navbar from '../components/Navbar';
import Head from 'next/head';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>RuangOTP - Layanan OTP Tercepat</title>
      </Head>

      <Navbar />

      <main className="pt-24 px-4 max-w-7xl mx-auto">
        <div className="text-center py-20">
          <h1 className="text-5xl font-extrabold text-gray-900 mb-6">
            Solusi OTP Cepat & Otomatis
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Dapatkan nomor verifikasi untuk WhatsApp, Telegram, Google, dan ribuan aplikasi lainnya secara instan 24/7.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-3xl mb-4">🚀</div>
              <h3 className="text-xl font-bold text-black mb-2">Proses Instan</h3>
              <p className="text-gray-600">Kode OTP muncul dalam hitungan detik secara otomatis.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-bold text-black mb-2">Harga Termurah</h3>
              <p className="text-gray-600">Harga bersaing dengan keuntungan reseller yang menjanjikan.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-sm border">
              <div className="text-3xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold text-black mb-2">Garansi Refund</h3>
              <p className="text-gray-600">Saldo otomatis kembali jika OTP tidak masuk.</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
