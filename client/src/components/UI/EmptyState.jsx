import React from 'react';

const EmptyState = ({ title, description, compact, actionText, onAction }) => {
  return (
    <div className={`flex flex-col items-center justify-center text-center ${compact ? 'p-2' : 'p-10 sm:p-20'} animate-fade-in`}>
      <div className={`aspect-square ${compact ? 'w-16' : 'w-32'} mb-6 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-200 border border-slate-100`}>
         <svg className="w-1/2 h-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        </svg>
      </div>
      
      <h3 className={`font-bold text-slate-800 tracking-tight mb-2 ${compact ? 'text-base' : 'text-xl'}`}>{title}</h3>
      <p className={`text-slate-400 font-medium max-w-xs mx-auto mb-6 leading-relaxed ${compact ? 'text-[10px]' : 'text-sm'}`}>{description}</p>
      
      {actionText && (
        <button 
          onClick={onAction}
          className="btn-primary py-2.5 text-[10px] uppercase tracking-widest"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};

export default EmptyState;
