import React, { useState, useEffect } from 'react';
import { User, Device, cn } from '../types';
import { Plus, Edit2, Trash2, UserPlus, Monitor, Shield, Mail, Tag, MapPin, X, Search, Check, ChevronDown } from 'lucide-react';

const AdminPanel: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'devices'>('users');
  const [users, setUsers] = useState<User[]>([]);
  const [devices, setDevices] = useState<Device[]>([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeviceModalOpen, setIsDeviceModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [editingDevice, setEditingDevice] = useState<Device | null>(null);

  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  const [userForm, setUserForm] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user' });
  const [deviceForm, setDeviceForm] = useState({ name: '', type: 'Sensor' as Device['type'], location: '', assignedTo: '' });

  useEffect(() => {
    fetchUsers();
    fetchDevices();
  }, []);

  const fetchUsers = async () => {
    const res = await fetch('/api/users');
    setUsers(await res.json());
  };

  const fetchDevices = async () => {
    const res = await fetch('/api/devices');
    setDevices(await res.json());
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingUser ? 'PUT' : 'POST';
    const url = editingUser ? `/api/users/${editingUser.id}` : '/api/users';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userForm),
    });
    
    setIsUserModalOpen(false);
    setEditingUser(null);
    setUserForm({ name: '', email: '', role: 'user' });
    fetchUsers();
  };

  const handleDeviceSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editingDevice ? 'PUT' : 'POST';
    const url = editingDevice ? `/api/devices/${editingDevice.id}` : '/api/devices';
    
    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(deviceForm),
    });
    
    setIsDeviceModalOpen(false);
    setEditingDevice(null);
    setDeviceForm({ name: '', type: 'Sensor', location: '', assignedTo: '' });
    fetchDevices();
  };

  const deleteUser = async (id: string) => {
    if (confirm('Are you sure you want to delete this user?')) {
      await fetch(`/api/users/${id}`, { method: 'DELETE' });
      fetchUsers();
    }
  };

  const deleteDevice = async (id: string) => {
    if (confirm('Are you sure you want to delete this device?')) {
      await fetch(`/api/devices/${id}`, { method: 'DELETE' });
      fetchDevices();
    }
  };

  const openUserModal = (user?: User) => {
    if (user) {
      setEditingUser(user);
      setUserForm({ name: user.name, email: user.email, role: user.role });
    } else {
      setEditingUser(null);
      setUserForm({ name: '', email: '', role: 'user' });
    }
    setIsUserModalOpen(true);
  };

  const openDeviceModal = (device?: Device) => {
    if (device) {
      setEditingDevice(device);
      setDeviceForm({ name: device.name, type: device.type, location: device.location, assignedTo: device.assignedTo || '' });
    } else {
      setEditingDevice(null);
      setDeviceForm({ name: '', type: 'Sensor', location: '', assignedTo: '' });
    }
    setIsDeviceModalOpen(true);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-4xl font-serif">Admin Control Panel</h2>
          <p className="text-secondary-text mt-2 font-sans">
            Manage your system users and energy monitoring devices.
          </p>
        </div>
        <div className="flex bg-muted-bg p-1 rounded-full">
          <button
            onClick={() => setActiveTab('users')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === 'users' ? "bg-white shadow-sm text-fg" : "text-secondary-text hover:text-fg"
            )}
          >
            Users
          </button>
          <button
            onClick={() => setActiveTab('devices')}
            className={cn(
              "px-6 py-2 rounded-full text-sm font-medium transition-all",
              activeTab === 'devices' ? "bg-white shadow-sm text-fg" : "text-secondary-text hover:text-fg"
            )}
          >
            Devices
          </button>
        </div>
      </div>

      {activeTab === 'users' ? (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif italic">User Management</h3>
            <button
              onClick={() => openUserModal()}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              <UserPlus className="w-4 h-4" />
              Add User
            </button>
          </div>

          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted-bg/30 border-b border-border">
                  <th className="px-8 py-4 small-caps">User</th>
                  <th className="px-8 py-4 small-caps">Email</th>
                  <th className="px-8 py-4 small-caps">Role</th>
                  <th className="px-8 py-4 small-caps text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id} className="border-b border-border last:border-0 hover:bg-muted-bg/5 transition-colors">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-muted-bg flex items-center justify-center text-accent">
                          <Shield className="w-4 h-4" />
                        </div>
                        <span className="font-medium text-sm">{user.name}</span>
                      </div>
                    </td>
                    <td className="px-8 py-6 text-sm text-secondary-text">{user.email}</td>
                    <td className="px-8 py-6">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[10px] uppercase tracking-wider font-bold",
                        user.role === 'admin' ? "bg-accent/10 text-accent" : "bg-muted-bg text-secondary-text"
                      )}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openUserModal(user)} className="p-2 hover:bg-muted-bg rounded-lg text-secondary-text hover:text-fg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteUser(user.id)} className="p-2 hover:bg-rose-50 rounded-lg text-secondary-text hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-2xl font-serif italic">Device Provisioning</h3>
            <button
              onClick={() => openDeviceModal()}
              className="flex items-center gap-2 px-6 py-2 bg-accent text-white rounded-full text-sm hover:opacity-90 transition-opacity"
            >
              <Monitor className="w-4 h-4" />
              Add Device
            </button>
          </div>

          <div className="bg-white border border-border rounded-xl overflow-hidden shadow-sm">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-muted-bg/30 border-b border-border">
                  <th className="px-8 py-4 small-caps">Device</th>
                  <th className="px-8 py-4 small-caps">Type</th>
                  <th className="px-8 py-4 small-caps">Location</th>
                  <th className="px-8 py-4 small-caps">Assigned To</th>
                  <th className="px-8 py-4 small-caps text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {devices.map((device) => (
                  <tr key={device.id} className="border-b border-border last:border-0 hover:bg-muted-bg/5 transition-colors">
                    <td className="px-8 py-6 font-medium text-sm">{device.name}</td>
                    <td className="px-8 py-6 text-sm text-secondary-text">{device.type}</td>
                    <td className="px-8 py-6 text-sm text-secondary-text">{device.location || 'N/A'}</td>
                    <td className="px-8 py-6 text-sm text-secondary-text">
                      {users.find(u => u.id === device.assignedTo)?.name || 'Unassigned'}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex justify-end gap-2">
                        <button onClick={() => openDeviceModal(device)} className="p-2 hover:bg-muted-bg rounded-lg text-secondary-text hover:text-fg transition-colors">
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => deleteDevice(device.id)} className="p-2 hover:bg-rose-50 rounded-lg text-secondary-text hover:text-rose-600 transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* User Modal */}
      {isUserModalOpen && (
        <div className="fixed inset-0 bg-fg/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-border rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex justify-between items-center">
              <h3 className="text-2xl font-serif italic">{editingUser ? 'Edit User' : 'Add New User'}</h3>
              <button onClick={() => setIsUserModalOpen(false)} className="text-secondary-text hover:text-fg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleUserSubmit} className="p-8 space-y-6">
              <div>
                <label className="small-caps mb-2 block">Full Name</label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    required
                    type="text"
                    value={userForm.name}
                    onChange={(e) => setUserForm({ ...userForm, name: e.target.value })}
                    className="w-full bg-muted-bg/30 border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Jane Smith"
                  />
                </div>
              </div>
              <div>
                <label className="small-caps mb-2 block">Email Address</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    required
                    type="email"
                    value={userForm.email}
                    onChange={(e) => setUserForm({ ...userForm, email: e.target.value })}
                    className="w-full bg-muted-bg/30 border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="jane@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="small-caps mb-2 block">System Role</label>
                <select
                  value={userForm.role}
                  onChange={(e) => setUserForm({ ...userForm, role: e.target.value as 'admin' | 'user' })}
                  className="w-full bg-muted-bg/30 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="user">Normal User</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {editingUser ? 'Update User' : 'Create User Account'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Device Modal */}
      {isDeviceModalOpen && (
        <div className="fixed inset-0 bg-fg/20 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white border border-border rounded-2xl w-full max-w-md shadow-xl animate-in zoom-in-95 duration-200">
            <div className="p-8 border-b border-border flex justify-between items-center">
              <h3 className="text-2xl font-serif italic">{editingDevice ? 'Edit Device' : 'Provision Device'}</h3>
              <button onClick={() => setIsDeviceModalOpen(false)} className="text-secondary-text hover:text-fg">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleDeviceSubmit} className="p-8 space-y-6">
              <div>
                <label className="small-caps mb-2 block">Device Name</label>
                <div className="relative">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    required
                    type="text"
                    value={deviceForm.name}
                    onChange={(e) => setDeviceForm({ ...deviceForm, name: e.target.value })}
                    className="w-full bg-muted-bg/30 border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Main Inverter"
                  />
                </div>
              </div>
              <div>
                <label className="small-caps mb-2 block">Device Type</label>
                <select
                  value={deviceForm.type}
                  onChange={(e) => setDeviceForm({ ...deviceForm, type: e.target.value as Device['type'] })}
                  className="w-full bg-muted-bg/30 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors appearance-none"
                >
                  <option value="Sensor">Sensor</option>
                  <option value="Meter">Meter</option>
                  <option value="Inverter">Inverter</option>
                  <option value="Battery">Battery</option>
                </select>
              </div>
              <div>
                <label className="small-caps mb-2 block">Installation Location</label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-secondary-text" />
                  <input
                    type="text"
                    value={deviceForm.location}
                    onChange={(e) => setDeviceForm({ ...deviceForm, location: e.target.value })}
                    className="w-full bg-muted-bg/30 border border-border rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-accent transition-colors"
                    placeholder="Basement / Roof"
                  />
                </div>
              </div>
              <div>
                <label className="small-caps mb-2 block">Assign to User</label>
                <div className="relative">
                  <button
                    type="button"
                    onClick={() => setIsUserDropdownOpen(!isUserDropdownOpen)}
                    className="w-full bg-muted-bg/30 border border-border rounded-lg px-4 py-3 flex items-center justify-between text-sm focus:outline-none focus:border-accent transition-colors"
                  >
                    <span className={!deviceForm.assignedTo ? "text-secondary-text" : ""}>
                      {deviceForm.assignedTo 
                        ? users.find(u => u.id === deviceForm.assignedTo)?.name 
                        : 'Select a user...'}
                    </span>
                    <ChevronDown className={cn("w-4 h-4 text-secondary-text transition-transform", isUserDropdownOpen && "rotate-180")} />
                  </button>

                  {isUserDropdownOpen && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-border rounded-xl shadow-xl z-50 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                      <div className="p-2 border-b border-border bg-muted-bg/10">
                        <div className="relative">
                          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-secondary-text" />
                          <input
                            type="text"
                            autoFocus
                            placeholder="Search users..."
                            value={userSearchQuery}
                            onChange={(e) => setUserSearchQuery(e.target.value)}
                            className="w-full bg-white border border-border rounded-md pl-9 pr-3 py-2 text-xs focus:outline-none focus:border-accent"
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                      </div>
                      <div className="max-h-48 overflow-y-auto">
                        <button
                          type="button"
                          onClick={() => {
                            setDeviceForm({ ...deviceForm, assignedTo: '' });
                            setIsUserDropdownOpen(false);
                            setUserSearchQuery('');
                          }}
                          className="w-full px-4 py-2.5 text-left text-xs hover:bg-muted-bg flex items-center justify-between group"
                        >
                          <span className="text-secondary-text italic">Unassigned</span>
                          {!deviceForm.assignedTo && <Check className="w-3.5 h-3.5 text-accent" />}
                        </button>
                        {users
                          .filter(u => 
                            u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                            u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                          )
                          .map(u => (
                            <button
                              key={u.id}
                              type="button"
                              onClick={() => {
                                setDeviceForm({ ...deviceForm, assignedTo: u.id });
                                setIsUserDropdownOpen(false);
                                setUserSearchQuery('');
                              }}
                              className="w-full px-4 py-2.5 text-left text-xs hover:bg-muted-bg flex items-center justify-between group"
                            >
                              <div className="flex flex-col">
                                <span className="font-medium">{u.name}</span>
                                <span className="text-[10px] text-secondary-text">{u.email}</span>
                              </div>
                              {deviceForm.assignedTo === u.id && <Check className="w-3.5 h-3.5 text-accent" />}
                            </button>
                          ))}
                        {users.filter(u => 
                          u.name.toLowerCase().includes(userSearchQuery.toLowerCase()) || 
                          u.email.toLowerCase().includes(userSearchQuery.toLowerCase())
                        ).length === 0 && (
                          <div className="px-4 py-8 text-center text-xs text-secondary-text italic">
                            No users found matching "{userSearchQuery}"
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
              <button
                type="submit"
                className="w-full py-4 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                {editingDevice ? 'Update Device' : 'Provision Device'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;
