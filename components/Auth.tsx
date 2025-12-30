import React, { useState } from 'react';
import { Lock, User, Sparkles } from 'lucide-react';

interface AuthProps {
  onLogin: (username: string, password: string) => Promise<boolean>;
  onSignup: (username: string, password: string) => Promise<boolean>;
}

const Auth: React.FC<AuthProps> = ({ onLogin, onSignup }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!username.trim() || !password.trim()) {
      setError('Please fill in all fields');
      return;
    }

    setIsLoading(true);
    try {
      const success = await (isLogin ? onLogin(username, password) : onSignup(username, password));
      
      if (!success) {
        setError(isLogin ? 'Invalid credentials' : 'Username already exists');
      }
    } catch (err) {
      setError('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-gray-100 via-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-400 to-purple-400 shadow-lg flex items-center justify-center">
              <Sparkles className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            AURA
          </h1>
          <p className="text-gray-600 text-sm font-medium">Your AI-powered career growth companion</p>
        </div>

        <div className="bg-gray-100 rounded-3xl p-8 shadow-[8px_8px_16px_#bebebe,-8px_-8px_16px_#ffffff]">
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                isLogin
                  ? 'bg-gray-100 text-blue-600 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
                  : 'text-gray-500 hover:text-gray-700 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
              }`}
            >
              Login
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-2 px-4 rounded-xl font-medium transition-all ${
                !isLogin
                  ? 'bg-gray-100 text-purple-600 shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff]'
                  : 'text-gray-500 hover:text-gray-700 shadow-[4px_4px_8px_#bebebe,-4px_-4px_8px_#ffffff]'
              }`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full bg-gray-100 rounded-xl py-3 pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all"
                  placeholder="Enter username"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-gray-100 rounded-xl py-3 pl-11 pr-4 text-gray-800 placeholder-gray-400 focus:outline-none shadow-[inset_4px_4px_8px_#bebebe,inset_-4px_-4px_8px_#ffffff] transition-all"
                  placeholder="Enter password"
                />
              </div>
            </div>

            {error && (
              <div className="text-red-600 text-sm bg-red-50 rounded-xl p-3 shadow-[inset_2px_2px_4px_rgba(239,68,68,0.1)]">
                {error}
              </div>
            )}

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-400 to-purple-400 hover:from-blue-500 hover:to-purple-500 text-white font-semibold py-3 rounded-xl transition-all shadow-[4px_4px_12px_#bebebe,-4px_-4px_12px_#ffffff] hover:shadow-[6px_6px_16px_#bebebe,-6px_-6px_16px_#ffffff] active:shadow-[inset_4px_4px_12px_#bebebe,inset_-4px_-4px_12px_#ffffff]"
            >
              {isLogin ? 'Login' : 'Create Account'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Auth;
