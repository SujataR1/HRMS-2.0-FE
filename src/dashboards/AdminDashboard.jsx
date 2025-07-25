import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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

// Light mode chart options
const lightChartOptions = (title) => ({
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
      color: '#1a202c', // dark text
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#4a5568', // gray-600
        boxWidth: 15,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: '#2d3748', // gray-800
      titleColor: '#f7fafc', // gray-50
      bodyColor: '#edf2f7', // gray-100
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: '#2d3748', // gray-800
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: '#e2e8f0', // gray-300
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

// Dark mode chart options
const darkChartOptions = (title) => ({
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
      color: '#ddd', // lighter text
      padding: {
        top: 10,
        bottom: 30,
      },
    },
    legend: {
      position: 'bottom',
      labels: {
        color: '#bbb',
        boxWidth: 15,
        padding: 20,
      },
    },
    tooltip: {
      backgroundColor: '#1a202c', // dark slate
      titleColor: '#f7fafc',
      bodyColor: '#edf2f7',
      padding: 10,
    },
  },
  scales: {
    x: {
      grid: {
        color: '#444',
      },
      ticks: {
        color: '#ddd',
        font: {
          size: 12,
        },
      },
    },
    y: {
      grid: {
        color: '#444',
        borderDash: [5, 5],
      },
      ticks: {
        color: '#ddd',
        font: {
          size: 12,
        },
      },
    },
  },
});

const AdminDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [statusMsg, setStatusMsg] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const token = localStorage.getItem('admin_token');

  useEffect(() => {
    (async () => {
      if (!token) {
        setLoading(false);
        setStatusMsg({ text: 'Not authorized', type: 'error' });
        return;
      }
      try {
        const res = await fetch('https://backend.hrms.transev.site/admin/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (res.ok) {
          setProfile(data.data);
          setStatusMsg(null);
        } else {
          setStatusMsg({ text: data.message || 'Failed to fetch profile', type: 'error' });
        }
      } catch (error) {
        setStatusMsg({ text: error.message || 'Something went wrong', type: 'error' });
      } finally {
        setLoading(false);
      }
    })();
  }, [token]);

  return (
    <div className="flex">
      <AdminSidebar />
      <div
        className={`flex-1 ml-64 min-h-screen p-6 transition-colors duration-300 ${
          darkMode ? 'bg-gray-900 text-gray-200' : 'bg-yellow-50 text-yellow-900'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className={`text-2xl font-semibold ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
            Dashboard
          </div>
          <div className="flex items-center gap-4">
            {darkMode ? (
              <FaSun
                className="text-yellow-400 cursor-pointer"
                onClick={() => setDarkMode(false)}
                title="Switch to Light Mode"
              />
            ) : (
              <FaMoon
                className="text-yellow-700 cursor-pointer"
                onClick={() => setDarkMode(true)}
                title="Switch to Dark Mode"
              />
            )}

            {loading ? (
              <div className={`font-semibold ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                Loading profile...
              </div>
            ) : statusMsg ? (
              <div
                className={`text-sm font-semibold ${
                  statusMsg.type === 'error' ? 'text-red-600' : 'text-green-600'
                }`}
              >
                {statusMsg.text}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <img
                  src={profile?.avatar || 'https://via.placeholder.com/32'}
                  alt="profile"
                  className="w-8 h-8 rounded-full"
                />
                <Link
                  to="/AdminProfile"
                  className={`cursor-pointer no-underline hover:underline flex flex-col text-sm ${
                    darkMode ? 'text-gray-200' : ''
                  }`}
                >
                  <span className={`font-semibold ${darkMode ? 'text-yellow-300' : 'text-yellow-700'}`}>
                    {profile?.name || 'Admin User'}
                  </span>
                  <span className={`text-xs ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                    {profile?.role || 'Admin'}
                  </span>
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {overviewCards.map((item, index) => (
            <div
              key={index}
              className={`p-4 rounded flex flex-col items-center text-center shadow transition-colors duration-300 ${
                darkMode
                  ? 'bg-gray-800 text-gray-200 shadow-gray-700'
                  : 'bg-white text-yellow-700 shadow'
              }`}
            >
              <div className={`text-3xl mb-2 ${darkMode ? 'text-yellow-400' : 'text-yellow-500'}`}>
                {item.icon}
              </div>
              <div className="text-lg font-medium">{item.label}</div>
              <div className={`text-2xl font-bold mt-1 ${darkMode ? 'text-yellow-300' : 'text-yellow-600'}`}>
                5
              </div>
            </div>
          ))}
        </div>

        {/* Chart Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div
            className={`p-6 rounded shadow h-[400px] transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow'
            }`}
          >
            <Bar
              data={createChartData(
                'Salary',
                [260, 215, 180, 190, 170, 160],
                [150, 130, 100, 120, 110, 90],
                '#FBBF24', // amber-400
                '#F59E0B' // amber-500
              )}
              options={darkMode ? darkChartOptions('Salary Chart') : lightChartOptions('Salary Chart')}
            />
          </div>

          <div
            className={`p-6 rounded shadow h-[400px] transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow'
            }`}
          >
            <Bar
              data={createChartData(
                'Attendance',
                [80, 70, 75, 60, 85, 90],
                [50, 65, 60, 55, 70, 75],
                '#FACC15', // yellow-400
                '#D97706' // yellow-600
              )}
              options={darkMode ? darkChartOptions('Attendance Analysis') : lightChartOptions('Attendance Analysis')}
            />
          </div>

          <div
            className={`p-6 rounded shadow h-[400px] transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow'
            }`}
          >
            <Bar
              data={createChartData(
                'Mark-in',
                [9, 8.5, 9.2, 9.1, 8.7, 9],
                [8.6, 9.1, 8.9, 8.4, 9.3, 8.8],
                '#FDE68A', // yellow-300
                '#FBBF24' // amber-400
              )}
              options={darkMode ? darkChartOptions('Mark-in Time Analysis') : lightChartOptions('Mark-in Time Analysis')}
            />
          </div>

          <div
            className={`p-6 rounded shadow h-[400px] transition-colors duration-300 ${
              darkMode ? 'bg-gray-800 shadow-gray-700' : 'bg-white shadow'
            }`}
          >
            <Bar
              data={createChartData(
                'Mark-out',
                [17, 17.2, 17.5, 17.1, 16.9, 17.3],
                [17.4, 16.8, 17.1, 17.2, 17.0, 16.7],
                '#F59E0B', // amber-500
                '#CA8A04' // yellow-700
              )}
              options={darkMode ? darkChartOptions('Mark-out Time Analysis') : lightChartOptions('Mark-out Time Analysis')}
            />
          </div>
        </div>

        {/* Footer Note */}
        <div className={`text-right text-xs ${darkMode ? 'text-gray-500' : 'text-yellow-600'}`}>
          © 2025 Transmogrify
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
