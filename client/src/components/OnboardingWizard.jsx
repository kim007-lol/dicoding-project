import React, { useState, useEffect } from 'react';
import Modal from './UI/Modal';
import Button from './UI/Button';
import Input from './UI/Input';

const OnboardingWizard = ({ onComplete }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    businessPoolName: 'Kas Usaha',
    businessPoolBalance: 0,
    personalPoolName: 'Rekening Pribadi',
    personalPoolBalance: 0,
    txDate: new Date().toISOString().split('T')[0],
    txType: 'INCOME',
    txAmount: 1000000,
    txNotes: 'Modal Awal / Penjualan Pertama'
  });

  const handleNext = () => setStep(s => Math.min(s + 1, 4));
  const handleBack = () => setStep(s => Math.max(s - 1, 1));
  const handleSkip = () => { setIsOpen(false); onComplete(); };
  
  const handleFinish = () => {
    // In a real app, API calls would happen here to create pools and tx
    setIsOpen(false);
    onComplete(formData);
  };

  if (!isOpen) return null;

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={() => {}} // Can't close by clicking outside during onboarding
      title="Selamat Datang di KasTumbuh! 👋"
      footer={
        <div className="flex justify-between w-full items-center">
          {step < 4 ? (
            <button onClick={handleSkip} className="text-sm text-slate-500 hover:text-slate-700 font-medium">Lompati</button>
          ) : <div></div>}
          
          <div className="flex gap-2">
            {step > 1 && <Button variant="ghost" onClick={handleBack}>Kembali</Button>}
            {step < 4 ? (
              <Button variant="primary" onClick={handleNext}>Lanjut</Button>
            ) : (
              <Button variant="primary" onClick={handleFinish}>Selesai & Mulai</Button>
            )}
          </div>
        </div>
      }
    >
      <div className="py-2">
        {/* Progress Indicator */}
        <div className="flex gap-2 mb-8">
          {[1,2,3,4].map(i => (
            <div key={i} className={`h-1.5 flex-1 rounded-full ${i <= step ? 'bg-[#10B981]' : 'bg-slate-100'}`} />
          ))}
        </div>

        {step === 1 && (
          <div className="animate-fade-in">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Langkah 1: Buat Pool Usaha</h4>
            <p className="text-slate-500 text-sm mb-6">Pisahkan uang pribadi dan usaha. 'Pool Usaha' adalah tempat menyimpan uang khusus untuk bisnis Anda.</p>
            <div className="space-y-4">
              <Input 
                label="Nama Pool Usaha" 
                value={formData.businessPoolName}
                onChange={e => setFormData({...formData, businessPoolName: e.target.value})}
              />
              <Input 
                label="Saldo Saat Ini (Rp)" 
                type="number" 
                value={formData.businessPoolBalance}
                onChange={e => setFormData({...formData, businessPoolBalance: e.target.value})}
                helperText="Berapa uang tunai / di bank untuk usaha Anda saat ini?"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="animate-fade-in">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Langkah 2: Buat Pool Pribadi</h4>
            <p className="text-slate-500 text-sm mb-6">Uang pribadi Anda aman dan tidak akan masuk ke Laporan SAK EMKM usaha.</p>
            <div className="space-y-4">
              <Input 
                label="Nama Rekening Pribadi" 
                value={formData.personalPoolName}
                onChange={e => setFormData({...formData, personalPoolName: e.target.value})}
              />
              <Input 
                label="Saldo Saat Ini (Rp)" 
                type="number" 
                value={formData.personalPoolBalance}
                onChange={e => setFormData({...formData, personalPoolBalance: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="animate-fade-in">
            <h4 className="text-lg font-bold text-slate-800 mb-2">Langkah 3: Coba Catat Transaksi</h4>
            <p className="text-slate-500 text-sm mb-6">Mari buat transaksi contoh agar Anda terbiasa.</p>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                 <Input 
                  label="Tanggal" 
                  type="date" 
                  value={formData.txDate}
                  onChange={e => setFormData({...formData, txDate: e.target.value})}
                />
                 <Input 
                  label="Jenis" 
                  as="select"
                  value={formData.txType}
                  onChange={e => setFormData({...formData, txType: e.target.value})}
                  options={[
                    {value: 'INCOME', label: 'Pemasukan (+)'},
                    {value: 'EXPENSE', label: 'Pengeluaran (-)'}
                  ]}
                />
              </div>
              <Input 
                label="Jumlah (Rp)" 
                type="number" 
                value={formData.txAmount}
                onChange={e => setFormData({...formData, txAmount: e.target.value})}
              />
              <Input 
                label="Keterangan" 
                value={formData.txNotes}
                onChange={e => setFormData({...formData, txNotes: e.target.value})}
              />
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="animate-fade-in text-center py-6">
            <div className="w-16 h-16 bg-emerald-100 text-[#10B981] rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h4 className="text-xl font-bold text-slate-800 mb-2">Hebat! Anda Sudah Siap</h4>
            <p className="text-slate-500 text-sm">KasTumbuh siap digunakan. Anda bisa melihat transaksi contoh tadi di Dashboard, atau langsung cek Menu Laporan SAK EMKM.</p>
            
            <div className="mt-6 bg-slate-50 p-4 rounded-[10px] text-left border border-slate-100">
              <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">Preview Saldo Akhir</span>
              <div className="mt-2 text-2xl font-bold text-slate-800">
                Rp {new Intl.NumberFormat('id-ID').format(Number(formData.businessPoolBalance) + (formData.txType === 'INCOME' ? Number(formData.txAmount) : -Number(formData.txAmount)) )}
              </div>
              <div className="text-sm text-slate-500">Di {formData.businessPoolName}</div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  );
};

export default OnboardingWizard;
