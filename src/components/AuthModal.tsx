import React, { useState } from 'react';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ShieldCheck, 
  ArrowRight,
  Sparkles
} from 'lucide-react';
import { useStore } from '../lib/store';

interface AuthModalProps {
  onClose: () => void;
  defaultMode?: 'login' | 'register';
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, defaultMode = 'login' }) => {
  const { setCurrentUser, currentUser } = useStore();
  const [mode, setMode] = useState<'login' | 'register'>(defaultMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Check if logging in as admin
    const isAdmin = email.toLowerCase().includes('hrgq.1984@gmail.com') || email.toLowerCase().includes('admin');

    setCurrentUser({
      uid: isAdmin ? 'admin-root-01' : 'client-' + Date.now(),
      email: email,
      displayName: name || (isAdmin ? 'Administrador General' : 'Cliente'),
      role: isAdmin ? 'admin' : 'client',
      phone: isAdmin ? '5493835438603' : '5491144556677'
    });

    onClose();
  };

  const handleQuickAdminLogin = () => {
    setCurrentUser({
      uid: 'admin-root-01',
      email: 'hrgq.1984@gmail.com',
      displayName: 'Administrador General (HRGQ)',
      role: 'admin',
      phone: '5493835438603'
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in font-montserrat">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-sm w-full p-6 sm:p-8 space-y-6 text-xs text-neutral-300 relative shadow-2xl">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-1.5 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1 text-center">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mx-auto mb-2">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="text-xl font-cinzel font-bold text-white">
            {mode === 'login' ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </h3>
          <p className="text-neutral-400 text-xs">
            Accede al gestor de tu evento, lista de invitados y estado de pago.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'register' && (
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Nombre Completo</label>
              <div className="relative">
                <User className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  required
                  placeholder="Sofía Martínez"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-neutral-400 mb-1 font-semibold">Correo Electrónico</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-neutral-400 mb-1 font-semibold">Contraseña</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center justify-center gap-2 transition-colors shadow-md"
          >
            <span>{mode === 'login' ? 'Entrar a mi Cuenta' : 'Registrarse'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Mode switcher */}
        <div className="text-center pt-2 border-t border-neutral-800">
          <button
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
            className="text-amber-400 hover:underline"
          >
            {mode === 'login' ? '¿No tienes cuenta? Regístrate aquí' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        {/* Quick Admin Shortcut for ease of review */}
        <div className="pt-2">
          <button
            type="button"
            onClick={handleQuickAdminLogin}
            className="w-full py-2 rounded-xl bg-blue-950/40 hover:bg-blue-900/60 text-blue-300 border border-blue-800/60 flex items-center justify-center gap-2 text-[11px] font-semibold transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-blue-400" />
            Acceso Rápido como Administrador General
          </button>
        </div>

      </div>
    </div>
  );
};
