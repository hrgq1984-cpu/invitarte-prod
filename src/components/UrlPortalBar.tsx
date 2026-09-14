import React, { useState } from 'react';
import { 
  ShieldCheck, 
  UserCheck, 
  Globe, 
  Copy, 
  Check, 
  Info, 
  ExternalLink, 
  ChevronDown, 
  ChevronUp,
  Sparkles,
  Link2,
  Lock
} from 'lucide-react';
import { BASE_NETLIFY_URL } from './UrlGuideModal';

interface UrlPortalBarProps {
  currentView: 'catalog' | 'demo' | 'client' | 'admin';
  onNavigateTo: (view: 'catalog' | 'demo' | 'client' | 'admin') => void;
  onOpenUrlGuide: () => void;
}

export const UrlPortalBar: React.FC<UrlPortalBarProps> = ({
  currentView,
  onNavigateTo,
  onOpenUrlGuide
}) => {
  const [copied, setCopied] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const getRouteInfo = () => {
    switch (currentView) {
      case 'admin':
        return {
          path: '/Maximo1822',
          title: 'Panel Administrador',
          badge: 'Super Admin',
          fullUrl: `${BASE_NETLIFY_URL}/Maximo1822`,
          colorClass: 'border-blue-500/40 bg-blue-950/40 text-blue-300',
          indicatorColor: 'bg-blue-400'
        };
      case 'client':
        return {
          path: '/cliente',
          title: 'Panel Cliente Registrado',
          badge: 'Dueño del Evento',
          fullUrl: `${BASE_NETLIFY_URL}/cliente`,
          colorClass: 'border-amber-500/40 bg-amber-950/40 text-amber-300',
          indicatorColor: 'bg-amber-400'
        };
      case 'demo':
        return {
          path: '/invitacion',
          title: 'Invitación Celular / Invitado',
          badge: 'Demo / RSVP',
          fullUrl: `${BASE_NETLIFY_URL}/invitacion`,
          colorClass: 'border-purple-500/40 bg-purple-950/40 text-purple-300',
          indicatorColor: 'bg-purple-400'
        };
      default:
        return {
          path: '/',
          title: 'Portal Visitante & Catálogo',
          badge: 'Público General',
          fullUrl: `${BASE_NETLIFY_URL}/`,
          colorClass: 'border-emerald-500/40 bg-emerald-950/40 text-emerald-300',
          indicatorColor: 'bg-emerald-400'
        };
    }
  };

  const currentRoute = getRouteInfo();

  const handleCopyCurrent = () => {
    navigator.clipboard.writeText(currentRoute.fullUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  if (isMinimized) {
    return (
      <div className="bg-neutral-950/95 border-b border-neutral-800 px-3 py-1 flex items-center justify-between text-[11px] text-neutral-400 font-montserrat">
        <div className="flex items-center gap-2">
          <span className={`w-2 h-2 rounded-full ${currentRoute.indicatorColor} animate-pulse`} />
          <span className="font-mono text-white font-semibold">{currentRoute.path}</span>
          <span className="hidden sm:inline text-neutral-500">({currentRoute.title})</span>
        </div>
        <button
          onClick={() => setIsMinimized(false)}
          className="flex items-center gap-1 text-neutral-400 hover:text-white px-2 py-0.5 rounded hover:bg-neutral-800 transition-colors"
        >
          <span>Mostrar URLs</span>
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-950/95 border-b border-neutral-800/80 px-3 sm:px-6 py-2 text-xs font-montserrat transition-all">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-2.5">
        
        {/* Left: Active URL Display */}
        <div className="flex items-center gap-2.5 flex-wrap">
          <div className="flex items-center gap-1.5 font-mono text-[11px] bg-neutral-900 px-2.5 py-1 rounded-lg border border-neutral-800 text-neutral-300">
            <Link2 className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-neutral-500 hidden sm:inline">tuinvitaciondigital.netlify.app</span>
            <span className="font-bold text-white bg-neutral-800 px-1.5 py-0.5 rounded text-amber-300">
              {currentRoute.path}
            </span>
          </div>

          <div className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1.5 border ${currentRoute.colorClass}`}>
            <span className={`w-1.5 h-1.5 rounded-full ${currentRoute.indicatorColor}`} />
            <span>{currentRoute.title}</span>
          </div>

          <button
            onClick={handleCopyCurrent}
            className="text-[11px] text-neutral-400 hover:text-white px-2 py-1 rounded-md bg-neutral-900 hover:bg-neutral-800 border border-neutral-800 flex items-center gap-1 transition-colors"
            title="Copiar URL completa activa"
          >
            {copied ? (
              <>
                <Check className="w-3 h-3 text-emerald-400" />
                <span className="text-emerald-400 font-semibold">¡URL Copiada!</span>
              </>
            ) : (
              <>
                <Copy className="w-3 h-3 text-neutral-400" />
                <span>Copiar URL</span>
              </>
            )}
          </button>
        </div>

        {/* Right: Quick Switcher Between the 3 Defined URLs + Modal Button */}
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-[11px] text-neutral-400 hidden xl:inline">
            Ir a URL:
          </span>

          {/* Admin URL Button */}
          <button
            onClick={() => onNavigateTo('admin')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 border ${
              currentView === 'admin'
                ? 'bg-blue-600 text-white border-blue-400 shadow-sm'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:text-blue-300'
            }`}
            title="Abrir URL Administrador: /Maximo1822 (Protegido por Clave)"
          >
            <Lock className="w-3 h-3 text-blue-400" />
            <span>/Maximo1822 (Admin)</span>
          </button>

          {/* Client URL Button */}
          <button
            onClick={() => onNavigateTo('client')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 border ${
              currentView === 'client'
                ? 'bg-amber-500 text-neutral-950 font-bold border-amber-300 shadow-sm'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:text-amber-300'
            }`}
            title="Abrir URL Cliente Registrado: /cliente"
          >
            <UserCheck className="w-3 h-3 text-amber-400" />
            <span>/cliente (Cliente)</span>
          </button>

          {/* Visitor URL Button */}
          <button
            onClick={() => onNavigateTo('catalog')}
            className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 border ${
              currentView === 'catalog'
                ? 'bg-emerald-600 text-white border-emerald-400 shadow-sm'
                : 'bg-neutral-900 hover:bg-neutral-800 text-neutral-300 border-neutral-800 hover:text-emerald-300'
            }`}
            title="Abrir URL Visitante / Catálogo: /"
          >
            <Globe className="w-3 h-3 text-emerald-400" />
            <span>/ (Visitante)</span>
          </button>

          {/* Differences Guide Modal Trigger */}
          <button
            onClick={onOpenUrlGuide}
            className="px-2.5 py-1 rounded-lg bg-neutral-900 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-[11px] font-semibold flex items-center gap-1 transition-colors ml-1"
          >
            <Info className="w-3 h-3 text-amber-400" />
            <span>Ver Diferencias</span>
          </button>

          {/* Minimize toggle */}
          <button
            onClick={() => setIsMinimized(true)}
            className="p-1 text-neutral-500 hover:text-neutral-300 rounded hover:bg-neutral-800 transition-colors"
            title="Minimizar barra de URLs"
          >
            <ChevronUp className="w-3.5 h-3.5" />
          </button>
        </div>

      </div>
    </div>
  );
};
