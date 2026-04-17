import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import transactionService from '../services/transactionService';
import SummaryCards from '../components/SummaryCards';
import TransactionList from '../components/TransactionList';
import TransactionForm from '../components/TransactionForm';

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState(null);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [summaryRes, recentRes] = await Promise.all([
        transactionService.getSummary(),
        transactionService.getRecent(5),
      ]);
      setSummary(summaryRes.data);
      setRecentTransactions(recentRes.data);
    } catch (err) {
      console.error('Failed to fetch dashboard data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateOrUpdate = async (data) => {
    if (editingTransaction) {
      await transactionService.update(editingTransaction.id, data);
    } else {
      await transactionService.create(data);
    }
    fetchDashboardData();
  };

  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus transaksi ini?')) {
      try {
        await transactionService.delete(id);
        fetchDashboardData();
      } catch (err) {
        console.error('Failed to delete transaction', err);
      }
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-dark-50">Ringkasan Keuangan</h2>
          <p className="text-sm text-dark-400 mt-1">Pantau performa usaha Anda saat ini</p>
        </div>
        <button
          onClick={() => {
            setEditingTransaction(null);
            setIsFormOpen(true);
          }}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold rounded-xl shadow-lg shadow-primary-600/25 transition-smooth hover:scale-105"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Catat Transaksi
        </button>
      </div>

      <SummaryCards summary={summary} loading={loading} />

      <div className="glass-light rounded-2xl p-6 relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
        
        <div className="flex items-center justify-between mb-6 relative z-10">
          <h3 className="text-xl font-semibold text-dark-100">Transaksi Terbaru</h3>
          <Link
            to="/transactions"
            className="text-sm text-primary-400 hover:text-primary-300 font-medium transition-smooth hover:underline"
          >
            Lihat Semua →
          </Link>
        </div>

        <div className="relative z-10">
          <TransactionList
            transactions={recentTransactions}
            loading={loading}
            onEdit={(tx) => {
              setEditingTransaction(tx);
              setIsFormOpen(true);
            }}
            onDelete={handleDelete}
          />
        </div>
      </div>

      {isFormOpen && (
        <TransactionForm
          initialData={editingTransaction}
          onSubmit={handleCreateOrUpdate}
          onClose={() => {
            setIsFormOpen(false);
            setEditingTransaction(null);
          }}
        />
      )}
    </div>
  );
};

export default DashboardPage;
