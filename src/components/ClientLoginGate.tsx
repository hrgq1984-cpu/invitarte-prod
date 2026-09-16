import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Heart,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../lib/store';

interface ClientLoginGateProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const ClientLoginGate: React.FC<ClientLoginGateProps> = ({ onSuccess, onGoBack }) => {
  const { loginClient, currentProject } = useStore();
  const [emailOrSlug, setEmailOrSlug] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      loginClient(emailOrSlug);
      setIsSubmitting(false);
      onSuccess();
    }, 200);
  };

  const handleQuickDemoClient = () => {
    loginClient('sofia');
    onSuccess();
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-montserrat">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Amber glow */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mx-auto shadow-lg shadow-amber-950/40">
            <LayoutDashboard className="w-8 h-8" />
          </div>

          <div className="inline-block px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/30 text-amber-300 text-[11px] font-mono font-bold uppercase tracking-wider">
            Portal de Cliente: /cliente
          </div>

          <h2 className="text-2xl font-cinzel font-bold text-white pt-1">
            Gestión de tu Invitación
          </h2>
          <p className="text-xs text-neutral-400">
            Ingresa para configurar tu evento, enviar enlaces por WhatsApp y revisar la lista de asistentes en tiempo real.
          </p>
        </div>

        {/* Event Preview Banner */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-xs space-y-1.5">
          <div className="text-amber-400 text-[11px] uppercase tracking-wider font-semibold flex items-center gap-1.5">
            <Heart className="w-3.5 h-3.5 fill-amber-400" />
            Evento Activo Asociado
          </div>
          <div className="text-sm font-cinzel font-bold text-white">
            {currentProject.honoreeName || 'Celebración'}
          </div>
          <div className="text-neutral-400 text-[11px]">
            Plan {currentProject.planId?.toUpperCase() || 'ORO'} • Enlace público: /{currentProject.publicSlug}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Correo del Titular o Código de Evento
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="text"
                value={emailOrSlug}
                onChange={(e) => setEmailOrSlug(e.target.value)}
                placeholder="ej: cliente@email.com o sofia-mateo"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-amber-500 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-amber-950/40"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isSubmitting ? 'Ingresando...' : 'Acceder al Gestor de Evento'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Access */}
        <div className="pt-2 border-t border-neutral-800 text-center space-y-2">
          <p className="text-[11px] text-neutral-400">
            ¿Deseas probar el panel de cliente inmediatamente?
          </p>
          <button
            type="button"
            onClick={handleQuickDemoClient}
            className="w-full py-2.5 rounded-xl bg-neutral-800/80 hover:bg-neutral-800 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center justify-center gap-2 transition-colors"
          >
            <Sparkles className="w-4 h-4 text-amber-400" />
            Ingresar como Cliente de Prueba (Boda Sofía & Mateo)
          </button>
        </div>

        {/* Back to Visitor Catalog */}
        <div className="text-center pt-1">
          <button
            type="button"
            onClick={onGoBack}
            className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Catálogo Comercial (Visitante)
          </button>
        </div>

      </div>
    </div>
  );
};
