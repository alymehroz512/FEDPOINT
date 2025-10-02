import { useState, useEffect } from 'react';
import SummaryCard from '../components/ui/SummaryCard';
import LineChartComponent from '../components/ui/LineChart';
import { getStats, getTrends } from '../services/analyticsApi';

const Dashboard = () => {
  const [stats, setStats] = useState({});
  const [trends, setTrends] = useState([]);
  const [type, setType] = useState('monthly');
  const [year, setYear] = useState(2025);

  useEffect(() => {
    fetchStats();
    fetchTrends();
  }, [type, year]);

  const fetchStats = async () => {
    try {
      const data = await getStats();
      setStats(data);
    } catch (error) {
      console.error('Stats error:', error);
    }
  };

  const fetchTrends = async () => {
    try {
      const data = await getTrends({ year, type });
      setTrends(data.trends || []);
    } catch (error) {
      console.error('Trends error:', error);
    }
  };

  const recentActivity = [
    { id: 1, action: 'Added Dell Inspiron', time: '2 min ago' },
    { id: 2, action: 'Updated Samsung S24', time: '5 min ago' },
    { id: 3, action: 'Deleted old product', time: '10 min ago' },
    { id: 4, action: 'Added category', time: '1 hour ago' },
    { id: 5, action: 'Updated brand', time: '2 hours ago' }
  ];

  return (
    <div>
      <h1>Dashboard</h1>
      <div className="row mb-4">
        <div className="col-md-3"><SummaryCard title="Total Products" value={stats.total || 0} variant="primary" /></div>
        <div className="col-md-3"><SummaryCard title="Added (Month)" value={stats.currentMonth?.added || 0} variant="success" /></div>
        <div className="col-md-3"><SummaryCard title="Updated (Month)" value={stats.currentMonth?.updated || 0} variant="info" /></div>
        <div className="col-md-3"><SummaryCard title="Deleted (Month)" value={stats.currentMonth?.deleted || 0} variant="danger" /></div>
      </div>
      <div className="row mb-4">
        <div className="col-12">
          <div className="d-flex justify-content-between mb-2">
            <h5>Product Trends</h5>
            <select className="form-select w-auto" value={type} onChange={(e) => setType(e.target.value)}>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
            <input type="number" className="form-control w-auto" value={year} onChange={(e) => setYear(e.target.value)} min="2020" max="2030" />
          </div>
          <LineChartComponent data={trends} />
        </div>
      </div>
      <div className="row">
        <div className="col-12">
          <h5>Recent Activity</h5>
          <ul className="list-group">
            {recentActivity.map((activity) => (
              <li key={activity.id} className="list-group-item d-flex justify-content-between">
                <span>{activity.action}</span>
                <small>{activity.time}</small>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;