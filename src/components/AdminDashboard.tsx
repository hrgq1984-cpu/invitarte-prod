import React, { useState } from 'react';
import { 
  ShieldCheck, 
  DollarSign, 
  CheckCircle2, 
  XCircle, 
  PauseCircle, 
  PlayCircle, 
  Trash2, 
  Download, 
  MessageSquare, 
  Image as ImageIcon, 
  Eye, 
  AlertTriangle,
  RotateCcw,
  Sliders,
  Settings,
  Mail,
  Phone,
  Globe,
  Lock,
  ExternalLink
} from 'lucide-react';
import { useStore } from '../lib/store';
import { PlanTier, ProjectStatus } from '../types';

export const AdminDashboard: React.FC = () => {
  const { 
    currentUser, 
    plans, 
    updatePlanPrice, 
    projects, 
    setSelectedProjectId, 
    adminSetProjectStatus, 
    payments, 
    confirmPaymentAdmin, 
    blessings, 
    moderateBlessing, 
    photos, 
    moderatePhoto,
    displaySettings,
    updateDisplaySettings,
    exportDatabaseJson,
    resetAllData
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'projects' | 'pricing' | 'payments' | 'moderation' | 'tv' | 'deployment' | 'backup'>('projects');
  
  // Price editing state
  const [editingPrices, setEditingPrices] = useState<Record<PlanTier, number>>({
    bronce: plans.find(p => p.id === 'bronce')?.price || 45000,
    plata: plans.find(p => p.id === 'plata')?.price || 52000,
    oro: plans.find(p => p.id === 'oro')?.price || 60000
  });
  const [priceSaved, setPriceSaved] = useState(false);

  const handleSavePrices = (e: React.FormEvent) => {
    e.preventDefault();
    updatePlanPrice('bronce', editingPrices.bronce);
    updatePlanPrice('plata', editingPrices.plata);
    updatePlanPrice('oro', editingPrices.oro);
    setPriceSaved(true);
    setTimeout(() => setPriceSaved(false), 2500);
  };

  const handleDownloadBackup = () => {
    const jsonStr = exportDatabaseJson();
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `tuinvitaciondigital-backup-${new Date().toISOString().slice(0, 10)}.json`;
    link.click();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* Top Admin Banner */}
      <div className="p-6 rounded-3xl bg-neutral-900 border border-neutral-800 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-xl">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 flex-shrink-0">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-400">
                Panel de Control de Super-Administrador
              </span>
              <span className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 text-[10px] font-mono">
                Root Admin
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-cinzel font-bold text-white mt-1">
              Administración Central TuInvitacionDigital
            </h1>
            <div className="flex flex-wrap items-center gap-4 text-xs text-neutral-400 mt-2 font-mono">
              <span className="flex items-center gap-1 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> hrgq.1984@gmail.com
              </span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp: +54 9 3835 438603
              </span>
            </div>
          </div>
        </div>

        {/* Action Button: Download JSON Backup */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleDownloadBackup}
            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-4 h-4 text-blue-400" />
            Descargar Respaldo JSON
          </button>
        </div>
      </div>

      {/* Admin Subtabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveAdminTab('projects')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'projects' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Proyectos & Publicaciones ({projects.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('pricing')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'pricing' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          Precios & Planes Comerciales
        </button>

        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'payments' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Pagos & Transacciones ({payments.length})
        </button>

        <button
          onClick={() => setActiveAdminTab('moderation')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'moderation' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <MessageSquare className="w-4 h-4" />
          Moderación de Mensajes & Fotos
        </button>

        <button
          onClick={() => setActiveAdminTab('tv')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'tv' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Sliders className="w-4 h-4" />
          Ajustes de Pantalla TV
        </button>

        <button
          onClick={() => setActiveAdminTab('deployment')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'deployment' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Globe className="w-4 h-4 text-emerald-400" />
          Publicación & Seguridad Netlify
        </button>
      </div>

      {/* 1. TAB PROJECTS & GLOBAL PUBLISHING CONTROL */}
      {activeAdminTab === 'projects' && (
        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <p className="text-neutral-400">
              Control de estado de proyectos. Solo el administrador general puede pausar o reabrir publicaciones globales.
            </p>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-montserrat">
                <thead className="bg-neutral-950 text-neutral-400 font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-3.5">ID / Slug</th>
                    <th className="p-3.5">Cliente</th>
                    <th className="p-3.5">Tipo & Plan</th>
                    <th className="p-3.5">Estado Actual</th>
                    <th className="p-3.5">Fecha Creación</th>
                    <th className="p-3.5 text-right">Acciones Administrativas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {projects.map((proj) => (
                    <tr key={proj.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3.5 font-bold font-mono text-white">/{proj.publicSlug}</td>
                      <td className="p-3.5 text-neutral-400">{proj.clientEmail}</td>
                      <td className="p-3.5">
                        <span className="capitalize">{proj.eventType}</span> • <span className="font-bold text-amber-400 uppercase">{proj.planId}</span>
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          proj.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          proj.status === 'preview_available' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                          proj.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {proj.status.replace('_', ' ')}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-500">{new Date(proj.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {proj.status !== 'published' ? (
                            <button
                              onClick={() => adminSetProjectStatus(proj.id, 'published')}
                              className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1"
                              title="Publicar Inmediatamente"
                            >
                              <PlayCircle className="w-3.5 h-3.5" />
                              Publicar
                            </button>
                          ) : (
                            <button
                              onClick={() => adminSetProjectStatus(proj.id, 'draft')}
                              className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold flex items-center gap-1"
                              title="Pausar Publicación"
                            >
                              <PauseCircle className="w-3.5 h-3.5" />
                              Pausar
                            </button>
                          )}
                          <button
                            onClick={() => setSelectedProjectId(proj.id)}
                            className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            Seleccionar
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 2. TAB PRICING EDITOR */}
      {activeAdminTab === 'pricing' && (
        <form onSubmit={handleSavePrices} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-xs max-w-xl">
          <div className="border-b border-neutral-800 pb-3">
            <h3 className="text-base font-cinzel font-bold text-white">Configuración de Precios de Planes</h3>
            <p className="text-neutral-400">
              Modifica los precios de referencia sin tener valores hardcodeados en el código.
            </p>
          </div>

          {priceSaved && (
            <div className="p-2.5 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center font-bold">
              ✓ ¡Nuevos precios de planes guardados y vigentes para todo el catálogo!
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Precio Plan Bronce ($ ARS)</label>
              <input
                type="number"
                step="1000"
                value={editingPrices.bronce}
                onChange={(e) => setEditingPrices({ ...editingPrices, bronce: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Precio Plan Plata ($ ARS)</label>
              <input
                type="number"
                step="1000"
                value={editingPrices.plata}
                onChange={(e) => setEditingPrices({ ...editingPrices, plata: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Precio Plan Oro ($ ARS)</label>
              <input
                type="number"
                step="1000"
                value={editingPrices.oro}
                onChange={(e) => setEditingPrices({ ...editingPrices, oro: parseInt(e.target.value, 10) || 0 })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold"
          >
            Actualizar Precios
          </button>
        </form>
      )}

      {/* 3. TAB PAYMENTS & CONFIRMATIONS */}
      {activeAdminTab === 'payments' && (
        <div className="space-y-4 text-xs">
          <p className="text-neutral-400">
            Registro de transacciones. Los pagos por transferencia requieren confirmación del administrador para iniciar la ventana de 24 horas.
          </p>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-montserrat">
                <thead className="bg-neutral-950 text-neutral-400 font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-3.5">ID Pago</th>
                    <th className="p-3.5">Proyecto</th>
                    <th className="p-3.5">Proveedor</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {payments.map((p) => (
                    <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                      <td className="p-3.5 font-mono text-white">{p.id}</td>
                      <td className="p-3.5 font-mono text-neutral-400">{p.projectId}</td>
                      <td className="p-3.5 uppercase font-semibold text-neutral-300">{p.provider}</td>
                      <td className="p-3.5 font-bold text-amber-300 font-mono">
                        ${p.amount.toLocaleString('es-AR')} {p.currency}
                      </td>
                      <td className="p-3.5">
                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                          p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                          p.status === 'review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                          'bg-neutral-800 text-neutral-400'
                        }`}>
                          {p.status}
                        </span>
                      </td>
                      <td className="p-3.5 text-neutral-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                      <td className="p-3.5 text-right">
                        {p.status !== 'completed' && (
                          <button
                            onClick={() => confirmPaymentAdmin(p.id)}
                            className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                          >
                            Confirmar Pago
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* 4. TAB MODERATION */}
      {activeAdminTab === 'moderation' && (
        <div className="space-y-6 text-xs">
          <div>
            <h3 className="text-base font-cinzel font-bold text-white mb-2">Muro de Deseos a Moderar</h3>
            <div className="space-y-2">
              {blessings.map((b) => (
                <div key={b.id} className="p-3.5 rounded-xl bg-neutral-900 border border-neutral-800 flex items-center justify-between gap-4">
                  <div>
                    <div className="font-bold text-white">{b.author}</div>
                    <div className="text-neutral-300 italic">"{b.message}"</div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      b.status === 'approved' ? 'bg-emerald-950 text-emerald-300' : 'bg-red-950 text-red-300'
                    }`}>
                      {b.status}
                    </span>
                    {b.status !== 'approved' ? (
                      <button
                        onClick={() => moderateBlessing(b.projectId, b.id, 'approved')}
                        className="p-1 text-emerald-400 hover:text-emerald-300"
                        title="Aprobar"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                      </button>
                    ) : (
                      <button
                        onClick={() => moderateBlessing(b.projectId, b.id, 'rejected')}
                        className="p-1 text-red-400 hover:text-red-300"
                        title="Rechazar"
                      >
                        <XCircle className="w-5 h-5" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 5. TAB TV SETTINGS */}
      {activeAdminTab === 'tv' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs max-w-lg">
          <h3 className="text-base font-cinzel font-bold text-white">Configuración Global Pantalla TV</h3>
          <p className="text-neutral-400">
            Control de velocidad y modo de rotación de diapositivas en la pantalla de bendiciones.
          </p>

          <div className="space-y-3 pt-2">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">
                Segundos por Diapositiva ({displaySettings.rotationSeconds} seg)
              </label>
              <input
                type="range"
                min="3"
                max="15"
                step="1"
                value={displaySettings.rotationSeconds}
                onChange={(e) => updateDisplaySettings(displaySettings.projectId, { rotationSeconds: parseInt(e.target.value, 10) })}
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-3 pt-2">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={displaySettings.showPhotos}
                  onChange={(e) => updateDisplaySettings(displaySettings.projectId, { showPhotos: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-700"
                />
                Mostrar Fotos en Pantalla TV
              </label>
            </div>

            <div className="flex items-center gap-3">
              <label className="flex items-center gap-2 cursor-pointer text-neutral-300">
                <input
                  type="checkbox"
                  checked={displaySettings.showBlessings}
                  onChange={(e) => updateDisplaySettings(displaySettings.projectId, { showBlessings: e.target.checked })}
                  className="rounded bg-neutral-950 border-neutral-700"
                />
                Mostrar Buenos Deseos en Pantalla TV
              </label>
            </div>
          </div>
        </div>
      )}

      {/* 6. TAB NETLIFY DEPLOYMENT & SECURITY */}
      {activeAdminTab === 'deployment' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-xs max-w-4xl shadow-xl">
          <div className="border-b border-neutral-800 pb-4">
            <div className="flex items-center gap-2 text-emerald-400 font-bold uppercase tracking-wider text-[11px]">
              <Globe className="w-4 h-4" />
              Arquitectura de Publicación en Netlify & Seguridad
            </div>
            <h3 className="text-xl font-cinzel font-bold text-white mt-1">
              Hosting de Web Pública y Panel Administrador
            </h3>
            <p className="text-neutral-400 mt-1">
              Guía técnica y mejores prácticas para mantener tu web pública y tu panel administrador en <span className="text-amber-300 font-mono">https://tuinvitaciondigital.netlify.app/</span> con máxima seguridad.
            </p>
          </div>

          {/* Current URL Box */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <div className="text-[10px] text-neutral-400 font-mono uppercase">URL Principal de Producción</div>
              <div className="text-sm sm:text-base font-bold text-amber-300 font-mono mt-0.5">
                https://tuinvitaciondigital.netlify.app/
              </div>
            </div>
            <a
              href="https://tuinvitaciondigital.netlify.app/"
              target="_blank"
              rel="noreferrer"
              className="px-3.5 py-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 text-xs font-semibold flex items-center gap-1.5 transition-colors self-start sm:self-center"
            >
              <ExternalLink className="w-3.5 h-3.5 text-blue-400" />
              <span>Abrir Sitio en Vivo</span>
            </a>
          </div>

          {/* Architecture comparison */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Option 1: Monorepo SPA (Current & Recommended for Cost/Simplicity) */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <span className="font-bold text-white">Opción 1: SPA Única Protegida (Recomendada)</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Tanto la web pública (catálogo, demos e invitaciones) como el administrador conviven en el mismo dominio de Netlify.
              </p>
              <ul className="list-disc pl-4 space-y-1 text-neutral-400 text-[11px]">
                <li><strong>Ventaja:</strong> Un solo despliegue, un solo dominio en Netlify, costo cero y sincronización instantánea.</li>
                <li><strong>Regla de oro:</strong> La seguridad <em>nunca</em> depende de "ocultar" la URL, sino de las <strong>reglas de Firestore (Backend)</strong> y el inicio de sesión con tu email autorizado (<code className="text-blue-300">hrgq.1984@gmail.com</code>).</li>
                <li>Aunque un usuario curioso descubra la ruta o intente modificar el JavaScript local, Firebase rechazará cualquier intento no autorizado de leer o escribir datos sensibles.</li>
              </ul>
            </div>

            {/* Option 2: Separate Subdomain */}
            <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-400" />
                <span className="font-bold text-white">Opción 2: Subdominio Separado (Empresarial)</span>
              </div>
              <p className="text-neutral-300 text-[11px] leading-relaxed">
                Separar en dos sitios de Netlify independientes:
              </p>
              <ul className="list-disc pl-4 space-y-1 text-neutral-400 text-[11px]">
                <li><code className="text-amber-300">tuinvitaciondigital.netlify.app</code> (Público)</li>
                <li><code className="text-blue-300">admin-tuinvitaciondigital.netlify.app</code> (Admin protegido con Netlify Identity o contraseña HTTP Basic)</li>
                <li><strong>Ventaja:</strong> El código del panel administrador no se envía a los navegadores del público general.</li>
                <li><strong>Desventaja:</strong> Requiere mantener 2 sitios en Netlify y coordinar compilaciones separadas.</li>
              </ul>
            </div>
          </div>

          {/* Checklist for Netlify */}
          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-3">
            <div className="font-bold text-white text-xs flex items-center gap-1.5">
              <Lock className="w-4 h-4 text-amber-400" />
              Medidas de Seguridad ya Incorporadas en tu Proyecto:
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-[11px] text-neutral-300">
              <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Enrutamiento SPA Limpio:</strong> Archivos <code className="text-amber-300">netlify.toml</code> y <code className="text-amber-300">_redirects</code> configurados para evitar errores 404 al recargar.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Cabeceras de Seguridad HTTP:</strong> Protección contra XSS, Clickjacking e inyección vía cabeceras CSP configuradas en Netlify.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Reglas de Firestore (ABAC):</strong> Solo <code className="text-amber-300">hrgq.1984@gmail.com</code> tiene privilegios de superadmin a nivel base de datos.
                </div>
              </div>
              <div className="flex items-start gap-2 bg-neutral-900/80 p-2.5 rounded-lg border border-neutral-800">
                <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                <div>
                  <strong>Garantía de 24 Horas:</strong> Las modificaciones del cliente se congelan tras la confirmación del pago para evitar fraudes en eventos en vivo.
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
