-- Create notes table for bulletin board
CREATE TABLE public.notes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  heading TEXT NOT NULL,
  body TEXT NOT NULL DEFAULT '',
  image_url TEXT,
  x DOUBLE PRECISION NOT NULL DEFAULT 50,
  y DOUBLE PRECISION NOT NULL DEFAULT 50,
  color TEXT NOT NULL DEFAULT 'yellow',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.notes ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read notes (no auth)
CREATE POLICY "Anyone can view notes" 
ON public.notes FOR SELECT 
USING (true);

-- Allow anyone to insert notes (no auth)
CREATE POLICY "Anyone can create notes" 
ON public.notes FOR INSERT 
WITH CHECK (true);

-- Allow anyone to update notes (no auth)
CREATE POLICY "Anyone can update notes" 
ON public.notes FOR UPDATE 
USING (true);

-- Allow anyone to delete notes (no auth)
CREATE POLICY "Anyone can delete notes" 
ON public.notes FOR DELETE 
USING (true);

-- Enable realtime for notes
ALTER PUBLICATION supabase_realtime ADD TABLE public.notes;