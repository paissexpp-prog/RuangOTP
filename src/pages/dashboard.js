import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import axios from 'axios';
import Layout from '@/components/Layout'; // Pastikan Layout diimport

export default function Dashboard() {
    const [user, setUser] = useState(null);
    const [saldo, setSaldo] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(''); // Untuk nampung error biar gak crash
    const router = useRouter();

    useEffect(() => {
        const userId = localStorage.getItem('user_id');

        // 1. Cek Login
        if (!userId) {
            router.push('/');
            return;
        }

        setUser(userId);

        // 2. Ambil Data Saldo (Dengan Pengaman)
        const fetchData = async () => {
            try {
                // Ambil URL API dari Environment Variable
                const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'https://api.ruangotp.site/api';
                
                const response = await axios.get(`${apiUrl}/balance?userId=${userId}`);
                
                if (response.data && response.data.success) {
                    setSaldo(response.data.data.balance);
                }
            } catch (err) {
                console.error("Gagal ambil saldo:", err);
                // Jangan crash, cukup kasih pesan error kecil
                setError("Gagal memuat saldo. Cek koneksi server.");
            } finally {
                setLoading(false); // Apapun yang terjadi, loading harus berhenti
            }
        };

        fetchData();
    }, [router]);

    // Tampilan saat Loading
    if (loading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-screen">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                </div>
            </Layout>
        );
    }

    // Tampilan Utama
    return (
        <Layout>
            <div className="p-4 space-y-6">
                
                {/* Header Saldo */}
                <div className="bg-gradient-to-r from-blue-600 to-blue-400 p-6 rounded-2xl shadow-lg text-white">
                    <h2 className="text-sm opacity-90 mb-1">Saldo Anda</h2>
                    <h1 className="text-3xl font-bold">
                        Rp {saldo.toLocaleString('id-ID')}
                    </h1>
                    {error && <p className="text-xs text-red-200 mt-2 bg-red-800/20 p-1 rounded">⚠️ {error}</p>}
                </div>

                {/* Menu Grid (Placeholder) */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
                        <span className="text-2xl mb-2">📱</span>
                        <span className="font-medium text-gray-600">OTP SMS</span>
                    </div>
                    <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center justify-center h-32">
                        <span className="text-2xl mb-2">💎</span>
                        <span className="font-medium text-gray-600">Top Up Game</span>
                    </div>
                </div>

            </div>
        </Layout>
    );
}
