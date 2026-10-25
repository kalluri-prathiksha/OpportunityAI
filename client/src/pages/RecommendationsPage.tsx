import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  Lightbulb, 
  Award, 
  Target, 
  Sliders, 
  CheckCircle2, 
  Plus, 
  ArrowRight,
  BarChart3
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  Cell 
} from 'recharts';
import { Opportunity } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { OpportunityCard } from '../components/OpportunityCard';

export const RecommendationsPage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTier, setSelectedTier] = useState<string>('all');

  useEffect(() => {
    const fetchRecs = async () => {
      setLoading(true);
      try {
        const res = await api.getRecommendations();
        setOpportunities(res.allRanked || []);
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecs();
  }, [profile]);

  // Skill Gap Analysis: Find the most common missing skills across top 10 opportunities
  const missingSkillsTally: Record<string, number> = {};
  opportunities.slice(0, 15).forEach((opp) => {
    (opp.aiMatch?.missingSkills || []).forEach((skill) => {
      const s = skill.trim();
      missingSkillsTally[s] = (missingSkillsTally[s] || 0) + 1;
    });
  });

  const topMissingSkills = Object.entries(missingSkillsTally)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);

  const handleQuickAddSkill = async (skill: string) => {
    if (!profile) return;
    const existing = profile.skills || [];
    if (existing.includes(skill)) return;

    try {
      await updateProfile({
        skills: [...existing, skill],
      });
      showToast(`Added "${skill}" to your profile! Recalculating AI matches...`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to add skill', 'error');
    }
  };

  // Tier Filter
  const filteredOpportunities = opportunities.filter((opp) => {
    const score = opp.aiMatch?.score || 0;
    if (selectedTier === 'elite') return score >= 90;
    if (selectedTier === 'strong') return score >= 75 && score < 90;
    if (selectedTier === 'good') return score >= 60 && score < 75;
    return true;
  });

  // Chart data
  const chartData = [
    { name: 'Elite (90%+)', count: opportunities.filter(o => (o.aiMatch?.score || 0) >= 90).length, fill: '#10b981' },
    { name: 'Strong (75-89%)', count: opportunities.filter(o => (o.aiMatch?.score || 0) >= 75 && (o.aiMatch?.score || 0) < 90).length, fill: '#6366f1' },
    { name: 'Good Fit (60-74%)', count: opportunities.filter(o => (o.aiMatch?.score || 0) >= 60 && (o.aiMatch?.score || 0) < 75).length, fill: '#f59e0b' },
    { name: 'Baseline (<60%)', count: opportunities.filter(o => (o.aiMatch?.score || 0) < 60).length, fill: '#94a3b8' },
  ];

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Semantic AI Matching & Guidance</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          AI Matchmaker & Skill Gap Analysis
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Our recommendation model evaluates your academic field, verified skills, and career interests against required criteria.
        </p>
      </div>

      {/* Two-Column Analytics: Match Distribution & Skill Gap Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Match Distribution Chart (Recharts) */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                <span>Match Score Distribution</span>
              </h3>
              <span className="text-xs text-slate-400 font-medium">All 20+ Listings</span>
            </div>
            <p className="text-xs text-slate-500 mb-4">
              Real-time score distribution based on your current profile.
            </p>
          </div>

          <div className="h-44 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 10, fill: '#64748b' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}
                  formatter={(value) => [`${value} opportunities`, 'Count']}
                />
                <Bar dataKey="count" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Skill Gap Analyzer Box */}
        <div className="lg:col-span-2 bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 p-6 rounded-3xl border border-brand-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-brand-500 text-white flex items-center justify-center">
                  <Lightbulb className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-900">AI Skill Gap Recommendation</h3>
                  <p className="text-xs text-slate-500">Skills most frequently requested by high-value opportunities</p>
                </div>
              </div>
              <span className="text-xs font-bold text-brand-700 bg-brand-50 px-2.5 py-1 rounded-full border border-brand-200">
                Actionable Advice
              </span>
            </div>

            <p className="text-xs text-slate-700 leading-relaxed mt-3 mb-4">
              Our AI engine identified these high-demand skills missing from your profile. Adding any of these will increase your match score for multiple prestigious internships and fellowships:
            </p>

            <div className="flex flex-wrap gap-2.5">
              {topMissingSkills.length === 0 ? (
                <span className="text-xs text-emerald-600 font-semibold">
                  Fantastic! Your skills cover nearly all target opportunities.
                </span>
              ) : (
                topMissingSkills.map(([skill, count]) => (
                  <button
                    key={skill}
                    onClick={() => handleQuickAddSkill(skill)}
                    className="inline-flex items-center gap-1.5 text-xs font-bold bg-white text-brand-900 px-3.5 py-2 rounded-xl border border-brand-200 hover:border-brand-500 hover:bg-brand-50 transition-all shadow-sm group"
                  >
                    <Plus className="w-3.5 h-3.5 text-brand-500 group-hover:scale-125 transition-transform" />
                    <span>{skill}</span>
                    <span className="text-[10px] font-semibold text-brand-600 bg-brand-50 px-1.5 py-0.5 rounded-md">
                      +{count} matches
                    </span>
                  </button>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-brand-100 flex items-center justify-between text-xs text-slate-500">
            <span>Click any skill pill above to add it to your profile instantly.</span>
          </div>
        </div>
      </div>

      {/* Tier Filter Tabs */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          {[
            { id: 'all', label: 'All Ranked', count: opportunities.length },
            { id: 'elite', label: 'Elite Match (90%+)', count: chartData[0].count },
            { id: 'strong', label: 'Strong Fit (75-89%)', count: chartData[1].count },
            { id: 'good', label: 'Good Fit (60-74%)', count: chartData[2].count },
          ].map((tier) => (
            <button
              key={tier.id}
              onClick={() => setSelectedTier(tier.id)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                selectedTier === tier.id
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/25'
                  : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
              }`}
            >
              {tier.label} ({tier.count})
            </button>
          ))}
        </div>

        <span className="text-xs text-slate-500 font-medium">
          Showing {filteredOpportunities.length} opportunities
        </span>
      </div>

      {/* Ranked Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : filteredOpportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <Sparkles className="w-10 h-10 text-brand-400 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No opportunities in this match tier</h3>
          <p className="text-xs text-slate-500 mt-1 mb-4">
            Try switching to 'All Ranked' or updating your student skills.
          </p>
          <button
            onClick={() => setSelectedTier('all')}
            className="px-4 py-2 rounded-xl bg-brand-600 text-white font-bold text-xs"
          >
            Show All Matches
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredOpportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
};
