import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Globe, Map, FileText, Newspaper } from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import DashboardSidebar from "@/components/dashboard/DashboardSidebar";
import UpcomingTrips from "@/components/dashboard/UpcomingTrips";
import TravelStats from "@/components/dashboard/TravelStats";
import SavedDestinations from "@/components/dashboard/SavedDestinations";
import RecentActivity from "@/components/dashboard/RecentActivity";
import CountryNewsWidget from "@/components/dashboard/CountryNewsWidget";
import ServiceRequestsPanel from "@/components/dashboard/ServiceRequestsPanel";
import PageTransition from "@/components/PageTransition";
import FlightSearch from "@/pages/FlightSearch";
import TravelAssistant from "@/pages/TravelAssistant";
import { ServiceRequestForm } from '@/components/ServiceRequestForm';
import Chat from './Chat';
import { useRole } from '@/hooks/useRole';
import { supabase } from '@/lib/supabaseClient';
import { roleService } from '@/services/roles';
import { serviceRequestService } from '@/services/service-requests';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "overview";
  const { isAdmin, isLoading: roleLoading } = useRole();
  const [stats, setStats] = useState({ totalUsers:0, adminUsers:0, travellerUsers:0, totalTrips:0 });
  const [recentConversations, setRecentConversations] = useState<any[]>([]);
  const [recentRequests, setRecentRequests] = useState<any[]>([]);

  useEffect(() => {
    if (!isAdmin) return;
    // fetch basic stats
    roleService.getAllUserRoles().then(users=>{
      const total=users.length;
      const admin=users.filter(u=>u.role==='admin').length;
      const trav=users.filter(u=>u.role==='traveller').length;
      setStats({ totalUsers:total, adminUsers:admin, travellerUsers:trav, totalTrips:0 });
    });
    // fetch total trips count
    supabase
      .from('trips')
      .select('*', { count: 'exact' })
      .then(({ data, count, error }) => {
        if (error) {
          console.error('Error fetching trip count:', error);
        } else {
          const total = count ?? data?.length ?? 0;
          setStats(prev => ({ ...prev, totalTrips: total }));
        }
      });
    // recent 3 chats
    supabase.from('conversations').select('*').order('updated_at',{ascending:false}).limit(3)
      .then(({data})=>data&&setRecentConversations(data));
    // recent 3 service requests
    serviceRequestService.getAll().then(data=>setRecentRequests(data.slice(0,3)));
  },[isAdmin]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 space-y-6 md:ml-64">
            <Tabs
              value={activeTab}
              onValueChange={(value) => {
                if (value === "overview") {
                  setSearchParams({});
                } else {
                  setSearchParams({ tab: value });
                }
              }}
              className="space-y-6"
            >
              <TabsList className="grid grid-cols-2 sm:grid-cols-8 w-full max-w-4xl bg-card/50 backdrop-blur-sm border border-border/50">
                <TabsTrigger 
                  value="trips" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  My Trips
                </TabsTrigger>
                <TabsTrigger 
                  value="flights" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Flights
                </TabsTrigger>
                <TabsTrigger 
                  value="services" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Services
                </TabsTrigger>
                <TabsTrigger 
                  value="requests" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Requests
                </TabsTrigger>
                <TabsTrigger 
                  value="saved" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Saved
                </TabsTrigger>
                <TabsTrigger 
                  value="news" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  News
                </TabsTrigger>
                <TabsTrigger 
                  value="settings" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Settings
                </TabsTrigger>
                <TabsTrigger
                  value="assistant"
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Travel Assistant
                </TabsTrigger>
                <TabsTrigger
                  value="messages"
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
                { roleLoading ? (
                  <div className="flex items-center justify-center h-40"><div className="loader"></div></div>
                ) : isAdmin ? (
                  <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">  
                      <Card><CardHeader><CardTitle className="text-sm">Total Users</CardTitle></CardHeader>
                        <CardContent><div>{stats.totalUsers}</div></CardContent></Card>
                      <Card><CardHeader><CardTitle className="text-sm">Admin Users</CardTitle></CardHeader>
                        <CardContent><div>{stats.adminUsers}</div></CardContent></Card>
                      <Card><CardHeader><CardTitle className="text-sm">Traveller Users</CardTitle></CardHeader>
                        <CardContent><div>{stats.travellerUsers}</div></CardContent></Card>
                      <Card><CardHeader><CardTitle className="text-sm">Total Trips</CardTitle></CardHeader>
                        <CardContent><div>{stats.totalTrips}</div></CardContent></Card>
                    </div>
                    <div>
                      <h2 className="text-lg font-semibold mb-2">Recent Activities</h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-sm">Recent Chats</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {recentConversations.map(c => (
                                <li key={c.id}>
                                  Conversation {c.id} <span className="text-muted-foreground">{new Date(c.updated_at).toLocaleTimeString()}</span>
                                </li>
                              ))}
                              {recentConversations.length === 0 && <li className="text-muted-foreground">No recent chats</li>}
                            </ul>
                          </CardContent>
                        </Card>
                        <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                          <CardHeader>
                            <CardTitle className="text-sm">Recent Requests</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <ul className="list-disc pl-5 space-y-1 text-sm">
                              {recentRequests.map(r => (
                                <li key={r.id}>
                                  {r.origin} to {r.destination} <span className="text-muted-foreground">{r.status}</span>
                                </li>
                              ))}
                              {recentRequests.length === 0 && <li className="text-muted-foreground">No recent requests</li>}
                            </ul>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  </>
                ) : (
                  <>  {/* traveler overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <Calendar className="h-5 w-5 text-twende-teal dark:text-twende-skyblue" />
                            Upcoming Trips
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">Your scheduled travel plans</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <UpcomingTrips />
                        </CardContent>
                      </Card>
                      
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <FileText className="h-5 w-5 text-twende-teal dark:text-twende-skyblue" />
                            Service Requests
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">Your travel service requests</CardDescription>
                        </CardHeader>
                        <CardContent>
                          <ServiceRequestsPanel />
                        </CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Saved Destinations & Travel Stats for travelers only */}
                      <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <Map className="h-5 w-5 text-twende-orange" />
                            Saved Destinations
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">Places you've bookmarked</CardDescription>
                        </CardHeader>
                        <CardContent><SavedDestinations /></CardContent>
                      </Card>
                      <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                        <CardHeader>
                          <CardTitle className="flex items-center gap-2 text-foreground">
                            <Globe className="h-5 w-5 text-twende-orange" />
                            Travel Stats
                          </CardTitle>
                          <CardDescription className="text-muted-foreground">Your travel statistics</CardDescription>
                        </CardHeader>
                        <CardContent><TravelStats /></CardContent>
                      </Card>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {/* Country news widgets for travelers only */}
                      <CountryNewsWidget country="ghana" limit={2} />
                      <CountryNewsWidget country="kenya" limit={2} />
                      <CountryNewsWidget country="south africa" limit={2} />
                    </div>
                  </>
                )}
              </TabsContent>
              
              <TabsContent value="trips">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">My Trips</CardTitle>
                    <CardDescription className="text-muted-foreground">Manage your upcoming and past travel experiences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <UpcomingTrips extended={true} />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="flights">
                <FlightSearch />
              </TabsContent>

              <TabsContent value="services">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Request Services</CardTitle>
                    <CardDescription className="text-muted-foreground">Select services and submit your request</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ServiceRequestForm />
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="requests">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <FileText className="h-5 w-5" />
                      Service Requests
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Manage your travel service requests
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ServiceRequestsPanel extended={true} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="saved">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Saved Items</CardTitle>
                    <CardDescription className="text-muted-foreground">
                      Destinations, accommodations, and activities you've saved
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <SavedDestinations extended={true} />
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="news">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-foreground">
                      <Newspaper className="h-5 w-5" />
                      Travel News
                    </CardTitle>
                    <CardDescription className="text-muted-foreground">Stay updated on your travel destinations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <CountryNewsWidget country="ghana" limit={2} />
                      <CountryNewsWidget country="kenya" limit={2} />
                      <CountryNewsWidget country="south africa" limit={2} />
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="settings">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Profile Settings</CardTitle>
                    <CardDescription className="text-muted-foreground">Manage your account preferences</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">Settings form will go here</p>
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="assistant" className="space-y-6">
                <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                  <CardHeader>
                    <CardTitle className="text-foreground">Travel Assistant</CardTitle>
                    <CardDescription className="text-muted-foreground">Ask travel questions and get AI-guided responses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <TravelAssistant />
                  </CardContent>
                </Card>
              </TabsContent>
              <TabsContent value="messages">
                <Chat />
              </TabsContent>
            </Tabs>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
