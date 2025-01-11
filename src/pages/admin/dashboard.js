import { useEffect, useState } from 'react';
import axios from 'axios';

const Dashboard = () => {
  const [adminData, setAdminData] = useState(null);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard'); 
        setAdminData(response.data);
      } catch (error) {
        console.log('Error fetching admin data:', error);
        window.location.href = '/login';
      }
    };

    fetchAdminData();
  }, []);

  return (
    <div>
      <h1>Welcome to the Dashboard</h1>
      {adminData ? (
        <div>
          <p>Welcome, {adminData.name}</p>
          <p>Your role: {adminData.role}</p>
        </div>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default Dashboard;
