import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Image as ImageIcon, Type, FileText } from 'lucide-react';
import { cn } from '@/lib/utils';

interface AddNoteFormProps {
  onAddNote: (heading: string, body: string, imageUrl?: string) => Promise<string | null>;
}

export const AddNoteForm = ({ onAddNote }: AddNoteFormProps) => {
  const [heading, setHeading] = useState('');
  const [body, setBody] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!heading.trim() || !body.trim() || isSubmitting) return;
    
    setIsSubmitting(true);
    await onAddNote(heading.trim(), body.trim(), imageUrl.trim() || undefined);
    setHeading('');
    setBody('');
    setImageUrl('');
    setIsExpanded(false);
    setIsSubmitting(false);
  };

  const inputBaseClass = cn(
    'w-full px-4 py-3 rounded-lg',
    'bg-card/90 backdrop-blur-sm',
    'border-2 border-border/50 focus:border-primary/50',
    'text-foreground placeholder:text-muted-foreground',
    'font-note text-base',
    'transition-all duration-200',
    'focus:outline-none focus:ring-2 focus:ring-primary/20'
  );

  return (
    <motion.div
      initial={false}
      animate={{ height: isExpanded ? 'auto' : '64px' }}
      className="w-full max-w-md mx-auto overflow-hidden"
    >
      <div className={cn(
        'rounded-xl p-4',
        'bg-card/80 backdrop-blur-md',
        'border-2 border-border/30',
        'shadow-lg'
      )}>
        {!isExpanded ? (
          <button
            onClick={() => setIsExpanded(true)}
            className={cn(
              'w-full h-8 flex items-center justify-center gap-2',
              'text-muted-foreground hover:text-foreground',
              'font-handwritten text-xl',
              'transition-colors duration-200'
            )}
          >
            <Plus className="w-5 h-5" />
            Add a new note
          </button>
        ) : (
          <motion.form
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            onSubmit={handleSubmit}
            className="space-y-3"
          >
            {/* Heading input */}
            <div className="relative">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="text"
                placeholder="Heading..."
                value={heading}
                onChange={(e) => setHeading(e.target.value)}
                className={cn(inputBaseClass, 'pl-10 font-handwritten text-lg')}
                maxLength={50}
                autoFocus
              />
            </div>

            {/* Body textarea */}
            <div className="relative">
              <FileText className="absolute left-3 top-3 w-4 h-4 text-muted-foreground" />
              <textarea
                placeholder="What's on your mind..."
                value={body}
                onChange={(e) => setBody(e.target.value)}
                className={cn(inputBaseClass, 'pl-10 min-h-[80px] resize-none')}
                maxLength={500}
                rows={3}
              />
            </div>

            {/* Image URL input */}
            <div className="relative">
              <ImageIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <input
                type="url"
                placeholder="Image URL (optional)..."
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className={cn(inputBaseClass, 'pl-10')}
              />
            </div>

            {/* Buttons */}
            <div className="flex gap-2 pt-1">
              <button
                type="button"
                onClick={() => {
                  setIsExpanded(false);
                  setHeading('');
                  setBody('');
                  setImageUrl('');
                }}
                className={cn(
                  'flex-1 py-2.5 rounded-lg',
                  'bg-muted text-muted-foreground',
                  'font-note text-base',
                  'hover:bg-muted/80 transition-colors duration-200'
                )}
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={!heading.trim() || !body.trim() || isSubmitting}
                className={cn(
                  'flex-1 py-2.5 rounded-lg',
                  'bg-primary text-primary-foreground',
                  'font-note text-base font-medium',
                  'hover:bg-primary/90 transition-colors duration-200',
                  'disabled:opacity-50 disabled:cursor-not-allowed',
                  'flex items-center justify-center gap-2'
                )}
              >
                <Plus className="w-4 h-4" />
                {isSubmitting ? 'Pinning...' : 'Pin Note'}
              </button>
            </div>
          </motion.form>
        )}
      </div>
    </motion.div>
  );
};
