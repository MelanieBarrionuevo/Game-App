import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import HygieneIllustrations from './HygieneIllustrationsImg';

// Audio paths for hygiene routine
const grabAudio = '/audio/grab.mp3';
const pasteAudio = '/audio/paste.mp3';
const brushAudio = '/audio/brush.mp3';
const waterAudio = '/audio/water.mp3';
const soapAudio = '/audio/soap.mp3';
const rubAudio = '/audio/rub.mp3';
const dryAudio = '/audio/dry.mp3';
const successAudio = '/audio/success.mp3';

// Home Icon Component
const HomeIcon = ({ className, stroke = 'currentColor' }: { className?: string; stroke?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="none"
    stroke={stroke}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

interface Step {
  id: number;
  emoji: string;
  text: string;
  audio: string;
  soundType: 'grab' | 'paste' | 'brush' | 'rinse' | 'drink' | 'success' | 'water' | 'soap' | 'rub' | 'dry' | 'celebrate';
}

const steps: Step[] = [
  { 
    id: 1, 
    emoji: '🪥', 
    text: 'Coger el cepillo', 
    audio: '¡Cogemos el cepillo!',
    soundType: 'grab'
  },
  { 
    id: 2, 
    emoji: '🦷', 
    text: 'Poner pasta', 
    audio: '¡Ponemos pasta!',
    soundType: 'paste'
  },
  { 
    id: 3, 
    emoji: '😁', 
    text: 'Cepillar dientes', 
    audio: '¡Cepillamos los dientes!',
    soundType: 'brush'
  },
  { 
    id: 4, 
    emoji: '💧', 
    text: 'Enjuagar boca', 
    audio: '¡Enjuagamos la boca!',
    soundType: 'rinse'
  },
  { 
    id: 5, 
    emoji: '🥤', 
    text: 'Beber agua', 
    audio: '¡Bebemos agua!',
    soundType: 'drink'
  },
  { 
    id: 6, 
    emoji: '✨', 
    text: 'Dientes limpios', 
    audio: '¡Dientes limpios! ¡Muy bien!',
    soundType: 'success'
  },
  { 
    id: 7, 
    emoji: '👐', 
    text: 'Abrir grifo', 
    audio: '¡Abrimos el grifo!',
    soundType: 'water'
  },
  { 
    id: 8, 
    emoji: '🧼', 
    text: 'Coger jabón', 
    audio: '¡Cogemos jabón!',
    soundType: 'soap'
  },
  { 
    id: 9, 
    emoji: '🫧', 
    text: 'Frotar manos', 
    audio: '¡Frotamos las manos!',
    soundType: 'rub'
  },
  { 
    id: 10, 
    emoji: '💦', 
    text: 'Enjuagar manos', 
    audio: '¡Enjuagamos las manos!',
    soundType: 'rinse'
  },
  { 
    id: 11, 
    emoji: '🧻', 
    text: 'Secar manos', 
    audio: '¡Secamos las manos!',
    soundType: 'dry'
  },
  { 
    id: 12, 
    emoji: '👏', 
    text: 'Manos limpias', 
    audio: '¡Manos limpias! ¡Muy bien!',
    soundType: 'celebrate'
  },
];

interface HygieneRoutineProps {
  onBack: () => void;
}

export function HygieneRoutine({ onBack }: HygieneRoutineProps) {
  const [currentStep, setCurrentStep] = useState(0);

  // Play sound files based on action type (limited to 5 seconds, water to 3 seconds)
  const playSound = (soundType: Step['soundType']) => {
    let audioPath = '';
    let duration = 5000; // Default 5 seconds
    
    switch (soundType) {
      case 'grab':
        audioPath = grabAudio;
        break;
      case 'paste':
        audioPath = pasteAudio;
        break;
      case 'brush':
        audioPath = brushAudio;
        break;
      case 'rinse':
      case 'water':
        audioPath = waterAudio;
        duration = 3000; // Water sounds are 3 seconds
        break;
      case 'drink':
        audioPath = waterAudio; // Use water sound for drinking
        duration = 3000; // Water sounds are 3 seconds
        break;
      case 'soap':
        audioPath = soapAudio;
        break;
      case 'rub':
        audioPath = rubAudio;
        break;
      case 'dry':
        audioPath = dryAudio;
        break;
      case 'success':
      case 'celebrate':
        audioPath = successAudio;
        break;
    }

    if (audioPath) {
      const audio = new Audio(audioPath);
      audio.play().catch(err => console.log('Audio playback failed:', err));
      
      // Stop audio after specified duration
      setTimeout(() => {
        audio.pause();
        audio.currentTime = 0;
      }, duration);
    }
  };

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      const nextStep = currentStep + 1;
      setCurrentStep(nextStep);
      playSound(steps[nextStep].soundType);
    } else {
      // Restart from beginning
      setCurrentStep(0);
      playSound(steps[0].soundType);
    }
  };

  useEffect(() => {
    // Play sound for first step on mount
    playSound(steps[0].soundType);
  }, []);

  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto" style={{ aspectRatio: '9/16' }}>
        <div className="h-full flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={onBack}
              style={{
                width: '56px',
                height: '56px',
                backgroundColor: '#ffffff',
                border: 'none',
                borderRadius: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'background-color 0.15s',
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f9fafb'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#ffffff'}
            >
              <div style={{ width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ffffff' }}>
                <HomeIcon className="w-6 h-6" stroke="#3b82f6" />
              </div>
            </button>
            <div className="text-blue-700 text-xl">
              {currentStep + 1} / {steps.length}
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full h-4 bg-white rounded-full mb-8 overflow-hidden shadow-inner">
            <div
              className="h-full bg-blue-600 transition-all duration-500 ease-out"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Main interactive area */}
          <button
            onClick={handleNext}
            className="flex-1 flex flex-col items-center justify-center gap-8 bg-white rounded-3xl shadow-xl border-4 border-blue-300 hover:border-blue-500 transition-colors duration-300 cursor-pointer active:scale-95 overflow-hidden p-6"
            style={{ minHeight: '400px' }}
          >
            {/* Illustration */}
            <div className="w-full max-w-xs">
              <HygieneIllustrations step={step.id} className="w-full h-auto" />
            </div>

            {/* Text */}
            <div className="text-3xl text-blue-800 px-8 text-center">
              {step.text}
            </div>
          </button>

          {/* Instruction */}
          <div className="mt-6 text-center text-blue-700 text-xl">
            Toca la pantalla para continuar
          </div>
        </div>
      </div>
    </div>
  );
}
