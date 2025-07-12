import React, { useMemo } from 'react';
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
  Activity
} from 'lucide-react';
import { paymentApi } from '../../../Features/payment/paymentAPI';
import { bookingApi } from '../../../Features/bookings/bookingAPI';
import { hotelApi } from '../../../Features/hotels/hotelAPI';
import { roomsApi } from '../../../Features/rooms/roomsAPI';

const ManageAnalytics = () => {
  // Fetch data from all APIs
  const { data: payments = [], isLoading: paymentsLoading } = paymentApi.useGetPaymentsQuery();
  const { data: bookings = [], isLoading: bookingsLoading } = bookingApi.useGetBookingsQuery();
  const { data: hotels = [], isLoading: hotelsLoading } = hotelApi.useGetHotelsQuery();
  const { data: rooms = [], isLoading: roomsLoading } = roomsApi.useGetRoomsQuery();

  const isLoading = paymentsLoading || bookingsLoading || hotelsLoading || roomsLoading;

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
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Comprehensive overview of your hotel management system</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm">Total Revenue</p>
              <p className="text-2xl font-bold">KSH {kpis.totalRevenue.toLocaleString()}</p>
            </div>
            <DollarSign className="h-8 w-8 text-blue-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-green-100 text-sm">Total Bookings</p>
              <p className="text-2xl font-bold">{kpis.totalBookings}</p>
            </div>
            <Calendar className="h-8 w-8 text-green-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm">Total Hotels</p>
              <p className="text-2xl font-bold">{kpis.totalHotels}</p>
            </div>
            <Building className="h-8 w-8 text-purple-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-orange-500 to-orange-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-orange-100 text-sm">Total Rooms</p>
              <p className="text-2xl font-bold">{kpis.totalRooms}</p>
            </div>
            <Bed className="h-8 w-8 text-orange-200" />
          </div>
        </div>

        <div className="bg-gradient-to-r from-teal-500 to-teal-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-teal-100 text-sm">Avg Booking Value</p>
              <p className="text-2xl font-bold">KSH {kpis.averageBookingValue.toFixed(0)}</p>
            </div>
            <TrendingUp className="h-8 w-8 text-teal-200" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Revenue Trend Chart */}
        <div className="bg-white rounded-xl p-6 shadow-lg">
          <h3 className="text-xl font-semibold text-gray-800 mb-4">Revenue & Bookings Trend</h3>
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
