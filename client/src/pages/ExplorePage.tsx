import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Compass, 
  RotateCcw, 
  SlidersHorizontal, 
  MapPin, 
  Calendar, 
  Sparkles,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Opportunity, OpportunityCategory, DeliveryMode } from '../types';
import { api } from '../services/api';
import { OpportunityCard } from '../components/OpportunityCard';
import { useAuth } from '../context/AuthContext';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { profile } = useAuth();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);

  // Filters state initialized from query params
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [category, setCategory] = useState<string>(searchParams.get('category') || 'All');
  const [deliveryMode, setDeliveryMode] = useState<string>('All');
  const [location, setLocation] = useState<string>('All');
  const [skillFilter, setSkillFilter] = useState<string>('');
  const [sortBy, setSortBy] = useState<string>('relevance');

  const categories: (string | OpportunityCategory)[] = [
    'All',
    'Scholarships',
    'Internships',
    'Hackathons',
    'Competitions',
    'Training programs',
    'Fellowships',
    'Online courses',
  ];

  const locationsList = ['All', 'Bengaluru', 'Remote', 'Hyderabad', 'Mumbai', 'Noida', 'Virtual'];

  // Fetch opportunities
  useEffect(() => {
    const fetchOpportunities = async () => {
      setLoading(true);
      try {
        const data = await api.getOpportunities({
          search,
          category,
          mode: deliveryMode,
          location,
          skill: skillFilter,
          sort: sortBy,
        });
        setOpportunities(data);
      } catch (err) {
        console.error('Error fetching opportunities:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOpportunities();
  }, [search, category, deliveryMode, location, skillFilter, sortBy, profile]);

  // Reset all filters
  const handleResetFilters = () => {
    setSearch('');
    setCategory('All');
    setDeliveryMode('All');
    setLocation('All');
    setSkillFilter('');
    setSortBy('relevance');
    setSearchParams({});
  };

  return (
    <div className="space-y-6 pb-12">
      {/* Top Page Header */}
      <div>
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4" />
          <span>Central Opportunity Discovery Hub</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Explore Opportunities
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Browse verified scholarships, internships, hackathons, and certifications. Filter by skill, location, or AI match.
        </p>
      </div>

      {/* Search Bar & Primary Controls */}
      <div className="bg-white p-4 sm:p-5 rounded-3xl border border-slate-200/90 shadow-soft space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by title, organization, description, or skills (e.g. Google, Python, AICTE)..."
              className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-2xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
            {search && (
              <button
                onClick={() => setSearch('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-600"
              >
                ✕
              </button>
            )}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs sm:text-sm py-2.5 px-3 rounded-2xl border border-slate-200 bg-white font-medium text-slate-700 focus:border-brand-500 focus:outline-none cursor-pointer"
            >
              <option value="relevance">Sort: AI Match Relevance</option>
              <option value="deadline">Sort: Approaching Deadline</option>
              <option value="newest">Sort: Newly Added</option>
            </select>

            <button
              onClick={handleResetFilters}
              title="Reset all filters"
              className="p-2.5 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Category Filter Horizontal Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all border ${
                category === cat
                  ? 'bg-brand-600 text-white border-brand-600 shadow-sm shadow-brand-500/25'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Secondary Filters Bar */}
        <div className="pt-3 border-t border-slate-100 flex flex-wrap items-center gap-3 text-xs">
          
          {/* Mode Selector */}
          <div className="flex items-center gap-1.5">
            <span className="font-semibold text-slate-500">Mode:</span>
            {['All', 'Online', 'Offline', 'Hybrid'].map((m) => (
              <button
                key={m}
                onClick={() => setDeliveryMode(m)}
                className={`px-2.5 py-1 rounded-lg font-medium transition-colors ${
                  deliveryMode === m
                    ? 'bg-slate-900 text-white'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Location Selector */}
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="py-1 px-2 rounded-lg bg-slate-100 text-slate-700 font-medium border-0 focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              {locationsList.map((loc) => (
                <option key={loc} value={loc}>
                  {loc === 'All' ? 'All Locations' : loc}
                </option>
              ))}
            </select>
          </div>

          <div className="h-4 w-px bg-slate-200 hidden sm:block" />

          {/* Specific Skill Filter */}
          <div className="flex items-center gap-1.5 flex-1 max-w-xs">
            <input
              type="text"
              value={skillFilter}
              onChange={(e) => setSkillFilter(e.target.value)}
              placeholder="Filter by skill (e.g. Python, SQL)..."
              className="w-full text-xs py-1 px-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-brand-500"
            />
          </div>

          <div className="ml-auto text-slate-400 font-medium">
            Showing <strong className="text-slate-800">{opportunities.length}</strong> opportunities
          </div>
        </div>
      </div>

      {/* Grid of Results */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-slate-200 animate-pulse p-6" />
          ))}
        </div>
      ) : opportunities.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8 shadow-soft">
          <Compass className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-900">No matching opportunities found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 mb-6">
            Try loosening your filters, searching for a different skill, or clearing category restrictions.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md transition-colors inline-flex items-center gap-2"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {opportunities.map((opp) => (
            <OpportunityCard key={opp.id} opportunity={opp} />
          ))}
        </div>
      )}
    </div>
  );
};
