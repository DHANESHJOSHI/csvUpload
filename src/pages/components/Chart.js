import { Bar, Pie, Line } from 'react-chartjs-2';
import { motion } from 'framer-motion';

const Chart = ({ data, type, title, options }) => {
  if (!data || !data.labels) {
    return <div>Loading...</div>;
  }

  let ChartComponent;

  switch (type) {
    case 'pie':
      ChartComponent = Pie;
      break;
    case 'bar':
      ChartComponent = Bar;
      break;
    case 'line':
      ChartComponent = Line;
      break;
    default:
      ChartComponent = Bar;
  }

  return (
    <motion.div 
      whileHover={{ scale: 1.01 }}
      className="bg-gray-50 p-6 rounded-xl shadow-lg hover:shadow-2xl transition-shadow duration-300"
    >
      <h3 className="text-center text-lg font-bold mb-4 text-gray-800">{title}</h3>
      <div className="h-[350px]">
        <ChartComponent data={data} options={options} />
      </div>
    </motion.div>
  );
};

export default Chart;