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
import { ServiceRequestForm } from '@/components/ServiceRequestForm';

const Dashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const tabFromUrl = searchParams.get("tab");
  const [activeTab, setActiveTab] = useState(tabFromUrl || "overview");

  useEffect(() => {
    // Update URL when tab changes
    if (activeTab === "overview") {
      searchParams.delete("tab");
      setSearchParams(searchParams);
    } else {
      setSearchParams({ tab: activeTab });
    }
  }, [activeTab, searchParams, setSearchParams]);

  return (
    <PageTransition>
      <div className="min-h-screen bg-background text-foreground">
        <DashboardHeader />
        <div className="flex">
          <DashboardSidebar />
          <main className="flex-1 p-4 md:p-6 space-y-6 md:ml-64">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList className="grid grid-cols-2 sm:grid-cols-7 w-full max-w-4xl bg-card/50 backdrop-blur-sm border border-border/50">
                {/* <TabsTrigger 
                  value="overview" 
                  className="text-muted-foreground data-[state=active]:bg-primary/20 data-[state=active]:text-foreground"
                >
                  Overview
                </TabsTrigger> */}
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
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6">
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
                  <Card className="md:col-span-2 bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Map className="h-5 w-5 text-twende-orange" />
                        Saved Destinations
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Places you've bookmarked</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <SavedDestinations />
                    </CardContent>
                  </Card>
                  
                  <Card className="bg-card/50 backdrop-blur-sm border-border/50 shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2 text-foreground">
                        <Globe className="h-5 w-5 text-twende-orange" />
                        Travel Stats
                      </CardTitle>
                      <CardDescription className="text-muted-foreground">Your travel statistics</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <TravelStats />
                    </CardContent>
                  </Card>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <CountryNewsWidget country="ghana" limit={2} />
                  <CountryNewsWidget country="kenya" limit={2} />
                  <CountryNewsWidget country="south africa" limit={2} />
                </div>
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
            </Tabs>
          </main>
        </div>
      </div>
    </PageTransition>
  );
};

export default Dashboard;
