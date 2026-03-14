import React from 'react';
import { Search, Bell, User as UserIcon } from 'lucide-react';
import { useAuth } from '../AuthContext';

const TopBar: React.FC = () => {
  const { user } = useAuth();

  return (
    <header className="h-16 border-b border-border bg-bg/80 backdrop-blur-sm flex items-center justify-between px-8 sticky top-0 z-10">
      <div className="flex items-center gap-4 flex-1">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
          <input
            type="text"
            placeholder="Search devices or metrics..."
            className="w-full bg-muted-bg/30 border border-border rounded-full py-2 pl-10 pr-4 text-sm focus:outline-none focus:border-accent/50 transition-colors font-sans"
          />
        </div>
      </div>

      <div className="flex items-center gap-6">
        <button className="relative text-secondary-text hover:text-fg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-2 h-2 bg-accent rounded-full border-2 border-bg"></span>
        </button>
        
        <div className="h-8 w-[1px] bg-border mx-2"></div>

        <div className="flex items-center gap-3">
          <div className="text-right hidden sm:block">
            <p className="text-xs font-medium leading-none">{user?.name}</p>
            <p className="small-caps text-[9px] mt-1">Status: Active</p>
          </div>
          <div className="w-8 h-8 rounded-full bg-muted-bg border border-border flex items-center justify-center text-accent">
            <UserIcon className="w-4 h-4" />
          </div>
        </div>
      </div>
    </header>
  );
};

export default TopBar;
