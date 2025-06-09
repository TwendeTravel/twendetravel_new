export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      admin_assignments: {
        Row: {
          admin_id: string
          assigned_at: string | null
          created_at: string | null
          id: string
          is_active: boolean | null
          traveler_id: string
          updated_at: string | null
        }
        Insert: {
          admin_id: string
          assigned_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          traveler_id: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string
          assigned_at?: string | null
          created_at?: string | null
          id?: string
          is_active?: boolean | null
          traveler_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      bookings: {
        Row: {
          created_at: string
          id: string
          status: string
          total_amount: number
          trip_id: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          status?: string
          total_amount: number
          trip_id: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          status?: string
          total_amount?: number
          trip_id?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "bookings_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      call_sessions: {
        Row: {
          conversation_id: string
          created_at: string | null
          end_time: string | null
          id: string
          initiator_id: string
          recipient_id: string
          start_time: string | null
          status: string | null
          updated_at: string | null
        }
        Insert: {
          conversation_id: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          initiator_id: string
          recipient_id: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Update: {
          conversation_id?: string
          created_at?: string | null
          end_time?: string | null
          id?: string
          initiator_id?: string
          recipient_id?: string
          start_time?: string | null
          status?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "call_sessions_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          admin_id: string | null
          created_at: string | null
          id: string
          status: string | null
          title: string
          traveler_id: string
          updated_at: string | null
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          title: string
          traveler_id: string
          updated_at?: string | null
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          id?: string
          status?: string | null
          title?: string
          traveler_id?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      destinations: {
        Row: {
          country: string
          created_at: string
          id: string
          image: string
          name: string
          popular: string
          price: string
          rating: number
          updated_at: string
        }
        Insert: {
          country: string
          created_at?: string
          id?: string
          image: string
          name: string
          popular: string
          price: string
          rating?: number
          updated_at?: string
        }
        Update: {
          country?: string
          created_at?: string
          id?: string
          image?: string
          name?: string
          popular?: string
          price?: string
          rating?: number
          updated_at?: string
        }
        Relationships: []
      }
      emergency_contacts: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string
          phone: string
          relationship: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name: string
          phone: string
          relationship: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string
          phone?: string
          relationship?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      experiences: {
        Row: {
          category: string
          created_at: string | null
          description: string
          id: string
          image: string
          title: string
          updated_at: string | null
        }
        Insert: {
          category: string
          created_at?: string | null
          description: string
          id?: string
          image: string
          title: string
          updated_at?: string | null
        }
        Update: {
          category?: string
          created_at?: string | null
          description?: string
          id?: string
          image?: string
          title?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      flight_bookings: {
        Row: {
          airline: string
          arrival_airport: string
          arrival_time: string
          booking_reference: string | null
          created_at: string | null
          departure_airport: string
          departure_time: string
          flight_number: string
          id: string
          itinerary_item_id: string
          seat_class: string | null
          updated_at: string | null
        }
        Insert: {
          airline: string
          arrival_airport: string
          arrival_time: string
          booking_reference?: string | null
          created_at?: string | null
          departure_airport: string
          departure_time: string
          flight_number: string
          id?: string
          itinerary_item_id: string
          seat_class?: string | null
          updated_at?: string | null
        }
        Update: {
          airline?: string
          arrival_airport?: string
          arrival_time?: string
          booking_reference?: string | null
          created_at?: string | null
          departure_airport?: string
          departure_time?: string
          flight_number?: string
          id?: string
          itinerary_item_id?: string
          seat_class?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "flight_bookings_itinerary_item_id_fkey"
            columns: ["itinerary_item_id"]
            isOneToOne: true
            referencedRelation: "itinerary_items"
            referencedColumns: ["id"]
          },
        ]
      }
      hotel_bookings: {
        Row: {
          booking_reference: string | null
          check_in_date: string
          check_out_date: string
          created_at: string | null
          hotel_name: string
          id: string
          itinerary_item_id: string
          number_of_guests: number
          room_type: string
          special_requests: string | null
          updated_at: string | null
        }
        Insert: {
          booking_reference?: string | null
          check_in_date: string
          check_out_date: string
          created_at?: string | null
          hotel_name: string
          id?: string
          itinerary_item_id: string
          number_of_guests?: number
          room_type: string
          special_requests?: string | null
          updated_at?: string | null
        }
        Update: {
          booking_reference?: string | null
          check_in_date?: string
          check_out_date?: string
          created_at?: string | null
          hotel_name?: string
          id?: string
          itinerary_item_id?: string
          number_of_guests?: number
          room_type?: string
          special_requests?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "hotel_bookings_itinerary_item_id_fkey"
            columns: ["itinerary_item_id"]
            isOneToOne: true
            referencedRelation: "itinerary_items"
            referencedColumns: ["id"]
          },
        ]
      }
      itineraries: {
        Row: {
          admin_id: string | null
          created_at: string | null
          description: string | null
          end_date: string
          id: string
          start_date: string
          status: string | null
          title: string
          total_budget: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          admin_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date: string
          id?: string
          start_date: string
          status?: string | null
          title: string
          total_budget?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          admin_id?: string | null
          created_at?: string | null
          description?: string | null
          end_date?: string
          id?: string
          start_date?: string
          status?: string | null
          title?: string
          total_budget?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      itinerary_items: {
        Row: {
          created_at: string | null
          date_time: string | null
          description: string | null
          id: string
          itinerary_id: string
          price: number
          provider_name: string
          provider_reference: string | null
          service_id: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status: Database["public"]["Enums"]["booking_status"] | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_time?: string | null
          description?: string | null
          id?: string
          itinerary_id: string
          price: number
          provider_name: string
          provider_reference?: string | null
          service_id?: string | null
          service_type: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_time?: string | null
          description?: string | null
          id?: string
          itinerary_id?: string
          price?: number
          provider_name?: string
          provider_reference?: string | null
          service_id?: string | null
          service_type?: Database["public"]["Enums"]["service_type"]
          status?: Database["public"]["Enums"]["booking_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "itinerary_items_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "itinerary_items_service_id_fkey"
            columns: ["service_id"]
            isOneToOne: false
            referencedRelation: "services"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          content: string
          conversation_id: string
          created_at: string | null
          id: string
          sender_id: string
          status: Database["public"]["Enums"]["message_status"] | null
          updated_at: string | null
        }
        Insert: {
          content: string
          conversation_id: string
          created_at?: string | null
          id?: string
          sender_id: string
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Update: {
          content?: string
          conversation_id?: string
          created_at?: string | null
          id?: string
          sender_id?: string
          status?: Database["public"]["Enums"]["message_status"] | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          id: string
          is_read: boolean | null
          message: string
          notification_type: string
          related_id: string | null
          title: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message: string
          notification_type: string
          related_id?: string | null
          title: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          is_read?: boolean | null
          message?: string
          notification_type?: string
          related_id?: string | null
          title?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      payments: {
        Row: {
          amount: number
          created_at: string | null
          currency: string | null
          id: string
          itinerary_id: string | null
          payment_date: string | null
          payment_method: string
          status: string | null
          transaction_id: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          currency?: string | null
          id?: string
          itinerary_id?: string | null
          payment_date?: string | null
          payment_method: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          itinerary_id?: string | null
          payment_date?: string | null
          payment_method?: string
          status?: string | null
          transaction_id?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "payments_itinerary_id_fkey"
            columns: ["itinerary_id"]
            isOneToOne: false
            referencedRelation: "itineraries"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          comment: string | null
          created_at: string
          destination_id: string
          id: string
          rating: number
          trip_id: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          comment?: string | null
          created_at?: string
          destination_id: string
          id?: string
          rating: number
          trip_id?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          comment?: string | null
          created_at?: string
          destination_id?: string
          id?: string
          rating?: number
          trip_id?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_trip_id_fkey"
            columns: ["trip_id"]
            isOneToOne: false
            referencedRelation: "trips"
            referencedColumns: ["id"]
          },
        ]
      }
      saved_destinations: {
        Row: {
          created_at: string
          destination_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "saved_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      service_requests: {
        Row: {
          accommodation_preference: string | null
          budget: number
          created_at: string | null
          destination: string
          end_date: string
          id: string
          service_type: string
          special_requirements: string | null
          start_date: string
          status: string | null
          transportation_preference: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          accommodation_preference?: string | null
          budget: number
          created_at?: string | null
          destination: string
          end_date: string
          id?: string
          service_type: string
          special_requirements?: string | null
          start_date: string
          status?: string | null
          transportation_preference?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          accommodation_preference?: string | null
          budget?: number
          created_at?: string | null
          destination?: string
          end_date?: string
          id?: string
          service_type?: string
          special_requirements?: string | null
          start_date?: string
          status?: string | null
          transportation_preference?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      services: {
        Row: {
          base_price: number
          created_at: string | null
          description: string
          id: string
          is_active: boolean | null
          name: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at: string | null
        }
        Insert: {
          base_price: number
          created_at?: string | null
          description: string
          id?: string
          is_active?: boolean | null
          name: string
          service_type: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Update: {
          base_price?: number
          created_at?: string | null
          description?: string
          id?: string
          is_active?: boolean | null
          name?: string
          service_type?: Database["public"]["Enums"]["service_type"]
          updated_at?: string | null
        }
        Relationships: []
      }
      transportation_bookings: {
        Row: {
          booking_reference: string | null
          created_at: string | null
          driver_details: string | null
          dropoff_location: string
          id: string
          itinerary_item_id: string
          pickup_location: string
          pickup_time: string
          transport_type: string
          updated_at: string | null
          vehicle_details: string | null
        }
        Insert: {
          booking_reference?: string | null
          created_at?: string | null
          driver_details?: string | null
          dropoff_location: string
          id?: string
          itinerary_item_id: string
          pickup_location: string
          pickup_time: string
          transport_type: string
          updated_at?: string | null
          vehicle_details?: string | null
        }
        Update: {
          booking_reference?: string | null
          created_at?: string | null
          driver_details?: string | null
          dropoff_location?: string
          id?: string
          itinerary_item_id?: string
          pickup_location?: string
          pickup_time?: string
          transport_type?: string
          updated_at?: string | null
          vehicle_details?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "transportation_bookings_itinerary_item_id_fkey"
            columns: ["itinerary_item_id"]
            isOneToOne: true
            referencedRelation: "itinerary_items"
            referencedColumns: ["id"]
          },
        ]
      }
      travel_documents: {
        Row: {
          created_at: string | null
          id: string
          passport_expiry_date: string | null
          passport_number: string | null
          updated_at: string | null
          user_id: string
          visa_expiry_date: string | null
          visa_type: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          passport_expiry_date?: string | null
          passport_number?: string | null
          updated_at?: string | null
          user_id: string
          visa_expiry_date?: string | null
          visa_type?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          passport_expiry_date?: string | null
          passport_number?: string | null
          updated_at?: string | null
          user_id?: string
          visa_expiry_date?: string | null
          visa_type?: string | null
        }
        Relationships: []
      }
      traveler_preferences: {
        Row: {
          created_at: string | null
          id: string
          meal_preference: string | null
          room_preference: string | null
          seat_preference: string | null
          special_assistance: boolean | null
          special_assistance_details: string | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          meal_preference?: string | null
          room_preference?: string | null
          seat_preference?: string | null
          special_assistance?: boolean | null
          special_assistance_details?: string | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          meal_preference?: string | null
          room_preference?: string | null
          seat_preference?: string | null
          special_assistance?: boolean | null
          special_assistance_details?: string | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      trips: {
        Row: {
          created_at: string
          destination_id: string
          end_date: string
          id: string
          notes: string | null
          start_date: string
          status: string
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          destination_id: string
          end_date: string
          id?: string
          notes?: string | null
          start_date: string
          status?: string
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          destination_id?: string
          end_date?: string
          id?: string
          notes?: string | null
          start_date?: string
          status?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "trips_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
        ]
      }
      user_activities: {
        Row: {
          created_at: string | null
          id: string
          text: string
          time: string | null
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          text: string
          time?: string | null
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          text?: string
          time?: string | null
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string | null
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_stats: {
        Row: {
          business_trips_percent: number | null
          cities_visited: number | null
          countries_visited: number | null
          created_at: string | null
          days_traveled: number | null
          family_trips_percent: number | null
          ghana_trips_percent: number | null
          id: string
          kenya_trips_percent: number | null
          leisure_trips_percent: number | null
          other_trips_percent: number | null
          total_trips: number | null
          updated_at: string | null
          user_id: string
        }
        Insert: {
          business_trips_percent?: number | null
          cities_visited?: number | null
          countries_visited?: number | null
          created_at?: string | null
          days_traveled?: number | null
          family_trips_percent?: number | null
          ghana_trips_percent?: number | null
          id?: string
          kenya_trips_percent?: number | null
          leisure_trips_percent?: number | null
          other_trips_percent?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id: string
        }
        Update: {
          business_trips_percent?: number | null
          cities_visited?: number | null
          countries_visited?: number | null
          created_at?: string | null
          days_traveled?: number | null
          family_trips_percent?: number | null
          ghana_trips_percent?: number | null
          id?: string
          kenya_trips_percent?: number | null
          leisure_trips_percent?: number | null
          other_trips_percent?: number | null
          total_trips?: number | null
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      enable_realtime_for_table: {
        Args: { table_name: string }
        Returns: undefined
      }
      has_role: {
        Args: { _role: Database["public"]["Enums"]["app_role"] }
        Returns: boolean
      }
      insert_sample_services: {
        Args: Record<PropertyKey, never>
        Returns: undefined
      }
    }
    Enums: {
      app_role: "traveller" | "admin"
      booking_status: "pending" | "confirmed" | "canceled" | "completed"
      message_status: "sent" | "delivered" | "read"
      service_type: "flight" | "hotel" | "local_transport" | "airport_transfer"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["traveller", "admin"],
      booking_status: ["pending", "confirmed", "canceled", "completed"],
      message_status: ["sent", "delivered", "read"],
      service_type: ["flight", "hotel", "local_transport", "airport_transfer"],
    },
  },
} as const
