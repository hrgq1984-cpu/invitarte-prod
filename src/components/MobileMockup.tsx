import React, { useState, useEffect } from 'react';
import { 
  Maximize2, 
  RotateCcw, 
  Smartphone, 
  Sparkles, 
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Tv,
  X,
  ShoppingBag,
  Filter,
  Info,
  Check,
  ChevronDown,
  Layers
} from 'lucide-react';
import { InvitationView } from './InvitationView';
import { useStore } from '../lib/store';
import { DesignTemplate, EventType, PlanTier } from '../types';

interface MobileMockupProps {
  initialTemplateId?: string;
  onOpenTvMode?: () => void;
  onBackToCatalog?: () => void;
  onSelectTemplateForOrder?: (template: DesignTemplate, planId: PlanTier) => void;
  onTemplateChange?: (templateId: string) => void;
}

const CATEGORY_TABS: { id: 'todos' | EventType; label: string }[] = [
  { id: 'todos', label: 'Todos (21)' },
  { id: 'boda', label: 'Bodas' },
  { id: '15anos', label: '15 Años' },
  { id: 'cumpleanos', label: 'Cumpleaños' },
  { id: 'bautismo', label: 'Bautismos' },
  { id: 'comunion', label: 'Comuniones' },
  { id: 'confirmacion', label: 'Confirmaciones' },
  { id: 'otros', label: 'Otros' }
];

export const MobileMockup: React.FC<MobileMockupProps> = ({ 
  initialTemplateId,
  onOpenTvMode, 
  onBackToCatalog,
  onSelectTemplateForOrder,
  onTemplateChange
}) => {
  const { currentProject, templates, plans, previewTemplate } = useStore();
  const [fullscreen, setFullscreen] = useState(false);
  const [showPlanDetails, setShowPlanDetails] = useState(false);
  const [guestToken, setGuestToken] = useState('fam-gomez-pereyra');
  const [selectedCategory, setSelectedCategory] = useState<'todos' | EventType>('todos');

  // Dynamic selected template state
  const [selectedTemplateId, setSelectedTemplateId] = useState<string>(
    initialTemplateId || currentProject.templateId || templates[0].id
  );

  // Synchronize when initialTemplateId prop changes from outside (e.g. catalog click)
  useEffect(() => {
    if (initialTemplateId) {
      setSelectedTemplateId(initialTemplateId);
      const tmpl = templates.find(t => t.id === initialTemplateId);
      if (tmpl) {
        previewTemplate(tmpl);
        setSelectedCategory(tmpl.eventType);
      }
    }
  }, [initialTemplateId]);

  // Current template and plan resolved dynamically from selectedTemplateId
  const currentTemplate = templates.find(t => t.id === selectedTemplateId) || templates[0];
  const currentPlan = plans.find(p => p.id === currentTemplate.requiredPlan) || plans[0];

  // Handle ESC key to exit fullscreen
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && fullscreen) {
        setFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [fullscreen]);

  // Filter templates
  const filteredTemplates = selectedCategory === 'todos' 
    ? templates 
    : templates.filter(t => t.eventType === selectedCategory);

  const handleSelectTemplate = (tmpl: DesignTemplate) => {
    setSelectedTemplateId(tmpl.id);
    previewTemplate(tmpl);
    if (onTemplateChange) {
      onTemplateChange(tmpl.id);
    }
    const phoneViewport = document.getElementById('mobile-viewport-scroll');
    if (phoneViewport) {
      phoneViewport.scrollTop = 0;
    }
  };

  const handlePrevTemplate = () => {
    const list = filteredTemplates.length > 0 ? filteredTemplates : templates;
    const idx = list.findIndex(t => t.id === currentTemplate.id);
    const nextIdx = (idx - 1 + list.length) % list.length;
    handleSelectTemplate(list[nextIdx]);
  };

  const handleNextTemplate = () => {
    const list = filteredTemplates.length > 0 ? filteredTemplates : templates;
    const idx = list.findIndex(t => t.id === currentTemplate.id);
    const nextIdx = (idx + 1) % list.length;
    handleSelectTemplate(list[nextIdx]);
  };

  return (
    <div className="py-4 sm:py-6 px-3 sm:px-6 max-w-7xl mx-auto flex flex-col items-center">
      
      {/* 1. TOP PROMINENT NAVIGATION & CONTROLS WITH PLAN CLARIFICATION */}
      <div className="w-full max-w-5xl mb-4 bg-neutral-900/95 backdrop-blur-md p-3.5 sm:p-4 rounded-2xl border border-neutral-800 shadow-xl flex flex-col gap-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* Back Button */}
          {onBackToCatalog && (
            <button
              id="btn-back-to-catalog"
              onClick={onBackToCatalog}
              className="px-4 py-2.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-2 text-xs font-bold transition-all shadow-sm active:scale-95"
              title="Volver a la lista de modelos y planes"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Volver al Catálogo</span>
            </button>
          )}

          {/* Current Model Status Pill & Plan Clarification */}
          <div className="flex items-center flex-wrap gap-2 text-xs">
            <div className="hidden sm:flex items-center gap-1.5 text-neutral-400">
              <span>Modelo:</span>
              <span className="text-white font-bold">{currentTemplate.name}</span>
              <span className="text-neutral-500">({currentTemplate.sampleHonoree})</span>
            </div>

            <div className="flex items-center gap-1.5">
              <span className={`px-3 py-1 rounded-lg border font-bold uppercase tracking-wider text-[11px] shadow-sm flex items-center gap-1.5 ${
                currentPlan.id === 'oro'
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300'
                  : currentPlan.id === 'plata'
                  ? 'bg-blue-500/20 border-blue-500/50 text-blue-300'
                  : 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
              }`}>
                <Layers className="w-3.5 h-3.5" />
                <span>Incluido en {currentPlan.name}</span>
                <span className="text-white/80 font-mono">(${currentPlan.price.toLocaleString('es-AR')} ARS)</span>
              </span>

              <button
                onClick={() => setShowPlanDetails(!showPlanDetails)}
                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-[11px] font-medium border border-neutral-700 flex items-center gap-1 transition-colors"
                title="Ver qué incluye este plan"
              >
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>¿Qué incluye?</span>
                <ChevronDown className={`w-3 h-3 transition-transform ${showPlanDetails ? 'rotate-180' : ''}`} />
              </button>
            </div>
          </div>

          {/* CTA: Order this template */}
          {onSelectTemplateForOrder && (
            <button
              id="btn-order-this-template"
              onClick={() => onSelectTemplateForOrder(currentTemplate, currentTemplate.requiredPlan)}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-950/40 transition-all active:scale-95 ml-auto sm:ml-0"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>Contratar este Modelo</span>
            </button>
          )}
        </div>

        {/* Plan Clarification Banner: Highlights what this plan includes in the demo */}
        <div className={`p-3 rounded-xl border transition-all text-xs ${
          currentPlan.id === 'oro'
            ? 'bg-amber-950/30 border-amber-500/30 text-amber-200'
            : currentPlan.id === 'plata'
            ? 'bg-blue-950/30 border-blue-500/30 text-blue-200'
            : 'bg-emerald-950/30 border-emerald-500/30 text-emerald-200'
        }`}>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span className="font-semibold text-white">
                Esta demostración corresponde al <strong className="text-amber-300">{currentPlan.name}</strong>:
              </span>
              <span className="hidden md:inline text-neutral-300">
                {currentPlan.description}
              </span>
            </div>
            <div className="flex items-center gap-3 text-[11px]">
              {currentPlan.hasEnvelopeAnimation && (
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Check className="w-3.5 h-3.5" /> Sobre Animado & Lacre
                </span>
              )}
              {currentPlan.hasTvMode && (
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Check className="w-3.5 h-3.5" /> Modo TV para Fiesta
                </span>
              )}
              {currentPlan.hasGuestbook && (
                <span className="flex items-center gap-1 text-amber-300 font-medium">
                  <Check className="w-3.5 h-3.5" /> Libro de Deseos
                </span>
              )}
              <span className="flex items-center gap-1 text-amber-300 font-medium">
                <Check className="w-3.5 h-3.5" /> Hasta {currentPlan.maxGuests} invitados
              </span>
            </div>
          </div>

          {/* Expanded Features List */}
          {showPlanDetails && (
            <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-[11px] text-neutral-200 animate-in fade-in">
              {currentPlan.features.map((feat, idx) => (
                <div key={idx} className="flex items-start gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* 2. CATEGORY SELECTOR & QUICK TEMPLATE SWITCHER */}
      <div className="w-full max-w-5xl mb-6 bg-neutral-950/80 p-3 sm:p-4 rounded-2xl border border-neutral-800/80 space-y-3">
        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-thin">
          <span className="text-neutral-400 text-xs font-semibold flex items-center gap-1 pr-2 flex-shrink-0">
            <Filter className="w-3.5 h-3.5 text-amber-400" />
            Categoría:
          </span>
          {CATEGORY_TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setSelectedCategory(tab.id)}
              className={`px-3 py-1 rounded-lg text-xs whitespace-nowrap transition-colors flex-shrink-0 font-medium ${
                selectedCategory === tab.id
                  ? 'bg-amber-500 text-neutral-950 font-bold shadow-sm'
                  : 'bg-neutral-900 text-neutral-300 hover:bg-neutral-800 hover:text-white border border-neutral-800'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Templates Carousel / Selector Strip */}
        <div className="flex items-center gap-2 pt-1">
          <button
            onClick={handlePrevTemplate}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 flex-shrink-0"
            title="Modelo anterior"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex-1 flex items-center gap-2 overflow-x-auto py-1 scrollbar-thin">
            {filteredTemplates.map(tmpl => {
              const isSelected = tmpl.id === currentTemplate.id;
              return (
                <button
                  key={tmpl.id}
                  onClick={() => handleSelectTemplate(tmpl)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs flex-shrink-0 transition-all text-left border ${
                    isSelected
                      ? 'bg-amber-500/20 border-amber-500 text-amber-200 font-bold shadow-md shadow-amber-950/30'
                      : 'bg-neutral-900/90 border-neutral-800 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800'
                  }`}
                >
                  <img 
                    src={tmpl.previewImage} 
                    alt={tmpl.name} 
                    className="w-6 h-6 rounded-md object-cover flex-shrink-0 border border-white/10"
                    referrerPolicy="no-referrer"
                  />
                  <div className="truncate max-w-[140px]">
                    <div className="truncate flex items-center gap-1.5">
                      <span>{tmpl.name}</span>
                      <span className={`text-[9px] font-mono px-1 py-0.2 rounded font-bold uppercase ${
                        tmpl.requiredPlan === 'oro' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                        tmpl.requiredPlan === 'plata' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                        'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      }`}>
                        {tmpl.requiredPlan}
                      </span>
                    </div>
                    <div className="text-[10px] text-neutral-500 font-normal">{tmpl.sampleHonoree}</div>
                  </div>
                  {isSelected && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0 animate-pulse" />
                  )}
                </button>
              );
            })}
          </div>

          <button
            onClick={handleNextTemplate}
            className="p-1.5 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border border-neutral-800 flex-shrink-0"
            title="Modelo siguiente"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 3. SIMULATOR FRAME */}
      <div className="relative w-full flex justify-center">
        
        {/* Fullscreen Overlay with Explicit Exit Controls */}
        {fullscreen && (
          <div className="fixed top-4 left-4 right-4 z-[70] flex items-center justify-between max-w-md mx-auto bg-neutral-900/95 backdrop-blur-md p-3 rounded-2xl border border-neutral-700 shadow-2xl animate-in fade-in">
            <button
              onClick={() => setFullscreen(false)}
              className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-bold flex items-center gap-1.5 shadow"
            >
              <X className="w-4 h-4 text-red-400" />
              <span>Salir Pantalla Completa (Esc)</span>
            </button>

            {onBackToCatalog && (
              <button
                onClick={() => {
                  setFullscreen(false);
                  onBackToCatalog();
                }}
                className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold hover:bg-amber-500/30 flex items-center gap-1"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Ir al Catálogo</span>
              </button>
            )}
          </div>
        )}

        {/* Mockup Frame Container */}
        <div className={`w-full flex justify-center transition-all ${fullscreen ? 'fixed inset-0 z-[60] bg-black/95 p-3 sm:p-6 overflow-y-auto pt-16 sm:pt-20' : ''}`}>
          
          {/* Smartphone Frame (Realistic iPhone Pro aspect) */}
          <div className="relative w-full max-w-[390px] aspect-[9/19] max-h-[820px] bg-neutral-900 rounded-[48px] p-3.5 shadow-2xl border-[6px] border-neutral-800 ring-1 ring-white/10 flex flex-col">
            
            {/* Dynamic Island / Notch */}
            <div className="absolute top-5 left-1/2 -translate-x-1/2 w-28 h-4 bg-neutral-950 rounded-full z-30 flex items-center justify-center pointer-events-none">
              <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-800 mr-2" />
              <div className="w-1.5 h-1.5 rounded-full bg-blue-950" />
            </div>

            {/* Screen Display Area with Inner Radius */}
            <div 
              id="mobile-viewport-scroll"
              className="w-full h-full rounded-[38px] overflow-y-auto overflow-x-hidden relative bg-[#fdfbf7] shadow-inner"
              style={{ overscrollBehavior: 'contain' }}
            >
              {/* Force clean remount of InvitationView on template switch */}
              <InvitationView 
                key={`${currentTemplate.id}-${guestToken}`}
                guestToken={guestToken}
                isMockupFrame={true} 
                activeTemplate={currentTemplate}
                onOpenTvMode={onOpenTvMode}
              />
            </div>

            {/* Bottom Home Indicator Bar */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32 h-1 bg-neutral-500/40 rounded-full pointer-events-none" />
          </div>
        </div>
      </div>

      {/* 4. UTILITY CONTROLS UNDERNEATH MOCKUP */}
      <div className="mt-6 w-full max-w-xl flex flex-wrap items-center justify-center gap-3 text-xs font-montserrat">
        <button
          id="btn-toggle-fullscreen"
          onClick={() => setFullscreen(!fullscreen)}
          className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-2 transition-colors shadow-sm"
        >
          <Maximize2 className="w-4 h-4 text-amber-400" />
          <span>{fullscreen ? 'Salir de Pantalla Completa' : 'Ver en Pantalla Completa'}</span>
        </button>

        {onOpenTvMode && (
          <button
            onClick={onOpenTvMode}
            className="px-4 py-2 rounded-xl bg-purple-900/60 hover:bg-purple-800/80 text-purple-200 border border-purple-700/60 flex items-center gap-2 transition-colors shadow-sm"
          >
            <Tv className="w-4 h-4 text-purple-400" />
            <span>Abrir Pantalla TV Interactiva</span>
          </button>
        )}

        {/* Guest Persona Tester */}
        <div className="flex items-center gap-2 bg-neutral-900 px-3 py-1.5 rounded-xl border border-neutral-800">
          <span className="text-neutral-400">Ver como:</span>
          <select
            value={guestToken}
            onChange={(e) => setGuestToken(e.target.value)}
            className="bg-transparent text-amber-300 font-semibold focus:outline-none cursor-pointer text-xs"
          >
            <option value="fam-gomez-pereyra" className="bg-neutral-900 text-white">Familia Gómez Pereyra (Tíos)</option>
            <option value="padrinos-marta-roberto" className="bg-neutral-900 text-white">Marta & Roberto (Padrinos)</option>
            <option value="fam-benitez" className="bg-neutral-900 text-white">Familia Benítez (Amigos)</option>
            <option value="amigo-lucas" className="bg-neutral-900 text-white">Lucas Martínez (Compañero)</option>
          </select>
        </div>
      </div>
    </div>
  );
};
