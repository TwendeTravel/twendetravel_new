import { Timestamp } from 'firebase/firestore';

// User types
export interface User {
  id: string;
  uid: string;
  email: string;
  displayName?: string | null;
  photoURL?: string | null;
  emailVerified: boolean;
  role?: 'admin' | 'traveler';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Role and Permission types
export interface UserPermission {
  id: string;
  userId: string;
  permission: number; // 0 = traveler, 1 = admin
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface UserRole {
  userId: string;
  email: string;
  role: 'admin' | 'traveller';
  createdAt: Timestamp;
}

// Destination types
export interface Destination {
  id: string;
  name: string;
  country: string;
  description: string;
  image: string;
  popular: string[];
  price: string;
  rating: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Trip types
export interface Trip {
  id: string;
  userId: string;
  destinationId: string;
  origin?: string;
  destination?: string;
  startDate: Timestamp;
  endDate: Timestamp;
  status: string;
  notes?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Service Request types
export interface ServiceRequest {
  id: string;
  userId: string;
  type: 'flight' | 'hotel' | 'transport' | 'visa' | 'other';
  description: string;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled';
  priority: 'low' | 'normal' | 'high' | 'urgent';
  assignedTo?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Flight-related types
export interface AirportCache {
  id: string;
  code: string;
  skyId: string;
  entityId: string;
  fetchedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Conversation types
export interface Conversation {
  id: string;
  travelerId: string;
  adminId: string | null;
  title: string;
  status: string;
  priority?: string;
  category?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Message types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  status: 'sent' | 'delivered' | 'read';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Booking types
export interface Booking {
  id: string;
  tripId: string;
  userId: string;
  status: string;
  totalAmount: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Flight Booking types
export interface FlightBooking {
  id: string;
  itineraryItemId: string;
  airline: string;
  flightNumber: string;
  departureAirport: string;
  arrivalAirport: string;
  departureTime: string;
  arrivalTime: string;
  seatClass?: string;
  bookingReference?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Hotel Booking types
export interface HotelBooking {
  id: string;
  itineraryItemId: string;
  hotelName: string;
  roomType: string;
  checkInDate: string;
  checkOutDate: string;
  numberOfGuests: number;
  specialRequests?: string;
  bookingReference?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Itinerary types
export interface Itinerary {
  id: string;
  userId: string;
  adminId?: string;
  title: string;
  description?: string;
  startDate: string;
  endDate: string;
  status?: string;
  totalBudget?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface ItineraryItem {
  id: string;
  itineraryId: string;
  serviceId?: string;
  serviceType: 'flight' | 'hotel' | 'local_transport' | 'airport_transfer';
  providerName: string;
  providerReference?: string;
  dateTime?: string;
  description?: string;
  price: number;
  status: 'pending' | 'confirmed' | 'canceled' | 'completed';
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Review types
export interface Review {
  id: string;
  userId: string;
  destinationId: string;
  tripId?: string;
  rating: number;
  comment?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Saved Destination types
export interface SavedDestination {
  id: string;
  userId: string;
  destinationId: string;
  createdAt: Timestamp;
}

// Experience types
export interface Experience {
  id: string;
  title: string;
  description: string;
  category: string;
  image: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Stats types
export interface UserStats {
  id: string;
  userId: string;
  totalTrips?: number;
  countriesVisited?: number;
  citiesVisited?: number;
  daysTraveled?: number;
  ghanaTripsPercent?: number;
  kenyaTripsPercent?: number;
  businessTripsPercent?: number;
  leisureTripsPercent?: number;
  familyTripsPercent?: number;
  otherTripsPercent?: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Traveler Preferences types
export interface TravelerPreferences {
  id: string;
  userId: string;
  mealPreference?: string;
  roomPreference?: string;
  seatPreference?: string;
  specialAssistance?: boolean;
  specialAssistanceDetails?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Emergency Contact types
export interface EmergencyContact {
  id: string;
  userId: string;
  name: string;
  relationship: string;
  phone: string;
  email?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Travel Document types
export interface TravelDocument {
  id: string;
  userId: string;
  passportNumber?: string;
  passportExpiryDate?: string;
  visaType?: string;
  visaExpiryDate?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Payment types
export interface Payment {
  id: string;
  userId: string;
  itineraryId?: string;
  amount: number;
  currency?: string;
  paymentMethod: string;
  paymentDate?: string;
  transactionId?: string;
  status?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Notification types
export interface Notification {
  id: string;
  userId: string;
  title: string;
  message: string;
  notificationType: string;
  relatedId?: string;
  isRead?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Call Session types
export interface CallSession {
  id: string;
  conversationId: string;
  initiatorId: string;
  recipientId: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Service types
export interface Service {
  id: string;
  name: string;
  description: string;
  serviceType: 'flight' | 'hotel' | 'local_transport' | 'airport_transfer';
  basePrice: number;
  rate: number;
  isActive?: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Transportation Booking types
export interface TransportationBooking {
  id: string;
  itineraryItemId: string;
  transportType: string;
  pickupLocation: string;
  dropoffLocation: string;
  pickupTime: string;
  driverDetails?: string;
  vehicleDetails?: string;
  bookingReference?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// User Activity types
export interface UserActivity {
  id: string;
  userId: string;
  type: string;
  text: string;
  time?: string;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Admin Assignment types
export interface AdminAssignment {
  id: string;
  adminId: string;
  userId: string;
  assignmentType: string;
  assignedAt: Timestamp;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Flight Search types (for caching)
export interface FlightSearch {
  id: string;
  userId: string;
  origin: string;
  destination: string;
  date: string;
  searchedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Airport Cache types
export interface AirportCache {
  id: string;
  code: string;
  skyId: string;
  entityId: string;
  fetchedAt: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Collection names (Firestore collections)
export const COLLECTIONS = {
  USERS: 'users',
  USER_PERMISSIONS: 'userPermissions',
  DESTINATIONS: 'destinations',
  TRIPS: 'trips',
  SERVICE_REQUESTS: 'serviceRequests',
  CONVERSATIONS: 'conversations',
  MESSAGES: 'messages',
  BOOKINGS: 'bookings',
  FLIGHT_BOOKINGS: 'flightBookings',
  HOTEL_BOOKINGS: 'hotelBookings',
  ITINERARIES: 'itineraries',
  ITINERARY_ITEMS: 'itineraryItems',
  REVIEWS: 'reviews',
  SAVED_DESTINATIONS: 'savedDestinations',
  EXPERIENCES: 'experiences',
  USER_STATS: 'userStats',
  TRAVELER_PREFERENCES: 'travelerPreferences',
  EMERGENCY_CONTACTS: 'emergencyContacts',
  TRAVEL_DOCUMENTS: 'travelDocuments',
  PAYMENTS: 'payments',
  NOTIFICATIONS: 'notifications',
  CALL_SESSIONS: 'callSessions',
  SERVICES: 'services',
  TRANSPORTATION_BOOKINGS: 'transportationBookings',
  USER_ACTIVITIES: 'userActivities',
  USER_ROLES: 'userRoles',
  AUDIT_LOGS: 'auditLogs',
  ADMIN_ASSIGNMENTS: 'adminAssignments',
  FLIGHT_SEARCHES: 'flightSearches',
  AIRPORT_CACHE: 'airportCache',
} as const;

// Utility type for creating documents without ID
export type CreateDocumentData<T> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>;

// Utility type for updating documents
export type UpdateDocumentData<T> = Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>;
