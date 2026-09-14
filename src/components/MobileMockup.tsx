import React, { useState } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Smartphone, 
  Sparkles, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Tv
} from 'lucide-react';
import { InvitationView } from './InvitationView';
import { useStore } from '../lib/store';

interface MobileMockupProps {
  onOpenTvMode?: () => void;
}

export const MobileMockup: React.FC<MobileMockupProps> = ({ onOpenTvMode }) => {
  const { currentProject, currentEventSettings, templates, plans, setSelectedProjectId, projects } = useStore();
  const [fullscreen, setFullscreen] = useState(false);
  const [guestToken, setGuestToken] = useState('fam-gomez-pereyra');

  const currentTemplate = templates.find(t => t.id === currentProject.templateId) || templates[0];
  const currentPlan = plans.find(p => p.id === currentProject.planId) || plans[0];

  return (
    <div className="py-6 px-4 max-w-7xl mx-auto flex flex-col items-center">
      {/* Top Header / Context */}
      <div className="text-center max-w-xl mx-auto mb-6 space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-xs font-semibold">
          <Smartphone className="w-3.5 h-3.5" />
          Simulador Móvil Interactivo
        </div>
        <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
          Experiencia en Celular Real
        </h2>
        <p className="text-neutral-400 text-xs sm:text-sm font-montserrat">
          Comprueba exactamente cómo tus invitados verán la invitación en su teléfono: sobre de apertura, música, confirmación, mapa y fotos.
        </p>

        {/* Badges */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium capitalize">
            Tipo: {currentProject.eventType}
          </span>
          <span className="px-2.5 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300 text-xs font-bold uppercase tracking-wider">
            {currentPlan.name} (${currentPlan.price.toLocaleString('es-AR')} ARS)
          </span>
          <span className="px-2.5 py-1 rounded-md bg-neutral-800 border border-neutral-700 text-neutral-300 text-xs font-medium">
            Modelo: {currentTemplate.name}
          </span>
        </div>
      </div>

      {/* Mockup Frame vs Fullscreen container */}
      <div className={`w-full flex justify-center transition-all ${fullscreen ? 'fixed inset-0 z-50 bg-black/90 p-2 sm:p-6 overflow-y-auto' : ''}`}>
        
        {/* The Realistic Smartphone Container */}
        <div className="relative w-full max-w-[390px] aspect-[9/19] max-h-[820px] bg-neutral-900 rounded-[48px] p-3.5 shadow-2xl border-[6px] border-neutral-800 ring-1 ring-white/10 flex flex-col">
          
          {/* Top Notch / Dynamic Island */}
          <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full z-30 flex items-center justify-center">
            <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2" />
            <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
          </div>

          {/* Screen Display Area with Inner Radius */}
          <div 
            id="mobile-viewport-scroll"
            className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden relative bg-[#fdfbf7] shadow-inner"
            style={{ overscrollBehavior: 'contain' }}
          >
            <InvitationView 
              guestToken={guestToken}
              isMockupFrame={true} 
              onOpenTvMode={onOpenTvMode}
            />
          </div>

          {/* Bottom Home Indicator Bar */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-500/40 rounded-full pointer-events-none" />
        </div>
      </div>

      {/* Control Tools underneath Mockup */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3 text-xs font-montserrat">
        <button
          onClick={() => setFullscreen(!fullscreen)}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-colors"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
          {fullscreen ? 'Salir de Pantalla Completa' : 'Ver en Pantalla Completa'}
        </button>

        {onOpenTvMode && (
          <button
            onClick={onOpenTvMode}
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60 flex items-center gap-2 transition-colors"
          >
            <Tv className="w-4 h-4 text-purple-400" />
            Abrir Modo TV para la Fiesta
          </button>
        )}

        <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
          <span className="text-neutral-400">Probar como:</span>
          <select
            value={guestToken}
            onChange={(e) => setGuestToken(e.target.value)}
            className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer"
          >
            <option value="fam-gomez-pereyra" className="bg-neutral-900 text-white">Familia Gómez Pereyra (Tíos)</option>
            <option value="padrinos-marta-roberto" className="bg-neutral-900 text-white">Marta & Roberto (Padrinos)</option>
            <option value="fam-benitez" className="bg-neutral-900 text-white">Familia Benítez (Colegio)</option>
            <option value="amigo-lucas" className="bg-neutral-900 text-white">Lucas Martínez (Amigo)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
