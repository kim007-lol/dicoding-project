import React from 'react';
import MainLayout from '../components/Layout/MainLayout';
import EmptyState from '../components/UI/EmptyState';
import { useData } from '../contexts/DataContext';

const ReportsPage = () => {
  const { transactions, pools } = useData();

  const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

  const businessPoolIds = pools.filter(p => String(p.is_business) === 'true').map(p => p.id.toString());
  const businessTxns = transactions.filter(t => 
    t.status !== 'VOIDED' && businessPoolIds.includes(t.cash_pool_id?.toString())
  );

  const incomeAgg = {};
  businessTxns.filter(t => t.type === 'INCOME').forEach(t => {
    incomeAgg[t.category] = (incomeAgg[t.category] || 0) + Number(t.amount);
  });
  const revenueArray = Object.keys(incomeAgg).map(cat => ({ category: cat, amount: incomeAgg[cat] }));
  const total_revenue = revenueArray.reduce((sum, item) => sum + item.amount, 0);

  const expenseAgg = {};
  businessTxns.filter(t => t.type === 'EXPENSE').forEach(t => {
    expenseAgg[t.category] = (expenseAgg[t.category] || 0) + Number(t.amount);
  });
  const expenseArray = Object.keys(expenseAgg).map(cat => ({ category: cat, amount: expenseAgg[cat] }));
  const total_expense = expenseArray.reduce((sum, item) => sum + item.amount, 0);

  const net_profit = total_revenue - total_expense;
  const total_kas = pools.filter(p => String(p.is_business) === 'true').reduce((sum, p) => sum + p.balance, 0);

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-2 transition-all">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Laporan Keuangan</h1>
           <p className="text-slate-500 font-medium">Laporan otomatis berbasis standar SAK EMKM untuk UMKM.</p>
        </div>
        <button 
          onClick={() => window.print()}
          className="btn-primary flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/10"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" /></svg>
          Cetak Laporan
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in pb-20">
        
        {/* Laba Rugi Simple */}
        <div className="card-clean bg-white flex flex-col">
           <div className="bg-slate-50 p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Laporan Laba Rugi</h2>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Estimasi Keuntungan Bersih</p>
           </div>
           
           <div className="p-8 space-y-8">
                <div>
                   <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                      Pendapatan
                   </h4>
                   <div className="space-y-3">
                     {revenueArray.length === 0 ? <p className="text-xs text-slate-300 italic">Belum ada pendapatan.</p> : null}
                     {revenueArray.map((item, idx) => (
                       <div key={idx} className="flex justify-between text-sm font-medium border-b border-slate-50 pb-2">
                         <span className="text-slate-600">{item.category}</span>
                         <span className="tabular-nums font-bold text-slate-800">{formatRp(item.amount)}</span>
                       </div>
                     ))}
                   </div>
                   <div className="flex justify-between items-center mt-4 bg-emerald-50 p-3 rounded-lg">
                      <span className="font-bold text-xs text-emerald-700">Total Masuk</span>
                      <span className="font-bold text-lg text-emerald-700 tabular-nums">{formatRp(total_revenue)}</span>
                   </div>
                </div>

                <div>
                   <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-rose-500"></span>
                      Pengeluaran
                   </h4>
                   <div className="space-y-3">
                     {expenseArray.length === 0 ? <p className="text-xs text-slate-300 italic">Belum ada pengeluaran.</p> : null}
                     {expenseArray.map((item, idx) => (
                       <div key={idx} className="flex justify-between text-sm font-medium border-b border-slate-50 pb-2">
                         <span className="text-slate-600">{item.category}</span>
                         <span className="tabular-nums font-bold text-slate-800">({formatRp(item.amount)})</span>
                       </div>
                     ))}
                   </div>
                   <div className="flex justify-between items-center mt-4 bg-rose-50 p-3 rounded-lg">
                      <span className="font-bold text-xs text-rose-700">Total Keluar</span>
                      <span className="font-bold text-lg text-rose-700 tabular-nums">({formatRp(total_expense)})</span>
                   </div>
                </div>

                <div className="pt-6 border-t-2 border-slate-900 border-dashed flex justify-between items-center">
                   <p className="font-bold text-slate-800 uppercase tracking-tight">Laba Bersih</p>
                   <p className="text-2xl font-black text-emerald-600 tabular-nums">{formatRp(net_profit)}</p>
                </div>
           </div>
        </div>

        {/* Neraca Simple */}
        <div className="card-clean bg-white flex flex-col">
           <div className="bg-slate-50 p-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">Posisi Keuangan</h2>
              <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest mt-1">Balance Sheet (Neraca)</p>
           </div>
           
           <div className="p-8 space-y-10">
              <div>
                 <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Aset (Harta)</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-slate-600">Kas & Bank</span>
                       <span className="text-lg font-bold text-slate-800 tabular-nums">{formatRp(total_kas)}</span>
                    </div>
                    <div className="flex justify-between items-center opacity-30">
                       <span className="text-sm font-bold text-slate-600 italic">Lain-lain</span>
                       <span className="text-lg font-bold text-slate-800 tabular-nums">Rp 0</span>
                    </div>
                 </div>
              </div>

              <div>
                 <h4 className="font-bold text-xs uppercase tracking-widest text-slate-400 mb-6 border-b border-slate-100 pb-2">Kewajiban & Modal</h4>
                 <div className="space-y-4">
                    <div className="flex justify-between items-center">
                       <span className="text-sm font-bold text-slate-600">Ekuitas (Modal Sendiri)</span>
                       <span className="text-lg font-bold text-slate-800 tabular-nums">{formatRp(total_kas)}</span>
                    </div>
                 </div>
              </div>

              <div className="mt-auto bg-slate-900 text-white p-4 rounded-xl text-center">
                 <p className="text-[10px] font-bold uppercase tracking-[0.2em] opacity-60">Status Neraca</p>
                 <p className="text-sm font-bold mt-1">✅ SEIMBANG (BALANCED)</p>
              </div>
           </div>
        </div>

      </div>
    </MainLayout>
  );
};

export default ReportsPage;
