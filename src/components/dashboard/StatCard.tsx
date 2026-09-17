import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant: 'blue' | 'emerald' | 'amber' | 'purple' | 'rose' | 'slate';
  pulse?: boolean;
  onClick?: () => void;
  active?: boolean;
}

const variantStyles = {
  blue: {
    bg: 'bg-blue-50/70 dark:bg-blue-950/30',
    border: 'border-blue-200 dark:border-blue-900/50',
    iconBg: 'bg-blue-500 text-white',
    text: 'text-blue-600 dark:text-blue-400',
    hover: 'hover:border-blue-400 dark:hover:border-blue-600'
  },
  emerald: {
    bg: 'bg-emerald-50/70 dark:bg-emerald-950/30',
    border: 'border-emerald-200 dark:border-emerald-900/50',
    iconBg: 'bg-emerald-500 text-white',
    text: 'text-emerald-600 dark:text-emerald-400',
    hover: 'hover:border-emerald-400 dark:hover:border-emerald-600'
  },
  amber: {
    bg: 'bg-amber-50/70 dark:bg-amber-950/30',
    border: 'border-amber-200 dark:border-amber-900/50',
    iconBg: 'bg-amber-500 text-white',
    text: 'text-amber-600 dark:text-amber-400',
    hover: 'hover:border-amber-400 dark:hover:border-amber-600'
  },
  purple: {
    bg: 'bg-purple-50/70 dark:bg-purple-950/30',
    border: 'border-purple-200 dark:border-purple-900/50',
    iconBg: 'bg-purple-500 text-white',
    text: 'text-purple-600 dark:text-purple-400',
    hover: 'hover:border-purple-400 dark:hover:border-purple-600'
  },
  rose: {
    bg: 'bg-rose-50/70 dark:bg-rose-950/30',
    border: 'border-rose-200 dark:border-rose-900/50',
    iconBg: 'bg-rose-500 text-white',
    text: 'text-rose-600 dark:text-rose-400',
    hover: 'hover:border-rose-400 dark:hover:border-rose-600'
  },
  slate: {
    bg: 'bg-slate-50/70 dark:bg-slate-900/30',
    border: 'border-slate-200 dark:border-slate-800',
    iconBg: 'bg-slate-600 text-white',
    text: 'text-slate-700 dark:text-slate-300',
    hover: 'hover:border-slate-400'
  }
};

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon: Icon,
  variant,
  pulse = false,
  onClick,
  active = false
}) => {
  const styles = variantStyles[variant];

  return (
    <div
      onClick={onClick}
      className={`relative p-5 rounded-2xl border bg-white shadow-sm transition-all duration-200 ${styles.border} ${styles.hover} ${
        onClick ? 'cursor-pointer hover:shadow-md active:scale-[0.98]' : ''
      } ${active ? 'ring-2 ring-blue-500 ring-offset-2' : ''}`}
    >
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 font-mono">
              {value}
            </span>
            {pulse && (
              <span className="flex h-2.5 w-2.5 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            )}
          </div>
          {subtitle && (
            <p className="text-[11px] text-slate-500 font-medium">
              {subtitle}
            </p>
          )}
        </div>

        <div className={`p-3 rounded-xl shadow-inner ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
