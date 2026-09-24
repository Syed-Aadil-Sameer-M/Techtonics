import { type ReactNode, useRef, useState } from 'react';
import { cn } from '@/lib/utils';

interface TiltCardProps {
  children: ReactNode;
  className?: string;
  maxTilt?: number;
}

export function TiltCard({ children, className, maxTilt = 6 }: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [transform, setTransform] = useState('');
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  const handleMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rx = ((y - cy) / cy) * -maxTilt;
    const ry = ((x - cx) / cx) * maxTilt;
    setTransform(`perspective(800px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`);
    setGlowPos({ x: (x / rect.width) * 100, y: (y / rect.height) * 100 });
  };

  const handleLeave = () => {
    setTransform('perspective(800px) rotateX(0) rotateY(0) scale(1)');
    setGlowPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={ref}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        transform,
        transition: 'transform 0.15s ease-out',
        background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(56,189,248,0.06) 0%, transparent 50%)`,
      }}
      className={cn('relative', className)}
    >
      {children}
    </div>
  );
}
