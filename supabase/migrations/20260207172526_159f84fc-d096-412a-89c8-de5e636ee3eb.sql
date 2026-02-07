-- ====================================
-- VERDADE NA LEI BR - COMPLETE SCHEMA
-- ====================================

-- Enums para tipos
CREATE TYPE public.content_mode AS ENUM ('news_tv', 'document');
CREATE TYPE public.verdict_type AS ENUM ('confirmed', 'misleading', 'false', 'unverifiable');
CREATE TYPE public.source_type AS ENUM ('question', 'document', 'audio');
CREATE TYPE public.audio_status AS ENUM ('pending', 'transcribed', 'analyzed', 'error');

-- ====================================
-- TABELA: documents (PDFs, DOCX, Imagens)
-- ====================================
CREATE TABLE public.documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  mode content_mode NOT NULL DEFAULT 'news_tv',
  file_url TEXT NOT NULL,
  filetype TEXT NOT NULL,
  sha256 TEXT,
  pages_count INTEGER DEFAULT 0,
  provider_primary TEXT,
  provider_fallback_used BOOLEAN DEFAULT false,
  overall_confidence REAL DEFAULT 0,
  quality_flags JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- RLS para documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own documents"
ON public.documents FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own documents"
ON public.documents FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own documents"
ON public.documents FOR DELETE
USING (auth.uid() = user_id);

-- ====================================
-- TABELA: document_pages (texto por página)
-- ====================================
CREATE TABLE public.document_pages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  page_number INTEGER NOT NULL,
  text TEXT,
  confidence REAL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.document_pages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view document pages via documents"
ON public.document_pages FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_pages.document_id 
  AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
));

CREATE POLICY "Users can insert document pages"
ON public.document_pages FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_pages.document_id 
  AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
));

-- ====================================
-- TABELA: document_structures (JSON estruturado OCR)
-- ====================================
CREATE TABLE public.document_structures (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE NOT NULL,
  structured_json JSONB NOT NULL DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.document_structures ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view document structures via documents"
ON public.document_structures FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_structures.document_id 
  AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
));

CREATE POLICY "Users can insert document structures"
ON public.document_structures FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.documents 
  WHERE documents.id = document_structures.document_id 
  AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
));

-- ====================================
-- TABELA: audios (gravações)
-- ====================================
CREATE TABLE public.audios (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT,
  mode content_mode NOT NULL DEFAULT 'news_tv',
  audio_url TEXT NOT NULL,
  sha256 TEXT,
  duration_seconds INTEGER DEFAULT 0,
  status audio_status NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.audios ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own audios"
ON public.audios FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own audios"
ON public.audios FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own audios"
ON public.audios FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own audios"
ON public.audios FOR DELETE
USING (auth.uid() = user_id);

-- ====================================
-- TABELA: transcriptions
-- ====================================
CREATE TABLE public.transcriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE NOT NULL,
  transcript_text TEXT NOT NULL,
  confidence REAL DEFAULT 0,
  provider TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.transcriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view transcriptions via audios"
ON public.transcriptions FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.audios 
  WHERE audios.id = transcriptions.audio_id 
  AND (audios.user_id = auth.uid() OR audios.user_id IS NULL)
));

CREATE POLICY "Users can insert transcriptions"
ON public.transcriptions FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.audios 
  WHERE audios.id = transcriptions.audio_id 
  AND (audios.user_id = auth.uid() OR audios.user_id IS NULL)
));

-- ====================================
-- TABELA: laws (legislação brasileira)
-- ====================================
CREATE TABLE public.laws (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source TEXT DEFAULT 'manual',
  uri TEXT,
  type TEXT NOT NULL,
  number TEXT,
  year INTEGER,
  title TEXT NOT NULL,
  summary TEXT,
  status TEXT DEFAULT 'vigente',
  last_checked_at TIMESTAMP WITH TIME ZONE,
  official_url TEXT,
  text_raw TEXT,
  text_hash TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.laws ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view laws"
ON public.laws FOR SELECT
USING (true);

-- ====================================
-- TABELA: law_articles (artigos das leis)
-- ====================================
CREATE TABLE public.law_articles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  law_id UUID REFERENCES public.laws(id) ON DELETE CASCADE NOT NULL,
  article_label TEXT NOT NULL,
  article_text TEXT NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.law_articles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view law articles"
ON public.law_articles FOR SELECT
USING (true);

-- ====================================
-- TABELA: checks (verificações/checagens)
-- ====================================
CREATE TABLE public.checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  source_type source_type NOT NULL,
  source_id UUID,
  input_text TEXT,
  extracted_claims JSONB DEFAULT '[]',
  verdict verdict_type,
  explanation TEXT,
  sources_used JSONB DEFAULT '[]',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.checks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own checks"
ON public.checks FOR SELECT
USING (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can insert own checks"
ON public.checks FOR INSERT
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can update own checks"
ON public.checks FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own checks"
ON public.checks FOR DELETE
USING (auth.uid() = user_id);

-- ====================================
-- TABELA: share_links (compartilhamento público)
-- ====================================
CREATE TABLE public.share_links (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id UUID REFERENCES public.checks(id) ON DELETE CASCADE NOT NULL,
  public_token TEXT NOT NULL UNIQUE,
  expires_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.share_links ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view share links by token"
ON public.share_links FOR SELECT
USING (true);

CREATE POLICY "Users can create share links for own checks"
ON public.share_links FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.checks 
  WHERE checks.id = share_links.check_id 
  AND (checks.user_id = auth.uid() OR checks.user_id IS NULL)
));

-- ====================================
-- TABELA: custody_logs (cadeia de custódia)
-- ====================================
CREATE TABLE public.custody_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  check_id UUID REFERENCES public.checks(id) ON DELETE CASCADE,
  document_id UUID REFERENCES public.documents(id) ON DELETE CASCADE,
  audio_id UUID REFERENCES public.audios(id) ON DELETE CASCADE,
  event_type TEXT NOT NULL,
  sha256 TEXT,
  meta JSONB DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

ALTER TABLE public.custody_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own custody logs"
ON public.custody_logs FOR SELECT
USING (
  (check_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.checks WHERE checks.id = custody_logs.check_id 
    AND (checks.user_id = auth.uid() OR checks.user_id IS NULL)
  )) OR
  (document_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.documents WHERE documents.id = custody_logs.document_id 
    AND (documents.user_id = auth.uid() OR documents.user_id IS NULL)
  )) OR
  (audio_id IS NOT NULL AND EXISTS (
    SELECT 1 FROM public.audios WHERE audios.id = custody_logs.audio_id 
    AND (audios.user_id = auth.uid() OR audios.user_id IS NULL)
  ))
);

CREATE POLICY "Users can insert custody logs"
ON public.custody_logs FOR INSERT
WITH CHECK (true);

-- ====================================
-- STORAGE BUCKET para arquivos
-- ====================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('uploads', 'uploads', true);

-- Policies para storage
CREATE POLICY "Anyone can view uploads"
ON storage.objects FOR SELECT
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can upload files"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'uploads');

CREATE POLICY "Anyone can update own uploads"
ON storage.objects FOR UPDATE
USING (bucket_id = 'uploads');

CREATE POLICY "Anyone can delete own uploads"
ON storage.objects FOR DELETE
USING (bucket_id = 'uploads');