import { useState, useEffect, useCallback } from 'react';
import { Note, NoteColor } from '@/types/note';
import { supabase } from '@/integrations/supabase/client';

const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'lavender', 'peach', 'mint'];

const getRandomColor = (): NoteColor => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from Supabase on mount
  useEffect(() => {
    const fetchNotes = async () => {
      const { data, error } = await supabase
        .from('notes')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) {
        console.error('Failed to load notes:', error);
      } else if (data) {
        setNotes(data.map(row => ({
          id: row.id,
          heading: row.heading,
          body: row.body,
          imageUrl: row.image_url || undefined,
          x: row.x,
          y: row.y,
          color: row.color as NoteColor,
          createdAt: new Date(row.created_at).getTime(),
        })));
      }
      setIsLoaded(true);
    };

    fetchNotes();

    // Subscribe to realtime changes
    const channel = supabase
      .channel('notes-changes')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'notes' }, (payload) => {
        if (payload.eventType === 'INSERT') {
          const row = payload.new as any;
          setNotes(prev => [...prev, {
            id: row.id,
            heading: row.heading,
            body: row.body,
            imageUrl: row.image_url || undefined,
            x: row.x,
            y: row.y,
            color: row.color as NoteColor,
            createdAt: new Date(row.created_at).getTime(),
          }]);
        } else if (payload.eventType === 'UPDATE') {
          const row = payload.new as any;
          setNotes(prev => prev.map(note => 
            note.id === row.id ? {
              id: row.id,
              heading: row.heading,
              body: row.body,
              imageUrl: row.image_url || undefined,
              x: row.x,
              y: row.y,
              color: row.color as NoteColor,
              createdAt: new Date(row.created_at).getTime(),
            } : note
          ));
        } else if (payload.eventType === 'DELETE') {
          const row = payload.old as any;
          setNotes(prev => prev.filter(note => note.id !== row.id));
        }
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const addNote = useCallback(async (heading: string, body: string, imageUrl?: string) => {
    const color = getRandomColor();
    const x = 50 + Math.random() * 200;
    const y = 50 + Math.random() * 200;

    const { data, error } = await supabase
      .from('notes')
      .insert({
        heading,
        body,
        image_url: imageUrl?.trim() || null,
        x,
        y,
        color,
      })
      .select()
      .single();

    if (error) {
      console.error('Failed to add note:', error);
      return null;
    }

    return data?.id || null;
  }, []);

  const deleteNote = useCallback(async (id: string) => {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('Failed to delete note:', error);
    }
  }, []);

  const updateNotePosition = useCallback(async (id: string, x: number, y: number) => {
    const { error } = await supabase
      .from('notes')
      .update({ x, y })
      .eq('id', id);

    if (error) {
      console.error('Failed to update note position:', error);
    }
  }, []);

  return {
    notes,
    isLoaded,
    addNote,
    deleteNote,
    updateNotePosition,
  };
};
