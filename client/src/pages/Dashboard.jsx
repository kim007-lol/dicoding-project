import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import DashboardCard from '../components/UI/DashboardCard';
import EmptyState from '../components/UI/EmptyState';
import TransactionSlideOver from '../components/TransactionSlideOver';
import { useData } from '../contexts/DataContext';

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const Dashboard = () => {
  const { transactions, pools, dataLoading } = useData();
  const [isSlideOverOpen, setSlideOverOpen] = useState(false);

  if (dataLoading) {
    return (
      <MainLayout>
        <div className="min-h-[60vh] flex items-center justify-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-10 h-10 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="text-slate-400 text-sm font-medium">Memuat data...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  const today = new Date().toISOString().split('T')[0];
  const thisMonth = new Date().toISOString().substring(0, 7);
  const businessPoolIds = pools.filter(p => String(p.is_business) === 'true').map(p => p.id.toString());
  
  const dailyIncome = transactions
    .filter(t => t.type === 'INCOME' && t.date === today && businessPoolIds.includes(t.cash_pool_id?.toString()) && t.status !== 'VOIDED')
    .reduce((sum, t) => sum + Number(t.amount), 0);
  
  const dailyExpense = transactions
    .filter(t => t.type === 'EXPENSE' && t.date === today && businessPoolIds.includes(t.cash_pool_id?.toString()) && t.status !== 'VOIDED')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthIncome = transactions
    .filter(t => t.type === 'INCOME' && t.date.startsWith(thisMonth) && businessPoolIds.includes(t.cash_pool_id?.toString()) && t.status !== 'VOIDED')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const monthExpense = transactions
    .filter(t => t.type === 'EXPENSE' && t.date.startsWith(thisMonth) && businessPoolIds.includes(t.cash_pool_id?.toString()) && t.status !== 'VOIDED')
    .reduce((sum, t) => sum + Number(t.amount), 0);

  const totalAset = pools
    .filter(p => String(p.is_business) === 'true')
    .reduce((sum, p) => sum + p.balance, 0);

  const netProfit = monthIncome - monthExpense;

  const recentTransactions = transactions
    .filter(t => businessPoolIds.includes(t.cash_pool_id?.toString()))
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 5);

  return (
    <MainLayout>
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 transition-all">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Ringkasan Keuangan</h1>
           <p className="text-slate-500 font-medium">Lacak pendapatan dan pengeluaran bisnis Anda dengan mudah.</p>
        </div>
        <button 
          onClick={() => setSlideOverOpen(true)}
          className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
          Catat Transaksi
        </button>
      </div>

      {/* Grid Kartu */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10 animate-fade-in">
        <DashboardCard 
          title="Saldo Kas Usaha"
          value={formatRp(totalAset).replace('Rp', '').trim()} 
          type="neutral"
          icon="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
        />
        <DashboardCard 
          title="Masuk (Hari Ini)"
          value={formatRp(dailyIncome).replace('Rp', '').trim()} 
          type="income"
          icon="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
        <DashboardCard 
          title="Keluar (Hari Ini)"
          value={formatRp(dailyExpense).replace('Rp', '').trim()} 
          type="expense"
          icon="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"
        />
        <DashboardCard 
          title="Laba Bulan Ini"
          value={formatRp(netProfit).replace('Rp', '').trim()} 
          type="income"
          icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Grafik Placeholder */}
        <div className="lg:col-span-2 card-clean p-8">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-slate-800">Performa Arus Kas</h2>
             <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full uppercase tracking-wider">Bulan Ini</span>
           </div>
           <div className="h-[300px] flex items-center justify-center bg-slate-50 rounded-2xl border border-slate-100 border-dashed">
             <EmptyState 
               title="Grafik belum tersedia" 
               description="Catat transaksi untuk melihat visualisasi performa bisnis Anda."
               compact
             />
           </div>
        </div>

        {/* List Terbaru */}
        <div className="card-clean p-8 flex flex-col">
           <div className="flex justify-between items-center mb-8">
             <h2 className="text-xl font-bold text-slate-800">Terbaru</h2>
             <button className="text-xs font-bold text-emerald-600 hover:text-emerald-800 transition-colors uppercase tracking-widest">Semua</button>
           </div>

           <div className="flex-1 space-y-6">
             {recentTransactions.length === 0 ? (
               <EmptyState 
                 title="Belum ada catatan" 
                 description="Mulai catat transaksi pertama Anda hari ini."
                 compact
               />
             ) : (
               recentTransactions.map((t, idx) => (
                 <div key={idx} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                       <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${t.type === 'INCOME' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={t.type === 'INCOME' ? "M12 4v16m8-8H4" : "M20 12H4"} />
                          </svg>
                       </div>
                       <div className="truncate max-w-[120px]">
                         <p className="text-sm font-bold text-slate-800 truncate leading-tight">{t.category}</p>
                         <p className="text-[10px] text-slate-400 font-medium mt-1 uppercase tracking-tight">{t.date}</p>
                       </div>
                    </div>
                    <div className="text-right">
                       <p className={`text-sm font-bold tabular-nums ${t.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                         {t.type === 'INCOME' ? '+' : '-'} {formatRp(t.amount).replace('Rp', '').trim()}
                       </p>
                       <p className="text-[9px] text-slate-400 font-bold uppercase mt-0.5">Selesai</p>
                    </div>
                 </div>
               ))
             )}
           </div>
        </div>
      </div>

      <TransactionSlideOver isOpen={isSlideOverOpen} onClose={() => setSlideOverOpen(false)} />
    </MainLayout>
  );
};

export default Dashboard;
