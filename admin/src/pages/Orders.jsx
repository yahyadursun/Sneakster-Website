import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { backendUrl, currency } from '../App';
import { toast } from 'react-toastify';
import { assets } from '../assets/assets';
import _ from 'lodash';
import { Search, Calendar, Filter } from 'lucide-react';

const Orders = ({ token }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [analytics, setAnalytics] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    averageOrderValue: 0,
    pendingOrders: 0,
    deliveredOrders: 0,
    recentTrend: 0
  });

  // Filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [dateRange, setDateRange] = useState({
    startDate: '',
    endDate: ''
  });

  const fetchAllOrders = async () => {
    if (!token) return null;

    try {
      const response = await axios.post(
        backendUrl + '/api/order/list',
        {},
        { headers: { token } }
      );
      
      if (response.data.success) {
        const ordersData = response.data.orders;
        setOrders(ordersData);
        setFilteredOrders(ordersData);
        processAnalytics(ordersData);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const applyFilters = () => {
    let result = [...orders];

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(order => 
        order.address.firstName.toLowerCase().includes(query) ||
        order.address.lastName.toLowerCase().includes(query) ||
        order.items.some(item => item.name.toLowerCase().includes(query))
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      result = result.filter(order => order.status === statusFilter);
    }

    // Payment filter
    if (paymentFilter !== 'all') {
      result = result.filter(order => 
        paymentFilter === 'paid' ? order.payment : !order.payment
      );
    }

    // Date range filter
    if (dateRange.startDate && dateRange.endDate) {
      const start = new Date(dateRange.startDate);
      const end = new Date(dateRange.endDate);
      result = result.filter(order => {
        const orderDate = new Date(order.date);
        return orderDate >= start && orderDate <= end;
      });
    }

    setFilteredOrders(result);
    processAnalytics(result);
  };

  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setPaymentFilter('all');
    setDateRange({ startDate: '', endDate: '' });
    setFilteredOrders(orders);
    processAnalytics(orders);
  };

  const processAnalytics = (ordersData) => {
    // Calculate basic metrics
    const totalOrders = ordersData.length;
    const totalRevenue = _.sumBy(ordersData, 'amount');
    const averageOrderValue = totalRevenue / totalOrders;
    const pendingOrders = ordersData.filter(order => order.status !== 'Teslim Edildi').length;
    const deliveredOrders = ordersData.filter(order => order.status === 'Teslim Edildi').length;

    // Calculate trend (compare last 30 days with previous 30 days)
    const today = new Date();
    const thirtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    const sixtyDaysAgo = new Date(today.setDate(today.getDate() - 30));
    
    const recentOrders = ordersData.filter(order => new Date(order.date) >= thirtyDaysAgo);
    const previousOrders = ordersData.filter(order => 
      new Date(order.date) >= sixtyDaysAgo && new Date(order.date) < thirtyDaysAgo
    );

    

    setAnalytics({
      totalOrders,
      totalRevenue,
      averageOrderValue,
      pendingOrders,
      deliveredOrders,
      
    });
  };

  const statusHandler = async (event, orderId) => {
    try {
      const response = await axios.post(
        backendUrl + '/api/order/status',
        { orderId, status: event.target.value },
        { headers: { token } }
      );
      if (response.data.success) {
        await fetchAllOrders();
      }
    } catch (error) {
      console.log(error);
      toast.error(error.data.message);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, [token]);

  useEffect(() => {
    applyFilters();
  }, [searchQuery, statusFilter, paymentFilter, dateRange]);

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">Orders Dashboard</h2>
      
      {/* Filters Section */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-3 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search by customer or item..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Statuses</option>
            <option value="Sipariş Verildi">Sipariş Verildi</option>
            <option value="Paketlemede">Paketlemede</option>
            <option value="Kargoya Verildi">Kargoya Verildi</option>
            <option value="Teslimat için yolda">Teslimat için yolda</option>
            <option value="Teslim Edildi">Teslim Edildi</option>
          </select>

          {/* Payment Filter */}
          <select
            value={paymentFilter}
            onChange={(e) => setPaymentFilter(e.target.value)}
            className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Payments</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
          </select>

          {/* Date Range Filter */}
          <div className="grid grid-cols-2 gap-2">
            <input
              type="date"
              value={dateRange.startDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="date"
              value={dateRange.endDate}
              onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
              className="w-full p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        {/* Reset Filters Button */}
        <button
          onClick={resetFilters}
          className="mt-4 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Reset Filters
        </button>
      </div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Orders</h3>
          <p className="text-2xl font-bold">{analytics.totalOrders}</p>
        
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Total Revenue</h3>
          <p className="text-2xl font-bold">{currency}{analytics.totalRevenue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Average Order Value</h3>
          <p className="text-2xl font-bold">{currency}{analytics.averageOrderValue.toFixed(2)}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Pending Orders</h3>
          <p className="text-2xl font-bold">{analytics.pendingOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-yellow-400 h-2.5 rounded-full" 
                 style={{ width: `${(analytics.pendingOrders / analytics.totalOrders * 100) || 0}%` }}></div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-gray-500 text-sm">Delivered Orders</h3>
          <p className="text-2xl font-bold">{analytics.deliveredOrders}</p>
          <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
            <div className="bg-green-400 h-2.5 rounded-full" 
                 style={{ width: `${(analytics.deliveredOrders / analytics.totalOrders * 100) || 0}%` }}></div>
          </div>
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold p-4 border-b">
          Order List ({filteredOrders.length} orders)
        </h3>
        <div className="p-4">
          {filteredOrders.map((order, index) => (
            <div className="grid grid-cols-1 sm:grid-cols-[0.5fr_2fr_1fr] lg:grid-cols-[0.5fr_2fr_1fr_1fr_1fr] gap-3 items-start border-2 border-gray-200 p-5 md:p-8 my-3 md:my-4 text-xs sm:text-sm text-gray-700" key={index}>
              <img className="w-12" src={assets.parcel_icon} alt="" />
              <div>
                <div>
                  {order.items.map((item, index) => (
                    <p className="py-0.5" key={index}>
                      {item.name} x {item.quantity} <span>{item.size}</span>
                      {index !== order.items.length - 1 && ','}
                    </p>
                  ))}
                </div>
                <p className="mt-3 mb-2 font-medium">
                  {order.address.firstName + ' ' + order.address.lastName}
                </p>
                <div>
                  <p>{order.address.street + ','}</p>
                  <p>
                    {order.address.city +
                      ', ' +
                      order.address.state +
                      ', ' +
                      order.address.country +
                      ', ' +
                      order.address.zipcode}
                  </p>
                </div>
                <p>{order.address.phone}</p>
              </div>
              <div>
                <p className="text-sm sm:text-[15px]">Items: {order.items.length}</p>
                <p className="mt-3">Method: {order.paymentMethod}</p>
                <p>Payment: {order.payment ? 'Done' : 'Pending'}</p>
                <p>Date: {new Date(order.date).toLocaleDateString()}</p>
              </div>
              <p className="text-sm sm:text-[15px]">{currency}{order.amount}</p>
              <select
                onChange={(event) => statusHandler(event, order._id)}
                value={order.status}
                className="p-2 font-semibold rounded border border-gray-300"
              >
                <option value="Sipariş Verildi">Sipariş Verildi</option>
                <option value="Paketlemede">Paketlemede</option>
                <option value="Kargoya Verildi">Kargoya Verildi</option>
                <option value="Teslimat için yolda">Teslimat için yolda</option>
                <option value="Teslim Edildi">Teslim Edildi</option>
              </select>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Orders;