import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Sparkles, Shield, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const { login, switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Invalid email or password');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDemoStudent = async () => {
    await switchDemoUser('student');
    navigate('/dashboard');
  };

  const handleDemoAdmin = async () => {
    await switchDemoUser('admin');
    navigate('/admin');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <Link to="/" className="flex items-center justify-center gap-2.5 mb-6">
          <div className="w-12 h-12 rounded-2xl gradient-brand flex items-center justify-center text-white shadow-lg shadow-brand-500/25">
            <GraduationCap className="w-7 h-7" />
          </div>
          <span className="text-2xl font-black text-slate-900 tracking-tight">
            Opportunity<span className="text-brand-600">AI</span>
          </span>
        </Link>
        <h2 className="text-center text-2xl font-extrabold text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-center text-xs text-slate-500">
          Access your personalized AI recommendations and application tracker
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-6 sm:px-10 shadow-xl border border-slate-200/80 rounded-3xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Quick Demo One-Click Sign In */}
          <div className="mb-6 p-4 rounded-2xl bg-indigo-50/70 border border-indigo-100">
            <p className="text-xs font-bold text-brand-900 mb-2 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-brand-600" />
              Instant Demo Access
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={handleDemoStudent}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-brand-700 font-semibold text-xs border border-indigo-200 shadow-sm transition-all"
              >
                Demo Student (Aarav)
              </button>
              <button
                type="button"
                onClick={handleDemoAdmin}
                className="w-full py-2 px-3 rounded-xl bg-white hover:bg-slate-50 text-amber-700 font-semibold text-xs border border-amber-200 shadow-sm transition-all flex items-center justify-center gap-1"
              >
                <Shield className="w-3.5 h-3.5 text-amber-500" />
                Demo Admin
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="student@demo.com"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="block text-xs font-semibold text-slate-700">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                >
                  Forgot password?
                </Link>
              </div>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full mt-2 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
            >
              <span>{submitting ? 'Signing in...' : 'Sign In'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          <div className="mt-6 text-center text-xs text-slate-500">
            Don't have an account yet?{' '}
            <Link to="/signup" className="font-bold text-brand-600 hover:text-brand-700">
              Sign up free
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
