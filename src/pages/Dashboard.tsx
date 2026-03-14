import React, { useState, useEffect } from 'react';
import { Zap, Activity, Battery, AlertTriangle } from 'lucide-react';
import MetricCard from '../components/MetricCard';
import ChartWidget from '../components/ChartWidget';
import { TelemetryData } from '../types';

const Dashboard: React.FC = () => {
  const [telemetry, setTelemetry] = useState<TelemetryData[]>([]);
  const [overview, setOverview] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [telRes, overRes] = await Promise.all([
          fetch('/api/telemetry/main-meter'),
          fetch('/api/overview')
        ]);
        setTelemetry(await telRes.json());
        setOverview(await overRes.json());
      } catch (err) {
        console.error('Failed to fetch dashboard data', err);
      }
    };

    fetchData();
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif">System Overview</h2>
          <p className="text-secondary-text mt-2 font-sans max-w-lg">
            Real-time performance metrics across your connected energy infrastructure. 
            Last updated {overview?.lastUpdate ? new Date(overview.lastUpdate).toLocaleTimeString() : '...'}
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-6 py-2 border border-border rounded-full text-sm hover:bg-muted-bg transition-colors">
            Export PDF
          </button>
          <button className="px-6 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard 
          title="Total Consumption" 
          value={overview?.totalConsumption || '0'} 
          unit="kWh" 
          trend={{ value: 12.5, isPositive: false }}
          icon={<Zap className="w-4 h-4" />}
        />
        <MetricCard 
          title="Active Devices" 
          value={overview?.activeDevices || '0'} 
          unit="Units" 
          icon={<Activity className="w-4 h-4" />}
        />
        <MetricCard 
          title="Battery Storage" 
          value="84" 
          unit="%" 
          trend={{ value: 2.1, isPositive: true }}
          icon={<Battery className="w-4 h-4" />}
        />
        <MetricCard 
          title="System Health" 
          value={overview?.systemHealth || 'Optimal'} 
          className="border-l-4 border-l-emerald-500"
          icon={<AlertTriangle className="w-4 h-4" />}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <ChartWidget 
            title="Energy Consumption Trend" 
            data={telemetry} 
            dataKey="power" 
          />
        </div>
        <div className="bg-white border border-border rounded-xl p-8">
          <h3 className="text-xl font-serif italic mb-6">Device Status</h3>
          <div className="space-y-6">
            {[
              { name: 'Main Inverter', status: 'Optimal', power: '4.2 kW' },
              { name: 'Tesla Powerwall', status: 'Charging', power: '2.1 kW' },
              { name: 'HVAC System', status: 'Standby', power: '0.1 kW' },
              { name: 'EV Charger', status: 'Offline', power: '0.0 kW' },
            ].map((device, i) => (
              <div key={i} className="flex justify-between items-center pb-4 border-b border-border last:border-0 last:pb-0">
                <div>
                  <p className="text-sm font-medium">{device.name}</p>
                  <p className="small-caps text-[9px] mt-0.5">{device.status}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-mono">{device.power}</p>
                </div>
              </div>
            ))}
          </div>
          <button className="w-full mt-8 py-3 border border-border rounded-lg text-xs small-caps hover:bg-muted-bg transition-colors">
            View All Devices
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
