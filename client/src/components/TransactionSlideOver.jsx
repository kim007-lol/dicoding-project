import React, { useState } from 'react';
import Button from './UI/Button';
import { useData } from '../contexts/DataContext';

const TransactionSlideOver = ({ isOpen, onClose }) => {
  const { pools, addTransaction } = useData();
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    type: 'INCOME',
    amount: '',
    category: '',
    cash_pool_id: '',
    notes: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.amount || !formData.category || !formData.cash_pool_id) return;
    addTransaction(formData);
    setFormData({
      date: new Date().toISOString().split('T')[0],
      type: 'INCOME',
      amount: '',
      category: '',
      cash_pool_id: '',
      notes: ''
    });
    onClose();
  };

  const selectedPool = pools.find(p => p.id.toString() === formData.cash_pool_id.toString());
  const balanceProjection = selectedPool 
    ? (formData.type === 'INCOME' ? selectedPool.balance + Number(formData.amount || 0) : selectedPool.balance - Number(formData.amount || 0))
    : 0;

  return (
    <>
      <div 
        className={`fixed inset-0 bg-slate-900/20 backdrop-blur-[2px] z-[90] transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`} 
        onClick={onClose}
      />
      
      <aside className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[100] transition-transform duration-300 ease-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex flex-col h-full">
          
          {/* Simple Header */}
          <div className="px-8 py-8 border-b border-slate-100 shrink-0 flex items-center justify-between">
            <div>
               <h2 className="text-2xl font-bold text-slate-800 tracking-tight leading-none">Buat Catatan</h2>
               <p className="text-[10px] text-emerald-600 font-bold uppercase tracking-wider mt-2 italic">Masukkan Data Transaksi Baru</p>
            </div>
            <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-900 transition-all"><svg className="w-6 h-6 border rounded-lg p-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg></button>
          </div>

          <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto px-8 py-8 space-y-8">
            
            {/* Type Toggle */}
            <div className="flex p-1 bg-slate-100 rounded-xl">
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, type: 'INCOME'})}
                 className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${formData.type === 'INCOME' ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Uang Masuk
               </button>
               <button 
                 type="button"
                 onClick={() => setFormData({...formData, type: 'EXPENSE'})}
                 className={`flex-1 py-3 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${formData.type === 'EXPENSE' ? 'bg-white text-rose-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
               >
                 Uang Keluar
               </button>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Jumlah (Rp)</label>
               <input 
                 type="text"
                 inputMode="numeric"
                 className={`w-full text-4xl font-extrabold text-slate-900 border-b-2 ${formData.amount === '0' ? 'border-rose-400 text-rose-600 focus:border-rose-500' : 'border-slate-100 focus:border-emerald-500'} py-2 outline-none transition-all tabular-nums placeholder:text-slate-100`}
                 placeholder="0"
                 value={formData.amount ? new Intl.NumberFormat('id-ID').format(formData.amount) : ''}
                 onChange={e => {
                   const rawValue = e.target.value.replace(/\D/g, '');
                   setFormData({...formData, amount: rawValue});
                 }}
               />
               {formData.amount === '0' && <p className="text-[10px] font-bold text-rose-500 pl-1">Jumlah transaksi harus lebih dari Rp 0</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Tanggal</label>
                  <input type="date" className="input-clean bg-slate-50 border-transparent text-xs" value={formData.date} onChange={e => setFormData({...formData, date: e.target.value})} />
               </div>
               <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Ke Akun/Rekening</label>
                  <select className="input-clean bg-slate-50 border-transparent text-xs appearance-none" value={formData.cash_pool_id} onChange={e => setFormData({...formData, cash_pool_id: e.target.value})}>
                    <option value="">Pilih...</option>
                    {pools.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
               </div>
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Kategori (Apa ini?)</label>
               <input className="input-clean" placeholder="Misal: Penjualan Produk, Biaya Listrik" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})} />
            </div>

            <div className="space-y-2">
               <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest pl-1">Catatan Singkat</label>
               <textarea rows="3" className="input-clean resize-none" placeholder="Detail tambahan jika diperlukan..." value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} />
            </div>

            {selectedPool && (
               <div className="p-5 bg-slate-50 rounded-2xl border border-slate-100">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-2">Proyeksi Saldo</p>
                  <div className="flex justify-between items-center">
                     <span className="text-xs font-bold text-slate-600">{selectedPool.name}</span>
                     <span className={`text-lg font-extrabold tabular-nums ${formData.type === 'INCOME' ? 'text-emerald-600' : 'text-rose-600'}`}>
                       Rp {new Intl.NumberFormat('id-ID').format(balanceProjection)}
                     </span>
                  </div>
               </div>
            )}
          </form>

          <div className="p-8 border-t border-slate-100 bg-slate-50 flex gap-4 shrink-0">
             <button onClick={onClose} className="flex-1 text-xs font-bold text-slate-400 uppercase tracking-widest hover:text-slate-600 transition-colors">Batal</button>
             <button 
               onClick={handleSubmit} 
               disabled={!formData.amount || formData.amount === '0' || !formData.category || !formData.cash_pool_id} 
               className="btn-primary flex-1 text-xs tracking-widest bg-emerald-600 hover:bg-emerald-700 font-bold uppercase transition-all"
             >
               Simpan Catatan
             </button>
          </div>
        </div>
      </aside>
    </>
  );
};

export default TransactionSlideOver;
