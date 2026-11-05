// Core shared types for ReliefLink

export type PortalRole = 'victim' | 'volunteer' | 'authority' | 'donor';

export type IncidentStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'resources_allocated'
  | 'dispatched'
  | 'partially_delivered'
  | 'delivered'
  | 'closed'
  | 'rejected';

export type SeverityLevel = 'critical' | 'severe' | 'moderate' | 'low' | 'unknown';

export type ResourceStatus =
  | 'submitted'
  | 'under_review'
  | 'verified'
  | 'resources_allocated'
  | 'dispatched'
  | 'partially_delivered'
  | 'delivered';

export type VolunteerStatus = 'available' | 'assigned' | 'on_task' | 'unavailable';
export type VerificationStatus = 'pending' | 'verified' | 'rejected' | 'unverified';

export type DonationType = 'monetary' | 'material';
export type DonationStatus =
  | 'registered'
  | 'received'
  | 'inspected'
  | 'accepted'
  | 'rejected'
  | 'added_to_inventory'
  | 'allocated'
  | 'distributed';

export type DisasterType =
  | 'flood'
  | 'earthquake'
  | 'fire'
  | 'cyclone'
  | 'landslide'
  | 'industrial_accident'
  | 'other';

export type ResourceCategory =
  | 'food'
  | 'water'
  | 'medical'
  | 'shelter'
  | 'clothing_essentials'
  | 'specialist_assistance'
  | 'other';

export type UrgencyLevel = 'immediately' | 'within_hours' | 'later';

export type FacilityType =
  | 'hospital'
  | 'medical_centre'
  | 'shelter'
  | 'relief_camp'
  | 'food_distribution'
  | 'fire_station'
  | 'emergency_services'
  | 'warehouse';

export type FacilityStatus = 'operational' | 'limited' | 'closed' | 'unknown';

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: PortalRole;
  createdAt: string;
  avatar?: string;
}

export interface VictimProfile extends User {
  role: 'victim';
  address?: string;
}

export interface VolunteerProfile extends User {
  role: 'volunteer';
  skills: string[];
  serviceArea: string;
  location: string;
  availability: boolean;
  transport: boolean;
  languages: string[];
  maxDistance: number;
  experience?: string;
  verificationStatus: VerificationStatus;
  identityVerified: boolean;
  skillsVerified: boolean;
  certificatesVerified: boolean;
  assignments: string[];
}

export interface AuthorityProfile extends User {
  role: 'authority';
  department: string;
  jurisdiction: string;
}

export interface DonorProfile extends User {
  role: 'donor';
  organisation?: string;
}

export interface Incident {
  id: string;
  disasterType: DisasterType;
  title: string;
  description: string;
  location: {
    address: string;
    locality: string;
    landmark?: string;
    lat?: number;
    lng?: number;
  };
  impactAssessment: {
    lifeThreatening: string;
    injured: string;
    evacuation: string;
    situationIndicator: SeverityLevel;
  };
  reportedBy: string;
  submittedAt: string;
  updatedAt: string;
  status: IncidentStatus;
  priority: SeverityLevel;
  verificationStatus: VerificationStatus;
  assignedTeam?: string;
  evidence?: string[];
  relatedIncidents?: string[];
  aiAssessment?: AIAssessment;
  resources: ResourceRequest[];
  notes?: AuthorityNote[];
  auditLog: AuditEntry[];
}

export interface ResourceRequest {
  id: string;
  incidentId: string;
  category: ResourceCategory;
  itemName: string;
  quantity: number | 'unknown';
  unit: string;
  urgency: UrgencyLevel;
  details?: string;
  requested: number;
  allocated: number;
  dispatched: number;
  delivered: number;
  status: ResourceStatus;
}

export interface VolunteerAssignment {
  id: string;
  incidentId: string;
  volunteerId: string;
  taskCategory: string;
  area: string;
  urgency: SeverityLevel;
  requiredSkills: string[];
  assignedDate: string;
  status: 'pending' | 'accepted' | 'in_progress' | 'partially_completed' | 'completed' | 'declined' | 'unsafe';
  taskObjective: string;
  safetyInstructions: string;
  authorityInstructions: string;
  equipment: string[];
  progressNotes?: string;
  teamInfo?: string;
  completedAt?: string;
}

export interface InventoryItem {
  id: string;
  name: string;
  category: ResourceCategory;
  totalStock: number;
  reservedStock: number;
  availableStock: number;
  requiredStock: number;
  incomingStock: number;
  unavailableStock: number;
  warehouse: string;
  expiryDate?: string;
  condition: 'good' | 'fair' | 'poor';
  inspectionStatus: 'inspected' | 'pending_inspection' | 'rejected';
  unit: string;
  lastUpdated: string;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  type: DonationType;
  status: DonationStatus;
  submittedAt: string;
  updatedAt: string;
  preferredZone?: string;
  preferredCategory?: ResourceCategory;
  message?: string;
  // Monetary
  amount?: number;
  currency?: string;
  transactionRef?: string;
  // Material
  items?: DonationItem[];
}

export interface DonationItem {
  id: string;
  name: string;
  category: ResourceCategory;
  quantity: number;
  unit: string;
  condition: 'new' | 'good' | 'fair';
  expiryDate?: string;
  pickupDropoff: 'pickup' | 'dropoff';
  location?: string;
  inspectionStatus?: 'pending' | 'accepted' | 'rejected';
  inspectionNotes?: string;
}

export interface Facility {
  id: string;
  name: string;
  type: FacilityType;
  address: string;
  locality: string;
  lat: number;
  lng: number;
  phone?: string;
  services: string[];
  status: FacilityStatus;
  lastVerified: string;
  distance?: number;
  capacity?: number;
  currentOccupancy?: number;
}

export interface Announcement {
  id: string;
  title: string;
  message: string;
  audience: Array<'victims' | 'volunteers' | 'donors' | 'all'>;
  priority: 'low' | 'medium' | 'high' | 'critical';
  publishedAt: string;
  publishedBy: string;
  expiresAt?: string;
}

export interface AIAssessment {
  suggestedClassification: DisasterType;
  preliminaryPriority: SeverityLevel;
  confidence: 'low' | 'medium' | 'high';
  reasons: string[];
  missingInfo: string[];
  recommendedAction: string;
  generatedAt: string;
  disclaimer: string;
}

export interface AuthorityNote {
  id: string;
  authorId: string;
  authorName: string;
  note: string;
  createdAt: string;
}

export interface AuditEntry {
  id: string;
  action: string;
  actorId: string;
  actorName: string;
  actorRole: PortalRole;
  timestamp: string;
  details?: string;
  entityId?: string;
  entityType?: string;
}

export interface NGO {
  id: string;
  name: string;
  type: 'ngo' | 'relief_camp' | 'distribution_centre' | 'warehouse' | 'partner';
  address: string;
  locality: string;
  lat?: number;
  lng?: number;
  phone: string;
  email?: string;
  services: string[];
  capacity?: number;
  currentOccupancy?: number;
  status: FacilityStatus;
  contactPerson?: string;
  lastUpdated: string;
}

export interface Distribution {
  id: string;
  incidentId: string;
  resourceId: string;
  resourceName: string;
  quantity: number;
  allocatedQuantity: number;
  dispatchedQuantity: number;
  deliveredQuantity: number;
  assignedTeam: string;
  distributionCentre: string;
  status: ResourceStatus;
  createdAt: string;
  updatedAt: string;
  confirmedBy?: string;
}

export interface AppState {
  incidents: Incident[];
  volunteers: VolunteerProfile[];
  inventory: InventoryItem[];
  donations: Donation[];
  facilities: Facility[];
  ngos: NGO[];
  announcements: Announcement[];
  distributions: Distribution[];
  assignments: VolunteerAssignment[];
  auditLog: AuditEntry[];
}
