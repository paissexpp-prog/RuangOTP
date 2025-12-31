import Navbar from './Navbar'; // Navbar atas
import BottomNav from './BottomNav'; // <--- Import ini

export default function Layout({ children }) {
  return (
    <div className="bg-gray-50 min-h-screen pb-20"> {/* Tambah padding bawah (pb-20) biar konten gak ketutup menu */}
      <Navbar />
      <main className="container mx-auto p-4">
        {children}
      </main>
      <BottomNav /> {/* <--- Pasang disini */}
    </div>
  );
}
