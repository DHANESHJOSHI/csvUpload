import { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';
import { FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [scholarshipTypes, setScholarshipTypes] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalScholarships: 0,
    selectCount: 0,
    notSelectCount: 0,
    allScholarshipNames: [],
    genderAnalytics: { maleApplications: 0, femaleApplications: 0, otherGenderApplications: 0 },
    stateWiseAnalytics: [],
    scholarshipAnalytics: [],
  });

  const fetchData = async () => {
    try {
      const response = await axios.get(`/api/admin/analytics?status=${selectedStatus}&type=${selectedType}`);
      setAnalytics(response.data);

      const scholarshipResponse = await axios.get(`/api/admin/analytics?type=all`);
      setScholarshipTypes(scholarshipResponse.data.allScholarshipNames || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedStatus, selectedType]);

  const pieData = {
    labels: ['Selected', 'Not Selected'],
    datasets: [
      {
        data: [analytics.selectCount, analytics.notSelectCount],
        backgroundColor: ['rgba(75, 192, 192, 0.8)', 'rgba(255, 99, 132, 0.8)'],
        borderColor: ['rgba(75, 192, 192, 1)', 'rgba(255, 99, 132, 1)'],
        borderWidth: 2,
      },
    ],
  };

  const genderData = {
    labels: ['Male', 'Female', 'Other'],
    datasets: [
      {
        label: 'Applications',
        data: [
          analytics.genderAnalytics.maleApplications,
          analytics.genderAnalytics.femaleApplications,
          analytics.genderAnalytics.otherGenderApplications,
        ],
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(153, 102, 255, 0.8)',
        ],
        borderColor: [
          'rgba(54, 162, 235, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(153, 102, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const stateData = {
    labels: analytics.stateWiseAnalytics.map((item) => item._id),
    datasets: [
      {
        label: 'Applications per State',
        data: analytics.stateWiseAnalytics.map((item) => item.count),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0.4,
      },
    ],
  };

  const scholarshipData = {
    labels: analytics.scholarshipAnalytics.map((item) => item._id),
    datasets: [
      {
        label: 'Total Applications',
        data: analytics.scholarshipAnalytics.map((item) => item.total),
        backgroundColor: 'rgba(54, 162, 235, 0.8)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 2,
      },
      {
        label: 'Selected Applications',
        data: analytics.scholarshipAnalytics.map((item) => item.selected),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Not Selected Applications',
        data: analytics.scholarshipAnalytics.map((item) => item.notSelected),
        backgroundColor: 'rgba(255, 99, 132, 0.8)',
        borderColor: 'rgba(255, 99, 132, 1)',
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          padding: 20,
          font: {
            size: 14,
          },
        },
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart'
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-8"
    >
      <motion.div 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-6 flex gap-4"
      >
        <select
          className="px-4 py-2 border rounded-lg text-black bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="selected">Selected</option>
          <option value="notSelected">Not Selected</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg text-black bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          {scholarshipTypes.map((type) => (
            <option key={type} value={type}>{type}</option>
          ))}
        </select>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
      >
        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-2xl"
        >
          <FaUsers className="text-blue-500 text-4xl mr-4" />
          <div>
            <h4 className="text-lg font-bold text-gray-800">Total Scholarships</h4>
            <p className="text-2xl font-semibold text-blue-600">{analytics.totalScholarships}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-2xl"
        >
          <FaCheckCircle className="text-green-500 text-4xl mr-4" />
          <div>
            <h4 className="text-lg font-bold text-gray-800">Selected Applications</h4>
            <p className="text-2xl font-semibold text-green-600">{analytics.selectCount}</p>
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.02 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-2xl"
        >
          <FaTimesCircle className="text-red-500 text-4xl mr-4" />
          <div>
            <h4 className="text-lg font-bold text-gray-800">Not Selected Applications</h4>
            <p className="text-2xl font-semibold text-red-600">{analytics.notSelectCount}</p>
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8"
      >
        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-center text-lg font-bold mb-4 text-gray-800">Selected vs Not Selected</h3>
          <div className="h-[350px]">
            <Pie data={pieData} options={options} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-center text-lg font-bold mb-4 text-gray-800">Gender Analytics</h3>
          <div className="h-[350px]">
            <Bar data={genderData} options={options} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-center text-lg font-bold mb-4 text-gray-800">State-wise Applications</h3>
          <div className="h-[350px]">
            <Line data={stateData} options={options} />
          </div>
        </motion.div>

        <motion.div 
          whileHover={{ scale: 1.01 }}
          className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
        >
          <h3 className="text-center text-lg font-bold mb-4 text-gray-800">Scholarship Analytics</h3>
          <div className="h-[350px]">
            <Bar data={scholarshipData} options={options} />
          </div>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Dashboard;