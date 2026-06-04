import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import {
  MdPeople,
  MdTimer,
  MdRestaurant,
  MdFreeBreakfast,
  MdSearch,
  MdRefresh,
  MdClose,
  MdExitToApp,
  MdLogin,
  MdPictureAsPdf,
  MdToday,
  MdDateRange,
  MdCalendarToday,
  MdFilterList,
  MdTrendingUp,
  MdCoffeeMaker,
  MdTimelapse,
  MdWarning,
  MdVerified,
  MdDownload,
  MdShare,
  MdPrint,
  MdBarChart,
  MdPieChart,
  MdShowChart,
  MdArrowUpward,
  MdArrowDownward,
  MdNotifications,
  MdEmail,
  MdFileDownload,
  MdCompareArrows,
  MdStar,
  MdInfo,
  MdSettings,
  MdViewWeek,
  MdViewList,
  MdGridView,
  MdMenu
} from 'react-icons/md';
import jsPDF from 'jspdf';
import * as XLSX from 'xlsx';
import HRSidebar from '../../components/Common/HRSidebar';

const EmployeeBreakAnalysis = () => {
  const [employees, setEmployees] = useState([]);
  const [attendanceData, setAttendanceData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [viewMode, setViewMode] = useState('table');
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [showCharts, setShowCharts] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState('all');
  const [departments, setDepartments] = useState([]);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState('');
  
  // Fix: Initialize all state variables before using them
  const [dateRangePreset, setDateRangePreset] = useState('today');
  const [filterType, setFilterType] = useState('today');
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [customDateRange, setCustomDateRange] = useState({
    startDate: new Date().toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });
  
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [analytics, setAnalytics] = useState({
    peakBreakHours: [],
    averageBreakPerDay: 0,
    mostCommonBreakDuration: 0,
    trendData: []
  });

  // Date presets
  const datePresets = {
    today: { label: 'Today', getRange: () => ({ start: new Date(), end: new Date() }) },
    yesterday: { label: 'Yesterday', getRange: () => ({ start: new Date(Date.now() - 86400000), end: new Date(Date.now() - 86400000) }) },
    thisWeek: { label: 'This Week', getRange: () => {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay());
      return { start, end: new Date() };
    }},
    lastWeek: { label: 'Last Week', getRange: () => {
      const start = new Date();
      start.setDate(start.getDate() - start.getDay() - 7);
      const end = new Date(start);
      end.setDate(end.getDate() + 6);
      return { start, end };
    }},
    thisMonth: { label: 'This Month', getRange: () => ({
      start: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
      end: new Date()
    })},
    lastMonth: { label: 'Last Month', getRange: () => ({
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
      end: new Date(new Date().getFullYear(), new Date().getMonth(), 0)
    })},
    last3Months: { label: 'Last 3 Months', getRange: () => ({
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 3, 1),
      end: new Date()
    })},
    last6Months: { label: 'Last 6 Months', getRange: () => ({
      start: new Date(new Date().getFullYear(), new Date().getMonth() - 6, 1),
      end: new Date()
    })},
    thisYear: { label: 'This Year', getRange: () => ({
      start: new Date(new Date().getFullYear(), 0, 1),
      end: new Date()
    })},
    lastYear: { label: 'Last Year', getRange: () => ({
      start: new Date(new Date().getFullYear() - 1, 0, 1),
      end: new Date(new Date().getFullYear() - 1, 11, 31)
    })}
  };

  const getDateRange = useCallback(() => {
    const today = new Date();
    let startDate, endDate;
    
    if (dateRangePreset !== 'custom') {
      const preset = datePresets[dateRangePreset];
      if (preset) {
        const { start, end } = preset.getRange();
        startDate = start.toISOString().split('T')[0];
        endDate = end.toISOString().split('T')[0];
        return { startDate, endDate };
      }
    }
    
    switch(filterType) {
      case 'today':
        startDate = today.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
        break;
      case 'month':
        startDate = new Date(selectedYear, selectedMonth, 1).toISOString().split('T')[0];
        endDate = new Date(selectedYear, selectedMonth + 1, 0).toISOString().split('T')[0];
        break;
      case 'year':
        startDate = new Date(selectedYear, 0, 1).toISOString().split('T')[0];
        endDate = new Date(selectedYear, 11, 31).toISOString().split('T')[0];
        break;
      case 'custom':
        startDate = customDateRange.startDate;
        endDate = customDateRange.endDate;
        break;
      default:
        startDate = today.toISOString().split('T')[0];
        endDate = today.toISOString().split('T')[0];
    }
    
    return { startDate, endDate };
  }, [dateRangePreset, filterType, selectedMonth, selectedYear, customDateRange]);

  const getDateRangeDisplay = useCallback(() => {
    const { startDate, endDate } = getDateRange();
    
    if (dateRangePreset !== 'custom' && datePresets[dateRangePreset]) {
      return datePresets[dateRangePreset].label;
    }
    
    switch(filterType) {
      case 'today':
        return `Today (${new Date(startDate).toLocaleDateString()})`;
      case 'month':
        return `${new Date(selectedYear, selectedMonth).toLocaleString('default', { month: 'long' })} ${selectedYear}`;
      case 'year':
        return `Year ${selectedYear}`;
      case 'custom':
        return `${new Date(startDate).toLocaleDateString()} - ${new Date(endDate).toLocaleDateString()}`;
      default:
        return '';
    }
  }, [dateRangePreset, filterType, selectedMonth, selectedYear, getDateRange]);

  const showNotificationMessage = (message, type = 'success') => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  const fetchEmployees = useCallback(async () => {
    try {
      const token = localStorage.getItem('hr_token');
      
      if (!token) {
        setError('No authentication token found. Please login again.');
        return [];
      }
      
      const response = await fetch('https://backend.hrms.transev.site/admin/employee-profiles', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.status === 'success' && result.data) {
        const activeEmployees = result.data.filter(emp => 
          emp.employeeDetails && emp.employeeDetails.employmentStatus === 'EMPLOYED'
        );
        const uniqueDepts = [...new Set(activeEmployees.map(emp => emp.employeeDetails?.department).filter(Boolean))];
        setDepartments(uniqueDepts);
        return activeEmployees;
      }
      return [];
    } catch (error) {
      console.error('Error fetching employees:', error);
      setError(`Failed to fetch employees: ${error.message}`);
      return [];
    }
  }, []);

  const fetchEmployeeAttendance = useCallback(async (employeeId, startDate, endDate) => {
    try {
      const token = localStorage.getItem('hr_token');
      const response = await fetch('https://backend.hrms.transev.site/hr/attendance/view', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employeeId: employeeId,
          startDate: startDate,
          endDate: endDate
        })
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const result = await response.json();
      if (result.success && result.data) {
        return result.data;
      }
      return [];
    } catch (error) {
      console.error(`Error fetching attendance for ${employeeId}:`, error);
      return [];
    }
  }, []);

  const formatMinutes = useCallback((minutes) => {
    if (!minutes || minutes === 0) return '0m';
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  }, []);

  const getDailyBreakDetails = useCallback((attendanceRecords) => {
    const dailyBreaks = [];
    let totalBreakMinutes = 0;
    let totalBreakSessions = 0;

    if (!attendanceRecords || attendanceRecords.length === 0) {
      return {
        dailyBreaks: [],
        totalBreakMinutes: 0,
        totalBreakSessions: 0,
        averageBreakDuration: 0,
        daysWithBreaks: 0
      };
    }

    attendanceRecords.forEach(record => {
      const hasPresence = record.presence && typeof record.presence === 'object';
      const hasBreaks = hasPresence && record.presence.breaks && Array.isArray(record.presence.breaks) && record.presence.breaks.length > 0;
      
      if (hasBreaks) {
        const breaks = record.presence.breaks;
        const dayBreaks = [];
        let dayTotalBreakMinutes = 0;
        
        breaks.forEach((breakItem, index) => {
          if (breakItem && breakItem.minutes && breakItem.minutes > 0) {
            dayTotalBreakMinutes += breakItem.minutes;
            totalBreakMinutes += breakItem.minutes;
            totalBreakSessions++;
            
            dayBreaks.push({
              breakNumber: index + 1,
              startTime: breakItem.from || 'N/A',
              endTime: breakItem.to || 'N/A',
              duration: breakItem.minutes,
              durationFormatted: formatMinutes(breakItem.minutes)
            });
          }
        });
        
        if (dayBreaks.length > 0) {
          dailyBreaks.push({
            date: record.date,
            day: record.day || new Date(record.date).toLocaleDateString('en-US', { weekday: 'short' }),
            punchIn: record.punchIn || 'N/A',
            punchOut: record.punchOut || 'N/A',
            status: record.status || 'N/A',
            breaks: dayBreaks,
            totalBreakMinutes: dayTotalBreakMinutes,
            totalBreakSessions: dayBreaks.length,
            totalBreakFormatted: formatMinutes(dayTotalBreakMinutes),
            confidence: record.presence?.confidence || 'N/A',
            hasAnomalies: record.presence?.anomalies && record.presence.anomalies.length > 0,
            anomalies: record.presence?.anomalies || []
          });
        }
      }
    });

    dailyBreaks.sort((a, b) => new Date(a.date) - new Date(b.date));

    return {
      dailyBreaks,
      totalBreakMinutes,
      totalBreakSessions,
      averageBreakDuration: totalBreakSessions > 0 ? Math.round(totalBreakMinutes / totalBreakSessions) : 0,
      daysWithBreaks: dailyBreaks.length
    };
  }, [formatMinutes]);

  const loadAllAttendance = useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const activeEmployees = await fetchEmployees();
      const { startDate, endDate } = getDateRange();
      
      if (activeEmployees.length === 0) {
        setEmployees([]);
        setAttendanceData({});
        setLoading(false);
        return;
      }
      
      setEmployees(activeEmployees);
      
      const batchSize = 5;
      const attendanceMap = {};
      
      for (let i = 0; i < activeEmployees.length; i += batchSize) {
        const batch = activeEmployees.slice(i, i + batchSize);
        await Promise.all(batch.map(async (employee) => {
          const attendance = await fetchEmployeeAttendance(
            employee.employeeId,
            startDate,
            endDate
          );
          const breakAnalysis = getDailyBreakDetails(attendance);
          attendanceMap[employee.employeeId] = breakAnalysis;
        }));
        
        setAttendanceData(prev => ({ ...prev, ...attendanceMap }));
      }
      
      // Calculate analytics
      const hourMap = {};
      Object.values(attendanceMap).forEach(data => {
        data.dailyBreaks?.forEach(day => {
          day.breaks?.forEach(breakItem => {
            const hour = breakItem.startTime?.split(':')[0];
            if (hour) {
              hourMap[hour] = (hourMap[hour] || 0) + 1;
            }
          });
        });
      });
      
      const peakBreakHours = Object.entries(hourMap)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([hour, count]) => ({ hour, count }));
      
      setAnalytics({
        peakBreakHours,
        averageBreakPerDay: Object.values(attendanceMap).reduce((sum, data) => sum + (data.totalBreakMinutes || 0), 0) / (activeEmployees.length || 1),
        mostCommonBreakDuration: 15,
        trendData: []
      });
      
      showNotificationMessage('Data loaded successfully!', 'success');
    } catch (error) {
      console.error('Error loading attendance:', error);
      setError(`Failed to load attendance data: ${error.message}`);
      showNotificationMessage('Failed to load data', 'error');
    } finally {
      setLoading(false);
    }
  }, [fetchEmployees, getDateRange, fetchEmployeeAttendance, getDailyBreakDetails]);

  useEffect(() => {
    loadAllAttendance();
  }, [loadAllAttendance]);

  const handleSort = (field) => {
    if (sortBy === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(field);
      setSortOrder('asc');
    }
  };

  const getSortedEmployees = useMemo(() => {
    let filtered = employees.filter(emp => {
      const matchesSearch = emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (emp.employeeDetails?.designation || '').toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesDepartment = selectedDepartment === 'all' || emp.employeeDetails?.department === selectedDepartment;
      
      return matchesSearch && matchesDepartment;
    });
    
    const sorted = [...filtered].sort((a, b) => {
      const dataA = attendanceData[a.employeeId];
      const dataB = attendanceData[b.employeeId];
      
      switch(sortBy) {
        case 'name':
          return sortOrder === 'asc' ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name);
        case 'breakTime':
          return sortOrder === 'asc' ? (dataA?.totalBreakMinutes || 0) - (dataB?.totalBreakMinutes || 0) : (dataB?.totalBreakMinutes || 0) - (dataA?.totalBreakMinutes || 0);
        case 'sessions':
          return sortOrder === 'asc' ? (dataA?.totalBreakSessions || 0) - (dataB?.totalBreakSessions || 0) : (dataB?.totalBreakSessions || 0) - (dataA?.totalBreakSessions || 0);
        case 'days':
          return sortOrder === 'asc' ? (dataA?.daysWithBreaks || 0) - (dataB?.daysWithBreaks || 0) : (dataB?.daysWithBreaks || 0) - (dataA?.daysWithBreaks || 0);
        default:
          return 0;
      }
    });
    
    return sorted;
  }, [employees, searchTerm, selectedDepartment, sortBy, sortOrder, attendanceData]);

  const paginatedEmployees = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return getSortedEmployees.slice(start, start + itemsPerPage);
  }, [getSortedEmployees, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(getSortedEmployees.length / itemsPerPage);

  const handleViewDetails = useCallback(async (employee) => {
    setModalLoading(true);
    setSelectedEmployee(employee);
    setIsModalOpen(true);
    
    try {
      const { startDate, endDate } = getDateRange();
      const attendance = await fetchEmployeeAttendance(
        employee.employeeId,
        startDate,
        endDate
      );
      const breakAnalysis = getDailyBreakDetails(attendance);
      setModalData(breakAnalysis);
    } catch (error) {
      console.error('Error fetching employee details:', error);
      setModalData(null);
    } finally {
      setModalLoading(false);
    }
  }, [getDateRange, fetchEmployeeAttendance, getDailyBreakDetails]);

  const exportToExcel = useCallback(() => {
    const exportData = getSortedEmployees.map(emp => {
      const data = attendanceData[emp.employeeId];
      return {
        'Employee Name': emp.name,
        'Employee ID': emp.employeeId,
        'Department': emp.employeeDetails?.department || 'N/A',
        'Designation': emp.employeeDetails?.designation || 'N/A',
        'Total Break Time (minutes)': data?.totalBreakMinutes || 0,
        'Total Break Sessions': data?.totalBreakSessions || 0,
        'Average Break Duration (minutes)': data?.averageBreakDuration || 0,
        'Days with Breaks': data?.daysWithBreaks || 0
      };
    });
    
    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Break Analysis');
    XLSX.writeFile(wb, `break_analysis_${new Date().toISOString().split('T')[0]}.xlsx`);
    showNotificationMessage('Excel file downloaded successfully!', 'success');
  }, [getSortedEmployees, attendanceData]);

  const exportToCSV = useCallback(() => {
    const exportData = getSortedEmployees.map(emp => {
      const data = attendanceData[emp.employeeId];
      return {
        'Employee Name': emp.name,
        'Employee ID': emp.employeeId,
        'Department': emp.employeeDetails?.department || 'N/A',
        'Designation': emp.employeeDetails?.designation || 'N/A',
        'Total Break Time (minutes)': data?.totalBreakMinutes || 0,
        'Total Break Sessions': data?.totalBreakSessions || 0,
        'Average Break Duration (minutes)': data?.averageBreakDuration || 0,
        'Days with Breaks': data?.daysWithBreaks || 0
      };
    });
    
    const headers = Object.keys(exportData[0]);
    const csvRows = [
      headers.join(','),
      ...exportData.map(row => headers.map(header => JSON.stringify(row[header] || '')).join(','))
    ];
    
    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `break_analysis_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showNotificationMessage('CSV file downloaded successfully!', 'success');
  }, [getSortedEmployees, attendanceData]);

  const printReport = useCallback(() => {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Employee Break Analysis Report</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; }
            h1 { color: #333; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f5f5f5; }
            .header { text-align: center; margin-bottom: 30px; }
            .date { color: #666; margin-top: 10px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Employee Break Analysis Report</h1>
            <p class="date">Generated on: ${new Date().toLocaleString()}</p>
            <p>Filter Period: ${getDateRangeDisplay()}</p>
          </div>
          <table>
            <thead>
              <tr>
                <th>Employee Name</th>
                <th>ID</th>
                <th>Department</th>
                <th>Break Time</th>
                <th>Sessions</th>
                <th>Avg Duration</th>
                <th>Days</th>
              </tr>
            </thead>
            <tbody>
              ${getSortedEmployees.map(emp => {
                const data = attendanceData[emp.employeeId];
                return `
                  <tr>
                    <td>${emp.name}</td>
                    <td>${emp.employeeId}</td>
                    <td>${emp.employeeDetails?.department || 'N/A'}</td>
                    <td>${data ? formatMinutes(data.totalBreakMinutes) : '0'}</td>
                    <td>${data?.totalBreakSessions || 0}</td>
                    <td>${data ? formatMinutes(data.averageBreakDuration) : '0'}</td>
                    <td>${data?.daysWithBreaks || 0}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
    showNotificationMessage('Print job sent!', 'success');
  }, [getSortedEmployees, attendanceData, formatMinutes, getDateRangeDisplay]);

  const closeModal = useCallback(() => {
    setIsModalOpen(false);
    setSelectedEmployee(null);
    setModalData(null);
  }, []);

  const generatePDF = useCallback(() => {
    if (!selectedEmployee || !modalData) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    let yPosition = 20;
    
    doc.setFillColor(253, 224, 71);
    doc.rect(0, 0, pageWidth, 40, 'F');
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Break Report', pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 12;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, pageWidth / 2, yPosition, { align: 'center' });
    
    yPosition += 20;
    
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Employee Information', 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Name: ${selectedEmployee.name}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Employee ID: ${selectedEmployee.employeeId}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Designation: ${selectedEmployee.employeeDetails?.designation || 'N/A'}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Department: ${selectedEmployee.employeeDetails?.department || 'N/A'}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Report Period: ${getDateRangeDisplay()}`, 14, yPosition);
    
    yPosition += 15;
    
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('Break Summary', 14, yPosition);
    
    yPosition += 10;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total Break Time: ${formatMinutes(modalData.totalBreakMinutes)}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Total Break Sessions: ${modalData.totalBreakSessions}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Average Break Duration: ${formatMinutes(modalData.averageBreakDuration)}`, 14, yPosition);
    yPosition += 7;
    doc.text(`Days with Breaks: ${modalData.daysWithBreaks}`, 14, yPosition);
    
    yPosition += 15;
    
    if (modalData.dailyBreaks && modalData.dailyBreaks.length > 0) {
      doc.setFontSize(14);
      doc.setFont('helvetica', 'bold');
      doc.text('Daily Break Details', 14, yPosition);
      yPosition += 10;
      
      for (const day of modalData.dailyBreaks) {
        if (yPosition > pageHeight - 60) {
          doc.addPage();
          yPosition = 20;
        }
        
        doc.setFillColor(249, 250, 251);
        doc.rect(14, yPosition - 5, pageWidth - 28, 12, 'F');
        doc.setFontSize(11);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text(`${day.date} (${day.day})`, 14, yPosition);
        
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(100, 100, 100);
        const rightText = `${day.totalBreakFormatted} (${day.totalBreakSessions} break(s))`;
        doc.text(rightText, pageWidth - 14, yPosition, { align: 'right' });
        
        yPosition += 5;
        doc.setFontSize(8);
        doc.text(`Punch In: ${day.punchIn} | Punch Out: ${day.punchOut}`, 14, yPosition);
        yPosition += 8;
        
        doc.setFillColor(253, 224, 71);
        doc.rect(14, yPosition - 4, pageWidth - 28, 8, 'F');
        doc.setFontSize(8);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        
        const col1 = 14;
        const col2 = 45;
        const col3 = 80;
        const col4 = 115;
        
        doc.text('#', col1, yPosition);
        doc.text('Start', col2, yPosition);
        doc.text('End', col3, yPosition);
        doc.text('Duration', col4, yPosition);
        
        yPosition += 6;
        
        doc.setFont('helvetica', 'normal');
        let rowIndex = 0;
        for (const breakItem of day.breaks) {
          if (yPosition > pageHeight - 30) {
            doc.addPage();
            yPosition = 20;
            doc.setFillColor(253, 224, 71);
            doc.rect(14, yPosition - 4, pageWidth - 28, 8, 'F');
            doc.setFontSize(8);
            doc.setFont('helvetica', 'bold');
            doc.text('#', col1, yPosition);
            doc.text('Start', col2, yPosition);
            doc.text('End', col3, yPosition);
            doc.text('Duration', col4, yPosition);
            yPosition += 6;
            doc.setFont('helvetica', 'normal');
          }
          
          if (rowIndex % 2 === 0) {
            doc.setFillColor(245, 245, 245);
            doc.rect(14, yPosition - 3, pageWidth - 28, 6, 'F');
          }
          
          doc.text(breakItem.breakNumber.toString(), col1, yPosition);
          doc.text(breakItem.startTime, col2, yPosition);
          doc.text(breakItem.endTime, col3, yPosition);
          
          doc.setTextColor(37, 99, 235);
          doc.text(breakItem.durationFormatted, col4, yPosition);
          doc.setTextColor(0, 0, 0);
          
          yPosition += 6;
          rowIndex++;
        }
        
        yPosition += 8;
      }
    }
    
    doc.save(`Break_Report_${selectedEmployee.name.split(' ')[0]}_${new Date().toISOString().split('T')[0]}.pdf`);
    showNotificationMessage('PDF downloaded successfully!', 'success');
  }, [selectedEmployee, modalData, formatMinutes, getDateRangeDisplay]);

  const getTotalCompanyBreaks = useCallback(() => {
    let totalMinutes = 0;
    let totalSessions = 0;
    let totalDaysWithBreaks = 0;
    let mostBreaker = { name: '', minutes: 0, id: '', sessions: 0 };
    let leastBreaker = { name: '', minutes: Infinity, id: '', sessions: 0 };
    let departmentStats = {};
    
    employees.forEach(emp => {
      const data = attendanceData[emp.employeeId];
      const dept = emp.employeeDetails?.department || 'Unknown';
      
      if (data && data.totalBreakMinutes > 0) {
        totalMinutes += data.totalBreakMinutes;
        totalSessions += data.totalBreakSessions;
        totalDaysWithBreaks += data.daysWithBreaks;
        
        if (!departmentStats[dept]) {
          departmentStats[dept] = { totalBreak: 0, employeeCount: 0 };
        }
        departmentStats[dept].totalBreak += data.totalBreakMinutes;
        departmentStats[dept].employeeCount++;
        
        if (data.totalBreakMinutes > mostBreaker.minutes) {
          mostBreaker = { 
            name: emp.name, 
            minutes: data.totalBreakMinutes,
            id: emp.employeeId,
            sessions: data.totalBreakSessions
          };
        }
        
        if (data.totalBreakMinutes < leastBreaker.minutes) {
          leastBreaker = { 
            name: emp.name, 
            minutes: data.totalBreakMinutes,
            id: emp.employeeId,
            sessions: data.totalBreakSessions
          };
        }
      }
    });
    
    if (leastBreaker.minutes === Infinity) {
      leastBreaker = { name: 'None', minutes: 0, id: '', sessions: 0 };
    }
    
    const avgBreakPerEmployee = employees.length > 0 ? totalMinutes / employees.length : 0;
    const avgBreakPerDay = totalDaysWithBreaks > 0 ? totalMinutes / totalDaysWithBreaks : 0;
    
    return { 
      totalMinutes, 
      totalSessions, 
      totalDaysWithBreaks,
      avgBreakPerEmployee,
      avgBreakPerDay,
      mostBreaker,
      leastBreaker,
      departmentStats
    };
  }, [employees, attendanceData]);

  const companyTotal = useMemo(() => getTotalCompanyBreaks(), [getTotalCompanyBreaks]);

  if (loading && employees.length === 0) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HRSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100">
        <HRSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
        <div className="flex-1 flex items-center justify-center p-4">
          <div className="text-center bg-white p-6 rounded-xl shadow-lg max-w-md w-full">
            <div className="text-red-500 text-5xl mb-3">⚠️</div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Error</h3>
            <p className="text-gray-600 text-sm mb-4">{error}</p>
            <button
              onClick={loadAllAttendance}
              className="px-5 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition font-medium text-sm"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
      {/* Sidebar */}
      <HRSidebar collapsed={sidebarCollapsed} setCollapsed={setSidebarCollapsed} />
      
      {/* Main Content - with proper spacing to avoid overlap */}
      <div className={`flex-1 overflow-y-auto transition-all duration-300 ${sidebarCollapsed ? 'ml-16' : 'ml-64'}`}>
        {/* Mobile Menu Button - visible only on mobile */}
        <div className="lg:hidden fixed top-4 left-4 z-20">
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className="p-2 bg-yellow-500 text-white rounded-lg shadow-lg"
          >
            <MdMenu size={20} />
          </button>
        </div>

        <div className="p-4 md:p-6 lg:p-8">
          {/* Notification Toast */}
          {showNotification && (
            <div className="fixed top-4 right-4 z-50 animate-slide-in">
              <div className="bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg flex items-center gap-2">
                <MdInfo size={18} />
                <span className="text-sm">{notificationMessage}</span>
              </div>
            </div>
          )}

          {/* Header Section */}
          <div className="mb-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div>
                <h1 className="text-xl md:text-2xl lg:text-3xl font-bold text-gray-800 flex items-center gap-2">
                  <div className="bg-gradient-to-br from-yellow-400 to-yellow-600 p-1.5 md:p-2 rounded-lg shadow-lg">
                    <MdFreeBreakfast className="text-white" size={20} />
                  </div>
                  Employee Break Analysis
                </h1>
                <p className="text-xs md:text-sm text-gray-500 mt-1">Monitor and analyze employee break patterns</p>
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => setShowCharts(!showCharts)}
                  className="flex items-center gap-1 px-3 py-1.5 bg-indigo-500 text-white rounded-lg text-xs hover:bg-indigo-600 transition"
                >
                  <MdBarChart size={14} />
                  {showCharts ? 'Hide Charts' : 'Show Charts'}
                </button>
                <button
                  onClick={exportToExcel}
                  className="flex items-center gap-1 px-3 py-1.5 bg-green-500 text-white rounded-lg text-xs hover:bg-green-600 transition"
                >
                  <MdFileDownload size={14} />
                  Excel
                </button>
                <button
                  onClick={exportToCSV}
                  className="flex items-center gap-1 px-3 py-1.5 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition"
                >
                  <MdDownload size={14} />
                  CSV
                </button>
                <button
                  onClick={printReport}
                  className="flex items-center gap-1 px-3 py-1.5 bg-gray-500 text-white rounded-lg text-xs hover:bg-gray-600 transition"
                >
                  <MdPrint size={14} />
                  Print
                </button>
                <button
                  onClick={loadAllAttendance}
                  className="flex items-center gap-1 px-3 py-1.5 bg-yellow-500 text-white rounded-lg text-xs hover:bg-yellow-600 transition"
                >
                  <MdRefresh size={14} />
                  Refresh
                </button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 md:gap-4 mb-6">
            <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Employees</p>
                  <p className="text-2xl font-bold text-gray-800">{employees.length}</p>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <MdTrendingUp size={12} />
                    Active
                  </p>
                </div>
                <div className="bg-yellow-100 p-2 rounded-lg">
                  <MdPeople className="text-yellow-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Total Break Time</p>
                  <p className="text-xl font-bold text-gray-800">{formatMinutes(companyTotal.totalMinutes)}</p>
                  <p className="text-xs text-gray-500 mt-1">Avg: {formatMinutes(companyTotal.avgBreakPerEmployee)}/emp</p>
                </div>
                <div className="bg-blue-100 p-2 rounded-lg">
                  <MdTimer className="text-blue-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Break Sessions</p>
                  <p className="text-2xl font-bold text-gray-800">{companyTotal.totalSessions}</p>
                  <p className="text-xs text-green-600 mt-1">Total breaks</p>
                </div>
                <div className="bg-green-100 p-2 rounded-lg">
                  <MdRestaurant className="text-green-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Days with Breaks</p>
                  <p className="text-2xl font-bold text-gray-800">{companyTotal.totalDaysWithBreaks}</p>
                  <p className="text-xs text-blue-600 mt-1">{companyTotal.avgBreakPerDay.toFixed(0)} min/day avg</p>
                </div>
                <div className="bg-purple-100 p-2 rounded-lg">
                  <MdFreeBreakfast className="text-purple-600 text-xl" />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm p-4 hover:shadow-md transition">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Productivity Score</p>
                  <p className="text-2xl font-bold text-gray-800">
                    {Math.round(100 - (companyTotal.totalMinutes / (employees.length * 480) * 100))}%
                  </p>
                  <p className="text-xs text-green-600 mt-1">Based on 8hr day</p>
                </div>
                <div className="bg-indigo-100 p-2 rounded-lg">
                  <MdShowChart className="text-indigo-600 text-xl" />
                </div>
              </div>
            </div>
          </div>

          {/* Charts Section */}
          {showCharts && (
            <div className="bg-white rounded-xl shadow-sm mb-6 p-4">
              <h3 className="text-sm font-bold text-gray-800 mb-3 flex items-center gap-2">
                <MdPieChart className="text-indigo-500" />
                Analytics Dashboard
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Peak Break Hours</h4>
                  <div className="space-y-2">
                    {analytics.peakBreakHours.map((peak, idx) => (
                      <div key={idx} className="flex items-center justify-between text-sm">
                        <span>{peak.hour}:00 - {parseInt(peak.hour) + 1}:00</span>
                        <div className="flex-1 mx-2 h-2 bg-gray-200 rounded-full overflow-hidden">
                          <div className="h-full bg-orange-500 rounded-full" style={{ width: `${(peak.count / (analytics.peakBreakHours[0]?.count || 1)) * 100}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{peak.count} breaks</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-xs font-semibold text-gray-600 mb-2">Department Break Distribution</h4>
                  <div className="space-y-2">
                    {Object.entries(companyTotal.departmentStats).slice(0, 5).map(([dept, stats]) => (
                      <div key={dept} className="flex items-center justify-between text-sm">
                        <span className="truncate">{dept}</span>
                        <span className="text-xs text-gray-500">{formatMinutes(stats.totalBreak)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Breaker Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 mb-6">
            <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-xl p-4 border border-red-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-red-500 p-1.5 rounded-full">
                  <MdWarning className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">⚠️ Needs Attention</h3>
              </div>
              {companyTotal.mostBreaker.name && companyTotal.mostBreaker.minutes > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-800 truncate">{companyTotal.mostBreaker.name}</p>
                      <p className="text-xs text-gray-500">ID: {companyTotal.mostBreaker.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-red-600">{formatMinutes(companyTotal.mostBreaker.minutes)}</p>
                      <p className="text-xs text-gray-500">{companyTotal.mostBreaker.sessions} sessions</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No data available</p>
              )}
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-4 border border-green-200">
              <div className="flex items-center gap-2 mb-3">
                <div className="bg-green-500 p-1.5 rounded-full">
                  <MdStar className="text-white text-sm" />
                </div>
                <h3 className="text-sm font-bold text-gray-800">🏆 Best Performer</h3>
              </div>
              {companyTotal.leastBreaker.name && companyTotal.leastBreaker.minutes > 0 ? (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1 min-w-0">
                      <p className="text-base font-bold text-gray-800 truncate">{companyTotal.leastBreaker.name}</p>
                      <p className="text-xs text-gray-500">ID: {companyTotal.leastBreaker.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-green-600">{formatMinutes(companyTotal.leastBreaker.minutes)}</p>
                      <p className="text-xs text-gray-500">{companyTotal.leastBreaker.sessions} sessions</p>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-sm text-gray-500">No data available</p>
              )}
            </div>
          </div>

          {/* Advanced Filters */}
          <div className="bg-white rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
              <h2 className="text-sm font-semibold text-gray-800 flex items-center gap-2">
                <MdFilterList className="text-yellow-600" />
                Advanced Filters & Export
              </h2>
            </div>
            <div className="p-4">
              <div className="flex flex-col gap-3">
                <div className="flex flex-wrap gap-2">
                  {Object.keys(datePresets).map(preset => (
                    <button
                      key={preset}
                      onClick={() => setDateRangePreset(preset)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        dateRangePreset === preset ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {datePresets[preset].label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2">
                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={selectedDepartment}
                      onChange={(e) => setSelectedDepartment(e.target.value)}
                      className="w-full border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value="all">All Departments</option>
                      {departments.map(dept => (
                        <option key={dept} value={dept}>{dept}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="flex-1 min-w-[150px]">
                    <select
                      value={itemsPerPage}
                      onChange={(e) => setItemsPerPage(Number(e.target.value))}
                      className="w-full border rounded-lg px-3 py-1.5 text-sm"
                    >
                      <option value={10}>10 per page</option>
                      <option value={25}>25 per page</option>
                      <option value={50}>50 per page</option>
                      <option value={100}>100 per page</option>
                    </select>
                  </div>

                  <div className="relative flex-1 min-w-[200px]">
                    <MdSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                    <input
                      type="text"
                      placeholder="Search by name or ID..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-9 pr-3 py-1.5 border rounded-lg text-sm w-full"
                    />
                  </div>
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2 text-xs">
                      <span className="font-semibold text-gray-700">Active Filter:</span>
                      <span className="px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded-full text-xs">
                        {getDateRangeDisplay()}
                      </span>
                      <span className="text-gray-400">|</span>
                      <span className="text-xs text-gray-500">
                        {getSortedEmployees.length} employees found
                      </span>
                    </div>
                    <div className="flex gap-1">
                      <button
                        onClick={() => setViewMode('table')}
                        className={`p-1.5 rounded ${viewMode === 'table' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400'}`}
                      >
                        <MdViewList size={16} />
                      </button>
                      <button
                        onClick={() => setViewMode('compact')}
                        className={`p-1.5 rounded ${viewMode === 'compact' ? 'bg-yellow-100 text-yellow-600' : 'text-gray-400'}`}
                      >
                        <MdGridView size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Employee Table */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gradient-to-r from-yellow-50 to-yellow-100">
                  <tr>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:text-yellow-600" onClick={() => handleSort('name')}>
                      <div className="flex items-center gap-1">
                        Employee
                        {sortBy === 'name' && (sortOrder === 'asc' ? <MdArrowUpward size={12} /> : <MdArrowDownward size={12} />)}
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">ID</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 hidden md:table-cell">Department</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:text-yellow-600" onClick={() => handleSort('breakTime')}>
                      <div className="flex items-center gap-1">
                        Break Time
                        {sortBy === 'breakTime' && (sortOrder === 'asc' ? <MdArrowUpward size={12} /> : <MdArrowDownward size={12} />)}
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:text-yellow-600 hidden sm:table-cell" onClick={() => handleSort('sessions')}>
                      <div className="flex items-center gap-1">
                        Sessions
                        {sortBy === 'sessions' && (sortOrder === 'asc' ? <MdArrowUpward size={12} /> : <MdArrowDownward size={12} />)}
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 hidden lg:table-cell">Avg Duration</th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700 cursor-pointer hover:text-yellow-600 hidden md:table-cell" onClick={() => handleSort('days')}>
                      <div className="flex items-center gap-1">
                        Days
                        {sortBy === 'days' && (sortOrder === 'asc' ? <MdArrowUpward size={12} /> : <MdArrowDownward size={12} />)}
                      </div>
                    </th>
                    <th className="px-3 py-3 text-left text-xs font-semibold text-gray-700">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {paginatedEmployees.map((employee, index) => {
                    const data = attendanceData[employee.employeeId];
                    const isHighBreaker = data && data.totalBreakMinutes > companyTotal.avgBreakPerEmployee * 1.5;
                    const isLowBreaker = data && data.totalBreakMinutes < companyTotal.avgBreakPerEmployee * 0.5;
                    
                    return (
                      <tr key={employee.employeeId} className={`hover:bg-yellow-50 transition text-sm ${isHighBreaker ? 'bg-red-50' : isLowBreaker ? 'bg-green-50' : index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                        <td className="px-3 py-3">
                          <div className="font-medium text-gray-900 text-sm">{employee.name}</div>
                          <div className="text-xs text-gray-500 md:hidden">{employee.employeeDetails?.department || 'N/A'}</div>
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs">{employee.employeeId}</td>
                        <td className="px-3 py-3 text-gray-600 text-xs hidden md:table-cell">
                          {employee.employeeDetails?.department || 'N/A'}
                        </td>
                        <td className="px-3 py-3">
                          <span className={`font-semibold text-xs ${isHighBreaker ? 'text-red-600' : isLowBreaker ? 'text-green-600' : 'text-blue-600'}`}>
                            {data ? formatMinutes(data.totalBreakMinutes) : '0'}
                          </span>
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs hidden sm:table-cell">
                          {data?.totalBreakSessions || 0}
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs hidden lg:table-cell">
                          {data ? formatMinutes(data.averageBreakDuration) : '0'}
                        </td>
                        <td className="px-3 py-3 text-gray-600 text-xs hidden md:table-cell">
                          {data?.daysWithBreaks || 0}
                        </td>
                        <td className="px-3 py-3">
                          <button
                            onClick={() => handleViewDetails(employee)}
                            className="px-2 py-1 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition text-xs font-medium"
                          >
                            View
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between px-4 py-3 bg-gray-50 border-t">
                <button
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 bg-white border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Previous
                </button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </span>
                  <select
                    value={currentPage}
                    onChange={(e) => setCurrentPage(Number(e.target.value))}
                    className="border rounded px-2 py-1 text-sm"
                  >
                    {Array.from({ length: Math.min(totalPages, 20) }, (_, i) => i + 1).map(page => (
                      <option key={page} value={page}>{page}</option>
                    ))}
                  </select>
                </div>
                <button
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 bg-white border rounded-lg text-sm disabled:opacity-50 hover:bg-gray-50 transition"
                >
                  Next
                </button>
              </div>
            )}
            
            {getSortedEmployees.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <MdFreeBreakfast className="mx-auto text-3xl text-gray-300 mb-2" />
                <p className="text-sm">No employees found</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && selectedEmployee && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
          onClick={closeModal}
        >
          <div 
            className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-auto shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="sticky top-0 bg-yellow-50 border-b px-4 py-3 flex justify-between items-center">
              <div className="flex-1 min-w-0">
                <h3 className="font-bold text-gray-800 text-sm md:text-base truncate">
                  Break Details - {selectedEmployee.name}
                </h3>
                <p className="text-xs text-gray-500 mt-1">Filter: {getDateRangeDisplay()}</p>
              </div>
              <div className="flex gap-2 ml-2">
                {modalData?.dailyBreaks?.length > 0 && (
                  <button
                    onClick={generatePDF}
                    className="flex items-center gap-1 px-3 py-1 bg-red-500 text-white rounded-lg text-xs"
                  >
                    <MdPictureAsPdf size={14} />
                    PDF
                  </button>
                )}
                <button onClick={closeModal} className="p-1 hover:bg-gray-200 rounded">
                  <MdClose size={18} />
                </button>
              </div>
            </div>
            
            <div className="p-4">
              {modalLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-500 mx-auto"></div>
                  <p className="mt-2 text-sm text-gray-500">Loading...</p>
                </div>
              ) : modalData?.dailyBreaks?.length > 0 ? (
                <div>
                  <div className="grid grid-cols-3 gap-2 mb-4">
                    <div className="bg-blue-50 p-2 rounded text-center">
                      <p className="text-xs text-blue-600">Total Time</p>
                      <p className="text-sm font-bold text-blue-800">{formatMinutes(modalData.totalBreakMinutes)}</p>
                    </div>
                    <div className="bg-green-50 p-2 rounded text-center">
                      <p className="text-xs text-green-600">Sessions</p>
                      <p className="text-sm font-bold text-green-800">{modalData.totalBreakSessions}</p>
                    </div>
                    <div className="bg-purple-50 p-2 rounded text-center">
                      <p className="text-xs text-purple-600">Days</p>
                      <p className="text-sm font-bold text-purple-800">{modalData.daysWithBreaks}</p>
                    </div>
                  </div>
                  
                  {modalData.dailyBreaks.map((day, idx) => (
                    <div key={idx} className="border rounded-lg mb-3 overflow-hidden">
                      <div className="bg-gray-50 p-2 border-b">
                        <div className="flex justify-between items-center flex-wrap gap-1">
                          <span className="font-bold text-sm">{day.date}</span>
                          <span className="text-xs text-blue-600">{day.totalBreakFormatted}</span>
                        </div>
                        <div className="text-xs text-gray-500">Punch: {day.punchIn} → {day.punchOut}</div>
                      </div>
                      <div className="p-2">
                        <div className="space-y-1">
                          {day.breaks.map((breakItem, breakIdx) => (
                            <div key={breakIdx} className="flex justify-between items-center text-xs p-1 bg-gray-50 rounded">
                              <span className="font-medium">Break {breakItem.breakNumber}</span>
                              <span>{breakItem.startTime} → {breakItem.endTime}</span>
                              <span className="bg-blue-100 px-2 py-0.5 rounded-full text-blue-700">
                                {breakItem.durationFormatted}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MdFreeBreakfast className="mx-auto text-4xl text-gray-300 mb-2" />
                  <p className="text-gray-500 text-sm">No break records found</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      
      <style>{`
        @keyframes slide-in {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        .animate-slide-in {
          animation: slide-in 0.3s ease-out;
        }
      `}</style>
    </div>
  );
};

export default EmployeeBreakAnalysis;