import React, { useState } from 'react';
import { X, Sparkles, Plus, AlertCircle } from 'lucide-react';
import { Opportunity, OpportunityCategory, DeliveryMode, VerificationStatus } from '../types';
import { api } from '../services/api';

interface AddOpportunityModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
  initialData?: Opportunity | null;
}

export const AddOpportunityModal: React.FC<AddOpportunityModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
  initialData,
}) => {
  const isEditing = !!initialData;

  const [title, setTitle] = useState(initialData?.title || '');
  const [organization, setOrganization] = useState(initialData?.organization || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [category, setCategory] = useState<OpportunityCategory>(initialData?.category || 'Internships');
  const [eligibilityRequirements, setEligibilityRequirements] = useState(initialData?.eligibility_requirements || '');
  const [requiredSkills, setRequiredSkills] = useState((initialData?.required_skills || []).join(', '));
  const [educationRequirements, setEducationRequirements] = useState((initialData?.education_requirements || []).join(', '));
  const [location, setLocation] = useState(initialData?.location || 'India / Remote');
  const [deliveryMode, setDeliveryMode] = useState<DeliveryMode>(initialData?.delivery_mode || 'Online');
  const [stipendOrPrize, setStipendOrPrize] = useState(initialData?.stipend_or_prize || '');
  const [applicationDeadline, setApplicationDeadline] = useState(
    initialData?.application_deadline ? initialData.application_deadline.slice(0, 10) : ''
  );
  const [applicationUrl, setApplicationUrl] = useState(initialData?.application_url || '');
  const [sourceUrl, setSourceUrl] = useState(initialData?.source_url || '');
  const [verificationStatus, setVerificationStatus] = useState<VerificationStatus>(initialData?.verification_status || 'verified');
  const [tags, setTags] = useState((initialData?.tags || []).join(', '));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!title || !organization || !category || !applicationDeadline) {
      setError('Please fill in title, organization, category, and application deadline.');
      return;
    }

    setLoading(true);
    try {
      const payload: Partial<Opportunity> = {
        title,
        organization,
        description,
        category,
        eligibility_requirements: eligibilityRequirements || 'Open to all eligible college students.',
        required_skills: requiredSkills.split(',').map(s => s.trim()).filter(Boolean),
        education_requirements: educationRequirements.split(',').map(s => s.trim()).filter(Boolean),
        location,
        delivery_mode: deliveryMode,
        stipend_or_prize: stipendOrPrize,
        application_deadline: new Date(applicationDeadline).toISOString(),
        application_url: applicationUrl || 'https://opportunity.example.com',
        source_url: sourceUrl || 'https://opportunity.example.com',
        verification_status: verificationStatus,
        tags: tags.split(',').map(t => t.trim()).filter(Boolean),
        is_demo_data: false,
      };

      if (isEditing && initialData) {
        await api.updateOpportunity(initialData.id, payload);
      } else {
        await api.createOpportunity(payload);
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save opportunity');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200 my-8">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="text-lg sm:text-xl font-bold text-slate-900">
              {isEditing ? 'Edit Opportunity' : 'Add New Opportunity'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Admin management panel: Publish or update verified opportunities for students
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto pr-1">
          {/* Row 1: Title & Org */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Opportunity Title *</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. AWS Cloud Engineering Fellowship"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Organization *</label>
              <input
                type="text"
                value={organization}
                onChange={(e) => setOrganization(e.target.value)}
                placeholder="e.g. Amazon Web Services"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>
          </div>

          {/* Row 2: Category, Mode & Verification */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Category *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as OpportunityCategory)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="Scholarships">Scholarships</option>
                <option value="Internships">Internships</option>
                <option value="Hackathons">Hackathons</option>
                <option value="Competitions">Competitions</option>
                <option value="Training programs">Training programs</option>
                <option value="Fellowships">Fellowships</option>
                <option value="Online courses">Online courses</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Delivery Mode *</label>
              <select
                value={deliveryMode}
                onChange={(e) => setDeliveryMode(e.target.value as DeliveryMode)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="Online">Online</option>
                <option value="Offline">Offline</option>
                <option value="Hybrid">Hybrid</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Verification Status</label>
              <select
                value={verificationStatus}
                onChange={(e) => setVerificationStatus(e.target.value as VerificationStatus)}
                className="w-full text-xs sm:text-sm px-3 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="verified">Verified Official</option>
                <option value="unverified">Unverified</option>
                <option value="pending">Pending Review</option>
                <option value="expired">Expired</option>
              </select>
            </div>
          </div>

          {/* Description */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Description *</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Detailed description of what the opportunity involves..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Eligibility Requirements */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Eligibility Requirements *</label>
            <textarea
              rows={2}
              value={eligibilityRequirements}
              onChange={(e) => setEligibilityRequirements(e.target.value)}
              placeholder="e.g. Open to 2nd and 3rd year undergraduate engineering students..."
              className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          {/* Row 3: Skills & Education */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Required Skills (comma-separated)</label>
              <input
                type="text"
                value={requiredSkills}
                onChange={(e) => setRequiredSkills(e.target.value)}
                placeholder="Python, Machine Learning, SQL, Cloud"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Education Requirements</label>
              <input
                type="text"
                value={educationRequirements}
                onChange={(e) => setEducationRequirements(e.target.value)}
                placeholder="B.Tech, BCA, MCA, STEM"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 4: Stipend & Deadline */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Stipend / Prize / Grant Amount</label>
              <input
                type="text"
                value={stipendOrPrize}
                onChange={(e) => setStipendOrPrize(e.target.value)}
                placeholder="e.g. ₹50,000/month or ₹2,00,000 Prize Pool"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Deadline *</label>
              <input
                type="date"
                value={applicationDeadline}
                onChange={(e) => setApplicationDeadline(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 5: URLs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Application Portal URL</label>
              <input
                type="url"
                value={applicationUrl}
                onChange={(e) => setApplicationUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Source / Verification URL</label>
              <input
                type="url"
                value={sourceUrl}
                onChange={(e) => setSourceUrl(e.target.value)}
                placeholder="https://..."
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Row 6: Location & Tags */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Location</label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Bengaluru, Karnataka or Remote"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tags (comma-separated)</label>
              <input
                type="text"
                value={tags}
                onChange={(e) => setTags(e.target.value)}
                placeholder="AI, Cloud, High Stipend, Diversity"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Footer Actions */}
          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 text-white shadow-md shadow-brand-500/25 transition-all flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              <span>{loading ? 'Saving...' : isEditing ? 'Save Changes' : 'Publish Opportunity'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
