import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './store/AppContext';
import { AuthProvider, useAuth } from './store/AuthContext';

// Public
import HomePage from './portals/public/HomePage';

// Auth pages
import VictimAuth from './portals/victim/VictimAuth';
import VolunteerAuth from './portals/volunteer/VolunteerAuth';
import AuthorityAuth from './portals/authority/AuthorityAuth';
import DonorAuth from './portals/donor/DonorAuth';

// Victim Portal
import VictimDashboard from './portals/victim/VictimDashboard';
import EmergencyReport from './portals/victim/EmergencyReport';
import MyRequests from './portals/victim/MyRequests';
import NearbyHelp from './portals/victim/NearbyHelp';

// Volunteer Portal
import VolunteerDashboard from './portals/volunteer/VolunteerDashboard';
import AssignmentDetails from './portals/volunteer/AssignmentDetails';
import ContributionHistory from './portals/volunteer/ContributionHistory';

// Authority Portal
import AuthorityDashboard from './portals/authority/AuthorityDashboard';
import IncidentManagement from './portals/authority/IncidentManagement';
import VolunteerManagement from './portals/authority/VolunteerManagement';
import InventoryManagement from './portals/authority/InventoryManagement';
import DisasterMap from './portals/authority/DisasterMap';
import ReliefDistribution from './portals/authority/ReliefDistribution';
import NGODirectory from './portals/authority/NGODirectory';
import DonorManagement from './portals/authority/DonorManagement';
import AnnouncementsPage from './portals/authority/AnnouncementsPage';
import ReportsAnalytics from './portals/authority/ReportsAnalytics';
import AuditLogs from './portals/authority/AuditLogs';

// Donor Portal
import DonorDashboard from './portals/donor/DonorDashboard';
import MakeDonation from './portals/donor/MakeDonation';
import DonationHistory from './portals/donor/DonationHistory';

// Protected Route
function ProtectedRoute({ children, role }: { children: React.ReactNode; role?: string }) {
  const { currentUser, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (role && currentUser?.role !== role) return <Navigate to="/" replace />;
  return <>{children}</>;
}

function AppRoutes() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<HomePage />} />

      {/* Auth Pages */}
      <Route path="/victim/login" element={<VictimAuth />} />
      <Route path="/volunteer/login" element={<VolunteerAuth />} />
      <Route path="/authority/login" element={<AuthorityAuth />} />
      <Route path="/donor/login" element={<DonorAuth />} />

      {/* Victim Portal */}
      <Route path="/victim/dashboard" element={<ProtectedRoute role="victim"><VictimDashboard /></ProtectedRoute>} />
      <Route path="/victim/report" element={<ProtectedRoute role="victim"><EmergencyReport /></ProtectedRoute>} />
      <Route path="/victim/requests" element={<ProtectedRoute role="victim"><MyRequests /></ProtectedRoute>} />
      <Route path="/victim/nearby" element={<ProtectedRoute role="victim"><NearbyHelp /></ProtectedRoute>} />

      {/* Volunteer Portal */}
      <Route path="/volunteer/dashboard" element={<ProtectedRoute role="volunteer"><VolunteerDashboard /></ProtectedRoute>} />
      <Route path="/volunteer/assignments" element={<ProtectedRoute role="volunteer"><AssignmentDetails /></ProtectedRoute>} />
      <Route path="/volunteer/history" element={<ProtectedRoute role="volunteer"><ContributionHistory /></ProtectedRoute>} />

      {/* Authority Portal */}
      <Route path="/authority/dashboard" element={<ProtectedRoute role="authority"><AuthorityDashboard /></ProtectedRoute>} />
      <Route path="/authority/map" element={<ProtectedRoute role="authority"><DisasterMap /></ProtectedRoute>} />
      <Route path="/authority/incidents" element={<ProtectedRoute role="authority"><IncidentManagement /></ProtectedRoute>} />
      <Route path="/authority/volunteers" element={<ProtectedRoute role="authority"><VolunteerManagement /></ProtectedRoute>} />
      <Route path="/authority/inventory" element={<ProtectedRoute role="authority"><InventoryManagement /></ProtectedRoute>} />
      <Route path="/authority/distribution" element={<ProtectedRoute role="authority"><ReliefDistribution /></ProtectedRoute>} />
      <Route path="/authority/ngos" element={<ProtectedRoute role="authority"><NGODirectory /></ProtectedRoute>} />
      <Route path="/authority/donations" element={<ProtectedRoute role="authority"><DonorManagement /></ProtectedRoute>} />
      <Route path="/authority/announcements" element={<ProtectedRoute role="authority"><AnnouncementsPage /></ProtectedRoute>} />
      <Route path="/authority/reports" element={<ProtectedRoute role="authority"><ReportsAnalytics /></ProtectedRoute>} />
      <Route path="/authority/audit" element={<ProtectedRoute role="authority"><AuditLogs /></ProtectedRoute>} />

      {/* Donor Portal */}
      <Route path="/donor/dashboard" element={<ProtectedRoute role="donor"><DonorDashboard /></ProtectedRoute>} />
      <Route path="/donor/donate" element={<ProtectedRoute role="donor"><MakeDonation /></ProtectedRoute>} />
      <Route path="/donor/donations" element={<ProtectedRoute role="donor"><DonationHistory /></ProtectedRoute>} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRoutes />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
