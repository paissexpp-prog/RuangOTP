import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Layout from '../components/Layout';
import api from '../utils/api';
import Swal from 'sweetalert2';

export default function Dashboard() {
  const router = useRouter();
  const [balance, setBalance] = useState(0);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = localStorage.getItem('user_id');
    if (!userId) {
      router.push('/');
      return;
    }

    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const balanceRes = await api.get('/balance');
      setBalance(balanceRes.data.balance);

      const serviceRes = await api.get('/services');
      setServices(serviceRes.data.data || []);
      
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data", error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_id');
    router.push('/');
  };

  const handleOrder = (serviceCode) => {
    Swal.fire('Info', `Fitur order ${serviceCode} akan segera aktif!`, 'info');
  };

  if (loading) return <div className="text-center mt-20">Memuat data...</div>;

  return (
    <Layout>
      <div className="bg-white p-6 rounded-lg shadow-md mb-8 flex justify-between items-center">
        <div>
          <h2 className="text-xl font-bold text-gray-700">Halo, User!</h2>
          <p className="text-gray-500">Saldo Anda saat ini:</p>
          <div className="text-3xl font-extrabold text-green-600">
            Rp {balance.toLocaleString('id-ID')}
          </div>
        </div>
        <button 
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Logout
        </button>
      </div>

      <h3 className="text-xl font-bold mb-4 text-gray-800">Daftar Layanan Tersedia</h3>
      
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {services.map((service) => (
          <div 
            key={service.service_code} 
            className="bg-white p-4 rounded-lg shadow hover:shadow-lg transition cursor-pointer border hover:border-blue-500"
            onClick={() => handleOrder(service.service_code)}
          >
            <div className="font-bold text-center text-blue-700 mb-2">
              {service.service_name}
            </div>
            <div className="text-xs text-center text-gray-500">
              Kode: {service.service_code}
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}
