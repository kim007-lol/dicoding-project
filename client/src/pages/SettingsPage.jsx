import React, { useState, useRef } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/UI/Button';
import { useData } from '../contexts/DataContext';

const SettingsPage = () => {
  const { pools, transactions, setPools, setTransactions, syncToDatabase, lastSync } = useData();
  const [activeTab, setActiveTab] = useState('sync');
  const [syncing, setSyncing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef(null);

  const exportData = () => {
    const data = JSON.stringify({ pools, transactions }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kastumbuh_backup.json`;
    a.click();
  };

  const importData = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);
        if (parsed.pools && parsed.transactions) {
          setPools(parsed.pools);
          setTransactions(parsed.transactions);
          alert('Data berhasil dipulihkan!');
        }
      } catch (err) { alert('Gagal membaca file.'); }
    };
    reader.readAsText(file);
  };

  const handleSync = async () => {
    setSyncing(true);
    setShowSuccess(false);
    try {
      const success = await syncToDatabase();
      if(success) {
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 3000);
      }
    } finally { setSyncing(false); }
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-2 transition-all">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Pengaturan</h1>
           <p className="text-slate-500 font-medium">Cadangkan data dan atur sinkronisasi akun Anda.</p>
        </div>
      </div>

      <div className="card-clean bg-white flex flex-col md:flex-row min-h-[500px] animate-fade-in">
         {/* Tabs Sidebar */}
         <div className="w-full md:w-64 bg-slate-50 border-b md:border-b-0 md:border-r border-slate-100 p-6 flex md:flex-col gap-2 overflow-x-auto shrink-0 transition-colors">
            <button 
              onClick={() => setActiveTab('sync')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'sync' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Sinkronisasi
            </button>
            <button 
              onClick={() => setActiveTab('backup')}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all whitespace-nowrap ${activeTab === 'backup' ? 'bg-white text-emerald-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}
            >
              Backup Data
            </button>
         </div>

         {/* Content Area */}
         <div className="flex-1 p-8 lg:p-12">
            {activeTab === 'sync' && (
              <div className="max-w-md animate-fade-in">
                 <h2 className="text-2xl font-bold text-slate-800 mb-2">Sinkronisasi Cloud</h2>
                 <p className="text-slate-500 font-medium mb-8 leading-relaxed">Pindahkan data Anda ke penyimpanan aman agar tidak hilang saat ganti perangkat.</p>
                 
                 <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-8 text-center">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Status Terakhir</p>
                    <p className="font-bold text-slate-800 text-lg tabular-nums">
                      {lastSync ? new Date(lastSync).toLocaleString('id-ID') : 'Belum Pernah Sync'}
                    </p>
                 </div>

                 <button 
                   disabled={syncing}
                   onClick={handleSync}
                   className={`w-full py-4 rounded-xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 shadow-md transition-all active:scale-95 ${showSuccess ? 'bg-emerald-500 text-white' : 'btn-primary bg-emerald-600 hover:bg-emerald-700'}`}
                 >
                   {syncing ? "Sedang Mengirim..." : showSuccess ? "Selesai!" : "Mulai Sinkronisasi"}
                 </button>
              </div>
            )}

            {activeTab === 'backup' && (
              <div className="max-w-xl animate-fade-in space-y-8">
                 <div>
                    <h2 className="text-2xl font-bold text-slate-800 mb-2">Cadangan Lokal</h2>
                    <p className="text-slate-500 font-medium leading-relaxed">Gunakan file JSON untuk memindahkan data secara manual antar komputer.</p>
                 </div>
                 
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <button onClick={exportData} className="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-emerald-300">
                       <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" /></svg>
                       </div>
                       <span className="font-bold text-sm text-slate-800">Export (Download)</span>
                    </button>

                    <input type="file" ref={fileInputRef} className="hidden" accept=".json" onChange={importData} />
                    <button onClick={() => fileInputRef.current?.click()} className="card-clean p-6 flex flex-col items-center justify-center text-center group hover:border-emerald-300">
                       <div className="w-10 h-10 rounded-lg bg-slate-50 text-slate-400 flex items-center justify-center mb-4 group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                         <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
                       </div>
                       <span className="font-bold text-sm text-slate-800">Import (Upload)</span>
                    </button>
                 </div>
              </div>
            )}
         </div>
      </div>
    </MainLayout>
  );
};

export default SettingsPage;
