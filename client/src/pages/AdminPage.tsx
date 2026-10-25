import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  Plus, 
  FileUp, 
  Trash2, 
  Edit, 
  CheckCircle2, 
  XCircle, 
  Users, 
  Layers, 
  BarChart3, 
  AlertTriangle,
  RotateCcw,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  Legend 
} from 'recharts';
import { Opportunity } from '../types';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { AddOpportunityModal } from '../components/AddOpportunityModal';
import { CsvImportModal } from '../components/CsvImportModal';

export const AdminPage: React.FC = () => {
  const { user, switchDemoUser } = useAuth();
  const { showToast } = useApp();

  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [stats, setStats] = useState<{
    totalStudents: number;
    totalOpportunities: number;
    verifiedCount: number;
    unverifiedCount: number;
    totalTrackedApplications: number;
    categoryDistribution: { name: string; count: number }[];
  } | null>(null);

  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');

  // Modals
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [csvModalOpen, setCsvModalOpen] = useState(false);
  const [editingOpp, setEditingOpp] = useState<Opportunity | null>(null);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      const [opps, adminStats] = await Promise.all([
        api.getOpportunities({ sort: 'newest' }),
        api.getAdminStats().catch(() => null),
      ]);
      setOpportunities(opps);
      setStats(adminStats);
    } catch (err: any) {
      console.error('Admin data load failed:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdminData();
  }, [user]);

  // Non-Admin Screen
  if (user?.role !== 'admin') {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white p-8 rounded-3xl border border-slate-200 shadow-soft">
        <Shield className="w-12 h-12 text-amber-500 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-slate-900">Administrator Access Required</h2>
        <p className="text-xs text-slate-500 mt-1 mb-6 leading-relaxed">
          You are currently in Student Mode. Switch to the demo administrator persona to test adding, editing, verifying, and importing opportunities.
        </p>
        <button
          onClick={async () => {
            await switchDemoUser('admin');
            loadAdminData();
          }}
          className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-md shadow-amber-500/25 transition-all"
        >
          Switch to Admin Persona
        </button>
      </div>
    );
  }

  // Admin Actions
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to permanently remove this opportunity?')) return;
    try {
      await api.deleteOpportunity(id);
      showToast('Opportunity removed successfully', 'info');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to delete', 'error');
    }
  };

  const handleToggleVerification = async (opp: Opportunity) => {
    const nextStatus = opp.verification_status === 'verified' ? 'unverified' : 'verified';
    try {
      await api.updateOpportunity(opp.id, { verification_status: nextStatus });
      showToast(`Updated verification status to: ${nextStatus}`, 'success');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const handleMarkExpired = async (opp: Opportunity) => {
    try {
      await api.updateOpportunity(opp.id, { verification_status: 'expired' });
      showToast('Marked opportunity as expired', 'info');
      loadAdminData();
    } catch (err: any) {
      showToast(err.message || 'Failed to update', 'error');
    }
  };

  const filteredOpps = opportunities.filter((opp) => {
    const matchesSearch = 
      opp.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      opp.organization.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || opp.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const COLORS = ['#6366f1', '#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6', '#06b6d4'];

  return (
    <div className="space-y-8 pb-16">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-700 uppercase tracking-wider mb-1">
            <Shield className="w-4 h-4 text-amber-500" />
            <span>Admin Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Opportunity Database Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Publish verified opportunities, upload bulk CSV datasets, review student registrations, and monitor listings.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => setCsvModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors flex items-center gap-1.5"
          >
            <FileUp className="w-4 h-4 text-slate-500" />
            <span>Import CSV</span>
          </button>

          <button
            onClick={() => {
              setEditingOpp(null);
              setAddModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs shadow-md shadow-brand-500/25 transition-all flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Add Opportunity</span>
          </button>
        </div>
      </div>

      {/* Metrics Row */}
      {stats && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Active Opportunities</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.totalOpportunities}
            </div>
            <span className="text-[11px] text-emerald-600 font-medium mt-1 block">
              {stats.verifiedCount} Verified by Staff
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Registered Students</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.totalStudents}
            </div>
            <span className="text-[11px] text-brand-600 font-medium mt-1 block">
              Active student profiles
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Applications Tracked</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900">
              {stats.totalTrackedApplications}
            </div>
            <span className="text-[11px] text-purple-600 font-medium mt-1 block">
              In student application pipelines
            </span>
          </div>

          <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-soft">
            <span className="text-xs font-semibold text-slate-500 block mb-1">Verification Health</span>
            <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600">
              {Math.round((stats.verifiedCount / (stats.totalOpportunities || 1)) * 100)}%
            </div>
            <span className="text-[11px] text-slate-500 font-medium mt-1 block">
              Official source checked
            </span>
          </div>
        </div>
      )}

      {/* Category Chart Overview */}
      {stats && stats.categoryDistribution && (
        <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-sm font-bold text-slate-900 mb-1 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-brand-600" />
            <span>Opportunities by Category Distribution</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Balance across scholarships, internships, hackathons, and certifications.
          </p>

          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.categoryDistribution}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  innerRadius={45}
                  dataKey="count"
                  paddingAngle={3}
                >
                  {stats.categoryDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, name) => [`${value} listings`, name]}
                  contentStyle={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '11px', paddingTop: '10px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}

      {/* Opportunities Management Table */}
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-soft overflow-hidden">
        <div className="p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search table by title or organization..."
              className="text-xs sm:text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-brand-500 w-64"
            />
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="text-xs py-2 px-3 rounded-xl border border-slate-200 bg-white font-medium"
            >
              <option value="All">All Categories</option>
              <option value="Scholarships">Scholarships</option>
              <option value="Internships">Internships</option>
              <option value="Hackathons">Hackathons</option>
              <option value="Competitions">Competitions</option>
              <option value="Training programs">Training programs</option>
              <option value="Fellowships">Fellowships</option>
              <option value="Online courses">Online courses</option>
            </select>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Showing {filteredOpps.length} opportunities
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 border-b border-slate-100 text-slate-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="py-3 px-4">Opportunity</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Mode / Location</th>
                <th className="py-3 px-4">Deadline</th>
                <th className="py-3 px-4">Verification</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredOpps.map((opp) => (
                <tr key={opp.id} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-4 font-bold text-slate-900 max-w-xs">
                    <div className="truncate">{opp.title}</div>
                    <div className="text-[11px] font-normal text-slate-500">{opp.organization}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <span className="font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                      {opp.category}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">
                    <div>{opp.delivery_mode}</div>
                    <div className="text-[11px] text-slate-400 truncate max-w-[120px]">{opp.location}</div>
                  </td>
                  <td className="py-3.5 px-4 text-slate-700 font-medium">
                    {new Date(opp.application_deadline).toLocaleDateString()}
                  </td>
                  <td className="py-3.5 px-4">
                    <button
                      onClick={() => handleToggleVerification(opp)}
                      className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border transition-all ${
                        opp.verification_status === 'verified'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-300'
                          : opp.verification_status === 'expired'
                          ? 'bg-slate-100 text-slate-500 border-slate-200'
                          : 'bg-amber-50 text-amber-700 border-amber-300'
                      }`}
                      title="Click to toggle verification status"
                    >
                      {opp.verification_status}
                    </button>
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => {
                          setEditingOpp(opp);
                          setAddModalOpen(true);
                        }}
                        className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg"
                        title="Edit opportunity"
                      >
                        <Edit className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleMarkExpired(opp)}
                        className="p-1.5 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg text-xs"
                        title="Mark as expired"
                      >
                        <XCircle className="w-3.5 h-3.5" />
                      </button>

                      <button
                        onClick={() => handleDelete(opp.id)}
                        className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                        title="Delete opportunity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Modal */}
      <AddOpportunityModal
        isOpen={addModalOpen}
        onClose={() => {
          setAddModalOpen(false);
          setEditingOpp(null);
        }}
        onSuccess={loadAdminData}
        initialData={editingOpp}
      />

      {/* CSV Import Modal */}
      <CsvImportModal
        isOpen={csvModalOpen}
        onClose={() => setCsvModalOpen(false)}
        onSuccess={loadAdminData}
      />
    </div>
  );
};
