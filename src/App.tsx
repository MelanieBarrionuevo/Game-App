import { useState } from 'react';
import { HygieneRoutine } from './components/HygieneRoutine';
import { VehicleGame } from './components/VehicleGame';
import { Button } from './components/ui/button';

export default function App() {
  const [currentGame, setCurrentGame] = useState<'menu' | 'hygiene' | 'vehicles'>('menu');

  if (currentGame === 'hygiene') {
    return <HygieneRoutine onBack={() => setCurrentGame('menu')} />;
  }

  if (currentGame === 'vehicles') {
    return <VehicleGame onBack={() => setCurrentGame('menu')} />;
  }

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md mx-auto" style={{ aspectRatio: '9/16' }}>
        <div className="h-full flex flex-col items-center justify-center gap-8 p-6">
          <h1 className="text-center text-blue-700 mb-8">
            Aprende y Juega
          </h1>

          <Button
            onClick={() => setCurrentGame('hygiene')}
            className="w-full h-32 bg-blue-600 hover:bg-blue-700 text-white rounded-3xl shadow-lg"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl">🪥</span>
              <span className="text-2xl">Higiene</span>
            </div>
          </Button>

          <Button
            onClick={() => setCurrentGame('vehicles')}
            className="w-full h-32 bg-green-600 hover:bg-green-700 text-white rounded-3xl shadow-lg"
          >
            <div className="flex flex-col items-center gap-3">
              <span className="text-6xl">🚗</span>
              <span className="text-2xl">Vehículos</span>
            </div>
          </Button>
        </div>
      </div>
    </div>
  );
}
