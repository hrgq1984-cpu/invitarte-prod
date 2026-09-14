import { describe, it, expect } from 'vitest';
import { INITIAL_TEMPLATES, INITIAL_PLANS, REFERENCE_PROJECT, REFERENCE_EVENT_SETTINGS } from '../data/initialData';
import { EventType } from '../types';

describe('InvitArte Platform - Initial Data & Catalog Specs', () => {
  it('should contain exactly 21 design templates (3 for each of the 7 event types)', () => {
    expect(INITIAL_TEMPLATES).toHaveLength(21);

    const eventTypes: EventType[] = [
      'boda',
      'cumpleanos',
      '15anos',
      'bautismo',
      'comunion',
      'confirmacion',
      'otros'
    ];

    eventTypes.forEach(type => {
      const templatesForType = INITIAL_TEMPLATES.filter(t => t.eventType === type);
      expect(templatesForType.length).toBe(3);
    });
  });

  it('should have the three commercial pricing tiers correctly priced', () => {
    const bronce = INITIAL_PLANS.find(p => p.id === 'bronce');
    const plata = INITIAL_PLANS.find(p => p.id === 'plata');
    const oro = INITIAL_PLANS.find(p => p.id === 'oro');

    expect(bronce).toBeDefined();
    expect(bronce?.price).toBe(45000);
    expect(bronce?.maxGuests).toBe(100);

    expect(plata).toBeDefined();
    expect(plata?.price).toBe(52000);
    expect(plata?.maxGuests).toBe(250);
    expect(plata?.maxInvitationPhotos).toBe(7);

    expect(oro).toBeDefined();
    expect(oro?.price).toBe(60000);
    expect(oro?.maxGuests).toBe(500);
    expect(oro?.maxInvitationPhotos).toBe(15);
    expect(oro?.hasTvMode).toBe(true);
  });

  it('should validate guest list quotas and CSV parser logic', () => {
    const rawCsv = `Familia Perez, Tíos, +5493835438603, 3, 1
Lucas Martinez, Amigo, 5491144556677, 1, 0`;

    const lines = rawCsv.split('\n').map(l => l.trim()).filter(Boolean);
    const parsed = lines.map((line) => {
      const parts = line.split(',').map(s => s.trim());
      return {
        name: parts[0] || 'Invitado',
        relationship: parts[1] || 'Invitado',
        phone: parts[2] || '',
        adultsMax: parseInt(parts[3], 10) || 1,
        childrenMax: parseInt(parts[4], 10) || 0
      };
    });

    expect(parsed).toHaveLength(2);
    expect(parsed[0].name).toBe('Familia Perez');
    expect(parsed[0].adultsMax).toBe(3);
    expect(parsed[0].childrenMax).toBe(1);
    expect(parsed[1].name).toBe('Lucas Martinez');
    expect(parsed[1].adultsMax).toBe(1);
    expect(parsed[1].childrenMax).toBe(0);
  });

  it('should have correct initial event settings and 24h review status', () => {
    expect(REFERENCE_PROJECT.status).toBe('published');
    expect(REFERENCE_PROJECT.clientId).toBeDefined();
    expect(REFERENCE_EVENT_SETTINGS.locationName).toContain('Salón');
    expect(REFERENCE_EVENT_SETTINGS.carouselPhotos.length).toBeGreaterThan(0);
  });
});
