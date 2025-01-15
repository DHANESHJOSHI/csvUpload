import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Chart from './Chart';
import IndiaMap from './IndiaMap';
import { TotalScholarshipsCard, SelectedApplicationsCard, NotSelectedApplicationsCard } from './StatisticsCard';
import { Chart as ChartJS, ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, BarElement } from 'chart.js';

// Register Chart.js elements
ChartJS.register(ArcElement, CategoryScale, LinearScale, Title, Tooltip, Legend, PointElement, LineElement, BarElement);

const geoUrl = "/india.json";

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
    categoryWiseAnalytics: [],
    stateWiseAnalytics: [],
    scholarshipAnalytics: [],
    financialAnalytics: [{ totalIncome: 0, avgGrade: null }],
  });
  const [loading, setLoading] = useState(true);
  const [selectedStateAnalytics, setSelectedStateAnalytics] = useState(null);
  const [selectedStateTypeAnalytics, setSelectedStateTypeAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedStatus, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/admin/analytics?status=${selectedStatus}&type=${selectedType}`);
      setAnalytics(response.data);

      const scholarshipResponse = await axios.get(`/api/admin/analytics?type=all`);
      setScholarshipTypes(scholarshipResponse.data.allScholarshipNames || []);
    } catch (error) {
      console.error('Error fetching analytics data:', error);
    } finally {
      setLoading(false);
    }
  };

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
        borderWidth: 1,
        barThickness: 50,
        borderRadius: 5,
        maxBarThickness: 80,
        minBarLength: 10,
      },
    ],
  };

  const stateWiseData = {
    labels: analytics.stateWiseAnalytics.map((state) => state._id),
    datasets: [
      {
        label: 'Applications',
        data: analytics.stateWiseAnalytics.map((state) => state.count),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
    ],
  };

  const scholarshipWiseData = {
    labels: analytics.scholarshipAnalytics.map((scholarship) => scholarship._id),
    datasets: [
      {
        label: 'Selected',
        data: analytics.scholarshipAnalytics.map((scholarship) => scholarship.selected),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Not Selected',
        data: analytics.scholarshipAnalytics.map((scholarship) => scholarship.notSelected),
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
      easing: 'easeInOutQuart',
    },
  };

  const handleStateClick = (stateCode) => {
    const stateAnalytics = analytics.stateWiseAnalytics.find(
        (state) => state._id === stateCode
    );

    const stateTypeAnalytics = analytics.stateTypeWiseAnalytics.find(
        (entry) => entry._id.state.trim().toLowerCase() === stateCode.trim().toLowerCase()
    );

    const combinedAnalytics = {
        ...stateAnalytics,
        ...stateTypeAnalytics,
        _id: stateCode,
    };

    setSelectedStateAnalytics(combinedAnalytics);
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
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-3 gap-8 mb-12"
      >
        <TotalScholarshipsCard totalScholarships={analytics.totalScholarships} />
        <SelectedApplicationsCard selectCount={analytics.selectCount} />
        <NotSelectedApplicationsCard notSelectCount={analytics.notSelectCount} />
      </motion.div>

            <motion.div>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="relative w-24 h-24">
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-full h-full border-8 border-blue-500 rounded-full border-t-transparent animate-spin"></div>
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                      <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div className="ml-4">
                    <div className="text-xl font-semibold text-gray-700">Loading</div>
                    <div className="text-sm text-gray-500 animate-pulse">Please wait while we fetch your data...</div>
                  </div>
                </div>
              ) : (
                <motion.div 
                  className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5 }}
                >
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chart data={pieData} type="pie" title="Scholarships Selected vs Not Selected" options={options} />
                  </motion.div>
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chart data={genderData} type="bar" title="Gender Analytics" options={options} />
                  </motion.div>
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chart data={stateWiseData} type="bar" title="State-Wise Applications" options={options} />
                  </motion.div>
                  <motion.div 
                    className="bg-white p-6 rounded-xl shadow-lg"
                    whileHover={{ scale: 1.02 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Chart data={scholarshipWiseData} type="bar" title="Scholarship Analytics" options={options} />
                  </motion.div>
                </motion.div>
              )}
            </motion.div>
 <div className="flex">
  
  <IndiaMap 
    geoUrl={geoUrl} 
    stateWiseAnalytics={analytics.stateWiseAnalytics} 
    stateTypeWiseAnalytics={analytics.stateTypeWiseAnalytics} 
    genderData={analytics.genderAnalytics} 
    scholarshipData={analytics.scholarshipAnalytics} 
    onStateClick={handleStateClick} 
  />
          {selectedStateAnalytics && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="mt-12 p-4 md:p-6 bg-transparent rounded-xl shadow-2xl backdrop-blur-sm text-black font-semibold"
            >
              <h3 className="text-2xl md:text-3xl font-bold text-black mb-6 border-b pb-3 border-gray-200">
                <span className="bg-clip-text text-white">
                  {selectedStateAnalytics._id} Analytics
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="text-base md:text-lg font-medium text-black font-semibold">Total Applications</h4>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">{selectedStateAnalytics.total || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="text-base md:text-lg font-medium text-black font-semibold">Selected</h4>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">{selectedStateAnalytics.selected || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="text-base md:text-lg font-medium text-black font-semibold">Not Selected</h4>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent">{selectedStateAnalytics.notSelected || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="text-base md:text-lg font-medium text-black font-semibold">Total Amount</h4>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent">₹{selectedStateAnalytics.totalAmount || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <h4 className="text-base md:text-lg font-medium text-black font-semibold">Amount Disbursed</h4>
                  <p className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent">₹{selectedStateAnalytics.amountDisbursed || 0}</p>
                </div>
                <div className="bg-white p-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1">
                  <div className="flex justify-between items-center">
                    <div>
                      <h4 className="text-base md:text-lg font-medium text-black font-semibold">Gender Distribution</h4>
                      <div className="flex gap-4 mt-2">
                        <div>
                          <span className="text-sm text-black">Male</span>
                          <p className="text-xl md:text-2xl font-bold text-blue-600">{selectedStateAnalytics.male || 0}</p>
                        </div>
                        <div>
                          <span className="text-sm text-black">Female</span>
                          <p className="text-xl md:text-2xl font-bold text-pink-600">{selectedStateAnalytics.female || 0}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
      </div>
    </motion.div>
  );
};

export default Dashboard;