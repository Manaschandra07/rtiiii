import React, { useState, useEffect, useRef } from 'react';
import { ChevronDown } from 'lucide-react';

export const CustomSelect = ({ name, value, onChange, options, placeholder, required, disabled, className = '', theme = 'orange' }: any) => {
  const themes: any = {
    orange: {
      ring: '${currentTheme.ring}',
      bgHover: '${currentTheme.bgHover}',
      bgActive: 'bg-orange-50',
      textActive: 'text-orange-700',
    },
    emerald: {
      ring: 'focus-within:ring-emerald-500',
      bgHover: 'hover:bg-emerald-50',
      bgActive: 'bg-emerald-50',
      textActive: 'text-emerald-700',
    },
    navy: {
      ring: 'focus-within:ring-[#06038D]',
      bgHover: 'hover:bg-[#06038D]/10',
      bgActive: 'bg-[#06038D]/10',
      textActive: 'text-[#06038D]',
    }
  };
  const currentTheme = themes[theme] || themes.orange;
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (optionValue: string) => {
    if (disabled) return;
    if (onChange) {
      onChange({ target: { name, value: optionValue, type: 'select-one' } } as any);
    }
    setIsOpen(false);
  };

  const selectedLabel = options.find((o: any) => o.value === value)?.label || placeholder;

  return (
    <div className={`relative w-full ${className}`} ref={containerRef}>
      <div 
        className={`w-full px-4 py-2.5 border border-slate-300 flex items-center justify-between transition-all ${disabled ? 'bg-slate-100 cursor-not-allowed opacity-70' : 'bg-white cursor-pointer focus-within:ring-2 ${currentTheme.ring}'} ${isOpen && !disabled ? 'rounded-t-lg border-b-transparent' : 'rounded-lg'}`}
        onClick={() => !disabled && setIsOpen(!isOpen)}
      >
        <span className={value ? 'text-slate-900' : 'text-slate-500'}>{selectedLabel}</span>
        <ChevronDown className="w-5 h-5 text-slate-400" />
      </div>
      
      {isOpen && !disabled && (
        <div className="absolute z-50 w-full bg-white border border-slate-300 border-t-0 rounded-b-lg shadow-xl max-h-60 overflow-y-auto outline-none">
          {options.map((option: any) => (
            <div 
              key={option.value}
              onClick={() => handleSelect(option.value)}
              className={`px-4 py-2.5 ${currentTheme.bgHover} cursor-pointer text-sm border-b border-slate-50 last:border-0 ${value === option.value ? '' + currentTheme.bgActive + ' ' + currentTheme.textActive + ' font-medium' : 'text-slate-700'}`}
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
      {required && <input type="text" className="absolute inset-0 w-full h-full opacity-0 pointer-events-none -z-10" required disabled={disabled} value={value || ''} onChange={() => {}} tabIndex={-1} />}
    </div>
  );
};
