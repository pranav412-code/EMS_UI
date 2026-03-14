import React, { useState, useEffect } from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line } from 'recharts';
import { TelemetryData } from '../types';

const Analytics: React.FC = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    // Generate mock historical data
    const mockData = Array.from({ length: 12 }).map((_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      solar: 400 + Math.random() * 200,
      grid: 300 + Math.random() * 100,
      efficiency: 85 + Math.random() * 10,
    }));
    setData(mockData);
  }, []);

  return (
    <div className="space-y-12 animate-in fade-in slide-in-from-top-4 duration-1000">
      <div className="border-b border-border pb-8">
        <h2 className="text-5xl font-serif">Historical Analytics</h2>
        <p className="text-secondary-text mt-4 font-sans max-w-2xl text-lg leading-relaxed">
          Deep-dive into your energy consumption patterns and generation efficiency. 
          Our analytical engine identifies trends and anomalies across your entire device network.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <div className="space-y-6">
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-serif italic">Generation vs Consumption</h3>
            <span className="small-caps">Yearly Overview</span>
          </div>
          <div className="h-[400px] w-full bg-white border border-border p-6 rounded-xl">
            <ResponsiveContainer>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DF" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} />
                <Tooltip 
                  cursor={{ fill: '#F5F3F0' }}
                  contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DF' }}
                />
                <Legend verticalAlign="top" align="right" iconType="circle" wrapperStyle={{ paddingBottom: '20px' }} />
                <Bar dataKey="solar" name="Solar Generation" fill="#B8860B" radius={[4, 4, 0, 0]} />
                <Bar dataKey="grid" name="Grid Consumption" fill="#1A1A1A" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex justify-between items-baseline">
            <h3 className="text-2xl font-serif italic">System Efficiency</h3>
            <span className="small-caps">Performance Index</span>
          </div>
          <div className="h-[400px] w-full bg-white border border-border p-6 rounded-xl">
            <ResponsiveContainer>
              <LineChart data={data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E8E4DF" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} fontSize={12} />
                <YAxis axisLine={false} tickLine={false} fontSize={12} domain={[70, 100]} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #E8E4DF' }} />
                <Line 
                  type="monotone" 
                  dataKey="efficiency" 
                  name="Efficiency %" 
                  stroke="#B8860B" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#B8860B' }}
                  activeDot={{ r: 6, strokeWidth: 0 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="bg-muted-bg/30 border border-border rounded-2xl p-12">
        <div className="max-w-3xl">
          <h3 className="text-3xl font-serif mb-6">Analytical Insights</h3>
          <div className="space-y-8">
            <div className="flex gap-6">
              <div className="text-accent font-serif text-4xl italic opacity-50">01</div>
              <div>
                <h4 className="text-lg font-medium mb-2">Peak Generation Window</h4>
                <p className="text-secondary-text leading-relaxed">
                  Your solar arrays reached maximum efficiency between 11:30 AM and 2:15 PM during the last quarter. 
                  Consider shifting heavy loads like HVAC or EV charging to this window to maximize self-consumption.
                </p>
              </div>
            </div>
            <div className="flex gap-6">
              <div className="text-accent font-serif text-4xl italic opacity-50">02</div>
              <div>
                <h4 className="text-lg font-medium mb-2">Grid Dependency Reduction</h4>
                <p className="text-secondary-text leading-relaxed">
                  Grid reliance has decreased by 18% compared to the same period last year, primarily due to 
                  optimized battery discharge cycles during evening peak hours.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;
