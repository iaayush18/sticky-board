import { useState, useEffect, useCallback } from 'react';
import { Note, NoteColor } from '@/types/note';

const STORAGE_KEY = 'bulletin-board-notes';

const NOTE_COLORS: NoteColor[] = ['yellow', 'pink', 'blue', 'green', 'lavender', 'peach', 'mint'];

const getRandomColor = (): NoteColor => {
  return NOTE_COLORS[Math.floor(Math.random() * NOTE_COLORS.length)];
};

const generateId = (): string => {
  return `note-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

export const useNotes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load notes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setNotes(parsed);
      }
    } catch (error) {
      console.error('Failed to load notes from localStorage:', error);
    }
    setIsLoaded(true);
  }, []);

  // Save notes to localStorage whenever they change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes to localStorage:', error);
      }
    }
  }, [notes, isLoaded]);

  const addNote = useCallback((heading: string, body: string, imageUrl?: string) => {
    const newNote: Note = {
      id: generateId(),
      heading,
      body,
      imageUrl: imageUrl?.trim() || undefined,
      x: 50 + Math.random() * 200,
      y: 50 + Math.random() * 200,
      color: getRandomColor(),
      createdAt: Date.now(),
    };
    setNotes((prev) => [...prev, newNote]);
    return newNote.id;
  }, []);

  const deleteNote = useCallback((id: string) => {
    setNotes((prev) => prev.filter((note) => note.id !== id));
  }, []);

  const updateNotePosition = useCallback((id: string, x: number, y: number) => {
    setNotes((prev) =>
      prev.map((note) =>
        note.id === id ? { ...note, x, y } : note
      )
    );
  }, []);

  return {
    notes,
    isLoaded,
    addNote,
    deleteNote,
    updateNotePosition,
  };
};
