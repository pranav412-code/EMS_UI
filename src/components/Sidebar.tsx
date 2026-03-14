import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Activity, BarChart3, FileText, Settings, ShieldCheck, LogOut } from 'lucide-react';
import { useAuth } from '../AuthContext';
import { cn } from '../types';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();

  const navItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Monitoring', path: '/monitoring', icon: Activity },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'Reports', path: '/reports', icon: FileText },
  ];

  if (user?.role === 'admin') {
    navItems.push({ name: 'Admin Panel', path: '/admin', icon: ShieldCheck });
  }

  return (
    <aside className="w-64 h-screen border-r border-border bg-bg flex flex-col sticky top-0">
      <div className="p-8 border-b border-border">
        <h1 className="text-2xl font-serif italic tracking-tight text-accent">Aura</h1>
        <p className="small-caps mt-1">Energy Management</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "flex items-center gap-3 px-4 py-3 text-sm font-sans transition-all duration-200 group",
                isActive 
                  ? "text-fg bg-muted-bg border-l-2 border-accent -ml-[1px]" 
                  : "text-secondary-text hover:text-fg hover:bg-muted-bg/50"
              )
            }
          >
            <item.icon className="w-4 h-4" />
            <span className="tracking-wide">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="p-4 border-t border-border">
        <div className="px-4 py-4 mb-4 bg-muted-bg/50 rounded-lg">
          <p className="small-caps mb-1">Current User</p>
          <p className="text-sm font-medium truncate">{user?.name}</p>
          <p className="text-[10px] text-secondary-text uppercase tracking-wider">{user?.role}</p>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full px-4 py-3 text-sm text-secondary-text hover:text-fg transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
