import { AnimatePresence } from "framer-motion";
import { Routes, Route, useLocation } from "react-router-dom";
import AuthGuard from '../guards/AuthGuard';
import AdminRoute from "../components/AdminRoute";

// Pages
import Index from "../pages/Index";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
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
        
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </AnimatePresence>
  );
}
