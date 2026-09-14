import React, { useState } from 'react';
import { 
  Sparkles, 
  LayoutDashboard, 
  ShieldCheck, 
  Tv, 
  FileText, 
  Smartphone, 
  UserCheck, 
  CheckCircle2, 
  Volume2, 
  VolumeX, 
  User, 
  LogOut, 
  Lock,
  Link2,
  DollarSign
} from 'lucide-react';
import { useStore } from '../lib/store';
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
  onOpenUrlGuide?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ 
  activeTab, 
  setActiveTab,
  currentView,
  onNavigate,
  onOpenTvMode,
  onOpenAuth,
  onOpenDocs,
  onOpenTests,
  onOpenUrlGuide
}) => {
  const { 
    currentUser, 
    logout, 
    currentProject, 
    projects, 
    setSelectedProjectId, 
    currentEventSettings 
  } = useStore();

  const [isPlayingMusic, setIsPlayingMusic] = useState(false);

  const current = currentView || activeTab || 'catalog';
  const role = currentUser.role || 'guest';

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

  const handleLogout = () => {
    logout();
    handleNav('catalog');
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
                <span className={`text-[10px] font-semibold uppercase tracking-widest px-1.5 py-0.5 rounded border ${
                  role === 'admin' 
                    ? 'bg-blue-500/15 text-blue-300 border-blue-500/30' 
                    : role === 'client'
                    ? 'bg-amber-500/15 text-amber-300 border-amber-500/30'
                    : 'bg-neutral-800 text-neutral-400 border-neutral-700'
                }`}>
                  {role === 'admin' ? '🛡️ Admin' : role === 'client' ? 'Cliente' : 'Oficial'}
                </span>
              </div>
              <p className="text-[11px] text-neutral-400 font-montserrat hidden sm:block">
                Invitaciones Digitales & Pantalla TV
              </p>
            </div>
          </div>

          {/* Dynamic Navigation Links strictly filtered by role */}
          <nav className="hidden lg:flex items-center gap-1 font-montserrat">
            
            {/* 1. VISITOR ROLE LINKS (Default public state) */}
            {role === 'guest' && (
              <>
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
                  Catálogo de Diseños
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
                  id="nav-tab-pricing-scroll"
                  onClick={() => {
                    handleNav('catalog');
                    setTimeout(() => {
                      document.getElementById('planes-section')?.scrollIntoView({ behavior: 'smooth' });
                    }, 100);
                  }}
                  className="px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 text-neutral-300 hover:text-white hover:bg-neutral-800/60"
                >
                  <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
                  Planes & Tarifas
                </button>
              </>
            )}

            {/* 2. CLIENT ROLE LINKS */}
            {role === 'client' && (
              <>
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
                  Mi Panel de Evento
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
                  Ver Invitación
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
                  id="nav-tab-catalog"
                  onClick={() => handleNav('catalog')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    current === 'catalog' 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30 shadow-sm' 
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  Ver Catálogo
                </button>
              </>
            )}

            {/* 3. ADMIN ROLE LINKS (Only available when logged in as admin) */}
            {role === 'admin' && (
              <>
                <button
                  id="nav-tab-admin"
                  onClick={() => handleNav('admin')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    current === 'admin' 
                      ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-sm' 
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  Panel Admin General
                </button>

                <button
                  id="nav-tab-client-inspect"
                  onClick={() => handleNav('client')}
                  className={`px-3 py-2 rounded-lg text-xs font-medium transition-all flex items-center gap-1.5 ${
                    current === 'client' 
                      ? 'bg-amber-500/15 text-amber-300 border border-amber-500/30' 
                      : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
                  }`}
                >
                  <LayoutDashboard className="w-3.5 h-3.5 text-amber-400" />
                  Inspeccionar Cliente
                </button>

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
                  Catálogo
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
              </>
            )}

            {onOpenUrlGuide && (
              <button
                id="nav-tab-urls"
                onClick={onOpenUrlGuide}
                className="px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all flex items-center gap-1 text-amber-300/90 hover:text-amber-300 hover:bg-neutral-800/60"
                title="Información de URLs del sistema (/Maximo1822, /cliente, /)"
              >
                <Link2 className="w-3.5 h-3.5 text-amber-400" />
                <span className="text-[11px]">URLs</span>
              </button>
            )}

          </nav>

          {/* Right Area: Ambient Music + Role Badge / Actions */}
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

            {/* Active project selector for clients with multiple events or admin */}
            {(role === 'admin' || (role === 'client' && projects.length > 1)) && (
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

            {/* 1. VISITOR: Client Login Action */}
            {role === 'guest' && (
              <div className="flex items-center gap-2">
                <button
                  id="btn-nav-client-portal"
                  onClick={() => handleNav('client')}
                  className="px-3 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Acceso Clientes</span>
                </button>
              </div>
            )}

            {/* 2. CLIENT: Profile Badge & Logout */}
            {role === 'client' && (
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-amber-950/60 border border-amber-500/30 text-amber-300 text-xs font-medium">
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span className="truncate max-w-[120px]">{currentUser.displayName || 'Cliente'}</span>
                </div>
                <button
                  id="btn-logout-client"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500/50 hover:bg-red-950/20 text-xs flex items-center gap-1.5 transition-colors"
                  title="Cerrar sesión de cliente"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span className="hidden sm:inline">Salir</span>
                </button>
              </div>
            )}

            {/* 3. ADMIN: Super Admin Badge & Logout */}
            {role === 'admin' && (
              <div className="flex items-center gap-2">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-blue-950/80 border border-blue-500/40 text-blue-300 text-xs font-mono">
                  <ShieldCheck className="w-3.5 h-3.5 text-blue-400" />
                  <span className="hidden sm:inline font-bold">Horacio Gómez (Admin)</span>
                  <span className="sm:hidden font-bold">Admin</span>
                </div>
                <button
                  id="btn-logout-admin"
                  onClick={handleLogout}
                  className="px-2.5 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-neutral-300 hover:text-white hover:border-red-500/50 hover:bg-red-950/20 text-xs flex items-center gap-1.5 transition-colors"
                  title="Cerrar sesión de Administrador"
                >
                  <LogOut className="w-3.5 h-3.5 text-red-400" />
                  <span className="hidden sm:inline">Salir Admin</span>
                </button>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* Mobile navigation row strictly filtered by role */}
      <div className="lg:hidden flex items-center justify-around border-t border-neutral-800/80 bg-neutral-950 px-2 py-2 text-xs overflow-x-auto">
        {role === 'guest' && (
          <>
            <button
              onClick={() => handleNav('catalog')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${current === 'catalog' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Catálogo
            </button>
            <button
              onClick={() => handleNav('demo')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${current === 'demo' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Celular
            </button>
            <button
              onClick={() => handleNav('client')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-amber-300 font-semibold bg-amber-500/10 border border-amber-500/30"
            >
              <User className="w-3.5 h-3.5" /> Acceso Clientes
            </button>
          </>
        )}

        {role === 'client' && (
          <>
            <button
              onClick={() => handleNav('client')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${current === 'client' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Mi Panel
            </button>
            <button
              onClick={() => handleNav('demo')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${current === 'demo' ? 'text-amber-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
            >
              <Smartphone className="w-3.5 h-3.5" /> Invitación
            </button>
            <button
              onClick={() => handleNav('tv')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-purple-400 hover:bg-neutral-800"
            >
              <Tv className="w-3.5 h-3.5" /> TV
            </button>
            <button
              onClick={() => handleNav('catalog')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-neutral-400 hover:bg-neutral-800"
            >
              <Sparkles className="w-3.5 h-3.5" /> Catálogo
            </button>
            <button
              onClick={handleLogout}
              className="px-2 py-1.5 rounded-md flex items-center gap-1 text-red-400 hover:bg-neutral-800"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </>
        )}

        {role === 'admin' && (
          <>
            <button
              onClick={() => handleNav('admin')}
              className={`px-3 py-1.5 rounded-md flex items-center gap-1 ${current === 'admin' ? 'text-blue-400 font-bold bg-neutral-800' : 'text-neutral-400'}`}
            >
              <ShieldCheck className="w-3.5 h-3.5" /> Admin
            </button>
            <button
              onClick={() => handleNav('client')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-neutral-400 hover:bg-neutral-800"
            >
              <LayoutDashboard className="w-3.5 h-3.5" /> Cliente
            </button>
            <button
              onClick={() => handleNav('catalog')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-neutral-400 hover:bg-neutral-800"
            >
              <Sparkles className="w-3.5 h-3.5" /> Catálogo
            </button>
            <button
              onClick={() => handleNav('tests')}
              className="px-3 py-1.5 rounded-md flex items-center gap-1 text-emerald-400 hover:bg-neutral-800"
            >
              <CheckCircle2 className="w-3.5 h-3.5" /> Tests
            </button>
            <button
              onClick={handleLogout}
              className="px-2 py-1.5 rounded-md flex items-center gap-1 text-red-400 hover:bg-neutral-800"
            >
              <LogOut className="w-3.5 h-3.5" /> Salir
            </button>
          </>
        )}
      </div>
    </header>
  );
};
