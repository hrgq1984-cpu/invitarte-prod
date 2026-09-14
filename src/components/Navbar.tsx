import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  ShieldCheck, 
  Tv, 
  FileText, 
  Smartphone, 
  UserCheck, 
  Sliders, 
  CheckCircle2, 
  Volume2, 
  VolumeX,
  User
} from 'lucide-react';
import { useStore, ADMIN_USER, DEMO_CLIENT_USER, DEMO_GUEST_USER } from '../lib/store';
import { ambientAudio } from '../lib/audioSynth';

export interface NavbarProps {
  activeTab?: 'catalog' | 'client' | 'admin' | 'demo' | 'tv' | 'tests' | 'docs';
  setActiveTab?: (tab: 'catalog' | 'client' | 'admin' | 'demo' | 'tv' | 'tests' | 'docs') => void;
  currentView?: 'catalog' | 'demo' | 'client' | 'admin';
  onNavigate?: (view: 'catalog' | 'demo' | 'client' | 'admin') => void;
  onOpenTvMode?: () => void;
  onOpenAuth?: () => void;
  onOpenDocs?: () => void;
  onOpenTests?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  currentView,
  onNavigate,
  onOpenTvMode,
  onOpenAuth,
  onOpenDocs,
  onOpenTests
}) => {
  const { currentUser, setCurrentUser, currentProject, projects, setSelectedProjectId, currentEventSettings } = useStore();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const current = currentView || activeTab || 'catalog';

  const handleNav = (tab: 'catalog' | 'client' | 'admin' | 'demo' | 'tv' | 'tests' | 'docs') => {
    if (tab === 'tv') {
      if (onOpenTvMode) {
        onOpenTvMode();
      } else if (setActiveTab) {
        setActiveTab('tv');
      }
      return;
    }
    if (tab === 'docs') {
      if (onOpenDocs) {
        onOpenDocs();
      } else if (setActiveTab) {
        setActiveTab('docs');
      }
      return;
    }
    if (tab === 'tests') {
      if (onOpenTests) {
        onOpenTests();
      } else if (onOpenDocs) {
        onOpenDocs();
      } else if (setActiveTab) {
        setActiveTab('tests');
      }
      return;
    }

    if (onNavigate) {
      onNavigate(tab as 'catalog' | 'demo' | 'client' | 'admin');
    }
    if (setActiveTab) {
      setActiveTab(tab);
    }
  };

  const toggleMusic = () => {
    if (isPlayingMusic) {
      ambientAudio.pause();
      setIsPlayingMusic(false);
    } else {
      ambientAudio.playCeremonialChord();
      ambientAudio.playStream(currentEventSettings.selectedMusicUrl);
      setIsPlayingMusic(true);
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-neutral-950/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Brand */}
          <div 
            id="nav-brand-logo"
            className="flex items-center gap-3 cursor-pointer select-none" 
            onClick={() => handleNav('catalog')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-300 flex items-center justify-center shadow-lg shadow-amber-950/40 text-neutral-950 font-cinzel font-bold text-lg">
              TID
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-cinzel text-base sm:text-lg font-bold tracking-wider text-amber-200">TuInvitacionDigital</span>
                <span className="text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                  Eventos
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-montserrat hidden sm:block">
                Invitaciones Digitales & Pantalla TV
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 font-montserrat">
            <button
              id="nav-tab-catalog"
              onClick={() => handleNav('catalog')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                current === 'catalog' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Catálogo y Planes
            </button>

            <button
              id="nav-tab-demo"
              onClick={() => handleNav('demo')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                current === 'demo' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <Smartphone className="w-3.5 h-3.5 text-amber-400" />
              Demo Celular
            </button>

            <button
              id="nav-tab-client"
              onClick={() => handleNav('client')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                current === 'client' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              Panel de Cliente
            </button>

            <button
              id="nav-tab-admin"
              onClick={() => handleNav('admin')}
              className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                current === 'admin' 
                  ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
              Admin General
            </button>

            <button
              id="nav-tab-tv"
              onClick={() => handleNav('tv')}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60"
            >
              <Tv className="w-3.5 h-3.5 text-purple-400" />
              Pantalla TV
            </button>

            <button
              id="nav-tab-tests"
              onClick={() => handleNav('tests')}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60"
            >
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              Pruebas
            </button>

            <button
              id="nav-tab-docs"
              onClick={() => handleNav('docs')}
              className="px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60"
            >
              <FileText className="w-3.5 h-3.5" />
              Docs
            </button>
          </nav>

          {/* Right Area: Music Toggle + Project Selector + Role Switcher + Auth */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Ambient Music Button */}
            <button
              onClick={toggleMusic}
              className={`p-2 rounded-xl border text-xs transition-colors flex items-center gap-1.5 ${
                isPlayingMusic 
                  ? 'bg-amber-500/20 border-amber-500/50 text-amber-300 animate-pulse' 
                  : 'bg-neutral-900 border-neutral-700 text-neutral-400 hover:text-white'
              }`}
              title={isPlayingMusic ? 'Pausar música ambiental' : 'Reproducir melodía ceremonial'}
            >
              {isPlayingMusic ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
              <span className="hidden xl:inline text-[11px]">{isPlayingMusic ? 'Música Activa' : 'Música'}</span>
            </button>

            {/* Active project selector */}
            {projects.length > 1 && (
              <select
                id="select-active-project"
                value={currentProject.id}
                onChange={(e) => setSelectedProjectId(e.target.value)}
                className="hidden md:block bg-neutral-900 border border-neutral-700 text-neutral-200 text-xs rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-amber-500"
              >
                {projects.map(p => (
                  <option key={p.id} value={p.id}>
                    {p.publicSlug} ({p.planId.toUpperCase()})
                  </option>
                ))}
              </select>
            )}

            {/* Fast Role Switcher */}
            <div className="relative">
              <button
                id="btn-role-switcher-toggle"
                onClick={() => setShowRoleMenu(!showRoleMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium border border-neutral-700 hover:border-amber-500/50 bg-neutral-900 text-neutral-200 transition-colors"
                title="Cambiar rol para probar permisos de Firebase"
              >
                <div className={`w-2 h-2 rounded-full ${
                  currentUser.role === 'admin' ? 'bg-blue-400' :
                  currentUser.role === 'client' ? 'bg-amber-400' : 'bg-emerald-400'
                }`} />
                <span className="capitalize font-semibold">{currentUser.role}</span>
                <Sliders className="w-3.5 h-3.5 text-neutral-400 ml-1" />
              </button>

              {showRoleMenu && (
                <div className="absolute right-0 mt-2 w-72 bg-neutral-900 border border-neutral-700 rounded-xl shadow-2xl p-2.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider px-2 py-1 border-b border-neutral-800 mb-1.5">
                    Probar Roles & Permisos
                  </div>
                  
                  {/* Admin role */}
                  <button
                    id="role-select-admin"
                    onClick={() => {
                      setCurrentUser(ADMIN_USER);
                      setShowRoleMenu(false);
                      handleNav('admin');
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 ${
                      currentUser.role === 'admin' ? 'bg-blue-500/15 border border-blue-500/30' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <ShieldCheck className="w-4 h-4 text-blue-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white flex items-center gap-1.5">
                        Administrador General
                        <span className="text-[10px] text-blue-400 font-mono">hrgq.1984@gmail.com</span>
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Aprueba pagos, modera contenido, edita precios de planes.
                      </div>
                    </div>
                  </button>

                  {/* Client role */}
                  <button
                    id="role-select-client"
                    onClick={() => {
                      setCurrentUser(DEMO_CLIENT_USER);
                      setShowRoleMenu(false);
                      handleNav('client');
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 mt-1 ${
                      currentUser.role === 'client' ? 'bg-amber-500/15 border border-amber-500/30' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <UserCheck className="w-4 h-4 text-amber-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Cliente (Dueño del Evento)
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Edita fechas, invitados, fotos, solicita cambios en revisión de 24h.
                      </div>
                    </div>
                  </button>

                  {/* Guest role */}
                  <button
                    id="role-select-guest"
                    onClick={() => {
                      setCurrentUser(DEMO_GUEST_USER);
                      setShowRoleMenu(false);
                      handleNav('demo');
                    }}
                    className={`w-full text-left p-2 rounded-lg transition-colors flex items-start gap-2.5 mt-1 ${
                      currentUser.role === 'guest' ? 'bg-emerald-500/15 border border-emerald-500/30' : 'hover:bg-neutral-800'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 text-emerald-400 mt-0.5" />
                    <div>
                      <div className="text-xs font-bold text-white">
                        Invitado (Familia Gómez)
                      </div>
                      <div className="text-[11px] text-neutral-400">
                        Abre sobre, escucha música, confirma asistencia y deja buenos deseos.
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Auth Modal Trigger */}
            {onOpenAuth && (
              <button
                onClick={onOpenAuth}
                className="p-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-amber-500/50 transition-colors"
                title="Cuenta / Iniciar Sesión"
              >
                <User className="w-4 h-4" />
              </button>
            )}

          </div>
        </div>
      </div>

      {/* Mobile navigation row */}
      <div className="lg:hidden flex items-center justify-around border-t border-neutral-800/80 bg-neutral-950 px-2 py-2 text-xs overflow-x-auto">
        <button
          onClick={() => handleNav('catalog')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 ${current === 'catalog' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
        >
          <Sparkles className="w-3.5 h-3.5" /> Planes
        </button>
        <button
          onClick={() => handleNav('demo')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 ${current === 'demo' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
        >
          <Smartphone className="w-3.5 h-3.5" /> Celular
        </button>
        <button
          onClick={() => handleNav('client')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 ${current === 'client' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
        >
          <LayoutDashboard className="w-3.5 h-3.5" /> Mi Panel
        </button>
        <button
          onClick={() => handleNav('admin')}
          className={`px-2.5 py-1.5 rounded-md flex items-center gap-1 ${current === 'admin' ? 'text-blue-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
        >
          <ShieldCheck className="w-3.5 h-3.5" /> Admin
        </button>
        <button
          onClick={() => handleNav('tv')}
          className="px-2.5 py-1.5 rounded-md flex items-center gap-1 text-purple-400 hover:bg-neutral-800"
        >
          <Tv className="w-3.5 h-3.5" /> TV
        </button>
        <button
          onClick={() => handleNav('tests')}
          className="px-2.5 py-1.5 rounded-md flex items-center gap-1 text-emerald-400 hover:bg-neutral-800"
        >
          <CheckCircle2 className="w-3.5 h-3.5" /> Tests
        </button>
      </div>
    </header>
  );
};
