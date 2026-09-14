import React, { useState } from 'react';
import { 
  X, 
  ShieldCheck, 
  UserCheck, 
  Globe, 
  Copy, 
  Check, 
  ExternalLink, 
  Sparkles,
  Lock,
  ArrowRight,
  Eye,
  Sliders,
  DollarSign
} from 'lucide-react';

export const BASE_NETLIFY_URL = 'https://tuinvitaciondigital.netlify.app';

export interface UrlGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTo: (view: 'catalog' | 'demo' | 'client' | 'admin') => void;
  currentView: 'catalog' | 'demo' | 'client' | 'admin';
}

export const UrlGuideModal: React.FC<UrlGuideModalProps> = ({
  isOpen,
  onClose,
  onNavigateTo,
  currentView
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2500);
  };

  const urls = [
    {
      key: 'admin',
      roleTitle: 'Administrador General (Master Admin)',
      path: '/Maximo1822',
      fullUrl: `${BASE_NETLIFY_URL}/Maximo1822`,
      icon: ShieldCheck,
      color: 'blue',
      badge: 'Acceso Secreto & Protegido',
      description: 'URL privada reservada exclusivamente para el administrador general de la plataforma (Horacio Gómez - hrgq.1984@gmail.com).',
      differences: [
        'Aprobación y rechazo de pagos (MercadoPago y transferencias bancarias).',
        'Edición de precios oficiales de los 3 planes (Bronce $45.000 / 25 inv, Plata $52.000 / 50 inv, Oro $60.000 / +50 inv).',
        'Cambio de estado de proyectos (En Revisión 24h, Aprobado, Publicado).',
        'Moderación de fotos de eventos y dedicatorias de invitados.',
        'Exportación y descarga de respaldo completo de la base de datos JSON.',
        'Oculto del menú público para evitar accesos de visitantes comunes.'
      ],
      targetView: 'admin' as const
    },
    {
      key: 'client',
      roleTitle: 'Cliente Registrado (Dueño del Evento)',
      path: '/cliente',
      fullUrl: `${BASE_NETLIFY_URL}/cliente`,
      icon: UserCheck,
      color: 'amber',
      badge: 'Gestor del Evento',
      description: 'URL para la persona que contrató la invitación para sus 15 años, boda o cumpleaños.',
      differences: [
        'Edición completa de datos del evento: nombres, fecha, hora, lugares con GPS Google Maps.',
        'Personalización del sobre: iniciales para sello de cera, color del sobre y música ambiental.',
        'Subida de fotos de portada y fotos del carrusel según cupos de su plan.',
        'Gestión de lista de invitados con límite según plan (Bronce 25, Plata 50, Oro +50 ilimitado).',
        'Envío individual por WhatsApp de invitaciones con enlace personalizado y token.',
        'Seguimiento en tiempo real de confirmaciones de asistencia (RSVP) y restricciones dietarias.',
        'Botón de aprobación de revisión de 24 horas y pantalla TV para recepción (Plan Oro).'
      ],
      targetView: 'client' as const
    },
    {
      key: 'visitor',
      roleTitle: 'Visitante Público & Catálogo',
      path: '/',
      fullUrl: `${BASE_NETLIFY_URL}/`,
      icon: Globe,
      color: 'emerald',
      badge: 'Portal Comercial',
      description: 'URL principal para el público en general, clientes potenciales e invitados al evento.',
      differences: [
        'Exploración interactiva del catálogo de 21 diseños para Bodas, 15 Años y Cumpleaños.',
        'Simulador interactivo en celular con apertura de sobre y música.',
        'Visualización de la tabla comparativa de planes (Bronce, Plata y Oro con límites actualizados).',
        'Botón directo para contratar y abonar vía MercadoPago.',
        'Acceso de contacto directo con asesor oficial vía WhatsApp (+54 9 3835 438603).',
        'No muestra herramientas administrativas ni datos privados de otros eventos.'
      ],
      targetView: 'catalog' as const
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200 font-montserrat">
      <div className="bg-neutral-900 border border-neutral-700/80 rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl text-neutral-200 relative overflow-hidden">
        
        {/* Header */}
        <div className="p-5 sm:p-6 border-b border-neutral-800 flex items-start justify-between bg-neutral-950/60">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
              <span className="text-[11px] font-bold uppercase tracking-widest text-amber-400">
                Estructura de URLs del Dominio
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
              URLs Oficiales en tuinvitaciondigital.netlify.app
            </h2>
            <p className="text-xs text-neutral-400">
              Cada perfil cuenta con su URL designada y niveles de acceso diferenciados.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* URL Cards List */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-4 flex-1">
          {urls.map((u) => {
            const Icon = u.icon;
            const isCurrent = (u.targetView === currentView);
            const isBlue = u.color === 'blue';
            const isAmber = u.color === 'amber';
            const isEmerald = u.color === 'emerald';

            return (
              <div
                key={u.key}
                className={`p-4 sm:p-5 rounded-2xl border transition-all ${
                  isCurrent 
                    ? isBlue ? 'bg-blue-950/30 border-blue-500/60 ring-1 ring-blue-400/40' :
                      isAmber ? 'bg-amber-950/30 border-amber-500/60 ring-1 ring-amber-400/40' :
                      'bg-emerald-950/30 border-emerald-500/60 ring-1 ring-emerald-400/40'
                    : 'bg-neutral-950/60 border-neutral-800 hover:border-neutral-700'
                }`}
              >
                {/* Header of card */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-neutral-800/80">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold ${
                      isBlue ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                      isAmber ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                      'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                    }`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-cinzel font-bold text-white text-base">
                          {u.roleTitle}
                        </span>
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          isBlue ? 'bg-blue-500/20 text-blue-300' :
                          isAmber ? 'bg-amber-500/20 text-amber-300' :
                          'bg-emerald-500/20 text-emerald-300'
                        }`}>
                          {u.badge}
                        </span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-full bg-white/10 text-white text-[10px] font-semibold border border-white/20">
                            Vista Actual
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-neutral-400 mt-0.5">
                        {u.description}
                      </p>
                    </div>
                  </div>
                </div>

                {/* URL Bar with Copy and Go Button */}
                <div className="mt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
                  <div className="flex-1 bg-neutral-900 border border-neutral-800 rounded-xl px-3 py-2 text-xs font-mono text-neutral-200 flex items-center justify-between overflow-x-auto">
                    <span className="font-semibold text-amber-300 mr-2">{u.path}</span>
                    <span className="text-neutral-500 text-[11px] truncate">{u.fullUrl}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleCopy(u.fullUrl, u.key)}
                      className="px-3 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors flex-1 sm:flex-initial justify-center"
                      title="Copiar URL al portapapeles"
                    >
                      {copiedKey === u.key ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400 font-bold">¡Copiado!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-neutral-400" />
                          <span>Copiar URL</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTo(u.targetView);
                        onClose();
                      }}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-transform active:scale-95 shadow-md flex-1 sm:flex-initial justify-center ${
                        isBlue ? 'bg-blue-600 hover:bg-blue-500 text-white' :
                        isAmber ? 'bg-amber-500 hover:bg-amber-400 text-neutral-950' :
                        'bg-emerald-600 hover:bg-emerald-500 text-white'
                      }`}
                    >
                      <span>Entrar a esta URL</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Differences Breakdown */}
                <div className="mt-3 pt-3 border-t border-neutral-800/60">
                  <div className="text-[11px] font-bold text-neutral-300 uppercase tracking-wider mb-1.5">
                    Diferencias y Funcionalidades Exclusivas:
                  </div>
                  <ul className="grid grid-cols-1 md:grid-cols-2 gap-1.5 text-xs text-neutral-400">
                    {u.differences.map((diff, i) => (
                      <li key={i} className="flex items-start gap-1.5">
                        <span className={`w-1.5 h-1.5 rounded-full mt-1.5 flex-shrink-0 ${
                          isBlue ? 'bg-blue-400' : isAmber ? 'bg-amber-400' : 'bg-emerald-400'
                        }`} />
                        <span>{diff}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer info */}
        <div className="p-4 border-t border-neutral-800 bg-neutral-950/80 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-neutral-400">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-amber-400 flex-shrink-0" />
            <span>
              En Netlify, el archivo <code>_redirects</code> enruta todas las URLs limpias al bundle SPA.
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-semibold"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
