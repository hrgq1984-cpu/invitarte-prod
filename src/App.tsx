import React, { useState, useEffect } from 'react';
import { StoreProvider, useStore } from './lib/store';
import { Navbar } from './components/Navbar';
import { HeroCatalog } from './components/HeroCatalog';
import { MobileMockup } from './components/MobileMockup';
import { ClientDashboard } from './components/ClientDashboard';
import { AdminDashboard } from './components/AdminDashboard';
import { TvModeView } from './components/TvModeView';
import { CheckoutModal } from './components/CheckoutModal';
import { AuthModal } from './components/AuthModal';
import { TechDocsModal } from './components/TechDocsModal';
import { TestsRunnerModal } from './components/TestsRunnerModal';
import { UrlGuideModal } from './components/UrlGuideModal';
import { AdminLoginGate } from './components/AdminLoginGate';
import { ClientLoginGate } from './components/ClientLoginGate';
import { DesignTemplate, PlanTier } from './types';
import { 
  Sparkles, 
  Mail, 
  Phone, 
  Heart, 
  ShieldCheck, 
  Layers, 
  Github, 
  Cloud,
  FileCode2,
  Tv,
  Smartphone,
  ExternalLink
} from 'lucide-react';

function AppContent() {
  const { 
    currentUser,
    currentProject, 
    templates, 
    previewTemplate, 
    setSelectedProjectId 
  } = useStore();

  const [currentView, setCurrentView] = useState<'catalog' | 'demo' | 'client' | 'admin'>('catalog');
  const [demoTemplateId, setDemoTemplateId] = useState<string | null>(null);
  const [showTvMode, setShowTvMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  const [showUrlGuideModal, setShowUrlGuideModal] = useState(false);
  
  // Checkout Modal State
  const [checkoutTemplate, setCheckoutTemplate] = useState<DesignTemplate | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<PlanTier>('plata');

  // Check URL pathname and hash on load and back/forward navigation
  useEffect(() => {
    const handleUrlRoute = () => {
      const path = (window.location.pathname || '').toLowerCase();
      const hash = (window.location.hash || '').toLowerCase();

      // 1. URL Administrador: /Maximo1822
      if (path.includes('/maximo1822') || hash.includes('maximo1822')) {
        setCurrentView('admin');
        document.title = 'Administrador General (/Maximo1822) | TuInvitacionDigital';
      } 
      // 2. URL Cliente Registrado: /cliente
      else if (path.includes('/cliente') || hash.includes('cliente')) {
        setCurrentView('client');
        document.title = 'Panel de Cliente (/cliente) | TuInvitacionDigital';
      } 
      // 3. Demo / Invitación interactiva del celular
      else if (path.includes('/invitacion') || hash.includes('demo') || hash.includes('guest')) {
        setCurrentView('demo');
        document.title = 'Invitación Interactiva | TuInvitacionDigital';
      } 
      else if (hash.includes('tv')) {
        setShowTvMode(true);
      } 
      // 4. URL Visitante / Catálogo Público: /
      else {
        setCurrentView('catalog');
        document.title = 'TuInvitacionDigital | Invitaciones Digitales & Pantalla TV';
      }
    };

    handleUrlRoute();
    window.addEventListener('popstate', handleUrlRoute);
    window.addEventListener('hashchange', handleUrlRoute);
    return () => {
      window.removeEventListener('popstate', handleUrlRoute);
      window.removeEventListener('hashchange', handleUrlRoute);
    };
  }, []);

  const handleNavigate = (view: 'catalog' | 'demo' | 'client' | 'admin') => {
    setCurrentView(view);
    let targetPath = '/';
    if (view === 'admin') {
      targetPath = '/Maximo1822';
      document.title = 'Administrador General (/Maximo1822) | TuInvitacionDigital';
    } else if (view === 'client') {
      targetPath = '/cliente';
      document.title = 'Panel de Cliente (/cliente) | TuInvitacionDigital';
    } else if (view === 'demo') {
      targetPath = '/invitacion';
      document.title = 'Invitación Interactiva | TuInvitacionDigital';
    } else {
      targetPath = '/';
      document.title = 'TuInvitacionDigital | Invitaciones Digitales & Pantalla TV';
    }

    try {
      window.history.pushState({ view }, '', targetPath);
    } catch (e) {
      window.location.hash = targetPath;
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleOpenCheckout = (template: DesignTemplate, planId: PlanTier) => {
    setCheckoutTemplate(template);
    setCheckoutPlanId(planId);
  };

  const handleViewDemo = (template: DesignTemplate) => {
    previewTemplate(template);
    setDemoTemplateId(template.id);
    handleNavigate('demo');
  };

  const handleCheckoutSuccess = (newProjectId: string) => {
    setCheckoutTemplate(null);
    setSelectedProjectId(newProjectId);
    handleNavigate('client');
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 font-montserrat">
      
      {/* 1. TOP NAVIGATION */}
      <Navbar
        currentView={currentView}
        onNavigate={handleNavigate}
        onOpenTvMode={() => setShowTvMode(true)}
        onOpenAuth={() => setShowAuthModal(true)}
        onOpenDocs={() => setShowDocsModal(true)}
        onOpenTests={() => setShowTestsModal(true)}
      />

      {/* 2. MAIN VIEW SWITCHER */}
      <main className="flex-1">
        {currentView === 'catalog' && (
          <HeroCatalog
            onSelectTemplate={handleOpenCheckout}
            onViewDemo={handleViewDemo}
          />
        )}

        {currentView === 'demo' && (
          <MobileMockup
            initialTemplateId={demoTemplateId || currentProject.templateId}
            onBackToCatalog={() => {
              setCurrentView('catalog');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onSelectTemplateForOrder={handleOpenCheckout}
            onOpenTvMode={() => setShowTvMode(true)}
            onTemplateChange={(tmplId) => setDemoTemplateId(tmplId)}
          />
        )}

        {currentView === 'client' && (
          currentUser.role === 'client' || currentUser.role === 'admin' ? (
            <ClientDashboard />
          ) : (
            <ClientLoginGate
              onSuccess={() => {
                setCurrentView('client');
              }}
              onGoBack={() => handleNavigate('catalog')}
            />
          )
        )}

        {currentView === 'admin' && (
          currentUser.role === 'admin' ? (
            <AdminDashboard />
          ) : (
            <AdminLoginGate
              onSuccess={() => {
                setCurrentView('admin');
              }}
              onGoBack={() => handleNavigate('catalog')}
            />
          )
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-cinzel font-bold text-xs shadow-md">
                TID
              </div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                TuInvitacionDigital
              </span>
            </div>
            <p className="text-neutral-400 text-xs leading-relaxed">
              Plataforma comercial de invitaciones digitales interactivas para bodas, 15 años, cumpleaños y eventos sociales de alta categoría.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-amber-400">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Garantía de Revisión de 24 Horas Post-Pago</span>
            </div>
          </div>

          {/* Direct Contact & Admin Info */}
          <div className="space-y-2">
            <div className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Atención & Contacto Oficial
            </div>
            <ul className="space-y-2 text-xs text-neutral-300">
              <li>
                <a
                  href="https://wa.me/5493835438603?text=Hola%20TuInvitacionDigital,%20quisiera%20consultar%20por%20una%20invitaci%C3%B3n%20digital"
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-400 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  <span>WhatsApp: +54 9 3835 438603</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:hrgq.1984@gmail.com"
                  className="flex items-center gap-2 hover:text-amber-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  <span>Email: hrgq.1984@gmail.com</span>
                </a>
              </li>
              <li className="text-[11px] text-neutral-500 font-mono">
                Horario: Lunes a Sábados 9:00 a 20:00 hs (ART)
              </li>
            </ul>
          </div>

          {/* Quick Platform Links */}
          <div className="space-y-2">
            <div className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Navegación Rápida
            </div>
            <ul className="space-y-1.5 text-xs text-neutral-300">
              <li>
                <button
                  onClick={() => { setCurrentView('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Catálogo de 21 Diseños
                </button>
              </li>
              <li>
                <button
                  onClick={() => { setCurrentView('demo'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                  className="hover:text-amber-400 transition-colors"
                >
                  Simulador Celular con Sobre
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowTvMode(true)}
                  className="hover:text-purple-400 transition-colors flex items-center gap-1"
                >
                  <Tv className="w-3.5 h-3.5 text-purple-400" />
                  Pantalla TV de Recepción en Vivo
                </button>
              </li>
              <li>
                <button
                  onClick={() => setShowDocsModal(true)}
                  className="hover:text-blue-400 transition-colors flex items-center gap-1"
                >
                  <FileCode2 className="w-3.5 h-3.5 text-blue-400" />
                  Documentación Técnica & CI/CD
                </button>
              </li>
            </ul>
          </div>

          {/* Deployment Stack & Cloud Badge */}
          <div className="space-y-2">
            <div className="font-cinzel font-bold text-white uppercase tracking-wider text-xs">
              Infraestructura & Despliegue
            </div>
            <div className="p-3.5 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-2 text-[11px]">
              <div className="flex items-center gap-2 text-neutral-200">
                <Cloud className="w-4 h-4 text-amber-400" />
                <span>Backend: <strong>Firebase Firestore & Auth</strong></span>
              </div>
              <div className="flex items-center gap-2 text-neutral-200">
                <Github className="w-4 h-4 text-emerald-400" />
                <span>Hosting Frontend: <strong>Netlify CI/CD</strong></span>
              </div>
              <div className="text-[10px] text-neutral-500 border-t border-neutral-800 pt-2">
                Reglas de seguridad ABAC aplicadas según <code>firestore.rules</code>.
              </div>
            </div>
          </div>

        </div>

        <div className="max-w-7xl mx-auto pt-6 border-t border-neutral-800/60 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-neutral-500">
          <div>
            © {new Date().getFullYear()} TuInvitacionDigital. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 flex-wrap justify-center sm:justify-end">
            <button onClick={() => setShowUrlGuideModal(true)} className="text-amber-400 hover:text-amber-300 font-semibold transition-colors">
              URLs del Sistema
            </button>
            <span>•</span>
            <button onClick={() => setShowDocsModal(true)} className="hover:text-neutral-300 transition-colors">
              Documentación
            </button>
            <span>•</span>
            <button 
              onClick={() => handleNavigate('admin')} 
              className="text-neutral-500 hover:text-blue-400 transition-colors flex items-center gap-1"
              title="Acceso exclusivo para el Administrador General (/Maximo1822)"
            >
              <ShieldCheck className="w-3 h-3 text-blue-500/60" />
              <span>Admin (/Maximo1822)</span>
            </button>
          </div>
        </div>
      </footer>

      {/* 4. MODALS & POPUPS */}
      {showTvMode && (
        <TvModeView onClose={() => setShowTvMode(false)} />
      )}

      {checkoutTemplate && (
        <CheckoutModal
          template={checkoutTemplate}
          initialPlanId={checkoutPlanId}
          onClose={() => setCheckoutTemplate(null)}
          onSuccess={handleCheckoutSuccess}
        />
      )}

      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
        />
      )}

      {showDocsModal && (
        <TechDocsModal
          onClose={() => setShowDocsModal(false)}
        />
      )}

      {showTestsModal && (
        <TestsRunnerModal
          onClose={() => setShowTestsModal(false)}
        />
      )}

      <UrlGuideModal
        isOpen={showUrlGuideModal}
        onClose={() => setShowUrlGuideModal(false)}
        onNavigateTo={handleNavigate}
        currentView={currentView}
      />

    </div>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <AppContent />
    </StoreProvider>
  );
}
