import React from 'react';
import AdminSidebar from '../components/Common/AdminSidebar';
import {
  MdPeople,
  MdPersonOutline,
  MdPersonOff,
  MdMeetingRoom,
  MdEventNote,
  MdCake,
  MdDevices,
  MdCalendarToday,
} from 'react-icons/md';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  Title,
} from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale, Legend, Tooltip, Title);

const overviewCards = [
  { label: 'Active Employee', icon: <MdPeople /> },
  { label: 'Present Employee', icon: <MdPersonOutline /> },
  { label: 'Absent Employee', icon: <MdPersonOff /> },
  { label: 'Today Employee on Leave', icon: <MdMeetingRoom /> },
  { label: 'Today Interview', icon: <MdEventNote /> },
  { label: 'Birthday Update', icon: <MdCake /> },
  { label: 'Biometric Devices', icon: <MdDevices /> },
  { label: 'Employee Attendance', icon: <MdCalendarToday /> },
];

const createChartData = (title, data1, data2, color1, color2) => ({
  labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
  datasets: [
    {
      label: `${title} - Group A`,
      data: data1,
      backgroundColor: color1,
      borderRadius: 6,
      barPercentage: 0.6,
    },
    {
      label: `${title} - Group B`,
      data: data2,
      backgroundColor: color2,
      borderRadius: 6,
      barPercentage: 0.6,
    },
  ],
});

const chartOptions = (title) => ({
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    title: {
      display: true,
      text: title,
      font: {
        size: 18,
        weight: 'bold',
      },
      color: '#1a202c',
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#4a5568',
        boxWidth: 15,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: '#2d3748',
      titleColor: '#f7fafc',
      bodyColor: '#edf2f7',
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#2d3748',
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: '#e2e8f0',
        borderDash: [5, 5],
      },
      ticks: {
        color: '#2d3748',
        font: {
          size: 12,
        },
      },
    },
  },
});

const AdminDashboard = () => {
  return (
    <div className="flex">
      <AdminSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-gray-100 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold">Dashboard</div>
          <div className="flex items-center gap-4">
            <FaSun className="text-yellow-500 cursor-pointer" />
            <FaMoon className="text-gray-600 cursor-pointer" />
            <div className="flex items-center gap-2">
              <img
                src="https://via.placeholder.com/32"
                alt="profile"
                className="w-8 h-8 rounded-full"
              />
              <div className="text-sm">
                <div className="font-semibold">Anshuman Sir</div>
                <div className="text-gray-500 text-xs">super admin</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-4 gap-4 mb-6">
          {overviewCards.map((item, index) => (
            <div
              key={index}
              className="bg-white p-4 rounded shadow flex flex-col items-center text-center"
            >
              <div className="text-3xl text-blue-500 mb-2">{item.icon}</div>
              <div className="text-lg font-medium">{item.label}</div>
              <div className="text-2xl text-blue-600 font-bold mt-1">5</div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow h-[400px]">
            <Bar
              data={createChartData(
                'Salary',
                [260, 215, 180, 190, 170, 160],
                [150, 130, 100, 120, 110, 90],
                '#4F81BC',
                '#C0504E'
              )}
              options={chartOptions('Salary Chart')}
            />
          </div>

          <div className="bg-white p-6 rounded shadow h-[400px]">
            <Bar
              data={createChartData(
                'Attendance',
                [80, 70, 75, 60, 85, 90],
                [50, 65, 60, 55, 70, 75],
                '#2F855A',
                '#ED8936'
              )}
              options={chartOptions('Attendance Analysis')}
            />
          </div>

          <div className="bg-white p-6 rounded shadow h-[400px]">
            <Bar
              data={createChartData(
                'Mark-in',
                [9, 8.5, 9.2, 9.1, 8.7, 9],
                [8.6, 9.1, 8.9, 8.4, 9.3, 8.8],
                '#6B46C1',
                '#38B2AC'
              )}
              options={chartOptions('Mark-in Time Analysis')}
            />
          </div>

          <div className="bg-white p-6 rounded shadow h-[400px]">
            <Bar
              data={createChartData(
                'Mark-out',
                [17, 17.2, 17.5, 17.1, 16.9, 17.3],
                [17.4, 16.8, 17.1, 17.2, 17.0, 16.7],
                '#3182CE',
                '#E53E3E'
              )}
              options={chartOptions('Mark-out Time Analysis')}
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className="text-right text-xs text-gray-400">© 2025 Transmogrify</div>
      </div>
    </div>
  );
};

export default AdminDashboard;