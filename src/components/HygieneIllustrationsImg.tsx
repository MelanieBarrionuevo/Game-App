import React from 'react';

interface HygieneIllustrationProps {
  step: number;
  className?: string;
}

const stepMap: Record<number, string> = {
  1: 'Paso1.jpg',
  2: 'Paso2.jpg',
  3: 'Paso3.jpg',
  4: 'Paso4.jpg',
  5: 'Paso5.jpg',
  6: 'Paso6.jpg',
  7: 'Paso7.jpg',
  8: 'Paso8.jpg',
  9: 'Paso9.jpg',
  10: 'Paso10.jpg',
  11: 'Paso11.jpg',
  12: 'Paso12.jpg',
};

export function HygieneIllustration({ step, className }: HygieneIllustrationProps) {
  const n = typeof step === 'number' ? Math.min(Math.max(step, 1), 12) : 1;
  const filename = stepMap[n] ?? stepMap[1];
  const src = `/images/${filename}`;

  return <img src={src} alt={`Paso ${n}`} className={className} />;
}

export default HygieneIllustration;
