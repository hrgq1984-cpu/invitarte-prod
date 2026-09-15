import React, { useState, useRef } from 'react';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Image as ImageIcon, 
  Settings, 
  Send, 
  Share2, 
  Plus, 
  Trash2, 
  Upload, 
  Download, 
  Copy, 
  ExternalLink,
  MessageCircle,
  FileSpreadsheet,
  Check,
  RefreshCw,
  HardDrive,
  AlertTriangle,
  Lock,
  ArrowRight
} from 'lucide-react';
import { useStore } from '../lib/store';
import { Guest, EventSettings } from '../types';

export const ClientDashboard: React.FC = () => {
  const { 
    currentProject, 
    currentEventSettings, 
    updateEventSettings, 
    plans, 
    guests, 
    addGuest, 
    updateGuest, 
    deleteGuest, 
    importGuestsCsv,
    approveProjectByClient,
    requestClientCorrection
  } = useStore();

  const plan = plans.find(p => p.id === currentProject.planId) || plans[0];
  const [activeTab, setActiveTab] = useState<'summary' | 'details' | 'guests' | 'photos' | 'drive'>('summary');
  
  // Correction notes state
  const [correctionText, setCorrectionText] = useState('');
  const [correctionSent, setCorrectionSent] = useState(false);

  // New guest modal state
  const [showAddGuestModal, setShowAddGuestModal] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');
  const [newGuestRel, setNewGuestRel] = useState('');
  const [newGuestPhone, setNewGuestPhone] = useState('');
  const [newGuestAdults, setNewGuestAdults] = useState(2);
  const [newGuestChildren, setNewGuestChildren] = useState(0);

  // CSV Import modal state
  const [showCsvModal, setShowCsvModal] = useState(false);
  const [csvContent, setCsvContent] = useState('');
  const [csvMessage, setCsvMessage] = useState<string | null>(null);

  // Copy toast state
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Invitation sending restriction: only allowed once admin approves payment
  const canSendInvitations = currentProject.status === 'preview_available' || currentProject.status === 'published';
  const [showLockedSendAlert, setShowLockedSendAlert] = useState(false);

  // Editable Event Settings State
  const [formData, setFormData] = useState<EventSettings>(currentEventSettings);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Photo upload ref
  const photoInputRef = useRef<HTMLInputElement>(null);

  const handleCopyLink = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    updateEventSettings(currentProject.id, formData);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleAddGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newGuestName.trim()) return;

    addGuest(currentProject.id, {
      name: newGuestName.trim(),
      relationship: newGuestRel.trim() || 'Invitado/a',
      phone: newGuestPhone.trim(),
      adultsMax: newGuestAdults,
      childrenMax: newGuestChildren
    });

    setNewGuestName('');
    setNewGuestRel('');
    setNewGuestPhone('');
    setShowAddGuestModal(false);
  };

  const handleCsvImport = () => {
    if (!csvContent.trim()) return;
    const count = importGuestsCsv(currentProject.id, csvContent);
    setCsvMessage(`¡Se importaron ${count} invitados con éxito!`);
    setTimeout(() => {
      setCsvMessage(null);
      setShowCsvModal(false);
      setCsvContent('');
    }, 2000);
  };

  const handleAddPhotoUrl = (url: string) => {
    if (formData.carouselPhotos.length >= plan.maxInvitationPhotos) {
      alert(`El ${plan.name} permite un máximo de ${plan.maxInvitationPhotos} fotos.`);
      return;
    }
    const updated = [...formData.carouselPhotos, url];
    setFormData(prev => ({ ...prev, carouselPhotos: updated }));
    updateEventSettings(currentProject.id, { carouselPhotos: updated });
  };

  const handleRemovePhoto = (index: number) => {
    const updated = formData.carouselPhotos.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, carouselPhotos: updated }));
    updateEventSettings(currentProject.id, { carouselPhotos: updated });
  };

  const handlePhotoFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (formData.carouselPhotos.length >= plan.maxInvitationPhotos) {
      alert(`El ${plan.name} permite un máximo de ${plan.maxInvitationPhotos} fotos.`);
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      handleAddPhotoUrl(dataUrl);
    };
    reader.readAsDataURL(file);
  };

  // WhatsApp link generator for guest
  const getWhatsAppInviteUrl = (g: Guest) => {
    const origin = window.location.origin;
    const guestUrl = `${origin}/#guest=${g.inviteToken}`;
    const text = encodeURIComponent(
      `¡Hola ${g.name}! ✨\n` +
      `Te invitamos con inmensa alegría a ${currentEventSettings.title} de ${currentEventSettings.honoreeName}.\n` +
      `📅 Fecha: ${currentEventSettings.date}\n` +
      `📍 Lugar: ${currentEventSettings.locationName}\n\n` +
      `Puedes abrir tu invitación interactiva personalizada y confirmar tu asistencia aquí:\n` +
      `${guestUrl}`
    );
    const phone = g.phone ? g.phone.replace(/[^0-9]/g, '') : '';
    return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  const getWhatsAppReminderUrl = (g: Guest) => {
    const origin = window.location.origin;
    const guestUrl = `${origin}/#guest=${g.inviteToken}`;
    const text = encodeURIComponent(
      `¡Hola ${g.name}! Recordatorio cariñoso para ${currentEventSettings.title} de ${currentEventSettings.honoreeName}.\n` +
      `Agradecemos confirmar tu asistencia en el enlace para organizar los lugares:\n` +
      `${guestUrl}`
    );
    const phone = g.phone ? g.phone.replace(/[^0-9]/g, '') : '';
    return phone ? `https://wa.me/${phone}?text=${text}` : `https://wa.me/?text=${text}`;
  };

  // Guest stats calculation
  const totalGuests = guests.length;
  const confirmedGuests = guests.filter(g => g.attendance === 'confirmed');
  const confirmedAdults = confirmedGuests.reduce((acc, g) => acc + g.adultsConfirmed, 0);
  const confirmedChildren = confirmedGuests.reduce((acc, g) => acc + g.childrenConfirmed, 0);
  const declinedGuests = guests.filter(g => g.attendance === 'declined').length;
  const pendingGuests = guests.filter(g => g.attendance === 'pending').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-montserrat">
      
      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-neutral-800 pb-6">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold uppercase tracking-widest text-amber-400">
              Panel de Administración del Cliente
            </span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
              currentProject.status === 'published' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' :
              currentProject.status === 'preview_available' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40' :
              currentProject.status === 'pending_payment' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' :
              'bg-neutral-800 text-neutral-300'
            }`}>
              {currentProject.status.replace('_', ' ')}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-cinzel font-bold text-white mt-1">
            {currentEventSettings.title} - {currentEventSettings.honoreeName}
          </h1>
          <div className="flex items-center gap-2.5 flex-wrap text-xs text-neutral-400 mt-1">
            <span>{plan.name} (${plan.price.toLocaleString('es-AR')} ARS) • Enlace: /{currentProject.publicSlug}</span>
            <span className="px-2 py-0.5 rounded-lg bg-amber-950/60 border border-amber-500/40 text-amber-300 text-[11px] font-mono flex items-center gap-1">
              <span className="text-neutral-400">URL Panel:</span>
              <span className="font-bold text-amber-200">/cliente</span>
            </span>
          </div>
        </div>

        {/* Quick action buttons */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          {currentProject.status === 'preview_available' && (
            <button
              onClick={() => approveProjectByClient(currentProject.id)}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold flex items-center gap-1.5 shadow-md"
            >
              <Check className="w-4 h-4" />
              Aprobar & Publicar Invitación
            </button>
          )}

          <a
            href={`#demo`}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
          >
            <ExternalLink className="w-4 h-4 text-amber-400" />
            Ver Preview Celular
          </a>
        </div>
      </div>

      {/* 24-HOUR REVIEW NOTICE (If preview_available) */}
      {currentProject.status === 'preview_available' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-950/60 to-neutral-900 border border-blue-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs">
              <div className="font-bold text-white text-sm">
                Ventana de Revisión de 24 Horas Activa
              </div>
              <div className="text-neutral-300">
                Tu pago está confirmado. Tienes 24 horas para revisar todos los datos, fotos e invitados antes de la publicación final. Puedes aprobar de inmediato o solicitar ajustes.
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <input
              type="text"
              value={correctionText}
              onChange={(e) => setCorrectionText(e.target.value)}
              placeholder="Solicitar corrección al admin..."
              className="px-3 py-1.5 rounded-lg bg-neutral-900 border border-neutral-700 text-xs text-white focus:outline-none focus:border-blue-400"
            />
            <button
              onClick={() => {
                if (correctionText.trim()) {
                  requestClientCorrection(currentProject.id, correctionText);
                  setCorrectionSent(true);
                  setCorrectionText('');
                  setTimeout(() => setCorrectionSent(false), 3000);
                }
              }}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold whitespace-nowrap"
            >
              Enviar Ajuste
            </button>
          </div>
          {correctionSent && (
            <div className="text-[11px] text-blue-300 font-semibold">
              ¡Nota de corrección registrada para el administrador!
            </div>
          )}
        </div>
      )}

      {/* PAYMENT REVIEW / PENDING CONFIRMATION BANNER */}
      {currentProject.status === 'payment_review' && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/60 to-neutral-900 border border-amber-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <Clock className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5 animate-pulse" />
            <div className="text-xs">
              <div className="font-bold text-white text-sm">
                Comprobante de Transferencia en Verificación
              </div>
              <div className="text-neutral-300">
                Tu comprobante fue enviado al administrador. En breve validará la acreditación para activar la vista previa interactiva. Mientras tanto, puedes personalizar todos los datos de tu evento.
              </div>
            </div>
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-amber-500/20 text-amber-300 text-xs font-bold whitespace-nowrap border border-amber-500/30">
            En Verificación Bancaria
          </div>
        </div>
      )}

      {/* REJECTED RECEIPT BANNER (pending_payment with notes) */}
      {currentProject.status === 'pending_payment' && currentProject.correctionNotes && (
        <div className="p-4 rounded-2xl bg-gradient-to-r from-red-950/60 to-neutral-900 border border-red-500/40 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />
            <div className="text-xs">
              <div className="font-bold text-white text-sm">
                Comprobante Observado por el Administrador
              </div>
              <div className="text-red-200 mt-0.5 font-medium">
                {currentProject.correctionNotes}
              </div>
              <div className="text-neutral-400 mt-1">
                Por favor, verifica la cuenta bancaria de destino y vuelve a adjuntar el comprobante correcto para habilitar tu servicio.
              </div>
            </div>
          </div>
          <button
            onClick={() => {
              const fileInput = document.getElementById('receipt-upload-input');
              if (fileInput) fileInput.click();
            }}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-bold whitespace-nowrap shadow-sm"
          >
            Reenviar Comprobante
          </button>
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-2 border-b border-neutral-800 pb-2 overflow-x-auto text-xs font-semibold">
        <button
          onClick={() => setActiveTab('summary')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'summary' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <CheckCircle className="w-4 h-4" />
          Resumen & Estadísticas
        </button>

        <button
          onClick={() => setActiveTab('details')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'details' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          Editor del Evento
        </button>

        <button
          onClick={() => setActiveTab('guests')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'guests' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <Users className="w-4 h-4" />
          Control de Invitados ({guests.length})
        </button>

        <button
          onClick={() => setActiveTab('photos')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'photos' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <ImageIcon className="w-4 h-4" />
          Fotos & Recuerdos
        </button>

        <button
          onClick={() => setActiveTab('drive')}
          className={`px-4 py-2 rounded-xl transition-colors flex items-center gap-1.5 ${
            activeTab === 'drive' ? 'bg-amber-500 text-neutral-950' : 'text-neutral-400 hover:text-white'
          }`}
        >
          <HardDrive className="w-4 h-4" />
          Respaldo Google Drive (10 Días)
        </button>
      </div>

      {/* TAB 1: RESUMEN Y ESTADÍSTICAS */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-xs text-neutral-400 uppercase font-semibold">Total Invitados</div>
              <div className="text-2xl font-bold text-white font-mono">{totalGuests}</div>
              <div className="text-[11px] text-neutral-500">Límite plan: {plan.maxGuests}</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-xs text-emerald-400 uppercase font-semibold">Adultos Confirmados</div>
              <div className="text-2xl font-bold text-emerald-400 font-mono">{confirmedAdults}</div>
              <div className="text-[11px] text-neutral-500">Menores: {confirmedChildren}</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-xs text-amber-400 uppercase font-semibold">Pendientes</div>
              <div className="text-2xl font-bold text-amber-400 font-mono">{pendingGuests}</div>
              <div className="text-[11px] text-neutral-500">Sin respuesta aún</div>
            </div>

            <div className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-1">
              <div className="text-xs text-red-400 uppercase font-semibold">No Asisten</div>
              <div className="text-2xl font-bold text-red-400 font-mono">{declinedGuests}</div>
              <div className="text-[11px] text-neutral-500">Cupos liberados</div>
            </div>
          </div>

          {/* Project Details Card */}
          <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
            <h3 className="text-base font-cinzel font-bold text-white">Estado del Proyecto</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-neutral-300">
              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Plan Contratado:</span>
                <span className="font-bold text-amber-400">{plan.name}</span> (${plan.price.toLocaleString('es-AR')} ARS)
              </div>

              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Fecha del Evento:</span>
                <span className="font-semibold text-white">{currentEventSettings.date} a las {currentEventSettings.time} hs</span>
              </div>

              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Lugar / Salón:</span>
                <span className="font-semibold text-white">{currentEventSettings.locationName}</span>
              </div>

              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Fecha de Pago:</span>
                <span className="font-semibold text-white">
                  {currentProject.paidAt ? new Date(currentProject.paidAt).toLocaleDateString() : 'Pendiente de confirmación'}
                </span>
              </div>

              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Música Seleccionada:</span>
                <span className="font-semibold text-white">{currentEventSettings.musicTitle || 'Melodía de Ceremonia'}</span>
              </div>

              <div className="bg-neutral-950/50 p-3 rounded-xl border border-neutral-800">
                <span className="text-neutral-500 block">Pantalla de TV:</span>
                <span className="font-semibold text-purple-400">
                  {plan.hasTvMode ? 'Habilitada (Coverflow 3D)' : 'No incluida en este plan'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: EDITOR DE DATOS DEL EVENTO */}
      {activeTab === 'details' && (
        <form onSubmit={handleSaveSettings} className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-xs">
          <div className="flex items-center justify-between border-b border-neutral-800 pb-4">
            <div>
              <h3 className="text-base font-cinzel font-bold text-white">Editar Datos del Evento</h3>
              <p className="text-neutral-400">Actualiza las fechas, lugares, vestimenta y datos bancarios.</p>
            </div>

            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-2 shadow"
            >
              <Check className="w-4 h-4" />
              Guardar Cambios
            </button>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center font-bold">
              ✓ ¡Cambios guardados exitosamente! La invitación se actualizó en tiempo real.
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Título del Evento</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Nombre de los Homenajeados</label>
              <input
                type="text"
                value={formData.honoreeName}
                onChange={(e) => setFormData({ ...formData, honoreeName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Fecha (YYYY-MM-DD)</label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Hora Ceremonia</label>
                <input
                  type="time"
                  value={formData.ceremonyTime || '11:00'}
                  onChange={(e) => setFormData({ ...formData, ceremonyTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Hora Fiesta</label>
                <input
                  type="time"
                  value={formData.partyTime || '13:00'}
                  onChange={(e) => setFormData({ ...formData, partyTime: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1 font-semibold">Nombre del Salón / Lugar</label>
              <input
                type="text"
                value={formData.locationName}
                onChange={(e) => setFormData({ ...formData, locationName: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1 font-semibold">Dirección Completa</label>
              <input
                type="text"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1 font-semibold">Enlace a Google Maps</label>
              <input
                type="url"
                value={formData.mapsUrl}
                onChange={(e) => setFormData({ ...formData, mapsUrl: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-neutral-400 mb-1 font-semibold">Frase o Mensaje Principal</label>
              <textarea
                value={formData.initialPhrase}
                onChange={(e) => setFormData({ ...formData, initialPhrase: e.target.value })}
                rows={2}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Código de Vestimenta</label>
              <input
                type="text"
                value={formData.dressCode}
                onChange={(e) => setFormData({ ...formData, dressCode: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Notas de Vestimenta / Niños</label>
              <input
                type="text"
                value={formData.dressCodeNotes || ''}
                onChange={(e) => setFormData({ ...formData, dressCodeNotes: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            {/* Datos Bancarios */}
            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Alias Bancario</label>
              <input
                type="text"
                value={formData.bankAlias || ''}
                onChange={(e) => setFormData({ ...formData, bankAlias: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">CVU Bancario (22 dígitos)</label>
              <input
                type="text"
                value={formData.bankCvu || ''}
                onChange={(e) => setFormData({ ...formData, bankCvu: e.target.value })}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Banner de Cierre de Carga de Datos */}
          <div className="p-4 rounded-2xl bg-neutral-950 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-4">
            <div className="space-y-0.5">
              <div className="text-white font-bold flex items-center gap-1.5 text-xs">
                <CheckCircle className="w-4 h-4 text-amber-400" />
                <span>¿Finalizaste de cargar los datos de la invitación?</span>
              </div>
              <p className="text-[11px] text-neutral-400">
                Guarda los cambios y pasa a la lista de invitados. Una vez que el administrador verifique tu pago, se desbloquearán los envíos por WhatsApp.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 transition-colors shadow"
              >
                <Check className="w-4 h-4" />
                Guardar Datos
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('guests')}
                className="px-4 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 font-semibold flex items-center gap-1.5 transition-colors"
              >
                <span>Ir a Invitados</span>
                <ArrowRight className="w-4 h-4 text-amber-400" />
              </button>
            </div>
          </div>
        </form>
      )}

      {/* TAB 3: CONTROL DE INVITADOS */}
      {activeTab === 'guests' && (
        <div className="space-y-4">
          {/* Alerta de bloqueo de envío si el pago aún no fue verificado */}
          {!canSendInvitations && (
            <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/80 via-neutral-900 to-neutral-900 border border-amber-500/50 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-lg">
              <div className="flex items-start gap-3">
                <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 mt-0.5">
                  <Lock className="w-5 h-5" />
                </div>
                <div className="text-xs space-y-1">
                  <div className="font-bold text-white text-sm flex items-center gap-2">
                    <span>Envíos de Invitación Restringidos por Verificación de Pago</span>
                    <span className="px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 text-[10px] font-mono border border-amber-500/30">
                      {currentProject.status === 'payment_review' ? 'Pago en Verificación' : 'Pendiente de Pago'}
                    </span>
                  </div>
                  <p className="text-neutral-300">
                    Puedes continuar cargando o importando todos tus invitados y preparando sus cupos familiares. El botón de envío por WhatsApp se habilitará automáticamente tan pronto como el administrador verifique el pago de tu servicio contratado.
                  </p>
                </div>
              </div>
            </div>
          )}

          {showLockedSendAlert && (
            <div className="p-3 rounded-xl bg-amber-500/20 border border-amber-500/50 text-amber-300 text-xs font-semibold flex items-center justify-between animate-in fade-in">
              <div className="flex items-center gap-2">
                <Lock className="w-4 h-4 flex-shrink-0 text-amber-400" />
                <span>Para enviar las invitaciones a tus invitados, el administrador debe validar primero el comprobante de pago de tu servicio contratado.</span>
              </div>
              <button 
                onClick={() => setShowLockedSendAlert(false)} 
                className="text-neutral-400 hover:text-white ml-2"
              >
                ✕
              </button>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="text-base font-cinzel font-bold text-white">Lista de Invitados & Cupos</h3>
              <p className="text-xs text-neutral-400">
                Genera enlaces personalizados, registra confirmaciones y {canSendInvitations ? 'envía invitaciones por WhatsApp.' : 'organiza a tus invitados mientras se valida el pago.'}
              </p>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setShowCsvModal(true)}
                className="px-3.5 py-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border border-neutral-700 flex items-center gap-1.5"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
                Importar CSV / Excel
              </button>

              <button
                onClick={() => setShowAddGuestModal(true)}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 shadow"
              >
                <Plus className="w-4 h-4" />
                Agregar Invitado
              </button>
            </div>
          </div>

          {/* Guests Table */}
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-montserrat">
                <thead className="bg-neutral-950 text-neutral-400 font-semibold border-b border-neutral-800">
                  <tr>
                    <th className="p-3.5">Nombre e Invitado</th>
                    <th className="p-3.5">Parentesco</th>
                    <th className="p-3.5">Teléfono</th>
                    <th className="p-3.5 text-center">Cupos (Max)</th>
                    <th className="p-3.5 text-center">Estado Asistencia</th>
                    <th className="p-3.5 text-center">Enlace Individual</th>
                    <th className="p-3.5 text-right">Acciones WhatsApp</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-neutral-800 text-neutral-300">
                  {guests.map((g) => {
                    const origin = window.location.origin;
                    const guestUrl = `${origin}/#guest=${g.inviteToken}`;
                    return (
                      <tr key={g.id} className="hover:bg-neutral-800/40 transition-colors">
                        <td className="p-3.5 font-bold text-white">{g.name}</td>
                        <td className="p-3.5 text-neutral-400">{g.relationship}</td>
                        <td className="p-3.5 font-mono text-neutral-400">{g.phone || '-'}</td>
                        <td className="p-3.5 text-center font-mono">
                          <span className="text-amber-300">{g.adultsMax} Mayores</span> / <span className="text-blue-300">{g.childrenMax} Menores</span>
                        </td>
                        <td className="p-3.5 text-center">
                          <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            g.attendance === 'confirmed' ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                            g.attendance === 'declined' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
                            'bg-amber-500/15 text-amber-300 border border-amber-500/30'
                          }`}>
                            {g.attendance === 'confirmed' ? `Asiste (${g.adultsConfirmed}+${g.childrenConfirmed})` :
                             g.attendance === 'declined' ? 'No Asiste' : 'Pendiente'}
                          </span>
                        </td>
                        <td className="p-3.5 text-center">
                          <div className="flex items-center justify-center gap-1.5">
                            <button
                              onClick={() => handleCopyLink(guestUrl, g.id)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300"
                              title="Copiar Enlace Personalizado"
                            >
                              <Copy className="w-3.5 h-3.5" />
                            </button>
                            {copiedId === g.id && (
                              <span className="text-[10px] text-emerald-400 font-bold">¡Copiado!</span>
                            )}
                          </div>
                        </td>
                        <td className="p-3.5 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {canSendInvitations ? (
                              <>
                                <a
                                  href={getWhatsAppInviteUrl(g)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                                  title="Enviar Invitación por WhatsApp"
                                >
                                  <Send className="w-3.5 h-3.5" />
                                </a>
                                <a
                                  href={getWhatsAppReminderUrl(g)}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="p-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white transition-colors"
                                  title="Enviar Recordatorio por WhatsApp"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </a>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => setShowLockedSendAlert(true)}
                                  className="p-1.5 rounded-lg bg-neutral-800/80 text-neutral-500 hover:text-amber-300 hover:bg-neutral-800 cursor-not-allowed flex items-center gap-1"
                                  title="Envío bloqueado: El administrador debe validar el pago del servicio antes de enviar a los invitados"
                                >
                                  <Lock className="w-3.5 h-3.5 text-amber-500/70" />
                                  <Send className="w-3.5 h-3.5 opacity-40" />
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setShowLockedSendAlert(true)}
                                  className="p-1.5 rounded-lg bg-neutral-800/80 text-neutral-500 hover:text-amber-300 hover:bg-neutral-800 cursor-not-allowed flex items-center gap-1"
                                  title="Recordatorio bloqueado: Se habilitará tras la verificación del pago"
                                >
                                  <MessageCircle className="w-3.5 h-3.5 opacity-40" />
                                </button>
                              </>
                            )}
                            <button
                              onClick={() => deleteGuest(currentProject.id, g.id)}
                              className="p-1.5 rounded-lg bg-neutral-800 hover:bg-red-950/60 text-neutral-400 hover:text-red-400"
                              title="Eliminar"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
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

      {/* TAB 4: FOTOS Y RECUERDOS */}
      {activeTab === 'photos' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-6 text-xs">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-cinzel font-bold text-white">Galería de la Invitación</h3>
              <p className="text-neutral-400">
                Límite de fotos para {plan.name}: {formData.carouselPhotos.length} / {plan.maxInvitationPhotos} fotos cargadas.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="file"
                ref={photoInputRef}
                accept="image/*"
                onChange={handlePhotoFileUpload}
                className="hidden"
              />
              <button
                type="button"
                onClick={() => photoInputRef.current?.click()}
                disabled={formData.carouselPhotos.length >= plan.maxInvitationPhotos}
                className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 disabled:opacity-50"
              >
                <Upload className="w-4 h-4" />
                Subir Foto desde Equipo
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {formData.carouselPhotos.map((photo, index) => (
              <div key={index} className="relative rounded-xl overflow-hidden aspect-square border border-neutral-800 group">
                <img src={photo} alt="" className="w-full h-full object-cover" />
                <button
                  onClick={() => handleRemovePhoto(index)}
                  className="absolute top-2 right-2 p-1.5 rounded-full bg-black/70 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"
                  title="Eliminar Foto"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
                <div className="absolute bottom-1 left-2 text-[10px] bg-black/60 px-1.5 py-0.5 rounded text-white">
                  #{index + 1}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 5: GOOGLE DRIVE 10 DÍAS */}
      {activeTab === 'drive' && (
        <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4 text-xs">
          <div className="flex items-start gap-3">
            <HardDrive className="w-8 h-8 text-amber-400 flex-shrink-0" />
            <div className="space-y-1">
              <h3 className="text-base font-cinzel font-bold text-white">Almacenamiento Temporal Google Drive</h3>
              <p className="text-neutral-400">
                Las fotos subidas por los invitados durante el evento quedan organizadas en una carpeta segura de Google Drive disponible durante 10 días posteriores a la fecha del evento.
              </p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2">
            <div className="flex items-center justify-between text-neutral-300">
              <span>Estado del Enlace Drive:</span>
              <span className="font-bold text-emerald-400">Activo (Válido hasta 2026-10-20)</span>
            </div>
            <div className="flex items-center justify-between text-neutral-300">
              <span>Carpeta Privada:</span>
              <a
                href={currentProject.googleDriveUrl || 'https://drive.google.com'}
                target="_blank"
                rel="noreferrer"
                className="text-amber-400 underline flex items-center gap-1"
              >
                Abrir Carpeta Google Drive
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>
            <p className="text-[11px] text-neutral-500 pt-2 border-t border-neutral-800">
              Nota comercial: Al finalizar los 10 días, el cliente puede solicitar una extensión de almacenamiento o descargar el archivo ZIP consolidado con todo el material del evento.
            </p>
          </div>
        </div>
      )}

      {/* ADD GUEST MODAL */}
      {showAddGuestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-sm w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="text-base font-cinzel font-bold text-white">Agregar Nuevo Invitado</h4>
              <button onClick={() => setShowAddGuestModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <form onSubmit={handleAddGuestSubmit} className="space-y-3">
              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Nombre o Familia</label>
                <input
                  type="text"
                  required
                  placeholder="Ej: Familia Rossi"
                  value={newGuestName}
                  onChange={(e) => setNewGuestName(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Parentesco / Vínculo</label>
                <input
                  type="text"
                  placeholder="Ej: Tíos, Amigos, Compañeros"
                  value={newGuestRel}
                  onChange={(e) => setNewGuestRel(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div>
                <label className="block text-neutral-400 mb-1 font-semibold">Teléfono con código de país</label>
                <input
                  type="tel"
                  placeholder="Ej: 5493835438603"
                  value={newGuestPhone}
                  onChange={(e) => setNewGuestPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Mayores Max</label>
                  <input
                    type="number"
                    min="1"
                    value={newGuestAdults}
                    onChange={(e) => setNewGuestAdults(parseInt(e.target.value, 10) || 1)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
                <div>
                  <label className="block text-neutral-400 mb-1 font-semibold">Menores Max</label>
                  <input
                    type="number"
                    min="0"
                    value={newGuestChildren}
                    onChange={(e) => setNewGuestChildren(parseInt(e.target.value, 10) || 0)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold transition-colors"
                >
                  Guardar Invitado
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CSV IMPORT MODAL */}
      {showCsvModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in">
          <div className="bg-neutral-900 border border-neutral-700 rounded-2xl max-w-lg w-full p-6 space-y-4 text-xs">
            <div className="flex items-center justify-between border-b border-neutral-800 pb-2">
              <h4 className="text-base font-cinzel font-bold text-white">Importar Invitados desde CSV</h4>
              <button onClick={() => setShowCsvModal(false)} className="text-neutral-400 hover:text-white">✕</button>
            </div>

            <p className="text-neutral-400">
              Pega líneas en formato: <code className="text-amber-300">Nombre, Parentesco, Teléfono, Adultos, Menores</code>
            </p>

            <textarea
              rows={6}
              value={csvContent}
              onChange={(e) => setCsvContent(e.target.value)}
              placeholder="Familia Rossi, Tíos, 5493835438603, 2, 1&#10;Martín Gómez, Amigo, 5491144556677, 1, 0"
              className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-700 text-white font-mono text-xs focus:outline-none focus:border-amber-500 resize-none"
            />

            {csvMessage && (
              <div className="p-2 rounded-lg bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-center font-bold">
                {csvMessage}
              </div>
            )}

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setShowCsvModal(false)}
                className="px-4 py-2 rounded-xl bg-neutral-800 text-neutral-300"
              >
                Cancelar
              </button>
              <button
                onClick={handleCsvImport}
                className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold"
              >
                Procesar e Importar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
