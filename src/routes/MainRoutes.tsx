import AdminDestinations from "../pages/AdminDestinations";
import AdminTrips from "../pages/AdminTrips";
import AdminItineraries from "../pages/AdminItineraries";
import AdminExperiences from "../pages/AdminExperiences";
import AdminFlights from "../pages/AdminFlights";
import AdminReviews from "../pages/AdminReviews";
import AdminAnalytics from "../pages/AdminAnalytics";
import AdminNotifications from "../pages/AdminNotifications";
import AdminAuditLogs from "../pages/AdminAuditLogs";
import AdminBulkActions from "../pages/AdminBulkActions";
import AdminSettings from "../pages/AdminSettings";
import AdminChatManagement from "../pages/AdminChatManagement";
import AdminDocuments from "../pages/AdminDocuments";
import AdminSavedDestinations from "../pages/AdminSavedDestinations";
import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthGuard from '../guards/AuthGuard';
import AdminRoute from "../components/AdminRoute";

// Pages
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import DestinationsPage from "../pages/Destinations";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import Dashboard from "../pages/Dashboard";
import TravelAssistant from "../pages/TravelAssistant";
import DestinationInfo from "../pages/DestinationInfo";
import TripDetails from "../pages/TripDetails";
import ProfileSettings from "../pages/ProfileSettings";
import CountryNews from "../pages/CountryNews";
import AdminDashboard from "../pages/AdminDashboard";
import AdminUsers from "../pages/AdminUsers";
import AdminTravelManagement from "../pages/AdminTravelManagement";
import AdminServiceRequests from "@/pages/AdminServiceRequests";
import Chat from "../pages/Chat";
import ServiceRequest from "@/pages/ServiceRequest";
import FlightSearch from "@/pages/FlightSearch";

export default function MainRoutes() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public routes */}
        <Route path="/" element={<Index />} />
        <Route path="/login" element={<Login />} />
  <Route path="/signup" element={<Signup />} />
  <Route path="/forgot-password" element={<ForgotPassword />} />
        {/* Browse all destinations */}
        <Route path="/destinations" element={<DestinationsPage />} />
        <Route path="/destination" element={<DestinationsPage />} />
        
        {/* Protected routes - all wrapped with AuthGuard */}
        <Route 
          path="/dashboard" 
          element={
            <AuthGuard>
              <Dashboard />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminDashboard />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/users" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminUsers />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/travel-management" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminTravelManagement />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/assistant" 
          element={
            <AuthGuard>
              <TravelAssistant />
            </AuthGuard>
          } 
        />
        <Route 
          path="/destination/:id" 
          element={
            <AuthGuard>
              <DestinationInfo />
            </AuthGuard>
          } 
        />
        <Route 
          path="/trip/:id" 
          element={
            <AuthGuard>
              <TripDetails />
            </AuthGuard>
          } 
        />
        <Route 
          path="/profile" 
          element={
            <AuthGuard>
              <ProfileSettings />
            </AuthGuard>
          } 
        />
        <Route 
          path="/country-news/:countryId" 
          element={
            <AuthGuard>
              <CountryNews />
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/service-requests"
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminServiceRequests />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/chat" 
          element={
            <AuthGuard>
              <Chat />
            </AuthGuard>
          } 
        />
        <Route 
          path="/service-request" 
          element={
            <AuthGuard>
              <ServiceRequest />
            </AuthGuard>
          } 
        />
        <Route 
          path="/flights" 
          element={
            <AuthGuard>
              <FlightSearch />
            </AuthGuard>
          } 
        />
        
        {/* Admin new pages */}
        <Route 
          path="/admin/destinations" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminDestinations />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/trips" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminTrips />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/itineraries" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminItineraries />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/experiences" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminExperiences />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/flights" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminFlights />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/reviews" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminReviews />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/analytics" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminAnalytics />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/notifications" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminNotifications />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/audit-logs" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminAuditLogs />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/bulk-actions" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminBulkActions />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/settings" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminSettings />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/chat-management" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminChatManagement />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/documents" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminDocuments />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        <Route 
          path="/admin/saved-destinations" 
          element={
            <AuthGuard>
              <AdminRoute>
                <AdminSavedDestinations />
              </AdminRoute>
            </AuthGuard>
          } 
        />
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
