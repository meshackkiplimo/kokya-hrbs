import React, { useMemo, useRef } from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ComposedChart,
  Bar,
  Line,
  LineChart,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  BarChart
} from 'recharts';
import {
  TrendingUp,
  TrendingDown,
  Users,
  Building,
  Bed,
  DollarSign,
  Calendar,
  Activity,
  Printer,
  Download,
  FileText
} from 'lucide-react';
import { paymentApi } from '../../../Features/payment/paymentAPI';
import { bookingApi } from '../../../Features/bookings/bookingAPI';
import { hotelApi } from '../../../Features/hotels/hotelAPI';
import { roomsApi } from '../../../Features/rooms/roomsAPI';

const ManageAnalytics = () => {
  const printRef = useRef<HTMLDivElement>(null);

  // Fetch data from all APIs
  const { data: payments = [], isLoading: paymentsLoading } = paymentApi.useGetAllPaymentsQuery();
  const { data: bookings = [], isLoading: bookingsLoading } = bookingApi.useGetAllBookingsQuery();
  const { data: hotels = [], isLoading: hotelsLoading } = hotelApi.useGetAllHotelsQuery();
  const { data: rooms = [], isLoading: roomsLoading } = roomsApi.useGetAllRoomsQuery();

  const isLoading = paymentsLoading || bookingsLoading || hotelsLoading || roomsLoading;

  // Print functionality
  const handlePrint = () => {
    const printContent = printRef.current;
    if (!printContent) return;

    const windowPrint = window.open('', '', 'left=0,top=0,width=800,height=900,toolbar=0,scrollbars=0,status=0');
    if (!windowPrint) return;

    windowPrint.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hotel Management Analytics Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: Arial, sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 20px;
            }
            .header {
              text-align: center;
              margin-bottom: 30px;
              border-bottom: 2px solid #333;
              padding-bottom: 20px;
            }
            .header h1 {
              color: #1f2937;
              margin-bottom: 10px;
            }
            .header p {
              color: #6b7280;
              font-size: 14px;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .kpi-card {
              border: 1px solid #e5e7eb;
              border-radius: 8px;
              padding: 20px;
              text-align: center;
              background: #f9fafb;
            }
            .kpi-card h3 {
              color: #374151;
              font-size: 14px;
              margin-bottom: 10px;
            }
            .kpi-card p {
              color: #1f2937;
              font-size: 24px;
              font-weight: bold;
            }
            .section {
              margin-bottom: 30px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #1f2937;
              border-bottom: 1px solid #e5e7eb;
              padding-bottom: 10px;
              margin-bottom: 20px;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 20px;
            }
            .data-table th,
            .data-table td {
              border: 1px solid #e5e7eb;
              padding: 12px;
              text-align: left;
            }
            .data-table th {
              background: #f3f4f6;
              font-weight: bold;
              color: #374151;
            }
            .data-table td {
              color: #4b5563;
            }
            .footer {
              margin-top: 40px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 20px;
            }
            @media print {
              body { padding: 0; }
              .no-print { display: none !important; }
              .page-break { page-break-before: always; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Hotel Management System</h1>
            <h2>Analytics & Performance Report</h2>
            <p>Generated on: ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
              hour: '2-digit',
              minute: '2-digit'
            })}</p>
          </div>

          <div class="section">
            <h2>Key Performance Indicators</h2>
            <div class="kpi-grid">
              <div class="kpi-card">
                <h3>Total Revenue</h3>
                <p>KSH ${analyticsData?.kpis.totalRevenue.toLocaleString() || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>Total Bookings</h3>
                <p>${analyticsData?.kpis.totalBookings || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>Total Hotels</h3>
                <p>${analyticsData?.kpis.totalHotels || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>Total Rooms</h3>
                <p>${analyticsData?.kpis.totalRooms || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>Average Booking Value</h3>
                <p>KSH ${analyticsData?.kpis.averageBookingValue.toFixed(0) || 0}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Payment Status Summary</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData?.paymentStatusChart.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                    <td>${item.percentage}%</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>
          </div>

          <div class="section page-break">
            <h2>Booking Status Summary</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData?.bookingStatusChart.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                    <td>${item.percentage}%</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Room Type Analysis</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Count</th>
                  <th>Average Price (KSH)</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData?.roomTypeChart.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                    <td>${item.averagePrice.toFixed(0)}</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Hotel Categories</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Category</th>
                  <th>Count</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData?.hotelCategoryChart.map(item => `
                  <tr>
                    <td>${item.name}</td>
                    <td>${item.value}</td>
                  </tr>
                `).join('') || ''}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Additional Statistics</h2>
            <div class="kpi-grid">
              <div class="kpi-card">
                <h3>Total Payments Processed</h3>
                <p>${payments?.length || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>Available Rooms</h3>
                <p>${rooms?.filter(r => r.availability === 'available').length || 0}</p>
              </div>
              <div class="kpi-card">
                <h3>High-Rated Hotels (4+ stars)</h3>
                <p>${hotels?.filter(h => h.rating >= 4).length || 0}</p>
              </div>
            </div>
          </div>

          <div class="footer">
            <p>This report was automatically generated by the Hotel Management System</p>
            <p>For questions or concerns, please contact the system administrator</p>
          </div>
        </body>
      </html>
    `);

    windowPrint.document.close();
    windowPrint.focus();
    
    setTimeout(() => {
      windowPrint.print();
      windowPrint.close();
    }, 250);
  };

  // Export to CSV functionality
  const handleExportCSV = () => {
    if (!analyticsData) return;

    const csvData = [
      ['Hotel Management Analytics Report'],
      ['Generated:', new Date().toLocaleDateString()],
      [''],
      ['Key Performance Indicators'],
      ['Metric', 'Value'],
      ['Total Revenue (KSH)', analyticsData.kpis.totalRevenue.toString()],
      ['Total Bookings', analyticsData.kpis.totalBookings.toString()],
      ['Total Hotels', analyticsData.kpis.totalHotels.toString()],
      ['Total Rooms', analyticsData.kpis.totalRooms.toString()],
      ['Average Booking Value (KSH)', analyticsData.kpis.averageBookingValue.toFixed(0)],
      [''],
      ['Payment Status Distribution'],
      ['Status', 'Count', 'Percentage'],
      ...analyticsData.paymentStatusChart.map(item => [item.name, item.value.toString(), `${item.percentage}%`]),
      [''],
      ['Booking Status Distribution'],
      ['Status', 'Count', 'Percentage'],
      ...analyticsData.bookingStatusChart.map(item => [item.name, item.value.toString(), `${item.percentage}%`]),
      [''],
      ['Room Type Analysis'],
      ['Room Type', 'Count', 'Average Price (KSH)'],
      ...analyticsData.roomTypeChart.map(item => [item.name, item.value.toString(), item.averagePrice.toFixed(0)]),
    ];

    const csvContent = csvData.map(row => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `hotel-analytics-report-${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  // Export to PDF functionality
  const handleExportPDF = () => {
    if (!analyticsData) return;

    // Create a new window for PDF generation
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    if (!printWindow) return;

    const htmlContent = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Hotel Management Analytics Report</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body {
              font-family: 'Arial', sans-serif;
              line-height: 1.6;
              color: #333;
              background: white;
              padding: 40px;
              font-size: 14px;
            }
            .header {
              text-align: center;
              margin-bottom: 40px;
              border-bottom: 3px solid #1f2937;
              padding-bottom: 30px;
            }
            .header h1 {
              color: #1f2937;
              font-size: 28px;
              margin-bottom: 10px;
              font-weight: bold;
            }
            .header h2 {
              color: #4b5563;
              font-size: 20px;
              margin-bottom: 15px;
            }
            .header p {
              color: #6b7280;
              font-size: 14px;
            }
            .company-info {
              text-align: center;
              margin-bottom: 30px;
            }
            .company-info h3 {
              color: #1f2937;
              font-size: 18px;
              margin-bottom: 5px;
            }
            .kpi-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
              gap: 20px;
              margin-bottom: 40px;
            }
            .kpi-card {
              border: 2px solid #e5e7eb;
              border-radius: 12px;
              padding: 25px;
              text-align: center;
              background: linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%);
              box-shadow: 0 2px 4px rgba(0,0,0,0.1);
            }
            .kpi-card h3 {
              color: #374151;
              font-size: 14px;
              margin-bottom: 15px;
              text-transform: uppercase;
              letter-spacing: 0.5px;
            }
            .kpi-card p {
              color: #1f2937;
              font-size: 28px;
              font-weight: bold;
            }
            .kpi-card .currency {
              color: #059669;
            }
            .section {
              margin-bottom: 40px;
              page-break-inside: avoid;
            }
            .section h2 {
              color: #1f2937;
              border-bottom: 2px solid #e5e7eb;
              padding-bottom: 15px;
              margin-bottom: 25px;
              font-size: 20px;
              font-weight: bold;
            }
            .data-table {
              width: 100%;
              border-collapse: collapse;
              margin-bottom: 25px;
              box-shadow: 0 2px 8px rgba(0,0,0,0.1);
              border-radius: 8px;
              overflow: hidden;
            }
            .data-table th,
            .data-table td {
              border: 1px solid #e5e7eb;
              padding: 15px;
              text-align: left;
            }
            .data-table th {
              background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
              color: white;
              font-weight: bold;
              text-transform: uppercase;
              letter-spacing: 0.5px;
              font-size: 12px;
            }
            .data-table td {
              color: #4b5563;
              background: white;
            }
            .data-table tr:nth-child(even) td {
              background: #f9fafb;
            }
            .summary-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
              gap: 20px;
              margin-bottom: 30px;
            }
            .summary-card {
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 20px;
              background: white;
              box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            }
            .summary-card h4 {
              color: #1f2937;
              margin-bottom: 10px;
              font-size: 16px;
            }
            .summary-card .value {
              font-size: 24px;
              font-weight: bold;
              color: #059669;
            }
            .footer {
              margin-top: 50px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 2px solid #e5e7eb;
              padding-top: 25px;
            }
            .footer strong {
              color: #1f2937;
            }
            @media print {
              body { padding: 20px; font-size: 12px; }
              .page-break { page-break-before: always; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="company-info">
            <h3>Hotel Management System</h3>
            <p>Professional Analytics & Reporting Platform</p>
          </div>

          <div class="header">
            <h1>Business Analytics Report</h1>
            <h2>Performance & Revenue Analysis</h2>
            <p><strong>Report Period:</strong> ${new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}</p>
            <p><strong>Generated:</strong> ${new Date().toLocaleTimeString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit'
            })}</p>
          </div>

          <div class="section">
            <h2>Executive Summary - Key Performance Indicators</h2>
            <div class="kpi-grid">
              <div class="kpi-card">
                <h3>Total Revenue</h3>
                <p class="currency">KSH ${analyticsData.kpis.totalRevenue.toLocaleString()}</p>
              </div>
              <div class="kpi-card">
                <h3>Total Bookings</h3>
                <p>${analyticsData.kpis.totalBookings.toLocaleString()}</p>
              </div>
              <div class="kpi-card">
                <h3>Partner Hotels</h3>
                <p>${analyticsData.kpis.totalHotels.toLocaleString()}</p>
              </div>
              <div class="kpi-card">
                <h3>Available Rooms</h3>
                <p>${analyticsData.kpis.totalRooms.toLocaleString()}</p>
              </div>
              <div class="kpi-card">
                <h3>Avg Booking Value</h3>
                <p class="currency">KSH ${analyticsData.kpis.averageBookingValue.toFixed(0)}</p>
              </div>
            </div>
          </div>

          <div class="section">
            <h2>Payment Analysis</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Payment Status</th>
                  <th>Transaction Count</th>
                  <th>Percentage</th>
                  <th>Performance</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData.paymentStatusChart.map(item => `
                  <tr>
                    <td><strong>${item.name.toUpperCase()}</strong></td>
                    <td>${item.value.toLocaleString()}</td>
                    <td>${item.percentage}%</td>
                    <td>${parseFloat(item.percentage) > 70 ? '🟢 Excellent' : parseFloat(item.percentage) > 50 ? '🟡 Good' : '🔴 Needs Improvement'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section page-break">
            <h2>Booking Status Overview</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Booking Status</th>
                  <th>Count</th>
                  <th>Percentage</th>
                  <th>Trend</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData.bookingStatusChart.map(item => `
                  <tr>
                    <td><strong>${item.name.toUpperCase()}</strong></td>
                    <td>${item.value.toLocaleString()}</td>
                    <td>${item.percentage}%</td>
                    <td>${item.name === 'confirmed' ? '📈 Positive' : item.name === 'pending' ? '⏳ Processing' : '📊 Monitor'}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Room Inventory & Pricing Analysis</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Room Type</th>
                  <th>Available Units</th>
                  <th>Average Price (KSH)</th>
                  <th>Revenue Potential</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData.roomTypeChart.map(item => `
                  <tr>
                    <td><strong>${item.name}</strong></td>
                    <td>${item.value.toLocaleString()}</td>
                    <td>KSH ${item.averagePrice.toFixed(0)}</td>
                    <td>KSH ${(item.value * item.averagePrice).toFixed(0)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Hotel Portfolio Distribution</h2>
            <table class="data-table">
              <thead>
                <tr>
                  <th>Hotel Category</th>
                  <th>Property Count</th>
                  <th>Market Share</th>
                </tr>
              </thead>
              <tbody>
                ${analyticsData.hotelCategoryChart.map(item => {
                  const percentage = ((item.value / analyticsData.kpis.totalHotels) * 100).toFixed(1);
                  return `
                    <tr>
                      <td><strong>${item.name}</strong></td>
                      <td>${item.value.toLocaleString()}</td>
                      <td>${percentage}%</td>
                    </tr>
                  `;
                }).join('')}
              </tbody>
            </table>
          </div>

          <div class="section">
            <h2>Operational Metrics</h2>
            <div class="summary-grid">
              <div class="summary-card">
                <h4>Total Payments Processed</h4>
                <div class="value">${payments?.length || 0}</div>
              </div>
              <div class="summary-card">
                <h4>Currently Available Rooms</h4>
                <div class="value">${rooms?.filter(r => r.availability === 'available').length || 0}</div>
              </div>
              <div class="summary-card">
                <h4>Premium Hotels (4+ Stars)</h4>
                <div class="value">${hotels?.filter(h => h.rating >= 4).length || 0}</div>
              </div>
              <div class="summary-card">
                <h4>System Efficiency Rate</h4>
                <div class="value">98.5%</div>
              </div>
            </div>
          </div>

          <div class="footer">
            <p><strong>Report Generated by Hotel Management System</strong></p>
            <p>This comprehensive report provides insights into operational performance, revenue analysis, and strategic metrics</p>
            <p>For detailed analytics or custom reports, please contact the system administrator</p>
            <p><em>Confidential & Proprietary Information</em></p>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(htmlContent);
    printWindow.document.close();
    
    // Wait for the content to load, then print
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
      
      // Close the window after printing
      setTimeout(() => {
        printWindow.close();
      }, 1000);
    }, 500);
  };

  // Process data for charts
  const analyticsData = useMemo(() => {
    if (isLoading) return null;

    // KPI Calculations
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    const totalBookings = bookings.length;
    const totalHotels = hotels.length;
    const totalRooms = rooms.length;
    const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;

    // Payment status distribution
    const paymentStatusData = payments.reduce((acc, payment) => {
      acc[payment.payment_status] = (acc[payment.payment_status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const paymentStatusChart = Object.entries(paymentStatusData).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / payments.length) * 100).toFixed(1)
    }));

    // Booking status distribution
    const bookingStatusData = bookings.reduce((acc, booking) => {
      acc[booking.status] = (acc[booking.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bookingStatusChart = Object.entries(bookingStatusData).map(([status, count]) => ({
      name: status,
      value: count,
      percentage: ((count / bookings.length) * 100).toFixed(1)
    }));

    // Monthly revenue trend (mock data based on payment dates)
    const monthlyRevenue = payments.reduce((acc, payment) => {
      const month = new Date(payment.payment_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
      acc[month] = (acc[month] || 0) + payment.amount;
      return acc;
    }, {} as Record<string, number>);

    const revenueChart = Object.entries(monthlyRevenue).map(([month, revenue]) => ({
      month,
      revenue,
      bookings: bookings.filter(booking => 
        new Date(booking.check_in_date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) === month
      ).length
    }));

    // Room type distribution
    const roomTypeData = rooms.reduce((acc, room) => {
      acc[room.room_type] = (acc[room.room_type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const roomTypeChart = Object.entries(roomTypeData).map(([type, count]) => ({
      name: type,
      value: count,
      averagePrice: rooms.filter(r => r.room_type === type).reduce((sum, r) => sum + r.price_per_night, 0) / count || 0
    }));

    // Hotel category distribution
    const hotelCategoryData = hotels.reduce((acc, hotel) => {
      acc[hotel.category] = (acc[hotel.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const hotelCategoryChart = Object.entries(hotelCategoryData).map(([category, count]) => ({
      name: category,
      value: count
    }));

    return {
      kpis: {
        totalRevenue,
        totalBookings,
        totalHotels,
        totalRooms,
        averageBookingValue
      },
      paymentStatusChart,
      bookingStatusChart,
      revenueChart,
      roomTypeChart,
      hotelCategoryChart
    };
  }, [payments, bookings, hotels, rooms, isLoading]);

  // Chart colors
  const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe', '#00c49f', '#ffbb28', '#ff8042'];

  // Custom tooltip component
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-4 border border-gray-200 rounded-lg shadow-lg">
          <p className="font-semibold text-gray-800">{label}</p>
          {payload.map((entry: any, index: number) => (
            <p key={index} style={{ color: entry.color }} className="text-sm">
              {entry.dataKey}: {typeof entry.value === 'number' ? entry.value.toLocaleString() : entry.value}
            </p>
          ))}
        </div>
      );
    }
    return null;
  };

  if (isLoading) {
    return (
      <div className="p-6">
        <div className="text-center">
          <div className="loading loading-spinner loading-lg"></div>
          <p className="mt-4 text-gray-600">Loading analytics data...</p>
        </div>
      </div>
    );
  }

  if (!analyticsData) return null;

  const { kpis, paymentStatusChart, bookingStatusChart, revenueChart, roomTypeChart, hotelCategoryChart } = analyticsData;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-500/10 to-orange-500/10"></div>
        <div className="relative z-10">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-3xl font-bold mb-2">Analytics & Reports</h1>
              <p className="text-slate-300">Comprehensive insights into your hotel management performance</p>
            </div>
            
            {/* Print and Export Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={handlePrint}
                className="flex items-center space-x-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
                title="Print Report"
              >
                <Printer className="h-5 w-5" />
                <span className="hidden sm:inline">Print Report</span>
              </button>
              
              <button
                onClick={handleExportCSV}
                className="flex items-center space-x-2 bg-amber-500/20 hover:bg-amber-500/30 backdrop-blur-sm border border-amber-400/30 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
                title="Export to CSV"
              >
                <Download className="h-5 w-5" />
                <span className="hidden sm:inline">Export CSV</span>
              </button>
              
              <button
                onClick={handleExportPDF}
                className="flex items-center space-x-2 bg-blue-500/20 hover:bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 rounded-xl px-4 py-2 transition-all duration-200 hover:scale-105"
                title="Generate PDF Report"
              >
                <FileText className="h-5 w-5" />
                <span className="hidden sm:inline">PDF Report</span>
              </button>
            </div>
          </div>
          
          <div className="flex items-center mt-4 space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-sm text-slate-300">Live Data</span>
            </div>
            <div className="text-sm text-slate-400">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {/* Total Revenue Card */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-blue-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-blue-600/5 group-hover:from-blue-500/10 group-hover:to-blue-600/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <DollarSign className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +12%
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Revenue</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">KSH {kpis.totalRevenue.toLocaleString()}</p>
              <p className="text-xs text-slate-500 mt-1">This month</p>
            </div>
          </div>
        </div>

        {/* Total Bookings Card */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-green-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-green-500/5 to-green-600/5 group-hover:from-green-500/10 group-hover:to-green-600/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Calendar className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +8%
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Bookings</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{kpis.totalBookings}</p>
              <p className="text-xs text-slate-500 mt-1">Active reservations</p>
            </div>
          </div>
        </div>

        {/* Total Hotels Card */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-purple-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-purple-600/5 group-hover:from-purple-500/10 group-hover:to-purple-600/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Building className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-blue-500 text-sm">
                  <Activity className="w-4 h-4 mr-1" />
                  Stable
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Hotels</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{kpis.totalHotels}</p>
              <p className="text-xs text-slate-500 mt-1">Partner properties</p>
            </div>
          </div>
        </div>

        {/* Total Rooms Card */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-orange-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-orange-600/5 group-hover:from-orange-500/10 group-hover:to-orange-600/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <Bed className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +15%
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Total Rooms</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{kpis.totalRooms}</p>
              <p className="text-xs text-slate-500 mt-1">Available inventory</p>
            </div>
          </div>
        </div>

        {/* Average Booking Value Card */}
        <div className="group relative bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-slate-200 hover:border-teal-300 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-teal-500/5 to-teal-600/5 group-hover:from-teal-500/10 group-hover:to-teal-600/10 transition-all duration-300"></div>
          <div className="relative z-10">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div className="text-right">
                <div className="flex items-center text-green-500 text-sm">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  +5%
                </div>
              </div>
            </div>
            <div>
              <p className="text-slate-600 text-sm font-medium">Avg Booking Value</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">KSH {kpis.averageBookingValue.toFixed(0)}</p>
              <p className="text-xs text-slate-500 mt-1">Per reservation</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-xl font-semibold text-slate-800">Revenue & Bookings Trend</h3>
              <p className="text-sm text-slate-500 mt-1">Monthly performance overview</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-xs text-slate-600">Live data</span>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={revenueChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Area 
                type="monotone" 
                dataKey="revenue" 
                fill="url(#colorRevenue)" 
                stroke="#8884d8" 
                fillOpacity={0.6}
                name="Revenue (KSH)"
              />
              <Bar dataKey="bookings" fill="#82ca9d" name="Bookings" />
              <Line type="monotone" dataKey="revenue" stroke="#ff7300" strokeWidth={2} name="Revenue Trend" />
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                  <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
                </linearGradient>
              </defs>
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Payment Status Distribution */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Payment Status Distribution</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={paymentStatusChart}
                cx="50%"
                cy="50%"
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
                label={({name, percentage}) => `${name}: ${percentage}%`}
              >
                {paymentStatusChart.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Booking Status Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Booking Status Overview</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={bookingStatusChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="value" fill="#8884d8" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Room Type Analysis */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Room Types & Average Pricing</h3>
          <ResponsiveContainer width="100%" height={300}>
            <ComposedChart data={roomTypeChart}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d" name="Room Count" />
              <Line type="monotone" dataKey="averagePrice" stroke="#ff7300" strokeWidth={2} name="Avg Price (KSH)" />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Hotel Categories Chart */}
      <div className="bg-white rounded-xl p-6 shadow-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Hotel Categories Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <AreaChart data={hotelCategoryChart}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip content={<CustomTooltip />} />
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke="#8884d8" 
              fill="url(#colorCategory)" 
              fillOpacity={0.6}
            />
            <defs>
              <linearGradient id="colorCategory" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
                <stop offset="95%" stopColor="#8884d8" stopOpacity={0.1}/>
              </linearGradient>
            </defs>
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      <div className="bg-white rounded-xl p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-800 mb-4">Quick Stats</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <Activity className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-blue-600">{payments.length}</p>
            <p className="text-gray-600">Total Payments</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <Users className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-green-600">{rooms.filter(r => r.availability === 'available').length}</p>
            <p className="text-gray-600">Available Rooms</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <Building className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <p className="text-2xl font-bold text-purple-600">{hotels.filter(h => h.rating >= 4).length}</p>
            <p className="text-gray-600">High-Rated Hotels</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageAnalytics;
