import React, { useState } from 'react';
import Modal from './UI/Modal';
import Button from './UI/Button';
import Input from './UI/Input';
import { useData } from '../contexts/DataContext';

const TransferModal = ({ isOpen, onClose, pools }) => {
  const { transfer } = useData();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    from_pool_id: '',
    to_pool_id: '',
    amount: '',
    date: new Date().toISOString().split('T')[0],
    notes: 'Pemindahan dana'
  });

  const handleNext = () => setStep(2);
  const handleBack = () => setStep(1);

  const handleConfirm = () => {
    transfer(formData.from_pool_id, formData.to_pool_id, formData.amount, formData.date, formData.notes);
    onClose();
    setTimeout(() => {
      setStep(1);
      setFormData({...formData, amount: ''});
    }, 500);
  };

  const sourcePool = pools.find(p => p.id.toString() === formData.from_pool_id.toString());
  const destPool = pools.find(p => p.id.toString() === formData.to_pool_id.toString());
  const transferAmt = Number(formData.amount) || 0;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title="Transfer Antar Kas"
      footer={
        <div className="flex gap-3 w-full justify-end">
          <Button variant="ghost" onClick={step === 1 ? onClose : handleBack} className="rounded-xl px-5">
            {step === 1 ? 'Batal' : 'Kembali'}
          </Button>
          {step === 1 ? (
            <Button 
              variant="secondary" 
              onClick={handleNext}
              disabled={!formData.from_pool_id || !formData.to_pool_id || !formData.amount || formData.amount === '0' || formData.from_pool_id === formData.to_pool_id || (sourcePool?.balance < transferAmt)}
              className="rounded-xl px-6 bg-slate-900 text-white hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400"
            >
              Lanjutkan
            </Button>
          ) : (
             <Button variant="primary" onClick={handleConfirm} className="rounded-xl px-6 bg-indigo-600 hover:bg-indigo-700 shadow-lg shadow-indigo-600/20 active:scale-95 transition-transform">
              Konfirmasi Transfer
            </Button>
          )}
        </div>
      }
    >
      {step === 1 ? (
        <div className="space-y-5 py-2 animate-fade-in">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Sumber Dana</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                value={formData.from_pool_id}
                onChange={e => setFormData({...formData, from_pool_id: e.target.value})}
              >
                <option value="">Pilih Sumber...</option>
                {pools.map(p => (
                  <option key={p.id} value={p.id}>{p.name} (Rp {new Intl.NumberFormat('id-ID').format(p.balance)})</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tujuan Dana</label>
              <select 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all appearance-none"
                value={formData.to_pool_id}
                onChange={e => setFormData({...formData, to_pool_id: e.target.value})}
              >
                <option value="">Pilih Tujuan...</option>
                {pools.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-2 pt-2">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Nominal Transfer</label>
            <div className="relative">
              <span className={`absolute left-4 top-1/2 -translate-y-1/2 text-lg font-bold ${formData.amount === '0' ? 'text-rose-400' : 'text-slate-400'}`}>Rp</span>
              <input 
                type="text" 
                inputMode="numeric"
                className={`w-full text-2xl font-bold ${formData.amount === '0' ? 'text-rose-600 bg-rose-50/30 border-rose-300 focus:ring-rose-500/20 focus:border-rose-500' : 'text-slate-900 bg-slate-50/50 border-slate-200 focus:ring-indigo-500/20 focus:border-indigo-500'} rounded-xl focus:ring-2 py-3 pl-12 pr-4 placeholder:text-slate-300 transition-all outline-none border`}
                placeholder="0"
                value={formData.amount ? new Intl.NumberFormat('id-ID').format(formData.amount) : ''}
                onChange={e => {
                  const rawValue = e.target.value.replace(/\D/g, '');
                  setFormData({...formData, amount: rawValue});
                }}
              />
            </div>
            {formData.amount === '0' && (
              <p className="text-xs font-bold text-rose-500 mt-1 pl-1">Nominal transfer harus lebih dari Rp 0.</p>
            )}
            {sourcePool && sourcePool.balance < transferAmt && (
              <p className="text-xs font-bold text-rose-500 mt-1 pl-1">Saldo sumber dana tidak mencukupi untuk nominal ini.</p>
            )}
          </div>

           <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Tanggal</label>
              <input 
                type="date"
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.date}
                onChange={e => setFormData({...formData, date: e.target.value})}
              />
            </div>
             <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Keterangan Internal</label>
              <input 
                className="w-full bg-slate-50 border border-slate-200 text-slate-800 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all"
                value={formData.notes}
                onChange={e => setFormData({...formData, notes: e.target.value})}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="py-6 animate-fade-in flex flex-col items-center">
          <div className="w-16 h-16 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mb-6 shadow-sm">
             <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
          </div>
          <h4 className="text-xl font-bold text-slate-800 text-center mb-8">Validasi Perpindahan Dana</h4>
          
          <div className="w-full bg-slate-50 border border-slate-100 rounded-2xl p-6 relative shadow-inner">
             <div className="flex justify-between items-center mb-5">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Dari Rekening</p>
                  <p className="text-base font-semibold text-slate-800">{sourcePool?.name}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Sisa Saldo</p>
                  <p className="text-sm font-bold text-slate-900">Rp {new Intl.NumberFormat('id-ID').format(sourcePool?.balance - transferAmt)}</p>
               </div>
             </div>

             <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white border border-slate-100 rounded-full flex items-center justify-center text-slate-400 z-10 shadow-sm">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" /></svg>
             </div>
             <div className="w-full h-px bg-slate-200/60 my-5"></div>

             <div className="flex justify-between items-center mt-5">
               <div>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Ke Rekening</p>
                  <p className="text-base font-semibold text-slate-800">{destPool?.name}</p>
               </div>
               <div className="text-right">
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mb-1">Proyeksi Saldo</p>
                  <p className="text-sm font-bold text-indigo-600">Rp {new Intl.NumberFormat('id-ID').format(destPool?.balance + transferAmt)}</p>
               </div>
             </div>
          </div>
          
          <div className="mt-8 text-center bg-indigo-50 w-full py-4 rounded-xl border border-indigo-100/50">
             <p className="text-xs text-indigo-400 font-semibold uppercase tracking-wider mb-1">Nominal yang Dipindahkan</p>
             <p className="text-3xl font-black text-indigo-700 tracking-tight">Rp {new Intl.NumberFormat('id-ID').format(transferAmt)}</p>
          </div>
        </div>
      )}
    </Modal>
  );
};

export default TransferModal;
