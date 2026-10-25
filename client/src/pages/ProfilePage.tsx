import React, { useState, useEffect } from 'react';
import { 
  User, 
  Sparkles, 
  GraduationCap, 
  Save, 
  Plus, 
  X, 
  UploadCloud, 
  CheckCircle, 
  AlertCircle,
  FileText
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';
import { OpportunityCategory, DeliveryMode } from '../types';

export const ProfilePage: React.FC = () => {
  const { profile, updateProfile } = useAuth();
  const { showToast } = useApp();

  const [fullName, setFullName] = useState(profile?.full_name || '');
  const [college, setCollege] = useState(profile?.college_university || '');
  const [degree, setDegree] = useState(profile?.degree_department || '');
  const [year, setYear] = useState(profile?.current_year || '3rd Year');
  const [gradYear, setGradYear] = useState(profile?.graduation_year || '2027');
  const [gpa, setGpa] = useState(profile?.gpa_or_percentage || '8.8 CGPA');
  const [careerGoals, setCareerGoals] = useState(profile?.career_goals || '');
  const [modePreference, setModePreference] = useState(profile?.mode_preference || 'Hybrid');
  const [resumeName, setResumeName] = useState(profile?.resume_url || 'sample_resume.pdf');

  // Skills tag manager
  const [skills, setSkills] = useState<string[]>(profile?.skills || []);
  const [newSkill, setNewSkill] = useState('');

  // Interests tag manager
  const [interests, setInterests] = useState<string[]>(profile?.interests || []);
  const [newInterest, setNewInterest] = useState('');

  // Preferred types
  const allCategories: OpportunityCategory[] = [
    'Scholarships',
    'Internships',
    'Hackathons',
    'Competitions',
    'Training programs',
    'Fellowships',
    'Online courses'
  ];
  const [preferredTypes, setPreferredTypes] = useState<OpportunityCategory[]>(
    profile?.preferred_types || ['Internships', 'Hackathons', 'Scholarships']
  );

  // Preferred locations
  const [locations, setLocations] = useState<string[]>(
    profile?.preferred_locations || ['Bengaluru', 'Remote', 'Hyderabad']
  );
  const [newLoc, setNewLoc] = useState('');

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name || '');
      setCollege(profile.college_university || '');
      setDegree(profile.degree_department || '');
      setYear(profile.current_year || '3rd Year');
      setGradYear(profile.graduation_year || '2027');
      setGpa(profile.gpa_or_percentage || '');
      setCareerGoals(profile.career_goals || '');
      setSkills(profile.skills || []);
      setInterests(profile.interests || []);
      setPreferredTypes(profile.preferred_types || []);
      setLocations(profile.preferred_locations || []);
      setModePreference(profile.mode_preference || 'Hybrid');
      setResumeName(profile.resume_url || '');
    }
  }, [profile]);

  // Skill Add / Remove
  const handleAddSkill = (skillToAdd: string) => {
    const trimmed = skillToAdd.trim();
    if (trimmed && !skills.includes(trimmed)) {
      setSkills(prev => [...prev, trimmed]);
      setNewSkill('');
    }
  };

  const handleRemoveSkill = (skillToRemove: string) => {
    setSkills(prev => prev.filter(s => s !== skillToRemove));
  };

  // Interest Add / Remove
  const handleAddInterest = (interestToAdd: string) => {
    const trimmed = interestToAdd.trim();
    if (trimmed && !interests.includes(trimmed)) {
      setInterests(prev => [...prev, trimmed]);
      setNewInterest('');
    }
  };

  const handleRemoveInterest = (interestToRemove: string) => {
    setInterests(prev => prev.filter(i => i !== interestToRemove));
  };

  // Location Add / Remove
  const handleAddLocation = (locToAdd: string) => {
    const trimmed = locToAdd.trim();
    if (trimmed && !locations.includes(trimmed)) {
      setLocations(prev => [...prev, trimmed]);
      setNewLoc('');
    }
  };

  const handleRemoveLocation = (locToRemove: string) => {
    setLocations(prev => prev.filter(l => l !== locToRemove));
  };

  // Category Toggle
  const toggleCategory = (cat: OpportunityCategory) => {
    if (preferredTypes.includes(cat)) {
      setPreferredTypes(prev => prev.filter(c => c !== cat));
    } else {
      setPreferredTypes(prev => [...prev, cat]);
    }
  };

  // Save profile
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateProfile({
        full_name: fullName,
        college_university: college,
        degree_department: degree,
        current_year: year,
        graduation_year: gradYear,
        gpa_or_percentage: gpa,
        career_goals: careerGoals,
        skills,
        interests,
        preferred_types: preferredTypes,
        preferred_locations: locations,
        mode_preference: modePreference as any,
        resume_url: resumeName,
      });
      showToast('Student profile updated! AI recommendation scores refreshed.', 'success');
    } catch (err: any) {
      showToast(err.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const popularSkills = ['Python', 'SQL', 'Machine Learning', 'React', 'C++', 'Java', 'Git', 'Data Analytics', 'Cloud Computing', 'Docker'];
  const popularInterests = ['Artificial Intelligence', 'Data Science', 'Web Development', 'Robotics', 'FinTech', 'Open Source', 'Space Tech'];

  return (
    <div className="max-w-4xl mx-auto pb-12">
      {/* Header Banner */}
      <div className="mb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-brand-600 uppercase tracking-wider mb-1">
          <Sparkles className="w-4 h-4" />
          <span>Profile & Semantic Matching Engine</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Student Profile Setup
        </h1>
        <p className="text-sm text-slate-600 mt-1">
          The information here feeds directly into our AI matching algorithm to compare your background against 20+ national and global opportunities.
        </p>
      </div>

      <form onSubmit={handleSave} className="space-y-8">
        
        {/* Section 1: Academic Background */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-brand-600" />
            <span>Academic Qualifications</span>
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Full Name *</label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Registered Email</label>
              <input
                type="text"
                disabled
                value={profile?.email || ''}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-slate-500 cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">College / University *</label>
              <input
                type="text"
                value={college}
                onChange={(e) => setCollege(e.target.value)}
                placeholder="e.g. National Institute of Technology (NIT)"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Degree & Department *</label>
              <input
                type="text"
                value={degree}
                onChange={(e) => setDegree(e.target.value)}
                placeholder="e.g. B.Tech Computer Science"
                required
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Current Year of Study *</label>
              <select
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none bg-white"
              >
                <option value="1st Year">1st Year</option>
                <option value="2nd Year">2nd Year</option>
                <option value="3rd Year">3rd Year</option>
                <option value="4th Year">4th Year (Final)</option>
                <option value="Postgraduate">Postgraduate</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">Expected Graduation Year</label>
              <input
                type="text"
                value={gradYear}
                onChange={(e) => setGradYear(e.target.value)}
                placeholder="e.g. 2027"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1.5">GPA / Percentage</label>
              <input
                type="text"
                value={gpa}
                onChange={(e) => setGpa(e.target.value)}
                placeholder="e.g. 8.8 CGPA or 82%"
                className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Section 2: Skills & Competencies */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900">Technical & Practical Skills</h2>
              <p className="text-xs text-slate-500 mt-0.5">Matched with requirement criteria using semantic vector clusters</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-brand-50 text-brand-700">
              {skills.length} skills added
            </span>
          </div>

          {/* Current Skills Tags */}
          <div className="flex flex-wrap gap-2 mb-4 min-h-[40px] p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
            {skills.length === 0 ? (
              <span className="text-xs text-slate-400 italic">No skills added yet. Add from suggestions below or type your own.</span>
            ) : (
              skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200 shadow-sm"
                >
                  <span>{skill}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSkill(skill)}
                    className="text-slate-400 hover:text-rose-500 transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))
            )}
          </div>

          {/* Add custom skill input */}
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              value={newSkill}
              onChange={(e) => setNewSkill(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddSkill(newSkill);
                }
              }}
              placeholder="Type a skill and press Enter (e.g. PyTorch, React, Embedded C)..."
              className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
            />
            <button
              type="button"
              onClick={() => handleAddSkill(newSkill)}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1"
            >
              <Plus className="w-4 h-4" />
              <span>Add</span>
            </button>
          </div>

          {/* Quick Suggestions */}
          <div>
            <span className="text-xs font-semibold text-slate-500 block mb-2">Quick additions:</span>
            <div className="flex flex-wrap gap-1.5">
              {popularSkills.filter(s => !skills.includes(s)).map((skill) => (
                <button
                  key={skill}
                  type="button"
                  onClick={() => handleAddSkill(skill)}
                  className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-600 px-2.5 py-1 rounded-lg border border-transparent transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span>{skill}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 3: Interests & Career Goals */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Career Goals & Domain Interests
          </h2>

          <div className="mb-5">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Target Career Role or Objective
            </label>
            <input
              type="text"
              value={careerGoals}
              onChange={(e) => setCareerGoals(e.target.value)}
              placeholder="e.g. Machine Learning Engineer / AI Researcher"
              className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
            />
          </div>

          {/* Interests Tags */}
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1.5">
              Domain Interests
            </label>
            <div className="flex flex-wrap gap-2 mb-3 min-h-[40px] p-3 rounded-2xl bg-slate-50 border border-slate-200/80">
              {interests.length === 0 ? (
                <span className="text-xs text-slate-400 italic">No interests selected yet.</span>
              ) : (
                interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold bg-white text-brand-800 px-3 py-1.5 rounded-xl border border-brand-200 shadow-sm"
                  >
                    <span>{interest}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveInterest(interest)}
                      className="text-brand-400 hover:text-rose-500 transition-colors"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </span>
                ))
              )}
            </div>

            <div className="flex gap-2 mb-3">
              <input
                type="text"
                value={newInterest}
                onChange={(e) => setNewInterest(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddInterest(newInterest);
                  }
                }}
                placeholder="Add an interest (e.g. Social Impact, Web3, FinTech)..."
                className="flex-1 text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddInterest(newInterest)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-colors"
              >
                Add
              </button>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {popularInterests.filter(i => !interests.includes(i)).map((interest) => (
                <button
                  key={interest}
                  type="button"
                  onClick={() => handleAddInterest(interest)}
                  className="text-xs bg-slate-100 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 text-slate-600 px-2.5 py-1 rounded-lg border border-transparent transition-all flex items-center gap-1"
                >
                  <Plus className="w-3 h-3 text-slate-400" />
                  <span>{interest}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Section 4: Opportunity Preferences & Mode */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-4 pb-2 border-b border-slate-100">
            Opportunity Preferences & Mode
          </h2>

          {/* Preferred Types */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Preferred Opportunity Types (select all that interest you)
            </label>
            <div className="flex flex-wrap gap-2">
              {allCategories.map((cat) => {
                const isSelected = preferredTypes.includes(cat);
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => toggleCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                      isSelected
                        ? 'bg-brand-500 text-white border-brand-500 shadow-sm shadow-brand-500/20'
                        : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Work / Delivery Mode Preference */}
          <div className="mb-6">
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Delivery Mode Preference
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {['Any', 'Online', 'Offline', 'Hybrid'].map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setModePreference(mode as any)}
                  className={`py-2.5 px-3 rounded-xl text-xs font-semibold border transition-all text-center ${
                    modePreference === mode
                      ? 'bg-brand-50 border-brand-500 text-brand-700 ring-2 ring-brand-500/20'
                      : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          {/* Preferred Locations */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Preferred Locations
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {locations.map((loc) => (
                <span
                  key={loc}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold bg-slate-100 text-slate-800 px-3 py-1.5 rounded-xl border border-slate-200"
                >
                  <span>{loc}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveLocation(loc)}
                    className="text-slate-400 hover:text-rose-500"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </span>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newLoc}
                onChange={(e) => setNewLoc(e.target.value)}
                placeholder="Add location (e.g. Pune, Delhi, Mumbai)..."
                className="text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none"
              />
              <button
                type="button"
                onClick={() => handleAddLocation(newLoc)}
                className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold"
              >
                Add
              </button>
            </div>
          </div>
        </div>

        {/* Section 5: Optional Resume Attachment */}
        <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/90 shadow-soft">
          <h2 className="text-base font-bold text-slate-900 mb-2 flex items-center gap-2">
            <FileText className="w-5 h-5 text-brand-600" />
            <span>Optional Resume Attachment</span>
          </h2>
          <p className="text-xs text-slate-500 mb-4">
            Upload your resume so our AI engine can automatically parse extra project highlights (PDF/DOCX).
          </p>

          <div className="border-2 border-dashed border-slate-200 hover:border-brand-300 rounded-2xl p-6 text-center bg-slate-50/50 transition-colors">
            <UploadCloud className="w-8 h-8 text-brand-500 mx-auto mb-2" />
            {resumeName ? (
              <div className="flex items-center justify-center gap-2 text-xs font-bold text-emerald-700 bg-emerald-50 py-1.5 px-3 rounded-lg border border-emerald-200 max-w-xs mx-auto">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Active: {resumeName}</span>
              </div>
            ) : (
              <div>
                <p className="text-xs font-semibold text-slate-700">Click to upload or drag resume here</p>
                <p className="text-[11px] text-slate-400 mt-0.5">PDF, DOCX up to 5MB</p>
              </div>
            )}
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  setResumeName(e.target.files[0].name);
                }
              }}
              className="mt-3 text-xs text-slate-500 file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-xs file:font-semibold file:bg-brand-50 file:text-brand-700 hover:file:bg-brand-100"
            />
          </div>
        </div>

        {/* Save Bar */}
        <div className="sticky bottom-6 z-20 bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between">
          <div className="text-xs text-slate-500 hidden sm:block">
            Updates will instantly recalculate your AI match rankings across all 20+ opportunities.
          </div>
          <button
            type="submit"
            disabled={saving}
            className="w-full sm:w-auto px-7 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            <Save className="w-4 h-4" />
            <span>{saving ? 'Updating...' : 'Save & Refresh Recommendations'}</span>
          </button>
        </div>

      </form>
    </div>
  );
};
