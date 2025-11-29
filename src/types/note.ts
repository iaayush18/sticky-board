export type NoteColor = 'yellow' | 'pink' | 'blue' | 'green' | 'lavender' | 'peach' | 'mint';

export interface Note {
  id: string;
  heading: string;
  body: string;
  imageUrl?: string;
  x: number;
  y: number;
  color: NoteColor;
  createdAt: number;
}
