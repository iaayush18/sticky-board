import { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Note, NoteColor } from '@/types/note';
import { Pin } from './Pin';

interface NoteCardProps {
  note: Note;
  onDelete: (id: string) => void;
  onPositionChange: (id: string, x: number, y: number) => void;
}

const colorClasses: Record<NoteColor, string> = {
  yellow: 'note-yellow',
  pink: 'note-pink',
  blue: 'note-blue',
  green: 'note-green',
  lavender: 'note-lavender',
  peach: 'note-peach',
  mint: 'note-mint',
};

const pinColors: Array<'red' | 'blue' | 'green' | 'yellow'> = ['red', 'blue', 'green', 'yellow'];

export const NoteCard = ({ note, onDelete, onPositionChange }: NoteCardProps) => {
  const nodeRef = useRef<HTMLDivElement>(null);
  const pinColor = pinColors[Math.abs(note.id.charCodeAt(5)) % pinColors.length];

  const handleDragStop = (_e: DraggableEvent, data: DraggableData) => {
    onPositionChange(note.id, data.x, data.y);
  };

  return (
    <Draggable
      nodeRef={nodeRef}
      defaultPosition={{ x: note.x, y: note.y }}
      onStop={handleDragStop}
      bounds="parent"
      handle=".drag-handle"
    >
      <div ref={nodeRef} className="absolute" style={{ zIndex: 10 }}>
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          className={cn(
            'w-56 min-h-[140px] rounded-sm relative group',
            'note-shadow hover:note-shadow-hover transition-shadow duration-200',
            'transform hover:-rotate-1 hover:scale-[1.02] transition-transform',
            colorClasses[note.color]
          )}
          style={{
            transform: `rotate(${(note.id.charCodeAt(0) % 7) - 3}deg)`,
          }}
        >
          {/* Pin */}
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20 group-hover:animate-pin-bounce">
            <Pin color={pinColor} />
          </div>

          {/* Delete button */}
          <button
            onClick={() => onDelete(note.id)}
            className={cn(
              'absolute -top-2 -right-2 z-20',
              'w-6 h-6 rounded-full bg-destructive text-destructive-foreground',
              'flex items-center justify-center',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-200',
              'hover:scale-110 active:scale-95 transition-transform',
              'shadow-md'
            )}
            aria-label="Delete note"
          >
            <X className="w-3.5 h-3.5" />
          </button>

          {/* Drag handle - entire card */}
          <div className="drag-handle cursor-grab active:cursor-grabbing p-4 pt-5">
            {/* Heading */}
            <h3 className="font-handwritten text-xl font-semibold text-foreground mb-2 leading-tight">
              {note.heading}
            </h3>

            {/* Body */}
            <p className="font-note text-base text-foreground/80 whitespace-pre-wrap break-words leading-relaxed">
              {note.body}
            </p>

            {/* Image */}
            {note.imageUrl && (
              <div className="mt-3 rounded overflow-hidden">
                <img
                  src={note.imageUrl}
                  alt=""
                  className="w-full h-auto max-h-32 object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
          </div>

          {/* Tape effect at bottom corner */}
          <div 
            className="absolute -bottom-1 -right-2 w-8 h-3 bg-white/40 rotate-[-35deg] rounded-sm"
            style={{ boxShadow: '0 1px 2px hsl(30 20% 15% / 0.1)' }}
          />
        </motion.div>
      </div>
    </Draggable>
  );
};
