import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Button from '../components/UI/Button';
import Input from '../components/UI/Input';

const RegisterPage = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [name, setName] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate confirm password
    if (password !== confirmPassword) {
      setError('Password dan Ulangi Password tidak cocok.');
      return;
    }

    if (password.length < 6) {
      setError('Password minimal 6 karakter.');
      return;
    }

    setLoading(true);
    try {
      await register({ name, email, password, business_name: businessName });
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Registrasi gagal, silakan coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col justify-center items-center p-4">
      {/* Background Ornaments */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
      </div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-slate-800 tracking-tight">Daftar KasTumbuh</h2>
          <p className="text-sm text-slate-500 mt-2 font-medium">Kelola Keuangan UMKM dengan Mudah</p>
        </div>

        <div className="bg-white/80 backdrop-blur-xl rounded-[24px] shadow-xl border border-white/50 p-6 sm:p-8">
          {error && (
            <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input 
              label="Nama Lengkap" 
              placeholder="John Doe" 
              required 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input 
              label="Nama Usaha (UMKM)" 
              placeholder="Toko Maju Jaya" 
              required 
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
            />
            <Input 
              label="Email Aktif" 
              type="email" 
              placeholder="john@email.com" 
              required 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
               <Input 
                 label="Password" 
                 type="password" 
                 placeholder="••••••••" 
                 required 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
               />
               <Input 
                 label="Ulangi Password" 
                 type="password" 
                 placeholder="••••••••" 
                 required 
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
               />
            </div>

            <Button 
              type="submit" 
              variant="primary" 
              className="w-full mt-4 shadow-lg shadow-emerald-500/20"
              loading={loading}
            >
              Buat Akun Gratis
            </Button>
          </form>

          <p className="mt-8 text-center text-sm text-slate-600">
            Sudah ada akun?{' '}
            <Link to="/login" className="font-bold text-[#6366F1] hover:text-[#4F46E5] hover:underline">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
