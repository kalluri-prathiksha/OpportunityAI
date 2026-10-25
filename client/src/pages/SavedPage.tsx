import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Bookmark, 
  Trash2, 
  PlusCircle, 
  Calendar, 
  Compass, 
  Building2, 
  Coins, 
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OpportunityCategory } from '../types';
import { MatchScoreBadge } from '../components/MatchScoreBadge';

export const SavedPage: React.FC = () => {
  const { savedOpportunities, toggleSave, addToTracker } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<string>('deadline');

  const categories = ['All', 'Scholarships', 'Internships', 'Hackathons', 'Competitions', 'Training programs', 'Fellowships', 'Online courses'];

  let filtered = savedOpportunities.filter((opp) => {
    if (selectedCategory === 'All') return true;
    return opp.category === selectedCategory;
  });

  if (sortBy === 'deadline') {
    filtered.sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime());
  } else if (sortBy === 'score') {
    filtered.sort((a, b) => (b.aiMatch?.score || 0) - (a.aiMatch?.score || 0));
  }

  const now = new Date();

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-rose-600 uppercase tracking-wider mb-1">
            <Bookmark className="w-4 h-4 fill-current" />
            <span>Bookmarked Collection</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Saved Opportunities ({savedOpportunities.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Keep track of bookmarks, monitor deadlines, and transition them into your active application pipeline.
          </p>
        </div>

        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs border border-slate-200 shadow-soft self-start sm:self-auto"
        >
          <Compass className="w-4 h-4 text-brand-600" />
          <span>Discover More</span>
        </Link>
      </div>

      {/* Filter and Sort Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-soft flex flex-wrap items-center justify-between gap-3">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-rose-500 text-white shadow-sm'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Sort selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-medium">Sort by:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="text-xs py-1.5 px-2.5 rounded-xl border border-slate-200 bg-white font-medium text-slate-700 focus:outline-none"
          >
            <option value="deadline">Approaching Deadline</option>
            <option value="score">Highest AI Match</option>
          </select>
        </div>
      </div>

      {/* Content Grid */}
      {filtered.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <Bookmark className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No saved opportunities here</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Whenever you find an opportunity you like, click the bookmark icon on its card to save it for later.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
          >
            <Compass className="w-4 h-4" />
            <span>Explore 20+ Opportunities</span>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filtered.map((opp) => {
            const dl = new Date(opp.application_deadline);
            const daysLeft = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 3600 * 24));
            return (
              <div
                key={opp.id}
                className="bg-white p-5 rounded-2xl border border-slate-200/90 shadow-soft hover:shadow-card transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                      {opp.category}
                    </span>
                    <button
                      onClick={() => toggleSave(opp)}
                      className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Remove from saved"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <Link
                    to={`/opportunities/${opp.id}`}
                    className="text-base font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-2"
                  >
                    {opp.title}
                  </Link>

                  <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-1 mb-3">
                    <Building2 className="w-3.5 h-3.5 text-slate-400" />
                    <span className="truncate">{opp.organization}</span>
                  </div>

                  {opp.aiMatch && (
                    <div className="mb-3">
                      <MatchScoreBadge score={opp.aiMatch.score} size="sm" />
                    </div>
                  )}

                  <div className="text-xs text-slate-600 line-clamp-2 mb-4">
                    {opp.description}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-1 text-slate-500 font-medium">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    <span className={daysLeft <= 7 ? 'text-rose-600 font-bold' : ''}>
                      {daysLeft < 0 ? 'Closed' : `${daysLeft}d left`}
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => addToTracker(opp.id, 'Interested')}
                      className="p-1.5 text-xs font-semibold text-brand-600 hover:bg-brand-50 rounded-lg flex items-center gap-1 transition-colors"
                      title="Track application"
                    >
                      <PlusCircle className="w-4 h-4 text-brand-500" />
                      <span>Track</span>
                    </button>

                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="p-1.5 text-xs font-semibold text-slate-700 hover:text-brand-600 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-0.5"
                    >
                      <span>Details</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
