import React, { useState } from 'react';
import { useAuth } from '../AuthContext';
import { Zap } from 'lucide-react';

const Login: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useAuth();

  const handleSubmit = (e: React.FormEvent, role: 'admin' | 'user') => {
    e.preventDefault();
    if (email) {
      login(email, role);
    }
  };

  return (
    <div className="min-h-screen bg-bg flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-accent/10 text-accent mb-6">
            <Zap className="w-8 h-8" />
          </div>
          <h1 className="text-5xl font-serif italic mb-2">Aura</h1>
          <p className="small-caps tracking-[0.3em]">Energy Management System</p>
        </div>

        <div className="bg-white border border-border p-10 rounded-2xl shadow-sm">
          <h2 className="text-2xl font-serif mb-8 text-center">Welcome Back</h2>
          
          <form className="space-y-6">
            <div>
              <label className="small-caps mb-2 block">Email Address</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-muted-bg/30 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="name@company.com"
              />
            </div>
            <div>
              <label className="small-caps mb-2 block">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-muted-bg/30 border border-border rounded-lg px-4 py-3 focus:outline-none focus:border-accent transition-colors"
                placeholder="••••••••"
              />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-4">
              <button
                onClick={(e) => handleSubmit(e, 'user')}
                className="w-full py-3 border border-border rounded-lg text-sm font-medium hover:bg-muted-bg transition-colors"
              >
                Login as User
              </button>
              <button
                onClick={(e) => handleSubmit(e, 'admin')}
                className="w-full py-3 bg-accent text-white rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                Login as Admin
              </button>
            </div>
          </form>

          <p className="text-center text-secondary-text text-xs mt-8 font-sans">
            Forgot password? Contact your system administrator.
          </p>
        </div>

        <div className="mt-12 text-center">
          <p className="small-caps text-[9px] opacity-40">© 2026 Aura Energy Systems • v2.4.0</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
