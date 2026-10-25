import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Sparkles, 
  ArrowRight, 
  CheckCircle, 
  Search, 
  Target, 
  ShieldCheck, 
  Award, 
  Calendar, 
  Layers, 
  BookOpen, 
  Briefcase, 
  Code2, 
  Trophy, 
  Users,
  Compass,
  GraduationCap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LandingPage: React.FC = () => {
  const { switchDemoUser } = useAuth();
  const navigate = useNavigate();

  const handleLaunchStudent = async () => {
    await switchDemoUser('student');
    navigate('/dashboard');
  };

  const handleLaunchAdmin = async () => {
    await switchDemoUser('admin');
    navigate('/admin');
  };

  const categories = [
    { name: 'Scholarships', icon: Award, color: 'text-emerald-600 bg-emerald-50 border-emerald-200', count: 'Tuition & Grants' },
    { name: 'Internships', icon: Briefcase, color: 'text-blue-600 bg-blue-50 border-blue-200', count: 'Tech & Research' },
    { name: 'Hackathons', icon: Code2, color: 'text-purple-600 bg-purple-50 border-purple-200', count: 'National & Global' },
    { name: 'Competitions', icon: Trophy, color: 'text-amber-600 bg-amber-50 border-amber-200', count: 'Prizes & PPIs' },
    { name: 'Training programs', icon: Layers, color: 'text-cyan-600 bg-cyan-50 border-cyan-200', count: 'Skill Bootcamps' },
    { name: 'Fellowships', icon: Target, color: 'text-rose-600 bg-rose-50 border-rose-200', count: 'Funded Research' },
    { name: 'Online courses', icon: BookOpen, color: 'text-indigo-600 bg-indigo-50 border-indigo-200', count: 'Certified Credits' },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-indigo-50/50 via-white to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto">
            
            {/* AI Chip */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold mb-6 shadow-sm">
              <Sparkles className="w-4 h-4 text-brand-500 animate-pulse" />
              <span>Next-Gen Semantic Opportunity Discovery</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 tracking-tight leading-[1.15] mb-6">
              Stop missing opportunities. <br />
              Let <span className="bg-clip-text text-transparent bg-gradient-to-r from-brand-600 via-accent-600 to-blue-600">OpportunityAI</span> match you.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 mb-8 leading-relaxed max-w-2xl mx-auto">
              Never miss scholarships, internships, hackathons, or fellowships again. Our semantic AI engine analyzes your exact degree, skills, and aspirations to surface high-match listings with transparent explanations.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 mb-10">
              <button
                onClick={handleLaunchStudent}
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-lg shadow-brand-500/30 transition-all flex items-center justify-center gap-2 group"
              >
                <span>Launch Demo Student Dashboard</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <Link
                to="/explore"
                className="w-full sm:w-auto px-7 py-3.5 rounded-2xl bg-white hover:bg-slate-50 border border-slate-200 text-slate-800 font-bold text-sm shadow-soft transition-all flex items-center justify-center gap-2"
              >
                <Compass className="w-4 h-4 text-brand-500" />
                <span>Explore 20+ Opportunities</span>
              </Link>

              <button
                onClick={handleLaunchAdmin}
                className="w-full sm:w-auto px-4 py-3.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600" />
                <span>Admin View</span>
              </button>
            </div>

            {/* Trust Badges */}
            <div className="flex flex-wrap items-center justify-center gap-y-2 gap-x-6 text-xs font-medium text-slate-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Free for all college students
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Semantic ontology matching
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-500" /> Automated deadline tracker
              </span>
            </div>
          </div>

          {/* Interactive Feature Preview Card */}
          <div className="mt-14 max-w-4xl mx-auto rounded-3xl bg-white border border-slate-200/90 shadow-2xl p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-brand-600">Live AI Matching Demo</span>
                <h3 className="text-xl font-bold text-slate-900 mt-0.5">Google Summer of Code (GSoC) 2027</h3>
                <p className="text-xs text-slate-500">Google Open Source • International Remote Fellowship</p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3.5 py-1.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                  <Sparkles className="w-3.5 h-3.5" /> 95% AI Match
                </span>
                <span className="px-2.5 py-1 rounded-md bg-slate-100 text-slate-600 text-xs font-medium border border-slate-200">
                  Confirmed Eligible
                </span>
              </div>
            </div>

            <div className="py-5 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Student Profile Context</h4>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 text-xs space-y-1.5">
                  <div><strong className="text-slate-800">Degree:</strong> B.Tech Computer Science (3rd Year)</div>
                  <div><strong className="text-slate-800">Verified Skills:</strong> Python, SQL, Machine Learning, Git, React</div>
                  <div><strong className="text-slate-800">Interests:</strong> Open Source, Data Analytics, AI Research</div>
                </div>
              </div>

              <div>
                <h4 className="text-xs font-bold text-brand-700 uppercase tracking-wider mb-2 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> AI Explainability Output
                </h4>
                <div className="p-3.5 rounded-2xl bg-brand-50/60 border border-brand-100 text-xs text-slate-700 leading-relaxed">
                  "This internship strongly matches your Computer Science background and leverages your skills in Python, Git, and Open Source. It also directly aligns with your interest in AI Research and Open Source systems."
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
              <span>Stipend: $1,500 – $3,300 (approx. ₹1,25,000 – ₹2,75,000)</span>
              <button
                onClick={handleLaunchStudent}
                className="text-xs font-bold text-brand-600 hover:text-brand-700 flex items-center gap-1"
              >
                <span>Experience full recommendation engine</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* The 7 Opportunity Categories */}
      <section className="py-16 bg-slate-50 border-y border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              All Career Pathways in One Single Hub
            </h2>
            <p className="text-sm text-slate-600 mt-2">
              Say goodbye to juggling 15 different job portals, notification groups, and college notice boards.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {categories.map((cat, idx) => {
              const Icon = cat.icon;
              return (
                <Link
                  key={idx}
                  to={`/explore?category=${encodeURIComponent(cat.name)}`}
                  className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft hover:shadow-card hover:border-brand-300 transition-all group"
                >
                  <div className={`w-10 h-10 rounded-xl border flex items-center justify-center mb-3 ${cat.color}`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-brand-600 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">{cat.count}</p>
                </Link>
              );
            })}

            {/* Total count tile */}
            <div className="bg-gradient-to-br from-brand-600 to-accent-600 p-5 rounded-2xl text-white shadow-card flex flex-col justify-between">
              <div>
                <span className="text-xs font-semibold uppercase tracking-wider text-indigo-100">Verified Database</span>
                <h3 className="font-extrabold text-2xl mt-1">20+ Curated Listings</h3>
                <p className="text-xs text-indigo-100 mt-1">GSoC, Flipkart GRiD, ISRO, Reliance Scholarship & more.</p>
              </div>
              <Link
                to="/explore"
                className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-white hover:text-indigo-100"
              >
                <span>Browse Directory</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works 3-Step Walkthrough */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">Simple & Transparent</span>
            <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mt-1">
              How OpportunityAI Powers Your Journey
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-brand-600 flex items-center justify-center font-extrabold text-lg mb-4">
                1
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Build Your Student Profile</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Add your university, current degree, department, skills, and career interests. Our platform respects student privacy and requires zero unnecessary personal info.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-brand-600 flex items-center justify-center font-extrabold text-lg mb-4">
                2
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">AI Semantic Engine Matches</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We don't just match keywords. Our semantic engine checks hard eligibility requirements and scores relevance from 0 to 100 with crystal-clear explanations.
              </p>
            </div>

            <div className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-brand-600 flex items-center justify-center font-extrabold text-lg mb-4">
                3
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Track & Never Miss Deadlines</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Move opportunities into your Application Tracker, track progress with custom step-by-step checklists, and schedule in-app reminder alerts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 border-t border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg gradient-brand flex items-center justify-center text-white font-bold text-sm">
              <GraduationCap className="w-5 h-5" />
            </div>
            <div>
              <div className="font-bold text-base text-white">OpportunityAI</div>
              <p className="text-xs text-slate-400">Personalized Opportunity Finder for Indian College Students</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs text-slate-400">
            <Link to="/explore" className="hover:text-white transition-colors">Directory</Link>
            <Link to="/dashboard" className="hover:text-white transition-colors">Student Dashboard</Link>
            <button onClick={handleLaunchAdmin} className="hover:text-amber-400 transition-colors">Admin Portal</button>
          </div>

          <div className="text-xs text-slate-500 text-center sm:text-right">
            Designed for accessible, equitable student career guidance.
          </div>
        </div>
      </footer>
    </div>
  );
};
