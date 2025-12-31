import { useState, useRef } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import Swal from 'sweetalert2';
import api from '../utils/api';
import { useRouter } from 'next/router';

export default function AuthModal({ isOpen, onClose }) {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const recaptchaRef = useRef(null);
  const router = useRouter();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = recaptchaRef.current.getValue();

    if (!token) {
      return Swal.fire('Error', 'Selesaikan ReCAPTCHA terlebih dahulu', 'error');
    }

    if (!isLoginMode && password.length < 8) {
      return Swal.fire('Error', 'Password minimal 8 karakter', 'error');
    }

    try {
      const endpoint = isLoginMode ? '/auth/login' : '/auth/register';
      const payload = { email, password, recaptchaToken: token };

      const { data } = await api.post(endpoint, payload);

      if (data.success) {
        localStorage.setItem('user_id', data.userId);
        Swal.fire('Sukses', isLoginMode ? 'Login Berhasil' : 'Registrasi Berhasil', 'success');
        onClose();
        router.push('/dashboard');
      }
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
      recaptchaRef.current.reset();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-8 rounded-lg w-96 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-red-500">
          ✕
        </button>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-black">
          {isLoginMode ? 'Login User' : 'Registrasi Baru'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Email (Gmail)</label>
            <input
              type="email"
              required
              className="w-full border p-2 rounded text-black"
              placeholder="contoh@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <input
              type="password"
              required
              minLength={8}
              className="w-full border p-2 rounded text-black"
              placeholder="Minimal 8 karakter"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <div className="flex justify-center my-4">
            <ReCAPTCHA
              ref={recaptchaRef}
              sitekey={process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition"
          >
            {isLoginMode ? 'Masuk Sekarang' : 'Daftar Akun'}
          </button>
        </form>

        <p className="mt-4 text-center text-sm text-gray-600">
          {isLoginMode ? 'Belum punya akun? ' : 'Sudah punya akun? '}
          <span
            className="text-blue-600 cursor-pointer font-bold"
            onClick={() => setIsLoginMode(!isLoginMode)}
          >
            {isLoginMode ? 'Daftar disini' : 'Login disini'}
          </span>
        </p>
      </div>
    </div>
  );
}
