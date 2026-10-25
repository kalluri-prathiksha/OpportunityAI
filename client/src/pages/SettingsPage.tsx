import React, { useState } from 'react';
import { 
  Sliders, 
  Bell, 
  Sparkles, 
  Shield, 
  RotateCcw, 
  Save, 
  Check, 
  User, 
  Mail, 
  KeyRound,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { user, profile, switchDemoUser } = useAuth();
  const { showToast } = useApp();

  // Notification Preferences
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [inAppAlerts, setInAppAlerts] = useState(true);
  const [urgentDeadlineDays, setUrgentDeadlineDays] = useState('3');
  const [weeklyDigest, setWeeklyDigest] = useState(true);

  // AI Matching Weights Tuning
  const [skillWeight, setSkillWeight] = useState(35);
  const [degreeWeight, setDegreeWeight] = useState(25);
  const [interestWeight, setInterestWeight] = useState(25);
  const [modeWeight, setModeWeight] = useState(15);

  const [saving, setSaving] = useState(false);

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      showToast('Preferences and AI algorithm weights updated successfully!', 'success');
    }, 400);
  };

  const handleResetWeights = () => {
    setSkillWeight(35);
    setDegreeWeight(25);
    setInterestWeight(25);
    setModeWeight(15);
    showToast('Reset AI matching weights to standard calibration', 'info');
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 pb-16">
      {/* Top Banner */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">
          <Sliders className="w-4 h-4" />
          <span>Platform Customization</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Settings & Preferences
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Fine-tune recommendation scoring weights, configure notifications, and manage persona access.
        </p>
      </div>

      <form onSubmit={handleSaveSettings} className="space-y-6">
        
        {/* Account Details Box */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <User className="w-4 h-4 text-brand-600" />
            <span>Account Profile</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs sm:text-sm">
            <div>
              <span className="text-slate-400 block text-xs font-medium">Logged in as</span>
              <span className="font-bold text-slate-900">{profile?.full_name || 'Student User'}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-medium">Primary Email</span>
              <span className="font-bold text-slate-900">{user?.email}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-medium">Active Role</span>
              <span className="font-bold text-brand-600 capitalize">{user?.role}</span>
            </div>
            <div>
              <span className="text-slate-400 block text-xs font-medium">University Affiliation</span>
              <span className="font-bold text-slate-900 truncate block">{profile?.college_university || 'Not set'}</span>
            </div>
          </div>
        </div>

        {/* AI Matching Calibration Tuning */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-4">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>AI Recommendation Tuning</span>
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Customize relative importance for the semantic recommendation engine
              </p>
            </div>
            <button
              type="button"
              onClick={handleResetWeights}
              className="text-xs font-semibold text-brand-600 hover:text-brand-700 flex items-center gap-1"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Default</span>
            </button>
          </div>

          <div className="space-y-4 text-xs">
            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Technical Skills Overlap</span>
                <span>{skillWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                value={skillWeight}
                onChange={(e) => setSkillWeight(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Degree & Academic Year Fit</span>
                <span>{degreeWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={degreeWeight}
                onChange={(e) => setDegreeWeight(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Domain Interests & Career Aspirations</span>
                <span>{interestWeight}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="50"
                value={interestWeight}
                onChange={(e) => setInterestWeight(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>

            <div>
              <div className="flex justify-between font-semibold text-slate-700 mb-1">
                <span>Delivery Mode (Online/Hybrid/Offline)</span>
                <span>{modeWeight}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="30"
                value={modeWeight}
                onChange={(e) => setModeWeight(Number(e.target.value))}
                className="w-full accent-brand-600 cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Notification Preferences */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <Bell className="w-4 h-4 text-brand-600" />
            <span>Notification & Reminder Preferences</span>
          </h2>

          <div className="space-y-4 text-xs sm:text-sm">
            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">In-App Notifications</span>
                <span className="text-xs text-slate-400">Receive real-time alerts for newly discovered 90%+ match opportunities</span>
              </div>
              <input
                type="checkbox"
                checked={inAppAlerts}
                onChange={(e) => setInAppAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Email Reminders</span>
                <span className="text-xs text-slate-400">Send dispatch alerts before application closing deadlines</span>
              </div>
              <input
                type="checkbox"
                checked={emailAlerts}
                onChange={(e) => setEmailAlerts(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </label>

            <label className="flex items-center justify-between cursor-pointer">
              <div>
                <span className="font-semibold text-slate-800 block">Weekly Opportunity Digest</span>
                <span className="text-xs text-slate-400">Weekly compilation of new scholarships and internships in your domain</span>
              </div>
              <input
                type="checkbox"
                checked={weeklyDigest}
                onChange={(e) => setWeeklyDigest(e.target.checked)}
                className="w-4 h-4 text-brand-600 rounded cursor-pointer"
              />
            </label>
          </div>
        </div>

        {/* Persona Quick Switcher */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Switch Evaluation Persona</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Toggle between student and administrator roles with pre-configured mock permissions.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => switchDemoUser('student')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                user?.role === 'student'
                  ? 'border-brand-500 bg-brand-50/70 ring-2 ring-brand-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">Student Persona</span>
              <span className="text-[11px] text-slate-500">Aarav Sharma • B.Tech Computer Science 3rd Year</span>
            </button>

            <button
              type="button"
              onClick={() => switchDemoUser('admin')}
              className={`p-3.5 rounded-2xl border text-left transition-all ${
                user?.role === 'admin'
                  ? 'border-amber-500 bg-amber-50/70 ring-2 ring-amber-500/20'
                  : 'border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className="text-xs font-bold text-slate-900 block">Administrator Persona</span>
              <span className="text-[11px] text-slate-500">Platform Admin • Full CRUD, CSV import, Verification</span>
            </button>
          </div>
        </div>

        {/* Save Bar */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Saving...' : 'Save All Preferences'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
