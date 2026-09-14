import React, { useState, useEffect } from 'react';
import { 
  Tv, 
  X, 
  QrCode, 
  Sparkles, 
  Heart, 
  Camera, 
  ChevronLeft, 
  ChevronRight,
  Maximize2
} from 'lucide-react';
import { useStore } from '../lib/store';

interface TvModeViewProps {
  onClose: () => void;
}

export const TvModeView: React.FC<TvModeViewProps> = ({ onClose }) => {
  const { currentEventSettings, photos, blessings, displaySettings } = useStore();
  const [currentPhotoIdx, setCurrentPhotoIdx] = useState(0);
  const [currentBlessingIdx, setCurrentBlessingIdx] = useState(0);

  const approvedBlessings = blessings.filter(b => b.status === 'approved');
  const allPhotos = [
    ...currentEventSettings.carouselPhotos,
    ...photos.filter(p => p.status === 'approved').map(p => p.photoUrl)
  ];

  // Auto rotation timer based on displaySettings.rotationSeconds
  useEffect(() => {
    if (allPhotos.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentPhotoIdx(prev => (prev + 1) % allPhotos.length);
    }, (displaySettings.rotationSeconds || 6) * 1000);

    return () => clearInterval(interval);
  }, [allPhotos.length, displaySettings.rotationSeconds]);

  // Blessings rotation timer
  useEffect(() => {
    if (approvedBlessings.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentBlessingIdx(prev => (prev + 1) % approvedBlessings.length);
    }, 8000);

    return () => clearInterval(interval);
  }, [approvedBlessings.length]);

  // Handle ESC key to exit
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  return (
    <div className="fixed inset-0 z-50 bg-[#0a0a0c] text-white flex flex-col justify-between p-6 sm:p-10 select-none overflow-hidden font-montserrat">
      
      {/* Background ambient lighting */}
      <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-amber-600/10 blur-[140px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-purple-600/10 blur-[140px] rounded-full pointer-events-none" />

      {/* Top Header Bar */}
      <header className="relative z-10 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-300 shadow-lg">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-cinzel font-bold tracking-wider text-amber-200">
              {currentEventSettings.title}
            </h1>
            <p className="text-xs text-neutral-400 font-cinzel tracking-widest uppercase">
              {currentEventSettings.honoreeName}
            </p>
          </div>
        </div>

        {/* Discreet Close / Exit Fullscreen Button */}
        <button
          onClick={onClose}
          className="p-2.5 rounded-full bg-neutral-900/80 hover:bg-neutral-800 text-neutral-400 hover:text-white border border-neutral-700 transition-colors"
          title="Salir de Modo TV (Esc)"
        >
          <X className="w-5 h-5" />
        </button>
      </header>

      {/* Center 3D Stage / Coverflow Carousel */}
      <main className="relative z-10 flex-1 flex items-center justify-center py-6">
        <div className="relative w-full max-w-4xl h-[420px] sm:h-[520px] flex items-center justify-center perspective-[1200px]">
          
          {allPhotos.map((photo, idx) => {
            const offset = (idx - currentPhotoIdx + allPhotos.length) % allPhotos.length;
            const isCenter = offset === 0;
            const isNext = offset === 1;
            const isPrev = offset === allPhotos.length - 1;

            if (!isCenter && !isNext && !isPrev) return null;

            let transformClass = 'scale-90 opacity-40 blur-[1px] translate-x-0';
            let zIndex = 10;

            if (isCenter) {
              transformClass = 'scale-100 opacity-100 shadow-2xl shadow-amber-950/50 z-30 translate-x-0';
              zIndex = 30;
            } else if (isNext) {
              transformClass = 'scale-80 opacity-50 translate-x-[60%] sm:translate-x-[75%] rotate-y-[-25deg]';
              zIndex = 20;
            } else if (isPrev) {
              transformClass = 'scale-80 opacity-50 -translate-x-[60%] sm:-translate-x-[75%] rotate-y-[25deg]';
              zIndex = 20;
            }

            return (
              <div
                key={idx}
                style={{ zIndex }}
                className={`absolute w-[80%] max-w-[480px] h-full rounded-3xl overflow-hidden border-2 border-amber-400/30 transition-all duration-700 ease-out flex flex-col justify-end bg-neutral-900 ${transformClass}`}
              >
                <img
                  src={photo}
                  alt=""
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
                <div className="p-4 relative z-10 flex items-center justify-between text-xs text-neutral-300">
                  <span className="font-cinzel text-amber-200">Recuerdos en Vivo</span>
                  <span className="font-mono text-[10px] bg-black/60 px-2 py-0.5 rounded-full border border-white/10">
                    {currentPhotoIdx + 1} / {allPhotos.length}
                  </span>
                </div>
              </div>
            );
          })}

          {/* Navigation arrow buttons for touch / click */}
          <button
            onClick={() => setCurrentPhotoIdx((currentPhotoIdx - 1 + allPhotos.length) % allPhotos.length)}
            className="absolute left-2 sm:left-6 z-40 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={() => setCurrentPhotoIdx((currentPhotoIdx + 1) % allPhotos.length)}
            className="absolute right-2 sm:right-6 z-40 p-3 rounded-full bg-black/50 hover:bg-black/80 text-white backdrop-blur-md border border-white/10 transition-colors"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>
      </main>

      {/* Bottom Information Bar: Live Blessing + QR Code for Guests */}
      <footer className="relative z-10 flex flex-col sm:flex-row items-center justify-between gap-6 bg-neutral-900/80 backdrop-blur-md p-4 sm:p-6 rounded-3xl border border-neutral-800">
        
        {/* Left: Rotating Guest Blessing */}
        <div className="flex-1 space-y-1 max-w-xl text-center sm:text-left">
          <div className="flex items-center justify-center sm:justify-start gap-1.5 text-xs text-amber-400 font-bold uppercase tracking-wider">
            <Heart className="w-3.5 h-3.5 fill-amber-400" />
            <span>Libro de Deseos en Directo</span>
          </div>

          {approvedBlessings.length > 0 ? (
            <div className="transition-all duration-500">
              <p className="text-sm sm:text-base font-serif-luxury italic text-neutral-200">
                "{approvedBlessings[currentBlessingIdx]?.message}"
              </p>
              <p className="text-xs text-amber-300 font-semibold mt-0.5">
                — {approvedBlessings[currentBlessingIdx]?.author}
              </p>
            </div>
          ) : (
            <p className="text-xs text-neutral-400">
              ¡Sé el primero en dejar un deseo escaneando el código QR!
            </p>
          )}
        </div>

        {/* Right: Salon Guest QR Code Scanner */}
        <div className="flex items-center gap-4 bg-neutral-950 px-4 py-3 rounded-2xl border border-neutral-800 flex-shrink-0">
          <div className="w-16 h-16 bg-white p-1 rounded-xl flex items-center justify-center shadow-lg">
            <img
              src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://invitarte.app/demo"
              alt="QR Code"
              className="w-full h-full object-contain"
            />
          </div>
          <div className="text-left space-y-0.5">
            <div className="text-xs font-bold text-white uppercase tracking-wide">
              ¡Sube tus fotos de la fiesta!
            </div>
            <div className="text-[11px] text-neutral-400 max-w-[160px] leading-tight">
              Apunta la cámara de tu celular para compartir fotos y mensajes en vivo.
            </div>
          </div>
        </div>

      </footer>
    </div>
  );
};
