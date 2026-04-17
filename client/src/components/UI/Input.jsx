import React, { useId } from 'react';

const Input = React.forwardRef(({ 
  label, 
  id, 
  error, 
  className = '', 
  helperText,
  as: Component = 'input',
  options = [],
  ...props 
}, ref) => {
  const generatedId = useId();
  const inputId = id || generatedId;
  
  const baseInputClasses = "w-full rounded-[10px] border px-3 py-2 text-sm outline-none transition-colors bg-white text-slate-900";
  const stateClasses = error 
    ? "border-[#EF4444] focus:border-[#EF4444] focus:ring-1 focus:ring-[#EF4444]"
    : "border-slate-300 focus:border-[#10B981] focus:ring-1 focus:ring-[#10B981]";
  const disabledClasses = "disabled:cursor-not-allowed disabled:bg-slate-50 disabled:text-slate-500";

  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
          {label}
        </label>
      )}
      
      {Component === 'select' ? (
        <select
          ref={ref}
          id={inputId}
          className={`${baseInputClasses} ${stateClasses} ${disabledClasses}`}
          {...props}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>{opt.label}</option>
          ))}
        </select>
      ) : (
        <Component
          ref={ref}
          id={inputId}
          className={`${baseInputClasses} ${stateClasses} ${disabledClasses}`}
          {...props}
        />
      )}

      {(error || helperText) && (
        <p className={`text-xs ${error ? 'text-[#EF4444]' : 'text-slate-500'}`} id={`${inputId}-description`}>
          {error || helperText}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
