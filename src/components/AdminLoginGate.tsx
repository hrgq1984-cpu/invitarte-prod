import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  ArrowLeft, 
  Mail, 
  Phone, 
  AlertCircle,
  KeyRound
} from 'lucide-react';
import { useStore } from '../lib/store';

interface AdminLoginGateProps {
  onSuccess: () => void;
  onGoBack: () => void;
}

export const AdminLoginGate: React.FC<AdminLoginGateProps> = ({ onSuccess, onGoBack }) => {
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    const ok = await loginAdmin(email, password);
    setIsSubmitting(false);
    if (ok) onSuccess();
    else setError('Credenciales inválidas o usuario sin permisos de administrador.');
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4 py-12 font-montserrat">
      <div className="max-w-md w-full bg-neutral-900 border border-neutral-800 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-48 h-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* Header Icon */}
        <div className="text-center space-y-2">
          <div className="w-16 h-16 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mx-auto shadow-lg shadow-blue-950/50">
            <ShieldCheck className="w-8 h-8" />
          </div>
          
          <div className="inline-block px-3 py-1 rounded-full bg-blue-950/80 border border-blue-500/30 text-blue-300 text-[11px] font-mono font-bold uppercase tracking-wider">
            🔒 URL Secreta: /Maximo1822
          </div>

          <h2 className="text-2xl font-cinzel font-bold text-white pt-1">
            Panel de Administrador
          </h2>
          <p className="text-xs text-neutral-400">
            Área protegida y restringida. Solo personal autorizado para moderar pagos, precios y proyectos.
          </p>
        </div>

        {/* Administrator Profile Card */}
        <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800/80 text-xs space-y-1.5 font-mono">
          <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-sans font-semibold">
            Super Administrador Registrado
          </div>
          <div className="flex items-center gap-2 text-neutral-200">
            <Mail className="w-3.5 h-3.5 text-blue-400 flex-shrink-0" />
            <span className="truncate">hrgq.1984@gmail.com</span>
          </div>
          <div className="flex items-center gap-2 text-neutral-300">
            <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
            <span>+54 9 3835 438603 (Héctor René González Quiroga)</span>
          </div>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Correo del Administrador
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@dominio.com"
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 text-xs"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1.5">
              Contraseña
            </label>
            <div className="relative">
              <KeyRound className="w-4 h-4 text-neutral-500 absolute left-3 top-3" />
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Contraseña de Firebase Auth"
                className="w-full pl-9 pr-10 py-2.5 rounded-xl bg-neutral-950 border border-neutral-800 text-white placeholder-neutral-600 focus:outline-none focus:border-blue-500 text-xs"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-neutral-500 hover:text-neutral-300 transition-colors"
                title={showPassword ? 'Ocultar' : 'Mostrar'}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white font-semibold text-xs flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-950/50"
          >
            <Lock className="w-4 h-4" />
            <span>{isSubmitting ? 'Verificando credenciales...' : 'Desbloquear y Acceder'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Go back to public visitor catalog */}
        <div className="text-center pt-2 border-t border-neutral-800">
          <button
            type="button"
            onClick={onGoBack}
            className="text-xs text-neutral-400 hover:text-white inline-flex items-center gap-1.5 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Volver al Catálogo Público (Visitante)
          </button>
        </div>

      </div>
    </div>
  );
};
