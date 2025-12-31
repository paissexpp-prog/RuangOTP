import { useState } from 'react';
import AuthModal from './AuthModal';

export default function Navbar() {
  const [showAuth, setShowAuth] = useState(false);

  return (
    <>
      <nav className="bg-white shadow-md p-4 fixed w-full top-0 z-40">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-2xl font-bold text-blue-600">
            RuangOTP
          </div>
          
          <div>
            <button
              onClick={() => setShowAuth(true)}
              className="bg-blue-600 text-white px-6 py-2 rounded-full hover:bg-blue-700 font-medium transition"
            >
              Login / Register
            </button>
          </div>
        </div>
      </nav>

      <AuthModal isOpen={showAuth} onClose={() => setShowAuth(false)} />
    </>
  );
}
