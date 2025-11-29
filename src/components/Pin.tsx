import { cn } from '@/lib/utils';

type PinColor = 'red' | 'blue' | 'green' | 'yellow';

interface PinProps {
  color?: PinColor;
  className?: string;
}

const pinColors: Record<PinColor, string> = {
  red: 'bg-pin-red',
  blue: 'bg-pin-blue',
  green: 'bg-pin-green',
  yellow: 'bg-pin-yellow',
};

export const Pin = ({ color = 'red', className }: PinProps) => {
  return (
    <div className={cn('pin-shadow', className)}>
      {/* Pin head */}
      <div
        className={cn(
          'w-4 h-4 rounded-full relative',
          pinColors[color]
        )}
        style={{
          background: `radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.4), transparent 50%)`,
          backgroundColor: undefined,
        }}
      >
        <div className={cn('absolute inset-0 rounded-full', pinColors[color])} style={{ zIndex: -1 }} />
        <div 
          className="absolute inset-0 rounded-full"
          style={{
            background: `radial-gradient(circle at 30% 30%, hsl(0 0% 100% / 0.4), transparent 50%)`,
          }}
        />
      </div>
      {/* Pin needle */}
      <div 
        className="w-0.5 h-2 bg-gradient-to-b from-gray-400 to-gray-600 mx-auto -mt-0.5 rounded-b-full"
      />
    </div>
  );
};
