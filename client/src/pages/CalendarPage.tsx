import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  CalendarDays, 
  Clock, 
  Bell, 
  Trash2, 
  Plus, 
  AlertCircle, 
  CheckCircle2, 
  ExternalLink,
  Building2,
  Calendar as CalendarIcon
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { api } from '../services/api';
import { Opportunity } from '../types';

export const CalendarPage: React.FC = () => {
  const { reminders, deleteReminder, savedOpportunities, createReminder, showToast } = useApp();
  const [allOpportunities, setAllOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // New Reminder modal
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOppId, setSelectedOppId] = useState('');
  const [reminderDate, setReminderDate] = useState('');
  const [reminderType, setReminderType] = useState<'in_app' | 'email'>('in_app');
  const [reminderNotes, setReminderNotes] = useState('');

  useEffect(() => {
    const fetchOpps = async () => {
      setLoading(true);
      try {
        const opps = await api.getOpportunities({ sort: 'deadline' });
        setAllOpportunities(opps);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOpps();
  }, []);

  const now = new Date();

  // Upcoming sorted opportunities
  const upcomingDeadlines = allOpportunities.filter((opp) => {
    const diff = (new Date(opp.application_deadline).getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diff > -5; // show recent or upcoming
  });

  const handleAddReminderSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedOppId || !reminderDate) {
      showToast('Please pick an opportunity and reminder date', 'error');
      return;
    }

    await createReminder(selectedOppId, new Date(reminderDate).toISOString(), reminderNotes);
    setModalOpen(false);
    setSelectedOppId('');
    setReminderDate('');
    setReminderNotes('');
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider mb-1">
            <CalendarDays className="w-4 h-4" />
            <span>Time Management & Notifications</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Deadlines & Reminders
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Track critical application deadlines and schedule automated in-app reminder alerts.
          </p>
        </div>

        <button
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Reminder</span>
        </button>
      </div>

      {/* Active Reminders Card */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" />
            <h2 className="text-base font-bold text-slate-900">Your Scheduled Reminders ({reminders.length})</h2>
          </div>
          <span className="text-xs text-slate-400 font-medium">In-app & simulated email dispatch</span>
        </div>

        {reminders.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No custom reminders scheduled. Click "Add Custom Reminder" above or set one directly from any opportunity page.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {reminders.map((rem) => {
              const opp = rem.opportunity || allOpportunities.find(o => o.id === rem.opportunity_id);
              const remDate = new Date(rem.reminder_date);
              return (
                <div
                  key={rem.id}
                  className="p-4 rounded-2xl bg-indigo-50/50 border border-brand-100 flex items-start justify-between gap-3"
                >
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-brand-100 text-brand-800 uppercase">
                        {rem.reminder_type === 'email' ? 'Email + In-app' : 'In-App Alert'}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {remDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>

                    <Link
                      to={`/opportunities/${rem.opportunity_id}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 truncate block"
                    >
                      {opp?.title || 'Opportunity Reminder'}
                    </Link>

                    {rem.notes && (
                      <p className="text-xs text-slate-600 mt-1 italic">
                        "{rem.notes}"
                      </p>
                    )}
                  </div>

                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg hover:bg-rose-50 transition-colors"
                    title="Delete reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Comprehensive Deadlines Timeline */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
        <h2 className="text-base font-bold text-slate-900 mb-1 flex items-center gap-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <span>Chronological Deadline Schedule</span>
        </h2>
        <p className="text-xs text-slate-500 mb-6">
          All verified national scholarships, internships, and hackathons sorted by closing date.
        </p>

        {loading ? (
          <div className="space-y-3">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-16 bg-slate-100 rounded-2xl animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="space-y-3">
            {upcomingDeadlines.map((opp) => {
              const dl = new Date(opp.application_deadline);
              const daysLeft = Math.ceil((dl.getTime() - now.getTime()) / (1000 * 3600 * 24));
              const isPast = daysLeft < 0;
              const isUrgent = daysLeft >= 0 && daysLeft <= 7;

              return (
                <div
                  key={opp.id}
                  className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                    isUrgent
                      ? 'bg-amber-50/50 border-amber-200 hover:bg-amber-50'
                      : isPast
                      ? 'bg-slate-50/50 border-slate-200 opacity-60'
                      : 'bg-white border-slate-200/80 hover:bg-slate-50'
                  }`}
                >
                  <div className="min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                        {opp.category}
                      </span>
                      <span className="text-xs text-slate-500 font-medium">{opp.delivery_mode}</span>
                    </div>

                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="text-xs sm:text-sm font-bold text-slate-900 hover:text-brand-600 truncate block"
                    >
                      {opp.title}
                    </Link>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 mt-0.5">
                      <Building2 className="w-3.5 h-3.5 text-slate-400" />
                      <span>{opp.organization}</span>
                      <span className="mx-1">•</span>
                      <span>{opp.location}</span>
                    </div>
                  </div>

                  {/* Deadline countdown & quick action */}
                  <div className="flex items-center justify-between sm:justify-end gap-3 self-stretch sm:self-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
                    <div className="text-left sm:text-right">
                      <div className="text-xs font-bold text-slate-900">
                        {dl.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </div>
                      <div className={`text-[11px] font-semibold ${
                        isPast ? 'text-rose-500' : isUrgent ? 'text-amber-600 animate-pulse' : 'text-slate-500'
                      }`}>
                        {isPast ? 'Closed' : isUrgent ? `Closing in ${daysLeft} days!` : `${daysLeft} days remaining`}
                      </div>
                    </div>

                    <Link
                      to={`/opportunities/${opp.id}`}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-brand-50 hover:text-brand-600 text-slate-700 text-xs font-semibold transition-colors"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Add Reminder Modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl border border-slate-200">
            <h3 className="text-base font-bold text-slate-900 mb-1">Set Deadline Reminder</h3>
            <p className="text-xs text-slate-500 mb-4">
              Select an opportunity and choose when you'd like to be reminded.
            </p>

            <form onSubmit={handleAddReminderSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Select Opportunity *</label>
                <select
                  value={selectedOppId}
                  onChange={(e) => setSelectedOppId(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 bg-white"
                >
                  <option value="">-- Choose an opportunity --</option>
                  {allOpportunities.map(opp => (
                    <option key={opp.id} value={opp.id}>
                      {opp.title} ({opp.organization})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Reminder Date *</label>
                <input
                  type="date"
                  value={reminderDate}
                  onChange={(e) => setReminderDate(e.target.value)}
                  required
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Notification Delivery</label>
                <select
                  value={reminderType}
                  onChange={(e) => setReminderType(e.target.value as any)}
                  className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 bg-white"
                >
                  <option value="in_app">In-App Notification</option>
                  <option value="email">Email + In-App Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Preparation Note</label>
                <input
                  type="text"
                  value={reminderNotes}
                  onChange={(e) => setReminderNotes(e.target.value)}
                  placeholder="e.g. Gather letters of recommendation"
                  className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-bold bg-brand-600 hover:bg-brand-700 text-white rounded-xl shadow-md"
                >
                  Schedule Reminder
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
