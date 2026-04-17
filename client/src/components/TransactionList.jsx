const TransactionList = ({ transactions, loading, onEdit, onDelete }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-light rounded-2xl p-4 flex items-center justify-between animate-pulse">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-dark-700"></div>
              <div>
                <div className="h-4 bg-dark-700 rounded w-24 mb-2"></div>
                <div className="h-3 bg-dark-700 rounded w-16"></div>
              </div>
            </div>
            <div className="h-5 bg-dark-700 rounded w-20"></div>
          </div>
        ))}
      </div>
    );
  }

  if (transactions.length === 0) {
    return (
      <div className="glass-light rounded-2xl p-12 text-center animate-fade-in">
        <div className="w-16 h-16 mx-auto bg-dark-800/50 rounded-full flex items-center justify-center mb-4 text-dark-400">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
        </div>
        <h3 className="text-lg font-medium text-dark-200 mb-1">Belum ada transaksi</h3>
        <p className="text-dark-400 text-sm">Catat transaksi pertama Anda untuk melihat laporannya.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {transactions.map((tx, index) => (
        <div
          key={tx.id}
          className="glass-light rounded-2xl p-4 flex items-center justify-between group hover:bg-dark-800/40 transition-smooth animate-slide-up hover:border-dark-600/50"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg ${
              tx.type === 'INCOME' 
                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 shadow-emerald-500/5' 
                : 'bg-red-500/10 text-red-400 border border-red-500/20 shadow-red-500/5'
            }`}>
              {tx.type === 'INCOME' ? (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
                </svg>
              ) : (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
                </svg>
              )}
            </div>
            
            <div>
              <p className="text-sm font-semibold text-dark-100">{tx.category || (tx.type === 'INCOME' ? 'Pemasukan' : 'Pengeluaran')}</p>
              <div className="flex items-center gap-2 mt-1">
                <span className="text-xs text-dark-400">{formatDate(tx.transaction_date)}</span>
                {tx.description && (
                  <>
                    <span className="w-1 h-1 rounded-full bg-dark-600"></span>
                    <span className="text-xs text-dark-400 truncate max-w-[150px] sm:max-w-xs" title={tx.description}>
                      {tx.description}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <p className={`font-bold ${tx.type === 'INCOME' ? 'text-emerald-400' : 'text-red-400'}`}>
              {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
            </p>
            
            {/* Actions visible on hover */}
            <div className="hidden sm:flex opacity-0 group-hover:opacity-100 transition-opacity gap-2">
              <button 
                onClick={() => onEdit(tx)}
                className="p-2 rounded-xl text-dark-400 bg-dark-800/50 hover:text-primary-400 hover:bg-primary-500/10 transition-smooth"
                title="Edit"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button 
                onClick={() => onDelete(tx.id)}
                className="p-2 rounded-xl text-dark-400 bg-dark-800/50 hover:text-red-400 hover:bg-red-500/10 transition-smooth"
                title="Hapus"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
            
            {/* Mobile Actions Dropdown Menu (Simplified for MVP, always show but smaller) */}
            <div className="sm:hidden flex flex-col gap-1">
               <button onClick={() => onEdit(tx)} className="text-dark-400 hover:text-primary-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg></button>
               <button onClick={() => onDelete(tx.id)} className="text-dark-400 hover:text-red-400"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TransactionList;
