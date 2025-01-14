import Dash from '../components/dashboard';
import { parseCookies } from 'nookies';
import jwt from 'jsonwebtoken';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { Line, Pie, Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  BarElement
);

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [scholarshipTypes, setScholarshipTypes] = useState([]);
  const [pieData, setPieData] = useState({
    labels: ['Selected', 'Not Selected'],
    datasets: [
      {
        data: [0, 0],
        backgroundColor: [
          'rgba(75, 192, 192, 0.8)',
          'rgba(255, 99, 132, 0.8)',
        ],
        borderColor: [
          'rgba(75, 192, 192, 1)',
          'rgba(255, 99, 132, 1)',
        ],
        borderWidth: 2,
      },
    ],
  });

  const [barData, setBarData] = useState({
    labels: ['Total Students Count'],
    datasets: [
      {
        label: 'Total Students',
        data: [0],
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
        borderRadius: 5,
      },
    ],
  });

  // const router = useRouter();

  // // Check if the token exists and is valid (client-side)
  // useEffect(() => {
  //   const token = parseCookies().authToken;
  //   if (!token) {
  //     // If no token, redirect to login
  //     router.push('/admin/login');
  //     return;
  //   }

  //   try {
  //     jwt.verify(token, process.env.JWT_SECRET);
  //   } catch (err) {
  //     // If token is invalid, clear it and redirect to login
  //     router.push('/admin/login');
  //   }
  // }, [router]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch the data with the selected filters
        const response = await axios.get(`/api/admin/analytics?status=${selectedStatus}&type=${selectedType}`);
        
        // Update Pie Chart data
        setPieData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [response.data.selectCount, response.data.notSelectCount],
          }],
        }));
        
        // Update Bar Chart data
        setBarData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [response.data.totalScholarships],
          }],
        }));
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      }
    };

    fetchData();
  }, [selectedStatus, selectedType]);

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 14
          }
        }
      },
      title: {
        display: false,
        text: 'Scholarship Status',
        font: {
          size: 16,
          weight: 'bold'
        }
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      },
      x: {
        grid: {
          color: 'rgba(0, 0, 0, 0.1)'
        }
      }
    }
  };

  return (
    <div className="p-8">
      <div className="mb-6 flex gap-4">
        {/* Dropdown for selecting Status */}
        <select 
          className="px-4 py-2 border rounded-lg text-black"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="selected">Selected</option>
          <option value="notSelected">Not Selected</option>
        </select>
        
        {/* Dropdown for selecting Scholarship Type */}
        <select 
          className="px-4 py-2 border rounded-lg text-black"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          {scholarshipTypes.map((type) => (
            <option key={type._id} value={type._id}>{type.name}</option>
          ))}
        </select>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* Pie Chart showing selected vs not selected count */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-[350px]">
            <Pie data={pieData} options={{...options, aspectRatio: 1}} />
          </div>
        </div>
        
        {/* Bar Chart showing total student count */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-[350px]">
            <Bar data={barData} options={options} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
