import { useState, useEffect, useCallback, ReactNode, MouseEventHandler } from 'react';

// --- Utilitary Components and Constants ---

// Simple Button replacement for './ui/button'
const SimpleButton = ({ children, onClick, className = "" }: { children: ReactNode; onClick?: MouseEventHandler<HTMLButtonElement>; className?: string }) => (
  <button
    onClick={onClick}
    className={`rounded-lg shadow-md transition duration-150 ease-in-out cursor-pointer ${className}`}
    type="button"
  >
    {children}
  </button>
);

// Use explicit public paths. These should point to the SVGs in /public/images/vehicles/
const roadUrl = '/images/vehicles/road.svg';
const skyUrl = '/images/vehicles/sky.svg'; // Path to sky.svg (with clouds)
const seaUrl = '/images/vehicles/sea.svg'; // Path to sea.svg (with water and sky)

// Audio paths for vehicles
const carAudio = '/audio/car.mp3';
const planeAudio = '/audio/plane.mp3';
const boatAudio = '/audio/boat.mp3';

// Home Icon (inline SVG replacement for lucide-react/Home)
const HomeIcon = ({ className, stroke = 'currentColor' }: { className?: string; stroke?: string }) => (
  <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
    <polyline points="9 22 9 12 15 12 15 22" />
  </svg>
);

interface Vehicle {
  id: string;
  emoji: string;
  name: string;
  sound: string;
  direction: 'horizontal' | 'vertical';
}

const vehicles: Vehicle[] = [
  { id: 'car', emoji: '🚗', name: 'Auto', sound: '¡Brum brum!', direction: 'horizontal' },
  { id: 'plane', emoji: '✈️', name: 'Avión', sound: '¡Vuuu vuuu!', direction: 'vertical' },
  { id: 'boat', emoji: '🛥️', name: 'Barco', sound: '¡Tuuu tuuu!', direction: 'horizontal' },
];

// --- Web Audio and TTS Functions ---

// Function to play vehicle audio files (limited to 5 seconds)
const playVehicleSound = (vehicleId: string) => {
  let audioPath = '';
  
  switch (vehicleId) {
    case 'car':
      audioPath = carAudio;
      break;
    case 'plane':
      audioPath = planeAudio;
      break;
    case 'boat':
      audioPath = boatAudio;
      break;
  }

  if (audioPath) {
    const audio = new Audio(audioPath);
    audio.play().catch(err => console.log('Audio playback failed:', err));
    
    // Stop audio after 5 seconds
    setTimeout(() => {
      audio.pause();
      audio.currentTime = 0;
    }, 5000);
  }
};


// --- Main Component ---

// Named export VehicleGame (used by App.tsx)
export function VehicleGame({ onBack }: { onBack?: () => void }) {
  const [positions, setPositions] = useState<Record<string, number>>({
    car: 80,
    plane: 0,
    boat: 80,
  });
  
  const [tapCounts, setTapCounts] = useState<Record<string, number>>({ car: 0, plane: 0, boat: 0 });

  // helper to get the initial/reset position for a vehicle
  const initialPositionFor = (vehicleId: string) => {
    if (vehicleId === 'plane') return 0;
    return 80; // car & boat start at 80
  };

  const handleVehicleClick = (vehicle: Vehicle) => {
    // compute step size depending on device width (mobile gets finer steps)
    const isMobile = typeof window !== 'undefined' && window.matchMedia('(max-width: 420px)').matches;
    const step = isMobile ? 20 : 25;

    const currentTap = tapCounts[vehicle.id] || 0;
    const currentPos = positions[vehicle.id];

    // Calculate how many steps are left to reach the end (0 for car/boat, 100 for plane)
    const distanceToEnd = vehicle.direction === 'horizontal' ? currentPos : 100 - currentPos;
    const maxStepsNeeded = Math.max(1, Math.ceil(distanceToEnd / step));

    // Prevent extra taps beyond what's needed to reach the end
    if (currentTap >= maxStepsNeeded) return;

    // play sound for the vehicle
    playVehicleSound(vehicle.id);

    // increment tap count
    setTapCounts(prev => ({ ...prev, [vehicle.id]: (prev[vehicle.id] || 0) + 1 }));

    // update position
    setPositions(prev => {
      const currentPosInner = prev[vehicle.id];
      let newPos = currentPosInner;

      if (vehicle.direction === 'horizontal') {
        // move left, clamp to 0
        newPos = Math.max(0, currentPosInner - step);
      } else {
        // vertical plane moves up, clamp to 100
        newPos = Math.min(100, currentPosInner + step);
      }

      // Check if the end has been reached
      const reachedEnd = (vehicle.direction === 'horizontal' && newPos === 0) || (vehicle.direction === 'vertical' && newPos === 100);
      
      if (reachedEnd) {
        const resetTo = initialPositionFor(vehicle.id);
        // Give the movement animation time to finish (1000ms), then reset position and taps
        setTimeout(() => {
          setPositions(p => ({ ...p, [vehicle.id]: resetTo }));
          setTapCounts(t => ({ ...t, [vehicle.id]: 0 }));
        }, 1000); // Wait 1 second for the animation to complete
      }

      return { ...prev, [vehicle.id]: newPos };
    });
  };

  // onBack prop handler (optional) — used by App.tsx to navigate back to menu
  const handleBack = () => {
    if (typeof onBack === 'function') onBack();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-green-100 flex items-center justify-center p-4">
      <style>{`
  /* VehicleGame background animations */
        .vg-cloud { position: absolute; background: #fff; border-radius: 999px; filter: blur(0.3px); opacity: 0.98; }
        .vg-cloud:before, .vg-cloud:after { content: ''; position: absolute; background: #fff; border-radius: 999px; }
        .vg-cloud:before { width: 60%; height: 70%; left: -20%; top: -20%; }
        .vg-cloud:after { width: 60%; height: 70%; right: -20%; top: -10%; }
        @keyframes vg-cloud-move { from { transform: translateX(-30%); } to { transform: translateX(130%); } }

        .vg-cloud-fast { animation: vg-cloud-move 12s linear infinite; }
        .vg-cloud-med { animation: vg-cloud-move 20s linear infinite; }
        .vg-cloud-slow { animation: vg-cloud-move 32s linear infinite; }

        .vg-waves { position: absolute; left: 0; right: 0; bottom: 0; height: 46%; background-image: linear-gradient( rgba(255,255,255,0.06), rgba(255,255,255,0.02) ), repeating-linear-gradient( -45deg, rgba(255,255,255,0.06) 0 8px, transparent 8px 16px ); opacity: 0.85; mix-blend-mode: overlay; }
        @keyframes vg-waves-move { from { background-position: 0 0; } to { background-position: 200px 0; } }
        .vg-waves-anim { animation: vg-waves-move 6s linear infinite; }

        /* mobile-friendly vehicle hit area and emoji sizing */
        .vg-vehicle-btn { touch-action: manipulation; -webkit-tap-highlight-color: transparent; min-width: 56px; min-height: 56px; display: inline-flex; align-items: center; justify-content: center; padding: 6px; border-radius: 12px; }
        /* responsive emoji sizing using clamp/vw so it scales well on mobile */
        .vg-vehicle-emoji { font-size: clamp(72px, 14vw, 100px); line-height: 1; display: inline-block; }

        /* mobile: make the whole game area use the full viewport height and width */
        .vg-game-wrap { width: 100%; }
        @media (max-width: 420px) {
          .vg-game-wrap { max-width: 100%; padding: 10px; box-sizing: border-box; height: 100vh; }
          .vg-bg-clip { inset: 6px 8px; border-radius: 12px; }
          .vg-vehicle-btn { min-width: 64px; min-height: 64px; }
        }

  /* vehicle transition for movement */
  .vg-vehicle-btn { transition: transform 1000ms ease-out, opacity 320ms ease; }
      `}</style>
    <div className="vg-game-wrap w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl relative" style={{ aspectRatio: '9/16' }}>
        <div className="h-full flex flex-col p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-8 w-full" style={{ gap: '1rem' }}>
            <button
              onClick={handleBack}
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
                <HomeIcon className="w-6 h-6" stroke="#65bd82ff" />
              </div>
            </button>
            <h2 className="text-green-700 text-2xl font-semibold">Vehículos</h2>
          </div>

          {/* Vehicles */}
          <div className="flex-1 flex flex-col justify-around gap-6">
            
            {/* Car (Auto) - Road Scene */}
            <div className="relative h-40 bg-transparent rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src={roadUrl} alt="Carretera" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
              {/* simple roadside tree as scenery */}
              <svg viewBox="0 0 24 24" style={{ position: 'absolute', right: '6%', bottom: '8%', width: '14%', height: 'auto', opacity: 0.95, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
                <rect x="10" y="12" width="4" height="8" rx="1" fill="#6b3e1e" />
                <circle cx="12" cy="8" r="6" fill="#2ecc40" />
              </svg>
              <button
                onPointerDown={() => handleVehicleClick(vehicles[0])}
                className={`vg-vehicle-btn absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out cursor-pointer hover:scale-110 active:scale-95 z-10`}
                style={{ left: `${positions.car}%`, lineHeight: 1 }}
              >
                <span className="vg-vehicle-emoji">{vehicles[0].emoji}</span>
              </button>
              <div className="absolute bottom-12 left-1/2 -translate-x-1/2 text-white bg-green-700/80 backdrop-blur-sm rounded-full px-4 py-1 text-lg font-medium z-10 shadow-lg">
                {vehicles[0].name}
              </div>
            </div>

            {/* Plane (Avión) - Sky Scene */}
            <div className="relative h-40 bg-transparent rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src={skyUrl} alt="Cielo" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
              {/* sun for sky scene */}
              <svg viewBox="0 0 24 24" style={{ position: 'absolute', right: '8%', top: '6%', width: '12%', height: 'auto', opacity: 0.95, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
                <circle cx="12" cy="12" r="6" fill="#ffd24d" />
              </svg>
              {/* clouds overlay (animated) */}
              <div className="pointer-events-none" style={{ zIndex: 1 }}>
                <div className="vg-cloud vg-cloud-fast" style={{ width: 120, height: 36, top: '15%', left: '6%' }} />
                <div className="vg-cloud vg-cloud-med" style={{ width: 96, height: 30, top: '40%', left: '18%' }} />
                <div className="vg-cloud vg-cloud-slow" style={{ width: 140, height: 44, top: '25%', left: '-8%' }} />
              </div>
              <button
                onPointerDown={() => handleVehicleClick(vehicles[1])}
                className={`vg-vehicle-btn absolute left-1/2 -translate-x-1/2 transition-all duration-1000 ease-out cursor-pointer hover:scale-110 active:scale-95 z-10`}
                style={{ bottom: `${positions.plane}%`, lineHeight: 1 }}
              >
                <span className="vg-vehicle-emoji">{vehicles[1].emoji}</span>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-black bg-green-700/80 backdrop-blur-sm rounded-full px-4 py-1 text-lg font-medium z-10 shadow-lg">
                {vehicles[1].name} 
              </div>
            </div>

            {/* Boat (Barco) - Sea Scene */}
            <div className="relative h-40 bg-transparent rounded-3xl overflow-hidden shadow-lg border border-gray-100">
              <img src={seaUrl} alt="Mar" style={{ width: '100%', height: '100%', objectFit: 'cover', position: 'absolute', top: 0, left: 0, zIndex: 0 }} />
              {/* seagull scenery */}
              <svg viewBox="0 0 24 24" style={{ position: 'absolute', left: '8%', top: '8%', width: '12%', height: 'auto', opacity: 0.95, zIndex: 1 }} xmlns="http://www.w3.org/2000/svg">
                <path d="M2 10 C6 6 10 6 14 10" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
                <path d="M10 10 C14 6 18 6 22 10" fill="none" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" opacity="0.9" />
              </svg>
              {/* clouds overlay */}
              <div className="pointer-events-none" style={{ zIndex: 1 }}>
                <div className="vg-cloud vg-cloud-med" style={{ width: 100, height: 34, top: '10%', left: '8%' }} />
                <div className="vg-cloud vg-cloud-slow" style={{ width: 140, height: 44, top: '30%', left: '-6%' }} />
              </div>
              {/* waves overlay (animated) */}
              <div className="vg-waves vg-waves-anim" style={{ zIndex: 1 }} />
              <button
                onPointerDown={() => handleVehicleClick(vehicles[2])}
                className={`vg-vehicle-btn absolute top-1/2 -translate-y-1/2 transition-all duration-1000 ease-out cursor-pointer hover:scale-110 active:scale-95 z-10`}
                style={{ left: `${positions.boat}%`, lineHeight: 1 }}
              >
                <span className="vg-vehicle-emoji">{vehicles[2].emoji}</span>
              </button>
              <div className="absolute bottom-3 left-1/2 -translate-x-1/2 text-white bg-green-700/80 backdrop-blur-sm rounded-full px-4 py-1 text-lg font-medium z-10 shadow-lg">
                {vehicles[2].name}
              </div>
            </div>
          </div>

          {/* Instruction */}
          <div className="mt-6 text-center text-green-700 text-xl font-medium">
            Toca un vehículo para moverlo
          </div>
        </div>
      </div>
    </div>
  );
}
