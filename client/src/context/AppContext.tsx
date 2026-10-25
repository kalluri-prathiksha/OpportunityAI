import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Opportunity, ApplicationItem, ReminderItem, NotificationItem, ApplicationStatus } from '../types';
import { api } from '../services/api';
import { useAuth } from './AuthContext';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface AppContextType {
  savedOpportunities: Opportunity[];
  savedIds: Set<string>;
  applications: ApplicationItem[];
  reminders: ReminderItem[];
  notifications: NotificationItem[];
  unreadNotifCount: number;
  toasts: Toast[];
  showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
  removeToast: (id: string) => void;
  toggleSave: (opportunity: Opportunity) => Promise<void>;
  isSaved: (oppId: string) => boolean;
  addToTracker: (opportunityId: string, status?: ApplicationStatus, notes?: string) => Promise<void>;
  updateApplicationStatus: (appId: string, status: ApplicationStatus) => Promise<void>;
  deleteApplication: (appId: string) => Promise<void>;
  createReminder: (opportunityId: string, reminderDate: string, notes?: string) => Promise<void>;
  deleteReminder: (reminderId: string) => Promise<void>;
  markNotificationRead: (notifId: string) => Promise<void>;
  markAllNotificationsRead: () => Promise<void>;
  refreshAllData: () => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [applications, setApplications] = useState<ApplicationItem[]>([]);
  const [reminders, setReminders] = useState<ReminderItem[]>([]);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: 'success' | 'error' | 'info' = 'success') => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  }, []);

  const removeToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const refreshAllData = useCallback(async () => {
    if (!user) return;
    try {
      const [saved, apps, rems, notifs] = await Promise.all([
        api.getSaved().catch(() => []),
        api.getApplications().catch(() => []),
        api.getReminders().catch(() => []),
        api.getNotifications().catch(() => []),
      ]);

      setSavedOpportunities(saved);
      setSavedIds(new Set(saved.map(s => s.id)));
      setApplications(apps);
      setReminders(rems);
      setNotifications(notifs);
    } catch (err) {
      console.error('Error refreshing app data', err);
    }
  }, [user]);

  useEffect(() => {
    refreshAllData();
  }, [refreshAllData]);

  const toggleSave = async (opp: Opportunity) => {
    if (!user) {
      showToast('Please login to save opportunities', 'info');
      return;
    }

    const alreadySaved = savedIds.has(opp.id);
    if (alreadySaved) {
      try {
        await api.unsaveOpportunity(opp.id);
        setSavedIds(prev => {
          const next = new Set(prev);
          next.delete(opp.id);
          return next;
        });
        setSavedOpportunities(prev => prev.filter(o => o.id !== opp.id));
        showToast(`Removed "${opp.title.slice(0, 30)}..." from saved`, 'info');
      } catch (err: any) {
        showToast(err.message || 'Failed to remove opportunity', 'error');
      }
    } else {
      try {
        await api.saveOpportunity(opp.id);
        setSavedIds(prev => new Set(prev).add(opp.id));
        setSavedOpportunities(prev => [opp, ...prev]);
        showToast(`Saved "${opp.title.slice(0, 30)}..." to your list`, 'success');
      } catch (err: any) {
        showToast(err.message || 'Failed to save opportunity', 'error');
      }
    }
  };

  const isSaved = (oppId: string) => savedIds.has(oppId);

  const addToTracker = async (opportunityId: string, status: ApplicationStatus = 'Interested', notes: string = '') => {
    if (!user) {
      showToast('Please login to track applications', 'info');
      return;
    }
    try {
      const res = await api.addApplication({
        opportunity_id: opportunityId,
        status,
        personal_notes: notes,
      });
      await refreshAllData();
      showToast('Added to your Application Tracker! Preparation checklist created.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to track application', 'error');
    }
  };

  const updateApplicationStatus = async (appId: string, status: ApplicationStatus) => {
    try {
      await api.updateApplication(appId, { status });
      await refreshAllData();
      showToast(`Application updated to: ${status}`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update application', 'error');
    }
  };

  const deleteApplication = async (appId: string) => {
    try {
      await api.deleteApplication(appId);
      await refreshAllData();
      showToast('Application removed from tracker', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to remove application', 'error');
    }
  };

  const createReminder = async (opportunityId: string, reminderDate: string, notes: string = '') => {
    try {
      await api.addReminder({
        opportunity_id: opportunityId,
        reminder_date: reminderDate,
        notes,
      });
      await refreshAllData();
      showToast('Deadline reminder scheduled successfully!', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to set reminder', 'error');
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      await api.deleteReminder(reminderId);
      await refreshAllData();
      showToast('Reminder deleted', 'info');
    } catch (err: any) {
      showToast(err.message || 'Failed to delete reminder', 'error');
    }
  };

  const markNotificationRead = async (notifId: string) => {
    try {
      await api.markNotificationRead(notifId);
      setNotifications(prev =>
        prev.map(n => (n.id === notifId ? { ...n, is_read: true } : n))
      );
    } catch (err) {
      console.error(err);
    }
  };

  const markAllNotificationsRead = async () => {
    try {
      await api.markAllNotificationsRead();
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      showToast('All notifications marked as read', 'info');
    } catch (err) {
      console.error(err);
    }
  };

  const unreadNotifCount = notifications.filter(n => !n.is_read).length;

  return (
    <AppContext.Provider
      value={{
        savedOpportunities,
        savedIds,
        applications,
        reminders,
        notifications,
        unreadNotifCount,
        toasts,
        showToast,
        removeToast,
        toggleSave,
        isSaved,
        addToTracker,
        updateApplicationStatus,
        deleteApplication,
        createReminder,
        deleteReminder,
        markNotificationRead,
        markAllNotificationsRead,
        refreshAllData,
      }}
    >
      {children}
      {/* Toast Notification Container */}
      <div className="fixed bottom-5 right-5 z-50 flex flex-col space-y-2 max-w-sm pointer-events-none">
        {toasts.map(toast => (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between px-4 py-3 rounded-xl shadow-lg border text-sm font-medium transition-all transform translate-y-0 ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-rose-50 border-rose-200 text-rose-800'
                : 'bg-indigo-50 border-indigo-200 text-indigo-800'
            }`}
          >
            <span>{toast.message}</span>
            <button
              onClick={() => removeToast(toast.id)}
              className="ml-3 text-slate-400 hover:text-slate-600 focus:outline-none"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within an AppProvider');
  return context;
};
