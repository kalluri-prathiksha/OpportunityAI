import React, { useState } from 'react';
import { X, FileUp, Check, AlertCircle, Copy } from 'lucide-react';
import { api } from '../services/api';

interface CsvImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const SAMPLE_CSV = `Title,Organization,Category,Description,Eligibility,Required Skills,Location,Delivery Mode,Stipend,Deadline,Application URL
ISRO Planetary Robotics Hackathon,ISRO & SAC,Hackathons,Autonomous lunar rover design and SLAM simulation,Undergraduate STEM teams of 3 to 4,Python;ROS;Robotics;C++,Bengaluru,Hybrid,₹200000 Prize,2026-12-15T23:59:59Z,https://isro.gov.in/hackathon
Uber STAR Engineering Internship,Uber Technologies,Internships,Software engineering internship for second-year undergraduates,2nd Year B.Tech Computer Science/IT,Data Structures;Algorithms;Java;Python,Hyderabad,Hybrid,₹80000/month,2026-11-20T23:59:59Z,https://uber.com/careers
NASSCOM FutureSkills GenAI Fellowship,NASSCOM,Fellowships,Six-month industry fellowship on applied Generative AI,Final year students or recent graduates,Python;PyTorch;LLMs;LangChain,Remote,Online,₹35000/month,2026-12-01T23:59:59Z,https://futureskillsprime.in`;

export const CsvImportModal: React.FC<CsvImportModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [csvText, setCsvText] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const handleCopySample = () => {
    setCsvText(SAMPLE_CSV);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      setCsvText(content);
    };
    reader.readAsText(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!csvText.trim()) {
      setError('Please provide CSV data or upload a file.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await api.importCsv(csvText);
      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to import CSV data');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
      <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-200">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
          <div>
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileUp className="w-5 h-5 text-brand-600" />
              <span>Import Opportunities from CSV</span>
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Bulk populate or update opportunities from standardized CSV data
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

        <div className="mb-4 flex items-center justify-between gap-2">
          <label className="cursor-pointer inline-flex items-center gap-2 text-xs font-semibold px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors">
            <FileUp className="w-3.5 h-3.5" />
            <span>Upload .csv File</span>
            <input
              type="file"
              accept=".csv"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>

          <button
            type="button"
            onClick={handleCopySample}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-brand-600 hover:text-brand-700 px-3 py-2 rounded-xl hover:bg-brand-50 transition-colors"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Sample Loaded!' : 'Load Sample CSV Template'}</span>
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              CSV Content (comma separated, semicolon for skills)
            </label>
            <textarea
              rows={8}
              value={csvText}
              onChange={(e) => setCsvText(e.target.value)}
              placeholder="Title,Organization,Category,Description,Eligibility,Required Skills,Location,Delivery Mode,Stipend,Deadline,Application URL..."
              className="w-full font-mono text-xs p-3 rounded-xl border border-slate-200 focus:border-brand-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            />
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !csvText.trim()}
              className="px-5 py-2 text-xs font-bold rounded-xl bg-brand-500 hover:bg-brand-600 disabled:opacity-50 text-white shadow-md shadow-brand-500/25 transition-all"
            >
              {loading ? 'Importing...' : 'Import Opportunities'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
