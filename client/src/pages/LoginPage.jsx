import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await login({ email, password });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Login gagal, silakan periksa kredensial Anda.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-[#10B981] rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-500/30 mb-4 transform rotate-3">
             <svg className="w-8 h-8 text-white -rotate-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
          </div>
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">KasTumbuh</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Buku Kas & Laporan SAK EMKM</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-xl border border-white/50 p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-5">
            <Input 
              label="Email Address" 
              type="email" 
              placeholder="nama@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div>
              <Input 
                label="Password" 
                type="password" 
                placeholder="••••••••" 
                required 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="flex justify-end mt-1">
                <a href="#" className="text-xs font-semibold text-[#6366F1] hover:text-[#4F46E5] hover:underline">
                  Lupa Password?
                </a>
              </div>
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-2 shadow-lg shadow-emerald-500/20"
              loading={loading}
            >
              Masuk ke Dashboard
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Belum punya akun?{' '}
            <Link to="/register" className="font-bold text-[#10B981] hover:text-[#059669] hover:underline">
              Mulai Gratis Disini
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
