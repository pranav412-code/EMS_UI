import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Device {
  id: string;
  name: string;
  type: 'Sensor' | 'Meter' | 'Inverter' | 'Battery';
  status: 'online' | 'offline' | 'warning';
  location: string;
  currentPower: number; // kW
  voltage: number; // V
  current: number; // A
  assignedTo?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  avatar?: string;
}

export interface TelemetryData {
  timestamp: string;
  power: number;
  voltage: number;
  current: number;
}
