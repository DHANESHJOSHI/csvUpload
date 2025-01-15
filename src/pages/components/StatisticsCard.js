import { motion } from 'framer-motion';
import { FaUsers, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';

const StatisticsCard = ({ Icon, title, count, iconColor, textColor }) => (
  <motion.div 
    whileHover={{ scale: 1.02 }}
    className="bg-gray-50 p-6 rounded-xl shadow-lg flex items-center transform transition-all duration-300 hover:shadow-2xl"
  >
    <Icon className={`${iconColor} text-4xl mr-4`} />
    <div>
      <h4 className="text-lg font-bold text-gray-800">{title}</h4>
      <p className={`text-2xl font-semibold ${textColor}`}>{count}</p>
    </div>
  </motion.div>
);

export const TotalScholarshipsCard = ({ totalScholarships }) => (
  <StatisticsCard 
    Icon={FaUsers} 
    title="Total Scholarships" 
    count={totalScholarships} 
    iconColor="text-blue-500" 
    textColor="text-blue-600" 
  />
);

export const SelectedApplicationsCard = ({ selectCount }) => (
  <StatisticsCard 
    Icon={FaCheckCircle} 
    title="Selected Applications" 
    count={selectCount} 
    iconColor="text-green-500" 
    textColor="text-green-600" 
  />
);

export const NotSelectedApplicationsCard = ({ notSelectCount }) => (
  <StatisticsCard 
    Icon={FaTimesCircle} 
    title="Not Selected Applications" 
    count={notSelectCount} 
    iconColor="text-red-500" 
    textColor="text-red-600" 
  />
);
