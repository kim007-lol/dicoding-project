import React from 'react';

const DashboardCard = ({ title, value, type, trend, icon }) => {
  const isIncome = type === 'income';
  const isExpense = type === 'expense';
  
  const textColor = isIncome ? 'text-emerald-600' : isExpense ? 'text-rose-600' : 'text-slate-900';
  const iconBg = isIncome ? 'bg-emerald-50 text-emerald-600' : isExpense ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-400';

  return (
    <div className="card-clean p-6 flex flex-col justify-between">
      <div className="flex justify-between items-start mb-6">
        <div className={`p-3 rounded-xl ${iconBg}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
          </svg>
        </div>
        {trend && (
           <div className={`flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-tight ${trend > 0 ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={trend > 0 ? "M5 10l7-7m0 0l7 7m-7-7v18" : "M19 14l-7 7m0 0l-7-7m7 7V3"} />
              </svg>
              {Math.abs(trend)}%
           </div>
        )}
      </div>

      <div>
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">{title}</h3>
        <p className={`text-3xl font-bold tracking-tight tabular-nums ${textColor}`}>{value}</p>
      </div>

      <div className="mt-4 pt-4 border-t border-slate-50 flex items-center gap-2">
         <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
         <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Update Otomatis</span>
      </div>
    </div>
  );
};

export default DashboardCard;
