export type OpportunityCategory = 
  | 'Scholarships'
  | 'Internships'
  | 'Hackathons'
  | 'Competitions'
  | 'Training programs'
  | 'Fellowships'
  | 'Online courses';

export type DeliveryMode = 'Online' | 'Offline' | 'Hybrid';

export type VerificationStatus = 'verified' | 'unverified' | 'pending' | 'expired';

export type ApplicationStatus = 
  | 'Interested'
  | 'Preparing application'
  | 'Applied'
  | 'Assessment or interview'
  | 'Accepted'
  | 'Rejected'
  | 'Withdrawn';

export interface AIMatchAnalysis {
  score: number;
  eligibilityStatus: 'Confirmed Eligible' | 'Eligibility needs verification' | 'Ineligible (Year mismatch)' | string;
  eligibilityReason?: string;
  summaryExplanation: string;
  matchingSkills: string[];
  missingSkills: string[];
  matchingInterests: string[];
  breakdown: {
    skillsMatch: number;
    educationMatch: number;
    interestsMatch: number;
    modeMatch: number;
  };
}

export interface Opportunity {
  id: string;
  title: string;
  organization: string;
  description: string;
  category: OpportunityCategory;
  eligibility_requirements: string;
  required_skills: string[];
  education_requirements?: string[];
  location: string;
  delivery_mode: DeliveryMode;
  stipend_or_prize?: string;
  application_deadline: string;
  application_url: string;
  source_url?: string;
  verification_status: VerificationStatus;
  is_demo_data: boolean;
  tags?: string[];
  date_added?: string;
  created_at?: string;
  aiMatch?: AIMatchAnalysis;
}

export interface StudentProfile {
  id: string;
  user_id: string;
  email: string;
  full_name: string;
  college_university: string;
  degree_department: string;
  current_year: string;
  graduation_year: string;
  skills: string[];
  interests: string[];
  preferred_types: OpportunityCategory[];
  preferred_locations: string[];
  mode_preference: 'Online' | 'Offline' | 'Hybrid' | 'Any';
  resume_url?: string | null;
  gpa_or_percentage?: string;
  career_goals?: string;
  role: 'student' | 'admin';
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: string;
  email: string;
  role: 'student' | 'admin';
}

export interface ApplicationItem {
  id: string;
  user_id: string;
  opportunity_id: string;
  status: ApplicationStatus;
  applied_date: string | null;
  personal_notes: string;
  next_action: string;
  next_action_date: string | null;
  created_at: string;
  updated_at: string;
  opportunity?: Opportunity;
  checklists?: ChecklistItem[];
  aiMatch?: AIMatchAnalysis | null;
}

export interface ChecklistItem {
  id: string;
  application_id: string;
  user_id: string;
  task_title: string;
  is_completed: boolean;
  due_date?: string | null;
}

export interface ReminderItem {
  id: string;
  user_id: string;
  opportunity_id: string;
  reminder_date: string;
  reminder_type: 'in_app' | 'email';
  notes?: string;
  is_acknowledged: boolean;
  created_at: string;
  opportunity?: Opportunity;
}

export interface NotificationItem {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'deadline' | 'recommendation' | 'application_update' | 'system';
  link?: string;
  is_read: boolean;
  created_at: string;
}
