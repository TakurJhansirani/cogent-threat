
-- ==========================================
-- ENUMS
-- ==========================================
CREATE TYPE public.app_role AS ENUM ('admin', 'analyst', 'viewer');
CREATE TYPE public.severity AS ENUM ('critical', 'high', 'medium', 'low', 'info');
CREATE TYPE public.incident_status AS ENUM ('open', 'investigating', 'resolved', 'escalated');
CREATE TYPE public.incident_category AS ENUM ('malware', 'phishing', 'brute-force', 'data-exfiltration', 'insider-threat', 'dos', 'unauthorized-access', 'reconnaissance');
CREATE TYPE public.note_type AS ENUM ('observation', 'correction', 'recommendation', 'escalation');
CREATE TYPE public.ai_learning_type AS ENUM ('model-update', 'rule-tuned', 'fp-correction', 'pattern-learned', 'threshold-adjusted');
CREATE TYPE public.notification_category AS ENUM ('critical', 'escalation', 'system', 'ai-insight');

-- ==========================================
-- USER ROLES TABLE (no policies yet)
-- ==========================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL,
  UNIQUE (user_id, role)
);
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- ==========================================
-- SECURITY DEFINER FUNCTION (before any policies that use it)
-- ==========================================
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- Now add user_roles policies
CREATE POLICY "Roles viewable by authenticated" ON public.user_roles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Only admins can manage roles" ON public.user_roles FOR ALL TO authenticated USING (public.has_role(auth.uid(), 'admin'));

-- ==========================================
-- PROFILES
-- ==========================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  display_name TEXT,
  avatar_url TEXT,
  role_title TEXT DEFAULT 'Analyst',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Profiles viewable by authenticated" ON public.profiles FOR SELECT TO authenticated USING (true);
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE TO authenticated USING (auth.uid() = id);
CREATE POLICY "Users can insert own profile" ON public.profiles FOR INSERT TO authenticated WITH CHECK (auth.uid() = id);

-- ==========================================
-- INCIDENTS
-- ==========================================
CREATE TABLE public.incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  severity severity NOT NULL DEFAULT 'medium',
  status incident_status NOT NULL DEFAULT 'open',
  category incident_category NOT NULL DEFAULT 'malware',
  source_ip TEXT NOT NULL DEFAULT '',
  target_ip TEXT NOT NULL DEFAULT '',
  ai_summary TEXT NOT NULL DEFAULT '',
  confidence_score NUMERIC NOT NULL DEFAULT 0,
  risk_score NUMERIC NOT NULL DEFAULT 0,
  affected_assets TEXT[] NOT NULL DEFAULT '{}',
  is_false_positive BOOLEAN NOT NULL DEFAULT false,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Incidents viewable by authenticated" ON public.incidents FOR SELECT TO authenticated USING (true);
CREATE POLICY "Analysts/admins can insert incidents" ON public.incidents FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
);
CREATE POLICY "Analysts/admins can update incidents" ON public.incidents FOR UPDATE TO authenticated USING (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
);

-- ==========================================
-- TIMELINE EVENTS
-- ==========================================
CREATE TABLE public.timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  incident_id TEXT REFERENCES public.incidents(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  severity severity NOT NULL DEFAULT 'info',
  detail TEXT NOT NULL DEFAULT '',
  event_timestamp TIMESTAMPTZ NOT NULL DEFAULT now(),
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.timeline_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Timeline viewable by authenticated" ON public.timeline_events FOR SELECT TO authenticated USING (true);

-- ==========================================
-- ANALYST NOTES
-- ==========================================
CREATE TABLE public.analyst_notes (
  id TEXT PRIMARY KEY DEFAULT 'NOTE-' || gen_random_uuid(),
  incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  author_id UUID REFERENCES auth.users(id),
  author_name TEXT NOT NULL DEFAULT 'Unknown',
  author_role TEXT NOT NULL DEFAULT 'Analyst',
  content TEXT NOT NULL,
  type note_type NOT NULL DEFAULT 'observation',
  ai_relevant BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.analyst_notes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Notes viewable by authenticated" ON public.analyst_notes FOR SELECT TO authenticated USING (true);
CREATE POLICY "Analysts/admins can insert notes" ON public.analyst_notes FOR INSERT TO authenticated WITH CHECK (
  public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'analyst')
);

-- ==========================================
-- AI LEARNING HISTORY
-- ==========================================
CREATE TABLE public.ai_learning_history (
  id TEXT PRIMARY KEY,
  type ai_learning_type NOT NULL,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  impact TEXT NOT NULL DEFAULT 'neutral',
  related_incidents TEXT[] NOT NULL DEFAULT '{}',
  metrics_change JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.ai_learning_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "AI history viewable by authenticated" ON public.ai_learning_history FOR SELECT TO authenticated USING (true);

-- ==========================================
-- ATTACK CHAINS
-- ==========================================
CREATE TABLE public.attack_chains (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL REFERENCES public.incidents(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  threat TEXT NOT NULL DEFAULT '',
  overall_confidence NUMERIC NOT NULL DEFAULT 0,
  severity severity NOT NULL DEFAULT 'medium',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attack_chains ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Attack chains viewable by authenticated" ON public.attack_chains FOR SELECT TO authenticated USING (true);

-- ==========================================
-- ATTACK CHAIN STEPS
-- ==========================================
CREATE TABLE public.attack_chain_steps (
  id TEXT PRIMARY KEY,
  attack_chain_id TEXT NOT NULL REFERENCES public.attack_chains(id) ON DELETE CASCADE,
  label TEXT NOT NULL,
  technique TEXT NOT NULL DEFAULT '',
  mitre_id TEXT NOT NULL DEFAULT '',
  confidence NUMERIC NOT NULL DEFAULT 0,
  severity severity NOT NULL DEFAULT 'medium',
  detail TEXT NOT NULL DEFAULT '',
  evidence TEXT[] NOT NULL DEFAULT '{}',
  step_order INT NOT NULL DEFAULT 0,
  step_timestamp TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.attack_chain_steps ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Steps viewable by authenticated" ON public.attack_chain_steps FOR SELECT TO authenticated USING (true);

-- ==========================================
-- NOTIFICATIONS
-- ==========================================
CREATE TABLE public.notifications (
  id TEXT PRIMARY KEY DEFAULT 'n-' || gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  message TEXT NOT NULL DEFAULT '',
  category notification_category NOT NULL DEFAULT 'system',
  read BOOLEAN NOT NULL DEFAULT false,
  dismissed BOOLEAN NOT NULL DEFAULT false,
  incident_id TEXT REFERENCES public.incidents(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users see own notifications" ON public.notifications FOR SELECT TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "Users update own notifications" ON public.notifications FOR UPDATE TO authenticated USING (auth.uid() = user_id);
CREATE POLICY "System can insert notifications" ON public.notifications FOR INSERT TO authenticated WITH CHECK (true);

-- ==========================================
-- DASHBOARD METRICS
-- ==========================================
CREATE TABLE public.dashboard_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  total_incidents INT NOT NULL DEFAULT 0,
  critical_alerts INT NOT NULL DEFAULT 0,
  false_positive_rate NUMERIC NOT NULL DEFAULT 0,
  mttr NUMERIC NOT NULL DEFAULT 0,
  resolved_today INT NOT NULL DEFAULT 0,
  escalated INT NOT NULL DEFAULT 0,
  active_analysts INT NOT NULL DEFAULT 0,
  ingestion_rate NUMERIC NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.dashboard_metrics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Metrics viewable by authenticated" ON public.dashboard_metrics FOR SELECT TO authenticated USING (true);

-- ==========================================
-- ALERT TRENDS
-- ==========================================
CREATE TABLE public.alert_trends (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  hour TEXT NOT NULL,
  critical INT NOT NULL DEFAULT 0,
  high INT NOT NULL DEFAULT 0,
  medium INT NOT NULL DEFAULT 0,
  low INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.alert_trends ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Trends viewable by authenticated" ON public.alert_trends FOR SELECT TO authenticated USING (true);

-- ==========================================
-- CATEGORY DISTRIBUTION
-- ==========================================
CREATE TABLE public.category_distribution (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  value INT NOT NULL DEFAULT 0,
  fill TEXT NOT NULL DEFAULT '',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.category_distribution ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Distribution viewable by authenticated" ON public.category_distribution FOR SELECT TO authenticated USING (true);

-- ==========================================
-- RESOLVED INCIDENTS
-- ==========================================
CREATE TABLE public.resolved_incidents (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  severity severity NOT NULL DEFAULT 'medium',
  category TEXT NOT NULL DEFAULT '',
  resolved_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  detected_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  resolved_by TEXT NOT NULL DEFAULT '',
  root_cause TEXT NOT NULL DEFAULT '',
  resolution TEXT NOT NULL DEFAULT '',
  ai_accuracy NUMERIC NOT NULL DEFAULT 0,
  lessons_learned TEXT NOT NULL DEFAULT '',
  tags TEXT[] NOT NULL DEFAULT '{}',
  ttd INT NOT NULL DEFAULT 0,
  ttr INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
ALTER TABLE public.resolved_incidents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Resolved viewable by authenticated" ON public.resolved_incidents FOR SELECT TO authenticated USING (true);

-- ==========================================
-- TRIGGERS
-- ==========================================
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END; $$;

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();
CREATE TRIGGER update_incidents_updated_at BEFORE UPDATE ON public.incidents
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at();

-- Auto-create profile + default role on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER LANGUAGE plpgsql SECURITY DEFINER SET search_path = public AS $$
BEGIN
  INSERT INTO public.profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.email));
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'analyst');
  RETURN NEW;
END; $$;

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
