import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const [pools, setPools] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [lastSync, setLastSync] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  // Track whether initial load is done to avoid saving empty state back
  const initialLoadDone = useRef(false);
  // Debounce timer for auto-sync
  const syncTimer = useRef(null);

  // Helper: user-scoped localStorage keys
  const getKey = useCallback((key) => {
    if (!user?.id) return null;
    return `kt_${key}_user_${user.id}`;
  }, [user?.id]);

  // ─── LOAD DATA: from backend first, fallback to localStorage ───
  useEffect(() => {
    if (!user?.id) {
      setPools([]);
      setTransactions([]);
      setDataLoading(false);
      initialLoadDone.current = false;
      return;
    }

    const loadData = async () => {
      setDataLoading(true);
      initialLoadDone.current = false;

      try {
        const response = await api.get('/sync');
        const serverData = response.data?.data;

        if (serverData && (serverData.pools?.length > 0 || serverData.transactions?.length > 0)) {
          setPools(serverData.pools || []);
          setTransactions(serverData.transactions || []);
          localStorage.setItem(getKey('pools'), JSON.stringify(serverData.pools || []));
          localStorage.setItem(getKey('transactions'), JSON.stringify(serverData.transactions || []));
        } else {
          const cachedPools = localStorage.getItem(getKey('pools'));
          const cachedTx = localStorage.getItem(getKey('transactions'));
          if (cachedPools) setPools(JSON.parse(cachedPools));
          else setPools([]);
          if (cachedTx) setTransactions(JSON.parse(cachedTx));
        }
      } catch (err) {
        console.warn('Gagal memuat data dari server, menggunakan cache lokal:', err.message);
        const cachedPools = localStorage.getItem(getKey('pools'));
        const cachedTx = localStorage.getItem(getKey('transactions'));

        if (cachedPools) setPools(JSON.parse(cachedPools));
        else setPools([]);

        if (cachedTx) setTransactions(JSON.parse(cachedTx));
      } finally {
        const syncTime = localStorage.getItem(getKey('last_sync'));
        if (syncTime) setLastSync(syncTime);
        setDataLoading(false);
        setTimeout(() => { initialLoadDone.current = true; }, 100);
      }
    };

    loadData();
  }, [user?.id, getKey]);

  // ─── SYNC TO BACKEND HELPER ───
  const performSync = async (poolsData, txData) => {
    if (!user?.id) return;
    try {
      // Local backup first
      localStorage.setItem(getKey('pools'), JSON.stringify(poolsData));
      localStorage.setItem(getKey('transactions'), JSON.stringify(txData));
      
      const response = await api.post('/sync', { pools: poolsData, transactions: txData });
      if (response.status === 200) {
        const time = new Date().toISOString();
        setLastSync(time);
        localStorage.setItem(getKey('last_sync'), time);
      }
    } catch (err) {
      console.error('Auto-sync gagal:', err.message);
    }
  };

  // Manual sync (for the Sinkronisasi button)
  const syncToDatabase = async () => {
    try {
      const response = await api.post('/sync', { pools, transactions });
      if (response.status === 200) {
        const time = new Date().toISOString();
        setLastSync(time);
        localStorage.setItem(getKey('last_sync'), time);
        return true;
      } else {
        alert('Gagal sinkronisasi ke server.');
        return false;
      }
    } catch (err) {
      console.error('Gagal sinkronisasi data ke cloud.', err);
      alert('Tidak dapat terhubung ke server Database. Pastikan internet Anda stabil.');
      return false;
    }
  };

  // ─── ACTIONS ───
  const addPool = (poolData) => {
    const newPool = { ...poolData, id: Date.now(), balance: Number(poolData.initial_balance || 0), purpose: poolData.purpose || null, last_activity: new Date().toISOString() };
    const updatedPools = [...pools, newPool];
    setPools(updatedPools);
    performSync(updatedPools, transactions);
  };

  const addTransaction = (txData) => {
    const newTx = { 
      ...txData, 
      id: Date.now(), 
      status: 'COMPLETED',
      idempotency_key: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };
    
    const updatedPools = pools.map(p => {
      if (p.id.toString() === txData.cash_pool_id.toString()) {
        const amount = Number(txData.amount);
        return {
          ...p,
          balance: txData.type === 'INCOME' ? p.balance + amount : p.balance - amount,
          last_activity: new Date().toISOString()
        };
      }
      return p;
    });

    const updatedTx = [newTx, ...transactions];
    setPools(updatedPools);
    setTransactions(updatedTx);
    performSync(updatedPools, updatedTx);
  };

  const transfer = (fromId, toId, amount, date, notes) => {
    const transferAmt = Number(amount);
    
    const updatedPools = pools.map(p => {
      if (p.id.toString() === fromId.toString()) return { ...p, balance: p.balance - transferAmt, last_activity: new Date().toISOString() };
      if (p.id.toString() === toId.toString()) return { ...p, balance: p.balance + transferAmt, last_activity: new Date().toISOString() };
      return p;
    });

    const fromPool = pools.find(p => p.id.toString() === fromId.toString());
    const toPool = pools.find(p => p.id.toString() === toId.toString());

    const newTx = {
      id: Date.now(),
      date,
      type: 'TRANSFER',
      category: 'Transfer Antar Kas',
      amount: transferAmt,
      notes,
      cash_pool_id: fromId,
      related_pool_id: toId,
      pool_name: `${fromPool?.name} -> ${toPool?.name}`,
      status: 'COMPLETED',
      idempotency_key: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `tx-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`
    };

    const updatedTx = [newTx, ...transactions];
    setPools(updatedPools);
    setTransactions(updatedTx);
    performSync(updatedPools, updatedTx);
  };

  const voidTransaction = (id) => {
    const tx = transactions.find(t => t.id === id);
    if (!tx || tx.status === 'VOIDED') return;

    const amt = Number(tx.amount);
    const updatedPools = pools.map(p => {
      if (tx.type === 'TRANSFER') {
        if (p.id.toString() === tx.cash_pool_id.toString()) return { ...p, balance: p.balance + amt };
        if (p.id.toString() === tx.related_pool_id.toString()) return { ...p, balance: p.balance - amt };
      } else {
        if (p.id.toString() === tx.cash_pool_id.toString()) {
          return { ...p, balance: tx.type === 'INCOME' ? p.balance - amt : p.balance + amt };
        }
      }
      return p;
    });

    const updatedTx = transactions.map(t => t.id === id ? { ...t, status: 'VOIDED', voided_at: new Date().toISOString() } : t);
    
    setPools(updatedPools);
    setTransactions(updatedTx);
    performSync(updatedPools, updatedTx);
  };

  return (
    <DataContext.Provider value={{
      pools,
      transactions,
      lastSync,
      dataLoading,
      addPool,
      addTransaction,
      transfer,
      voidTransaction,
      syncToDatabase,
      setPools,
      setTransactions
    }}>
      {children}
    </DataContext.Provider>
  );
};
