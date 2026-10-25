import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  Search, 
  Bell, 
  User, 
  LogOut, 
  Shield, 
  Menu, 
  X, 
  Check, 
  ExternalLink,
  Sliders,
  ChevronDown,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

interface NavbarProps {
  onMobileMenuToggle?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onMobileMenuToggle }) => {
  const { user, profile, logout, switchDemoUser } = useAuth();
  const { notifications, unreadNotifCount, markNotificationRead, markAllNotificationsRead } = useApp();
  const navigate = useNavigate();

  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const handleRoleToggle = async () => {
    const nextRole = user?.role === 'admin' ? 'student' : 'admin';
    await switchDemoUser(nextRole);
    if (nextRole === 'admin') {
      navigate('/admin');
    } else {
      navigate('/dashboard');
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        
        {/* Left: Hamburger & Brand */}
        <div className="flex items-center gap-3">
          <button
            onClick={onMobileMenuToggle}
            className="p-2 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 lg:hidden focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl gradient-brand flex items-center justify-center text-white shadow-md shadow-brand-500/25 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5 font-extrabold text-lg text-slate-900 tracking-tight leading-none">
                Opportunity<span className="text-brand-600">AI</span>
              </div>
              <span className="text-[10px] text-slate-400 font-medium tracking-wide uppercase">
                Personalized Opportunity Finder
              </span>
            </div>
          </Link>
        </div>

        {/* Center: Quick Search (Desktop) */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search scholarships, internships, hackathons, skills..."
            className="w-full bg-slate-50 hover:bg-slate-100/70 focus:bg-white text-xs sm:text-sm pl-10 pr-4 py-2 rounded-xl border border-slate-200/90 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all placeholder:text-slate-400"
          />
        </form>

        {/* Right Action Icons & Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Demo Persona Switcher Pill */}
          <button
            onClick={handleRoleToggle}
            className={`hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full border transition-all ${
              user?.role === 'admin'
                ? 'bg-amber-50 text-amber-800 border-amber-300 hover:bg-amber-100'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
            title="Click to toggle between Student view and Admin view"
          >
            {user?.role === 'admin' ? (
              <>
                <Shield className="w-3.5 h-3.5 text-amber-600" />
                <span>Admin View (Switch to Student)</span>
              </>
            ) : (
              <>
                <Sparkles className="w-3.5 h-3.5 text-brand-600" />
                <span>Student View (Switch to Admin)</span>
              </>
            )}
          </button>

          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowNotifMenu(!showNotifMenu)}
              className="relative p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-all focus:outline-none"
              aria-label="View notifications"
            >
              <Bell className="w-5 h-5" />
              {unreadNotifCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-rose-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifCount}
                </span>
              )}
            </button>

            {/* Notification Popover */}
            {showNotifMenu && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-slate-200 py-3 z-50">
                <div className="px-4 pb-2 border-b border-slate-100 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-sm text-slate-800">Notifications</span>
                    {unreadNotifCount > 0 && (
                      <span className="text-[11px] bg-brand-50 text-brand-700 font-semibold px-2 py-0.5 rounded-full">
                        {unreadNotifCount} new
                      </span>
                    )}
                  </div>
                  {unreadNotifCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      className="text-xs text-brand-600 hover:text-brand-700 font-medium"
                    >
                      Mark all as read
                    </button>
                  )}
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-50">
                  {notifications.length === 0 ? (
                    <div className="py-8 text-center text-xs text-slate-400">
                      No notifications yet.
                    </div>
                  ) : (
                    notifications.slice(0, 5).map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => {
                          markNotificationRead(notif.id);
                          if (notif.link) {
                            navigate(notif.link);
                            setShowNotifMenu(false);
                          }
                        }}
                        className={`p-3.5 hover:bg-slate-50 cursor-pointer transition-colors flex items-start gap-3 ${
                          !notif.is_read ? 'bg-indigo-50/40' : ''
                        }`}
                      >
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-brand-500" />
                        <div className="flex-1 min-w-0">
                          <p className="text-xs font-semibold text-slate-900">{notif.title}</p>
                          <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">{notif.message}</p>
                          <span className="text-[10px] text-slate-400 mt-1 block">
                            {new Date(notif.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <div className="px-4 pt-2 border-t border-slate-100 text-center">
                  <Link
                    to="/notifications"
                    onClick={() => setShowNotifMenu(false)}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View all notifications →
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* User Account Menu */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowUserMenu(!showUserMenu)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-100 text-slate-700 transition-all focus:outline-none"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-brand-500 to-accent-500 text-white flex items-center justify-center font-bold text-xs shadow-sm">
                  {profile?.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="hidden sm:block text-left text-xs">
                  <div className="font-semibold text-slate-800 leading-tight">
                    {profile?.full_name || user.email.split('@')[0]}
                  </div>
                  <div className="text-[11px] text-slate-400 capitalize">{user.role}</div>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 hidden sm:block" />
              </button>

              {showUserMenu && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-800">{profile?.full_name}</p>
                    <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                    <span className="mt-1 inline-block text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 uppercase">
                      {user.role} mode
                    </span>
                  </div>

                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <User className="w-4 h-4 text-slate-400" />
                    Student Profile
                  </Link>

                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-2.5 px-4 py-2 text-xs text-slate-700 hover:bg-slate-50 font-medium"
                  >
                    <Sliders className="w-4 h-4 text-slate-400" />
                    Settings & Preferences
                  </Link>

                  {user.role === 'admin' && (
                    <Link
                      to="/admin"
                      onClick={() => setShowUserMenu(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs text-amber-700 hover:bg-amber-50 font-medium"
                    >
                      <Shield className="w-4 h-4 text-amber-500" />
                      Admin Control Panel
                    </Link>
                  )}

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      logout();
                      setShowUserMenu(false);
                      navigate('/');
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2 text-xs text-rose-600 hover:bg-rose-50 font-medium"
                  >
                    <LogOut className="w-4 h-4 text-rose-500" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link
                to="/login"
                className="text-xs font-semibold px-3 py-1.5 rounded-lg text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="text-xs font-semibold px-3.5 py-1.5 rounded-lg bg-brand-500 hover:bg-brand-600 text-white shadow-sm shadow-brand-500/25 transition-all"
              >
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
