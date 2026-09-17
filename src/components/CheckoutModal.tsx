import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  Building2, 
  Sparkles, 
  Clock, 
  Upload,
  ArrowRight,
  AlertCircle,
  Copy,
  CheckCircle2,
  MessageCircle,
  ExternalLink,
  Settings,
  Calendar,
  Mail,
  Phone,
  FileCheck
} from 'lucide-react';
import { useStore } from '../lib/store';
import { DesignTemplate, PlanTier, Project } from '../types';
import { compressImageFile } from '../lib/imageCompression';

interface CheckoutModalProps {
  template: DesignTemplate;
  initialPlanId: PlanTier;
  onClose: () => void;
  onSuccess: (projectId: string) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({ 
  template, 
  initialPlanId, 
  onClose, 
  onSuccess 
}) => {
  const { plans, createOrder } = useStore();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(initialPlanId);
  const [paymentMethod] = useState<'transfer'>('transfer');
  
  // Form fields
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(true); // Checked by default to prevent blocking
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Success state: holds the newly created project once submitted
  const [createdOrder, setCreatedOrder] = useState<Project | null>(null);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const [compressingReceipt, setCompressingReceipt] = useState(false);

  const handleReceiptUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setCompressingReceipt(true);
    try {
      const compressed = await compressImageFile(file, 800, 800, 0.75);
      setReceiptFile(compressed);
    } catch (err) {
      console.warn('Compression error, falling back to FileReader:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        setReceiptFile(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setCompressingReceipt(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    const cleanName = honoreeName.trim();
    const cleanEmail = clientEmail.trim();
    const cleanPhone = clientPhone.trim();

    if (!cleanName) {
      setFormError('Por favor ingresa el nombre de los homenajeados o pareja.');
      return;
    }
    if (!cleanEmail) {
      setFormError('Por favor ingresa un correo electrónico de contacto.');
      return;
    }
    if (!cleanPhone) {
      setFormError('Por favor ingresa tu número de WhatsApp para contacto y validación.');
      return;
    }

    if (!acceptedTerms) {
      setAcceptedTerms(true);
    }

    setLoading(true);

    try {
      const newProj = createOrder({
        eventType: template.eventType,
        templateId: template.id,
        planId: selectedPlanId,
        clientEmail: cleanEmail,
        honoreeName: cleanName,
        clientPhone: cleanPhone,
        eventDate: eventDate || template.sampleDate,
        receiptUrl: receiptFile || undefined,
        paymentMethod: 'transfer'
      });

      setLoading(false);
      setCreatedOrder(newProj);
    } catch (err) {
      console.error('Error al procesar la orden:', err);
      setLoading(false);
      setFormError('Ocurrió un inconveniente al registrar la orden. Por favor intente nuevamente.');
    }
  };

  // WhatsApp dispatch message to Héctor René González Quiroga (+54 9 3835 438603)
  const getWhatsAppUrl = (order: Project) => {
    const adminPhone = '5493835438603';
    const message = 
      `¡Hola Héctor! Acabo de registrar mi pedido de invitación digital en TuInvitacionDigital:\n\n` +
      `📋 N° de Pedido: #${order.orderNumber || order.id}\n` +
      `👤 Homenajeado(s): ${order.honoreeName}\n` +
      `💍 Tipo de Evento: ${order.eventType}\n` +
      `📦 Plan Contratado: ${selectedPlan.name.toUpperCase()} ($${selectedPlan.price.toLocaleString('es-AR')} ARS)\n` +
      `📅 Fecha del Evento: ${order.eventDate}\n` +
      `📧 Mi Correo: ${order.clientEmail}\n` +
      `📱 Mi WhatsApp: ${order.clientPhone || 'No especificado'}\n` +
      `💳 Método: Transferencia Bancaria (Alias: hgonzalez.bru.2499)\n\n` +
      `Te envío este mensaje para coordinar la verificación del comprobante y habilitar la vista previa de 24 horas. ¡Muchas gracias!`;
    return `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-xs font-montserrat my-8 relative shadow-2xl overflow-hidden">
        
        {/* Glow accent */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white transition-colors"
          title="Cerrar ventana"
        >
          <X className="w-4 h-4" />
        </button>

        {/* ------------------------------------------------------------- */}
        {/* VIEW 1: SUCCESS CONFIRMATION SCREEN (When order was registered) */}
        {/* ------------------------------------------------------------- */}
        {createdOrder ? (
          <div className="space-y-6 animate-in zoom-in-95 duration-200">
            {/* Header Success */}
            <div className="text-center space-y-2 pt-2">
              <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-400 flex items-center justify-center mx-auto shadow-lg shadow-emerald-950/50 animate-bounce">
                <CheckCircle2 className="w-9 h-9" />
              </div>
              <div className="inline-block px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-[11px] font-bold font-mono tracking-wider">
                ✓ PEDIDO INGRESADO CON ÉXITO
              </div>
              <h3 className="text-2xl font-cinzel font-bold text-white">
                ¡Tu Solicitud Fue Recibida!
              </h3>
              <p className="text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                El pedido ya fue registrado en el sistema y se encuentra en la bandeja del administrador con la ventana de revisión de 24 horas activada.
              </p>
            </div>

            {/* Order Summary Card */}
            <div className="p-4 rounded-2xl bg-neutral-950/90 border border-neutral-800 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 border-b border-neutral-800/80">
                <div>
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block font-mono">
                    Identificador de Orden
                  </span>
                  <span className="text-amber-300 font-mono font-bold text-sm">
                    #{createdOrder.orderNumber || createdOrder.id}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 block">
                    Total Acordado
                  </span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">
                    ${selectedPlan.price.toLocaleString('es-AR')} ARS
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div>
                  <span className="text-neutral-400 block text-[10px]">Homenajeados:</span>
                  <span className="font-semibold text-white truncate block">{createdOrder.honoreeName}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Plan Seleccionado:</span>
                  <span className="font-semibold text-amber-300 capitalize block">Plan {selectedPlan.name}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Fecha del Evento:</span>
                  <span className="font-mono text-neutral-300 block">{createdOrder.eventDate}</span>
                </div>
                <div>
                  <span className="text-neutral-400 block text-[10px]">Estado Actual:</span>
                  <span className="font-bold text-amber-400 block flex items-center gap-1">
                    <Clock className="w-3 h-3" /> Pago en Revisión
                  </span>
                </div>
              </div>

              {createdOrder.receiptUrl ? (
                <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 flex items-center gap-2 text-[11px]">
                  <FileCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>Comprobante de transferencia adjuntado correctamente.</span>
                </div>
              ) : (
                <div className="p-2.5 rounded-xl bg-amber-950/30 border border-amber-800/50 text-amber-300 flex items-center gap-2 text-[11px]">
                  <AlertCircle className="w-4 h-4 text-amber-400 flex-shrink-0" />
                  <span>Comprobante pendiente. Puedes enviarlo directamente al WhatsApp de Héctor.</span>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="space-y-2.5 pt-1">
              {/* Main Action: Send directly to Héctor René González Quiroga via WhatsApp */}
              <a
                href={getWhatsAppUrl(createdOrder)}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-3.5 px-4 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2.5 shadow-lg shadow-emerald-950/50 transition-all active:scale-[0.99]"
              >
                <MessageCircle className="w-4 h-4 fill-white text-emerald-600" />
                <span>📲 Enviar Pedido a Héctor por WhatsApp (+54 9 3835 438603)</span>
                <ExternalLink className="w-3.5 h-3.5 opacity-80" />
              </a>

              {/* Secondary Action: Go to Client Portal to customize */}
              <button
                type="button"
                onClick={() => onSuccess(createdOrder.id)}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-400 hover:to-yellow-300 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-md transition-all active:scale-[0.99]"
              >
                <Sparkles className="w-4 h-4 text-neutral-950" />
                <span>🎨 Ir a Personalizar mi Invitación Ahora</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              {/* Tertiary: Quick Access for Admin */}
              <div className="flex items-center justify-between pt-2 border-t border-neutral-800 text-[11px]">
                <a
                  href="/Maximo1822"
                  className="text-neutral-400 hover:text-blue-400 inline-flex items-center gap-1.5 transition-colors"
                >
                  <Settings className="w-3.5 h-3.5 text-blue-400" />
                  <span>Ver en Panel de Administrador (/Maximo1822)</span>
                </a>

                <button
                  type="button"
                  onClick={onClose}
                  className="text-neutral-400 hover:text-white transition-colors"
                >
                  Cerrar y volver al catálogo
                </button>
              </div>
            </div>
          </div>
        ) : (
          /* ------------------------------------------------------------- */
          /* VIEW 2: ORDER CONTRACT FORM                                   */
          /* ------------------------------------------------------------- */
          <>
            {/* Title */}
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold">
                <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                Contratación & Reserva Inmediata
              </div>
              <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
                Personalizar Invitación Digital
              </h3>
              <p className="text-neutral-400">
                Diseño seleccionado: <span className="text-white font-semibold">{template.name}</span> ({template.eventType})
              </p>
            </div>

            {formError && (
              <div className="p-3 rounded-xl bg-red-950/50 border border-red-800/80 text-red-300 text-xs flex items-center gap-2 animate-in fade-in">
                <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-400" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              
              {/* Plan Selector */}
              <div>
                <label className="block text-neutral-300 mb-2 font-semibold">Selecciona el Plan Deseado:</label>
                <div className="grid grid-cols-3 gap-2">
                  {plans.map((p) => (
                    <button
                      type="button"
                      key={p.id}
                      onClick={() => setSelectedPlanId(p.id)}
                      className={`p-3 rounded-2xl border text-left transition-all ${
                        selectedPlanId === p.id 
                          ? 'bg-amber-500/15 border-amber-500 text-white shadow-md' 
                          : 'bg-neutral-950/60 border-neutral-800 text-neutral-400 hover:border-neutral-700'
                      }`}
                    >
                      <div className="font-cinzel font-bold text-sm text-white capitalize">{p.name}</div>
                      <div className="text-amber-400 font-bold font-mono mt-1">
                        ${p.price.toLocaleString('es-AR')}
                      </div>
                      <div className="text-[10px] text-neutral-400 mt-1">
                        {p.maxGuests} personas
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">
                    Homenajeado(s) o Pareja <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="Ej: Sofía & Valentín"
                    value={honoreeName}
                    onChange={(e) => {
                      setHonoreeName(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">
                    Fecha Estimada del Evento
                  </label>
                  <input
                    type="date"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">
                    Correo Electrónico <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="tu@email.com"
                    value={clientEmail}
                    onChange={(e) => {
                      setClientEmail(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>

                <div>
                  <label className="block text-neutral-300 mb-1 font-semibold">
                    WhatsApp de Contacto <span className="text-amber-400">*</span>
                  </label>
                  <input
                    type="tel"
                    required
                    placeholder="Ej: +54 9 3835 441122"
                    value={clientPhone}
                    onChange={(e) => {
                      setClientPhone(e.target.value);
                      if (formError) setFormError(null);
                    }}
                    className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500 text-xs"
                  />
                </div>
              </div>

              {/* Payment Method Details */}
              <div>
                <label className="block text-neutral-300 mb-1.5 font-semibold">Método de Pago:</label>
                <div className="p-3 rounded-xl border bg-emerald-950/40 border-emerald-500/80 text-white flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-white text-xs sm:text-sm">Transferencia Bancaria</div>
                      <div className="text-[10px] text-neutral-400">Depósito o transferencia por Alias / CBU con verificación</div>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                    Oficial Habilitado
                  </span>
                </div>
              </div>

              {/* Bank Details Box */}
              <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-[11px] text-neutral-300">
                <div className="font-bold text-white text-xs flex items-center justify-between">
                  <span>Datos Oficiales para Transferencia:</span>
                  <span className="text-[10px] text-emerald-400 font-medium">Caja de Ahorro en Pesos (ARS)</span>
                </div>
                
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <span><strong>Titular:</strong> Héctor René González Quiroga</span>
                    <span className="text-[10px] text-neutral-400 font-mono">CUIT: 20-30949816-0</span>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-400 mr-2">Alias:</span>
                      <code className="text-amber-300 font-bold font-mono">hgonzalez.bru.2499</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('hgonzalez.bru.2499', 'alias')}
                      className="p-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                    >
                      {copiedKey === 'alias' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'alias' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-400 mr-2">CBU:</span>
                      <code className="text-amber-300 font-mono text-[11px]">1430001713024956100018</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('1430001713024956100018', 'cbu')}
                      className="p-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                    >
                      {copiedKey === 'cbu' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cbu' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="flex items-center justify-between bg-neutral-900/90 px-3 py-1.5 rounded-xl border border-neutral-800">
                    <div>
                      <span className="text-neutral-400 mr-2">N° de Cuenta:</span>
                      <code className="text-neutral-200 font-mono text-[11px]">1302495610001</code>
                    </div>
                    <button
                      type="button"
                      onClick={() => handleCopy('1302495610001', 'cuenta')}
                      className="p-1 px-2 rounded-lg bg-neutral-800 hover:bg-neutral-700 text-neutral-300 hover:text-white flex items-center gap-1 text-[10px] transition-colors"
                    >
                      {copiedKey === 'cuenta' ? <CheckCircle2 className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedKey === 'cuenta' ? 'Copiado' : 'Copiar'}</span>
                    </button>
                  </div>

                  <div className="text-[10px] text-neutral-400 pt-0.5">
                    Email de confirmación / aviso: <span className="text-neutral-300 font-mono">hrgq.1984@gmail.com</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-neutral-800/80">
                  <label className="block text-neutral-300 mb-1 font-semibold">Adjuntar Comprobante de Transferencia (Opcional):</label>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleReceiptUpload}
                    className="w-full text-neutral-400 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-amber-300 hover:file:bg-neutral-700 cursor-pointer"
                  />
                  {compressingReceipt && (
                    <div className="text-amber-400 font-bold mt-1 text-[10px] flex items-center gap-1">
                      <Clock className="w-3 h-3 animate-spin" /> Optimizando imagen de comprobante...
                    </div>
                  )}
                  {receiptFile && !compressingReceipt && (
                    <div className="text-emerald-400 font-bold mt-1 text-[10px] flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Comprobante optimizado y adjunto correctamente
                    </div>
                  )}
                </div>
              </div>

              {/* Review Window 24h Assurance Terms */}
              <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
                <div className="flex items-start gap-2 text-neutral-300 text-[11px]">
                  <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <strong>Garantía de Revisión de 24 Horas:</strong> Al ingresar tu orden, se activa una ventana de revisión en donde podrás ajustar textos, fotos y detalles antes de la publicación definitiva.
                  </div>
                </div>

                <label className="flex items-center gap-2 text-[11px] text-neutral-300 cursor-pointer pt-1">
                  <input
                    type="checkbox"
                    checked={acceptedTerms}
                    onChange={(e) => setAcceptedTerms(e.target.checked)}
                    className="rounded bg-neutral-900 border-neutral-700 text-amber-500 focus:ring-0"
                  />
                  <span>Acepto las condiciones comerciales y la ventana de revisión de 24 horas.</span>
                </label>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all cursor-pointer active:scale-[0.99]"
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <Clock className="w-4 h-4 animate-spin text-neutral-950" />
                    Ingresando pedido al sistema...
                  </span>
                ) : (
                  <>
                    <span>Confirmar e Ingresar Pedido (${selectedPlan.price.toLocaleString('es-AR')} ARS)</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
};
