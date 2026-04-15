
-- Research Projects
CREATE TABLE public.research_projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  status TEXT NOT NULL DEFAULT 'Ongoing',
  tags TEXT[] NOT NULL DEFAULT '{}',
  icon_name TEXT NOT NULL DEFAULT 'FlaskConical',
  image_url TEXT,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.research_projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read research_projects" ON public.research_projects FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert research_projects" ON public.research_projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update research_projects" ON public.research_projects FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete research_projects" ON public.research_projects FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_research_projects_updated_at BEFORE UPDATE ON public.research_projects FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Publications
CREATE TABLE public.publications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  journal TEXT NOT NULL DEFAULT '',
  year INTEGER NOT NULL DEFAULT 2024,
  doi TEXT,
  abstract TEXT NOT NULL DEFAULT '',
  topics TEXT[] NOT NULL DEFAULT '{}',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.publications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read publications" ON public.publications FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert publications" ON public.publications FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update publications" ON public.publications FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete publications" ON public.publications FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_publications_updated_at BEFORE UPDATE ON public.publications FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Collaborations
CREATE TABLE public.collaborations (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  institution TEXT NOT NULL,
  country TEXT NOT NULL DEFAULT '',
  description TEXT NOT NULL DEFAULT '',
  focus TEXT NOT NULL DEFAULT '',
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.collaborations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can read collaborations" ON public.collaborations FOR SELECT USING (true);
CREATE POLICY "Authenticated users can insert collaborations" ON public.collaborations FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Authenticated users can update collaborations" ON public.collaborations FOR UPDATE TO authenticated USING (true);
CREATE POLICY "Authenticated users can delete collaborations" ON public.collaborations FOR DELETE TO authenticated USING (true);

CREATE TRIGGER update_collaborations_updated_at BEFORE UPDATE ON public.collaborations FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
