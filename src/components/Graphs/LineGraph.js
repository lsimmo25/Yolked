import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const LineGraph = ({ data }) => {
  const minWeight = Math.min(...data.map(item => item.weight)) - 5;
  const maxWeight = Math.max(...data.map(item => item.weight)) + 5;

  const reversedData = [...data].reverse();

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={reversedData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="date" />
        <YAxis domain={[minWeight, maxWeight]} />
        <Tooltip />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="weight" 
          stroke="#FFA500" 
          strokeWidth={3}
          activeDot={{ r: 8 }} 
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default LineGraph;
