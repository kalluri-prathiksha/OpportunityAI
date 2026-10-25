import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  MapPin, 
  Bookmark, 
  Sparkles, 
  ArrowRight, 
  Building2, 
  CheckCircle2, 
  Coins, 
  PlusCircle,
  ExternalLink 
} from 'lucide-react';
import { Opportunity } from '../types';
import { MatchScoreBadge } from './MatchScoreBadge';
import { useApp } from '../context/AppContext';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onTrack?: () => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({ opportunity, onTrack }) => {
  const { toggleSave, isSaved, addToTracker } = useApp();
  const saved = isSaved(opportunity.id);

  // Format deadline date
  const deadlineDate = new Date(opportunity.application_deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isPast = diffDays < 0;

  // Category badge colors
  const categoryStyles: Record<string, string> = {
    Scholarships: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    Internships: 'bg-blue-50 text-blue-700 border-blue-200',
    Hackathons: 'bg-purple-50 text-purple-700 border-purple-200',
    Competitions: 'bg-amber-50 text-amber-700 border-amber-200',
    'Training programs': 'bg-cyan-50 text-cyan-700 border-cyan-200',
    Fellowships: 'bg-rose-50 text-rose-700 border-rose-200',
    'Online courses': 'bg-indigo-50 text-indigo-700 border-indigo-200',
  };

  const catStyle = categoryStyles[opportunity.category] || 'bg-slate-100 text-slate-700 border-slate-200';

  return (
    <div className="group relative bg-white border border-slate-200/80 rounded-2xl p-5 shadow-soft hover:shadow-card hover:border-brand-200 transition-all duration-200 flex flex-col justify-between">
      {/* Top Bar: Category Pill & Save Button */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>
              {opportunity.category}
            </span>
            <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
              {opportunity.delivery_mode}
            </span>
            {opportunity.is_demo_data && (
              <span className="text-[11px] font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200/70" title="Curated realistic sample data for demonstration">
                Demo Data
              </span>
            )}
          </div>

          <button
            onClick={() => toggleSave(opportunity)}
            aria-label={saved ? "Unsave opportunity" : "Save opportunity"}
            className={`p-2 rounded-xl transition-all ${
              saved
                ? 'bg-rose-50 text-rose-500 hover:bg-rose-100'
                : 'bg-slate-50 text-slate-400 hover:text-slate-600 hover:bg-slate-100'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current text-rose-500' : ''}`} />
          </button>
        </div>

        {/* Title & Organization */}
        <div className="mb-2">
          <Link
            to={`/opportunities/${opportunity.id}`}
            className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-brand-600 transition-colors line-clamp-2"
          >
            {opportunity.title}
          </Link>
          <div className="flex items-center gap-1.5 text-xs font-medium text-slate-500 mt-1">
            <Building2 className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate">{opportunity.organization}</span>
            {opportunity.verification_status === 'verified' && (
              <span title="Verified Opportunity">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 flex-shrink-0" />
              </span>
            )}
          </div>
        </div>

        {/* AI Match Explanation Box */}
        {opportunity.aiMatch && (
          <div className="my-3 p-3 rounded-xl bg-gradient-to-r from-brand-50/70 to-accent-50/50 border border-brand-100 text-xs">
            <div className="flex items-center justify-between mb-1.5">
              <div className="flex items-center gap-1.5 font-bold text-brand-900">
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>AI Personalized Match</span>
              </div>
              <MatchScoreBadge score={opportunity.aiMatch.score} size="sm" />
            </div>
            <p className="text-slate-700 leading-relaxed font-normal">
              {opportunity.aiMatch.summaryExplanation}
            </p>
          </div>
        )}

        {/* Eligibility Snippet */}
        <div className="text-xs text-slate-600 mb-3 line-clamp-2">
          <span className="font-semibold text-slate-700">Eligibility: </span>
          {opportunity.eligibility_requirements}
        </div>

        {/* Required Skills Badges */}
        {opportunity.required_skills && opportunity.required_skills.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {opportunity.required_skills.slice(0, 4).map((skill, index) => (
              <span
                key={index}
                className="text-[11px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded-md"
              >
                {skill}
              </span>
            ))}
            {opportunity.required_skills.length > 4 && (
              <span className="text-[11px] font-medium bg-slate-50 text-slate-400 px-1.5 py-0.5 rounded">
                +{opportunity.required_skills.length - 4} more
              </span>
            )}
          </div>
        )}
      </div>

      {/* Card Footer: Metadata and Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex flex-col gap-3">
        <div className="flex items-center justify-between text-xs text-slate-500">
          <div className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <span className="truncate max-w-[120px]">{opportunity.location}</span>
          </div>

          {opportunity.stipend_or_prize && (
            <div className="flex items-center gap-1 text-slate-700 font-medium">
              <Coins className="w-3.5 h-3.5 text-amber-500" />
              <span className="truncate max-w-[150px]">{opportunity.stipend_or_prize}</span>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between text-xs pt-1">
          <div className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span className={isPast ? 'text-rose-600 font-semibold' : isClosingSoon ? 'text-amber-600 font-semibold' : 'text-slate-600'}>
              {isPast ? 'Deadline Passed' : isClosingSoon ? `Closes in ${diffDays} days` : deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onTrack ? onTrack() : addToTracker(opportunity.id, 'Interested')}
              className="text-xs font-medium text-slate-600 hover:text-brand-600 p-1.5 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1"
              title="Add to Application Tracker"
            >
              <PlusCircle className="w-4 h-4 text-brand-500" />
              <span className="hidden sm:inline">Track</span>
            </button>

            <Link
              to={`/opportunities/${opportunity.id}`}
              className="inline-flex items-center gap-1 text-xs font-semibold px-3 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white transition-all shadow-sm shadow-brand-500/20"
            >
              <span>View</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
