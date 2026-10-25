import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  CheckCheck, 
  Sparkles, 
  Clock, 
  KanbanSquare, 
  Info, 
  ArrowRight,
  Check
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const NotificationsPage: React.FC = () => {
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const [filterType, setFilterType] = useState<string>('all');
  const navigate = useNavigate();

  const filtered = notifications.filter((notif) => {
    if (filterType === 'all') return true;
    return notif.type === filterType;
  });

  const getIcon = (type: string) => {
    switch (type) {
      case 'recommendation':
        return <Sparkles className="w-4 h-4 text-brand-600" />;
      case 'deadline':
        return <Clock className="w-4 h-4 text-amber-500" />;
      case 'application_update':
        return <KanbanSquare className="w-4 h-4 text-purple-600" />;
      default:
        return <Info className="w-4 h-4 text-blue-500" />;
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 pb-12">
      {/* Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
            <Bell className="w-4 h-4" />
            <span>Alerts & Updates</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Notifications ({notifications.length})
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Stay updated with new AI matches, approaching deadlines, and application status changes.
          </p>
        </div>

        {unreadNotifCount > 0 && (
          <button
            onClick={markAllNotificationsRead}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors self-start sm:self-auto"
          >
            <CheckCheck className="w-4 h-4 text-brand-600" />
            <span>Mark all as read</span>
          </button>
        )}
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-2.5 rounded-2xl border border-slate-200/90 shadow-soft flex items-center gap-1.5 overflow-x-auto no-scrollbar">
        {[
          { id: 'all', label: 'All Alerts' },
          { id: 'recommendation', label: 'AI Matches' },
          { id: 'deadline', label: 'Deadlines' },
          { id: 'application_update', label: 'Application Updates' },
          { id: 'system', label: 'System' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setFilterType(tab.id)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
              filterType === tab.id
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Notifications List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
            <Bell className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-900">No notifications</h3>
            <p className="text-xs text-slate-500 mt-1">
              You're all caught up! As opportunities change or deadlines approach, updates will appear here.
            </p>
          </div>
        ) : (
          filtered.map((notif) => (
            <div
              key={notif.id}
              onClick={() => {
                if (!notif.is_read) markNotificationRead(notif.id);
                if (notif.link) navigate(notif.link);
              }}
              className={`p-4 sm:p-5 rounded-2xl border transition-all cursor-pointer flex items-start gap-4 ${
                !notif.is_read
                  ? 'bg-indigo-50/40 border-brand-200 shadow-sm'
                  : 'bg-white border-slate-200/80 hover:bg-slate-50'
              }`}
            >
              <div className="w-9 h-9 rounded-xl bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                {getIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className={`text-xs sm:text-sm font-bold ${!notif.is_read ? 'text-brand-900' : 'text-slate-900'}`}>
                    {notif.title}
                  </h3>
                  <span className="text-[10px] text-slate-400 whitespace-nowrap">
                    {new Date(notif.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {notif.message}
                </p>

                {notif.link && (
                  <div className="mt-2 inline-flex items-center gap-1 text-[11px] font-bold text-brand-600 hover:underline">
                    <span>View opportunity</span>
                    <ArrowRight className="w-3 h-3" />
                  </div>
                )}
              </div>

              {!notif.is_read && (
                <div className="w-2.5 h-2.5 rounded-full bg-brand-500 flex-shrink-0 mt-2" title="Unread" />
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
};
