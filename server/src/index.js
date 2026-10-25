import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { initialOpportunities } from './data/initialOpportunities.js';
import { calculateMatch } from './services/aiMatcher.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDistPath = path.resolve(__dirname, '../../client/dist');

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.static(clientDistPath));

// In-Memory persistent store for local and fallback execution (mirrors Supabase schema)
let opportunities = [...initialOpportunities];

let users = [
  {
    id: "user-student-01",
    email: "student@demo.com",
    password: "demo123", // In production with Supabase Auth, handles crypto hashing
    role: "student"
  },
  {
    id: "user-admin-01",
    email: "admin@demo.com",
    password: "admin123",
    role: "admin"
  }
];

let profiles = {
  "user-student-01": {
    id: "prof-001",
    user_id: "user-student-01",
    email: "student@demo.com",
    full_name: "Aarav Sharma",
    college_university: "National Institute of Technology (NIT)",
    degree_department: "B.Tech Computer Science",
    current_year: "3rd Year",
    graduation_year: "2027",
    skills: ["Python", "SQL", "Machine Learning", "Data Structures", "React", "Git"],
    interests: ["Data Analytics", "Artificial Intelligence", "Web Development", "Open Source"],
    preferred_types: ["Internships", "Hackathons", "Scholarships", "Training programs"],
    preferred_locations: ["Bengaluru", "Remote", "Hyderabad"],
    mode_preference: "Hybrid",
    resume_url: "sample_resume_aarav.pdf",
    gpa_or_percentage: "8.8 CGPA",
    career_goals: "Machine Learning Engineer / AI Researcher",
    role: "student",
    created_at: new Date().toISOString()
  },
  "user-admin-01": {
    id: "prof-admin",
    user_id: "user-admin-01",
    email: "admin@demo.com",
    full_name: "Platform Administrator",
    college_university: "OpportunityAI Admin Center",
    degree_department: "Administration",
    current_year: "Staff",
    graduation_year: "N/A",
    skills: ["Management", "Platform Moderation"],
    interests: ["Education", "Career Guidance"],
    preferred_types: [],
    preferred_locations: [],
    mode_preference: "Any",
    resume_url: null,
    gpa_or_percentage: null,
    career_goals: "Empower students through transparent opportunity discovery",
    role: "admin",
    created_at: new Date().toISOString()
  }
};

let savedOpportunities = [
  { id: "saved-1", user_id: "user-student-01", opportunity_id: "opp-001", saved_at: "2026-10-18T14:20:00Z" },
  { id: "saved-2", user_id: "user-student-01", opportunity_id: "opp-004", saved_at: "2026-10-19T10:00:00Z" }
];

let applications = [
  {
    id: "app-1",
    user_id: "user-student-01",
    opportunity_id: "opp-001",
    status: "Preparing application",
    applied_date: null,
    personal_notes: "Drafted project proposal for Apache and TensorFlow organizations.",
    next_action: "Review proposal with senior mentor and submit draft.",
    next_action_date: "2026-11-02T12:00:00Z",
    created_at: "2026-10-18T14:22:00Z",
    updated_at: "2026-10-20T10:00:00Z"
  },
  {
    id: "app-2",
    user_id: "user-student-01",
    opportunity_id: "opp-005",
    status: "Applied",
    applied_date: "2026-10-16T18:00:00Z",
    personal_notes: "Formed 3-member team 'ByteCrafters'. Cleared initial coding screening round.",
    next_action: "Prepare for System Design round.",
    next_action_date: "2026-11-04T15:00:00Z",
    created_at: "2026-10-16T18:00:00Z",
    updated_at: "2026-10-19T11:00:00Z"
  }
];

let checklists = [
  { id: "chk-1", application_id: "app-1", user_id: "user-student-01", task_title: "Read organization project ideas list", is_completed: true, due_date: "2026-10-25T18:00:00Z" },
  { id: "chk-2", application_id: "app-1", user_id: "user-student-01", task_title: "Reach out to mentor on Gitter / Slack", is_completed: true, due_date: "2026-10-28T18:00:00Z" },
  { id: "chk-3", application_id: "app-1", user_id: "user-student-01", task_title: "Complete first pull request to open-source repository", is_completed: false, due_date: "2026-11-01T18:00:00Z" },
  { id: "chk-4", application_id: "app-1", user_id: "user-student-01", task_title: "Submit final application draft on GSoC portal", is_completed: false, due_date: "2026-11-14T23:59:59Z" },
  { id: "chk-5", application_id: "app-2", user_id: "user-student-01", task_title: "Review Dynamic Programming and Graph algorithms", is_completed: true, due_date: "2026-10-20T18:00:00Z" },
  { id: "chk-6", application_id: "app-2", user_id: "user-student-01", task_title: "Submit team member college ID cards", is_completed: true, due_date: "2026-10-22T18:00:00Z" }
];

let reminders = [
  {
    id: "rem-1",
    user_id: "user-student-01",
    opportunity_id: "opp-003",
    reminder_date: "2026-11-03T09:00:00Z",
    reminder_type: "in_app",
    notes: "Deadline approaching in 2 days. Gather family income certificate.",
    is_acknowledged: false,
    created_at: "2026-10-15T10:00:00Z"
  },
  {
    id: "rem-2",
    user_id: "user-student-01",
    opportunity_id: "opp-005",
    reminder_date: "2026-11-08T10:00:00Z",
    reminder_type: "email",
    notes: "Flipkart GRiD round 2 submission window closes.",
    is_acknowledged: false,
    created_at: "2026-10-17T12:00:00Z"
  }
];

let notifications = [
  {
    id: "notif-1",
    user_id: "user-student-01",
    title: "New 95% AI Match Discovered!",
    message: "Google Summer of Code matches your Python, SQL, and Open Source skills.",
    type: "recommendation",
    link: "/opportunities/opp-001",
    is_read: false,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString()
  },
  {
    id: "notif-2",
    user_id: "user-student-01",
    title: "Upcoming Deadline Alert",
    message: "Reliance Foundation Undergraduate Scholarship closes in less than 2 weeks.",
    type: "deadline",
    link: "/opportunities/opp-003",
    is_read: false,
    created_at: new Date(Date.now() - 24 * 3600 * 1000).toISOString()
  },
  {
    id: "notif-3",
    user_id: "user-student-01",
    title: "Application Status Update",
    message: "Your application for Flipkart GRiD 7.0 is marked as 'Applied'. Good luck!",
    type: "application_update",
    link: "/applications",
    is_read: true,
    created_at: new Date(Date.now() - 48 * 3600 * 1000).toISOString()
  }
];

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'OpportunityAI Backend', timestamp: new Date().toISOString() });
});

// Helper: Extract user from Authorization Header (Bearer <userId> or demo token)
function getAuthUser(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return null;
  const token = authHeader.replace('Bearer ', '').trim();
  const user = users.find(u => u.id === token || u.email === token);
  return user || null;
}

// ---------------- AUTHENTICATION & PROFILES ---------------- //

app.post('/api/auth/register', (req, res) => {
  const { email, password, full_name, college_university, degree_department, current_year } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }

  const existing = users.find(u => u.email.toLowerCase() === email.toLowerCase());
  if (existing) {
    return res.status(400).json({ error: 'An account with this email already exists' });
  }

  const newUserId = `user-${Date.now()}`;
  const newUser = {
    id: newUserId,
    email,
    password,
    role: 'student'
  };
  users.push(newUser);

  const newProfile = {
    id: `prof-${Date.now()}`,
    user_id: newUserId,
    email,
    full_name: full_name || email.split('@')[0],
    college_university: college_university || '',
    degree_department: degree_department || '',
    current_year: current_year || '1st Year',
    graduation_year: '',
    skills: [],
    interests: [],
    preferred_types: ['Scholarships', 'Internships', 'Hackathons'],
    preferred_locations: ['Remote'],
    mode_preference: 'Any',
    resume_url: null,
    gpa_or_percentage: '',
    career_goals: '',
    role: 'student',
    created_at: new Date().toISOString()
  };
  profiles[newUserId] = newProfile;

  // Add welcome notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: newUserId,
    title: 'Welcome to OpportunityAI!',
    message: 'Complete your student profile to start receiving personalized AI recommendations.',
    type: 'system',
    link: '/profile',
    is_read: false,
    created_at: new Date().toISOString()
  });

  res.status(201).json({
    user: { id: newUser.id, email: newUser.email, role: newUser.role },
    profile: newProfile,
    token: newUser.id
  });
});

app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());

  if (!user || user.password !== password) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }

  const profile = profiles[user.id] || {
    id: `prof-${user.id}`,
    user_id: user.id,
    email: user.email,
    full_name: user.email.split('@')[0],
    role: user.role
  };

  res.json({
    user: { id: user.id, email: user.email, role: user.role },
    profile,
    token: user.id
  });
});

app.post('/api/auth/forgot-password', (req, res) => {
  const { email } = req.body;
  const user = users.find(u => u.email.toLowerCase() === (email || '').toLowerCase());
  // Always return success for security, but indicate simulation
  res.json({
    message: user
      ? `A password reset link has been dispatched to ${email}. (Demo note: You can continue logging in with password 'demo123')`
      : `If an account with that email exists, a password reset link has been dispatched.`
  });
});

app.get('/api/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const profile = profiles[user.id] || { user_id: user.id, email: user.email, role: user.role };
  res.json(profile);
});

app.put('/api/profile', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const existing = profiles[user.id] || { user_id: user.id, email: user.email, role: user.role };
  const updated = {
    ...existing,
    ...req.body,
    user_id: user.id,
    email: user.email, // preserve primary email
    updated_at: new Date().toISOString()
  };
  profiles[user.id] = updated;

  res.json({ message: 'Profile updated successfully', profile: updated });
});

// ---------------- OPPORTUNITY DISCOVERY & DETAILS ---------------- //

app.get('/api/opportunities', (req, res) => {
  const user = getAuthUser(req);
  const profile = user ? profiles[user.id] : null;

  const { search, category, mode, location, skill, sort, freeOnly } = req.query;

  let results = [...opportunities];

  // Category filter
  if (category && category !== 'All') {
    results = results.filter(opp => opp.category.toLowerCase() === category.toLowerCase());
  }

  // Delivery mode filter
  if (mode && mode !== 'All') {
    results = results.filter(opp => opp.delivery_mode.toLowerCase() === mode.toLowerCase());
  }

  // Location filter
  if (location && location !== 'All') {
    results = results.filter(opp => opp.location.toLowerCase().includes(location.toLowerCase()));
  }

  // Skill filter
  if (skill) {
    const sLower = skill.toLowerCase();
    results = results.filter(opp => (opp.required_skills || []).some(s => s.toLowerCase().includes(sLower)));
  }

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    results = results.filter(opp =>
      opp.title.toLowerCase().includes(q) ||
      opp.organization.toLowerCase().includes(q) ||
      opp.description.toLowerCase().includes(q) ||
      (opp.tags || []).some(t => t.toLowerCase().includes(q)) ||
      (opp.required_skills || []).some(s => s.toLowerCase().includes(q))
    );
  }

  // Compute AI Match score for each opportunity relative to student profile
  results = results.map(opp => {
    const aiAnalysis = calculateMatch(profile, opp);
    return {
      ...opp,
      aiMatch: aiAnalysis
    };
  });

  // Sorting
  if (sort === 'relevance' && profile) {
    results.sort((a, b) => b.aiMatch.score - a.aiMatch.score);
  } else if (sort === 'deadline') {
    results.sort((a, b) => new Date(a.application_deadline) - new Date(b.application_deadline));
  } else if (sort === 'newest') {
    results.sort((a, b) => new Date(b.date_added || b.created_at) - new Date(a.date_added || a.created_at));
  }

  res.json(results);
});

app.get('/api/opportunities/:id', (req, res) => {
  const opp = opportunities.find(o => o.id === req.params.id);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  const user = getAuthUser(req);
  const profile = user ? profiles[user.id] : null;
  const aiAnalysis = calculateMatch(profile, opp);

  // Check if saved or applied
  const isSaved = user ? savedOpportunities.some(s => s.user_id === user.id && s.opportunity_id === opp.id) : false;
  const existingApp = user ? applications.find(a => a.user_id === user.id && a.opportunity_id === opp.id) : null;

  res.json({
    ...opp,
    aiMatch: aiAnalysis,
    isSaved,
    application: existingApp
  });
});

// ---------------- AI RECOMMENDATIONS ---------------- //

app.get('/api/recommendations', (req, res) => {
  const user = getAuthUser(req);
  const profile = user ? profiles[user.id] : profiles['user-student-01']; // demo fallback

  // Match all opportunities and rank
  const ranked = opportunities.map(opp => {
    const aiAnalysis = calculateMatch(profile, opp);
    return {
      ...opp,
      aiMatch: aiAnalysis
    };
  });

  // Sort descending by AI match score
  ranked.sort((a, b) => b.aiMatch.score - a.aiMatch.score);

  res.json({
    studentProfile: profile,
    topRecommendations: ranked.slice(0, 10),
    allRanked: ranked
  });
});

// ---------------- SAVED OPPORTUNITIES ---------------- //

app.get('/api/saved', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const userSaved = savedOpportunities.filter(s => s.user_id === user.id);
  const profile = profiles[user.id];

  const enriched = userSaved.map(saved => {
    const opp = opportunities.find(o => o.id === saved.opportunity_id);
    if (!opp) return null;
    const aiAnalysis = calculateMatch(profile, opp);
    return {
      ...opp,
      saved_id: saved.id,
      saved_at: saved.saved_at,
      aiMatch: aiAnalysis
    };
  }).filter(Boolean);

  res.json(enriched);
});

app.post('/api/saved/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const oppId = req.params.id;
  const opp = opportunities.find(o => o.id === oppId);
  if (!opp) return res.status(404).json({ error: 'Opportunity not found' });

  const alreadySaved = savedOpportunities.find(s => s.user_id === user.id && s.opportunity_id === oppId);
  if (alreadySaved) {
    return res.json({ message: 'Opportunity already saved', saved: alreadySaved });
  }

  const newSaved = {
    id: `saved-${Date.now()}`,
    user_id: user.id,
    opportunity_id: oppId,
    saved_at: new Date().toISOString()
  };
  savedOpportunities.push(newSaved);

  res.status(201).json({ message: 'Opportunity saved successfully', saved: newSaved });
});

app.delete('/api/saved/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const oppId = req.params.id;
  savedOpportunities = savedOpportunities.filter(s => !(s.user_id === user.id && (s.opportunity_id === oppId || s.id === oppId)));

  res.json({ message: 'Opportunity removed from saved list' });
});

// ---------------- APPLICATION TRACKER ---------------- //

app.get('/api/applications', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const userApps = applications.filter(a => a.user_id === user.id);
  const profile = profiles[user.id];

  const enriched = userApps.map(appItem => {
    const opp = opportunities.find(o => o.id === appItem.opportunity_id);
    const appChecklists = checklists.filter(c => c.application_id === appItem.id);
    const aiAnalysis = opp ? calculateMatch(profile, opp) : null;

    return {
      ...appItem,
      opportunity: opp,
      checklists: appChecklists,
      aiMatch: aiAnalysis
    };
  });

  res.json(enriched);
});

app.post('/api/applications', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const { opportunity_id, status, personal_notes, next_action, next_action_date } = req.body;
  if (!opportunity_id) return res.status(400).json({ error: 'Opportunity ID is required' });

  const existing = applications.find(a => a.user_id === user.id && a.opportunity_id === opportunity_id);
  if (existing) {
    return res.status(400).json({ error: 'This opportunity is already in your application tracker' });
  }

  const newAppId = `app-${Date.now()}`;
  const newApp = {
    id: newAppId,
    user_id: user.id,
    opportunity_id,
    status: status || 'Interested',
    applied_date: status === 'Applied' ? new Date().toISOString() : null,
    personal_notes: personal_notes || '',
    next_action: next_action || 'Review eligibility and prepare documents',
    next_action_date: next_action_date || new Date(Date.now() + 7 * 86400 * 1000).toISOString(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString()
  };
  applications.push(newApp);

  // Generate standard preparation checklist items
  const defaultTasks = [
    'Read full eligibility criteria and guidelines',
    'Update resume with matching skills & projects',
    'Prepare letters of recommendation / academic transcripts',
    'Draft and polish statement of purpose or application answers',
    'Submit official online application before deadline',
    'Save application reference number & confirmation email'
  ];

  defaultTasks.forEach((task, index) => {
    checklists.push({
      id: `chk-${Date.now()}-${index}`,
      application_id: newAppId,
      user_id: user.id,
      task_title: task,
      is_completed: false,
      due_date: new Date(Date.now() + (index + 2) * 86400 * 1000).toISOString()
    });
  });

  // Send in-app notification
  notifications.unshift({
    id: `notif-${Date.now()}`,
    user_id: user.id,
    title: 'Added to Application Tracker',
    message: `You started tracking your application for ${opportunities.find(o => o.id === opportunity_id)?.title || 'opportunity'}. Checklist generated!`,
    type: 'application_update',
    link: '/applications',
    is_read: false,
    created_at: new Date().toISOString()
  });

  res.status(201).json({ message: 'Application added to tracker', application: newApp });
});

app.put('/api/applications/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const appId = req.params.id;
  const index = applications.findIndex(a => a.id === appId && a.user_id === user.id);
  if (index === -1) return res.status(404).json({ error: 'Tracked application not found' });

  const updated = {
    ...applications[index],
    ...req.body,
    updated_at: new Date().toISOString()
  };

  // If status changed to applied and no applied_date, set it
  if (req.body.status === 'Applied' && !updated.applied_date) {
    updated.applied_date = new Date().toISOString();
  }

  applications[index] = updated;

  res.json({ message: 'Application updated', application: updated });
});

app.delete('/api/applications/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized. Please login.' });

  const appId = req.params.id;
  applications = applications.filter(a => !(a.id === appId && a.user_id === user.id));
  checklists = checklists.filter(c => c.application_id !== appId);

  res.json({ message: 'Application removed from tracker' });
});

// ---------------- CHECKLISTS & REMINDERS ---------------- //

app.get('/api/checklists/:appId', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const items = checklists.filter(c => c.application_id === req.params.appId && c.user_id === user.id);
  res.json(items);
});

app.post('/api/checklists', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { application_id, task_title, due_date } = req.body;
  if (!application_id || !task_title) {
    return res.status(400).json({ error: 'application_id and task_title are required' });
  }

  const newItem = {
    id: `chk-${Date.now()}`,
    application_id,
    user_id: user.id,
    task_title,
    is_completed: false,
    due_date: due_date || null
  };
  checklists.push(newItem);
  res.status(201).json(newItem);
});

app.put('/api/checklists/:id/toggle', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const item = checklists.find(c => c.id === req.params.id && c.user_id === user.id);
  if (!item) return res.status(404).json({ error: 'Checklist item not found' });

  item.is_completed = !item.is_completed;
  res.json(item);
});

app.get('/api/reminders', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userReminders = reminders.filter(r => r.user_id === user.id).map(r => {
    const opp = opportunities.find(o => o.id === r.opportunity_id);
    return { ...r, opportunity: opp };
  });

  res.json(userReminders);
});

app.post('/api/reminders', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const { opportunity_id, reminder_date, reminder_type, notes } = req.body;
  if (!opportunity_id || !reminder_date) {
    return res.status(400).json({ error: 'opportunity_id and reminder_date are required' });
  }

  const newRem = {
    id: `rem-${Date.now()}`,
    user_id: user.id,
    opportunity_id,
    reminder_date,
    reminder_type: reminder_type || 'in_app',
    notes: notes || '',
    is_acknowledged: false,
    created_at: new Date().toISOString()
  };
  reminders.push(newRem);

  res.status(201).json({ message: 'Reminder set successfully', reminder: newRem });
});

app.delete('/api/reminders/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  reminders = reminders.filter(r => !(r.id === req.params.id && r.user_id === user.id));
  res.json({ message: 'Reminder deleted' });
});

// ---------------- NOTIFICATIONS ---------------- //

app.get('/api/notifications', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const userNotifs = notifications.filter(n => n.user_id === user.id);
  res.json(userNotifs);
});

app.put('/api/notifications/:id/read', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  const notif = notifications.find(n => n.id === req.params.id && n.user_id === user.id);
  if (notif) notif.is_read = true;
  res.json({ message: 'Marked as read' });
});

app.post('/api/notifications/mark-all-read', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized' });

  notifications.forEach(n => {
    if (n.user_id === user.id) n.is_read = true;
  });
  res.json({ message: 'All notifications marked as read' });
});

// ---------------- ADMIN DASHBOARD & OPERATIONS ---------------- //

function verifyAdmin(req, res, next) {
  const user = getAuthUser(req);
  if (!user || user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privilege required.' });
  }
  next();
}

app.get('/api/admin/stats', verifyAdmin, (req, res) => {
  const totalStudents = users.filter(u => u.role === 'student').length;
  const totalOpportunities = opportunities.length;
  const verifiedCount = opportunities.filter(o => o.verification_status === 'verified').length;
  const unverifiedCount = opportunities.filter(o => o.verification_status === 'unverified').length;
  const totalTrackedApplications = applications.length;

  const categoryCounts = {};
  opportunities.forEach(opp => {
    categoryCounts[opp.category] = (categoryCounts[opp.category] || 0) + 1;
  });

  const categoryDistribution = Object.keys(categoryCounts).map(cat => ({
    name: cat,
    count: categoryCounts[cat]
  }));

  res.json({
    totalStudents,
    totalOpportunities,
    verifiedCount,
    unverifiedCount,
    totalTrackedApplications,
    categoryDistribution
  });
});

app.post('/api/admin/opportunities', verifyAdmin, (req, res) => {
  const {
    title, organization, description, category, eligibility_requirements,
    required_skills, education_requirements, location, delivery_mode,
    stipend_or_prize, application_deadline, application_url, source_url,
    verification_status, tags
  } = req.body;

  if (!title || !organization || !category || !application_deadline) {
    return res.status(400).json({ error: 'Title, organization, category, and deadline are required' });
  }

  const newOpp = {
    id: `opp-custom-${Date.now()}`,
    title,
    organization,
    description: description || '',
    category,
    eligibility_requirements: eligibility_requirements || 'Open to eligible college students.',
    required_skills: Array.isArray(required_skills) ? required_skills : (required_skills || '').split(',').map(s => s.trim()).filter(Boolean),
    education_requirements: Array.isArray(education_requirements) ? education_requirements : (education_requirements || '').split(',').map(s => s.trim()).filter(Boolean),
    location: location || 'India-wide / Remote',
    delivery_mode: delivery_mode || 'Online',
    stipend_or_prize: stipend_or_prize || 'N/A',
    application_deadline,
    application_url: application_url || 'https://example.com',
    source_url: source_url || 'https://example.com',
    verification_status: verification_status || 'verified',
    is_demo_data: false,
    tags: Array.isArray(tags) ? tags : (tags || '').split(',').map(t => t.trim()).filter(Boolean),
    date_added: new Date().toISOString()
  };

  opportunities.unshift(newOpp);

  // Notify registered students about new opportunity
  users.filter(u => u.role === 'student').forEach(u => {
    notifications.unshift({
      id: `notif-${Date.now()}-${u.id}`,
      user_id: u.id,
      title: `New ${newOpp.category} Added: ${newOpp.title}`,
      message: `${newOpp.organization} just posted a new opportunity. Check if it matches your skills!`,
      type: 'recommendation',
      link: `/opportunities/${newOpp.id}`,
      is_read: false,
      created_at: new Date().toISOString()
    });
  });

  res.status(201).json({ message: 'Opportunity created successfully', opportunity: newOpp });
});

app.put('/api/admin/opportunities/:id', verifyAdmin, (req, res) => {
  const oppId = req.params.id;
  const index = opportunities.findIndex(o => o.id === oppId);
  if (index === -1) return res.status(404).json({ error: 'Opportunity not found' });

  const existing = opportunities[index];
  const updated = {
    ...existing,
    ...req.body,
    id: existing.id // protect ID
  };

  opportunities[index] = updated;
  res.json({ message: 'Opportunity updated successfully', opportunity: updated });
});

app.delete('/api/admin/opportunities/:id', verifyAdmin, (req, res) => {
  const oppId = req.params.id;
  const initialLen = opportunities.length;
  opportunities = opportunities.filter(o => o.id !== oppId);

  if (opportunities.length === initialLen) {
    return res.status(404).json({ error: 'Opportunity not found' });
  }

  res.json({ message: 'Opportunity removed successfully' });
});

// CSV Import endpoint
app.post('/api/admin/import-csv', verifyAdmin, (req, res) => {
  const { csvText } = req.body;
  if (!csvText) {
    return res.status(400).json({ error: 'CSV text content is required' });
  }

  try {
    const lines = csvText.trim().split('\n').map(l => l.trim()).filter(Boolean);
    if (lines.length < 2) {
      return res.status(400).json({ error: 'CSV must contain at least a header and one row' });
    }

    const header = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
    let importedCount = 0;

    for (let i = 1; i < lines.length; i++) {
      // Basic CSV splitter handling quotes
      const values = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''));
      if (values.length < 3) continue;

      const oppObj = {
        id: `opp-import-${Date.now()}-${i}`,
        title: values[0] || 'Untitled Opportunity',
        organization: values[1] || 'Organization',
        category: values[2] || 'Internships',
        description: values[3] || 'Imported via Admin CSV',
        eligibility_requirements: values[4] || 'Open to college students',
        required_skills: (values[5] || 'General').split(';').map(s => s.trim()),
        location: values[6] || 'Remote',
        delivery_mode: values[7] || 'Online',
        stipend_or_prize: values[8] || 'Unspecified',
        application_deadline: values[9] || new Date(Date.now() + 30 * 86400 * 1000).toISOString(),
        application_url: values[10] || 'https://opportunity.example.com',
        verification_status: 'verified',
        is_demo_data: false,
        date_added: new Date().toISOString()
      };

      opportunities.unshift(oppObj);
      importedCount++;
    }

    res.json({ message: `Successfully imported ${importedCount} opportunities from CSV` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to parse CSV file: ' + err.message });
  }
});

// Serve frontend Single Page Application (SPA) for any non-API routes
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next();
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

// Start listening
app.listen(port, () => {
  console.log(`OpportunityAI Server running on port ${port}`);
});
