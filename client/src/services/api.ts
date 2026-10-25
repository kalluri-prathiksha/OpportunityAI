import { 
  Opportunity, 
  StudentProfile, 
  User, 
  ApplicationItem, 
  ChecklistItem, 
  ReminderItem, 
  NotificationItem 
} from '../types';

const API_BASE = '/api';

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('opportunityai_token');
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    'Content-Type': 'application/json',
    ...getAuthHeader(),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = `Request failed: ${response.statusText}`;
    try {
      const errorData = await response.json();
      if (errorData.error) errorMessage = errorData.error;
    } catch {
      // Ignore fallback
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export const api = {
  // Auth
  async login(email: string, password: string):Promise<{ user: User; profile: StudentProfile; token: string }> {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  async register(data: {
    email: string;
    password: string;
    full_name?: string;
    college_university?: string;
    degree_department?: string;
    current_year?: string;
  }): Promise<{ user: User; profile: StudentProfile; token: string }> {
    return request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async forgotPassword(email: string): Promise<{ message: string }> {
    return request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email }),
    });
  },

  // Profile
  async getProfile(): Promise<StudentProfile> {
    return request('/profile');
  },

  async updateProfile(profile: Partial<StudentProfile>): Promise<{ message: string; profile: StudentProfile }> {
    return request('/profile', {
      method: 'PUT',
      body: JSON.stringify(profile),
    });
  },

  // Opportunities
  async getOpportunities(params: {
    search?: string;
    category?: string;
    mode?: string;
    location?: string;
    skill?: string;
    sort?: string;
  } = {}): Promise<Opportunity[]> {
    const query = new URLSearchParams();
    if (params.search) query.append('search', params.search);
    if (params.category) query.append('category', params.category);
    if (params.mode) query.append('mode', params.mode);
    if (params.location) query.append('location', params.location);
    if (params.skill) query.append('skill', params.skill);
    if (params.sort) query.append('sort', params.sort);

    return request(`/opportunities?${query.toString()}`);
  },

  async getOpportunity(id: string): Promise<Opportunity & { isSaved?: boolean; application?: ApplicationItem | null }> {
    return request(`/opportunities/${id}`);
  },

  // AI Recommendations
  async getRecommendations(): Promise<{
    studentProfile: StudentProfile;
    topRecommendations: Opportunity[];
    allRanked: Opportunity[];
  }> {
    return request('/recommendations');
  },

  // Saved
  async getSaved(): Promise<Opportunity[]> {
    return request('/saved');
  },

  async saveOpportunity(id: string): Promise<{ message: string }> {
    return request(`/saved/${id}`, { method: 'POST' });
  },

  async unsaveOpportunity(id: string): Promise<{ message: string }> {
    return request(`/saved/${id}`, { method: 'DELETE' });
  },

  // Applications
  async getApplications(): Promise<ApplicationItem[]> {
    return request('/applications');
  },

  async addApplication(data: {
    opportunity_id: string;
    status?: string;
    personal_notes?: string;
    next_action?: string;
    next_action_date?: string;
  }): Promise<{ message: string; application: ApplicationItem }> {
    return request('/applications', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async updateApplication(id: string, data: Partial<ApplicationItem>): Promise<{ message: string; application: ApplicationItem }> {
    return request(`/applications/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async deleteApplication(id: string): Promise<{ message: string }> {
    return request(`/applications/${id}`, { method: 'DELETE' });
  },

  // Checklists
  async getChecklists(appId: string): Promise<ChecklistItem[]> {
    return request(`/checklists/${appId}`);
  },

  async toggleChecklist(id: string): Promise<ChecklistItem> {
    return request(`/checklists/${id}/toggle`, { method: 'PUT' });
  },

  async addChecklistItem(data: { application_id: string; task_title: string; due_date?: string }): Promise<ChecklistItem> {
    return request('/checklists', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  // Reminders
  async getReminders(): Promise<ReminderItem[]> {
    return request('/reminders');
  },

  async addReminder(data: {
    opportunity_id: string;
    reminder_date: string;
    reminder_type?: 'in_app' | 'email';
    notes?: string;
  }): Promise<{ message: string; reminder: ReminderItem }> {
    return request('/reminders', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async deleteReminder(id: string): Promise<{ message: string }> {
    return request(`/reminders/${id}`, { method: 'DELETE' });
  },

  // Notifications
  async getNotifications(): Promise<NotificationItem[]> {
    return request('/notifications');
  },

  async markNotificationRead(id: string): Promise<{ message: string }> {
    return request(`/notifications/${id}/read`, { method: 'PUT' });
  },

  async markAllNotificationsRead(): Promise<{ message: string }> {
    return request('/notifications/mark-all-read', { method: 'POST' });
  },

  // Admin
  async getAdminStats(): Promise<{
    totalStudents: number;
    totalOpportunities: number;
    verifiedCount: number;
    unverifiedCount: number;
    totalTrackedApplications: number;
    categoryDistribution: { name: string; count: number }[];
  }> {
    return request('/admin/stats');
  },

  async createOpportunity(opp: Partial<Opportunity>): Promise<{ message: string; opportunity: Opportunity }> {
    return request('/admin/opportunities', {
      method: 'POST',
      body: JSON.stringify(opp),
    });
  },

  async updateOpportunity(id: string, opp: Partial<Opportunity>): Promise<{ message: string; opportunity: Opportunity }> {
    return request(`/admin/opportunities/${id}`, {
      method: 'PUT',
      body: JSON.stringify(opp),
    });
  },

  async deleteOpportunity(id: string): Promise<{ message: string }> {
    return request(`/admin/opportunities/${id}`, { method: 'DELETE' });
  },

  async importCsv(csvText: string): Promise<{ message: string }> {
    return request('/admin/import-csv', {
      method: 'POST',
      body: JSON.stringify({ csvText }),
    });
  },
};
