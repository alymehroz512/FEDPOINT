import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineChartComponent = ({ data }) => (
  <ResponsiveContainer width="100%" height={300}>
    <LineChart data={data}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="_id" />
      <YAxis />
      <Tooltip />
      <Legend />
      <Line type="monotone" dataKey="added" stroke="#8884d8" />
      <Line type="monotone" dataKey="updated" stroke="#82ca9d" />
      <Line type="monotone" dataKey="deleted" stroke="#ff7300" />
      <Line type="monotone" dataKey="total" stroke="#000" />
    </LineChart>
  </ResponsiveContainer>
);

export default LineChartComponent;