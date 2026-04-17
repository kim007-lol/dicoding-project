const SummaryCards = ({ summary, loading }) => {
  const formatCurrency = (value) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value || 0);
  };

  const cards = [
    {
      title: 'Total Pemasukan',
      value: summary?.total_income,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 11l5-5m0 0l5 5m-5-5v12" />
        </svg>
      ),
      colorClass: 'from-emerald-500/20 to-emerald-600/10',
      iconBg: 'bg-emerald-500/20',
      iconColor: 'text-emerald-400',
      valueColor: 'text-emerald-400',
    },
    {
      title: 'Total Pengeluaran',
      value: summary?.total_expense,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 13l-5 5m0 0l-5-5m5 5V6" />
        </svg>
      ),
      colorClass: 'from-red-500/20 to-red-600/10',
      iconBg: 'bg-red-500/20',
      iconColor: 'text-red-400',
      valueColor: 'text-red-400',
    },
    {
      title: 'Saldo',
      value: summary?.balance,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      colorClass: 'from-primary-500/20 to-primary-600/10',
      iconBg: 'bg-primary-500/20',
      iconColor: 'text-primary-400',
      valueColor: 'text-primary-400',
    },
  ];

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="glass-light rounded-2xl p-6 animate-pulse">
            <div className="h-4 bg-dark-700 rounded w-1/2 mb-4"></div>
            <div className="h-8 bg-dark-700 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {cards.map((card, index) => (
        <div
          key={card.title}
          className={`glass-light rounded-2xl p-6 bg-gradient-to-br ${card.colorClass} transition-smooth hover:scale-[1.02] animate-slide-up`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-dark-400 font-medium">{card.title}</p>
            <div className={`p-2 rounded-xl ${card.iconBg} ${card.iconColor}`}>
              {card.icon}
            </div>
          </div>
          <p className={`text-2xl font-bold ${card.valueColor}`}>
            {formatCurrency(card.value)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default SummaryCards;
