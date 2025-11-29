import { AnimatePresence } from 'framer-motion';
import { useNotes } from '@/hooks/useNotes';
import { NoteCard } from './NoteCard';
import { AddNoteForm } from './AddNoteForm';
import { cn } from '@/lib/utils';

export const Board = () => {
  const { notes, isLoaded, addNote, deleteNote, updateNotePosition } = useNotes();

  if (!isLoaded) {
    return (
      <div className="min-h-screen cork-board flex items-center justify-center">
        <div className="font-handwritten text-2xl text-foreground/60">Loading your board...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen cork-board flex flex-col">
      {/* Header with form */}
      <header className={cn(
        'sticky top-0 z-50 py-4 px-4',
        'bg-gradient-to-b from-cork-dark/90 via-cork-dark/70 to-transparent',
        'backdrop-blur-sm'
      )}>
        <div className="max-w-4xl mx-auto">
          <h1 className="font-handwritten text-4xl md:text-5xl text-center text-foreground mb-4 drop-shadow-sm">
            📌 My Bulletin Board
          </h1>
          <AddNoteForm onAddNote={addNote} />
        </div>
      </header>

      {/* Board area */}
      <main className="flex-1 relative min-h-[600px] p-4">
        {notes.length === 0 ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center px-4">
              <p className="font-handwritten text-2xl text-foreground/50 mb-2">
                Your board is empty
              </p>
              <p className="font-note text-lg text-foreground/40">
                Add your first note to get started!
              </p>
            </div>
          </div>
        ) : (
          <AnimatePresence>
            {notes.map((note) => (
              <NoteCard
                key={note.id}
                note={note}
                onDelete={deleteNote}
                onPositionChange={updateNotePosition}
              />
            ))}
          </AnimatePresence>
        )}
      </main>

      {/* Footer */}
      <footer className="py-3 text-center">
        <p className="font-note text-sm text-foreground/40">
          Drag notes anywhere • {notes.length} note{notes.length !== 1 ? 's' : ''} pinned
        </p>
      </footer>
    </div>
  );
};
