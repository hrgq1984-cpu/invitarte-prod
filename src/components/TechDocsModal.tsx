import React, { useState } from 'react';
import { 
  X, 
  BookOpen, 
  Code, 
  ShieldCheck, 
  Cloud, 
  Terminal, 
  CheckCircle, 
  Layers, 
  Github, 
  FileText
} from 'lucide-react';

interface TechDocsModalProps {
  onClose: () => void;
}

export const TechDocsModal: React.FC<TechDocsModalProps> = ({ onClose }) => {
  const [activeSection, setActiveSection] = useState<'overview' | 'backend' | 'netlify' | 'security' | 'testing'>('overview');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in font-montserrat">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-4xl w-full p-6 sm:p-8 space-y-6 text-xs text-neutral-300 relative shadow-2xl my-8 max-h-[90vh] flex flex-col">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="flex items-center gap-3 border-b border-neutral-800 pb-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
              Documentación Técnica de la Plataforma InvitArte
            </h2>
            <p className="text-neutral-400 text-xs">
              Arquitectura de software, integración continua en Netlify, backend en Firebase y directrices de mantenimiento.
            </p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
          <button
            onClick={() => setActiveSection('overview')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeSection === 'overview' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Layers className="w-4 h-4" />
            Visión General & Stack
          </button>

          <button
            onClick={() => setActiveSection('backend')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeSection === 'backend' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Cloud className="w-4 h-4" />
            Firebase Backend & Reglas
          </button>

          <button
            onClick={() => setActiveSection('netlify')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeSection === 'netlify' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Github className="w-4 h-4" />
            Netlify & CI/CD
          </button>

          <button
            onClick={() => setActiveSection('security')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeSection === 'security' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            Seguridad & ABAC
          </button>

          <button
            onClick={() => setActiveSection('testing')}
            className={`px-3.5 py-1.5 rounded-xl flex items-center gap-1.5 transition-colors ${
              activeSection === 'testing' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-400 hover:text-white'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Pruebas Automatizadas
          </button>
        </div>

        {/* Tab Contents */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4">
          {activeSection === 'overview' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                1. Arquitectura del Sistema
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                InvitArte está construida bajo una arquitectura orientada a componentes modulares de alto rendimiento con renderizado del lado del cliente y sincronización asíncrona a bases de datos NoSQL:
              </p>
              <ul className="list-disc pl-5 space-y-1.5 text-neutral-300">
                <li><strong>Frontend:</strong> React 18 con TypeScript y Vite. Modularizado en componentes (`InvitationView`, `MobileMockup`, `HeroCatalog`, `ClientDashboard`, `AdminDashboard`, `TvModeView`).</li>
                <li><strong>Estilizado:</strong> Tailwind CSS con tipografías Google Fonts (`Cinzel`, `Montserrat`, `Pinyon Script`, `Playfair Display`).</li>
                <li><strong>Música & Audio:</strong> Motor de síntesis armónica en Web Audio API (`audioSynth.ts`) y reproducción HTML5 con desbloqueo interactivo.</li>
                <li><strong>Almacenamiento Local & Reactivo:</strong> `StoreProvider` con sincronización a `localStorage` para continuidad de sesión sin fallas de red, listo para acoplarse directamente a Firestore.</li>
              </ul>
            </div>
          )}

          {activeSection === 'backend' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                2. Backend en Firebase (Firestore & Auth)
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                El modelo relacional documental está tipificado en <code className="text-amber-300">firebase-blueprint.json</code> y cuenta con esquemas definidos para:
              </p>
              <div className="bg-neutral-950 p-4 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300 space-y-1">
                <div>/users/{'{userId}'} - Perfiles y roles (admin | client)</div>
                <div>/plans/{'{planId}'} - Precios dinámicos ($45k, $52k, $60k)</div>
                <div>/templates/{'{templateId}'} - Catálogo de 21 diseños</div>
                <div>/projects/{'{projectId}'} - Invitaciones con estados de publicación</div>
                <div>/projects/{'{projectId}'}/guests/{'{guestId}'} - Control de cupos y tokens</div>
                <div>/projects/{'{projectId}'}/photos/{'{photoId}'} - Recuerdos subidos</div>
                <div>/projects/{'{projectId}'}/blessings/{'{blessingId}'} - Mensajes moderados</div>
                <div>/projects/{'{projectId}'}/payments/{'{paymentId}'} - Transacciones auditadas</div>
              </div>
              <p className="text-neutral-400 text-[11px]">
                Comando para desplegar reglas: <code className="text-amber-300 bg-neutral-950 px-1.5 py-0.5 rounded">firebase deploy --only firestore:rules</code>
              </p>
            </div>
          )}

          {activeSection === 'netlify' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                3. Despliegue en Netlify & GitHub CI/CD
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                El proyecto incluye los archivos <code className="text-amber-300">netlify.toml</code> y <code className="text-amber-300">public/_redirects</code> que garantizan que el enrutamiento de la SPA funcione perfectamente en refrescos de página sin arrojar 404:
              </p>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-neutral-300">
                /* /index.html 200
              </div>
              <p className="text-neutral-300">
                Para vincular con GitHub y Netlify:
              </p>
              <ol className="list-decimal pl-5 space-y-1 text-neutral-400">
                <li>Crear repositorio en GitHub y hacer push del código.</li>
                <li>Importar el proyecto en Netlify (<span className="text-white">Build command: `npm run build`</span>, <span className="text-white">Publish directory: `dist`</span>).</li>
                <li>Configurar las variables de entorno en el panel de Netlify (VITE_FIREBASE_API_KEY, etc.).</li>
                <li>Cada <code className="text-amber-300">git push</code> a la rama `main` disparará automáticamente una compilación y despliegue continuo.</li>
              </ol>
            </div>
          )}

          {activeSection === 'security' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                4. Seguridad, Roles & Control de Acceso (ABAC)
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                Las políticas de seguridad implementadas en <code className="text-amber-300">firestore.rules</code> aplican el principio de mínimo privilegio:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                <li><strong>Super Administrador (`hrgq.1984@gmail.com`):</strong> Acceso total para pausar/reabrir publicaciones globales, fijar precios de planes y moderar contenido.</li>
                <li><strong>Propietario del Proyecto (Cliente):</strong> Solo puede editar datos, fotos e invitados del proyecto que le pertenece (`request.auth.uid == resource.data.clientId`).</li>
                <li><strong>Invitados Públicos:</strong> Acceso de solo lectura a la invitación mediante token único; solo pueden enviar su RSVP y fotos en estado pendiente de moderación.</li>
                <li><strong>Ventana de 24 Horas:</strong> Protege la integridad del contenido una vez confirmado el pago para prevenir cambios durante la entrega.</li>
              </ul>
            </div>
          )}

          {activeSection === 'testing' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider text-amber-400">
                5. Suite de Pruebas Automatizadas
              </h3>
              <p className="text-neutral-300 leading-relaxed">
                El sistema cuenta con pruebas unitarias y de integración preparadas en Vitest para validar:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-neutral-300">
                <li>Cálculo de cupos y confirmación de invitados (`adultsMax`, `childrenMax`).</li>
                <li>Sintetizador Web Audio sin fugas de contexto.</li>
                <li>Cumplimiento de límites por plan (Plata 7 fotos, Oro 15 fotos).</li>
                <li>Flujo de 24 horas y transiciones de estado de proyectos.</li>
              </ul>
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 font-mono text-[11px] text-amber-300">
                npm run test (o npx vitest run)
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-neutral-800 pt-4 flex items-center justify-between text-xs">
          <div className="text-neutral-500 font-mono">
            Versión 1.0.0-PROD • InvitArte Platform
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
          >
            Entendido
          </button>
        </div>

      </div>
    </div>
  );
};
