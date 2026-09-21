import React, { useState, useEffect, useRef } from 'react';
import confetti from 'canvas-confetti';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Clock, 
  Music, 
  Volume2, 
  VolumeX, 
  Share2, 
  CheckCircle, 
  XCircle, 
  Copy, 
  ExternalLink, 
  Camera, 
  Send, 
  ChevronLeft, 
  ChevronRight, 
  Gift, 
  Sparkles, 
  Shirt, 
  MessageSquareHeart, 
  Download,
  AlertCircle
} from 'lucide-react';
import { useStore } from '../lib/store';
import { ambientAudio } from '../lib/audioSynth';
import { EventSettings, Guest, Plan, DesignTemplate, isCeremonySupported } from '../types';
import { compressImageFile } from '../lib/imageCompression';

interface InvitationViewProps {
  guestToken?: string;
  isMockupFrame?: boolean;
  onOpenTvMode?: () => void;
  activeTemplate?: DesignTemplate;
  customSettings?: EventSettings;
}

export const InvitationView: React.FC<InvitationViewProps> = ({ 
  guestToken, 
  isMockupFrame = false,
  onOpenTvMode,
  activeTemplate,
  customSettings
}) => {
  const { 
    currentProject, 
    currentEventSettings, 
    plans, 
    guests, 
    blessings, 
    photos, 
    addBlessing, 
    addPhoto, 
    submitRsvp 
  } = useStore();

  // Resolved active event settings (customSettings override for real-time live preview)
  const settings = customSettings || currentEventSettings;

  // Resolve active plan dynamically based on activeTemplate if provided, or currentProject
  const plan = activeTemplate
    ? plans.find(p => p.id === activeTemplate.requiredPlan) || plans[0]
    : (plans.find(p => p.id === currentProject.planId) || plans[0]);

  // Resolve effective event type and ceremony support
  const effectiveEventType = activeTemplate?.eventType || currentProject.eventType;
  const ceremonyEligible = isCeremonySupported(effectiveEventType);
  const showCeremony = ceremonyEligible && settings.hasCeremony !== false;

  // Is this Plan Oro (has envelope animation and VIP features)
  const isPlanOro = (plan && plan.id === 'oro') || (activeTemplate && activeTemplate.requiredPlan === 'oro') || Boolean(plan?.hasEnvelopeAnimation);

  // Specific invited guest if token matches
  const guest = guests.find(g => g.inviteToken === guestToken) || guests[0] || null;

  // Envelope state (only active if plan has envelope animation)
  const [envelopeOpened, setEnvelopeOpened] = useState<boolean>(() => {
    return !isPlanOro;
  });
  const [isOpeningEnvelope, setIsOpeningEnvelope] = useState<boolean>(false);

  // Sync envelope state whenever template or plan changes
  useEffect(() => {
    if (isPlanOro) {
      setEnvelopeOpened(false);
    } else {
      setEnvelopeOpened(true);
    }
  }, [activeTemplate?.id, plan?.id, isPlanOro]);

  // Audio state
  const [isPlayingAudio, setIsPlayingAudio] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(false);

  // Active countdown target: 'ceremony' | 'party'
  const [countdownTarget, setCountdownTarget] = useState<'ceremony' | 'party'>('ceremony');
  const [timeLeft, setTimeLeft] = useState<{ days: number; hours: number; minutes: number; seconds: number }>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  // Active carousel photo
  const [activePhotoIdx, setActivePhotoIdx] = useState<number>(0);
  const [watermarkEnabled, setWatermarkEnabled] = useState<boolean>(false);

  // Modals
  const [showRsvpModal, setShowRsvpModal] = useState<boolean>(false);
  const [showBankModal, setShowBankModal] = useState<boolean>(false);
  const [copiedText, setCopiedText] = useState<string | null>(null);

  // RSVP Form State
  const [rsvpAttendance, setRsvpAttendance] = useState<'confirmed' | 'declined'>('confirmed');
  const [adultsCount, setAdultsCount] = useState<number>(guest ? guest.adultsMax : 1);
  const [childrenCount, setChildrenCount] = useState<number>(guest ? guest.childrenMax : 0);
  const [rsvpMessage, setRsvpMessage] = useState<string>('');
  const [rsvpSuccess, setRsvpSuccess] = useState<boolean>(false);

  // Blessing Form State
  const [blessingAuthor, setBlessingAuthor] = useState<string>(guest ? guest.name : '');
  const [blessingMessage, setBlessingMessage] = useState<string>('');
  const [blessingSent, setBlessingSent] = useState<boolean>(false);

  // Guest Live Photo Upload State
  const [uploadAuthor, setUploadAuthor] = useState<string>(guest ? guest.name : '');
  const [uploadingPhoto, setUploadingPhoto] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Countdown timer logic
  useEffect(() => {
    const calculateTime = () => {
      const eventDateStr = settings.date;
      const eventTimeStr = showCeremony
        ? (countdownTarget === 'party' 
            ? (settings.partyTime || '13:00') 
            : (settings.ceremonyTime || settings.time || '11:00'))
        : (settings.partyTime || settings.time || '21:30');
      
      const targetDate = new Date(`${eventDateStr}T${eventTimeStr}:00`);
      const now = new Date();
      const diff = targetDate.getTime() - now.getTime();

      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);

      setTimeLeft({ days, hours, minutes, seconds });
    };

    calculateTime();
    const interval = setInterval(calculateTime, 1000);
    return () => clearInterval(interval);
  }, [settings.date, settings.time, settings.ceremonyTime, settings.partyTime, countdownTarget, showCeremony]);

  // Open Envelope Animation with Audio Unlock
  const handleOpenEnvelope = () => {
    setIsOpeningEnvelope(true);
    // Play ceremonial chord sequence
    ambientAudio.playCeremonialChord([523.25, 659.25, 783.99, 1046.50]); // C major arpeggio
    
    // Trigger confetti explosion
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 }
      });
    } catch {
      // Confetti fallback
    }

    // Start background stream or synth melody after gesture
    setTimeout(() => {
      ambientAudio.playStream(settings.selectedMusicUrl);
      setIsPlayingAudio(true);
      setEnvelopeOpened(true);
      setIsOpeningEnvelope(false);
    }, 1100);
  };

  const handleToggleMusic = () => {
    if (isPlayingAudio) {
      ambientAudio.pause();
      setIsPlayingAudio(false);
    } else {
      ambientAudio.playStream(settings.selectedMusicUrl);
      setIsPlayingAudio(true);
    }
  };

  const handleToggleMute = () => {
    const muted = ambientAudio.toggleMute();
    setIsMuted(muted);
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setCopiedText(label);
    setTimeout(() => setCopiedText(null), 2500);
  };

  const handleDownloadCalendarIcs = () => {
    const eventTimeStr = showCeremony
      ? (settings.ceremonyTime || '11:00')
      : (settings.partyTime || settings.time || '21:30');
    const start = `${settings.date.replace(/-/g, '')}T${eventTimeStr.replace(':', '')}00`;
    const icsContent = [
      'BEGIN:VCALENDAR',
      'VERSION:2.0',
      'PRODID:-//TuInvitacionDigital//Digital Invitation//ES',
      'BEGIN:VEVENT',
      `SUMMARY:${settings.title} - ${settings.honoreeName}`,
      `DESCRIPTION:${settings.initialPhrase}`,
      `LOCATION:${settings.locationName}, ${settings.address}`,
      `DTSTART:${start}`,
      `DTEND:${start}`,
      'END:VEVENT',
      'END:VCALENDAR'
    ].join('\r\n');

    const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `evento-${settings.honoreeName.toLowerCase().replace(/\s+/g, '-')}.ics`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    submitRsvp({
      projectId: currentProject.id,
      guestId: guest ? guest.id : 'guest-manual',
      guestName: guest ? guest.name : 'Invitado',
      attendance: rsvpAttendance,
      adultsCount,
      childrenCount,
      accompaniedByAdult: true,
      message: rsvpMessage
    });

    setRsvpSuccess(true);
    try {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    } catch {}

    // Also offer WhatsApp confirmation link
    setTimeout(() => {
      setShowRsvpModal(false);
      setRsvpSuccess(false);
    }, 2800);
  };

  const getWhatsAppRsvpUrl = () => {
    const adminPhone = '5493835438603';
    const text = encodeURIComponent(
      `¡Hola! Confirmo mi asistencia para ${settings.title} de ${settings.honoreeName}:\n` +
      `👤 Invitado: ${guest ? guest.name : 'Invitado'}\n` +
      `✅ Estado: ${rsvpAttendance === 'confirmed' ? 'ASISTIRÉ' : 'NO PODRÉ ASISTIR'}\n` +
      `👥 Adultos: ${adultsCount} | Menores: ${childrenCount}\n` +
      (rsvpMessage ? `💬 Mensaje: ${rsvpMessage}` : '')
    );
    return `https://wa.me/${adminPhone}?text=${text}`;
  };

  const handleBlessingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!blessingAuthor.trim() || !blessingMessage.trim()) return;
    addBlessing(currentProject.id, blessingAuthor, blessingMessage);
    setBlessingMessage('');
    setBlessingSent(true);
    setTimeout(() => setBlessingSent(false), 3000);
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];

    setUploadingPhoto(true);
    try {
      const dataUrl = await compressImageFile(file, 900, 900, 0.75);
      addPhoto(currentProject.id, {
        source: 'event',
        url: dataUrl,
        author: uploadAuthor || (guest ? guest.name : 'Invitado del Evento'),
        status: 'approved',
        watermarkEnabled: true
      });
      setUploadingPhoto(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
      try {
        confetti({ particleCount: 30, spread: 45 });
      } catch {}
    } catch (err) {
      console.warn('Fallback file reader:', err);
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target?.result as string;
        addPhoto(currentProject.id, {
          source: 'event',
          url: dataUrl,
          author: uploadAuthor || (guest ? guest.name : 'Invitado del Evento'),
          status: 'approved',
          watermarkEnabled: true
        });
        setUploadingPhoto(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      };
      reader.readAsDataURL(file);
    }
  };

  const carouselImages = settings.carouselPhotos.length > 0
    ? settings.carouselPhotos
    : [settings.coverPhotoUrl];

  // 1. STANDALONE SOBRE DE APERTURA (Plan Oro: perfectly centered in phone viewport until opened)
  if (!envelopeOpened && isPlanOro) {
    return (
      <div 
        id="envelope-entry-screen"
        className="w-full h-full min-h-[600px] flex flex-col items-center justify-center p-4 bg-neutral-950 text-neutral-100 relative overflow-hidden"
        style={{
          minHeight: isMockupFrame ? '100%' : '100vh',
          backgroundColor: '#0a0a0f'
        }}
      >
        {/* Subtle background glow matching envelope color */}
        <div 
          className="absolute inset-0 opacity-25 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 40%, ${settings.envelopeColor || '#c59b27'} 0%, transparent 70%)`
          }}
        />

        <div className="w-full max-w-sm flex flex-col items-center text-center my-auto relative z-10 animate-in zoom-in-95 duration-500">
          
          <div 
            className={`relative w-full aspect-[4/3] rounded-2xl shadow-2xl p-5 sm:p-6 flex flex-col items-center justify-center border-2 border-amber-400/50 transition-all duration-700 ${
              isOpeningEnvelope ? 'scale-105 -translate-y-4 opacity-90' : 'hover:scale-[1.02]'
            }`}
            style={{
              backgroundColor: settings.envelopeColor || '#c59b27',
              backgroundImage: 'radial-gradient(circle at 50% 20%, rgba(255,255,255,0.25), transparent 70%)'
            }}
          >
            {/* Envelope flap lines */}
            <div className="absolute top-0 left-0 right-0 h-1/2 border-b-2 border-amber-600/30 clip-triangle pointer-events-none" />

            {/* Guest destination badge */}
            <div className="bg-neutral-950/60 backdrop-blur-md px-3.5 py-1.5 rounded-full border border-amber-300/40 text-amber-100 text-xs font-montserrat tracking-wide mb-3">
              {guest ? `Para: ${guest.name}` : 'Especialmente para ti y tu familia'}
            </div>

            <div className="text-white text-base font-cinzel font-bold tracking-wider mb-1 line-clamp-1">
              {settings.title}
            </div>
            <div className="text-amber-100 text-sm font-serif-luxury italic mb-4 line-clamp-1">
              {settings.honoreeName}
            </div>

            {/* Wax Seal Button (Click to open & unlock music) */}
            <button
              id="btn-open-wax-seal"
              onClick={handleOpenEnvelope}
              disabled={isOpeningEnvelope}
              className={`group relative w-16 h-16 rounded-full bg-gradient-to-tr from-amber-700 via-amber-600 to-yellow-400 border-2 border-yellow-200 shadow-xl flex items-center justify-center text-white transition-all transform active:scale-95 ${
                isOpeningEnvelope ? 'animate-spin' : 'hover:scale-110 animate-pulse'
              }`}
              title="Toca para abrir la invitación y comenzar la música"
            >
              <div className="w-12 h-12 rounded-full border border-yellow-300/40 flex items-center justify-center font-cinzel font-bold text-lg shadow-inner">
                {settings.waxSealText || 'ST'}
              </div>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="mt-5 w-full max-w-xs space-y-2">
            <button
              id="btn-open-envelope-action"
              onClick={handleOpenEnvelope}
              disabled={isOpeningEnvelope}
              className="w-full py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 via-yellow-400 to-amber-500 text-neutral-950 font-bold text-xs shadow-lg shadow-amber-950/50 flex items-center justify-center gap-2 transition-transform active:scale-95 hover:opacity-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>{isOpeningEnvelope ? 'Abriendo Sobre...' : 'Abrir Sobre con Música ✨'}</span>
            </button>

            <button
              id="btn-skip-envelope"
              onClick={() => setEnvelopeOpened(true)}
              className="w-full py-1.5 text-xs text-amber-200/80 hover:text-white transition-colors underline underline-offset-4"
            >
              Ver invitación directamente (Saltar sobre) ⏩
            </button>
          </div>

          <p className="mt-3 text-neutral-400 text-[11px] font-montserrat">
            Al pulsar se abrirá la invitación con música y efectos exclusivos del Plan Oro.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="relative min-h-screen text-neutral-800 transition-colors overflow-x-hidden"
      style={{ 
        backgroundColor: settings.secondaryColor || '#fdfbf7',
        color: '#2d241e'
      }}
    >
      {/* Floating Audio Controller Bar */}
      <div className="sticky top-2 z-40 max-w-sm mx-auto px-3">
        <div className="bg-white/90 backdrop-blur-md border border-amber-200/80 shadow-md rounded-full px-3 py-1.5 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2 overflow-hidden">
            <button
              onClick={handleToggleMusic}
              className="w-7 h-7 rounded-full bg-amber-500/10 text-amber-800 flex items-center justify-center hover:bg-amber-500/20 transition-colors"
              title={isPlayingAudio ? 'Pausar música' : 'Reproducir música'}
            >
              <Music className={`w-3.5 h-3.5 ${isPlayingAudio ? 'animate-bounce text-amber-600' : ''}`} />
            </button>
            <div className="truncate text-[11px] font-medium text-amber-950">
              {settings.musicTitle || 'Música de Fondo'}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              onClick={handleToggleMute}
              className="p-1 text-neutral-600 hover:text-amber-800 transition-colors"
              title={isMuted ? 'Activar sonido' : 'Silenciar'}
            >
              {isMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5" />}
            </button>

            {isPlanOro && (
              <button
                onClick={() => setEnvelopeOpened(false)}
                className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300/80 text-[10px] font-semibold hover:bg-amber-200 transition-colors"
                title="Volver a ver la apertura de sobre"
              >
                ✉️ Sobre
              </button>
            )}

            {plan.hasTvMode && onOpenTvMode && (
              <button
                onClick={onOpenTvMode}
                className="px-2 py-0.5 rounded-full bg-purple-50 text-purple-700 border border-purple-200 text-[10px] font-semibold hover:bg-purple-100 transition-colors"
                title="Abrir pantalla interactiva para TV"
              >
                Modo TV
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Invitation Body Container */}
      <div className="max-w-md mx-auto px-4 pb-20 pt-4 space-y-8 font-serif-luxury">
        
        {/* HEADER / HERO SECTION */}
        <section className="text-center space-y-4 pt-2">
          {/* Personalized Greeting Header */}
          {guest && (
            <div className="inline-block bg-amber-100/70 border border-amber-300/60 px-3.5 py-1 rounded-full text-xs text-amber-900 font-montserrat font-medium tracking-wide shadow-sm">
              Querido/a <span className="font-bold">{guest.name}</span> ({guest.relationship})
            </div>
          )}

          <div className="space-y-1">
            <p className="text-xs uppercase tracking-widest text-amber-800 font-cinzel font-semibold">
              {settings.title}
            </p>
            <h1 className="text-3xl sm:text-4xl font-serif-luxury font-bold text-neutral-900 leading-tight">
              {settings.honoreeName}
            </h1>
            <p className="text-sm italic text-neutral-600 font-serif-luxury max-w-xs mx-auto">
              "{settings.initialPhrase}"
            </p>
          </div>

          {/* Cover Photo */}
          <div className="relative rounded-2xl overflow-hidden shadow-xl border-4 border-white aspect-[3/4] max-w-xs mx-auto">
            <img 
              src={settings.coverPhotoUrl} 
              alt={settings.honoreeName}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
            
            {/* Watermark overlay if enabled */}
            {watermarkEnabled && (
              <div className="absolute bottom-2 right-2 bg-black/50 backdrop-blur-sm text-white text-[10px] px-2 py-0.5 rounded font-sans tracking-wide">
                Exclusivo para {guest ? guest.name : 'Invitados'}
              </div>
            )}
          </div>

          {/* Primary Action Buttons */}
          <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
            <button
              id="btn-rsvp-open-modal"
              onClick={() => setShowRsvpModal(true)}
              className="px-5 py-2.5 rounded-full bg-amber-600 hover:bg-amber-700 text-white text-xs font-montserrat font-semibold tracking-wider uppercase shadow-md shadow-amber-800/20 flex items-center gap-1.5 transition-all transform active:scale-95"
            >
              <CheckCircle className="w-4 h-4" />
              Confirmar Asistencia
            </button>

            <button
              onClick={() => setShowBankModal(true)}
              className="px-4 py-2.5 rounded-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs font-montserrat font-semibold tracking-wider uppercase shadow-sm flex items-center gap-1.5 transition-colors"
            >
              <Gift className="w-4 h-4 text-amber-700" />
              Regalo / Aporte
            </button>
          </div>
        </section>

        {/* 2. CUENTA REGRESIVA (COUNTDOWN) */}
        <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm text-center space-y-3">
          {showCeremony && (
            <div className="flex items-center justify-center gap-2 text-xs font-montserrat font-semibold text-neutral-600">
              <button
                onClick={() => setCountdownTarget('ceremony')}
                className={`px-3 py-1 rounded-full transition-colors ${countdownTarget === 'ceremony' ? 'bg-amber-500 text-white shadow-sm' : 'bg-neutral-100 hover:bg-neutral-200'}`}
              >
                Ceremonia
              </button>
              <button
                onClick={() => setCountdownTarget('party')}
                className={`px-3 py-1 rounded-full transition-colors ${countdownTarget === 'party' ? 'bg-amber-500 text-white shadow-sm' : 'bg-neutral-100 hover:bg-neutral-200'}`}
              >
                Festejo
              </button>
            </div>
          )}

          <p className="text-xs uppercase tracking-widest text-amber-800 font-cinzel font-bold">
            {timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 
              ? '¡El evento ha comenzado!' 
              : showCeremony
                ? (countdownTarget === 'ceremony' ? 'Cuenta regresiva para la Ceremonia:' : 'Cuenta regresiva para el Festejo:')
                : 'Faltan muy pocos días para celebrar:'}
          </p>

          <div className="grid grid-cols-4 gap-2 text-center max-w-xs mx-auto font-sans-clean">
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-2">
              <div className="text-xl font-bold text-amber-900">{timeLeft.days}</div>
              <div className="text-[10px] text-amber-700 uppercase">Días</div>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-2">
              <div className="text-xl font-bold text-amber-900">{timeLeft.hours}</div>
              <div className="text-[10px] text-amber-700 uppercase">Hs</div>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-2">
              <div className="text-xl font-bold text-amber-900">{timeLeft.minutes}</div>
              <div className="text-[10px] text-amber-700 uppercase">Min</div>
            </div>
            <div className="bg-amber-50/80 border border-amber-200/60 rounded-xl p-2">
              <div className="text-xl font-bold text-amber-900">{timeLeft.seconds}</div>
              <div className="text-[10px] text-amber-700 uppercase">Seg</div>
            </div>
          </div>
        </section>

        {/* 3. FECHA, HORA, LUGAR & MAPA */}
        <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-4">
          <div className="text-center space-y-1">
            <h2 className="text-lg font-cinzel font-bold text-neutral-900">Cuándo & Dónde</h2>
            <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
          </div>

          <div className="space-y-3 font-sans-clean text-xs">
            <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl">
              <Calendar className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
              <div>
                <div className="font-semibold text-neutral-900">Fecha del Evento</div>
                <div className="text-neutral-600">{settings.date}</div>
              </div>
            </div>

            {showCeremony ? (
              <>
                {/* Bloque Ceremonia */}
                <div className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-amber-950 text-xs">
                      <Clock className="w-3.5 h-3.5 text-amber-700" />
                      <span>Ceremonia Religiosa / Civil</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-amber-200/60 text-amber-900 text-[10px] font-mono font-bold">
                      {settings.ceremonyTime || '11:00'} hs
                    </span>
                  </div>
                  <div className="text-neutral-700 text-xs space-y-0.5 pl-5">
                    <div className="font-semibold text-neutral-900">{settings.ceremonyLocationName || settings.locationName}</div>
                    <div className="text-neutral-600">{settings.ceremonyAddress || settings.address}</div>
                  </div>
                  {(settings.ceremonyMapsUrl || settings.mapsUrl) && (
                    <div className="pt-1 pl-5">
                      <a
                        href={settings.ceremonyMapsUrl || settings.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver mapa de la Ceremonia</span>
                      </a>
                    </div>
                  )}
                </div>

                {/* Bloque Fiesta */}
                <div className="p-3.5 rounded-xl bg-neutral-50 border border-neutral-200/80 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-bold text-neutral-900 text-xs">
                      <MapPin className="w-3.5 h-3.5 text-amber-700" />
                      <span>Fiesta & Celebración</span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-neutral-200/80 text-neutral-900 text-[10px] font-mono font-bold">
                      {settings.partyTime || '13:00'} hs
                    </span>
                  </div>
                  <div className="text-neutral-700 text-xs space-y-0.5 pl-5">
                    <div className="font-semibold text-neutral-900">{settings.locationName}</div>
                    <div className="text-neutral-600">{settings.address}</div>
                  </div>
                  {settings.mapsUrl && (
                    <div className="pt-1 pl-5">
                      <a
                        href={settings.mapsUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-800 hover:text-amber-950 underline"
                      >
                        <ExternalLink className="w-3 h-3" />
                        <span>Ver mapa del Salón</span>
                      </a>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl">
                  <Clock className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-neutral-900">Horario de Inicio</div>
                    <div className="text-neutral-600">
                      {settings.partyTime || settings.time || '21:30'} hs
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 bg-neutral-50 p-3 rounded-xl">
                  <MapPin className="w-4 h-4 text-amber-700 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-neutral-900">{settings.locationName}</div>
                    <div className="text-neutral-600">{settings.address}</div>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Location Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 pt-1 font-montserrat text-xs">
            <a
              href={settings.mapsUrl}
              target="_blank"
              rel="noreferrer"
              className="px-3 py-2 rounded-xl bg-amber-50 text-amber-900 border border-amber-200 font-semibold flex items-center justify-center gap-1.5 hover:bg-amber-100 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              Ver en Maps
            </a>

            <button
              onClick={() => handleCopy(settings.address, 'Dirección')}
              className="px-3 py-2 rounded-xl bg-neutral-50 text-neutral-800 border border-neutral-200 font-semibold flex items-center justify-center gap-1.5 hover:bg-neutral-100 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              {copiedText === 'Dirección' ? '¡Copiado!' : 'Copiar Lugar'}
            </button>

            <button
              onClick={handleDownloadCalendarIcs}
              className="px-3 py-2 rounded-xl bg-neutral-50 text-neutral-800 border border-neutral-200 font-semibold flex items-center justify-center gap-1.5 hover:bg-neutral-100 transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              Agendar
            </button>
          </div>
        </section>

        {/* 4. ITINERARIO DEL EVENTO */}
        {settings.schedule && settings.schedule.length > 0 && (
          <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <h2 className="text-lg font-cinzel font-bold text-neutral-900">Itinerario del Día</h2>
              <div className="w-12 h-0.5 bg-amber-500 mx-auto" />
            </div>

            <div className="relative pl-6 space-y-5 border-l-2 border-amber-300 font-sans-clean text-xs">
              {settings.schedule.map((item, idx) => (
                <div key={idx} className="relative group">
                  {/* Dot */}
                  <div className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-amber-500 border-2 border-white shadow" />
                  <div className="font-bold text-amber-800 text-[11px] font-mono tracking-wider">{item.time}</div>
                  <div className="font-semibold text-neutral-900 text-sm font-serif-luxury">{item.title}</div>
                  <div className="text-neutral-600 text-xs">{item.description}</div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 5. CÓDIGO DE VESTIMENTA & RECOMENDACIONES */}
        <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm text-center space-y-3">
          <Shirt className="w-6 h-6 text-amber-700 mx-auto" />
          <h2 className="text-lg font-cinzel font-bold text-neutral-900">Código de Vestimenta</h2>
          <p className="text-amber-900 font-bold text-sm">
            {settings.dressCode || 'Elegante'}
          </p>
          {settings.dressCodeNotes && (
            <p className="text-xs text-neutral-600 font-sans-clean max-w-xs mx-auto">
              {settings.dressCodeNotes}
            </p>
          )}
        </section>

        {/* 6. CARRUSEL DE FOTOS (Available in Plan Plata & Oro) */}
        {plan.maxInvitationPhotos > 0 && carouselImages.length > 0 && (
          <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-3 text-center">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-cinzel font-bold text-neutral-900">Galería de Recuerdos</h2>
              {plan.hasEnvelopeAnimation && (
                <button
                  onClick={() => setWatermarkEnabled(!watermarkEnabled)}
                  className="text-[10px] text-neutral-500 hover:text-amber-800 underline font-sans"
                >
                  {watermarkEnabled ? 'Ocultar marca de agua' : 'Marca de agua disuasoria'}
                </button>
              )}
            </div>

            <div className="relative rounded-xl overflow-hidden aspect-[4/3] bg-neutral-100 shadow-inner">
              <img
                src={carouselImages[activePhotoIdx]}
                alt={`Recuerdo ${activePhotoIdx + 1}`}
                className="w-full h-full object-cover transition-opacity duration-300"
                referrerPolicy="no-referrer"
              />

              {watermarkEnabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-white/40 font-bold text-xl uppercase rotate-[-25deg] select-none">
                    Invitación de {guest ? guest.name : 'Familia'}
                  </div>
                </div>
              )}

              {carouselImages.length > 1 && (
                <>
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev === 0 ? carouselImages.length - 1 : prev - 1))}
                    className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setActivePhotoIdx((prev) => (prev === carouselImages.length - 1 ? 0 : prev + 1))}
                    className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-black/40 text-white flex items-center justify-center hover:bg-black/60"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {carouselImages.length > 1 && (
              <div className="flex justify-center gap-1.5 overflow-x-auto py-1">
                {carouselImages.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActivePhotoIdx(i)}
                    className={`w-10 h-10 rounded-lg overflow-hidden border-2 transition-all flex-shrink-0 ${
                      activePhotoIdx === i ? 'border-amber-600 scale-105' : 'border-transparent opacity-60'
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </section>
        )}

        {/* 7. LIBRO DE BUENOS DESEOS (Plan Plata & Oro) */}
        {plan.hasGuestbook && (
          <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <MessageSquareHeart className="w-6 h-6 text-amber-700 mx-auto" />
              <h2 className="text-lg font-cinzel font-bold text-neutral-900">Muro de Buenos Deseos</h2>
              <p className="text-xs text-neutral-600 font-sans-clean">
                Deja tus palabras de bendición y cariño para el homenajeado:
              </p>
            </div>

            {/* Leave a wish form */}
            <form onSubmit={handleBlessingSubmit} className="space-y-2.5 font-sans-clean text-xs">
              <input
                type="text"
                value={blessingAuthor}
                onChange={(e) => setBlessingAuthor(e.target.value)}
                placeholder="Tu Nombre o Familia..."
                required
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-500 bg-white"
              />
              <textarea
                value={blessingMessage}
                onChange={(e) => setBlessingMessage(e.target.value)}
                placeholder="Escribe tu mensaje con todo tu cariño..."
                rows={3}
                required
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-amber-500 bg-white resize-none"
              />
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Publicar Mensaje
              </button>

              {blessingSent && (
                <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 text-center font-medium border border-emerald-200 animate-in fade-in">
                  ¡Gracias! Tu bendición ya se encuentra visible en el muro y en la pantalla de TV.
                </div>
              )}
            </form>

            {/* List of wishes */}
            <div className="space-y-2.5 max-h-60 overflow-y-auto pr-1">
              {blessings.filter(b => b.status === 'approved').map(b => (
                <div key={b.id} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200/50 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-sans-clean">
                    <span className="font-bold text-amber-950">{b.author}</span>
                    <span className="text-neutral-400 text-[10px]">
                      {new Date(b.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-neutral-700 italic font-serif-luxury">
                    "{b.message}"
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 8. FOTOS EN VIVO DEL EVENTO (Plan Oro) */}
        {plan.maxEventPhotos > 0 && (
          <section className="bg-white/80 backdrop-blur-sm border border-amber-200/80 rounded-2xl p-5 shadow-sm space-y-4">
            <div className="text-center space-y-1">
              <Camera className="w-6 h-6 text-purple-700 mx-auto" />
              <h2 className="text-lg font-cinzel font-bold text-neutral-900">Fotos en Vivo del Evento</h2>
              <p className="text-xs text-neutral-600 font-sans-clean">
                ¡Sube tus fotos desde el celular durante la fiesta! Se proyectarán en vivo en la pantalla de TV.
              </p>
            </div>

            <div className="space-y-2 font-sans-clean text-xs">
              <input
                type="text"
                value={uploadAuthor}
                onChange={(e) => setUploadAuthor(e.target.value)}
                placeholder="Nombre de quien saca la foto..."
                className="w-full px-3 py-2 rounded-xl border border-neutral-300 focus:outline-none focus:border-purple-500 bg-white"
              />

              <input
                type="file"
                ref={fileInputRef}
                accept="image/*"
                onChange={handlePhotoUpload}
                className="hidden"
                id="guest-photo-upload-input"
              />

              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploadingPhoto}
                className="w-full py-2.5 rounded-xl bg-purple-700 hover:bg-purple-800 text-white font-semibold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Camera className="w-4 h-4" />
                {uploadingPhoto ? 'Comprimiendo y Subiendo...' : '📸 Tomar o Subir Foto'}
              </button>

              <p className="text-[10px] text-neutral-500 text-center">
                Disponible temporalmente. Se respaldará en Google Drive durante 10 días posteriores al evento.
              </p>
            </div>

            {/* Live photos stream */}
            <div className="grid grid-cols-3 gap-2">
              {photos.filter(p => p.source === 'event' && p.status === 'approved').slice(0, 6).map(p => (
                <div key={p.id} className="relative rounded-lg overflow-hidden aspect-square border border-neutral-200">
                  <img src={p.url} alt="" className="w-full h-full object-cover" />
                  <div className="absolute bottom-0 inset-x-0 bg-black/60 text-white text-[9px] px-1 py-0.5 truncate text-center">
                    {p.author || 'Invitado'}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* 9. FOOTER & CIERRE */}
        <footer className="text-center space-y-4 pt-6 text-xs text-neutral-600 font-sans-clean">
          <p className="font-serif-luxury italic text-sm text-neutral-800">
            ¡Gracias por formar parte de este día tan especial e inolvidable!
          </p>

          <div className="flex items-center justify-center gap-4 text-amber-800 font-medium">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:underline flex items-center gap-1"
            >
              ↑ Volver arriba
            </button>
            <span>•</span>
            <button
              onClick={() => setShowRsvpModal(true)}
              className="hover:underline"
            >
              Confirmar asistencia
            </button>
          </div>

          <p className="text-[10px] text-neutral-400">
            Invitación Digital interactiva creada con TuInvitacionDigital • Respaldo privado y seguro
          </p>
        </footer>
      </div>

      {/* RSVP MODAL */}
      {showRsvpModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 font-sans-clean text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-cinzel font-bold text-neutral-900">Confirmar Asistencia</h3>
              <button onClick={() => setShowRsvpModal(false)} className="text-neutral-400 hover:text-neutral-700">
                ✕
              </button>
            </div>

            {rsvpSuccess ? (
              <div className="text-center py-6 space-y-3">
                <CheckCircle className="w-12 h-12 text-emerald-600 mx-auto animate-bounce" />
                <div className="text-base font-bold text-neutral-900">¡Confirmación Registrada!</div>
                <p className="text-neutral-600">
                  Hemos guardado tu respuesta. También puedes enviar un WhatsApp directo al organizador:
                </p>
                <a
                  href={getWhatsAppRsvpUrl()}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-emerald-600 text-white font-semibold hover:bg-emerald-700 shadow-md"
                >
                  <Share2 className="w-4 h-4" />
                  Enviar por WhatsApp
                </a>
              </div>
            ) : (
              <form onSubmit={handleRsvpSubmit} className="space-y-3">
                {guest && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-900">
                    <div className="font-bold">{guest.name}</div>
                    <div className="text-[11px] text-amber-800">
                      Cupo reservado: hasta {guest.adultsMax} adultos y {guest.childrenMax} menores.
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">¿Asistirás al evento?</label>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setRsvpAttendance('confirmed')}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        rsvpAttendance === 'confirmed'
                          ? 'bg-emerald-600 text-white border-emerald-600 shadow'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <CheckCircle className="w-4 h-4" />
                      ¡Sí, asistiré!
                    </button>
                    <button
                      type="button"
                      onClick={() => setRsvpAttendance('declined')}
                      className={`p-2.5 rounded-xl font-bold flex items-center justify-center gap-1.5 border transition-all ${
                        rsvpAttendance === 'declined'
                          ? 'bg-red-600 text-white border-red-600 shadow'
                          : 'bg-neutral-50 text-neutral-700 border-neutral-200'
                      }`}
                    >
                      <XCircle className="w-4 h-4" />
                      No podré ir
                    </button>
                  </div>
                </div>

                {rsvpAttendance === 'confirmed' && (
                  <div className="grid grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Mayores</label>
                      <input
                        type="number"
                        min="1"
                        max={guest ? guest.adultsMax : 10}
                        value={adultsCount}
                        onChange={(e) => setAdultsCount(parseInt(e.target.value, 10) || 1)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-neutral-800 mb-1">Menores</label>
                      <input
                        type="number"
                        min="0"
                        max={guest ? guest.childrenMax : 10}
                        value={childrenCount}
                        onChange={(e) => setChildrenCount(parseInt(e.target.value, 10) || 0)}
                        className="w-full px-3 py-2 rounded-xl border border-neutral-300"
                      />
                    </div>
                  </div>
                )}

                <div>
                  <label className="block font-semibold text-neutral-800 mb-1">
                    Mensaje o restricciones alimentarias (opcional)
                  </label>
                  <textarea
                    value={rsvpMessage}
                    onChange={(e) => setRsvpMessage(e.target.value)}
                    rows={2}
                    placeholder="Ej: Celíaco, vegetariano, o un abrazo grande..."
                    className="w-full px-3 py-2 rounded-xl border border-neutral-300 resize-none"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-semibold transition-colors"
                  >
                    Guardar Confirmación
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}

      {/* BANK GIFT MODAL */}
      {showBankModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl space-y-4 font-sans-clean text-xs">
            <div className="flex items-center justify-between border-b pb-2">
              <h3 className="text-base font-cinzel font-bold text-neutral-900">Regalo / Aporte</h3>
              <button onClick={() => setShowBankModal(false)} className="text-neutral-400 hover:text-neutral-700">
                ✕
              </button>
            </div>

            <p className="text-neutral-600 text-xs italic font-serif-luxury">
              "{settings.bankNotes || 'Tu presencia es nuestro mayor regalo. Si deseas agasajarnos con un aporte, te dejamos nuestros datos bancarios:'}"
            </p>

            <div className="space-y-2.5 bg-amber-50/70 p-3.5 rounded-xl border border-amber-200/80">
              <div>
                <div className="text-[10px] text-amber-800 uppercase font-bold">Alias</div>
                <div className="flex items-center justify-between font-mono font-bold text-neutral-900 text-sm">
                  <span>{settings.bankAlias || 'MI.EVENTO.2026'}</span>
                  <button
                    onClick={() => handleCopy(settings.bankAlias || 'MI.EVENTO.2026', 'alias')}
                    className="p-1 text-amber-800 hover:text-amber-950"
                    title="Copiar Alias"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedText === 'alias' && <span className="text-[10px] text-emerald-700">¡Alias copiado!</span>}
              </div>

              <div>
                <div className="text-[10px] text-amber-800 uppercase font-bold">CVU</div>
                <div className="flex items-center justify-between font-mono text-neutral-900 text-xs truncate">
                  <span className="truncate">{settings.bankCvu || '0000003100084592019842'}</span>
                  <button
                    onClick={() => handleCopy(settings.bankCvu || '0000003100084592019842', 'cvu')}
                    className="p-1 text-amber-800 hover:text-amber-950 flex-shrink-0"
                    title="Copiar CVU"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                </div>
                {copiedText === 'cvu' && <span className="text-[10px] text-emerald-700">¡CVU copiado!</span>}
              </div>

              {settings.bankHolder && (
                <div>
                  <div className="text-[10px] text-amber-800 uppercase font-bold">Titular</div>
                  <div className="text-neutral-800 font-semibold">{settings.bankHolder}</div>
                </div>
              )}
            </div>

            <button
              onClick={() => setShowBankModal(false)}
              className="w-full py-2 rounded-xl bg-neutral-900 text-white font-semibold"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
