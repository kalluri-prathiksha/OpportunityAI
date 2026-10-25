-- OpportunityAI Supabase PostgreSQL Schema
-- Complete schema with Row Level Security (RLS) & Indexes

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked to Supabase Auth)
CREATE TABLE IF NOT EXISTS public.student_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT NOT NULL,
    college_university TEXT,
    degree_department TEXT,
    current_year TEXT,
    graduation_year TEXT,
    skills TEXT[] DEFAULT '{}',
    interests TEXT[] DEFAULT '{}',
    preferred_types TEXT[] DEFAULT '{}',
    preferred_locations TEXT[] DEFAULT '{}',
    mode_preference TEXT DEFAULT 'Any', -- Online, Offline, Hybrid, Any
    resume_url TEXT,
    gpa_or_percentage TEXT,
    career_goals TEXT,
    role TEXT DEFAULT 'student', -- 'student' or 'admin'
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    organization TEXT NOT NULL,
    description TEXT NOT NULL,
    category TEXT NOT NULL CHECK (category IN (
        'Scholarships',
        'Internships',
        'Hackathons',
        'Competitions',
        'Training programs',
        'Fellowships',
        'Online courses'
    )),
    eligibility_requirements TEXT NOT NULL,
    required_skills TEXT[] DEFAULT '{}',
    education_requirements TEXT[] DEFAULT '{}',
    location TEXT NOT NULL,
    delivery_mode TEXT NOT NULL CHECK (delivery_mode IN ('Online', 'Offline', 'Hybrid')),
    stipend_or_prize TEXT,
    application_deadline TIMESTAMPTZ NOT NULL,
    application_url TEXT NOT NULL,
    source_url TEXT,
    verification_status TEXT DEFAULT 'verified' CHECK (verification_status IN ('verified', 'unverified', 'pending', 'expired')),
    is_demo_data BOOLEAN DEFAULT true,
    tags TEXT[] DEFAULT '{}',
    date_added TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. SAVED OPPORTUNITIES TABLE
CREATE TABLE IF NOT EXISTS public.saved_opportunities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    saved_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- 4. APPLICATION TRACKER TABLE
CREATE TABLE IF NOT EXISTS public.applications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'Interested' CHECK (status IN (
        'Interested',
        'Preparing application',
        'Applied',
        'Assessment or interview',
        'Accepted',
        'Rejected',
        'Withdrawn'
    )),
    applied_date TIMESTAMPTZ,
    personal_notes TEXT,
    next_action TEXT,
    next_action_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, opportunity_id)
);

-- 5. APPLICATION CHECKLISTS TABLE
CREATE TABLE IF NOT EXISTS public.application_checklists (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    application_id UUID REFERENCES public.applications(id) ON DELETE CASCADE,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    task_title TEXT NOT NULL,
    is_completed BOOLEAN DEFAULT false,
    due_date TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 6. REMINDERS TABLE
CREATE TABLE IF NOT EXISTS public.reminders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    opportunity_id UUID REFERENCES public.opportunities(id) ON DELETE CASCADE,
    reminder_date TIMESTAMPTZ NOT NULL,
    reminder_type TEXT DEFAULT 'in_app' CHECK (reminder_type IN ('in_app', 'email')),
    notes TEXT,
    is_acknowledged BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. NOTIFICATIONS TABLE
CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    type TEXT DEFAULT 'recommendation' CHECK (type IN ('deadline', 'recommendation', 'application_update', 'system')),
    link TEXT,
    is_read BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- INDEXES for fast filtering and query performance
CREATE INDEX IF NOT EXISTS idx_student_profiles_user_id ON public.student_profiles(user_id);
CREATE INDEX IF NOT EXISTS idx_opportunities_category ON public.opportunities(category);
CREATE INDEX IF NOT EXISTS idx_opportunities_deadline ON public.opportunities(application_deadline);
CREATE INDEX IF NOT EXISTS idx_saved_user_id ON public.saved_opportunities(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON public.applications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON public.notifications(user_id);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.student_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_opportunities ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.application_checklists ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reminders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- 1. Student Profiles RLS
CREATE POLICY "Users can view own profile"
    ON public.student_profiles FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile"
    ON public.student_profiles FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile"
    ON public.student_profiles FOR UPDATE
    USING (auth.uid() = user_id);

-- 2. Opportunities RLS (All authenticated or anonymous can read verified opportunities)
CREATE POLICY "Anyone can view active opportunities"
    ON public.opportunities FOR SELECT
    USING (true);

CREATE POLICY "Only admins can insert opportunities"
    ON public.opportunities FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can update opportunities"
    ON public.opportunities FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Only admins can delete opportunities"
    ON public.opportunities FOR DELETE
    USING (
        EXISTS (
            SELECT 1 FROM public.student_profiles
            WHERE user_id = auth.uid() AND role = 'admin'
        )
    );

-- 3. Saved Opportunities RLS
CREATE POLICY "Users can manage own saved opportunities"
    ON public.saved_opportunities FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 4. Applications RLS
CREATE POLICY "Users can manage own applications"
    ON public.applications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 5. Checklists RLS
CREATE POLICY "Users can manage own checklists"
    ON public.application_checklists FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 6. Reminders RLS
CREATE POLICY "Users can manage own reminders"
    ON public.reminders FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- 7. Notifications RLS
CREATE POLICY "Users can view and update own notifications"
    ON public.notifications FOR ALL
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);
