import React, { useState, useEffect } from 'react';
import { Activity, Battery, Zap, Thermometer, ShieldCheck, MoreVertical, Wifi, WifiOff } from 'lucide-react';
import { cn } from '../types';

interface DeviceData {
  id: string;
  name: string;
  type: string;
  status: 'online' | 'offline' | 'warning';
  power: number;
  voltage: number;
  temp: number;
}

const Monitoring: React.FC = () => {
  const [devices, setDevices] = useState<DeviceData[]>([]);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine WebSocket URL based on current location
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}`;
    
    let socket: WebSocket | null = null;
    let reconnectTimeout: NodeJS.Timeout;

    const connect = () => {
      try {
        socket = new WebSocket(wsUrl);

        socket.onopen = () => {
          console.log('Connected to Aura Telemetry Stream');
          setIsConnected(true);
        };

        socket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.type === 'INITIAL_STATE' || data.type === 'DEVICE_UPDATE') {
              setDevices(data.devices);
            }
          } catch (e) {
            console.error('Error parsing WebSocket message:', e);
          }
        };

        socket.onclose = () => {
          console.log('Disconnected from Aura Telemetry Stream');
          setIsConnected(false);
          // Attempt to reconnect after 3 seconds
          reconnectTimeout = setTimeout(connect, 3000);
        };

        socket.onerror = (err) => {
          console.error('WebSocket Error:', err);
          socket?.close();
        };
      } catch (e) {
        console.error('Connection error:', e);
        reconnectTimeout = setTimeout(connect, 3000);
      }
    };

    connect();

    return () => {
      if (socket) {
        socket.close();
      }
      clearTimeout(reconnectTimeout);
    };
  }, []);

  return (
    <div className="space-y-8 animate-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <h2 className="text-4xl font-serif">Device Monitoring</h2>
            <div className={cn(
              "flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[9px] font-mono uppercase tracking-tighter border transition-colors duration-500",
              isConnected ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"
            )}>
              {isConnected ? <Wifi className="w-2.5 h-2.5" /> : <WifiOff className="w-2.5 h-2.5" />}
              {isConnected ? 'Live Stream Active' : 'Stream Disconnected'}
            </div>
          </div>
          <p className="text-secondary-text font-sans">
            Real-time telemetry and status indicators for all registered IoT nodes.
          </p>
        </div>
        <div className="flex gap-4">
          <div className="flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
            {devices.filter(d => d.status === 'online').length} Online
          </div>
          <div className="flex items-center gap-2 px-4 py-2 bg-rose-50 text-rose-700 rounded-full text-xs font-medium">
            <span className="w-2 h-2 bg-rose-500 rounded-full"></span>
            {devices.filter(d => d.status === 'offline').length} Offline
          </div>
        </div>
      </div>

      <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-muted-bg/30 border-b border-border">
              <th className="px-8 py-4 small-caps">Device Name</th>
              <th className="px-8 py-4 small-caps">Type</th>
              <th className="px-8 py-4 small-caps">Status</th>
              <th className="px-8 py-4 small-caps">Power (kW)</th>
              <th className="px-8 py-4 small-caps">Voltage (V)</th>
              <th className="px-8 py-4 small-caps">Temp</th>
              <th className="px-8 py-4 small-caps text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {devices.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-8 py-12 text-center text-secondary-text font-serif italic">
                  Initializing telemetry stream...
                </td>
              </tr>
            ) : (
              devices.map((device) => (
                <tr key={device.id} className="border-b border-border last:border-0 hover:bg-muted-bg/10 transition-colors group">
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-muted-bg flex items-center justify-center text-secondary-text group-hover:text-accent transition-colors">
                        {device.type === 'Inverter' && <Zap className="w-4 h-4" />}
                        {device.type === 'Battery' && <Battery className="w-4 h-4" />}
                        {device.type === 'Sensor' && <Activity className="w-4 h-4" />}
                        {device.type === 'Meter' && <ShieldCheck className="w-4 h-4" />}
                      </div>
                      <span className="font-medium text-sm">{device.name}</span>
                    </div>
                  </td>
                  <td className="px-8 py-6 text-sm text-secondary-text">{device.type}</td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "w-2 h-2 rounded-full transition-all duration-500",
                        device.status === 'online' ? "bg-emerald-500 animate-pulse" :
                        device.status === 'offline' ? "bg-rose-500" :
                        "bg-amber-500"
                      )}></span>
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold transition-colors duration-500",
                        device.status === 'online' ? "bg-emerald-50 text-emerald-700" :
                        device.status === 'offline' ? "bg-rose-50 text-rose-700" :
                        "bg-amber-50 text-amber-700"
                      )}>
                        {device.status}
                      </span>
                    </div>
                  </td>
                  <td className="px-8 py-6 font-mono text-sm tabular-nums">
                    {device.power.toFixed(2)}
                  </td>
                  <td className="px-8 py-6 font-mono text-sm tabular-nums">
                    {device.voltage}
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center gap-1 text-sm text-secondary-text tabular-nums">
                      <Thermometer className="w-3 h-3" />
                      {device.temp.toFixed(1)}°C
                    </div>
                  </td>
                  <td className="px-8 py-6 text-right">
                    <button className="p-2 hover:bg-muted-bg rounded-lg transition-colors text-secondary-text">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Monitoring;
