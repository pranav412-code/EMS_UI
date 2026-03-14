import React from 'react';
import { cn } from '../types';

interface MetricCardProps {
  title: string;
  value: string | number;
  unit?: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  icon?: React.ReactNode;
  className?: string;
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, unit, trend, icon, className }) => {
  return (
    <div className={cn("bg-white border border-border p-6 rounded-xl hover:shadow-sm transition-all duration-300", className)}>
      <div className="flex justify-between items-start mb-4">
        <p className="small-caps">{title}</p>
        {icon && <div className="text-secondary-text opacity-50">{icon}</div>}
      </div>
      
      <div className="flex items-baseline gap-1">
        <h3 className="text-3xl font-serif">{value}</h3>
        {unit && <span className="text-sm text-secondary-text font-sans">{unit}</span>}
      </div>

      {trend && (
        <div className={cn(
          "mt-4 text-[11px] font-mono flex items-center gap-1",
          trend.isPositive ? "text-emerald-600" : "text-rose-600"
        )}>
          <span>{trend.isPositive ? '↑' : '↓'}</span>
          <span>{trend.value}%</span>
          <span className="text-secondary-text ml-1 uppercase tracking-wider">vs last period</span>
        </div>
      )}
    </div>
  );
};

export default MetricCard;
