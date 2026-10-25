import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  Calendar, 
  Coins, 
  Sparkles, 
  Bookmark, 
  PlusCircle, 
  ExternalLink, 
  CheckCircle2, 
  AlertCircle, 
  ArrowLeft, 
  Bell, 
  Check, 
  Share2,
  Clock,
  Layers,
  GraduationCap
} from 'lucide-react';
import { Opportunity, ApplicationStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { MatchScoreBadge } from '../components/MatchScoreBadge';

export const OpportunityDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { profile } = useAuth();
  const { 
    isSaved, 
    toggleSave, 
    addToTracker, 
    createReminder, 
    showToast 
  } = useApp();

  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Reminder Modal
  const [reminderModalOpen, setReminderModalOpen] = useState(false);
  const [reminderDate, setReminderDate] = useState('');
  const [reminderNotes, setReminderNotes] = useState('');

  // Tracker Modal
  const [trackerModalOpen, setTrackerModalOpen] = useState(false);
  const [trackStatus, setTrackStatus] = useState<ApplicationStatus>('Interested');
  const [trackNotes, setTrackNotes] = useState('');

  useEffect(() => {
    const fetchOpportunity = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await api.getOpportunity(id);
        setOpp(data);
        if (data.application_deadline) {
          // Default reminder 3 days prior
          const dl = new Date(data.application_deadline);
          dl.setDate(dl.getDate() - 3);
          setReminderDate(dl.toISOString().slice(0, 10));
        }
      } catch (err: any) {
        setError(err.message || 'Could not load opportunity');
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunity();
  }, [id, profile]);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-12">
        <div className="h-96 bg-white rounded-3xl border border-slate-200 animate-pulse p-8" />
      </div>
    );
  }

  if (error || !opp) {
    return (
      <div className="max-w-md mx-auto text-center py-20">
        <AlertCircle className="w-12 h-12 text-rose-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Opportunity Not Found</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6">{error || 'This listing does not exist.'}</p>
        <Link
          to="/explore"
          className="px-5 py-2.5 rounded-xl bg-brand-600 text-white font-bold text-xs"
        >
          Back to Directory
        </Link>
      </div>
    );
  }

  const saved = isSaved(opp.id);
  const deadlineDate = new Date(opp.application_deadline);
  const now = new Date();
  const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  const isClosingSoon = diffDays > 0 && diffDays <= 7;
  const isPast = diffDays < 0;

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      showToast('Opportunity URL copied to clipboard!', 'info');
    }
  };

  const handleCreateReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!reminderDate) return;
    await createReminder(opp.id, new Date(reminderDate).toISOString(), reminderNotes);
    setReminderModalOpen(false);
  };

  const handleAddToTrackerSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addToTracker(opp.id, trackStatus, trackNotes);
    setTrackerModalOpen(false);
  };

  const studentSkills = (profile?.skills || []).map(s => s.toLowerCase());

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      
      {/* Top Navigation Breadcrumb */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </Link>

        <button
          onClick={handleShare}
          className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors text-xs font-medium inline-flex items-center gap-1.5"
        >
          <Share2 className="w-4 h-4" />
          <span className="hidden sm:inline">Share</span>
        </button>
      </div>

      {/* Main Header Card */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 text-brand-700 border border-brand-200">
                {opp.category}
              </span>
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-600 border border-slate-200">
                {opp.delivery_mode}
              </span>
              {opp.verification_status === 'verified' && (
                <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Verified Listing</span>
                </span>
              )}
              {opp.is_demo_data && (
                <span className="text-xs font-medium px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">
                  Demo Data
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {opp.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-slate-600 font-medium">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>{opp.organization}</span>
              {opp.source_url && (
                <a
                  href={opp.source_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-brand-600 hover:underline inline-flex items-center gap-0.5"
                >
                  <span>Official Org</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              )}
            </div>
          </div>

          {/* AI Score Badge in Header */}
          {opp.aiMatch && (
            <div className="flex-shrink-0 self-start">
              <MatchScoreBadge score={opp.aiMatch.score} size="lg" />
            </div>
          )}
        </div>

        {/* Quick Highlights Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div>
            <span className="text-xs text-slate-400 block font-medium">Location</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span className="truncate">{opp.location}</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Benefits / Stipend</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Coins className="w-3.5 h-3.5 text-amber-500 flex-shrink-0" />
              <span className="truncate">{opp.stipend_or_prize || 'N/A'}</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Application Deadline</span>
            <span className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1 mt-0.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
              <span>{deadlineDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </span>
          </div>

          <div>
            <span className="text-xs text-slate-400 block font-medium">Urgency</span>
            <span className={`text-xs sm:text-sm font-bold flex items-center gap-1 mt-0.5 ${
              isPast ? 'text-rose-600' : isClosingSoon ? 'text-amber-600' : 'text-emerald-600'
            }`}>
              <Clock className="w-3.5 h-3.5 flex-shrink-0" />
              <span>{isPast ? 'Closed' : isClosingSoon ? `${diffDays} days left!` : `${diffDays} days remaining`}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons Row */}
        <div className="flex flex-wrap items-center gap-3 mt-6 pt-6 border-t border-slate-100">
          <a
            href={opp.application_url}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 sm:flex-none px-6 py-3 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <span>Open Application Website</span>
            <ExternalLink className="w-4 h-4" />
          </a>

          <button
            onClick={() => setTrackerModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-indigo-50 hover:bg-indigo-100 text-brand-700 font-bold text-xs sm:text-sm border border-brand-200 transition-colors flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4 text-brand-600" />
            <span>Add to Application Tracker</span>
          </button>

          <button
            onClick={() => setReminderModalOpen(true)}
            className="px-4 py-3 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs sm:text-sm transition-colors flex items-center gap-1.5"
          >
            <Bell className="w-4 h-4 text-slate-500" />
            <span>Set Reminder</span>
          </button>

          <button
            onClick={() => toggleSave(opp)}
            className={`p-3 rounded-2xl border transition-all ${
              saved
                ? 'bg-rose-50 border-rose-200 text-rose-600 hover:bg-rose-100'
                : 'bg-white border-slate-200 text-slate-500 hover:bg-slate-50 hover:text-slate-700'
            }`}
            title={saved ? 'Remove from saved' : 'Save opportunity'}
          >
            <Bookmark className={`w-4 h-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* AI Semantic Match Intelligence Breakdown */}
      {opp.aiMatch && (
        <div className="bg-gradient-to-br from-indigo-50/70 via-white to-purple-50/40 p-6 sm:p-8 rounded-3xl border border-brand-200 shadow-soft">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-brand-100 mb-6">
            <div className="flex items-center gap-2.5">
              <div className="w-10 h-10 rounded-2xl bg-brand-500 text-white flex items-center justify-center shadow-md shadow-brand-500/30">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-slate-900">Personalized AI Match Intelligence</h2>
                <p className="text-xs text-slate-500">Evaluated against student profile qualifications and skill ontology</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className={`text-xs font-bold px-3 py-1 rounded-full border ${
                opp.aiMatch.eligibilityStatus.includes('Confirmed')
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                  : 'bg-amber-50 text-amber-800 border-amber-300'
              }`}>
                {opp.aiMatch.eligibilityStatus}
              </span>
            </div>
          </div>

          {/* Explanation Text */}
          <div className="p-4 rounded-2xl bg-white border border-brand-100 text-xs sm:text-sm text-slate-800 font-medium leading-relaxed mb-6 shadow-sm">
            "{opp.aiMatch.summaryExplanation}"
          </div>

          {/* Breakdown Bars */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Skills Overlap</span>
                <span className="font-bold text-slate-800">{opp.aiMatch.breakdown.skillsMatch}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-emerald-500 rounded-full"
                  style={{ width: `${opp.aiMatch.breakdown.skillsMatch}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Degree & Year</span>
                <span className="font-bold text-slate-800">{opp.aiMatch.breakdown.educationMatch}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-brand-500 rounded-full"
                  style={{ width: `${opp.aiMatch.breakdown.educationMatch}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Interests & Goals</span>
                <span className="font-bold text-slate-800">{opp.aiMatch.breakdown.interestsMatch}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-purple-500 rounded-full"
                  style={{ width: `${opp.aiMatch.breakdown.interestsMatch}%` }}
                />
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
                <span>Delivery Mode</span>
                <span className="font-bold text-slate-800">{opp.aiMatch.breakdown.modeMatch}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-500 rounded-full"
                  style={{ width: `${opp.aiMatch.breakdown.modeMatch}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Description & Details Sections */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        
        {/* Left 2 Cols: Description & Eligibility */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 mb-3">About this Opportunity</h2>
            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {opp.description}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 mb-3">Eligibility Requirements</h2>
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs sm:text-sm text-slate-700 leading-relaxed mb-4">
              {opp.eligibility_requirements}
            </div>

            {opp.education_requirements && opp.education_requirements.length > 0 && (
              <div>
                <span className="text-xs font-bold text-slate-800 block mb-2">Accepted Degrees / Majors:</span>
                <div className="flex flex-wrap gap-2">
                  {opp.education_requirements.map((edu, idx) => (
                    <span key={idx} className="text-xs px-2.5 py-1 rounded-lg bg-indigo-50 text-brand-700 border border-indigo-200 font-medium">
                      {edu}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Application Steps */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
            <h2 className="text-base font-bold text-slate-900 mb-4">Application Process</h2>
            <ol className="space-y-3 text-xs sm:text-sm text-slate-700">
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">1</span>
                <span>Review official guidelines and ensure your university transcript and identity documents are updated.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">2</span>
                <span>Tailor your resume and project links to highlight the required skills listed below.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">3</span>
                <span>Submit through the official portal before the deadline ({deadlineDate.toLocaleDateString()}).</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-indigo-50 text-brand-700 font-bold flex items-center justify-center flex-shrink-0 text-xs">4</span>
                <span>Save your confirmation number and track your progress in the OpportunityAI Application Tracker.</span>
              </li>
            </ol>
          </div>
        </div>

        {/* Right Col: Required Skills & Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
            <h3 className="text-sm font-bold text-slate-900 mb-1">Required Skills</h3>
            <p className="text-xs text-slate-500 mb-3">Green badges indicate skills verified in your student profile</p>

            <div className="flex flex-wrap gap-2">
              {(opp.required_skills || []).map((skill) => {
                const isMatched = studentSkills.some(s => s === skill.toLowerCase() || skill.toLowerCase().includes(s));
                return (
                  <span
                    key={skill}
                    className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-xl border ${
                      isMatched
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                        : 'bg-slate-50 text-slate-700 border-slate-200'
                    }`}
                  >
                    {isMatched ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : null}
                    <span>{skill}</span>
                  </span>
                );
              })}
            </div>
          </div>

          {/* Opportunity Tags */}
          {opp.tags && opp.tags.length > 0 && (
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
              <h3 className="text-sm font-bold text-slate-900 mb-3">Tags & Keywords</h3>
              <div className="flex flex-wrap gap-1.5">
                {opp.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-slate-100 text-slate-600 px-2.5 py-1 rounded-lg">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Safe External Application Notice */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs text-slate-600 space-y-2">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <CheckCircle2 className="w-4 h-4 text-emerald-500" />
              <span>Safe Application Link</span>
            </div>
            <p className="leading-relaxed">
              OpportunityAI links directly to the official host portal. We never collect application fees or share private credentials with third parties.
            </p>
          </div>
        </div>
      </div>

      {/* Reminder Modal */}
      {reminderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Set Deadline Reminder</h3>
            <p className="text-xs text-slate-500 mb-4">
              Receive in-app alerts and notifications before the deadline closes.
            </p>

            <form onSubmit={handleCreateReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Date *</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Personal Note / Checklist</label>
                <input
                  type="text"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="e.g. Gather letter of recommendation from college HOD"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setReminderModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md"
                >
                  Save Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add To Tracker Modal */}
      {trackerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Add to Application Tracker</h3>
            <p className="text-xs text-slate-500 mb-4">
              Track deadlines, steps, notes, and checklist items for {opp.title}.
            </p>

            <form onSubmit={handleAddToTrackerSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Current Status</label>
                <select
                  value={trackStatus}
                  onChange={(e) => setTrackStatus(e.target.value as ApplicationStatus)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none bg-white font-medium"
                >
                  <option value="Interested">Interested</option>
                  <option value="Preparing application">Preparing application</option>
                  <option value="Applied">Applied</option>
                  <option value="Assessment or interview">Assessment or interview</option>
                  <option value="Accepted">Accepted</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Initial Notes (optional)</label>
                <textarea
                  rows={3}
                  value={trackNotes}
                  onChange={(e) => setTrackNotes(e.target.value)}
                  placeholder="e.g. Resume draft prepared, discussing project ideas with team..."
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setTrackerModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md"
                >
                  Add to Tracker
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
