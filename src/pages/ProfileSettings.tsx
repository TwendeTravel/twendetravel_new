
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  User,
  Key,
  Bell,
  CreditCard,
  Languages,
  Plane,
  Shield,
  Upload
} from "lucide-react";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { useToast } from "@/hooks/use-toast";

const ProfileSettings = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  
  // Sample user data
  const [user, setUser] = useState({
    name: "John Smith",
    email: "john.smith@example.com",
    phone: "+1 (555) 123-4567",
    address: "123 Main Street, New York, NY 10001",
    bio: "Passionate traveler and adventure seeker. Love exploring new cultures and experiences.",
    profileImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
  });
  
  const handleSaveProfile = () => {
    toast({
      title: "Profile Updated",
      description: "Your profile information has been saved successfully.",
    });
  };
  
  const handleUploadImage = () => {
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      toast({
        title: "Image Uploaded",
        description: "Your profile image has been updated successfully.",
      });
    }, 1500);
  };
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <DashboardHeader />
      
      <div className="container max-w-6xl mx-auto py-8 px-4">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="w-full md:w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 text-center">
              <div className="relative mx-auto w-32 h-32 mb-4">
                <img 
                  src={user.profileImage} 
                  alt={user.name} 
                  className="w-full h-full rounded-full object-cover"
                />
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 bg-white shadow-sm"
                  onClick={handleUploadImage}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-twende-teal animate-spin"></div>
                  ) : (
                    <Upload className="h-4 w-4" />
                  )}
                </Button>
              </div>
              <h2 className="font-bold text-xl">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
              
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="mt-6"
                orientation="vertical"
              >
                <TabsList className="flex flex-col h-auto items-stretch space-y-1">
                  <TabsTrigger value="profile" className="justify-start">
                    <User className="h-4 w-4 mr-2" />
                    Profile
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start">
                    <Key className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                  <TabsTrigger value="payments" className="justify-start">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payments
                  </TabsTrigger>
                  <TabsTrigger value="preferences" className="justify-start">
                    <Languages className="h-4 w-4 mr-2" />
                    Preferences
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>
          
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsContent value="profile" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>Update your personal information</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name</Label>
                        <Input 
                          id="name" 
                          value={user.name} 
                          onChange={(e) => setUser({...user, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address</Label>
                        <Input 
                          id="email" 
                          type="email" 
                          value={user.email} 
                          onChange={(e) => setUser({...user, email: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input 
                          id="phone" 
                          value={user.phone} 
                          onChange={(e) => setUser({...user, phone: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="address">Address</Label>
                        <Input 
                          id="address" 
                          value={user.address} 
                          onChange={(e) => setUser({...user, address: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio</Label>
                      <Textarea 
                        id="bio" 
                        rows={4} 
                        value={user.bio} 
                        onChange={(e) => setUser({...user, bio: e.target.value})}
                        placeholder="Tell us about yourself and your travel preferences"
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSaveProfile}>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>Manage your account security</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-4">
                      <h3 className="text-lg font-medium">Password</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="current-password">Current Password</Label>
                          <Input id="current-password" type="password" />
                        </div>
                        <div></div>
                        <div className="space-y-2">
                          <Label htmlFor="new-password">New Password</Label>
                          <Input id="new-password" type="password" />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="confirm-password">Confirm New Password</Label>
                          <Input id="confirm-password" type="password" />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Two-Factor Authentication</h3>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label htmlFor="2fa">Enable 2FA</Label>
                            <p className="text-sm text-gray-500">Secure your account with two-factor authentication</p>
                          </div>
                          <Switch id="2fa" />
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Sessions</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div>
                                <p className="font-medium">Current Session</p>
                                <p className="text-sm text-gray-500">New York, United States • Chrome on Windows</p>
                              </div>
                              <Badge variant="outline" className="text-green-600 bg-green-50">Active</Badge>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>Control how and when you receive notifications</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Email Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="email-trip-updates">Trip Updates</Label>
                              <p className="text-sm text-gray-500">Receive emails about changes to your trips</p>
                            </div>
                            <Switch id="email-trip-updates" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="email-reminders">Trip Reminders</Label>
                              <p className="text-sm text-gray-500">Receive reminders about upcoming trips</p>
                            </div>
                            <Switch id="email-reminders" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="email-promotions">Promotions</Label>
                              <p className="text-sm text-gray-500">Receive special offers and promotions</p>
                            </div>
                            <Switch id="email-promotions" />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Push Notifications</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="push-trip-updates">Trip Updates</Label>
                              <p className="text-sm text-gray-500">Receive alerts about changes to your trips</p>
                            </div>
                            <Switch id="push-trip-updates" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="push-reminders">Trip Reminders</Label>
                              <p className="text-sm text-gray-500">Receive reminders about upcoming trips</p>
                            </div>
                            <Switch id="push-reminders" defaultChecked />
                          </div>
                          
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="push-messages">Messages</Label>
                              <p className="text-sm text-gray-500">Receive notifications for new messages</p>
                            </div>
                            <Switch id="push-messages" defaultChecked />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="payments" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Payment Methods</CardTitle>
                    <CardDescription>Manage your payment information</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Saved Payment Methods</h3>
                        <div className="space-y-4">
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <div className="p-2 bg-blue-100 rounded">
                                  <CreditCard className="h-4 w-4 text-blue-600" />
                                </div>
                                <div>
                                  <p className="font-medium">Visa ending in 4242</p>
                                  <p className="text-sm text-gray-500">Expires 12/26</p>
                                </div>
                              </div>
                              <Badge>Primary</Badge>
                            </div>
                          </div>
                        </div>
                        
                        <Button variant="outline" className="mt-4">
                          <CreditCard className="h-4 w-4 mr-2" />
                          Add Payment Method
                        </Button>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Billing Address</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="billing-name">Full Name</Label>
                            <Input id="billing-name" defaultValue="John Smith" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-address">Address</Label>
                            <Input id="billing-address" defaultValue="123 Main Street" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-city">City</Label>
                            <Input id="billing-city" defaultValue="New York" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-state">State/Province</Label>
                            <Input id="billing-state" defaultValue="NY" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-zip">ZIP/Postal Code</Label>
                            <Input id="billing-zip" defaultValue="10001" />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="billing-country">Country</Label>
                            <Input id="billing-country" defaultValue="United States" />
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Changes</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="preferences" className="m-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Travel Preferences</CardTitle>
                    <CardDescription>Customize your travel experience</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-lg font-medium mb-4">Display Settings</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                              <Label htmlFor="dark-mode">Dark Mode</Label>
                              <p className="text-sm text-gray-500">Use dark mode for the application</p>
                            </div>
                            <Switch id="dark-mode" />
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                            <div className="space-y-2">
                              <Label htmlFor="language">Language</Label>
                              <select 
                                id="language" 
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-twende-teal"
                                defaultValue="en"
                              >
                                <option value="en">English</option>
                                <option value="fr">French</option>
                                <option value="es">Spanish</option>
                                <option value="de">German</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="currency">Currency</Label>
                              <select 
                                id="currency" 
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-twende-teal"
                                defaultValue="usd"
                              >
                                <option value="usd">USD ($)</option>
                                <option value="eur">EUR (€)</option>
                                <option value="gbp">GBP (£)</option>
                                <option value="jpy">JPY (¥)</option>
                              </select>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Travel Preferences</h3>
                        <div className="space-y-4">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                              <Label htmlFor="preferred-airline">Preferred Airline</Label>
                              <Input id="preferred-airline" placeholder="e.g., Delta, Emirates" />
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="seating">Preferred Seating</Label>
                              <select 
                                id="seating" 
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-twende-teal"
                                defaultValue="window"
                              >
                                <option value="window">Window</option>
                                <option value="aisle">Aisle</option>
                                <option value="middle">Middle</option>
                                <option value="no-preference">No Preference</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="accommodation-type">Accommodation Type</Label>
                              <select 
                                id="accommodation-type" 
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-twende-teal"
                                defaultValue="hotel"
                              >
                                <option value="hotel">Hotel</option>
                                <option value="resort">Resort</option>
                                <option value="apartment">Apartment</option>
                                <option value="hostel">Hostel</option>
                                <option value="guesthouse">Guesthouse</option>
                              </select>
                            </div>
                            
                            <div className="space-y-2">
                              <Label htmlFor="meal-preference">Meal Preference</Label>
                              <select 
                                id="meal-preference" 
                                className="w-full h-10 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-twende-teal"
                                defaultValue="regular"
                              >
                                <option value="regular">Regular</option>
                                <option value="vegetarian">Vegetarian</option>
                                <option value="vegan">Vegan</option>
                                <option value="gluten-free">Gluten Free</option>
                                <option value="kosher">Kosher</option>
                                <option value="halal">Halal</option>
                              </select>
                            </div>
                          </div>
                          
                          <div className="space-y-2">
                            <Label htmlFor="special-requirements">Special Requirements</Label>
                            <Textarea 
                              id="special-requirements" 
                              placeholder="Any accessibility needs or special requirements we should know about"
                              rows={3}
                            />
                          </div>
                        </div>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h3 className="text-lg font-medium mb-4">Travel Interests</h3>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Beach</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Mountains</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">City</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Cultural</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Food & Dining</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Adventure</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Wildlife</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Luxury</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Budget</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Eco-friendly</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Historical</Badge>
                          <Badge variant="outline" className="cursor-pointer hover:bg-gray-100">Nightlife</Badge>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex justify-end mt-6">
                      <Button>Save Preferences</Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
