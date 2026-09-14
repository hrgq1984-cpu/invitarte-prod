import React, { useState } from 'react';
import { 
  X, 
  Check, 
  ShieldCheck, 
  CreditCard, 
  Building2, 
  Sparkles, 
  Clock, 
  Upload,
  ArrowRight,
  AlertCircle,
  Copy,
  CheckCircle2
} from 'lucide-react';
import { useStore } from '../lib/store';
import { DesignTemplate, EventType, PlanTier } from '../types';

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
  const { plans, createNewProject } = useStore();
  const [selectedPlanId, setSelectedPlanId] = useState<PlanTier>(initialPlanId);
  const [paymentMethod, setPaymentMethod] = useState<'mercadopago' | 'transfer'>('mercadopago');
  
  // Form fields
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [honoreeName, setHonoreeName] = useState('');
  const [eventDate, setEventDate] = useState('');
  const [receiptFile, setReceiptFile] = useState<string | null>(null);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);

  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const selectedPlan = plans.find(p => p.id === selectedPlanId) || plans[0];

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReceiptFile(ev.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptedTerms) {
      alert('Debes aceptar los términos y condiciones de la ventana de revisión de 24 horas.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      const newProj = createNewProject(
        template.eventType,
        selectedPlanId,
        template.id,
        clientEmail || 'cliente@ejemplo.com',
        honoreeName || 'Mi Celebración',
        eventDate || '2026-10-10'
      );
      setLoading(false);
      onSuccess(newProj.id);
    }, 1000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-in fade-in">
      <div className="bg-neutral-900 border border-neutral-800 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 text-xs font-montserrat my-8 relative shadow-2xl">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-neutral-800 text-neutral-400 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Title */}
        <div className="space-y-1">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 text-[11px] font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Contratación & Reserva Segura
          </div>
          <h3 className="text-xl sm:text-2xl font-cinzel font-bold text-white">
            Personalizar Invitación Digital
          </h3>
          <p className="text-neutral-400">
            Diseño seleccionado: <span className="text-white font-semibold">{template.name}</span> ({template.eventType})
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Plan Selector */}
          <div>
            <label className="block text-neutral-400 mb-2 font-semibold">Selecciona el Plan Deseado:</label>
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
              <label className="block text-neutral-400 mb-1 font-semibold">Homenajeado(s) o Pareja *</label>
              <input
                type="text"
                required
                placeholder="Ej: Sofía & Valentín"
                value={honoreeName}
                onChange={(e) => setHonoreeName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Fecha Estimada del Evento *</label>
              <input
                type="date"
                required
                value={eventDate}
                onChange={(e) => setEventDate(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">Correo Electrónico *</label>
              <input
                type="email"
                required
                placeholder="tu@email.com"
                value={clientEmail}
                onChange={(e) => setClientEmail(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>

            <div>
              <label className="block text-neutral-400 mb-1 font-semibold">WhatsApp de Contacto *</label>
              <input
                type="tel"
                required
                placeholder="Ej: +54 9 3835 438603"
                value={clientPhone}
                onChange={(e) => setClientPhone(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-neutral-950 border border-neutral-800 text-white focus:outline-none focus:border-amber-500"
              />
            </div>
          </div>

          {/* Payment Method Selector */}
          <div>
            <label className="block text-neutral-400 mb-2 font-semibold">Método de Pago:</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod('mercadopago')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  paymentMethod === 'mercadopago'
                    ? 'bg-blue-950/40 border-blue-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <CreditCard className="w-5 h-5 text-blue-400" />
                <div className="text-left">
                  <div className="font-bold text-white">Mercado Pago</div>
                  <div className="text-[10px] text-neutral-400">Tarjetas / Dinero en cuenta</div>
                </div>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod('transfer')}
                className={`p-3 rounded-xl border flex items-center gap-2.5 ${
                  paymentMethod === 'transfer'
                    ? 'bg-emerald-950/40 border-emerald-500 text-white'
                    : 'bg-neutral-950 border-neutral-800 text-neutral-400'
                }`}
              >
                <Building2 className="w-5 h-5 text-emerald-400" />
                <div className="text-left">
                  <div className="font-bold text-white">Transferencia Bancaria</div>
                  <div className="text-[10px] text-neutral-400">Alias / CVU con comprobante</div>
                </div>
              </button>
            </div>
          </div>

          {/* Bank Transfer Details Box if Selected */}
          {paymentMethod === 'transfer' && (
            <div className="p-4 rounded-2xl bg-neutral-950 border border-neutral-800 space-y-2.5 text-[11px] text-neutral-300">
              <div className="font-bold text-white text-xs flex items-center justify-between">
                <span>Datos Bancarios Oficiales para Transferencia:</span>
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
                <label className="block text-neutral-300 mb-1 font-semibold">Adjuntar Comprobante de Transferencia:</label>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleReceiptUpload}
                  className="w-full text-neutral-400 text-xs file:mr-3 file:py-1 file:px-3 file:rounded-lg file:border-0 file:text-xs file:bg-neutral-800 file:text-amber-300 hover:file:bg-neutral-700 cursor-pointer"
                />
                {receiptFile && (
                  <div className="text-emerald-400 font-bold mt-1 text-[10px]">✓ Comprobante cargado correctamente</div>
                )}
              </div>
            </div>
          )}

          {/* Review Window 24h Assurance Terms */}
          <div className="p-3.5 rounded-2xl bg-neutral-950/80 border border-neutral-800 space-y-2">
            <div className="flex items-start gap-2 text-neutral-300 text-[11px]">
              <Clock className="w-4 h-4 text-amber-400 flex-shrink-0 mt-0.5" />
              <div>
                <strong>Garantía de Revisión de 24 Horas:</strong> Una vez efectuado el pago, tu orden entra en una ventana de revisión donde podrás ajustar textos, fotos y detalles antes de la publicación definitiva.
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
            disabled={loading || !acceptedTerms}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-yellow-400 hover:from-amber-600 hover:to-yellow-500 text-neutral-950 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 transition-all"
          >
            {loading ? (
              <span>Procesando solicitud...</span>
            ) : (
              <>
                <span>Confirmar y Contratar (${selectedPlan.price.toLocaleString('es-AR')} ARS)</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};
