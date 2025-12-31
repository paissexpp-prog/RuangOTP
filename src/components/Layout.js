// Pastikan baris import ini ada!
import Navbar from './Navbar';
import BottomNav from './BottomNav'; // <--- JANGAN LUPA INI

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen pb-24"> {/* Tambah padding bawah biar konten ga ketutup */}
      <Navbar />
      
      <main className="container mx-auto p-4">
        {children}
      </main>

      {/* PASTIIN KOMPONEN INI DIPASANG DISINI */}
      <BottomNav /> 
    </div>
  );
}
