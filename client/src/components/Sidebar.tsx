import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Compass, 
  Sparkles, 
  Bookmark, 
  KanbanSquare, 
  CalendarDays, 
  Bell, 
  ShieldCheck, 
  UserCircle, 
  Settings, 
  ChevronRight,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose }) => {
  const { user, profile } = useAuth();
  const { savedOpportunities, applications, unreadNotifCount } = useApp();

  const navItems = [
    { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { to: '/explore', label: 'Explore All', icon: Compass },
    { to: '/recommendations', label: 'AI Matchmaker', icon: Sparkles, badge: 'Smart' },
    { to: '/saved', label: 'Saved Opportunities', icon: Bookmark, count: savedOpportunities.length },
    { to: '/tracker', label: 'Application Tracker', icon: KanbanSquare, count: applications.length },
    { to: '/calendar', label: 'Deadlines & Calendar', icon: CalendarDays },
    { to: '/notifications', label: 'Notifications', icon: Bell, count: unreadNotifCount, countColor: 'bg-rose-500 text-white' },
    { to: '/profile', label: 'Student Profile', icon: UserCircle },
    { to: '/settings', label: 'Settings', icon: Settings },
  ];

  if (user?.role === 'admin') {
    navItems.splice(7, 0, { to: '/admin', label: 'Admin Portal', icon: ShieldCheck, badge: 'Admin' });
  }

  // Calculate profile completeness
  const profileFields = [
    profile?.full_name,
    profile?.college_university,
    profile?.degree_department,
    profile?.current_year,
    (profile?.skills || []).length > 0,
    (profile?.interests || []).length > 0,
    profile?.career_goals,
  ];
  const completedFields = profileFields.filter(Boolean).length;
  const profilePercentage = Math.round((completedFields / profileFields.length) * 100);

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-40 lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 z-50 lg:z-30 h-screen lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200/80 p-4 flex flex-col justify-between transition-transform duration-300 ease-in-out ${
          isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="flex flex-col flex-1 overflow-y-auto">
          {/* Mobile Header in Drawer */}
          <div className="flex items-center justify-between pb-4 mb-2 border-b border-slate-100 lg:hidden">
            <div className="flex items-center gap-2 font-bold text-slate-800">
              <GraduationCap className="w-5 h-5 text-brand-600" />
              <span>OpportunityAI Menu</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              ✕
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-50 text-brand-700 shadow-sm shadow-brand-500/10'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`
                  }
                >
                  <div className="flex items-center gap-3">
                    <Icon className="w-4 h-4 flex-shrink-0" />
                    <span>{item.label}</span>
                  </div>

                  {item.badge && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 uppercase tracking-wider">
                      {item.badge}
                    </span>
                  )}

                  {typeof item.count === 'number' && item.count > 0 && (
                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                        item.countColor || 'bg-slate-100 text-slate-700'
                      }`}
                    >
                      {item.count}
                    </span>
                  )}
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Bottom Student Profile Summary Card */}
        {profile && (
          <div className="pt-4 border-t border-slate-100 mt-2">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 mb-1">
                <span>Profile Strength</span>
                <span className="text-brand-600">{profilePercentage}%</span>
              </div>
              <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden mb-2">
                <div
                  className="h-full bg-gradient-to-r from-brand-500 to-accent-500 rounded-full transition-all duration-500"
                  style={{ width: `${profilePercentage}%` }}
                />
              </div>
              <p className="text-[11px] text-slate-500 line-clamp-1 mb-2">
                {profile.degree_department || 'Add degree & skills to refine AI matches'}
              </p>
              <NavLink
                to="/profile"
                onClick={onClose}
                className="text-[11px] font-bold text-brand-600 hover:text-brand-700 flex items-center justify-between"
              >
                <span>Edit Student Profile</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </NavLink>
            </div>
          </div>
        )}
      </aside>
    </>
  );
};
