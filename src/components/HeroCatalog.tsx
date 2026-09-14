import React, { useState } from 'react';
import { 
  Sparkles, 
  Check, 
  Eye, 
  ArrowRight, 
  Heart, 
  Layers, 
  Smartphone, 
  Tv, 
  ShieldCheck, 
  Calendar,
  Music,
  Share2,
  Camera,
  ChevronRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import { DesignTemplate, EventType, PlanTier } from '../types';

interface HeroCatalogProps {
  onSelectTemplate: (template: DesignTemplate, planId: PlanTier) => void;
  onViewDemo: (template: DesignTemplate) => void;
}

const EVENT_TYPE_FILTERS: { id: EventType | 'todos'; label: string; icon: string }[] = [
  { id: 'todos', label: 'Todos los Eventos', icon: '✨' },
  { id: 'boda', label: 'Bodas', icon: '💍' },
  { id: 'cumpleanos', label: 'Cumpleaños', icon: '🎂' },
  { id: '15anos', label: '15 Años', icon: '👑' },
  { id: 'bautismo', label: 'Bautismos', icon: '🕊️' },
  { id: 'comunion', label: 'Comuniones', icon: '⛪' },
  { id: 'confirmacion', label: 'Confirmaciones', icon: '🔥' },
  { id: 'otros', label: 'Otros Eventos', icon: '🥂' }
];

export const HeroCatalog: React.FC<HeroCatalogProps> = ({ onSelectTemplate, onViewDemo }) => {
  const { plans, templates } = useStore();
  const [selectedEventType, setSelectedEventType] = useState<EventType | 'todos'>('todos');
  const [selectedPlanFilter, setSelectedPlanFilter] = useState<PlanTier | 'all'>('all');

  const filteredTemplates = templates.filter(t => {
    const matchesEvent = selectedEventType === 'todos' || t.eventType === selectedEventType;
    const matchesPlan = selectedPlanFilter === 'all' || t.requiredPlan === selectedPlanFilter;
    return matchesEvent && matchesPlan;
  });

  return (
    <div className="space-y-16 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      
      {/* 1. HERO SECTION */}
      <section className="text-center space-y-6 pt-4 pb-8 relative">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 blur-3xl rounded-full pointer-events-none" />

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-semibold tracking-wide">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          Plataforma Comercial de Invitaciones Digitales Interactivas
        </div>

        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-cinzel font-bold text-white tracking-tight max-w-4xl mx-auto leading-tight">
          La Celebración Comienza en la{' '}
          <span className="bg-gradient-to-r from-amber-400 via-amber-200 to-yellow-400 bg-clip-text text-transparent">
            Primera Impresión
          </span>
        </h1>

        <p className="text-neutral-300 text-sm sm:text-base font-montserrat max-w-2xl mx-auto leading-relaxed">
          Diseños de alta gama con sobre de apertura interactivo, música, confirmación de asistencia por WhatsApp, libro de recuerdos y pantalla TV en vivo para tu fiesta.
        </p>

        {/* Feature quick badges */}
        <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-montserrat text-neutral-300 pt-2">
          <div className="flex items-center gap-1.5">
            <Smartphone className="w-4 h-4 text-amber-400" />
            <span>100% Optimizado para Celular</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1.5">
            <Music className="w-4 h-4 text-amber-400" />
            <span>Música & Sobre Animado</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1.5">
            <Tv className="w-4 h-4 text-amber-400" />
            <span>Pantalla TV para el Salón</span>
          </div>
          <span className="text-neutral-600">•</span>
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            <span>Revisión de 24 Horas Post-Pago</span>
          </div>
        </div>
      </section>

      {/* 2. TABLA Y COMPARATIVA DE PLANES */}
      <section className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
            Planes & Precios Transparentes
          </h2>
          <p className="text-neutral-400 text-xs sm:text-sm font-montserrat">
            Precios configurables desde el panel administrativo. Sin costos ocultos.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.id}
              className={`relative rounded-3xl p-6 transition-all flex flex-col justify-between border ${
                plan.id === 'oro'
                  ? 'bg-gradient-to-b from-amber-950/40 via-neutral-900 to-neutral-900 border-amber-500/50 shadow-2xl shadow-amber-950/40'
                  : plan.id === 'plata'
                  ? 'bg-neutral-900/90 border-neutral-700 hover:border-neutral-500'
                  : 'bg-neutral-900/70 border-neutral-800 hover:border-neutral-700'
              }`}
            >
              {plan.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-gradient-to-r from-amber-600 to-yellow-500 text-neutral-950 text-[11px] font-bold uppercase tracking-wider px-3 py-0.5 rounded-full shadow-md">
                  {plan.badge}
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-cinzel font-bold text-white">{plan.name}</h3>
                  <span className="text-xs font-mono uppercase px-2 py-0.5 rounded bg-neutral-800 text-neutral-400">
                    {plan.id.toUpperCase()}
                  </span>
                </div>

                <div className="flex items-baseline gap-1">
                  <span className="text-3xl sm:text-4xl font-bold font-montserrat text-amber-300">
                    ${plan.price.toLocaleString('es-AR')}
                  </span>
                  <span className="text-xs text-neutral-400 font-mono">ARS</span>
                </div>

                <p className="text-xs text-neutral-400 font-montserrat leading-relaxed">
                  {plan.description}
                </p>

                <div className="w-full h-px bg-neutral-800" />

                {/* Features List */}
                <ul className="space-y-2.5 text-xs text-neutral-300 font-montserrat">
                  {plan.features.map((feat, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-6">
                <button
                  id={`btn-select-plan-${plan.id}`}
                  onClick={() => {
                    const sample = templates.find(t => t.requiredPlan === plan.id) || templates[0];
                    onSelectTemplate(sample, plan.id);
                  }}
                  className={`w-full py-3 rounded-xl text-xs font-bold font-montserrat tracking-wider uppercase transition-all shadow-md ${
                    plan.id === 'oro'
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-neutral-950'
                      : 'bg-neutral-800 hover:bg-neutral-700 text-white border border-neutral-700'
                  }`}
                >
                  Contratar {plan.name}
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CATÁLOGO DE MUESTRAS (21 MODELOS DISPONIBLES) */}
      <section className="space-y-6 pt-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              21 Muestras Reales (3 por Tipo de Evento)
            </div>
            <h2 className="text-2xl sm:text-3xl font-cinzel font-bold text-white">
              Explora Nuestro Catálogo
            </h2>
          </div>

          <div className="text-xs text-neutral-400 font-montserrat">
            Mostrando {filteredTemplates.length} de 21 diseños disponibles
          </div>
        </div>

        {/* Filter Bar by Event Type */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
          {EVENT_TYPE_FILTERS.map(filter => (
            <button
              key={filter.id}
              onClick={() => setSelectedEventType(filter.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedEventType === filter.id
                  ? 'bg-amber-500 text-neutral-950 shadow-md shadow-amber-500/20'
                  : 'bg-neutral-900 text-neutral-400 hover:text-white border border-neutral-800'
              }`}
            >
              <span>{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          ))}
        </div>

        {/* Grid of Templates */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => (
            <div
              key={template.id}
              className="bg-neutral-900 border border-neutral-800 rounded-3xl overflow-hidden hover:border-amber-500/40 transition-all group flex flex-col justify-between"
            >
              {/* Image & Badges */}
              <div className="relative aspect-[4/3] overflow-hidden bg-neutral-950">
                <img
                  src={template.previewImage}
                  alt={template.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Event Type & Required Plan Badge */}
                <div className="absolute top-3 left-3 flex items-center gap-1.5">
                  <span className="px-2.5 py-1 rounded-full bg-black/60 backdrop-blur-md text-white text-[11px] font-semibold border border-white/20 capitalize">
                    {template.eventType}
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-amber-500/80 backdrop-blur-md text-neutral-950 text-[10px] font-bold uppercase tracking-wider">
                    Plan {template.requiredPlan.toUpperCase()}
                  </span>
                </div>

                {/* Wax Seal Symbol */}
                <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-amber-600/90 border border-amber-300 text-white flex items-center justify-center text-sm shadow-lg">
                  {template.waxSealSymbol}
                </div>
              </div>

              {/* Card Details */}
              <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-cinzel font-bold text-white group-hover:text-amber-300 transition-colors">
                      {template.name}
                    </h3>
                    
                    {/* Palette preview dots */}
                    <div className="flex items-center gap-1">
                      <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: template.palette.primary }} />
                      <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: template.palette.secondary }} />
                      <div className="w-3 h-3 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: template.palette.accent }} />
                    </div>
                  </div>

                  <p className="text-xs text-neutral-400 font-montserrat line-clamp-2">
                    {template.description}
                  </p>

                  <div className="text-[11px] text-neutral-500 font-serif-luxury italic">
                    "{template.samplePhrase}"
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="pt-4 grid grid-cols-2 gap-2 text-xs font-montserrat">
                  <button
                    onClick={() => onViewDemo(template)}
                    className="py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5 text-amber-400" />
                    Ver Demo Móvil
                  </button>

                  <button
                    onClick={() => onSelectTemplate(template, template.requiredPlan)}
                    className="py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                  >
                    <span>Elegir Diseño</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FLUJO DE CONTRATACIÓN & SEGURIDAD */}
      <section className="bg-neutral-900/60 border border-neutral-800 rounded-3xl p-6 sm:p-10 space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-cinzel font-bold text-white">¿Cómo Funciona?</h2>
          <p className="text-xs text-neutral-400 font-montserrat">
            Un flujo confiable y asistido desde la elección del modelo hasta la celebración
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-montserrat">
          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center">1</div>
            <div className="font-bold text-white text-sm">Eliges tu Diseño</div>
            <div className="text-neutral-400">Selecciona el tipo de evento y personaliza nombres, fecha, salón y música.</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center">2</div>
            <div className="font-bold text-white text-sm">Creas tu Orden & Pagas</div>
            <div className="text-neutral-400">Pago seguro mediante Mercado Pago o Transferencia Bancaria con comprobante.</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center">3</div>
            <div className="font-bold text-white text-sm">Ventana de Revisión de 24h</div>
            <div className="text-neutral-400">Acceso a vista previa privada para revisar textos, fotos y solicitar correcciones.</div>
          </div>

          <div className="p-4 rounded-2xl bg-neutral-900/90 border border-neutral-800 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-400 font-bold flex items-center justify-center">4</div>
            <div className="font-bold text-white text-sm">Publicación & Envío</div>
            <div className="text-neutral-400">Envío por WhatsApp a tus invitados, recepción de confirmaciones y modo TV en vivo.</div>
          </div>
        </div>
      </section>

    </div>
  );
};
