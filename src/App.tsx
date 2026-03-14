/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import Sidebar from './components/Sidebar';
import TopBar from './components/TopBar';
import Dashboard from './pages/Dashboard';
import Monitoring from './pages/Monitoring';
import Analytics from './pages/Analytics';
import AdminPanel from './pages/AdminPanel';
import Login from './pages/Login';

const AppContent = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <h1 className="text-4xl font-serif italic animate-pulse text-accent">Aura</h1>
          <p className="small-caps mt-2">Initializing System...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Login />;
  }

  return (
    <div className="flex min-h-screen bg-bg">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar />
        <main className="flex-1 p-8 overflow-y-auto">
          <div className="max-w-7xl mx-auto">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/monitoring" element={<Monitoring />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/reports" element={
                <div className="flex flex-col items-center justify-center h-[60vh] text-center">
                  <h2 className="text-3xl font-serif italic mb-4">Reports Center</h2>
                  <p className="text-secondary-text max-w-md">Automated energy reports and export tools will be available shortly.</p>
                </div>
              } />
              {user.role === 'admin' && (
                <Route path="/admin" element={<AdminPanel />} />
              )}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </main>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}
