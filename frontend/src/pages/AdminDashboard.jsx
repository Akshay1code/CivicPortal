import React from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line
} from 'recharts';
import { FaHourglassHalf, FaCheckCircle } from 'react-icons/fa';
import AdminSidebar from '../components/AdminSidebar';

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    fontFamily: "'Inter', sans-serif",
    backgroundColor: '#ffffff',
    color: '#333'
  },
  mainContent: {
    marginLeft: '260px',
    flex: 1,
    padding: '32px',
    backgroundColor: '#fdfdfd',
    minHeight: '100vh'
  },
  headerBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px'
  },
  pageTitle: {
    fontSize: '28px',
    fontWeight: 'bold',
    margin: 0
  },
  statsContainer: {
    display: 'flex',
    gap: '24px',
    marginBottom: '32px'
  },
  statCard: {
    flex: 1,
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '24px',
    display: 'flex',
    alignItems: 'center',
    gap: '16px'
  },
  statCardPending: {
    borderLeft: '4px solid #f5a623'
  },
  statCardApproved: {
    borderLeft: '4px solid #27ae60'
  },
  statNumber: {
    fontSize: '32px',
    fontWeight: 'bold',
    margin: 0
  },
  statLabel: {
    color: '#666',
    fontSize: '14px',
    margin: 0
  },
  chartsGrid: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '24px',
    marginBottom: '24px'
  },
  chartContainer: {
    backgroundColor: '#ffffff',
    borderRadius: '12px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
    padding: '24px',
    minHeight: '300px'
  },
  chartTitle: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginBottom: '20px',
    color: '#333'
  }
};

export default function AdminDashboard() {
  const pendingCount = 35; // Dummy data
  const approvedCount = 20; // Dummy data

  const barData = [
    { name: 'Electricity', count: 45 },
    { name: 'Road', count: 30 },
    { name: 'Environment', count: 25 },
    { name: 'Water', count: 35 },
    { name: 'Other', count: 10 },
  ];

  const pieData = [
    { name: 'Pending Review', value: 35 },
    { name: 'Approved', value: 20 },
    { name: 'In Progress', value: 25 },
    { name: 'Completed', value: 15 },
    { name: 'Rejected', value: 5 },
  ];

  const lineData = [
    { name: 'Week 1', complaints: 65 },
    { name: 'Week 2', complaints: 59 },
    { name: 'Week 3', complaints: 80 },
    { name: 'Week 4', complaints: 45 },
  ];

  const pieColors = ['#f5a623', '#27ae60', '#2980b9', '#7f8c8d', '#e74c3c'];

  return (
    <div style={styles.container}>
      <AdminSidebar />
      <div style={styles.mainContent}>
        <div style={styles.headerBar}>
          <h1 style={styles.pageTitle}>Dashboard & Analysis</h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: '#1a6b5a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>A</div>
          </div>
        </div>

        <div style={styles.statsContainer}>
          <div style={{...styles.statCard, ...styles.statCardPending}}>
            <div style={{ fontSize: '40px', color: '#f5a623', display: 'flex' }}><FaHourglassHalf /></div>
            <div>
              <h3 style={styles.statNumber}>{pendingCount}</h3>
              <p style={styles.statLabel}>Pending Complaints</p>
            </div>
          </div>
          <div style={{...styles.statCard, ...styles.statCardApproved}}>
            <div style={{ fontSize: '40px', color: '#27ae60', display: 'flex' }}><FaCheckCircle /></div>
            <div>
              <h3 style={styles.statNumber}>{approvedCount}</h3>
              <p style={styles.statLabel}>Approved Complaints</p>
            </div>
          </div>
        </div>

        <div style={styles.chartsGrid}>
          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Complaints by Category</h3>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
                <RechartsTooltip cursor={{fill: '#f5f5f5'}} contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
                <Bar dataKey="count" fill="#1a6b5a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div style={styles.chartContainer}>
            <h3 style={styles.chartTitle}>Status Breakdown</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
                <Legend iconType="circle" wrapperStyle={{fontSize: '12px'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div style={styles.chartContainer}>
          <h3 style={styles.chartTitle}>Complaints Over Time</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={lineData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#eee" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#666'}} />
              <RechartsTooltip contentStyle={{borderRadius: '8px', border: 'none', boxShadow: '0 2px 8px rgba(0,0,0,0.1)'}} />
              <Line type="monotone" dataKey="complaints" stroke="#1a6b5a" strokeWidth={3} dot={{r: 4, fill: '#1a6b5a', strokeWidth: 2, stroke: '#fff'}} activeDot={{r: 6}} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}