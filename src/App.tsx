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
  const { currentProject, templates, updateEventSettings, setSelectedProjectId } = useStore();

  const [currentView, setCurrentView] = useState<'catalog' | 'demo' | 'client' | 'admin'>('catalog');
  const [showTvMode, setShowTvMode] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showDocsModal, setShowDocsModal] = useState(false);
  const [showTestsModal, setShowTestsModal] = useState(false);
  
  // Checkout Modal State
  const [checkoutTemplate, setCheckoutTemplate] = useState<DesignTemplate | null>(null);
  const [checkoutPlanId, setCheckoutPlanId] = useState<PlanTier>('plata');

  // Check URL hash on load (e.g. #demo, #guest=token, #admin)
  useEffect(() => {
    const handleHash = () => {
      const hash = window.location.hash;
      if (hash.includes('demo') || hash.includes('guest')) {
        setCurrentView('demo');
      } else if (hash.includes('admin')) {
        setCurrentView('admin');
      } else if (hash.includes('client')) {
        setCurrentView('client');
      } else if (hash.includes('tv')) {
        setShowTvMode(true);
      }
    };
    handleHash();
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const handleOpenCheckout = (template: DesignTemplate, planId: PlanTier) => {
    setCheckoutTemplate(template);
    setCheckoutPlanId(planId);
  };

  const handleViewDemo = (template: DesignTemplate) => {
    // Select this template in project
    updateEventSettings(currentProject.id, {
      title: template.name,
      initialPhrase: template.samplePhrase
    });
    setCurrentView('demo');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleCheckoutSuccess = (newProjectId: string) => {
    setCheckoutTemplate(null);
    setSelectedProjectId(newProjectId);
    setCurrentView('client');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0d0d11] text-neutral-100 flex flex-col selection:bg-amber-500 selection:text-neutral-950 font-montserrat">
      
      {/* 1. TOP NAVIGATION */}
      <Navbar
        currentView={currentView}
        onNavigate={(view) => {
          setCurrentView(view);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
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
            onOpenTvMode={() => setShowTvMode(true)}
          />
        )}

        {currentView === 'client' && (
          <ClientDashboard />
        )}

        {currentView === 'admin' && (
          <AdminDashboard />
        )}
      </main>

      {/* 3. FOOTER */}
      <footer className="border-t border-neutral-800/80 bg-neutral-950/90 py-12 px-4 sm:px-6 lg:px-8 mt-16 text-xs text-neutral-400">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand & Mission */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center text-neutral-950 font-cinzel font-bold text-sm shadow-md">
                IA
              </div>
              <span className="font-cinzel text-lg font-bold text-white tracking-wider">
                InvitArte
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
                  href="https://wa.me/5493835438603?text=Hola%20InvitArte,%20quisiera%20consultar%20por%20una%20invitaci%C3%B3n%20digital"
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
            © {new Date().getFullYear()} InvitArte. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4">
            <button onClick={() => setShowDocsModal(true)} className="hover:text-neutral-300 transition-colors">
              Guía de Mantenimiento
            </button>
            <span>•</span>
            <button onClick={() => setShowAuthModal(true)} className="hover:text-neutral-300 transition-colors">
              Acceso a la Cuenta
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
