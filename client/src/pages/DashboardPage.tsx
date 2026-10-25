import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Sparkles, 
  Bookmark, 
  KanbanSquare, 
  Calendar, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  Zap, 
  GraduationCap, 
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { Opportunity } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { MatchScoreBadge } from '../components/MatchScoreBadge';

export const DashboardPage: React.FC = () => {
  const { user, profile } = useAuth();
  const { savedOpportunities, applications } = useApp();

  const [recommendations, setRecommendations] = useState<Opportunity[]>([]);
  const [recentOpportunities, setRecentOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [recRes, allOpps] = await Promise.all([
          api.getRecommendations().catch(() => ({ topRecommendations: [] })),
          api.getOpportunities({ sort: 'newest' }).catch(() => []),
        ]);

        setRecommendations(recRes.topRecommendations || []);
        setRecentOpportunities(allOpps.slice(0, 4) || []);
      } catch (err) {
        console.error('Failed to load dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();
  }, [profile]);

  // Compute upcoming deadlines within next 14 days
  const now = new Date();
  const upcomingDeadlines = recommendations
    .filter(opp => {
      const d = new Date(opp.application_deadline);
      const diff = (d.getTime() - now.getTime()) / (1000 * 3600 * 24);
      return diff > 0 && diff <= 20;
    })
    .sort((a, b) => new Date(a.application_deadline).getTime() - new Date(b.application_deadline).getTime())
    .slice(0, 4);

  const eliteMatchesCount = recommendations.filter(r => (r.aiMatch?.score || 0) >= 90).length;

  return (
    <div className="space-y-8 pb-12">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden rounded-3xl gradient-brand text-white p-6 sm:p-8 shadow-card">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>AI Semantic Match Active</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Welcome back, {profile?.full_name || 'Student'}! 👋
          </h1>

          <p className="text-indigo-100 text-xs sm:text-sm mt-1.5 leading-relaxed">
            {profile?.college_university
              ? `${profile.college_university} • ${profile.degree_department} (${profile.current_year})`
              : 'Complete your student profile to unlock high-precision AI semantic rankings.'}
          </p>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <Link
              to="/recommendations"
              className="px-4 py-2 rounded-xl bg-white text-brand-700 hover:bg-indigo-50 font-bold text-xs shadow-sm transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              <span>Explore AI Matchmaker</span>
            </Link>

            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-colors"
            >
              Update Skills & Preferences
            </Link>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute right-0 top-0 -mt-12 -mr-12 w-80 h-80 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Metrics Section (Requirement 5) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        
        {/* Metric 1: Recommended */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Recommended</span>
            <div className="w-8 h-8 rounded-xl bg-indigo-50 text-brand-600 flex items-center justify-center">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {recommendations.length}
            </div>
            <div className="flex items-center gap-1 text-[11px] font-medium text-emerald-600 mt-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>{eliteMatchesCount} Elite Matches (≥90%)</span>
            </div>
          </div>
        </div>

        {/* Metric 2: Saved */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Saved Opportunities</span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center">
              <Bookmark className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {savedOpportunities.length}
            </div>
            <Link to="/saved" className="text-[11px] font-medium text-brand-600 hover:text-brand-700 mt-1 block">
              Manage saved →
            </Link>
          </div>
        </div>

        {/* Metric 3: Applications Tracked */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Active Tracker</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
              <KanbanSquare className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {applications.length}
            </div>
            <Link to="/tracker" className="text-[11px] font-medium text-purple-600 hover:text-purple-700 mt-1 block">
              View pipeline status →
            </Link>
          </div>
        </div>

        {/* Metric 4: Upcoming Deadlines */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-semibold">Closing Soon</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {upcomingDeadlines.length}
            </div>
            <span className="text-[11px] font-medium text-amber-600 mt-1 block">
              Within next 20 days
            </span>
          </div>
        </div>
      </div>

      {/* Main Section: Top Personalized Recommendations */}
      <div>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-5">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">Recommended for You</h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-brand-50 text-brand-700">
                Personalized
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Ranked by semantic alignment with your degree, skills, and specified interests.
            </p>
          </div>

          <Link
            to="/recommendations"
            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1 self-start sm:self-auto"
          >
            <span>Deep Match Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-72 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
            ))}
          </div>
        ) : recommendations.length === 0 ? (
          <div className="text-center py-12 bg-white rounded-3xl border border-slate-200 p-8">
            <Sparkles className="w-10 h-10 text-brand-500 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No recommendations found yet</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-4">
              Try updating your skills and degree in your student profile to unlock high-accuracy semantic matching.
            </p>
            <Link
              to="/profile"
              className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
            >
              Complete Profile
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recommendations.slice(0, 6).map((opp) => (
              <OpportunityCard key={opp.id} opportunity={opp} />
            ))}
          </div>
        )}
      </div>

      {/* Two Column Grid: Upcoming Deadlines & Recently Added */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Widget 1: Upcoming Deadlines */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-amber-500" />
              <h3 className="text-sm font-bold text-slate-900">Upcoming Deadlines</h3>
            </div>
            <Link to="/calendar" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              View Calendar →
            </Link>
          </div>

          <div className="space-y-3">
            {upcomingDeadlines.length === 0 ? (
              <div className="text-xs text-slate-400 py-4 text-center">
                No immediate deadlines in the next 20 days.
              </div>
            ) : (
              upcomingDeadlines.map((opp) => {
                const deadline = new Date(opp.application_deadline);
                const daysLeft = Math.ceil((deadline.getTime() - now.getTime()) / (1000 * 3600 * 24));
                return (
                  <div
                    key={opp.id}
                    className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
                  >
                    <div className="min-w-0">
                      <Link to={`/opportunities/${opp.id}`} className="text-xs font-bold text-slate-900 hover:text-brand-600 truncate block">
                        {opp.title}
                      </Link>
                      <span className="text-[11px] text-slate-500 block truncate">
                        {opp.organization} • {opp.category}
                      </span>
                    </div>

                    <div className="text-right flex-shrink-0">
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        daysLeft <= 7 ? 'bg-rose-50 text-rose-600 border border-rose-200' : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}>
                        {daysLeft} days left
                      </span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* Widget 2: Recently Added Opportunities */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-500" />
              <h3 className="text-sm font-bold text-slate-900">Recently Added Listings</h3>
            </div>
            <Link to="/explore" className="text-xs font-semibold text-brand-600 hover:text-brand-700">
              Browse All →
            </Link>
          </div>

          <div className="space-y-3">
            {recentOpportunities.map((opp) => (
              <div
                key={opp.id}
                className="p-3 rounded-2xl bg-slate-50 border border-slate-200/80 hover:bg-slate-100/70 transition-colors flex items-center justify-between gap-3"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <Link to={`/opportunities/${opp.id}`} className="text-xs font-bold text-slate-900 hover:text-brand-600 truncate">
                      {opp.title}
                    </Link>
                    <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-200/70 text-slate-700">
                      {opp.category}
                    </span>
                  </div>
                  <span className="text-[11px] text-slate-500 block truncate mt-0.5">
                    {opp.organization} • {opp.delivery_mode}
                  </span>
                </div>

                <div className="flex-shrink-0">
                  <Link
                    to={`/opportunities/${opp.id}`}
                    className="text-xs font-bold text-brand-600 hover:text-brand-700"
                  >
                    Details →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
