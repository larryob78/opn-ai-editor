import { Timestamp } from 'firebase/firestore';

export type UserRole = 'SPOTTER' | 'RESPONDER' | 'ADMIN';
export type Country = 'IE' | 'UK';
export type OrganisationType = 'PRIMARY' | 'SECONDARY' | 'OUTREACH';
export type ReportStatus = 'NEW' | 'ASSIGNED' | 'IN_PROGRESS' | 'RESOLVED' | 'COULD_NOT_FIND';
export type RiskLevel = 'GREEN' | 'AMBER' | 'RED';
export type ContactPreference = 'ANONYMOUS' | 'NAME_ONLY' | 'PHONE' | 'EMAIL' | 'ALL';

export interface User {
  id: string;
  role: UserRole;
  name: string;
  email: string;
  phone?: string;
  organisationId?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface CoverageZone {
  type: 'CIRCLE' | 'POLYGON';
  centerLat?: number;
  centerLng?: number;
  radiusKm?: number;
  coordinates?: Array<{ lat: number; lng: number }>;
}

export interface Organisation {
  id: string;
  name: string;
  type: OrganisationType;
  primaryContactEmail: string;
  primaryContactPhone: string;
  active: boolean;
  country: Country;
  coverageZones: CoverageZone[];
  coverageCenterLat: number;
  coverageCenterLng: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Report {
  id: string;
  spotterId?: string;
  latitude: number;
  longitude: number;
  geocodedAddress: string;
  city: string;
  county: string;
  country: string;
  temperatureC: number;
  feelsLikeC: number;
  weatherDescription: string;
  gpsAccuracyMeters: number;
  riskLevel: RiskLevel;
  notes?: string;
  hasPhoto: boolean;
  photoUrl?: string;
  contactPreference: ContactPreference;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
  organisationId: string;
  status: ReportStatus;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Assignment {
  id: string;
  reportId: string;
  responderId: string;
  organisationId: string;
  assignedAt: Timestamp;
  acceptedAt?: Timestamp;
  completedAt?: Timestamp;
  outcome?: string;
}

export interface AuditLog {
  id: string;
  type: string;
  reportId?: string;
  userId?: string;
  metadata: Record<string, any>;
  createdAt: Timestamp;
}
