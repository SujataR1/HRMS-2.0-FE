// import React, { useState, useEffect } from 'react';
// import { FaSignOutAlt, FaBars } from 'react-icons/fa';
// import {
//   MdHome,
//   MdAccountCircle,
//   MdAccessTime,
//   MdNote,
//   MdBeachAccess,
//   MdSettings,
//   MdSchool,
//   MdLock,
//   MdFeedback,
// } from 'react-icons/md';
// import { useNavigate, useLocation } from 'react-router-dom';
// import logo from "../../assets/TransmogriffyLogo.png";

// const EmployeeSidebar = () => {
//   const [active, setActive] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuItems = [
//     { label: 'Dashboard', path: '/EmployeeDashboard', icon: <MdHome size={18} /> },
//     { label: 'My Profile', path: '/MyProfile', icon: <MdAccountCircle size={18} /> },
//     { label: 'My Attendance', path: '/MyAttendance', icon: <MdAccessTime size={18} /> },
//     { label: 'My Leaves', path: '/MyLeaves', icon: <MdNote size={18} /> },
//     { label: 'My Holidays', path: '/MyHoliday', icon: <MdBeachAccess size={18} /> },
//     { label: 'Shift Details', path: '/EmployeeShiftDetails', icon: <MdSettings size={18} /> },
//     { label: 'My Training', path: '/EmployeeTraining', icon: <MdSchool size={18} /> },
//     { label: 'Change Password', path: '/SideForgotPassword', icon: <MdLock size={18} /> },
//     { label: 'Raise a Concern', path: '/EmployeeRaiseConcern', icon: <MdFeedback size={18} /> },
//   ];

//   useEffect(() => {
//     const current = menuItems.find(item => location.pathname.startsWith(item.path));
//     setActive(current ? current.label : '');
//   }, [location.pathname]);

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('employeeToken');
//       localStorage.removeItem('employeeToken');

//       if (token) {
//         await fetch('https://backend.hrms.transev.site/employee/logout', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({}),
//         });
//       }

//       window.location.href = '/';
//     } catch (err) {
//       console.error('Logout error:', err);
//       window.location.href = '/';
//     }
//   };

//   return (
//     <>
//       {/* Hamburger Toggle Button - mobile only */}
//       <button
//         className="fixed top-4 left-4 z-50 p-2 bg-yellow-500 text-white rounded-md md:hidden shadow-lg"
//         onClick={() => setIsSidebarOpen(true)}
//         aria-label="Open sidebar"
//       >
//         <FaBars size={20} />
//       </button>

//       {/* Overlay for mobile when sidebar open */}
//       <div
//         className={`fixed inset-0 bg-black bg-opacity-40 z-40 md:hidden transition-opacity duration-300 ${
//           isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={() => setIsSidebarOpen(false)}
//         aria-hidden="true"
//       ></div>

//       {/* Sidebar */}
//       <nav
//         className={`
//           fixed top-0 left-0 h-full w-64 bg-yellow-50 z-50 shadow-xl transition-transform duration-300
//           transform md:translate-x-0
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//         `}
//         aria-label="Employee sidebar navigation"
//       >
//         {/* Logo */}
//         <div className="pt-6 pb-4 flex flex-col items-center border-b border-yellow-300 select-none">
//           <img src={logo} alt="Company Logo" className="w-24 h-auto" />
//         </div>

//         {/* Menu Items */}
//         <ul className="text-yellow-900 text-sm font-medium px-2 py-4 space-y-1">
//           {menuItems.map(({ label, icon, path }) => (
//             <li
//               key={label}
//               className={`flex items-center gap-3 px-4 py-3 rounded-lg cursor-pointer transition-all duration-300 ${
//                 active === label
//                   ? 'bg-yellow-200 text-yellow-900 shadow-inner'
//                   : 'hover:bg-yellow-100 hover:text-yellow-700'
//               }`}
//               onClick={() => {
//                 navigate(path);
//                 setIsSidebarOpen(false); // Close sidebar on mobile after click
//               }}
//               role="link"
//               tabIndex={0}
//               onKeyPress={e => {
//                 if (e.key === 'Enter' || e.key === ' ') {
//                   navigate(path);
//                   setIsSidebarOpen(false);
//                 }
//               }}
//             >
//               {icon}
//               {label}
//             </li>
//           ))}

//           {/* Logout */}
//           <li
//             className="px-4 py-3 text-red-600 hover:bg-red-100 flex items-center gap-3 mt-6 rounded-lg cursor-pointer transition-all duration-300"
//             onClick={handleLogout}
//             role="button"
//             tabIndex={0}
//             onKeyPress={e => {
//               if (e.key === 'Enter' || e.key === ' ') {
//                 handleLogout();
//               }
//             }}
//           >
//             <FaSignOutAlt size={16} />
//             Logout
//           </li>
//         </ul>
//       </nav>
//     </>
//   );
// };

// export default EmployeeSidebar;

import React, { useState, useEffect } from 'react';
import { 
  FaSignOutAlt, 
  FaBars, 
  FaTachometerAlt, 
  FaUserCircle, 
  FaClock, 
  FaFileAlt,
  FaCalendarAlt,
  FaChartLine,
  FaGraduationCap,
  FaKey,
  FaExclamationTriangle,
  FaChevronDown,
  FaBell,
  FaQuestionCircle,
  FaHome,
  FaRegUser,
  FaSpinner,
  FaShieldAlt
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/TransmogriffyLogo.png";

const EmployeeSidebar = ({ onClose }) => {
  const [active, setActive] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState({
    overview: true,
    time: false,
    career: false,
    support: false
  });
  const [employeeData, setEmployeeData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showNotification, setShowNotification] = useState(true);
  
  const navigate = useNavigate();
  const location = useLocation();

  const menuStructure = {
    overview: {
      title: "MAIN",
      icon: <FaHome size={10} />,
      items: [
        { label: 'Dashboard', path: '/EmployeeDashboard', icon: <FaTachometerAlt size={12} /> },
        { label: 'My Profile', path: '/MyProfile', icon: <FaRegUser size={12} /> },
      ]
    },
    time: {
      title: "ATTENDANCE",
      icon: <FaClock size={10} />,
      items: [
        { label: 'My Attendance', path: '/MyAttendance', icon: <FaClock size={12} /> },
        { label: 'My Leaves', path: '/MyLeaves', icon: <FaFileAlt size={12} /> },
        { label: 'My Holidays', path: '/MyHoliday', icon: <FaCalendarAlt size={12} /> },
        { label: 'Shift Details', path: '/EmployeeShiftDetails', icon: <FaClock size={12} /> },
      ]
    },
    career: {
      title: "GROWTH",
      icon: <FaGraduationCap size={10} />,
      items: [
        { label: 'My Training', path: '/EmployeeTraining', icon: <FaGraduationCap size={12} /> },
        // { label: 'Performance', path: '/EmployeePerformance', icon: <FaChartLine size={12} /> },
      ]
    },
    support: {
      title: "SUPPORT",
      icon: <FaShieldAlt size={10} />,
      items: [
        { label: 'Raise a Concern', path: '/EmployeeRaiseConcern', icon: <FaExclamationTriangle size={12} /> },
        { label: 'Change Password', path: '/SideForgotPassword', icon: <FaKey size={12} /> },
      ]
    }
  };

  useEffect(() => {
    const fetchEmployeeProfile = async () => {
      const token = localStorage.getItem('employee_token') || localStorage.getItem('employeeToken');
      if (!token) {
        setLoading(false);
        return;
      }

      await new Promise(resolve => setTimeout(resolve, 200));

      try {
        const response = await fetch('https://backend.hrms.transev.site/employee/profile', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        });

        const result = await response.json();
        if (result.status === 'success' && result.data) {
          setEmployeeData(result.data);
        }
      } catch (error) {
        console.error('Error fetching employee profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeeProfile();
  }, []);

  useEffect(() => {
    let found = false;
    Object.keys(menuStructure).forEach(section => {
      menuStructure[section].items.forEach(item => {
        if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
          setActive(item.label);
          found = true;
          if (!expandedSections[section]) {
            setExpandedSections(prev => ({ ...prev, [section]: true }));
          }
        }
      });
    });
    if (!found) setActive('');
  }, [location.pathname]);

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('employee_token') || localStorage.getItem('employeeToken');
      localStorage.removeItem('employee_token');
      localStorage.removeItem('employeeToken');
      sessionStorage.clear();

      if (token) {
        await fetch('https://backend.hrms.transev.site/employee/logout', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({}),
        }).catch(() => {});
      }

      navigate('/', { replace: true });
    } catch (err) {
      console.error('Logout error:', err);
      navigate('/', { replace: true });
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (onClose) onClose();
    setIsSidebarOpen(false);
  };

  return (
    <>
      {/* Mobile Toggle */}
      <button
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-md rounded-lg md:hidden hover:shadow-lg transition-all duration-300 flex items-center justify-center"
        onClick={() => setIsSidebarOpen(true)}
      >
        <FaBars size={16} className="text-gray-600" />
      </button>

      {/* Overlay */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
          isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => {
          setIsSidebarOpen(false);
          if (onClose) onClose();
        }}
      />

      {/* Elegant Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-full w-64 bg-white
          z-50 shadow-xl transition-transform duration-300 ease-out
          overflow-y-auto overflow-x-hidden
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:translate-x-0
        `}
      >
        {/* Subtle Top Line */}
        <div className="h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300"></div>

        {/* Logo Section */}
        <div className="pt-8 pb-5 flex flex-col items-center border-b border-gray-100">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-14 h-14 object-contain"
          />
          <div className="mt-3 text-center">
            <h3 className="text-gray-800 font-medium text-sm">Transmogrify</h3>
            <p className="text-gray-400 text-[10px] mt-0.5">Employee Portal</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="mx-4 mt-5 p-3 bg-gray-50 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                {loading ? (
                  <FaSpinner className="text-white text-base animate-spin" />
                ) : (
                  <FaUserCircle className="text-white text-xl" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1">
              {loading ? (
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
                  <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
                </div>
              ) : employeeData ? (
                <>
                  <p className="text-gray-800 text-sm font-medium truncate">
                    {employeeData.name}
                  </p>
                  <p className="text-gray-400 text-[10px] mt-0.5">
                    {employeeData.employeeId}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-gray-800 text-sm font-medium">Guest User</p>
                  <p className="text-gray-400 text-[10px] mt-0.5">Please login</p>
                </>
              )}
            </div>
            <button className="relative w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
              <FaBell className="text-gray-500 text-xs" />
              {showNotification && (
                <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-400 rounded-full"></span>
              )}
            </button>
          </div>
        </div>

        {/* Navigation */}
        <div className="px-3 py-5">
          {Object.keys(menuStructure).map((sectionKey) => {
            const section = menuStructure[sectionKey];
            const isExpanded = expandedSections[sectionKey];
            
            return (
              <div key={sectionKey} className="mb-4">
                <button
                  onClick={() => toggleSection(sectionKey)}
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-50 transition"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400 text-[10px]">{section.icon}</span>
                    <span className="text-gray-500 text-[10px] font-medium tracking-wide">
                      {section.title}
                    </span>
                  </div>
                  <FaChevronDown className={`text-gray-400 text-[8px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {section.items.map((item) => {
                    const isActive = active === item.label;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150
                          ${isActive 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'text-gray-600 hover:text-amber-500 hover:bg-gray-50'
                          }
                        `}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-150 ${isActive ? 'text-amber-500' : 'text-gray-400'}`}>
                          {item.icon}
                        </div>
                        <span className="text-xs flex-1 text-left">{item.label}</span>
                        {isActive && <div className="w-1 h-1 rounded-full bg-amber-400"></div>}
                      </button>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="mx-4 my-2 h-px bg-gray-100"></div>

        {/* Footer */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center">
              <FaSignOutAlt size={12} />
            </div>
            <span className="text-xs">Sign Out</span>
          </button>

          <div className="mt-4 pt-3 text-center border-t border-gray-100">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              <p className="text-gray-400 text-[9px]">© 2024 Transmogrify</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        div::-webkit-scrollbar {
          width: 3px;
        }
        div::-webkit-scrollbar-track {
          background: #f3f4f6;
        }
        div::-webkit-scrollbar-thumb {
          background: #d1d5db;
          border-radius: 10px;
        }
        div::-webkit-scrollbar-thumb:hover {
          background: #9ca3af;
        }
      `}</style>
    </>
  );
};

export default EmployeeSidebar;