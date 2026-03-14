import React from 'react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TelemetryData } from '../types';

interface ChartWidgetProps {
  title: string;
  data: TelemetryData[];
  dataKey: keyof TelemetryData;
  color?: string;
  height?: number;
}

const ChartWidget: React.FC<ChartWidgetProps> = ({ title, data, dataKey, color = "#B8860B", height = 300 }) => {
  return (
    <div className="bg-white border border-border p-8 rounded-xl">
      <div className="flex justify-between items-center mb-8">
        <h3 className="text-xl font-serif italic">{title}</h3>
        <div className="flex gap-4">
          <button className="small-caps hover:text-accent transition-colors">24h</button>
          <button className="small-caps text-accent border-b border-accent">7d</button>
          <button className="small-caps hover:text-accent transition-colors">30d</button>
        </div>
      </div>

      <div style={{ width: '100%', height }}>
        <ResponsiveContainer>
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="colorGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={color} stopOpacity={0.1}/>
                <stop offset="95%" stopColor={color} stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DF" />
            <XAxis 
              dataKey="timestamp" 
              hide 
            />
            <YAxis 
              stroke="#6B6B6B" 
              fontSize={10} 
              tickLine={false} 
              axisLine={false}
              tickFormatter={(val) => `${val}`}
            />
            <Tooltip 
              contentStyle={{ 
                backgroundColor: '#FAFAF8', 
                border: '1px solid #E8E4DF',
                borderRadius: '8px',
                fontSize: '12px',
                fontFamily: 'Source Sans 3'
              }}
            />
            <Area 
              type="monotone" 
              dataKey={dataKey} 
              stroke={color} 
              strokeWidth={2}
              fillOpacity={1} 
              fill="url(#colorGradient)" 
              animationDuration={1000}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default ChartWidget;
