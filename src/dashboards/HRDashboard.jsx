import React, { useEffect, useState } from 'react';
import HRSidebar from '../components/Common/HRSidebar';
import {
  MdPeople,
  MdPersonOutline,
  MdPersonOff,
  MdAccessTime,
  MdCalendarToday,
} from 'react-icons/md';
import { FaMoon, FaSun } from 'react-icons/fa';
import { Bar, Pie, Line, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement,
} from 'chart.js';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

ChartJS.register(
  ArcElement,
  BarElement,
  LineElement,
  CategoryScale,
  LinearScale,
  Legend,
  Tooltip,
  PointElement
);

const HRDashboard = () => {
  const navigate = useNavigate();

  const [pendingCount, setPendingCount] = useState(0);

  useEffect(() => {
    const fetchPending = async () => {
      try {
        const res = await axios.get("http://192.168.0.100:9000/hr/leaves/pending", {
          headers: { Authorization: `Bearer ${localStorage.getItem("hr_token")}` }
        });
        setPendingCount(res.data.data.leaveIds?.length || 0);
      } catch {
        setPendingCount(0);
      }
    };
    fetchPending();
  }, []);

  const overviewCards = [
    { label: 'Total Employees', icon: <MdPeople />, count: '—' },
    { label: 'Present Today', icon: <MdPersonOutline />, count: '—' },
    { label: 'On Leave', icon: <MdPersonOff />, count: '—' },
    { label: 'Pending Leave Requests', icon: <MdCalendarToday />, count: pendingCount, route: '/HRLeaveApproval' },
    { label: 'Attendance Records', icon: <MdAccessTime />, count: 'check', route: '/HRAttendance' }, // ✅ Added route
];

  const barData = {
    labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
    datasets: [
      {
        label: 'Attendance %',
        data: [90, 85, 95, 88, 92],
        backgroundColor: '#FBBF24',
      },
    ],
  };

  const pieData = {
    labels: ['Present', 'Leave', 'Absent'],
    datasets: [
      {
        data: [75, 15, 10],
        backgroundColor: ['#FBBF24', '#C0504E', '#9BBB59'],
      },
    ],
  };

  const lineData = {
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Punch-in Avg Time',
        data: [9.1, 9.2, 9.0, 9.3],
        fill: false,
        borderColor: '#FBBF24',
        tension: 0.1,
      },
    ],
  };

  const doughnutData = {
    labels: ['Before 6 PM', 'After 6 PM'],
    datasets: [
      {
        data: [80, 20],
        backgroundColor: ['#FBBF24', '#C0504E'],
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  return (
    <div className="flex">
      <HRSidebar />
      <div className="flex-1 ml-64 min-h-screen bg-yellow-50 p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div className="text-2xl font-semibold text-yellow-700">HR Dashboard</div>
          <div className="flex items-center gap-4">
            <FaSun className="text-yellow-500 cursor-pointer" />
            <FaMoon className="text-yellow-700 cursor-pointer" />
            <div className="flex items-center gap-2">
              <img
                src="https://via.placeholder.com/32"
                alt="profile"
                className="w-8 h-8 rounded-full border border-yellow-400"
              />
              <div className="text-sm text-yellow-700">
                <div className="font-semibold">HR Executive</div>
                <div className="text-yellow-600 text-xs">Sujata</div>
              </div>
            </div>
          </div>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {overviewCards.map((item, index) => (
            <div
              key={index}
              onClick={() => item.route && navigate(item.route)}
              className="bg-white p-4 rounded shadow flex flex-col items-center text-center cursor-pointer hover:shadow-md transition"
            >
              <div className="text-3xl text-yellow-500 mb-2">{item.icon}</div>
              <div className="text-lg font-medium text-yellow-700">{item.label}</div>
              <div className="text-2xl text-yellow-600 font-bold mt-1">{item.count ?? '0'}</div>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Weekly Attendance Overview</div>
            <div className="h-48">
              <Bar data={barData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Leave Trend</div>
            <div className="h-48">
              <Pie data={pieData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Punch-in Time Analysis</div>
            <div className="h-48">
              <Line data={lineData} options={chartOptions} />
            </div>
          </div>

          <div className="bg-white p-6 rounded shadow h-72">
            <div className="text-xl font-semibold mb-4 text-yellow-700">Punch-out Time Analysis</div>
            <div className="h-48">
              <Doughnut data={doughnutData} options={chartOptions} />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-right text-xs text-yellow-400">Powered by Transmogrify</div>
      </div>
    </div>
  );
};

export default HRDashboard;
