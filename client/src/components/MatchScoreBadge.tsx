import React from 'react';
import { Sparkles } from 'lucide-react';

interface MatchScoreBadgeProps {
  score?: number;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
}

export const MatchScoreBadge: React.FC<MatchScoreBadgeProps> = ({
  score = 75,
  size = 'md',
  showIcon = true,
}) => {
  let badgeColor = 'bg-slate-100 text-slate-700 border-slate-200';
  let label = 'Fair Match';

  if (score >= 90) {
    badgeColor = 'bg-emerald-50 text-emerald-700 border-emerald-200';
    label = 'Elite Match';
  } else if (score >= 75) {
    badgeColor = 'bg-indigo-50 text-indigo-700 border-indigo-200';
    label = 'Strong Match';
  } else if (score >= 60) {
    badgeColor = 'bg-amber-50 text-amber-700 border-amber-200';
    label = 'Good Fit';
  }

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-semibold',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-bold',
  };

  return (
    <div
      className={`inline-flex items-center rounded-full border shadow-sm ${badgeColor} ${sizeClasses[size]}`}
      title={`${label} (${score}%)`}
    >
      {showIcon && <Sparkles className={size === 'sm' ? 'w-3 h-3 text-indigo-500' : 'w-3.5 h-3.5 text-indigo-500 animate-pulse'} />}
      <span>{score}% Match</span>
    </div>
  );
};
