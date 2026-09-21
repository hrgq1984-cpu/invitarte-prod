/**
 * Core Types and Interfaces for InvitArte Platform
 */

export type UserRole = 'admin' | 'client' | 'guest';

export interface User {
  id: string;
  email: string;
  displayName: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: string;
}

export type EventType = 
  | 'boda'
  | 'cumpleanos'
  | '15anos'
  | 'bautismo'
  | 'comunion'
  | 'confirmacion'
  | 'otros';

/**
 * Event types where a religious or civil Ceremony can be enabled/disabled.
 * Cumpleaños and Otros Eventos strictly do NOT include Ceremony.
 */
export const EVENT_TYPES_WITH_CEREMONY_OPTION: EventType[] = [
  'boda',
  '15anos',
  'bautismo',
  'comunion',
  'confirmacion'
];

export const isCeremonySupported = (eventType?: string): boolean => {
  if (!eventType) return false;
  return EVENT_TYPES_WITH_CEREMONY_OPTION.includes(eventType as EventType);
};

export interface EventScheduleItem {
  id?: string;
  time: string;
  title: string;
  description: string;
  iconName?: string;
}

export type PlanTier = 'bronce' | 'plata' | 'oro';

export interface Plan {
  id: PlanTier;
  name: string;
  price: number; // in ARS
  currency: string;
  badge?: string;
  description: string;
  features: string[];
  maxInvitationPhotos: number;
  maxEventPhotos: number;
  maxGuests: number;
  hasEnvelopeAnimation: boolean;
  hasTvMode: boolean;
  hasGuestbook: boolean;
  hasCustomGuestLinks: boolean;
  hasWhatsappReminders: boolean;
  hasGoogleDriveExport: boolean;
  active: boolean;
}

export interface DesignTemplate {
  id: string;
  eventType: EventType;
  name: string;
  description: string;
  previewImage: string;
  requiredPlan: PlanTier;
  palette: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    text: string;
  };
  fontFamily: 'serif' | 'cinzel' | 'script' | 'sans';
  envelopeColor: string;
  waxSealSymbol: string;
  sampleHonoree: string;
  sampleDate: string;
  sampleLocation: string;
  samplePhrase: string;
}

export type ProjectStatus =
  | 'draft'
  | 'pending_payment'
  | 'payment_review'
  | 'paid'
  | 'preview_available'
  | 'approved'
  | 'published'
  | 'expired'
  | 'cancelled';

export interface Project {
  id: string;
  orderNumber?: string;
  clientId: string;
  clientEmail: string;
  clientPhone?: string;
  honoreeName?: string;
  eventDate?: string;
  eventType: EventType;
  templateId: string;
  planId: PlanTier;
  amount?: number;
  currency?: string;
  status: ProjectStatus;
  publicSlug: string;
  previewToken: string;
  receiptUrl?: string;
  paymentMethod?: string;
  paidAt?: string;
  previewAvailableAt?: string;
  publishedAt?: string;
  expiresAt?: string;
  googleDriveUrl?: string;
  googleDriveExpiresAt?: string;
  correctionNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface EventSettings {
  projectId: string;
  title: string;
  honoreeName: string;
  subtitle: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  hasCeremony?: boolean; // Available for boda, 15anos, bautismo, comunion, confirmacion
  ceremonyTime?: string;
  ceremonyLocationName?: string;
  ceremonyAddress?: string;
  ceremonyMapsUrl?: string;
  partyTime?: string;
  partyLocationName?: string;
  timezone: string;
  locationName: string;
  address: string;
  mapsUrl: string;
  initialPhrase: string;
  dressCode: string;
  dressCodeNotes?: string;
  bankAlias?: string;
  bankCvu?: string;
  bankHolder?: string;
  bankNotes?: string;
  selectedMusicUrl?: string;
  musicTitle?: string;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  fontFamily: string;
  envelopeColor: string;
  waxSealText?: string;
  coverPhotoUrl: string;
  carouselPhotos: string[];
  schedule: EventScheduleItem[];
}

export type AttendanceStatus = 'pending' | 'confirmed' | 'declined';

export interface Guest {
  id: string;
  projectId: string;
  name: string;
  relationship: string;
  phone: string;
  adultsMax: number;
  childrenMax: number;
  inviteToken: string;
  sentAt?: string;
  remindedAt?: string;
  attendance: AttendanceStatus;
  adultsConfirmed: number;
  childrenConfirmed: number;
  dietaryRestrictions?: string;
  notes?: string;
  updatedAt: string;
}

export interface Rsvp {
  id: string;
  projectId: string;
  guestId: string;
  guestName: string;
  attendance: 'confirmed' | 'declined';
  adultsCount: number;
  childrenCount: number;
  accompaniedByAdult: boolean;
  message?: string;
  createdAt: string;
}

export interface Blessing {
  id: string;
  projectId: string;
  author: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: string;
}

export interface EventPhoto {
  id: string;
  projectId: string;
  source: 'invitation' | 'event';
  url: string;
  author?: string;
  status: 'pending' | 'approved' | 'rejected';
  watermarkEnabled?: boolean;
  createdAt: string;
}

export interface DisplaySettings {
  projectId: string;
  rotationSeconds: number;
  tvMode: boolean;
  showPhotos: boolean;
  showBlessings: boolean;
  updatedAt: string;
}

export interface AdminNotification {
  id: string;
  type: 'order_created' | 'receipt_uploaded' | 'client_correction' | 'client_approved';
  title: string;
  message: string;
  projectId: string;
  paymentId?: string;
  read: boolean;
  createdAt: string;
}

export interface PaymentTransaction {
  id: string;
  projectId: string;
  provider: 'mercadopago' | 'transfer' | 'stripe' | 'cash';
  providerPaymentId?: string;
  amount: number;
  currency: string;
  status: 'pending' | 'review' | 'completed' | 'failed' | 'refunded';
  receiptUrl?: string;
  receiptNotes?: string;
  paidAt?: string;
  createdAt: string;
}

export interface TestResult {
  id: string;
  name: string;
  category: 'Plan Limits' | 'Guest Quotas' | 'RBAC Permissions' | 'Lifecycle' | 'Audio & Envelope';
  status: 'passed' | 'failed' | 'running';
  details: string;
  durationMs: number;
}
