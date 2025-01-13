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
  BarElement
} from 'chart.js';
import { useEffect, useState } from 'react';
import axios from 'axios';

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
  // const lineData = {
  //   labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
  //   datasets: [
  //     {
  //       label: 'Monthly Data',
  //       data: [65, 59, 80, 81, 56, 55, 40, 70, 75, 85, 90, 100],
  //       fill: true,
  //       backgroundColor: 'rgba(75, 192, 192, 0.2)',
  //       borderColor: 'rgb(75, 192, 192)',
  //       tension: 0.4
  //     }
  //   ]
  // };

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/admin/analytics');
        setPieData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [response.data.selectCount, response.data.notSelectCount],
          }]
        }));
        
        setBarData(prevData => ({
          ...prevData,
          datasets: [{
            ...prevData.datasets[0],
            data: [response.data.totalScholarships]
          }]
        }));
      } catch (error) {
        console.error('Error fetching pie data:', error);
      }
    };

    fetchData();
  }, []);


  

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
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {/* <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-[400px]">
            <Line data={lineData} options={options} />
          </div>
        </div> */}
        <div className="bg-white p-6 rounded-xl shadow-lg">
          <div className="h-[350px]">
            <Pie data={pieData} options={{...options, aspectRatio: 1}} />
          </div>
        </div>
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