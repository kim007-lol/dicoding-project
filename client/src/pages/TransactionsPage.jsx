import React, { useState } from 'react';
import MainLayout from '../components/Layout/MainLayout';
import Button from '../components/UI/Button';
import EmptyState from '../components/UI/EmptyState';
import TransactionSlideOver from '../components/TransactionSlideOver';
import Modal from '../components/UI/Modal';
import { useData } from '../contexts/DataContext';

const formatRp = (num) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(num);

const TransactionsPage = () => {
  const { transactions, pools, voidTransaction, syncToDatabase } = useData();
  const [isSlideOverOpen, setSlideOverOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL');
  const [txToDelete, setTxToDelete] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const handleConfirmDelete = async () => {
    if (!txToDelete) return;
    setIsDeleting(true);
    voidTransaction(txToDelete.id);
    setTxToDelete(null);
    setIsDeleting(false);
  };

  const filtered = transactions
    .filter(t => {
      const matchSearch = t.notes?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          t.category?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchType = filterType === 'ALL' || t.type === filterType;
      return matchSearch && matchType;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const exportCSV = () => {
    const headers = ['Tanggal', 'Kategori', 'Tipe', 'Kas/Rekening', 'Jumlah', 'Keterangan', 'Status'];
    const rows = filtered.map(t => {
      const poolName = pools.find(p => p.id.toString() === t.cash_pool_id?.toString())?.name || '-';
      return [t.date, t.category, t.type, poolName, t.amount, t.notes || '', t.status || 'OK'];
    });
    
    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `kastumbuh_transaksi.csv`;
    a.click();
  };

  return (
    <MainLayout>
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-10 px-2 transition-all">
        <div>
           <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Catatan Transaksi</h1>
           <p className="text-slate-500 font-medium">Lihat dan kelola seluruh riwayat uang masuk/keluar Anda secara detail.</p>
        </div>
        <div className="flex gap-3">
           <button 
             onClick={exportCSV}
             className="btn-secondary flex items-center justify-center gap-2"
           >
              <svg className="w-5 h-5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" /></svg>
              Simpan CSV
           </button>
           <button 
             onClick={() => setSlideOverOpen(true)}
             className="btn-primary flex items-center justify-center gap-2"
           >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
              Buat Catatan
           </button>
        </div>
      </div>

      <div className="card-clean p-6 sm:p-8 animate-fade-in">
        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
           <input 
             type="text" 
             placeholder="Cari transaksi..." 
             className="input-clean flex-1"
             value={searchTerm}
             onChange={e => setSearchTerm(e.target.value)}
           />
           <div className="flex gap-2 p-1 bg-slate-100 rounded-xl overflow-x-auto">
              {['ALL', 'INCOME', 'EXPENSE'].map(type => (
                <button
                  key={type}
                  onClick={() => setFilterType(type)}
                  className={`px-4 py-2 rounded-lg text-xs font-bold uppercase tracking-widest transition-all ${filterType === type ? 'bg-white text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
                >
                  {type === 'ALL' ? 'Semua' : type === 'INCOME' ? 'Masuk' : 'Keluar'}
                </button>
              ))}
           </div>
        </div>

        {/* Table Simple */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-slate-400 font-bold uppercase tracking-widest text-[10px]">
                <th className="py-4 px-4">Tanggal</th>
                <th className="py-4 px-4">Kategori</th>
                <th className="py-4 px-4">Rekening</th>
                <th className="py-4 px-4 text-right">Jumlah</th>
                <th className="py-4 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="py-20 text-center">
                    <p className="text-slate-400 font-bold">Data transaksi tidak ditemukan.</p>
                  </td>
                </tr>
              ) : (
                filtered.map((t) => {
                  const pool = pools.find(p => p.id.toString() === t.cash_pool_id?.toString());
                  const isIncome = t.type === 'INCOME';
                  const isVoid = t.status === 'VOIDED';

                  return (
                    <tr key={t.id} className={`hover:bg-slate-50/50 transition-colors ${isVoid ? 'opacity-40 line-through' : ''}`}>
                      <td className="py-5 px-4 tabular-nums font-bold text-slate-800">{t.date}</td>
                      <td className="py-5 px-4 font-bold text-slate-800">
                        <div className="flex flex-col">
                           <span>{t.category}</span>
                           <span className="text-[10px] text-slate-400 font-medium uppercase mt-0.5">{t.notes || '-'}</span>
                        </div>
                      </td>
                      <td className="py-5 px-4 font-bold text-slate-500">{pool?.name || '-'}</td>
                      <td className={`py-5 px-4 text-right font-bold tabular-nums ${isIncome ? 'text-emerald-600' : 'text-rose-600'}`}>
                        {isIncome ? '+' : '-'} {formatRp(t.amount).replace('Rp', '').trim()}
                      </td>
                      <td className="py-5 px-4 text-right">
                        {!isVoid && (
                           <button 
                             onClick={() => setTxToDelete(t)}
                             className="p-2 text-slate-300 hover:text-rose-600 transition-all"
                             title="Batalkan"
                           >
                             <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                           </button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <TransactionSlideOver isOpen={isSlideOverOpen} onClose={() => setSlideOverOpen(false)} />
      
      <Modal 
        isOpen={!!txToDelete} 
        onClose={() => !isDeleting && setTxToDelete(null)}
        title="Batalkan Transaksi?"
        footer={
          <div className="flex gap-3 w-full justify-end">
            <Button variant="ghost" onClick={() => setTxToDelete(null)} disabled={isDeleting} className="rounded-xl px-5">Batal</Button>
            <Button 
              className="rounded-xl px-6 bg-rose-600 hover:bg-rose-700 text-white font-bold transition-transform shadow-lg shadow-rose-600/20"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Menghapus..." : "Ya, Batalkan"}
            </Button>
          </div>
        }
      >
        <div className="py-2 animate-fade-in text-slate-600 leading-relaxed font-medium">
          <p>Apakah Anda yakin ingin <strong className="text-rose-600">membatalkan</strong> transaksi ini?</p>
          <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 my-4">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Kategori</span>
              <span className="text-sm font-bold text-slate-800">{txToDelete?.category}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Jumlah</span>
              <span className="text-sm font-bold text-slate-800 tabular-nums">Rp {txToDelete ? new Intl.NumberFormat('id-ID').format(txToDelete.amount) : '0'}</span>
            </div>
          </div>
          <p className="text-sm">Saldo yang terkait di kas ini akan dikembalikan ke keadaan semula. Transaksi akan tetap tersimpan sebagai riwayat yang dibatalkan.</p>
        </div>
      </Modal>

    </MainLayout>
  );
};

export default TransactionsPage;
