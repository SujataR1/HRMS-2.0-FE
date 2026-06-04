import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  MdCoffee,
  MdTimer,
  MdRestaurant,
  MdFreeBreakfast,
  MdRefresh,
  MdClose,
  MdFilterList,
  MdTrendingUp,
  MdTimelapse,
  MdWarning,
  MdVerified,
  MdDownload,
  MdPrint,
  MdBarChart,
  MdShowChart,
  MdInfo,
  MdAccessTime,
  MdErrorOutline,
  MdOutlineEventNote,
  MdPlayArrow,
  MdStop,
  MdPerson,
  MdBusinessCenter,
  MdAnalytics,
  MdTableChart,
  MdChevronRight,
  MdArrowDropDown,
} from 'react-icons/md';
import EmployeeSidebar from '../../components/Common/EmployeeSidebar';

const EmployeeBreakAnalysisNew = () => {
  const [attendanceData, setAttendanceData] = useState([]);
  const [employeeProfile, setEmployeeProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBreakDetail, setSelectedBreakDetail] = useState(null);
  const [activeTab, setActiveTab] = useState('breakdown');
  const [selectedYear, setSelectedYear] = useState(2026);
  const [selectedMonth, setSelectedMonth] = useState(5);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  const formatMinutes = useCallback((minutes) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }, []);

  const showNotificationMessage = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const fetchEmployeeProfile = async (token) => {
    try {
      const response = await fetch('https://backend.hrms.transev.site/employee/profile', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      const result = await response.json();
      if (result.status === 'success') {
        setEmployeeProfile(result.data);
        return result.data;
      }
      return null;
    } catch (error) {
      console.error('Error fetching profile:', error);
      return null;
    }
  };

  const fetchAttendanceData = async (token, monthYear) => {
    try {
      const response = await fetch('https://backend.hrms.transev.site/employee/attendance/view', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ monthYear: monthYear }),
      });
      const result = await response.json();
      if (result.status === 'success') {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error('Error fetching attendance:', error);
      return [];
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    
    const token = localStorage.getItem('employee_token') || localStorage.getItem('employeeToken');
    if (!token) {
      setError('No authentication token found. Please login again.');
      setLoading(false);
      return;
    }

    try {
      const profile = await fetchEmployeeProfile(token);
      if (!profile) {
        throw new Error('Failed to fetch employee profile');
      }

      const monthNumber = selectedMonth + 1;
      const formattedMonth = monthNumber.toString().padStart(2, '0');
      const monthYear = `${formattedMonth}-${selectedYear}`;
      
      const attendance = await fetchAttendanceData(token, monthYear);
      setAttendanceData(attendance);
      
      showNotificationMessage('Data loaded successfully!');
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(`Failed to load data: ${error.message}`);
      showNotificationMessage('Failed to load data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedYear, selectedMonth]);

  const processBreakData = useCallback(() => {
    if (!employeeProfile || !attendanceData.length) {
      return null;
    }
    
    const breakDetails = [];
    let totalBreakMinutes = 0;
    let totalBreakSessions = 0;
    let daysWithBreaks = 0;
    const hourMap = {};
    const dayMap = {};

    attendanceData.forEach(record => {
      if (record.presence && record.presence.breaks && record.presence.breaks.length > 0) {
        const dayBreaks = record.presence.breaks;
        const dayTotalBreak = dayBreaks.reduce((sum, b) => sum + (b.minutes || 0), 0);
        
        if (dayTotalBreak > 0) {
          totalBreakMinutes += dayTotalBreak;
          totalBreakSessions += dayBreaks.length;
          daysWithBreaks++;
          
          dayBreaks.forEach(breakItem => {
            if (breakItem.from) {
              const hour = breakItem.from.split(':')[0];
              if (hour) {
                hourMap[hour] = (hourMap[hour] || 0) + 1;
              }
            }
          });
          
          if (record.day) {
            dayMap[record.day] = (dayMap[record.day] || 0) + dayTotalBreak;
          }
          
          breakDetails.push({
            date: record.date,
            day: record.day || new Date(record.date).toLocaleDateString('en-US', { weekday: 'long' }),
            breaks: dayBreaks.map((b, idx) => ({
              breakNumber: idx + 1,
              from: b.from,
              to: b.to,
              minutes: b.minutes,
              formattedDuration: formatMinutes(b.minutes)
            })),
            totalBreakMinutes: dayTotalBreak,
            totalBreakFormatted: formatMinutes(dayTotalBreak),
            confidence: record.presence.confidence || 'high',
            anomalies: record.presence.anomalies || [],
            punchIn: record.punchIn || 'N/A',
            punchOut: record.punchOut || 'N/A',
          });
        }
      }
    });

    const avgBreakPerDay = daysWithBreaks > 0 ? totalBreakMinutes / daysWithBreaks : 0;
    const avgBreakPerSession = totalBreakSessions > 0 ? totalBreakMinutes / totalBreakSessions : 0;
    
    const peakBreakHours = Object.entries(hourMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([hour, count]) => ({ hour: `${hour}:00`, count }));
    
    const dayWiseData = Object.entries(dayMap).map(([day, minutes]) => ({ day, minutes, formatted: formatMinutes(minutes) }));
    
    breakDetails.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    const expectedWorkMinutes = 8 * 60;
    const productivityScore = daysWithBreaks > 0 
      ? Math.max(0, Math.min(100, Math.round(100 - (totalBreakMinutes / (expectedWorkMinutes * daysWithBreaks)) * 100)))
      : 100;

    return {
      employeeId: employeeProfile.employeeId,
      employeeName: employeeProfile.name,
      designation: employeeProfile.designation,
      department: employeeProfile.department,
      totalBreakMinutes,
      breakSessions: totalBreakSessions,
      avgBreakPerDay,
      avgBreakPerSession,
      productivityScore,
      breakDetails,
      peakBreakHours,
      dayWiseData,
    };
  }, [employeeProfile, attendanceData, formatMinutes]);

  const breakData = useMemo(() => processBreakData(), [processBreakData]);

  const openModal = (detail) => { 
    setSelectedBreakDetail(detail); 
    setIsModalOpen(true); 
    document.body.style.overflow = 'hidden'; 
  };
  
  const closeModal = () => { 
    setIsModalOpen(false); 
    setSelectedBreakDetail(null); 
    document.body.style.overflow = 'auto'; 
  };

  const exportToCSV = () => {
    if (!breakData?.breakDetails.length) { 
      showNotificationMessage('No data to export'); 
      return; 
    }
    const exportData = breakData.breakDetails.flatMap(detail => 
      detail.breaks.map(b => ({
        Date: detail.date,
        Day: detail.day,
        'Break Start': b.from,
        'Break End': b.to,
        'Duration (minutes)': b.minutes,
        'Duration': b.formattedDuration,
        'Punch In': detail.punchIn,
        'Punch Out': detail.punchOut,
      }))
    );
    const headers = Object.keys(exportData[0]);
    const csvRows = [headers.join(','), ...exportData.map(row => headers.map(h => `"${row[h] || ''}"`).join(','))];
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `break_analysis_${employeeProfile?.employeeId}_${selectedYear}_${selectedMonth + 1}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotificationMessage('CSV file downloaded successfully!');
  };

  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
        <EmployeeSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-500 mx-auto"></div>
              <MdCoffee className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-amber-400 text-xl" />
            </div>
            <p className="mt-4 text-slate-600 font-medium">Loading your break data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-50">
      <div className="flex">
        {/* Sidebar */}
        <EmployeeSidebar isMobileMenuOpen={isMobileMenuOpen} setIsMobileMenuOpen={setIsMobileMenuOpen} />
        
        {/* Main Content - Centered properly */}
        <div className="flex-1 w-full min-w-0">
          {/* Notification */}
          {showNotification && (
            <div className="fixed top-20 right-4 z-50 animate-slide-in md:top-6">
              <div className="bg-emerald-500 text-white px-4 py-2.5 rounded-xl shadow-xl flex items-center gap-2 text-sm">
                <MdInfo size={16} />
                <span>{notificationMessage}</span>
              </div>
            </div>
          )}

          {/* Content Container - Centered with max-width */}
          <div className="px-4 py-4 md:px-6 md:py-6 lg:px-8 lg:py-8">
            <div className="max-w-6xl mx-auto">
              {/* Header */}
              <div className="mb-6">
                <div className="flex flex-col gap-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-amber-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
                      <MdCoffee className="text-white text-xl" />
                    </div>
                    <div>
                      <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-slate-800">Break Analysis</h1>
                      <p className="text-xs md:text-sm text-slate-500 mt-0.5">Monitor and optimize your break patterns</p>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    <button onClick={exportToCSV} className="flex items-center gap-1.5 px-3 py-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 transition text-sm">
                      <MdDownload size={14} /> <span className="hidden sm:inline">Export</span> CSV
                    </button>
                    <button onClick={fetchData} className="flex items-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-xl hover:from-amber-600 hover:to-amber-700 transition text-sm shadow-md">
                      <MdRefresh size={14} /> <span className="hidden sm:inline">Refresh</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Mobile Filter Toggle */}
              <button 
                onClick={() => setIsMobileFilterOpen(!isMobileFilterOpen)}
                className="w-full mb-4 flex items-center justify-between p-3 bg-white rounded-xl border border-slate-200 md:hidden"
              >
                <span className="flex items-center gap-2 text-sm font-medium text-slate-600">
                  <MdFilterList /> Filter Options
                </span>
                <MdArrowDropDown className={`text-slate-400 transition-transform ${isMobileFilterOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Month Selector */}
              <div className={`bg-white rounded-2xl shadow-sm border border-slate-100 p-4 mb-6 transition-all ${isMobileFilterOpen ? 'block' : 'hidden md:block'}`}>
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                  <label className="text-sm font-medium text-slate-700">Select Month:</label>
                  <div className="flex flex-wrap gap-3 w-full sm:w-auto">
                    <select 
                      value={selectedMonth} 
                      onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      {monthNames.map((month, idx) => (
                        <option key={idx} value={idx}>{month}</option>
                      ))}
                    </select>
                    <select 
                      value={selectedYear} 
                      onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                      className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 bg-white"
                    >
                      {[2024, 2025, 2026, 2027].map(year => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                  <div className="px-3 py-1.5 bg-amber-100 rounded-full">
                    <span className="text-xs text-amber-700 font-medium">Showing: {monthNames[selectedMonth]} {selectedYear}</span>
                  </div>
                </div>
              </div>

              {/* Profile Banner */}
              {employeeProfile && (
                <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 md:p-5 mb-6 border border-amber-100">
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl md:rounded-2xl flex items-center justify-center shadow-md">
                      <span className="text-white text-xl md:text-2xl font-bold">{employeeProfile.name?.charAt(0)}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <h2 className="text-base md:text-xl font-bold text-slate-800 truncate">{employeeProfile.name}</h2>
                      <div className="flex flex-wrap gap-2 text-xs md:text-sm text-slate-500 mt-1">
                        <span className="flex items-center gap-1"><MdPerson size={12} /> {employeeProfile.employeeId}</span>
                        <span className="hidden sm:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="flex items-center gap-1"><MdBusinessCenter size={12} /> {employeeProfile.designation}</span>
                        <span className="hidden md:inline w-1 h-1 bg-slate-300 rounded-full"></span>
                        <span className="truncate">{employeeProfile.department}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Stats Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6">
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase">Total Break</p>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 rounded-lg md:rounded-xl flex items-center justify-center"><MdTimer className="text-blue-500 text-sm md:text-xl" /></div>
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-slate-700">{formatMinutes(breakData?.totalBreakMinutes)}</p>
                </div>
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase">Sessions</p>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 rounded-lg md:rounded-xl flex items-center justify-center"><MdRestaurant className="text-purple-500 text-sm md:text-xl" /></div>
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-slate-700">{breakData?.breakSessions || 0}</p>
                </div>
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase">Avg/Day</p>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-emerald-100 rounded-lg md:rounded-xl flex items-center justify-center"><MdShowChart className="text-emerald-500 text-sm md:text-xl" /></div>
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-emerald-600">{formatMinutes(breakData?.avgBreakPerDay)}</p>
                </div>
                <div className="bg-white rounded-xl md:rounded-2xl p-3 md:p-4 shadow-sm border border-slate-100">
                  <div className="flex items-center justify-between mb-1 md:mb-2">
                    <p className="text-[10px] md:text-xs font-medium text-slate-400 uppercase">Productivity</p>
                    <div className="w-6 h-6 md:w-8 md:h-8 bg-indigo-100 rounded-lg md:rounded-xl flex items-center justify-center"><MdTrendingUp className="text-indigo-500 text-sm md:text-xl" /></div>
                  </div>
                  <p className="text-lg md:text-2xl font-bold text-indigo-600">{breakData?.productivityScore || 100}%</p>
                </div>
              </div>

              {/* Tabs */}
              <div className="flex gap-1 md:gap-2 mb-6 border-b border-slate-200 overflow-x-auto">
                <button onClick={() => setActiveTab('breakdown')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-t-xl transition whitespace-nowrap ${activeTab === 'breakdown' ? 'bg-white text-amber-600 border-b-2 border-amber-500' : 'text-slate-500'}`}>
                  <MdTableChart size={14} /> Break Breakdown
                </button>
                <button onClick={() => setActiveTab('analytics')} className={`flex items-center gap-1 md:gap-2 px-3 md:px-5 py-2 md:py-2.5 text-xs md:text-sm font-medium rounded-t-xl transition whitespace-nowrap ${activeTab === 'analytics' ? 'bg-white text-amber-600 border-b-2 border-amber-500' : 'text-slate-500'}`}>
                  <MdAnalytics size={14} /> Analytics
                </button>
              </div>

              {/* Analytics Panel */}
              {activeTab === 'analytics' && breakData && (
                <div className="space-y-6 mb-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
                      <h3 className="font-semibold text-slate-700 mb-4 text-sm md:text-base">Peak Break Hours</h3>
                      <div className="space-y-3">
                        {breakData.peakBreakHours.length ? breakData.peakBreakHours.map((peak, idx) => {
                          const maxCount = Math.max(...breakData.peakBreakHours.map(p => p.count), 1);
                          return (
                            <div key={idx}>
                              <div className="flex justify-between text-xs md:text-sm mb-1"><span className="text-slate-600">{peak.hour}</span><span className="text-slate-400">{peak.count} breaks</span></div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full" style={{ width: `${(peak.count / maxCount) * 100}%` }} /></div>
                            </div>
                          );
                        }) : <p className="text-slate-400 text-center py-4 text-sm">No break hour data available</p>}
                      </div>
                    </div>
                    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-4 md:p-6">
                      <h3 className="font-semibold text-slate-700 mb-4 text-sm md:text-base">Break Time by Day</h3>
                      <div className="space-y-3">
                        {breakData.dayWiseData.length ? (() => {
                          const daysOrder = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
                          const sorted = [...breakData.dayWiseData].sort((a, b) => daysOrder.indexOf(a.day) - daysOrder.indexOf(b.day));
                          const maxMinutes = Math.max(...sorted.map(d => d.minutes), 1);
                          return sorted.map((day, idx) => (
                            <div key={idx}>
                              <div className="flex justify-between text-xs md:text-sm mb-1"><span className="text-slate-600">{day.day}</span><span className="text-slate-400">{day.formatted}</span></div>
                              <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden"><div className="bg-gradient-to-r from-indigo-400 to-indigo-500 h-full rounded-full" style={{ width: `${(day.minutes / maxMinutes) * 100}%` }} /></div>
                            </div>
                          ));
                        })() : <p className="text-slate-400 text-center py-4 text-sm">No day-wise data available</p>}
                      </div>
                    </div>
                  </div>
                  <div className="bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl p-4 md:p-6 border border-amber-100">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
                      <div className="text-center"><p className="text-[10px] md:text-xs text-slate-500">Total Break</p><p className="text-sm md:text-xl font-bold text-amber-600">{formatMinutes(breakData.totalBreakMinutes)}</p></div>
                      <div className="text-center"><p className="text-[10px] md:text-xs text-slate-500">Avg/Session</p><p className="text-sm md:text-xl font-bold text-emerald-600">{formatMinutes(breakData.avgBreakPerSession)}</p></div>
                      <div className="text-center"><p className="text-[10px] md:text-xs text-slate-500">Frequency</p><p className="text-sm md:text-xl font-bold text-purple-600">{breakData.breakSessions}</p></div>
                      <div className="text-center"><p className="text-[10px] md:text-xs text-slate-500">Health Score</p><p className="text-sm md:text-xl font-bold text-indigo-600">{breakData.productivityScore}%</p></div>
                    </div>
                  </div>
                </div>
              )}

              {/* Break Table */}
              {activeTab === 'breakdown' && (
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full min-w-[500px]">
                      <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">
                        <tr>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600">Date</th>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600">Day</th>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600">Sessions</th>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600">Total</th>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600 hidden sm:table-cell">Status</th>
                          <th className="px-3 md:px-5 py-3 text-left text-xs font-semibold text-slate-600"></th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {breakData?.breakDetails?.length ? breakData.breakDetails.map((detail, idx) => (
                          <tr key={idx} className="hover:bg-amber-50/30 transition">
                            <td className="px-3 md:px-5 py-3 font-medium text-slate-700 text-xs md:text-sm">{detail.date}</td>
                            <td className="px-3 md:px-5 py-3 text-slate-500 text-xs md:text-sm">{detail.day}</td>
                            <td className="px-3 md:px-5 py-3"><span className="px-2 py-1 bg-purple-100 text-purple-700 rounded-full text-[10px] md:text-xs font-medium">{detail.breaks.length}</span></td>
                            <td className="px-3 md:px-5 py-3"><span className="font-semibold text-amber-600 text-xs md:text-sm">{detail.totalBreakFormatted}</span></td>
                            <td className="px-3 md:px-5 py-3 hidden sm:table-cell">{detail.confidence === 'high' ? <span className="flex items-center gap-1 text-emerald-600 text-xs"><MdVerified size={12} /> Clean</span> : <span className="flex items-center gap-1 text-amber-600 text-xs"><MdWarning size={12} /> Anomalies</span>}</td>
                            <td className="px-3 md:px-5 py-3">
                              <button onClick={() => openModal(detail)} className="flex items-center gap-1 px-2 md:px-3 py-1 bg-amber-50 text-amber-600 rounded-lg hover:bg-amber-500 hover:text-white transition text-xs font-medium">
                                <MdOutlineEventNote size={12} /> <span className="hidden sm:inline">View</span>
                              </button>
                            </td>
                          </tr>
                        )) : (
                          <tr>
                            <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                              <MdCoffee className="mx-auto text-3xl mb-2 text-slate-300" />
                              No break records found
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal - Keep as is */}
      {isModalOpen && selectedBreakDetail && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" onClick={closeModal}>
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={closeModal}></div>
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[90%] md:max-w-md max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="sticky top-0 flex items-center justify-between px-4 md:px-6 py-3 md:py-4 border-b bg-gradient-to-r from-amber-50 to-orange-50 rounded-t-2xl">
              <div className="flex items-center gap-2 md:gap-3">
                <div className="w-8 h-8 md:w-10 md:h-10 bg-amber-100 rounded-lg md:rounded-xl flex items-center justify-center"><MdCoffee className="text-amber-500 text-base md:text-lg" /></div>
                <div><h3 className="font-bold text-slate-800 text-sm md:text-base">Break Details</h3><p className="text-[10px] md:text-xs text-slate-500">{selectedBreakDetail.date}</p></div>
              </div>
              <button onClick={closeModal} className="w-7 h-7 md:w-8 md:h-8 flex items-center justify-center rounded-lg hover:bg-white/50"><MdClose size={16} className="text-slate-400" /></button>
            </div>
            <div className="p-4 md:p-6">
              <div className="grid grid-cols-3 gap-2 md:gap-3 mb-4 md:mb-5">
                <div className="bg-slate-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center"><p className="text-[8px] md:text-[10px] text-slate-400">Sessions</p><p className="text-base md:text-xl font-bold text-slate-700">{selectedBreakDetail.breaks.length}</p></div>
                <div className="bg-slate-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center"><p className="text-[8px] md:text-[10px] text-slate-400">Total</p><p className="text-base md:text-xl font-bold text-amber-600">{selectedBreakDetail.totalBreakFormatted}</p></div>
                <div className="bg-slate-50 rounded-lg md:rounded-xl p-2 md:p-3 text-center"><p className="text-[8px] md:text-[10px] text-slate-400">Status</p>{selectedBreakDetail.confidence === 'high' ? <MdVerified className="text-emerald-500 text-lg md:text-xl mx-auto" /> : <MdWarning className="text-amber-500 text-lg md:text-xl mx-auto" />}</div>
              </div>
              <div className="flex items-center justify-between bg-slate-50 rounded-lg md:rounded-xl px-3 md:px-4 py-2 md:py-3 mb-4">
                <div className="text-center"><p className="text-[8px] md:text-[10px] text-slate-400">Punch In</p><p className="text-xs md:text-sm font-semibold text-emerald-600">{selectedBreakDetail.punchIn}</p></div>
                <div className="text-slate-300 text-xs md:text-sm">→</div>
                <div className="text-center"><p className="text-[8px] md:text-[10px] text-slate-400">Punch Out</p><p className="text-xs md:text-sm font-semibold text-rose-600">{selectedBreakDetail.punchOut}</p></div>
              </div>
              {selectedBreakDetail.anomalies?.length > 0 && (
                <div className="bg-amber-50 rounded-lg md:rounded-xl p-2 md:p-3 mb-4 flex gap-2">
                  <MdErrorOutline className="text-amber-500 text-xs md:text-sm" />
                  <p className="text-[10px] md:text-[11px] text-amber-700">{selectedBreakDetail.anomalies[0].message}</p>
                </div>
              )}
              <div className="space-y-2 max-h-64 md:max-h-80 overflow-y-auto">
                {selectedBreakDetail.breaks.map((b, i) => (
                  <div key={i} className="flex items-center justify-between p-2 md:p-3 bg-slate-50 rounded-lg">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 md:w-6 md:h-6 bg-amber-100 rounded-full flex items-center justify-center"><span className="text-[8px] md:text-[10px] font-bold text-amber-600">{i+1}</span></div>
                      <div className="flex items-center gap-0.5 md:gap-1"><MdPlayArrow className="text-emerald-500 text-[8px] md:text-[10px]" /><span className="text-[10px] md:text-xs font-mono">{b.from}</span><span className="text-slate-300 text-[8px] md:text-[10px]">→</span><MdStop className="text-rose-500 text-[8px] md:text-[10px]" /><span className="text-[10px] md:text-xs font-mono">{b.to}</span></div>
                    </div>
                    <span className="text-[10px] md:text-xs font-bold text-amber-600">{b.formattedDuration}</span>
                  </div>
                ))}
              </div>
              <div className="mt-4 md:mt-5 pt-3 md:pt-4 border-t flex justify-between items-center">
                <span className="text-xs md:text-sm text-slate-500">Total Break Time</span>
                <span className="text-base md:text-lg font-bold text-amber-600">{selectedBreakDetail.totalBreakFormatted}</span>
              </div>
            </div>
            <div className="flex gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 border-t bg-slate-50 rounded-b-2xl sticky bottom-0">
              <button onClick={closeModal} className="flex-1 px-3 md:px-4 py-1.5 md:py-2 bg-white border text-slate-600 rounded-lg md:rounded-xl hover:bg-slate-50 text-xs md:text-sm font-medium">Close</button>
              <button onClick={() => { const w = window.open('', '_blank'); w.document.write(`<html><head><title>Break Details</title><style>body{font-family:Arial;margin:20px 40px}</style></head><body><h2>Break Details - ${selectedBreakDetail.date}</h2><p><strong>Total:</strong> ${selectedBreakDetail.totalBreakFormatted}</p><p><strong>Sessions:</strong> ${selectedBreakDetail.breaks.length}</p><hr/>${selectedBreakDetail.breaks.map((b,i)=>`<div style="border-bottom:1px solid #ddd;padding:10px 0"><strong>Break ${i+1}</strong><br/>Start: ${b.from}<br/>End: ${b.to}<br/>Duration: ${b.formattedDuration}</div>`).join('')}</body></html>`); w.document.close(); w.print(); }} className="flex-1 px-3 md:px-4 py-1.5 md:py-2 bg-gradient-to-r from-amber-500 to-amber-600 text-white rounded-lg md:rounded-xl hover:from-amber-600 hover:to-amber-700 text-xs md:text-sm font-medium flex items-center justify-center gap-1 md:gap-2"><MdPrint size={12} /> Print</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployeeBreakAnalysisNew;