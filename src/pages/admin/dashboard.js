import { useEffect, useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie'; 
import Layout from '../components/Layout';
import Dash from '../components/dashboard';

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get('authToken');
    if (!token) {
      router.push('/admin/login');
    } else {
      // If token exists, fetch admin data
      const fetchAdminData = async () => {
        try {
          const response = await axios.get('/api/admin/dashboard', {
            headers: {
              Authorization: `Bearer ${token}`, // Pass the token in the Authorization header
            },
          });
          setAdminData(response.data);
        } catch (error) {
          console.log('Error fetching admin data:', error);
          router.push('/admin/login'); // Redirect to login if the fetch fails (e.g., invalid token)
        }
      };

      fetchAdminData();
    }
  }, [router]);

  if (!adminData) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
    <Dash />
  </Layout>
  );
};

export default Dashboard;
