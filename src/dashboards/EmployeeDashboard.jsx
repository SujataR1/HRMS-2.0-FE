import React from 'react';
import EmployeeSidebar from '../components/Common/EmployeeSidebar';
import {
  MdCheckCircle,
  MdCancel,
  MdWatchLater,
  MdCalendarToday,
} from 'react-icons/md';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Line, Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
} from 'chart.js';

ChartJS.register(
  ArcElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement
);

const overviewCards = [
  { label: 'Present Days', icon: <MdCheckCircle /> },
  { label: 'Absent Days', icon: <MdCancel /> },
  { label: 'Late Entries', icon: <MdWatchLater /> },
  { label: 'Leave Balance', icon: <MdCalendarToday /> },
];

const lineData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
  datasets: [
    {
      label: 'Work Hours',
      data: [40, 42, 38, 41],
      borderColor: '#FBBF24', // yellow-400
      fill: false,
      tension: 0.3,
    },
  ],
};

const pieData = {
  labels: ['Present', 'Leave', 'Absent'],
  datasets: [
    {
      data: [20, 3, 2],
      backgroundColor: ['#FBBF24', '#F59E0B', '#D97706'], // yellow shades
    },
  ],
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'top',
      labels: {
        color: '#92400E', // darker yellow-brown for legend text
      },
    },
  },
  scales: {
    x: {
      ticks: {
        color: '#92400E',
      },
      grid: {
        color: '#FDE68A',
      },
    },
    y: {
      ticks: {
        color: '#92400E',
      },
      grid: {
        color: '#FDE68A',
      },
    },
  },
};

const EmployeeDashboard = () => {
  return (
    <div className="flex">
      <EmployeeSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-yellow-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-yellow-700">Employee Dashboard</div>
          <div className="flex items-center gap-4">
            <FaSun className="text-yellow-500 cursor-pointer" />
            <FaMoon className="text-yellow-700 cursor-pointer" />
            <div className="flex items-center gap-2">
              <img
                src="https://via.placeholder.com/"
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <div className="font-semibold text-yellow-800">Welcome, SUJATA ROUTH</div>
                <div className="text-yellow-600 text-xs">Employee</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {overviewCards.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex flex-col items-center text-center"
            >
              <div className="text-3xl text-yellow-500 mb-2">{item.icon}</div>
              <div className="text-lg font-medium text-yellow-700">{item.label}</div>
              <div className="text-2xl text-yellow-600 font-bold mt-1">5</div>
            </div>
          ))}
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Work Hour Trend</div>
            <div className="h-48">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Attendance Summary</div>
            <div className="h-48">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-xs text-yellow-400 mt-6">Powered by Transmogrify</div>
      </div>
    </div>
  );
};

export default EmployeeDashboard;
