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
  ExternalLink,
  Edit3,
  Search,
  Filter,
  Sparkles,
  Bell,
  Check,
  Clock,
  FileCheck,
  Inbox
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
    rejectPaymentAdmin,
    adminNotifications,
    unreadAdminNotificationsCount,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
    deleteAdminNotification,
    blessings, 
    moderateBlessing, 
    photos, 
    moderatePhoto,
    displaySettings,
    updateDisplaySettings,
    exportDatabaseJson,
    resetAllData,
    currentEventSettings,
    updateEventSettings
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'notifications' | 'projects' | 'pricing' | 'payments' | 'moderation' | 'tv' | 'deployment' | 'backup'>('notifications');
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // Projects tab filters & search
  const [projectSearch, setProjectSearch] = useState('');
  const [projectStatusFilter, setProjectStatusFilter] = useState<string>('all');
  const [projectSortOrder, setProjectSortOrder] = useState<'newest' | 'oldest' | 'name'>('newest');

  // Quick edit project / invitation modal state
  const [editingProjectId, setEditingProjectId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<{
    title: string;
    honoreeName: string;
    date: string;
    time: string;
    locationName: string;
    address: string;
    dressCode: string;
    initialPhrase: string;
  }>({
    title: '',
    honoreeName: '',
    date: '',
    time: '',
    locationName: '',
    address: '',
    dressCode: '',
    initialPhrase: ''
  });
  const [editSavedSuccess, setEditSavedSuccess] = useState(false);

  // Open edit modal for a specific project
  const handleOpenEditModal = (projectId: string) => {
    setSelectedProjectId(projectId);
    setEditingProjectId(projectId);
    setEditForm({
      title: currentEventSettings.title || '',
      honoreeName: currentEventSettings.honoreeName || '',
      date: currentEventSettings.date || '',
      time: currentEventSettings.time || '',
      locationName: currentEventSettings.locationName || '',
      address: currentEventSettings.address || '',
      dressCode: currentEventSettings.dressCode || '',
      initialPhrase: currentEventSettings.initialPhrase || ''
    });
    setEditSavedSuccess(false);
  };

  const handleSaveProjectEdits = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProjectId) return;
    updateEventSettings(editingProjectId, editForm);
    setEditSavedSuccess(true);
    setTimeout(() => {
      setEditSavedSuccess(false);
      setEditingProjectId(null);
    }, 1500);
  };
  
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
            <div className="flex flex-wrap items-center gap-3 text-xs text-neutral-400 mt-2 font-mono">
              <span className="flex items-center gap-1 text-neutral-300">
                <Mail className="w-3.5 h-3.5 text-blue-400" /> hrgq.1984@gmail.com
              </span>
              <span className="flex items-center gap-1 text-neutral-300">
                <Phone className="w-3.5 h-3.5 text-emerald-400" /> WhatsApp: +54 9 3835 438603
              </span>
              <span className="px-2.5 py-1 rounded-lg bg-blue-950/60 border border-blue-500/40 text-blue-300 text-[11px] flex items-center gap-1.5 font-sans">
                <span className="font-bold text-white">URL Secreta:</span>
                <span className="font-mono text-amber-300">/Maximo1822</span>
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
          onClick={() => setActiveAdminTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 relative ${
            activeAdminTab === 'notifications' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificaciones & Pedidos</span>
          {unreadAdminNotificationsCount > 0 && (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeAdminTab === 'notifications' ? 'bg-black text-amber-300' : 'bg-amber-500 text-black animate-pulse'
            }`}>
              {unreadAdminNotificationsCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('payments')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeAdminTab === 'payments' ? 'bg-blue-600 text-white' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          Pagos & Validar Comprobantes ({payments.length})
        </button>

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

      {/* 0. TAB NOTIFICATIONS: ALERTAS DE SERVICIOS CONTRATADOS & COMPROBANTES */}
      {activeAdminTab === 'notifications' && (
        <div className="space-y-4 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-base font-cinzel font-bold text-white flex items-center gap-2">
                <Bell className="w-5 h-5 text-amber-400" />
                Bandeja de Entrada de Servicios y Comprobantes
              </h2>
              <p className="text-neutral-400 mt-1">
                Recibe notificaciones automáticas en tiempo real cuando un cliente contrata una tarjeta o sube un comprobante de transferencia bancaria.
              </p>
            </div>
            {adminNotifications.length > 0 && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => markAllAdminNotificationsAsRead()}
                  className="px-3 py-1.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 font-medium transition-colors flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                  Marcar todas como leídas
                </button>
              </div>
            )}
          </div>

          {adminNotifications.length === 0 ? (
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center">
              <Inbox className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
              <p className="text-neutral-300 font-medium text-sm">No tienes notificaciones pendientes</p>
              <p className="text-neutral-500 text-xs mt-1">
                Cuando un nuevo cliente contrate un plan o registre un pago por transferencia, aparecerá aquí al instante.
              </p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {adminNotifications.map((notif) => {
                const targetProject = projects.find(p => p.id === notif.projectId);
                const targetPayment = payments.find(p => p.id === notif.paymentId || p.projectId === notif.projectId);

                return (
                  <div
                    key={notif.id}
                    className={`p-4 rounded-2xl border transition-all ${
                      !notif.read 
                        ? 'bg-amber-950/20 border-amber-500/40 shadow-sm' 
                        : 'bg-neutral-900/80 border-neutral-800/80 opacity-80'
                    }`}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start gap-3">
                        <div className={`p-2.5 rounded-xl flex-shrink-0 ${
                          notif.type === 'receipt_uploaded'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : notif.type === 'order_created'
                            ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30'
                            : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        }`}>
                          {notif.type === 'receipt_uploaded' ? (
                            <FileCheck className="w-5 h-5" />
                          ) : (
                            <Sparkles className="w-5 h-5" />
                          )}
                        </div>

                        <div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-bold text-white text-sm">{notif.title}</span>
                            {!notif.read && (
                              <span className="px-2 py-0.5 rounded-full bg-amber-500 text-neutral-950 font-extrabold text-[10px] uppercase tracking-wider">
                                Nueva
                              </span>
                            )}
                            <span className="text-[11px] text-neutral-500 flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(notif.createdAt).toLocaleDateString()} - {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                            </span>
                          </div>

                          <p className="text-neutral-300 mt-1 text-xs leading-relaxed max-w-3xl">
                            {notif.message}
                          </p>

                          {targetProject && (
                            <div className="mt-2 flex items-center gap-3 text-[11px] text-neutral-400 flex-wrap">
                              <span className="bg-neutral-800 px-2 py-0.5 rounded text-neutral-300 font-mono">
                                Slug: /{targetProject.publicSlug}
                              </span>
                              <span>Plan: <strong className="text-amber-300 font-bold uppercase">{targetProject.planId}</strong></span>
                              <span>Estado: <strong className="text-neutral-200">{targetProject.status}</strong></span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Notification Actions */}
                      <div className="flex items-center gap-2 self-end sm:self-center flex-shrink-0">
                        {targetPayment && (
                          <button
                            onClick={() => {
                              setSelectedReceiptPayment(targetPayment);
                              setActiveAdminTab('payments');
                              markAdminNotificationAsRead(notif.id);
                            }}
                            className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-sm"
                          >
                            <FileCheck className="w-3.5 h-3.5" />
                            Validar Comprobante
                          </button>
                        )}

                        {!notif.read ? (
                          <button
                            onClick={() => markAdminNotificationAsRead(notif.id)}
                            className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-400 hover:text-white transition-colors"
                            title="Marcar como leída"
                          >
                            <Check className="w-4 h-4" />
                          </button>
                        ) : null}

                        <button
                          onClick={() => deleteAdminNotification(notif.id)}
                          className="p-2 rounded-xl bg-neutral-850 hover:bg-red-950/40 text-neutral-500 hover:text-red-400 transition-colors"
                          title="Eliminar notificación"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* 1. TAB PROJECTS & GLOBAL PUBLISHING CONTROL */}
      {activeAdminTab === 'projects' && (() => {
        // Filter and sort projects
        const filteredProjects = projects
          .filter(proj => {
            const matchesSearch = 
              proj.publicSlug.toLowerCase().includes(projectSearch.toLowerCase()) ||
              proj.clientEmail.toLowerCase().includes(projectSearch.toLowerCase()) ||
              proj.eventType.toLowerCase().includes(projectSearch.toLowerCase()) ||
              proj.planId.toLowerCase().includes(projectSearch.toLowerCase());
            
            const matchesStatus = projectStatusFilter === 'all' || proj.status === projectStatusFilter;
            return matchesSearch && matchesStatus;
          })
          .sort((a, b) => {
            if (projectSortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            if (projectSortOrder === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            if (projectSortOrder === 'name') return a.publicSlug.localeCompare(b.publicSlug);
            return 0;
          });

        const approvedCount = projects.filter(p => p.status === 'published' || p.status === 'approved').length;

        return (
          <div className="space-y-4 text-xs">
            {/* Header & Stats bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <Settings className="w-4 h-4 text-amber-400" />
                  Control General de Invitaciones & Proyectos
                </h3>
                <p className="text-neutral-400 text-[11px] mt-0.5">
                  Gestiona, ordena, publica/pausa y modifica cualquier detalle de las invitaciones aprobadas o en curso.
                </p>
              </div>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-bold text-xs flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  {approvedCount} Aprobadas / Activas
                </span>
                <span className="px-3 py-1.5 rounded-xl bg-neutral-800 text-neutral-300 font-bold text-xs">
                  Total: {projects.length}
                </span>
              </div>
            </div>

            {/* Filter and Search Controls */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
              {/* Search */}
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por slug, email, tipo..."
                  value={projectSearch}
                  onChange={(e) => setProjectSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              {/* Status Filter */}
              <div className="relative">
                <Filter className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <select
                  value={projectStatusFilter}
                  onChange={(e) => setProjectStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todos los Estados ({projects.length})</option>
                  <option value="published">Aprobadas / Publicadas ({projects.filter(p => p.status === 'published').length})</option>
                  <option value="preview_available">En Vista Previa / Esperando OK ({projects.filter(p => p.status === 'preview_available').length})</option>
                  <option value="pending_payment">Pendiente de Pago ({projects.filter(p => p.status === 'pending_payment').length})</option>
                  <option value="draft">Borrador / Pausadas ({projects.filter(p => p.status === 'draft').length})</option>
                </select>
              </div>

              {/* Sort Order */}
              <div className="flex items-center gap-2">
                <select
                  value={projectSortOrder}
                  onChange={(e) => setProjectSortOrder(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="newest">Más recientes primero</option>
                  <option value="oldest">Más antiguas primero</option>
                  <option value="name">Ordenar por Nombre / Slug</option>
                </select>
              </div>
            </div>

            {/* Quick Edit Modal if open */}
            {editingProjectId && (
              <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
                <div className="bg-neutral-900 border border-neutral-700 rounded-3xl p-6 max-w-lg w-full shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
                  <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
                    <div className="flex items-center gap-2">
                      <Edit3 className="w-5 h-5 text-amber-400" />
                      <h4 className="text-base font-cinzel font-bold text-white">
                        Modificar Invitación
                      </h4>
                    </div>
                    <button
                      onClick={() => setEditingProjectId(null)}
                      className="p-1 rounded-lg hover:bg-neutral-800 text-neutral-400 hover:text-white"
                    >
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>

                  {editSavedSuccess && (
                    <div className="p-3 bg-emerald-500/20 border border-emerald-500/40 rounded-xl text-emerald-300 text-xs font-semibold flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4" />
                      ¡Cambios guardados y aplicados a la invitación correctamente!
                    </div>
                  )}

                  <form onSubmit={handleSaveProjectEdits} className="space-y-3">
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Título del Evento</label>
                        <input
                          type="text"
                          value={editForm.title}
                          onChange={e => setEditForm(prev => ({ ...prev, title: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                          placeholder="Ej: Nuestra Boda"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Nombre Festejado/s</label>
                        <input
                          type="text"
                          value={editForm.honoreeName}
                          onChange={e => setEditForm(prev => ({ ...prev, honoreeName: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                          placeholder="Ej: Sofía & Lucas"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Fecha</label>
                        <input
                          type="date"
                          value={editForm.date}
                          onChange={e => setEditForm(prev => ({ ...prev, date: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Horario</label>
                        <input
                          type="text"
                          value={editForm.time}
                          onChange={e => setEditForm(prev => ({ ...prev, time: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                          placeholder="20:30 hs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Lugar / Salón</label>
                        <input
                          type="text"
                          value={editForm.locationName}
                          onChange={e => setEditForm(prev => ({ ...prev, locationName: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                          placeholder="Palacio Duhau"
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Dirección</label>
                        <input
                          type="text"
                          value={editForm.address}
                          onChange={e => setEditForm(prev => ({ ...prev, address: e.target.value }))}
                          className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                          placeholder="Av. Alvear 1661, Recoleta"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Dress Code</label>
                      <input
                        type="text"
                        value={editForm.dressCode}
                        onChange={e => setEditForm(prev => ({ ...prev, dressCode: e.target.value }))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                        placeholder="Elegante / Black Tie"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-neutral-400 mb-1">Frase de Bienvenida / Portada</label>
                      <textarea
                        rows={2}
                        value={editForm.initialPhrase}
                        onChange={e => setEditForm(prev => ({ ...prev, initialPhrase: e.target.value }))}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white text-xs"
                        placeholder="El amor no se mira, se siente..."
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
                      <button
                        type="button"
                        onClick={() => setEditingProjectId(null)}
                        className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300 font-semibold text-xs hover:bg-neutral-700"
                      >
                        Cancelar
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        Guardar Cambios
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}

            {/* Table of projects */}
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
                      <th className="p-3.5 text-right">Acciones de Control & Edición</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-800 text-neutral-300">
                    {filteredProjects.length === 0 ? (
                      <tr>
                        <td colSpan={6} className="p-8 text-center text-neutral-500">
                          No se encontraron invitaciones con los filtros seleccionados.
                        </td>
                      </tr>
                    ) : (
                      filteredProjects.map((proj) => (
                        <tr key={proj.id} className="hover:bg-neutral-800/40 transition-colors">
                          <td className="p-3.5 font-bold font-mono text-white">
                            <div className="flex items-center gap-1.5">
                              <span>/{proj.publicSlug}</span>
                              {proj.status === 'published' && (
                                <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Activa y pública" />
                              )}
                            </div>
                          </td>
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
                              {proj.status === 'published' ? 'Aprobada / Online' : proj.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="p-3.5 text-neutral-500">{new Date(proj.createdAt).toLocaleDateString()}</td>
                          <td className="p-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              {/* Quick Edit */}
                              <button
                                onClick={() => handleOpenEditModal(proj.id)}
                                className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 font-semibold flex items-center gap-1 transition-colors"
                                title="Editar datos del evento (fecha, lugar, textos)"
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                Modificar
                              </button>

                              {/* Publish / Pause */}
                              {proj.status !== 'published' ? (
                                <button
                                  onClick={() => adminSetProjectStatus(proj.id, 'published')}
                                  className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-colors"
                                  title="Aprobar y Publicar Inmediatamente"
                                >
                                  <PlayCircle className="w-3.5 h-3.5" />
                                  Publicar
                                </button>
                              ) : (
                                <button
                                  onClick={() => adminSetProjectStatus(proj.id, 'draft')}
                                  className="px-2.5 py-1 rounded-lg bg-amber-700 hover:bg-amber-600 text-white font-bold flex items-center gap-1 transition-colors"
                                  title="Pausar Publicación"
                                >
                                  <PauseCircle className="w-3.5 h-3.5" />
                                  Pausar
                                </button>
                              )}

                              {/* Select & View */}
                              <button
                                onClick={() => setSelectedProjectId(proj.id)}
                                className="px-2.5 py-1 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 flex items-center gap-1 transition-colors"
                                title="Ver en simulador y editar en detalle"
                              >
                                <Eye className="w-3.5 h-3.5" />
                                Ver
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        );
      })()}

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
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-neutral-900 border border-neutral-800 p-4 rounded-2xl">
            <div>
              <h2 className="text-base font-cinzel font-bold text-white flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                Validación de Pagos y Comprobantes Bancarios
              </h2>
              <p className="text-neutral-400 mt-1">
                Verifica transferencias bancarias manuales. Al validar un comprobante, el proyecto del cliente pasa a <strong>Vista Previa Activa (24 horas)</strong> para su revisión final.
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span className="px-3 py-1.5 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 font-medium">
                Pendientes de validación: <strong>{payments.filter(p => p.status === 'review').length}</strong>
              </span>
            </div>
          </div>

          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-montserrat">
                <thead className="bg-neutral-950 text-neutral-400 font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-3.5">ID Pago</th>
                    <th className="p-3.5">Proyecto / Cliente</th>
                    <th className="p-3.5">Método / Comprobante</th>
                    <th className="p-3.5">Monto</th>
                    <th className="p-3.5">Estado</th>
                    <th className="p-3.5">Fecha</th>
                    <th className="p-3.5 text-right">Validación</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {payments.map((p) => {
                    const relatedProject = projects.find(prj => prj.id === p.projectId);
                    return (
                      <tr key={p.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3.5 font-mono text-white">{p.id}</td>
                        <td className="p-3.5">
                          <div className="font-semibold text-white">
                            {relatedProject ? `/${relatedProject.publicSlug}` : p.projectId}
                          </div>
                          <div className="text-[11px] text-neutral-400">
                            {relatedProject?.clientEmail || 'Sin email'}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-medium text-neutral-200">
                            {p.provider === 'transfer' ? 'Transferencia Bancaria' : p.provider}
                          </div>
                          {p.receiptUrl ? (
                            <button
                              onClick={() => setSelectedReceiptPayment(p)}
                              className="inline-flex items-center gap-1 text-[11px] text-amber-400 hover:text-amber-300 font-semibold underline mt-1"
                            >
                              <FileCheck className="w-3.5 h-3.5" />
                              Revisar Comprobante
                            </button>
                          ) : (
                            <span className="text-[10px] text-neutral-500 italic block mt-0.5">
                              Sin comprobante adjunto
                            </span>
                          )}
                          {p.receiptNotes && (
                            <div className="text-[10px] text-red-400 mt-1 max-w-xs">
                              Motivo: {p.receiptNotes}
                            </div>
                          )}
                        </td>
                        <td className="p-3.5 font-bold text-amber-300 font-mono text-sm">
                          ${p.amount.toLocaleString('es-AR')} {p.currency}
                        </td>
                        <td className="p-3.5">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-block ${
                            p.status === 'completed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            p.status === 'review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30 animate-pulse' :
                            p.status === 'failed' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            'bg-neutral-800 text-neutral-400'
                          }`}>
                            {p.status === 'review' ? 'En Revisión' : p.status === 'completed' ? 'Aprobado' : p.status === 'failed' ? 'Rechazado' : p.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            {p.receiptUrl && (
                              <button
                                onClick={() => setSelectedReceiptPayment(p)}
                                className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white font-medium text-[11px] transition-colors"
                              >
                                Ver
                              </button>
                            )}

                            {p.status !== 'completed' && (
                              <>
                                <button
                                  onClick={() => confirmPaymentAdmin(p.id)}
                                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[11px] shadow-sm transition-colors flex items-center gap-1"
                                >
                                  <Check className="w-3.5 h-3.5" />
                                  Aprobar
                                </button>
                                <button
                                  onClick={() => {
                                    setSelectedReceiptPayment(p);
                                    setShowRejectModal(true);
                                    setRejectReason('');
                                  }}
                                  className="px-2.5 py-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/40 text-neutral-400 hover:text-red-400 font-medium text-[11px] transition-colors"
                                >
                                  Rechazar
                                </button>
                              </>
                            )}

                            {p.status === 'completed' && (
                              <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1 justify-end">
                                <CheckCircle2 className="w-3.5 h-3.5" />
                                Verificado
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
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

      {/* Modal: Visualizar y Validar Comprobante */}
      {selectedReceiptPayment && !showRejectModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <FileCheck className="w-5 h-5 text-amber-400" />
                <h3 className="font-cinzel font-bold text-white text-base">Revisión de Comprobante Bancario</h3>
              </div>
              <button
                onClick={() => setSelectedReceiptPayment(null)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <XCircle className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3 bg-neutral-950 p-3 rounded-xl border border-neutral-800">
                <div>
                  <span className="text-neutral-500 block text-[10px]">ID Transacción</span>
                  <span className="font-mono text-white font-semibold">{selectedReceiptPayment.id}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Monto del Plan</span>
                  <span className="font-mono text-amber-300 font-bold text-sm">
                    ${selectedReceiptPayment.amount.toLocaleString('es-AR')} {selectedReceiptPayment.currency}
                  </span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Proyecto</span>
                  <span className="text-white font-mono">{selectedReceiptPayment.projectId}</span>
                </div>
                <div>
                  <span className="text-neutral-500 block text-[10px]">Estado Actual</span>
                  <span className="font-bold text-amber-400 uppercase">{selectedReceiptPayment.status}</span>
                </div>
              </div>

              {/* Preview or Link of Receipt */}
              <div className="bg-neutral-950 p-3 rounded-xl border border-neutral-800 flex flex-col items-center justify-center min-h-[160px] text-center">
                {selectedReceiptPayment.receiptUrl ? (
                  <div className="space-y-3 w-full">
                    <img 
                      src={selectedReceiptPayment.receiptUrl} 
                      alt="Comprobante de Pago" 
                      className="max-h-64 mx-auto rounded-lg border border-neutral-700 object-contain"
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        // Fallback if image fails to load inline
                        (e.target as HTMLElement).style.display = 'none';
                      }}
                    />
                    <a
                      href={selectedReceiptPayment.receiptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-semibold transition-colors"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Abrir Comprobante Original en Nueva Pestaña
                    </a>
                  </div>
                ) : (
                  <div className="text-neutral-500 italic py-4">
                    El cliente no adjuntó imagen directa. Verifique la acreditación en su cuenta bancaria de destino.
                  </div>
                )}
              </div>

              <p className="text-neutral-400 text-[11px] leading-relaxed">
                Al <strong>Aprobar y Confirmar</strong>, se activa la ventana de 24 horas del cliente y su tarjeta pasa al estado de vista previa interactiva.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  setShowRejectModal(true);
                  setRejectReason('');
                }}
                className="px-4 py-2 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-semibold transition-colors"
              >
                Rechazar Comprobante
              </button>

              <button
                onClick={() => {
                  confirmPaymentAdmin(selectedReceiptPayment.id);
                  setSelectedReceiptPayment(null);
                }}
                className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors shadow-sm flex items-center gap-1.5"
              >
                <Check className="w-4 h-4" />
                Aprobar y Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal: Rechazar Comprobante con Motivo */}
      {showRejectModal && selectedReceiptPayment && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-neutral-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 space-y-4 shadow-2xl">
            <div className="flex items-center gap-2 text-red-400 border-b border-neutral-800 pb-3">
              <AlertTriangle className="w-5 h-5" />
              <h3 className="font-cinzel font-bold text-white text-base">Rechazar Comprobante de Transferencia</h3>
            </div>

            <div className="space-y-3 text-xs">
              <p className="text-neutral-300">
                Indique al cliente el motivo por el cual el comprobante no fue admitido (ej: monto incorrecto, transferencia no impactada o imagen ilegible).
              </p>

              <div>
                <label className="block text-neutral-400 text-[11px] mb-1 font-medium">Motivo del Rechazo:</label>
                <textarea
                  rows={3}
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Ej: El importe transferido no coincide con el total del plan, o el número de transacción no fue encontrado en la cuenta bancaria."
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white placeholder-neutral-500 focus:outline-none focus:border-red-500 text-xs"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-neutral-800">
              <button
                onClick={() => {
                  setShowRejectModal(false);
                }}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-medium"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  rejectPaymentAdmin(selectedReceiptPayment.id, rejectReason || undefined);
                  setShowRejectModal(false);
                  setSelectedReceiptPayment(null);
                }}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-sm"
              >
                Confirmar Rechazo
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
