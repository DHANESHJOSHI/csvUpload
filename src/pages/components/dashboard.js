import { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import Chart from './Chart';
import IndiaMap from './IndiaMap';
import {
  TotalScholarshipsCard,
  SelectedApplicationsCard,
  NotSelectedApplicationsCard,
} from '../../components/StatisticsCard';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement,
} from 'chart.js';

// Register Chart.js elements
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement
);

const geoUrl = '/india.json';

const Dashboard = () => {
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedType, setSelectedType] = useState('all');
  const [scholarshipTypes, setScholarshipTypes] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalScholarships: 0,
    selectCount: 0,
    notSelectCount: 0,
    allScholarshipNames: [],
    genderAnalytics: {
      maleApplications: 0,
      femaleApplications: 0,
      otherGenderApplications: 0,
    },
    categoryWiseAnalytics: [],
    stateWiseAnalytics: [],
    scholarshipAnalytics: [],
    financialAnalytics: [{ totalIncome: 0, avgGrade: null }],
  });
  const [loading, setLoading] = useState(true);
  const [selectedStateAnalytics, setSelectedStateAnalytics] = useState(null);

  useEffect(() => {
    fetchData();
  }, [selectedStatus, selectedType]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `/api/admin/analytics?status=${selectedStatus}&type=${selectedType}`
      );
      setAnalytics(response.data);

      const scholarshipResponse = await axios.get(
        `/api/admin/analytics?type=all`
      );
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
        data: analytics.scholarshipAnalytics.map(
          (scholarship) => scholarship.selected
        ),
        backgroundColor: 'rgba(75, 192, 192, 0.8)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 2,
      },
      {
        label: 'Not Selected',
        data: analytics.scholarshipAnalytics.map(
          (scholarship) => scholarship.notSelected
        ),
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

    const stateTypeAnalytics = analytics.stateTypeWiseAnalytics?.find(
      (entry) => entry._id.state.trim().toLowerCase() === stateCode.trim().toLowerCase()
    );

    const combinedAnalytics = {
      ...stateAnalytics,
      ...stateTypeAnalytics,
      _id: stateCode,
    };

    // console.log('Combined Analytics:', analytics);

    setSelectedStateAnalytics(combinedAnalytics);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="p-4 sm:p-6 md:p-8"
    >
      <motion.div
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="mb-4 flex flex-wrap gap-2"
      >
        <select
          className="px-4 py-2 border rounded-lg text-black bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full sm:w-auto"
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
        >
          <option value="all">All Status</option>
          <option value="selected">Selected</option>
          <option value="notSelected">Not Selected</option>
        </select>

        <select
          className="px-4 py-2 border rounded-lg text-black bg-gray-50 shadow-md hover:shadow-lg transition-shadow duration-300 w-full sm:w-auto"
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
        >
          <option value="all">All Types</option>
          {scholarshipTypes.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12"
      >
        <TotalScholarshipsCard totalScholarships={analytics.totalScholarships} />
        <SelectedApplicationsCard selectCount={analytics.selectCount} />
        <NotSelectedApplicationsCard notSelectCount={analytics.notSelectCount} />
      </motion.div>

      <div>
        {loading ? (
                  <div className="flex items-center justify-center min-h-[200px] w-full">
                    <div className="relative inline-flex">
                      <div className="w-8 h-8 bg-blue-500 rounded-full"></div>
                      <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-ping"></div>
                      <div className="w-8 h-8 bg-blue-500 rounded-full absolute top-0 left-0 animate-pulse"></div>
                    </div>
                    <span className="ml-4 text-xl font-semibold bg-gradient-to-r from-teal-500 to-blue-600 bg-clip-text  font-extrabold text-transparent">
                      Loading analytics...
                    </span>
                  </div>        ) : (
          <>
            <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8 mb-12">
              <Chart
                data={pieData}
                type="pie"
                title="Scholarships Selected vs Not Selected"
                options={options}
              />
              <Chart
                data={genderData}
                type="bar"
                title="Gender Analytics"
                options={options}
              />
              <Chart
                data={stateWiseData}
                type="bar"
                title="State-Wise Applications"
                options={options}
              />
              <Chart
                data={scholarshipWiseData}
                type="bar"
                title="Scholarship Analytics"
                options={options}
              />
            </motion.div>
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
              className="p-4 md:p-8 lg:p-10 rounded-xl shadow-2xl backdrop-blur-sm text-black font-medium w-full max-w-full overflow-x-auto"
            >
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold text-black mb-8 border-b pb-4 border-gray-200">
                <span className="bg-clip-text text-white break-words">
                  {selectedStateAnalytics._id} Analytics
                </span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8">
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Total Applications</h4>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent mt-2">{selectedStateAnalytics.total || 0}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Selected</h4>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent mt-2">{selectedStateAnalytics.selected || 0}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Not Selected</h4>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-red-600 to-red-400 bg-clip-text text-transparent mt-2">{selectedStateAnalytics.notSelected || 0}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Total Amount</h4>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-purple-400 bg-clip-text text-transparent mt-2">₹{selectedStateAnalytics.totalAmount || 0}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Amount Disbursed</h4>
                  <p className="text-2xl md:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-indigo-600 to-indigo-400 bg-clip-text text-transparent mt-2">₹{selectedStateAnalytics.amountDisbursed || 0}</p>
                </div>
                <div className="bg-white p-4 md:p-6 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 w-full">
                  <div className="flex flex-col space-y-4">
                    <h4 className="text-base md:text-lg lg:text-xl font-semibold text-gray-800 break-words">Gender Distribution</h4>
                    <div className="grid grid-cols-2 gap-6">
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base text-gray-600 mb-1">Male</span>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-blue-600">{selectedStateAnalytics.male || 0}</p>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-sm md:text-base text-gray-600 mb-1">Female</span>
                        <p className="text-xl md:text-2xl lg:text-3xl font-bold text-pink-600">{selectedStateAnalytics.female || 0}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          </>
        )}
      </div>
    </motion.div>
  );
};

export default Dashboard;
