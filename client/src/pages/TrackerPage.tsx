import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import confetti from 'canvas-confetti';
import { 
  KanbanSquare, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Trash2, 
  Edit3, 
  Save, 
  CheckSquare, 
  Square, 
  ArrowRight, 
  Building2, 
  ListFilter,
  Trophy,
  ExternalLink,
  ChevronDown,
  Sparkles
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { ApplicationItem, ApplicationStatus } from '../types';
import { api } from '../services/api';

const STATUS_COLUMNS: { status: ApplicationStatus; label: string; color: string; badgeBg: string }[] = [
  { status: 'Interested', label: 'Interested', color: 'border-slate-300', badgeBg: 'bg-slate-100 text-slate-700' },
  { status: 'Preparing application', label: 'Preparing', color: 'border-blue-300', badgeBg: 'bg-blue-50 text-blue-700' },
  { status: 'Applied', label: 'Applied', color: 'border-purple-300', badgeBg: 'bg-purple-50 text-purple-700' },
  { status: 'Assessment or interview', label: 'Interview/Screening', color: 'border-amber-300', badgeBg: 'bg-amber-50 text-amber-700' },
  { status: 'Accepted', label: 'Accepted 🎉', color: 'border-emerald-300', badgeBg: 'bg-emerald-50 text-emerald-700' },
  { status: 'Rejected', label: 'Rejected', color: 'border-rose-200', badgeBg: 'bg-rose-50 text-rose-700' },
  { status: 'Withdrawn', label: 'Withdrawn', color: 'border-slate-200', badgeBg: 'bg-slate-100 text-slate-500' },
];

export const TrackerPage: React.FC = () => {
  const { applications, updateApplicationStatus, deleteApplication, showToast, refreshAllData } = useApp();
  const [activeTab, setActiveTab] = useState<string>('All');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editNotes, setEditNotes] = useState('');
  const [editNextAction, setEditNextAction] = useState('');

  const handleStatusChange = async (appId: string, newStatus: ApplicationStatus) => {
    if (newStatus === 'Accepted') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
    await updateApplicationStatus(appId, newStatus);
  };

  const handleStartEdit = (app: ApplicationItem) => {
    setEditingId(app.id);
    setEditNotes(app.personal_notes || '');
    setEditNextAction(app.next_action || '');
  };

  const handleSaveEdit = async (appId: string) => {
    try {
      await api.updateApplication(appId, {
        personal_notes: editNotes,
        next_action: editNextAction,
      });
      await refreshAllData();
      setEditingId(null);
      showToast('Application notes updated', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const handleToggleChecklist = async (checkId: string) => {
    try {
      await api.toggleChecklist(checkId);
      await refreshAllData();
    } catch (err: any) {
      showToast('Could not update checklist item', 'error');
    }
  };

  const filteredApps = applications.filter((app) => {
    if (activeTab === 'All') return true;
    return app.status === activeTab;
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-purple-600 uppercase tracking-wider mb-1">
          <KanbanSquare className="w-4 h-4" />
          <span>Active Pipeline Management</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Application Tracker ({applications.length})
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Monitor your preparation milestones, interview schedules, checklist tasks, and final outcomes.
        </p>
      </div>

      {/* Status Filter Tabs */}
      <div className="bg-white p-3 rounded-2xl border border-slate-200/90 shadow-soft flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('All')}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
            activeTab === 'All'
              ? 'bg-brand-600 text-white'
              : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
          }`}
        >
          All Applications ({applications.length})
        </button>

        {STATUS_COLUMNS.map((col) => {
          const count = applications.filter(a => a.status === col.status).length;
          return (
            <button
              key={col.status}
              onClick={() => setActiveTab(col.status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === col.status
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {col.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applications List */}
      {filteredApps.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <KanbanSquare className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-base font-bold text-slate-900">No applications in this stage</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Add opportunities from the directory or saved bookmarks to track your application lifecycle.
          </p>
          <Link
            to="/explore"
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
          >
            <span>Browse Opportunities</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApps.map((app) => {
            const opp = app.opportunity;
            const completedCount = (app.checklists || []).filter(c => c.is_completed).length;
            const totalChecklist = (app.checklists || []).length;
            const progressPercent = totalChecklist > 0 ? Math.round((completedCount / totalChecklist) * 100) : 0;
            const isEditing = editingId === app.id;

            return (
              <div
                key={app.id}
                className="bg-white rounded-3xl border border-slate-200/90 shadow-soft p-5 sm:p-6 transition-all"
              >
                {/* Header: Title, Org, Status Selector, and Delete */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-100">
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {opp?.category && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                          {opp.category}
                        </span>
                      )}
                      {app.status === 'Accepted' && (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 flex items-center gap-1">
                          <Trophy className="w-3 h-3 text-emerald-600" />
                          <span>Accepted!</span>
                        </span>
                      )}
                    </div>
                    <Link
                      to={`/opportunities/${app.opportunity_id}`}
                      className="text-base sm:text-lg font-bold text-slate-900 hover:text-brand-600 transition-colors line-clamp-1"
                    >
                      {opp?.title || 'Tracked Opportunity'}
                    </Link>
                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp?.organization || 'Organization'}</span>
                      {opp?.application_deadline && (
                        <>
                          <span className="mx-1">•</span>
                          <Calendar className="w-3.5 h-3.5 text-slate-400" />
                          <span>Deadline: {new Date(opp.application_deadline).toLocaleDateString()}</span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Status Dropdown & Delete */}
                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={(e) => handleStatusChange(app.id, e.target.value as ApplicationStatus)}
                        className="text-xs font-bold py-2 pl-3 pr-8 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-800 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                      >
                        {STATUS_COLUMNS.map(col => (
                          <option key={col.status} value={col.status}>
                            Status: {col.label}
                          </option>
                        ))}
                      </select>
                    </div>

                    <button
                      onClick={() => deleteApplication(app.id)}
                      className="p-2 text-slate-400 hover:text-rose-500 hover:bg-rose-50 rounded-xl transition-colors"
                      title="Remove from tracker"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Progress Bar for Checklists */}
                {totalChecklist > 0 && (
                  <div className="my-4">
                    <div className="flex items-center justify-between text-xs font-medium text-slate-500 mb-1.5">
                      <span className="flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-brand-500" />
                        <span>Preparation Checklist ({completedCount} of {totalChecklist} completed)</span>
                      </span>
                      <span className="font-bold text-slate-700">{progressPercent}%</span>
                    </div>
                    <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-300"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Middle: Checklist Items Grid */}
                {app.checklists && app.checklists.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 my-4 bg-slate-50 p-4 rounded-2xl border border-slate-200/80">
                    {app.checklists.map((chk) => (
                      <div
                        key={chk.id}
                        onClick={() => handleToggleChecklist(chk.id)}
                        className="flex items-center gap-2.5 p-1.5 rounded-lg hover:bg-white cursor-pointer transition-colors text-xs text-slate-700"
                      >
                        {chk.is_completed ? (
                          <CheckSquare className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        ) : (
                          <Square className="w-4 h-4 text-slate-300 flex-shrink-0" />
                        )}
                        <span className={chk.is_completed ? 'line-through text-slate-400' : 'font-medium'}>
                          {chk.task_title}
                        </span>
                      </div>
                    ))}
                  </div>
                )}

                {/* Notes & Next Action */}
                <div className="pt-3 border-t border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs">
                  {isEditing ? (
                    <div className="w-full space-y-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Personal Notes</label>
                        <input
                          type="text"
                          value={editNotes}
                          onChange={(e) => setEditNotes(e.target.value)}
                          placeholder="Your application notes..."
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-slate-500 mb-1">Next Action</label>
                        <input
                          type="text"
                          value={editNextAction}
                          onChange={(e) => setEditNextAction(e.target.value)}
                          placeholder="e.g. Follow up on recommendation letter"
                          className="w-full px-3 py-1.5 rounded-lg border border-slate-200 text-xs"
                        />
                      </div>
                      <div className="flex gap-2 justify-end">
                        <button
                          onClick={() => setEditingId(null)}
                          className="px-3 py-1 rounded-lg text-slate-600 hover:bg-slate-100"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={() => handleSaveEdit(app.id)}
                          className="px-3 py-1 rounded-lg bg-brand-600 text-white font-bold flex items-center gap-1"
                        >
                          <Save className="w-3.5 h-3.5" />
                          <span>Save</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="space-y-1">
                        <div className="text-slate-700">
                          <strong className="text-slate-900">Next Action:</strong> {app.next_action || 'Prepare application draft'}
                        </div>
                        {app.personal_notes && (
                          <div className="text-slate-500 italic">
                            "{app.personal_notes}"
                          </div>
                        )}
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleStartEdit(app)}
                          className="text-xs font-semibold text-slate-500 hover:text-slate-800 flex items-center gap-1"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                          <span>Edit Notes</span>
                        </button>

                        {opp?.application_url && (
                          <a
                            href={opp.application_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
                          >
                            <span>Application Portal</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
