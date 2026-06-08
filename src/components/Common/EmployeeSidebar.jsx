

// import React, { useState, useEffect } from 'react';
// import { 
//   FaSignOutAlt, 
//   FaBars, 
//   FaTachometerAlt, 
//   FaUserCircle, 
//   FaClock, 
//   FaFileAlt,
//   FaCalendarAlt,
//   FaChartLine,
//   FaGraduationCap,
//   FaKey,
//   FaExclamationTriangle,
//   FaChevronDown,
//   FaBell,
//   FaQuestionCircle,
//   FaHome,
//   FaRegUser,
//   FaSpinner,
//   FaShieldAlt
// } from 'react-icons/fa';
// import { useNavigate, useLocation } from 'react-router-dom';
// import logo from "../../assets/TransmogriffyLogo.png";

// const EmployeeSidebar = ({ onClose }) => {
//   const [active, setActive] = useState('');
//   const [isSidebarOpen, setIsSidebarOpen] = useState(false);
//   const [expandedSections, setExpandedSections] = useState({
//     overview: true,
//     time: false,
//     career: false,
//     support: false
//   });
//   const [employeeData, setEmployeeData] = useState(null);
//   const [loading, setLoading] = useState(true);
//   const [showNotification, setShowNotification] = useState(true);
  
//   const navigate = useNavigate();
//   const location = useLocation();

//   const menuStructure = {
//     overview: {
//       title: "MAIN",
//       icon: <FaHome size={10} />,
//       items: [
//         { label: 'Dashboard', path: '/EmployeeDashboard', icon: <FaTachometerAlt size={12} /> },
//         { label: 'My Profile', path: '/MyProfile', icon: <FaRegUser size={12} /> },
//       ]
//     },
//     time: {
//       title: "ATTENDANCE",
//       icon: <FaClock size={10} />,
//       items: [
//         { label: 'My Attendance', path: '/MyAttendance', icon: <FaClock size={12} /> },
//         { label: 'My Leaves', path: '/MyLeaves', icon: <FaFileAlt size={12} /> },
//         { label: 'My Holidays', path: '/MyHoliday', icon: <FaCalendarAlt size={12} /> },
//         { label: 'Shift Details', path: '/EmployeeShiftDetails', icon: <FaClock size={12} /> },
//       ]
//     },
//     career: {
//       title: "GROWTH",
//       icon: <FaGraduationCap size={10} />,
//       items: [
//         { label: 'My Training', path: '/EmployeeTraining', icon: <FaGraduationCap size={12} /> },
//         // { label: 'Performance', path: '/EmployeePerformance', icon: <FaChartLine size={12} /> },
//       ]
//     },
//     support: {
//       title: "SUPPORT",
//       icon: <FaShieldAlt size={10} />,
//       items: [
//         { label: 'Raise a Concern', path: '/EmployeeRaiseConcern', icon: <FaExclamationTriangle size={12} /> },
//         { label: 'Change Password', path: '/SideForgotPassword', icon: <FaKey size={12} /> },
//       ]
//     }
//   };

//   useEffect(() => {
//     const fetchEmployeeProfile = async () => {
//       const token = localStorage.getItem('employee_token') || localStorage.getItem('employeeToken');
//       if (!token) {
//         setLoading(false);
//         return;
//       }

//       await new Promise(resolve => setTimeout(resolve, 200));

//       try {
//         const response = await fetch('https://backend.hrms.transev.site/employee/profile', {
//           method: 'GET',
//           headers: {
//             'Authorization': `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//         });

//         const result = await response.json();
//         if (result.status === 'success' && result.data) {
//           setEmployeeData(result.data);
//         }
//       } catch (error) {
//         console.error('Error fetching employee profile:', error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchEmployeeProfile();
//   }, []);

//   useEffect(() => {
//     let found = false;
//     Object.keys(menuStructure).forEach(section => {
//       menuStructure[section].items.forEach(item => {
//         if (location.pathname === item.path || location.pathname.startsWith(item.path + '/')) {
//           setActive(item.label);
//           found = true;
//           if (!expandedSections[section]) {
//             setExpandedSections(prev => ({ ...prev, [section]: true }));
//           }
//         }
//       });
//     });
//     if (!found) setActive('');
//   }, [location.pathname]);

//   const toggleSection = (section) => {
//     setExpandedSections(prev => ({
//       ...prev,
//       [section]: !prev[section]
//     }));
//   };

//   const handleLogout = async () => {
//     try {
//       const token = localStorage.getItem('employee_token') || localStorage.getItem('employeeToken');
//       localStorage.removeItem('employee_token');
//       localStorage.removeItem('employeeToken');
//       sessionStorage.clear();

//       if (token) {
//         await fetch('https://backend.hrms.transev.site/employee/logout', {
//           method: 'POST',
//           headers: {
//             Authorization: `Bearer ${token}`,
//             'Content-Type': 'application/json',
//           },
//           body: JSON.stringify({}),
//         }).catch(() => {});
//       }

//       navigate('/', { replace: true });
//     } catch (err) {
//       console.error('Logout error:', err);
//       navigate('/', { replace: true });
//     }
//   };

//   const handleNavigation = (path) => {
//     navigate(path);
//     if (onClose) onClose();
//     setIsSidebarOpen(false);
//   };

//   return (
//     <>
//       {/* Mobile Toggle */}
//       <button
//         className="fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-md rounded-lg md:hidden hover:shadow-lg transition-all duration-300 flex items-center justify-center"
//         onClick={() => setIsSidebarOpen(true)}
//       >
//         <FaBars size={16} className="text-gray-600" />
//       </button>

//       {/* Overlay */}
//       <div
//         className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 md:hidden transition-all duration-300 ${
//           isSidebarOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
//         }`}
//         onClick={() => {
//           setIsSidebarOpen(false);
//           if (onClose) onClose();
//         }}
//       />

//       {/* Elegant Sidebar */}
//       <div
//         className={`
//           fixed top-0 left-0 h-full w-64 bg-white
//           z-50 shadow-xl transition-transform duration-300 ease-out
//           overflow-y-auto overflow-x-hidden
//           ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
//           md:translate-x-0
//         `}
//       >
//         {/* Subtle Top Line */}
//         <div className="h-0.5 bg-gradient-to-r from-amber-300 via-amber-400 to-amber-300"></div>

//         {/* Logo Section */}
//         <div className="pt-8 pb-5 flex flex-col items-center border-b border-gray-100">
//           <img 
//             src={logo} 
//             alt="Logo" 
//             className="w-14 h-14 object-contain"
//           />
//           <div className="mt-3 text-center">
//             <h3 className="text-gray-800 font-medium text-sm">Transmogrify</h3>
//             <p className="text-gray-400 text-[10px] mt-0.5">Employee Portal</p>
//           </div>
//         </div>

//         {/* User Profile */}
//         <div className="mx-4 mt-5 p-3 bg-gray-50 rounded-xl">
//           <div className="flex items-center gap-3">
//             <div className="relative">
//               <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
//                 {loading ? (
//                   <FaSpinner className="text-white text-base animate-spin" />
//                 ) : (
//                   <FaUserCircle className="text-white text-xl" />
//                 )}
//               </div>
//               <div className="absolute -bottom-0.5 -right-0.5 w-2 h-2 bg-emerald-500 rounded-full border-2 border-white"></div>
//             </div>
//             <div className="flex-1">
//               {loading ? (
//                 <div className="space-y-1">
//                   <div className="h-3 w-24 bg-gray-200 rounded animate-pulse"></div>
//                   <div className="h-2 w-16 bg-gray-100 rounded animate-pulse"></div>
//                 </div>
//               ) : employeeData ? (
//                 <>
//                   <p className="text-gray-800 text-sm font-medium truncate">
//                     {employeeData.name}
//                   </p>
//                   <p className="text-gray-400 text-[10px] mt-0.5">
//                     {employeeData.employeeId}
//                   </p>
//                 </>
//               ) : (
//                 <>
//                   <p className="text-gray-800 text-sm font-medium">Guest User</p>
//                   <p className="text-gray-400 text-[10px] mt-0.5">Please login</p>
//                 </>
//               )}
//             </div>
//             <button className="relative w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition">
//               <FaBell className="text-gray-500 text-xs" />
//               {showNotification && (
//                 <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-rose-400 rounded-full"></span>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Navigation */}
//         <div className="px-3 py-5">
//           {Object.keys(menuStructure).map((sectionKey) => {
//             const section = menuStructure[sectionKey];
//             const isExpanded = expandedSections[sectionKey];
            
//             return (
//               <div key={sectionKey} className="mb-4">
//                 <button
//                   onClick={() => toggleSection(sectionKey)}
//                   className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-gray-50 transition"
//                 >
//                   <div className="flex items-center gap-2">
//                     <span className="text-gray-400 text-[10px]">{section.icon}</span>
//                     <span className="text-gray-500 text-[10px] font-medium tracking-wide">
//                       {section.title}
//                     </span>
//                   </div>
//                   <FaChevronDown className={`text-gray-400 text-[8px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
//                 </button>

//                 <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ${
//                   isExpanded ? 'max-h-64 opacity-100' : 'max-h-0 opacity-0'
//                 }`}>
//                   {section.items.map((item) => {
//                     const isActive = active === item.label;
//                     return (
//                       <button
//                         key={item.label}
//                         onClick={() => handleNavigation(item.path)}
//                         className={`
//                           w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-all duration-150
//                           ${isActive 
//                             ? 'bg-amber-50 text-amber-600' 
//                             : 'text-gray-600 hover:text-amber-500 hover:bg-gray-50'
//                           }
//                         `}
//                       >
//                         <div className={`w-6 h-6 rounded-md flex items-center justify-center transition-all duration-150 ${isActive ? 'text-amber-500' : 'text-gray-400'}`}>
//                           {item.icon}
//                         </div>
//                         <span className="text-xs flex-1 text-left">{item.label}</span>
//                         {isActive && <div className="w-1 h-1 rounded-full bg-amber-400"></div>}
//                       </button>
//                     );
//                   })}
//                 </div>
//               </div>
//             );
//           })}
//         </div>

//         {/* Divider */}
//         <div className="mx-4 my-2 h-px bg-gray-100"></div>

//         {/* Footer */}
//         <div className="px-3 pb-6">
//           <button
//             onClick={handleLogout}
//             className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-gray-500 hover:text-rose-500 hover:bg-rose-50 transition-all duration-150"
//           >
//             <div className="w-6 h-6 rounded-md flex items-center justify-center">
//               <FaSignOutAlt size={12} />
//             </div>
//             <span className="text-xs">Sign Out</span>
//           </button>

//           <div className="mt-4 pt-3 text-center border-t border-gray-100">
//             <div className="flex items-center justify-center gap-2">
//               <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
//               <p className="text-gray-400 text-[9px]">© 2024 Transmogrify</p>
//             </div>
//           </div>
//         </div>
//       </div>

//       <style jsx global>{`
//         div::-webkit-scrollbar {
//           width: 3px;
//         }
//         div::-webkit-scrollbar-track {
//           background: #f3f4f6;
//         }
//         div::-webkit-scrollbar-thumb {
//           background: #d1d5db;
//           border-radius: 10px;
//         }
//         div::-webkit-scrollbar-thumb:hover {
//           background: #9ca3af;
//         }
//       `}</style>
//     </>
//   );
// };

// export default EmployeeSidebar;
import React, { useState, useEffect, useCallback } from 'react';
import { 
  FaSignOutAlt, 
  FaBars, 
  FaTachometerAlt, 
  FaUserCircle, 
  FaClock, 
  FaFileAlt,
  FaCalendarAlt,
  FaGraduationCap,
  FaKey,
  FaExclamationTriangle,
  FaChevronDown,
  FaBell,
  FaHome,
  FaRegUser,
  FaSpinner,
  FaShieldAlt,
  FaCoffee
} from 'react-icons/fa';
import { useNavigate, useLocation } from 'react-router-dom';
import logo from "../../assets/TransmogriffyLogo.png";

const EmployeeSidebar = ({ isMobileMenuOpen, setIsMobileMenuOpen }) => {
  const [active, setActive] = useState('');
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
        { label: 'Punch Details', path: '/EmployeePunchDetails', icon: <FaCoffee size={12} /> },
        { label: 'Break Analysis', path: '/EmployeeBreakAnalysisNew', icon: <FaCoffee size={12} /> },
      ]
    },
    career: {
      title: "GROWTH",
      icon: <FaGraduationCap size={10} />,
      items: [
        { label: 'My Training', path: '/EmployeeTraining', icon: <FaGraduationCap size={12} /> },
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

  const toggleSection = useCallback((section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  }, []);

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

      window.location.href = '/';
    } catch (err) {
      console.error('Logout error:', err);
      window.location.href = '/';
    }
  };

  const handleNavigation = useCallback((path) => {
    if (setIsMobileMenuOpen) setIsMobileMenuOpen(false);
    window.location.href = path;
  }, [setIsMobileMenuOpen]);

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        className="fixed top-4 left-4 z-50 w-10 h-10 bg-white shadow-lg rounded-xl lg:hidden flex items-center justify-center border border-slate-200"
        onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(true)}
      >
        <FaBars size={18} className="text-slate-600" />
      </button>

      {/* Mobile Overlay */}
      <div
        className={`fixed inset-0 bg-black/50 backdrop-blur-sm z-40 lg:hidden transition-all duration-300 ${
          isMobileMenuOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        onClick={() => setIsMobileMenuOpen && setIsMobileMenuOpen(false)}
      />

      {/* Sidebar - Fixed full height on desktop */}
      <div
        className={`
          w-72 bg-white shadow-2xl overflow-y-auto overflow-x-hidden flex-shrink-0
          ${isMobileMenuOpen ? 'fixed top-0 left-0 bottom-0 z-50 translate-x-0' : 'fixed top-0 left-0 bottom-0 -translate-x-full'}
          lg:relative lg:translate-x-0 lg:block lg:z-0 lg:h-screen lg:sticky lg:top-0
          transition-transform duration-300 ease-out will-change-transform
        `}
        style={{ transform: 'translateZ(0)', height: '100vh' }}
      >
        {/* Top Gradient Line */}
        <div className="h-1 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-400"></div>

        {/* Logo Section */}
        <div className="pt-8 pb-5 flex flex-col items-center border-b border-slate-100">
          <img 
            src={logo} 
            alt="Logo" 
            className="w-14 h-14 object-contain"
          />
          <div className="mt-3 text-center">
            <h3 className="text-slate-800 font-semibold text-sm">Transmogrify</h3>
            <p className="text-slate-400 text-[10px] mt-0.5">Employee Portal</p>
          </div>
        </div>

        {/* User Profile */}
        <div className="mx-4 mt-5 p-3 bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl">
          <div className="flex items-center gap-3">
            <div className="relative">
              <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-500 rounded-xl flex items-center justify-center shadow-sm">
                {loading ? (
                  <FaSpinner className="text-white text-base animate-spin" />
                ) : (
                  <FaUserCircle className="text-white text-xl" />
                )}
              </div>
              <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-white"></div>
            </div>
            <div className="flex-1 min-w-0">
              {loading ? (
                <div className="space-y-1">
                  <div className="h-3 w-24 bg-slate-200 rounded animate-pulse"></div>
                  <div className="h-2 w-16 bg-slate-100 rounded animate-pulse"></div>
                </div>
              ) : employeeData ? (
                <>
                  <p className="text-slate-800 text-sm font-semibold truncate">
                    {employeeData.name}
                  </p>
                  <p className="text-slate-400 text-[10px] mt-0.5">
                    {employeeData.employeeId}
                  </p>
                </>
              ) : (
                <>
                  <p className="text-slate-800 text-sm font-semibold">Guest User</p>
                  <p className="text-slate-400 text-[10px] mt-0.5">Please login</p>
                </>
              )}
            </div>
            <button className="relative w-7 h-7 bg-white rounded-lg flex items-center justify-center hover:bg-slate-50 transition shadow-sm">
              <FaBell className="text-slate-500 text-xs" />
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
                  className="w-full flex items-center justify-between px-2 py-1.5 rounded-md hover:bg-slate-50 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <span className="text-slate-400 text-[10px]">{section.icon}</span>
                    <span className="text-slate-500 text-[10px] font-semibold tracking-wide">
                      {section.title}
                    </span>
                  </div>
                  <FaChevronDown className={`text-slate-400 text-[8px] transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
                </button>

                <div className={`mt-1 space-y-0.5 overflow-hidden transition-all duration-200 ${
                  isExpanded ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                  {section.items.map((item) => {
                    const isActive = active === item.label;
                    return (
                      <button
                        key={item.label}
                        onClick={() => handleNavigation(item.path)}
                        className={`
                          w-full flex items-center gap-2.5 px-3 py-2 rounded-lg transition-colors
                          ${isActive 
                            ? 'bg-amber-50 text-amber-600' 
                            : 'text-slate-600 hover:text-amber-500 hover:bg-slate-50'
                          }
                        `}
                      >
                        <div className={`w-6 h-6 rounded-md flex items-center justify-center ${isActive ? 'text-amber-500' : 'text-slate-400'}`}>
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
        <div className="mx-4 my-2 h-px bg-slate-100"></div>

        {/* Footer */}
        <div className="px-3 pb-6">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-slate-500 hover:text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center">
              <FaSignOutAlt size={12} />
            </div>
            <span className="text-xs">Sign Out</span>
          </button>

          <div className="mt-4 pt-3 text-center border-t border-slate-100">
            <div className="flex items-center justify-center gap-2">
              <div className="w-1 h-1 bg-emerald-400 rounded-full"></div>
              <p className="text-slate-400 text-[9px]">© 2024 Transmogrify</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 4px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb:hover { background: #94a3b8; }
        
        .will-change-transform {
          will-change: transform;
        }
        
        button, a {
          -webkit-tap-highlight-color: transparent;
        }
      `}</style>
    </>
  );
};

export default EmployeeSidebar;