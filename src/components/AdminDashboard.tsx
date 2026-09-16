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
  Inbox,
  ShoppingBag,
  RefreshCw,
  Plus,
  Zap,
  X
} from 'lucide-react';
import { useStore } from '../lib/store';
import { PlanTier, ProjectStatus, EventType } from '../types';

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
    confirmOrderAdmin,
    rejectPaymentAdmin,
    adminNotifications,
    unreadAdminNotificationsCount,
    markAdminNotificationAsRead,
    markAllAdminNotificationsAsRead,
    deleteAdminNotification,
    deleteProject,
    deleteOrder,
    simulateTestOrder,
    createOrder,
    blessings, 
    moderateBlessing, 
    photos, 
    moderatePhoto,
    displaySettings,
    updateDisplaySettings,
    exportDatabaseJson,
    resetAllData,
    reloadFromStorage,
    currentEventSettings,
    updateEventSettings,
    templates
  } = useStore();

  const [activeAdminTab, setActiveAdminTab] = useState<'orders' | 'notifications' | 'projects' | 'pricing' | 'payments' | 'moderation' | 'tv' | 'deployment' | 'backup'>('orders');
  const [selectedReceiptPayment, setSelectedReceiptPayment] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  
  // Deletion state
  const [orderToDelete, setOrderToDelete] = useState<{ id: string; name: string; isProjectOnly?: boolean } | null>(null);
  const [deleteSuccessMessage, setDeleteSuccessMessage] = useState<string | null>(null);

  // Instant Test Order Simulation state
  const [testOrderNotice, setTestOrderNotice] = useState<string | null>(null);

  // Manual Order Modal state
  const [showManualOrderModal, setShowManualOrderModal] = useState(false);
  const [manualOrderForm, setManualOrderForm] = useState<{
    eventType: EventType;
    templateId: string;
    planId: PlanTier;
    clientEmail: string;
    honoreeName: string;
    clientPhone: string;
    eventDate: string;
    paymentMethod: 'transfer' | 'mercadopago';
    receiptUrl: string;
  }>({
    eventType: 'boda',
    templateId: 'boda-elegante',
    planId: 'oro',
    clientEmail: '',
    honoreeName: '',
    clientPhone: '',
    eventDate: '2026-11-20',
    paymentMethod: 'transfer',
    receiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?w=900&auto=format&fit=crop&q=80'
  });

  const handleSimulateTestOrder = () => {
    const newOrd = simulateTestOrder();
    setTestOrderNotice(`¡Pedido #${newOrd.orderNumber || newOrd.id} creado con éxito para ${newOrd.honoreeName}!`);
    setTimeout(() => setTestOrderNotice(null), 4000);
  };

  const handleConfirmDeleteOrder = () => {
    if (!orderToDelete) return;
    deleteProject(orderToDelete.id);
    const targetName = orderToDelete.name;
    setOrderToDelete(null);
    setDeleteSuccessMessage(`Pedido "${targetName}" eliminado con éxito.`);
    setTimeout(() => setDeleteSuccessMessage(null), 3000);
  };

  const handleCreateManualOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualOrderForm.honoreeName || !manualOrderForm.clientEmail) return;
    const newOrd = createOrder({
      eventType: manualOrderForm.eventType,
      templateId: manualOrderForm.templateId,
      planId: manualOrderForm.planId,
      clientEmail: manualOrderForm.clientEmail,
      honoreeName: manualOrderForm.honoreeName,
      clientPhone: manualOrderForm.clientPhone,
      eventDate: manualOrderForm.eventDate,
      paymentMethod: manualOrderForm.paymentMethod,
      receiptUrl: manualOrderForm.receiptUrl
    });
    setShowManualOrderModal(false);
    setTestOrderNotice(`¡Pedido #${newOrd.orderNumber} registrado y visualizado en pantalla!`);
    setTimeout(() => setTestOrderNotice(null), 4000);
  };

  // Orders tab filters & search
  const [orderSearch, setOrderSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');
  const [orderSortOrder, setOrderSortOrder] = useState<'newest' | 'oldest'>('newest');
  const [refreshFeedback, setRefreshFeedback] = useState(false);

  const handleManualRefresh = () => {
    reloadFromStorage();
    setRefreshFeedback(true);
    setTimeout(() => setRefreshFeedback(false), 2000);
  };

  const pendingOrdersCount = projects.filter(p => p.status === 'payment_review' || p.status === 'pending_payment').length;
  const previewOrdersCount = projects.filter(p => p.status === 'preview_available').length;
  const publishedOrdersCount = projects.filter(p => p.status === 'published').length;

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

        {/* Action Buttons: Refresh Data & Download JSON Backup */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleManualRefresh}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all ${
              refreshFeedback 
                ? 'bg-emerald-600/30 border-emerald-500 text-emerald-300' 
                : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
            }`}
            title="Refrescar y recargar pedidos desde la memoria de la aplicación"
          >
            <RotateCcw className={`w-4 h-4 text-amber-400 ${refreshFeedback ? 'animate-spin' : ''}`} />
            <span>{refreshFeedback ? '¡Sincronizado!' : 'Refrescar Datos'}</span>
          </button>

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
        {/* Tab 1: Pedidos Ingresantes */}
        <button
          onClick={() => setActiveAdminTab('orders')}
          className={`px-4 py-2 rounded-xl transition-all flex items-center gap-2 relative ${
            activeAdminTab === 'orders' 
              ? 'bg-amber-500 text-neutral-950 font-bold shadow-lg shadow-amber-500/20' 
              : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Inbox className="w-4 h-4" />
          <span>Pedidos Ingresantes</span>
          {pendingOrdersCount > 0 ? (
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
              activeAdminTab === 'orders' ? 'bg-black text-amber-300' : 'bg-amber-500 text-black animate-pulse'
            }`}>
              {pendingOrdersCount} Nuevos
            </span>
          ) : (
            <span className="text-[10px] opacity-70">({projects.length})</span>
          )}
        </button>

        <button
          onClick={() => setActiveAdminTab('notifications')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-2 relative ${
            activeAdminTab === 'notifications' ? 'bg-amber-500 text-neutral-950 font-bold' : 'text-neutral-300 hover:text-white hover:bg-neutral-800/60'
          }`}
        >
          <Bell className="w-4 h-4" />
          <span>Notificaciones & Alertas</span>
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
          Pagos & Comprobantes ({payments.length})
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

      {/* 0. TAB ORDERS: BANDEJA CENTRAL DE PEDIDOS INGRESANTES */}
      {activeAdminTab === 'orders' && (() => {
        const filteredOrders = projects
          .filter(proj => {
            const search = orderSearch.toLowerCase().trim();
            if (!search) return true;
            return (
              (proj.orderNumber && proj.orderNumber.toLowerCase().includes(search)) ||
              (proj.honoreeName && proj.honoreeName.toLowerCase().includes(search)) ||
              (proj.clientEmail && proj.clientEmail.toLowerCase().includes(search)) ||
              (proj.clientPhone && proj.clientPhone.includes(search)) ||
              (proj.eventType && proj.eventType.toLowerCase().includes(search)) ||
              (proj.publicSlug && proj.publicSlug.toLowerCase().includes(search)) ||
              (proj.planId && proj.planId.toLowerCase().includes(search))
            );
          })
          .filter(proj => {
            if (orderStatusFilter === 'all') return true;
            return proj.status === orderStatusFilter;
          })
          .sort((a, b) => {
            if (orderSortOrder === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          });

        return (
          <div className="space-y-6 text-xs animate-in fade-in">
            {/* Header & Refresh */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-neutral-900 border border-neutral-800 p-5 rounded-2xl shadow-lg">
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-bold uppercase tracking-wider">
                    Recepción en Vivo
                  </span>
                  {refreshFeedback && (
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold animate-pulse">
                      ¡Datos Actualizados!
                    </span>
                  )}
                </div>
                <h2 className="text-base sm:text-lg font-cinzel font-bold text-white mt-1 flex items-center gap-2">
                  <Inbox className="w-5 h-5 text-amber-400" />
                  Bandeja Central de Pedidos Ingresantes
                </h2>
                <p className="text-neutral-400 mt-1 max-w-2xl text-[11px] leading-relaxed">
                  Supervisa cada solicitud de invitación digital enviada desde la web comercial. Valida comprobantes de transferencia con 1 click, habilita las 24hs de revisión previa o contacta directamente a cada cliente por WhatsApp.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2 self-start sm:self-center">
                <button
                  onClick={handleSimulateTestOrder}
                  className="px-3.5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-neutral-950 font-bold flex items-center gap-1.5 transition-all text-xs shadow-md shadow-amber-500/20 active:scale-95"
                  title="Generar instantáneamente un nuevo pedido con comprobante de pago para verificar recepción"
                >
                  <Zap className="w-3.5 h-3.5 fill-neutral-950 text-neutral-950" />
                  <span>⚡ Generar Pedido de Prueba</span>
                </button>

                <button
                  onClick={() => setShowManualOrderModal(true)}
                  className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold flex items-center gap-1.5 transition-all text-xs"
                  title="Registrar un nuevo pedido manualmente"
                >
                  <Plus className="w-3.5 h-3.5 text-amber-400" />
                  <span>+ Nuevo Pedido</span>
                </button>

                <button
                  onClick={handleManualRefresh}
                  className="px-3 py-2 rounded-xl bg-neutral-850 hover:bg-neutral-750 text-neutral-300 border border-neutral-700/80 font-medium flex items-center gap-1.5 transition-all text-xs"
                  title="Recargar datos de almacenamiento"
                >
                  <RotateCcw className={`w-3.5 h-3.5 text-amber-400 ${refreshFeedback ? 'animate-spin' : ''}`} />
                  <span>Actualizar</span>
                </button>
              </div>
            </div>

            {/* Test Order / Delete Notice Alerts */}
            {testOrderNotice && (
              <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-300 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{testOrderNotice}</span>
                </div>
                <button 
                  onClick={() => setTestOrderNotice(null)}
                  className="text-neutral-400 hover:text-white text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {deleteSuccessMessage && (
              <div className="p-3.5 rounded-xl bg-red-500/15 border border-red-500/40 text-red-300 text-xs flex items-center justify-between animate-fadeIn">
                <div className="flex items-center gap-2 font-medium">
                  <Trash2 className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span>{deleteSuccessMessage}</span>
                </div>
                <button 
                  onClick={() => setDeleteSuccessMessage(null)}
                  className="text-neutral-400 hover:text-white text-xs p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* KPI Metric Cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-neutral-400 mb-1">
                  <span className="text-[11px] font-medium">Total Pedidos</span>
                  <ShoppingBag className="w-4 h-4 text-neutral-500" />
                </div>
                <div className="text-2xl font-bold font-cinzel text-white">
                  {projects.length}
                </div>
                <span className="text-[10px] text-neutral-500">Registrados en sistema</span>
              </div>

              <div className={`p-4 rounded-2xl border transition-all ${
                pendingOrdersCount > 0 
                  ? 'bg-amber-500/10 border-amber-500/40 shadow-lg shadow-amber-500/5' 
                  : 'bg-neutral-900/80 border-neutral-800'
              }`}>
                <div className="flex items-center justify-between text-amber-400 mb-1">
                  <span className="text-[11px] font-semibold">Nuevos / Por Validar</span>
                  <AlertTriangle className="w-4 h-4 text-amber-400" />
                </div>
                <div className="text-2xl font-bold font-cinzel text-amber-300">
                  {pendingOrdersCount}
                </div>
                <span className="text-[10px] text-amber-400/80">
                  {pendingOrdersCount > 0 ? '¡Requieren atención inmediata!' : 'Al día, sin demoras'}
                </span>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-blue-400 mb-1">
                  <span className="text-[11px] font-medium">En Vista Previa (24h)</span>
                  <Eye className="w-4 h-4 text-blue-400" />
                </div>
                <div className="text-2xl font-bold font-cinzel text-blue-300">
                  {previewOrdersCount}
                </div>
                <span className="text-[10px] text-neutral-500">Esperando conformidad</span>
              </div>

              <div className="bg-neutral-900/80 border border-neutral-800 p-4 rounded-2xl">
                <div className="flex items-center justify-between text-emerald-400 mb-1">
                  <span className="text-[11px] font-medium">Aprobadas / Online</span>
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                </div>
                <div className="text-2xl font-bold font-cinzel text-emerald-300">
                  {publishedOrdersCount}
                </div>
                <span className="text-[10px] text-neutral-500">Activas & en circulación</span>
              </div>
            </div>

            {/* Search and Filters Bar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-neutral-900/60 border border-neutral-800 p-3 rounded-2xl">
              <div className="relative">
                <Search className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Buscar por N° pedido, nombre, email, WhatsApp..."
                  value={orderSearch}
                  onChange={(e) => setOrderSearch(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white placeholder-neutral-500 focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="relative">
                <Filter className="w-4 h-4 text-neutral-500 absolute left-3 top-2.5" />
                <select
                  value={orderStatusFilter}
                  onChange={(e) => setOrderStatusFilter(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="all">Todos los Pedidos ({projects.length})</option>
                  <option value="payment_review">⚡ Nuevos / Pago en Revisión ({projects.filter(p => p.status === 'payment_review').length})</option>
                  <option value="preview_available">👁️ En Vista Previa 24h ({previewOrdersCount})</option>
                  <option value="published">✅ Aprobados & Publicados ({publishedOrdersCount})</option>
                  <option value="pending_payment">⏳ Pendiente de Pago ({projects.filter(p => p.status === 'pending_payment').length})</option>
                </select>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={orderSortOrder}
                  onChange={(e) => setOrderSortOrder(e.target.value as any)}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-xs text-white focus:outline-none focus:border-amber-400"
                >
                  <option value="newest">Más recientes primero (Ingreso)</option>
                  <option value="oldest">Más antiguos primero</option>
                </select>
              </div>
            </div>

            {/* Orders List Cards */}
            {filteredOrders.length === 0 ? (
              <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-12 text-center space-y-3">
                <Inbox className="w-12 h-12 text-neutral-600 mx-auto" />
                <h3 className="text-white font-cinzel font-bold text-base">No se encontraron pedidos</h3>
                <p className="text-neutral-400 text-xs max-w-sm mx-auto">
                  {orderSearch || orderStatusFilter !== 'all' 
                    ? 'No hay pedidos que coincidan con la búsqueda o filtro aplicado.' 
                    : 'Aún no se han recibido pedidos desde el catálogo comercial.'}
                </p>
                {(orderSearch || orderStatusFilter !== 'all') && (
                  <button
                    onClick={() => { setOrderSearch(''); setOrderStatusFilter('all'); }}
                    className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold inline-block"
                  >
                    Restablecer Filtros
                  </button>
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map((proj) => {
                  const tmpl = templates.find(t => t.id === proj.templateId) || templates[0];
                  const plan = plans.find(p => p.id === proj.planId) || plans[0];
                  const targetPayment = payments.find(p => p.projectId === proj.id);
                  const receiptUrl = proj.receiptUrl || targetPayment?.receiptUrl;
                  const hasReceipt = Boolean(receiptUrl);
                  const honoree = proj.honoreeName || 'Sin Nombre Especificado';
                  const orderNum = proj.orderNumber || `ORD-${proj.id.slice(-6).toUpperCase()}`;
                  const clientPhone = proj.clientPhone || '';
                  const cleanPhone = clientPhone ? clientPhone.replace(/[^0-9]/g, '') : '';
                  const waUrl = cleanPhone 
                    ? `https://wa.me/${cleanPhone.startsWith('54') ? cleanPhone : '549' + cleanPhone}?text=${encodeURIComponent(`Hola ${honoree}, te saludamos de TuInvitacionDigital por tu pedido de invitación ${orderNum}.`)}`
                    : `https://wa.me/5493835438603?text=${encodeURIComponent(`Hola ${honoree}, te contactamos por tu pedido ${orderNum}.`)}`;

                  const isNewOrReview = proj.status === 'payment_review' || proj.status === 'pending_payment';

                  return (
                    <div 
                      key={proj.id}
                      className={`p-5 rounded-2xl border transition-all ${
                        isNewOrReview
                          ? 'bg-neutral-900 border-amber-500/40 shadow-xl shadow-amber-500/5'
                          : 'bg-neutral-900/90 border-neutral-800 hover:border-neutral-700'
                      }`}
                    >
                      {/* Top Bar of Card */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-neutral-800">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-950 border border-neutral-700 font-mono text-xs font-bold text-amber-300">
                            #{orderNum}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-neutral-800 text-neutral-300 font-semibold capitalize text-[11px]">
                            {proj.eventType}
                          </span>
                          <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold uppercase text-[10px]">
                            Plan {proj.planId}
                          </span>
                          <span className="text-neutral-400 text-[11px] flex items-center gap-1 font-mono">
                            <Clock className="w-3.5 h-3.5 text-neutral-500" />
                            {new Date(proj.createdAt).toLocaleDateString('es-AR', {
                              day: '2-digit',
                              month: 'short',
                              year: 'numeric',
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                          </span>
                        </div>

                        {/* Status Badge */}
                        <div>
                          {proj.status === 'payment_review' && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse flex items-center gap-1.5">
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                              PAGO EN REVISIÓN • VALIDAR COMPROBANTE
                            </span>
                          )}
                          {proj.status === 'preview_available' && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-blue-500/20 text-blue-300 border border-blue-500/30 flex items-center gap-1.5">
                              <Eye className="w-3.5 h-3.5 text-blue-400" />
                              VISTA PREVIA ACTIVA (24H)
                            </span>
                          )}
                          {proj.status === 'published' && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1.5">
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                              APROBADA & PUBLICADA
                            </span>
                          )}
                          {proj.status === 'pending_payment' && (
                            <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-neutral-800 text-neutral-300 border border-neutral-700 flex items-center gap-1.5">
                              <Clock className="w-3.5 h-3.5 text-neutral-400" />
                              PENDIENTE DE PAGO
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Main 3-Column Info Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 py-4 text-xs">
                        {/* Col 1: Cliente & Contacto */}
                        <div className="space-y-2 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Cliente & Agasajados
                          </span>
                          <div className="font-bold text-white text-sm">
                            {honoree}
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Mail className="w-3.5 h-3.5 text-neutral-500 flex-shrink-0" />
                            <span className="truncate">{proj.clientEmail || 'Sin email'}</span>
                          </div>
                          <div className="flex items-center gap-1.5 text-neutral-300">
                            <Phone className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0" />
                            <span>{clientPhone || 'No especificado'}</span>
                          </div>
                          {cleanPhone && (
                            <a
                              href={waUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600/20 border border-emerald-500/30 text-emerald-300 hover:bg-emerald-600/30 text-[11px] font-semibold transition-colors mt-1"
                            >
                              <Phone className="w-3 h-3 text-emerald-400" />
                              Abrir Chat WhatsApp
                            </a>
                          )}
                        </div>

                        {/* Col 2: Plantilla & Plan */}
                        <div className="space-y-2 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block">
                            Servicio Contratado
                          </span>
                          <div className="flex items-center gap-2.5">
                            <img 
                              src={tmpl.previewImage} 
                              alt={tmpl.name} 
                              className="w-10 h-10 rounded-lg object-cover border border-neutral-700 flex-shrink-0"
                            />
                            <div>
                              <div className="font-bold text-white leading-tight">{tmpl.name}</div>
                              <div className="text-[11px] text-neutral-400">Fecha: {proj.eventDate || tmpl.sampleDate}</div>
                            </div>
                          </div>
                          <div className="flex items-center justify-between pt-1 border-t border-neutral-800 text-[11px]">
                            <span className="text-neutral-400">Monto del Plan:</span>
                            <span className="font-bold font-mono text-amber-300 text-xs">
                              ${(proj.amount || plan.price).toLocaleString('es-AR')} {proj.currency || plan.currency}
                            </span>
                          </div>
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-neutral-400">Medio de Pago:</span>
                            <span className="font-medium text-neutral-200">
                              {proj.paymentMethod === 'mercadopago' ? 'Mercado Pago' : 'Transferencia Bancaria'}
                            </span>
                          </div>
                        </div>

                        {/* Col 3: Comprobante & Revisión */}
                        <div className="space-y-2 bg-neutral-950/60 p-3.5 rounded-xl border border-neutral-800/80 flex flex-col justify-between">
                          <div>
                            <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-400 block mb-1">
                              Comprobante Bancario
                            </span>
                            {hasReceipt ? (
                              <div className="flex items-center gap-3">
                                <img 
                                  src={receiptUrl} 
                                  alt="Comprobante" 
                                  className="w-12 h-12 rounded-lg object-cover border border-amber-500/40 cursor-pointer hover:opacity-80 transition-opacity"
                                  onClick={() => {
                                    setSelectedReceiptPayment(targetPayment || {
                                      id: `pay-${proj.id}`,
                                      projectId: proj.id,
                                      amount: proj.amount || plan.price,
                                      currency: proj.currency || plan.currency,
                                      provider: proj.paymentMethod || 'transfer',
                                      status: 'review',
                                      receiptUrl,
                                      createdAt: proj.createdAt
                                    });
                                  }}
                                />
                                <div className="space-y-1">
                                  <span className="text-emerald-400 font-semibold text-[11px] flex items-center gap-1">
                                    <FileCheck className="w-3.5 h-3.5" />
                                    Comprobante Adjunto
                                  </span>
                                  <button
                                    onClick={() => {
                                      setSelectedReceiptPayment(targetPayment || {
                                        id: `pay-${proj.id}`,
                                        projectId: proj.id,
                                        amount: proj.amount || plan.price,
                                        currency: proj.currency || plan.currency,
                                        provider: proj.paymentMethod || 'transfer',
                                        status: 'review',
                                        receiptUrl,
                                        createdAt: proj.createdAt
                                      });
                                    }}
                                    className="text-amber-400 hover:text-amber-300 text-[11px] font-bold underline block"
                                  >
                                    Inspeccionar Comprobante
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <div className="text-neutral-500 italic py-2 text-[11px]">
                                El cliente no adjuntó comprobante en el envío.
                              </div>
                            )}
                          </div>

                          <div className="text-[11px] text-neutral-400 font-mono pt-1 border-t border-neutral-800">
                            Slug: <span className="text-neutral-300">/{proj.publicSlug}</span>
                          </div>
                        </div>
                      </div>

                      {/* Bottom Action Buttons */}
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-neutral-800">
                        <div className="flex flex-wrap items-center gap-2">
                          {/* Primary Action: Approve Order & Enable 24h preview */}
                          {proj.status !== 'published' && (
                            <button
                              onClick={() => confirmOrderAdmin(proj.id)}
                              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-emerald-600/20 transition-all"
                              title="Valida el pago bancario y habilita la ventana de 24h para el cliente"
                            >
                              <CheckCircle2 className="w-4 h-4" />
                              <span>Aprobar Pedido & Habilitar 24h</span>
                            </button>
                          )}

                          {/* Quick Edit Modal */}
                          <button
                            onClick={() => handleOpenEditModal(proj.id)}
                            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-blue-400" />
                            Editar Textos & Datos
                          </button>

                          {/* View Live Invitation */}
                          <a
                            href={`/invitacion?slug=${proj.publicSlug}&token=${proj.previewToken}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                          >
                            <ExternalLink className="w-3.5 h-3.5 text-amber-400" />
                            Ver Invitación en Vivo
                          </a>
                        </div>

                        <div className="flex items-center gap-2">
                          {hasReceipt && proj.status === 'payment_review' && (
                            <button
                              onClick={() => {
                                setSelectedReceiptPayment(targetPayment || {
                                  id: `pay-${proj.id}`,
                                  projectId: proj.id,
                                  amount: proj.amount || plan.price,
                                  currency: proj.currency || plan.currency,
                                  provider: proj.paymentMethod || 'transfer',
                                  status: 'review',
                                  receiptUrl,
                                  createdAt: proj.createdAt
                                });
                                setShowRejectModal(true);
                                setRejectReason('');
                              }}
                              className="px-3 py-1.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-300 hover:bg-red-900/60 text-xs font-semibold transition-colors"
                            >
                              Rechazar Comprobante
                            </button>
                          )}

                          {proj.status === 'preview_available' && (
                            <button
                              onClick={() => adminSetProjectStatus(proj.id, 'published')}
                              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold flex items-center gap-1.5 transition-colors"
                            >
                              <PlayCircle className="w-4 h-4" />
                              Publicar Definitiva
                            </button>
                          )}

                          <button
                            onClick={() => setOrderToDelete({ id: proj.id, name: honoree || proj.publicSlug })}
                            className="px-3 py-2 rounded-xl bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                            title="Eliminar este pedido definitivamente del sistema"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-400" />
                            <span>Eliminar Pedido</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        );
      })()}

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
              proj.planId.toLowerCase().includes(projectSearch.toLowerCase()) ||
              (proj.honoreeName && proj.honoreeName.toLowerCase().includes(projectSearch.toLowerCase())) ||
              (proj.orderNumber && proj.orderNumber.toLowerCase().includes(projectSearch.toLowerCase())) ||
              (proj.clientPhone && proj.clientPhone.includes(projectSearch));
            
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
                  placeholder="Buscar por slug, email, agasajado, N° pedido..."
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
                  <option value="payment_review">⚡ Pago en Revisión / Ingresante ({projects.filter(p => p.status === 'payment_review').length})</option>
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
                      filteredProjects.map((proj) => {
                        const isReview = proj.status === 'payment_review' || proj.status === 'pending_payment';
                        return (
                          <tr key={proj.id} className={`transition-colors ${isReview ? 'bg-amber-500/5 hover:bg-amber-500/10' : 'hover:bg-neutral-800/40'}`}>
                            <td className="p-3.5 font-mono text-white">
                              <div className="flex items-center gap-1.5 font-bold">
                                <span>/{proj.publicSlug}</span>
                                {proj.status === 'published' && (
                                  <span className="w-2 h-2 rounded-full bg-emerald-400 inline-block" title="Activa y pública" />
                                )}
                              </div>
                              <div className="text-[10px] text-amber-300 font-sans font-semibold mt-0.5">
                                #{proj.orderNumber || `ORD-${proj.id.slice(-6).toUpperCase()}`}
                              </div>
                              {proj.honoreeName && (
                                <div className="text-[11px] text-neutral-300 font-sans font-medium">
                                  {proj.honoreeName}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5 text-neutral-400">
                              <div className="text-white text-xs">{proj.clientEmail}</div>
                              {proj.clientPhone && (
                                <div className="text-emerald-400 text-[11px] font-mono mt-0.5">
                                  {proj.clientPhone}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <div>
                                <span className="capitalize">{proj.eventType}</span> • <span className="font-bold text-amber-400 uppercase">{proj.planId}</span>
                              </div>
                              {proj.amount && (
                                <div className="text-[11px] font-mono text-neutral-400 mt-0.5">
                                  ${proj.amount.toLocaleString('es-AR')} {proj.currency || 'ARS'}
                                </div>
                              )}
                            </td>
                            <td className="p-3.5">
                              <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1 ${
                                proj.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                                proj.status === 'preview_available' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
                                proj.status === 'payment_review' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 animate-pulse' :
                                proj.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                                'bg-neutral-800 text-neutral-400'
                              }`}>
                                {proj.status === 'payment_review' && <AlertTriangle className="w-3 h-3 text-amber-400" />}
                                {proj.status === 'payment_review' ? 'Pago en Revisión' :
                                 proj.status === 'published' ? 'Aprobada / Online' : 
                                 proj.status === 'preview_available' ? 'Vista Previa (24h)' : 
                                 proj.status.replace('_', ' ')}
                              </span>
                            </td>
                            <td className="p-3.5 text-neutral-500">{new Date(proj.createdAt).toLocaleDateString()}</td>
                            <td className="p-3.5 text-right">
                              <div className="flex items-center justify-end gap-1.5">
                                {/* Quick Approve for incoming order */}
                                {isReview && (
                                  <button
                                    onClick={() => confirmOrderAdmin(proj.id)}
                                    className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1 transition-colors text-[11px] shadow-sm"
                                    title="Aprobar pago y habilitar 24h"
                                  >
                                    <CheckCircle2 className="w-3.5 h-3.5" />
                                    Aprobar Pedido
                                  </button>
                                )}

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

                                {/* Delete Event / Order */}
                                <button
                                  onClick={() => setOrderToDelete({ id: proj.id, name: proj.honoreeName || proj.publicSlug, isProjectOnly: true })}
                                  className="px-2 py-1 rounded-lg bg-red-950/40 hover:bg-red-900/60 text-red-300 hover:text-white border border-red-500/30 flex items-center gap-1 transition-colors"
                                  title="Eliminar evento definitivamente"
                                >
                                  <Trash2 className="w-3.5 h-3.5 text-red-400" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
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

      {/* MODAL DE CONFIRMACIÓN DE ELIMINACIÓN DE PEDIDO / PROYECTO */}
      {orderToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-red-500/40 rounded-2xl max-w-md w-full p-6 text-white shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 flex-shrink-0">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">¿Eliminar {orderToDelete.isProjectOnly ? 'Evento' : 'Pedido'}?</h3>
                <p className="text-xs text-neutral-400">Esta acción removerá el registro permanentemente</p>
              </div>
            </div>

            <div className="p-3.5 bg-neutral-950 rounded-xl border border-neutral-800 text-xs space-y-1.5">
              <div className="text-neutral-400 text-[11px] uppercase tracking-wider font-semibold">Registro Seleccionado:</div>
              <div className="font-bold text-white text-sm flex items-center gap-2">
                <span>{orderToDelete.name}</span>
              </div>
              <div className="text-[11px] text-neutral-400 font-mono">
                Identificador: {orderToDelete.id}
              </div>
            </div>

            <p className="text-xs text-neutral-300 leading-relaxed">
              Al confirmar, se eliminarán los datos del pedido, comprobantes de pago asociados, configuración y enlaces activos de la plataforma.
            </p>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
              <button
                onClick={() => setOrderToDelete(null)}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDeleteOrder}
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-red-600/30 transition-all"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Confirmar y Eliminar</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL PARA CARGAR NUEVO PEDIDO MANUALMENTE */}
      {showManualOrderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-lg w-full p-6 text-white shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-3">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-sm text-white">Ingresar Nuevo Pedido Manual</h3>
                  <p className="text-[11px] text-neutral-400">Registra un encargo directo de un cliente</p>
                </div>
              </div>
              <button
                onClick={() => setShowManualOrderModal(false)}
                className="text-neutral-400 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateManualOrder} className="space-y-3.5 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Nombre Agasajado(s) *</label>
                  <input
                    type="text"
                    required
                    value={manualOrderForm.honoreeName}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, honoreeName: e.target.value }))}
                    placeholder="Ej: Camila & Gonzalo"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Email Cliente *</label>
                  <input
                    type="email"
                    required
                    value={manualOrderForm.clientEmail}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, clientEmail: e.target.value }))}
                    placeholder="cliente@gmail.com"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">WhatsApp de Contacto</label>
                  <input
                    type="text"
                    value={manualOrderForm.clientPhone}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, clientPhone: e.target.value }))}
                    placeholder="+54 9 11 5555 4321"
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Fecha del Evento</label>
                  <input
                    type="date"
                    value={manualOrderForm.eventDate}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, eventDate: e.target.value }))}
                    className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Tipo de Evento</label>
                  <select
                    value={manualOrderForm.eventType}
                    onChange={(e) => {
                      const newType = e.target.value as EventType;
                      const matchedTmpl = templates.find(t => t.category === newType) || templates[0];
                      setManualOrderForm(prev => ({ 
                        ...prev, 
                        eventType: newType,
                        templateId: matchedTmpl.id
                      }));
                    }}
                    className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs capitalize"
                  >
                    <option value="boda">Boda</option>
                    <option value="xv">Quince Años (XV)</option>
                    <option value="bautismo">Bautismo</option>
                    <option value="cumple">Cumpleaños</option>
                    <option value="corporativo">Corporativo</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Plan</label>
                  <select
                    value={manualOrderForm.planId}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, planId: e.target.value as PlanTier }))}
                    className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs uppercase"
                  >
                    <option value="bronce">Bronce</option>
                    <option value="plata">Plata</option>
                    <option value="oro">Oro</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Medio de Pago</label>
                  <select
                    value={manualOrderForm.paymentMethod}
                    onChange={(e) => setManualOrderForm(prev => ({ ...prev, paymentMethod: e.target.value as any }))}
                    className="w-full px-2.5 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                  >
                    <option value="transfer">Transferencia</option>
                    <option value="mercadopago">Mercado Pago</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-neutral-300 mb-1">Plantilla / Diseño Base</label>
                <select
                  value={manualOrderForm.templateId}
                  onChange={(e) => setManualOrderForm(prev => ({ ...prev, templateId: e.target.value }))}
                  className="w-full px-3 py-2 bg-neutral-950 border border-neutral-800 rounded-xl text-white focus:outline-none focus:border-amber-400 text-xs"
                >
                  {templates.map(t => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.category.toUpperCase()})
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex items-center justify-end gap-2 pt-3 border-t border-neutral-800">
                <button
                  type="button"
                  onClick={() => setShowManualOrderModal(false)}
                  className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-300 text-xs font-semibold transition-colors"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-amber-500/20 transition-all"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Crear Pedido e Ingresar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
