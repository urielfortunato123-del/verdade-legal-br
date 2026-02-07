-- Create table for news verification history
CREATE TABLE public.news_verifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  -- News data
  news_title TEXT NOT NULL,
  news_description TEXT,
  news_source TEXT NOT NULL,
  news_link TEXT,
  news_category TEXT,
  
  -- Analysis results
  verdict TEXT NOT NULL CHECK (verdict IN ('confirmed', 'misleading', 'false', 'unverifiable')),
  confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
  explanation TEXT,
  resumo TEXT,
  contexto TEXT,
  pontos_principais JSONB DEFAULT '[]'::jsonb,
  analise_critica TEXT,
  fontes_recomendadas JSONB DEFAULT '[]'::jsonb,
  
  -- User tracking (optional, for anonymous users)
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  session_id TEXT
);

-- Enable RLS
ALTER TABLE public.news_verifications ENABLE ROW LEVEL SECURITY;

-- Allow anyone to insert (for anonymous usage)
CREATE POLICY "Anyone can insert verifications"
ON public.news_verifications
FOR INSERT
WITH CHECK (true);

-- Allow anyone to read all verifications (public history)
CREATE POLICY "Anyone can view verifications"
ON public.news_verifications
FOR SELECT
USING (true);

-- Create index for faster queries
CREATE INDEX idx_news_verifications_created_at ON public.news_verifications(created_at DESC);
CREATE INDEX idx_news_verifications_verdict ON public.news_verifications(verdict);
CREATE INDEX idx_news_verifications_source ON public.news_verifications(news_source);