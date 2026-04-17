import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/UI/Button';
import Modal from '../components/UI/Modal';
import TransferModal from '../components/TransferModal';
import { useData } from '../contexts/DataContext';

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const PURPOSE_PRESETS = [
  { label: 'Kas Toko', emoji: '🏪', is_business: true, purpose: 'Kas Toko' },
  { label: 'Rekening Bank', emoji: '🏦', is_business: true, purpose: 'Rekening Bank' },
  { label: 'E-Wallet', emoji: '📱', is_business: true, purpose: 'E-Wallet' },
  { label: 'Tabungan', emoji: '🐷', is_business: false, purpose: 'Tabungan' },
  { label: 'Laci / Brankas', emoji: '🔐', is_business: true, purpose: 'Laci / Brankas' },
  { label: 'Dana Darurat', emoji: '🛡️', is_business: false, purpose: 'Dana Darurat' },
  { label: 'Modal Usaha', emoji: '💼', is_business: true, purpose: 'Modal Usaha' },
  { label: 'Investasi', emoji: '📈', is_business: false, purpose: 'Investasi' },
];

const CashPools = () => {
  const { pools, addPool } = useData();
  const [isTransferOpen, setTransferOpen] = useState(false);
  const [isCreateOpen, setCreateOpen] = useState(false);
  
  const [newPool, setNewPool] = useState({ name: '', is_business: true, purpose: '', initial_balance: '' });
  const [isCustomPurpose, setIsCustomPurpose] = useState(false);
  const [customPurpose, setCustomPurpose] = useState('');

  const handleSelectPurpose = (preset) => {
    setNewPool({ ...newPool, purpose: preset.purpose, is_business: preset.is_business });
    setIsCustomPurpose(false);
    setCustomPurpose('');
  };

  const handleCustomToggle = () => {
    setIsCustomPurpose(true);
    setNewPool({ ...newPool, purpose: '' });
  };

  const handleCreate = () => {
    const finalPurpose = isCustomPurpose ? customPurpose : newPool.purpose;
    addPool({ ...newPool, purpose: finalPurpose });
    setCreateOpen(false);
    setNewPool({ name: '', is_business: true, purpose: '', initial_balance: '' });
    setIsCustomPurpose(false);
    setCustomPurpose('');
  };

  const canSubmit = newPool.name.trim() && (newPool.purpose || (isCustomPurpose && customPurpose.trim()));

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-2 transition-all">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Kas & Rekening</h1>
           <p className="text-slate-500 font-medium">Kelola saldo laci toko, bank, hingga tabungan pribadi Anda.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={() => setTransferOpen(true)}
             className="btn-secondary flex items-center justify-center gap-2"
           >
              <svg className="w-5 h-5 text-emerald-600" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" /></svg>
              Pindah Saldo
           </button>
           <button 
             onClick={() => setCreateOpen(true)}
             className="btn-primary flex items-center justify-center gap-2"
           >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Buka Kas Baru
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-fade-in">
        {pools.map(pool => {
          const isBusiness = pool.is_business === true || String(pool.is_business) === 'true';
          const borderColor = isBusiness ? 'border-emerald-200' : 'border-slate-200';
          const bgColor = isBusiness ? 'bg-emerald-50/30' : 'bg-white';
          const purposeLabel = pool.purpose || (isBusiness ? 'Keperluan Bisnis' : 'Aset Pribadi');

          return (
            <div key={pool.id} className={`card-clean p-6 border-2 transition-transform hover:scale-[1.02] ${borderColor} ${bgColor}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-lg font-bold text-slate-800 leading-tight">{pool.name}</h3>
                  <span className={`text-[10px] font-bold uppercase tracking-widest mt-1 inline-block ${isBusiness ? 'text-emerald-600' : 'text-slate-400'}`}>
                    {purposeLabel}
                  </span>
                </div>
                <div className={`p-2 rounded-lg ${isBusiness ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-400'}`}>
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isBusiness ? "M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" : "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"} />
                  </svg>
                </div>
              </div>

              <div className="mb-6">
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Saldo Tersedia</p>
                 <p className="text-2xl font-black text-slate-900 tabular-nums tracking-tight">
                   {formatRp(pool.balance)}
                 </p>
              </div>

              <div className="pt-4 border-t border-slate-100 flex items-center gap-2">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-500"></div>
                 <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Tersimpan di Lokal</span>
              </div>
            </div>
          );
        })}

        <button 
          onClick={() => setCreateOpen(true)}
          className="card-clean border-2 border-dashed border-slate-200 p-6 flex flex-col items-center justify-center text-slate-400 hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50/50 transition-all min-h-[220px] group"
        >
           <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
             <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
           </div>
           <span className="font-bold text-slate-800">Tambah Akun Baru</span>
        </button>
      </div>

      <TransferModal isOpen={isTransferOpen} onClose={() => setTransferOpen(false)} pools={pools} />
      
      <Modal
        isOpen={isCreateOpen}
        onClose={() => setCreateOpen(false)}
        title="Buka Kas/Rekening Baru"
      >
        <div className="space-y-6 pt-2">
           {/* Nama Kas */}
           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Nama Kas/Rekening</label>
              <input 
                className="input-clean bg-slate-50 border-transparent focus:bg-white"
                placeholder="Misal: BCA Bisnis, Dompet Pribadi, GoPay"
                value={newPool.name} 
                onChange={e => setNewPool({...newPool, name: e.target.value})} 
              />
           </div>

           {/* Kategori / Purpose */}
           <div className="space-y-2">
              <label className="text-xs font-bold text-slate-500 ml-1">Kategori Rekening</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {PURPOSE_PRESETS.map((preset) => (
                  <button
                    key={preset.purpose}
                    type="button"
                    onClick={() => handleSelectPurpose(preset)}
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-semibold transition-all ${
                      !isCustomPurpose && newPool.purpose === preset.purpose
                        ? 'border-emerald-500 bg-emerald-50 text-emerald-700 shadow-sm shadow-emerald-500/10'
                        : 'border-slate-100 bg-white text-slate-600 hover:border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <span className="text-base">{preset.emoji}</span>
                    <span className="truncate text-xs">{preset.label}</span>
                  </button>
                ))}
                {/* Custom option button */}
                <button
                  type="button"
                  onClick={handleCustomToggle}
                  className={`flex items-center gap-2 px-3 py-2.5 rounded-xl border-2 text-left text-sm font-semibold transition-all ${
                    isCustomPurpose
                      ? 'border-indigo-500 bg-indigo-50 text-indigo-700 shadow-sm shadow-indigo-500/10'
                      : 'border-dashed border-slate-200 bg-white text-slate-400 hover:border-slate-300 hover:text-slate-600'
                  }`}
                >
                  <span className="text-base">✏️</span>
                  <span className="truncate text-xs">Custom...</span>
                </button>
              </div>

              {/* Custom purpose input field */}
              {isCustomPurpose && (
                <div className="pt-1 space-y-2">
                  <input 
                    className="input-clean bg-slate-50 border-transparent focus:bg-white"
                    placeholder="Tulis kategori kustom Anda..."
                    value={customPurpose}
                    onChange={e => setCustomPurpose(e.target.value)}
                    autoFocus
                  />
                  <div className="flex items-center gap-3 pl-1">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newPool.is_business}
                        onChange={e => setNewPool({...newPool, is_business: e.target.checked})}
                        className="w-4 h-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                      />
                      <span className="text-xs font-medium text-slate-500">Masuk ke Laporan Laba/Rugi (Aset Usaha)</span>
                    </label>
                  </div>
                </div>
              )}
           </div>
           
           {/* Saldo Awal */}
           <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-500 ml-1">Saldo Saat Ini</label>
              <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-300">Rp</span>
                <input 
                  type="text"
                  inputMode="numeric"
                  className="input-clean !pl-12 bg-slate-50 border-transparent focus:bg-white font-bold text-lg"
                  placeholder="0" 
                  value={newPool.initial_balance ? new Intl.NumberFormat('id-ID').format(newPool.initial_balance) : ''} 
                  onChange={e => {
                    const rawValue = e.target.value.replace(/\D/g, '');
                    setNewPool({...newPool, initial_balance: rawValue});
                  }}
                />
              </div>
           </div>

           <div className="flex gap-3 pt-4">
              <button 
               onClick={() => setCreateOpen(false)}
               className="btn-secondary flex-1"
              >
                Batal
              </button>
              <button 
               onClick={handleCreate}
               disabled={!canSubmit}
               className="btn-primary flex-1 bg-emerald-600 shadow-md shadow-emerald-600/10"
              >
                Simpan
              </button>
           </div>
        </div>
      </Modal>

    </MainLayout>
  );
};

export default CashPools;
