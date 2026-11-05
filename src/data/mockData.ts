import type { AppState, Incident, VolunteerProfile, InventoryItem, Donation, Facility, NGO, Announcement, Distribution, VolunteerAssignment, AuditEntry } from '../types';

// ─── SAMPLE INCIDENTS ────────────────────────────────────────────────────────
const incidents: Incident[] = [
  {
    id: 'RL-INC-001',
    disasterType: 'flood',
    title: 'Severe flooding in Riverside Colony',
    description: 'Entire residential area submerged. Water level rising. Multiple families trapped on rooftops. No electricity since last night.',
    location: { address: '12, Riverside Colony, Near Bridge No. 4', locality: 'Kalyan Nagar', landmark: 'Near State Bank Branch', lat: 19.2183, lng: 72.9781 },
    impactAssessment: { lifeThreatening: '10-25', injured: '5-10', evacuation: '50-100', situationIndicator: 'critical' },
    reportedBy: 'V001',
    submittedAt: '2024-11-02T07:30:00Z',
    updatedAt: '2024-11-02T14:00:00Z',
    status: 'resources_allocated',
    priority: 'critical',
    verificationStatus: 'verified',
    assignedTeam: 'Team Alpha',
    evidence: [],
    relatedIncidents: ['RL-INC-003'],
    aiAssessment: {
      suggestedClassification: 'flood',
      preliminaryPriority: 'critical',
      confidence: 'medium',
      reasons: ['Multiple reports from same area', 'Rising water level reported', 'Trapped persons mentioned'],
      missingInfo: ['Exact casualty count not confirmed', 'Field verification pending'],
      recommendedAction: 'Deploy rescue team immediately. Request field confirmation of casualty numbers.',
      generatedAt: '2024-11-02T07:35:00Z',
      disclaimer: 'This is a preliminary AI assessment. All decisions must be reviewed and confirmed by authorised personnel.'
    },
    resources: [
      { id: 'RR-001', incidentId: 'RL-INC-001', category: 'water', itemName: 'Drinking Water', quantity: 100, unit: 'litres', urgency: 'immediately', requested: 100, allocated: 100, dispatched: 80, delivered: 60, status: 'partially_delivered' },
      { id: 'RR-002', incidentId: 'RL-INC-001', category: 'food', itemName: 'Ready-to-eat Food Packets', quantity: 50, unit: 'packets', urgency: 'immediately', requested: 50, allocated: 50, dispatched: 50, delivered: 50, status: 'delivered' },
      { id: 'RR-003', incidentId: 'RL-INC-001', category: 'shelter', itemName: 'Blankets', quantity: 10, unit: 'pieces', urgency: 'within_hours', requested: 10, allocated: 10, dispatched: 0, delivered: 0, status: 'resources_allocated' },
    ],
    notes: [
      { id: 'N001', authorId: 'AUTH001', authorName: 'District Collector Raj Patel', note: 'Field team dispatched. Priority escalated to critical.', createdAt: '2024-11-02T08:30:00Z' }
    ],
    auditLog: [
      { id: 'AL001', action: 'Report Submitted', actorId: 'V001', actorName: 'Priya Sharma', actorRole: 'victim', timestamp: '2024-11-02T07:30:00Z' },
      { id: 'AL002', action: 'Marked Verified', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T08:00:00Z', details: 'Field confirmation received' },
      { id: 'AL003', action: 'Resources Allocated', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T09:00:00Z', details: 'Water, Food, Blankets allocated from Warehouse 1' },
    ]
  },
  {
    id: 'RL-INC-002',
    disasterType: 'flood',
    title: 'Road blocked – families stranded in Navi Colony',
    description: 'Main access road completely submerged. Around 30 households stranded. Elderly and children in need of evacuation.',
    location: { address: 'Navi Colony, Sector 7', locality: 'Bhiwandi', landmark: 'Near Navi Colony Gate', lat: 19.2956, lng: 73.0589 },
    impactAssessment: { lifeThreatening: '0-5', injured: 'not_sure', evacuation: '25-50', situationIndicator: 'severe' },
    reportedBy: 'V001',
    submittedAt: '2024-11-02T09:15:00Z',
    updatedAt: '2024-11-02T11:30:00Z',
    status: 'verified',
    priority: 'severe',
    verificationStatus: 'verified',
    assignedTeam: undefined,
    evidence: [],
    relatedIncidents: [],
    resources: [
      { id: 'RR-004', incidentId: 'RL-INC-002', category: 'food', itemName: 'Dry Ration Kits', quantity: 30, unit: 'kits', urgency: 'within_hours', requested: 30, allocated: 0, dispatched: 0, delivered: 0, status: 'verified' },
      { id: 'RR-005', incidentId: 'RL-INC-002', category: 'shelter', itemName: 'Tents', quantity: 10, unit: 'tents', urgency: 'within_hours', requested: 10, allocated: 0, dispatched: 0, delivered: 0, status: 'verified' },
    ],
    notes: [],
    auditLog: [
      { id: 'AL004', action: 'Report Submitted', actorId: 'V001', actorName: 'Priya Sharma', actorRole: 'victim', timestamp: '2024-11-02T09:15:00Z' },
      { id: 'AL005', action: 'Marked Verified', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T10:00:00Z' },
    ]
  },
  {
    id: 'RL-INC-003',
    disasterType: 'flood',
    title: 'Flood relief needed – Mill Workers\' Colony',
    description: 'Ground floor completely flooded. Around 15 families affected. Need food and medical assistance.',
    location: { address: 'Mill Workers Colony, Block C', locality: 'Kalyan Nagar', landmark: 'Near Old Mill Compound', lat: 19.2210, lng: 72.9820 },
    impactAssessment: { lifeThreatening: '0-5', injured: '1-5', evacuation: '10-25', situationIndicator: 'moderate' },
    reportedBy: 'V001',
    submittedAt: '2024-11-02T10:00:00Z',
    updatedAt: '2024-11-02T12:00:00Z',
    status: 'under_review',
    priority: 'moderate',
    verificationStatus: 'pending',
    assignedTeam: undefined,
    evidence: [],
    relatedIncidents: ['RL-INC-001'],
    aiAssessment: {
      suggestedClassification: 'flood',
      preliminaryPriority: 'moderate',
      confidence: 'low',
      reasons: ['Similar location to RL-INC-001', 'Fewer people reported affected'],
      missingInfo: ['Could be duplicate of RL-INC-001', 'Field verification required'],
      recommendedAction: 'Cross-reference with RL-INC-001. Send field team to confirm.',
      generatedAt: '2024-11-02T10:05:00Z',
      disclaimer: 'This is a preliminary AI assessment. All decisions must be reviewed and confirmed by authorised personnel.'
    },
    resources: [
      { id: 'RR-006', incidentId: 'RL-INC-003', category: 'food', itemName: 'Ready-to-eat Food', quantity: 20, unit: 'packets', urgency: 'immediately', requested: 20, allocated: 0, dispatched: 0, delivered: 0, status: 'under_review' },
      { id: 'RR-007', incidentId: 'RL-INC-003', category: 'medical', itemName: 'First Aid Supplies', quantity: 5, unit: 'kits', urgency: 'within_hours', requested: 5, allocated: 0, dispatched: 0, delivered: 0, status: 'under_review' },
    ],
    notes: [],
    auditLog: [
      { id: 'AL006', action: 'Report Submitted', actorId: 'V001', actorName: 'Priya Sharma', actorRole: 'victim', timestamp: '2024-11-02T10:00:00Z' },
    ]
  },
  {
    id: 'RL-INC-004',
    disasterType: 'flood',
    title: 'Emergency – elderly residents stranded',
    description: 'Five elderly residents on second floor, cannot be evacuated due to mobility issues. Require immediate medical attention.',
    location: { address: 'Silver Oak Apartments, Flat 2B', locality: 'Thane West', landmark: 'Near Station Road', lat: 19.1960, lng: 72.9611 },
    impactAssessment: { lifeThreatening: '5-10', injured: '1-5', evacuation: '1-5', situationIndicator: 'critical' },
    reportedBy: 'V001',
    submittedAt: '2024-11-02T11:30:00Z',
    updatedAt: '2024-11-02T11:30:00Z',
    status: 'submitted',
    priority: 'critical',
    verificationStatus: 'pending',
    assignedTeam: undefined,
    evidence: [],
    relatedIncidents: [],
    resources: [
      { id: 'RR-008', incidentId: 'RL-INC-004', category: 'medical', itemName: 'Medical Support', quantity: 1, unit: 'team', urgency: 'immediately', requested: 1, allocated: 0, dispatched: 0, delivered: 0, status: 'submitted' },
      { id: 'RR-009', incidentId: 'RL-INC-004', category: 'specialist_assistance', itemName: 'Rescue Team', quantity: 1, unit: 'team', urgency: 'immediately', requested: 1, allocated: 0, dispatched: 0, delivered: 0, status: 'submitted' },
    ],
    notes: [],
    auditLog: [
      { id: 'AL007', action: 'Report Submitted', actorId: 'V001', actorName: 'Priya Sharma', actorRole: 'victim', timestamp: '2024-11-02T11:30:00Z' },
    ]
  },
];

// ─── VOLUNTEERS ───────────────────────────────────────────────────────────────
const volunteers: VolunteerProfile[] = [
  {
    id: 'VOL001', name: 'Arjun Kumar', email: 'arjun.kumar@demo.com', phone: '+91-9876543211',
    role: 'volunteer', createdAt: '2024-10-15',
    skills: ['First Aid', 'Medical Support', 'General Assistance'],
    serviceArea: 'Kalyan Nagar', location: 'Thane',
    availability: true, transport: true, languages: ['Hindi', 'English', 'Marathi'],
    maxDistance: 20, experience: '3 years volunteering with Red Cross',
    verificationStatus: 'verified', identityVerified: true, skillsVerified: true, certificatesVerified: false,
    assignments: ['ASN-001']
  },
  {
    id: 'VOL002', name: 'Meera Singh', email: 'meera.singh@demo.com', phone: '+91-9876543220',
    role: 'volunteer', createdAt: '2024-10-18',
    skills: ['Driving', 'Logistics', 'Communication'],
    serviceArea: 'Bhiwandi', location: 'Bhiwandi',
    availability: true, transport: true, languages: ['Hindi', 'Marathi'],
    maxDistance: 30, experience: 'Logistics coordinator at NGO for 2 years',
    verificationStatus: 'verified', identityVerified: true, skillsVerified: false, certificatesVerified: false,
    assignments: []
  },
  {
    id: 'VOL003', name: 'Rohit Desai', email: 'rohit.desai@demo.com', phone: '+91-9876543221',
    role: 'volunteer', createdAt: '2024-10-20',
    skills: ['Evacuation', 'Specialist Rescue', 'First Aid'],
    serviceArea: 'Thane', location: 'Thane West',
    availability: false, transport: false, languages: ['Marathi', 'Hindi'],
    maxDistance: 15, experience: 'Trained rescue diver. NDRF auxiliary member.',
    verificationStatus: 'verified', identityVerified: true, skillsVerified: true, certificatesVerified: true,
    assignments: []
  },
  {
    id: 'VOL004', name: 'Fatima Shaikh', email: 'fatima.shaikh@demo.com', phone: '+91-9876543222',
    role: 'volunteer', createdAt: '2024-10-22',
    skills: ['Medical Support', 'Childcare Assistance', 'General Assistance'],
    serviceArea: 'Kalyan', location: 'Kalyan East',
    availability: true, transport: false, languages: ['Urdu', 'Hindi', 'Marathi'],
    maxDistance: 10, experience: 'Nurse with 5 years of clinical experience',
    verificationStatus: 'pending', identityVerified: false, skillsVerified: false, certificatesVerified: false,
    assignments: []
  },
];

// ─── ASSIGNMENTS ─────────────────────────────────────────────────────────────
const assignments: VolunteerAssignment[] = [
  {
    id: 'ASN-001', incidentId: 'RL-INC-001', volunteerId: 'VOL001',
    taskCategory: 'Medical Assistance',
    area: 'Riverside Colony, Kalyan Nagar',
    urgency: 'critical',
    requiredSkills: ['First Aid', 'Medical Support'],
    assignedDate: '2024-11-02T09:30:00Z',
    status: 'in_progress',
    taskObjective: 'Provide first aid to injured residents and assist in medical triage at Riverside Colony flood site.',
    safetyInstructions: 'Do not enter water above knee level without safety harness. Always work in pairs. Keep communication device charged.',
    authorityInstructions: 'Report to Team Alpha lead at Bridge No. 4 entry point. Carry first aid kit issued by district supply centre.',
    equipment: ['First Aid Kit', 'Safety Harness', 'Communication Radio', 'Protective Gloves'],
    progressNotes: 'Reached site. Treated 5 persons. Working with NDRF team.',
    teamInfo: 'Team Alpha – Kalyan Nagar Flood Response',
  },
];

// ─── INVENTORY ───────────────────────────────────────────────────────────────
const inventory: InventoryItem[] = [
  { id: 'INV-001', name: 'Drinking Water (1L Bottles)', category: 'water', totalStock: 5000, reservedStock: 1200, availableStock: 3800, requiredStock: 6000, incomingStock: 2000, unavailableStock: 0, warehouse: 'Central Warehouse – Thane', unit: 'bottles', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z' },
  { id: 'INV-002', name: 'Ready-to-eat Food Packets', category: 'food', totalStock: 3000, reservedStock: 800, availableStock: 2200, requiredStock: 4000, incomingStock: 1000, unavailableStock: 50, warehouse: 'Central Warehouse – Thane', unit: 'packets', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z', expiryDate: '2024-12-31' },
  { id: 'INV-003', name: 'Blankets', category: 'shelter', totalStock: 500, reservedStock: 150, availableStock: 350, requiredStock: 700, incomingStock: 200, unavailableStock: 10, warehouse: 'Regional Store – Bhiwandi', unit: 'pieces', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z' },
  { id: 'INV-004', name: 'First Aid Kits', category: 'medical', totalStock: 200, reservedStock: 50, availableStock: 150, requiredStock: 300, incomingStock: 100, unavailableStock: 5, warehouse: 'Medical Store – Kalyan', unit: 'kits', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z' },
  { id: 'INV-005', name: 'Tarpaulins', category: 'shelter', totalStock: 300, reservedStock: 80, availableStock: 220, requiredStock: 400, incomingStock: 100, unavailableStock: 0, warehouse: 'Central Warehouse – Thane', unit: 'pieces', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z' },
  { id: 'INV-006', name: 'Dry Ration Kits', category: 'food', totalStock: 800, reservedStock: 200, availableStock: 600, requiredStock: 1000, incomingStock: 300, unavailableStock: 20, warehouse: 'Regional Store – Bhiwandi', unit: 'kits', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z', expiryDate: '2025-03-31' },
  { id: 'INV-007', name: 'Baby Food Packets', category: 'food', totalStock: 150, reservedStock: 30, availableStock: 120, requiredStock: 200, incomingStock: 50, unavailableStock: 0, warehouse: 'Medical Store – Kalyan', unit: 'packets', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z', expiryDate: '2025-01-31' },
  { id: 'INV-008', name: 'Hygiene Kits', category: 'clothing_essentials', totalStock: 400, reservedStock: 100, availableStock: 300, requiredStock: 500, incomingStock: 150, unavailableStock: 10, warehouse: 'Central Warehouse – Thane', unit: 'kits', condition: 'good', inspectionStatus: 'inspected', lastUpdated: '2024-11-02T08:00:00Z' },
];

// ─── DONATIONS ───────────────────────────────────────────────────────────────
const donations: Donation[] = [
  {
    id: 'DON-001', donorId: 'D001', donorName: 'Helping Hand Foundation',
    type: 'monetary', status: 'allocated',
    submittedAt: '2024-11-01T10:00:00Z', updatedAt: '2024-11-02T09:00:00Z',
    amount: 50000, currency: 'INR', preferredZone: 'Kalyan Nagar',
    preferredCategory: 'food', message: 'For flood relief operations.',
    transactionRef: 'TXN-HL-20241101-001',
  },
  {
    id: 'DON-002', donorId: 'D001', donorName: 'Helping Hand Foundation',
    type: 'material', status: 'added_to_inventory',
    submittedAt: '2024-11-01T11:00:00Z', updatedAt: '2024-11-02T10:00:00Z',
    preferredZone: 'Thane', preferredCategory: 'water',
    items: [
      { id: 'DI-001', name: 'Bottled Water (1L)', category: 'water', quantity: 1000, unit: 'bottles', condition: 'new', pickupDropoff: 'dropoff', location: 'Central Warehouse – Thane', inspectionStatus: 'accepted', inspectionNotes: 'Quality check passed. Within expiry.' },
      { id: 'DI-002', name: 'Hygiene Kits', category: 'clothing_essentials', quantity: 50, unit: 'kits', condition: 'new', pickupDropoff: 'dropoff', location: 'Central Warehouse – Thane', inspectionStatus: 'accepted', inspectionNotes: 'All items in good condition.' },
    ]
  },
  {
    id: 'DON-003', donorId: 'D001', donorName: 'Helping Hand Foundation',
    type: 'material', status: 'inspected',
    submittedAt: '2024-11-02T08:00:00Z', updatedAt: '2024-11-02T12:00:00Z',
    preferredZone: 'Bhiwandi', preferredCategory: 'shelter',
    items: [
      { id: 'DI-003', name: 'Blankets', category: 'shelter', quantity: 100, unit: 'pieces', condition: 'good', pickupDropoff: 'pickup', location: 'Bhiwandi Storage Facility', inspectionStatus: 'pending', inspectionNotes: 'Awaiting quality inspection.' },
    ]
  },
];

// ─── FACILITIES ───────────────────────────────────────────────────────────────
const facilities: Facility[] = [
  { id: 'FAC-001', name: 'Civil Hospital Thane', type: 'hospital', address: 'Hospital Road, Thane West', locality: 'Thane West', lat: 19.1990, lng: 72.9601, phone: '022-25343421', services: ['Emergency Care', 'Surgery', 'ICU', 'Blood Bank'], status: 'operational', lastVerified: '2024-11-02T06:00:00Z', capacity: 500, currentOccupancy: 380 },
  { id: 'FAC-002', name: 'Flood Relief Camp – Government School', type: 'relief_camp', address: 'Govt. School No. 4, Kalyan Nagar', locality: 'Kalyan Nagar', lat: 19.2200, lng: 72.9800, phone: '022-25001234', services: ['Shelter', 'Food Distribution', 'Medical Aid', 'Child Care'], status: 'operational', lastVerified: '2024-11-02T07:00:00Z', capacity: 300, currentOccupancy: 212 },
  { id: 'FAC-003', name: 'Bhiwandi Food Distribution Centre', type: 'food_distribution', address: 'Near Bus Depot, Bhiwandi', locality: 'Bhiwandi', lat: 19.2970, lng: 73.0570, phone: '022-25009876', services: ['Food Distribution', 'Water', 'Dry Rations'], status: 'operational', lastVerified: '2024-11-02T07:30:00Z' },
  { id: 'FAC-004', name: 'Kalyan Fire Station', type: 'fire_station', address: 'Station Road, Kalyan', locality: 'Kalyan', lat: 19.2430, lng: 73.1355, phone: '022-21215000', services: ['Fire Fighting', 'Rescue', 'Flood Rescue Boats'], status: 'operational', lastVerified: '2024-11-02T05:00:00Z' },
  { id: 'FAC-005', name: 'Emergency Medical Centre – Bhiwandi', type: 'medical_centre', address: 'Main Road, Bhiwandi', locality: 'Bhiwandi', lat: 19.3010, lng: 73.0580, phone: '022-25444444', services: ['First Aid', 'Basic Medical Care', 'Ambulance'], status: 'limited', lastVerified: '2024-11-02T08:00:00Z' },
  { id: 'FAC-006', name: 'Central Warehouse – Thane', type: 'warehouse', address: 'Industrial Area, Thane', locality: 'Thane', lat: 19.2000, lng: 72.9700, phone: '022-25001111', services: ['Food Storage', 'Water Storage', 'Shelter Materials'], status: 'operational', lastVerified: '2024-11-02T06:00:00Z' },
];

// ─── NGOs ─────────────────────────────────────────────────────────────────────
const ngos: NGO[] = [
  { id: 'NGO-001', name: 'Helping Hand Foundation', type: 'ngo', address: 'B-12, Civic Centre, Thane', locality: 'Thane', phone: '+91-22-25001234', email: 'info@helpinghand.org', services: ['Food Distribution', 'Shelter', 'Medical Aid', 'Rescue Coordination'], status: 'operational', contactPerson: 'Ramesh Joshi', lastUpdated: '2024-11-02T07:00:00Z' },
  { id: 'NGO-002', name: 'Red Cross – Thane Chapter', type: 'ngo', address: 'Red Cross Bhavan, Thane', locality: 'Thane', phone: '+91-22-25009999', email: 'thane@redcross.in', services: ['Blood Bank', 'First Aid Training', 'Disaster Response'], status: 'operational', contactPerson: 'Sunita Rao', lastUpdated: '2024-11-02T07:00:00Z' },
  { id: 'NGO-003', name: 'Govt. Relief Camp – Kalyan Nagar School', type: 'relief_camp', address: 'Near Brigade Road, Kalyan Nagar', locality: 'Kalyan Nagar', lat: 19.2210, lng: 72.9810, phone: '022-25001234', services: ['Shelter (200 capacity)', 'Food 3x daily', 'Medical', 'Children care'], capacity: 200, currentOccupancy: 148, status: 'operational', lastUpdated: '2024-11-02T08:00:00Z' },
];

// ─── ANNOUNCEMENTS ───────────────────────────────────────────────────────────
const announcements: Announcement[] = [
  {
    id: 'ANN-001', title: 'Flood Alert – Kalyan Nagar & Bhiwandi Area',
    message: 'Heavy flooding reported in Kalyan Nagar and Bhiwandi areas. All residents in low-lying areas are advised to move to higher ground immediately. Relief camps have been set up at Government School No. 4, Kalyan Nagar.',
    audience: ['all'], priority: 'critical',
    publishedAt: '2024-11-02T06:00:00Z', publishedBy: 'District Collector Raj Patel',
    expiresAt: '2024-11-04T06:00:00Z'
  },
  {
    id: 'ANN-002', title: 'Volunteers Required – Report to Kalyan Distribution Centre',
    message: 'Volunteers with logistics and driving skills are urgently needed at the Kalyan Distribution Centre. Please report by 10:00 AM. Contact: 022-25001234.',
    audience: ['volunteers'], priority: 'high',
    publishedAt: '2024-11-02T07:30:00Z', publishedBy: 'District Collector Raj Patel',
  },
  {
    id: 'ANN-003', title: 'Thank You – Donor Update',
    message: 'Your contributions are making a difference. As of this morning, 212 flood-affected residents have been sheltered at Kalyan Nagar Relief Camp. 60 litres of drinking water and 50 food packets have been delivered to Riverside Colony.',
    audience: ['donors'], priority: 'medium',
    publishedAt: '2024-11-02T10:00:00Z', publishedBy: 'District Collector Raj Patel',
  },
];

// ─── DISTRIBUTIONS ───────────────────────────────────────────────────────────
const distributions: Distribution[] = [
  {
    id: 'DIST-001', incidentId: 'RL-INC-001', resourceId: 'RR-001',
    resourceName: 'Drinking Water', quantity: 100, allocatedQuantity: 100, dispatchedQuantity: 80, deliveredQuantity: 60,
    assignedTeam: 'Team Alpha', distributionCentre: 'Central Warehouse – Thane',
    status: 'partially_delivered', createdAt: '2024-11-02T09:00:00Z', updatedAt: '2024-11-02T14:00:00Z',
    confirmedBy: 'AUTH001'
  },
  {
    id: 'DIST-002', incidentId: 'RL-INC-001', resourceId: 'RR-002',
    resourceName: 'Ready-to-eat Food Packets', quantity: 50, allocatedQuantity: 50, dispatchedQuantity: 50, deliveredQuantity: 50,
    assignedTeam: 'Team Alpha', distributionCentre: 'Central Warehouse – Thane',
    status: 'delivered', createdAt: '2024-11-02T09:00:00Z', updatedAt: '2024-11-02T13:00:00Z',
    confirmedBy: 'AUTH001'
  },
];

// ─── AUDIT LOG ───────────────────────────────────────────────────────────────
const auditLog: AuditEntry[] = [
  { id: 'GLOG-001', action: 'Incident Verified', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T08:00:00Z', details: 'RL-INC-001 verified after field confirmation', entityId: 'RL-INC-001', entityType: 'incident' },
  { id: 'GLOG-002', action: 'Resources Allocated', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T09:00:00Z', details: 'Water, Food, Blankets allocated to RL-INC-001', entityId: 'RL-INC-001', entityType: 'incident' },
  { id: 'GLOG-003', action: 'Volunteer Assigned', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T09:30:00Z', details: 'Arjun Kumar assigned to ASN-001 for RL-INC-001', entityId: 'ASN-001', entityType: 'assignment' },
  { id: 'GLOG-004', action: 'Assignment Accepted', actorId: 'VOL001', actorName: 'Arjun Kumar', actorRole: 'volunteer', timestamp: '2024-11-02T09:45:00Z', details: 'Volunteer accepted ASN-001', entityId: 'ASN-001', entityType: 'assignment' },
  { id: 'GLOG-005', action: 'Delivery Confirmed', actorId: 'AUTH001', actorName: 'District Collector Raj Patel', actorRole: 'authority', timestamp: '2024-11-02T14:00:00Z', details: '60L water delivered to RL-INC-001', entityId: 'DIST-001', entityType: 'distribution' },
  { id: 'GLOG-006', action: 'Donation Registered', actorId: 'D001', actorName: 'Helping Hand Foundation', actorRole: 'donor', timestamp: '2024-11-01T10:00:00Z', details: '₹50,000 monetary donation registered', entityId: 'DON-001', entityType: 'donation' },
];

export const mockData: AppState = {
  incidents,
  volunteers,
  inventory,
  donations,
  facilities,
  ngos,
  announcements,
  distributions,
  assignments,
  auditLog,
};
