
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { TravelDoodles, DecorativeElements } from "@/components/ui/travel-doodles";
import WorkingWhatsAppBackground from "@/components/ui/working-whatsapp-background";
import {
  User,
  Key,
  Bell,
  CreditCard,
  Languages,
  Plane,
  Shield,
  Upload,
  Save,
  ArrowLeft,
  Eye,
  EyeOff,
  Phone,
  MapPin,
  Calendar,
  Mail,
  AlertCircle,
  CheckCircle,
  Camera,
  Edit3,
  Trash2,
  Settings
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { motion } from "framer-motion";
import { storage, auth } from "@/lib/firebase";
import { ref, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { updateProfile, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

const ProfileSettings = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    displayName: user?.displayName || "",
    email: user?.email || "",
    phone: "",
    dateOfBirth: "",
    city: "",
    country: "",
    bio: "",
    photoURL: user?.photoURL || "",
    preferredCurrency: "USD",
    interests: [] as string[],
    nationality: "",
    emergencyContact: "",
    travelPreferences: "",
  });

  // Security state
  const [securityData, setSecurityData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  // Form validation state
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    if (user) {
      setProfileData(prev => ({
        ...prev,
        displayName: user.displayName || "",
        email: user.email || "",
        photoURL: user.photoURL || "",
      }));
    }
  }, [user]);

  // Form validation
  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!profileData.displayName.trim()) {
      newErrors.displayName = "Display name is required";
    }

    if (profileData.phone && !/^\+?[\d\s-()]+$/.test(profileData.phone)) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (profileData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profileData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Track form changes
  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
    setHasChanges(true);
    
    // Clear error for this field
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ""
      }));
    }
  };

  const handleSaveProfile = async () => {
    if (!validateForm()) {
      toast({
        title: "Validation Error",
        description: "Please correct the errors in the form.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      // Update Firebase auth profile
      if (auth.currentUser) {
        await updateProfile(auth.currentUser, {
          displayName: profileData.displayName,
          photoURL: profileData.photoURL,
        });
      }

      // Here you would also save additional profile data to Firestore
      // Example: await userService.updateProfile(auth.currentUser.uid, profileData);

      setHasChanges(false);
      toast({
        title: "Profile Updated",
        description: "Your profile information has been saved successfully.",
      });
    } catch (error) {
      console.error("Profile update error:", error);
      toast({
        title: "Error",
        description: "Failed to update profile. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleUploadImage = async (file: File) => {
    if (!auth.currentUser) {
      toast({
        title: "Authentication Required",
        description: "Please log in to upload a profile image.",
        variant: "destructive",
      });
      return;
    }

    console.log('User authenticated:', auth.currentUser.uid);
    console.log('Storage bucket:', storage.app.options.storageBucket);

    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image smaller than 5MB.",
        variant: "destructive",
      });
      return;
    }

    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select a valid image file.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      // Get auth token to verify authentication
      const token = await auth.currentUser.getIdToken();
      console.log('Auth token obtained, length:', token.length);

      // Create a unique filename with proper extension
      const fileExtension = file.name.split('.').pop()?.toLowerCase() || 'jpg';
      const fileName = `profile-images/${auth.currentUser.uid}-${Date.now()}.${fileExtension}`;
      const storageRef = ref(storage, fileName);

      console.log('Uploading to path:', fileName);
      console.log('File type:', file.type);
      console.log('File size:', file.size);

      // Add metadata
      const metadata = {
        contentType: file.type,
        customMetadata: {
          'uploadedBy': auth.currentUser.uid,
          'uploadedAt': new Date().toISOString()
        }
      };

      // Upload the file with metadata
      console.log('Starting upload...');
      const snapshot = await uploadBytes(storageRef, file, metadata);
      console.log('Upload successful, getting download URL...');
      
      const downloadURL = await getDownloadURL(snapshot.ref);
      console.log('Download URL obtained:', downloadURL);

      // Delete old profile image if it exists and is a Firebase Storage URL
      if (profileData.photoURL && profileData.photoURL.includes('firebasestorage.googleapis.com')) {
        try {
          // Extract the file path from the URL
          const oldUrl = profileData.photoURL;
          const pathStart = oldUrl.indexOf('/o/') + 3;
          const pathEnd = oldUrl.indexOf('?');
          const filePath = decodeURIComponent(oldUrl.substring(pathStart, pathEnd));
          
          const oldImageRef = ref(storage, filePath);
          await deleteObject(oldImageRef);
          console.log('Old image deleted successfully');
        } catch (error) {
          console.log("Old image deletion failed (may not exist):", error);
        }
      }

      // Update profile data
      setProfileData(prev => ({
        ...prev,
        photoURL: downloadURL
      }));
      setHasChanges(true);

      toast({
        title: "Image Uploaded",
        description: "Your profile image has been updated successfully.",
      });
    } catch (error: any) {
      console.error("Upload error details:", error);
      console.error("Error code:", error.code);
      console.error("Error message:", error.message);
      
      let errorMessage = "Failed to upload image. Please try again.";
      
      if (error.code === 'storage/unauthorized') {
        errorMessage = "You don't have permission to upload files. Please check your authentication.";
      } else if (error.code === 'storage/canceled') {
        errorMessage = "Upload was canceled.";
      } else if (error.code === 'storage/quota-exceeded') {
        errorMessage = "Storage quota exceeded.";
      } else if (error.code === 'storage/invalid-format') {
        errorMessage = "Invalid file format.";
      } else if (error.code === 'storage/retry-limit-exceeded') {
        errorMessage = "Upload failed after multiple retries. Please check your internet connection.";
      } else if (error.message.includes('CORS')) {
        errorMessage = "CORS configuration issue. Please contact support.";
      }

      toast({
        title: "Upload Failed",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageUpload = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        handleUploadImage(file);
      }
    };
    input.click();
  };

  const handleRemoveImage = async () => {
    if (!profileData.photoURL) return;

    try {
      // Delete from Firebase Storage if it's a Firebase URL
      if (profileData.photoURL.includes('firebasestorage.googleapis.com')) {
        try {
          // Extract the file path from the URL
          const url = profileData.photoURL;
          const pathStart = url.indexOf('/o/') + 3;
          const pathEnd = url.indexOf('?');
          const filePath = decodeURIComponent(url.substring(pathStart, pathEnd));
          
          const imageRef = ref(storage, filePath);
          await deleteObject(imageRef);
          console.log('Image deleted from Firebase Storage');
        } catch (error) {
          console.error('Error deleting from storage:', error);
          // Continue anyway to remove from profile
        }
      }

      setProfileData(prev => ({
        ...prev,
        photoURL: ""
      }));
      setHasChanges(true);

      toast({
        title: "Image Removed",
        description: "Your profile image has been removed.",
      });
    } catch (error) {
      console.error("Remove image error:", error);
      toast({
        title: "Error",
        description: "Failed to remove image. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handlePasswordUpdate = async () => {
    if (!auth.currentUser) return;

    if (securityData.newPassword !== securityData.confirmPassword) {
      toast({
        title: "Password Mismatch",
        description: "New passwords don't match.",
        variant: "destructive",
      });
      return;
    }

    if (securityData.newPassword.length < 6) {
      toast({
        title: "Password Too Short",
        description: "Password must be at least 6 characters long.",
        variant: "destructive",
      });
      return;
    }

    try {
      // Re-authenticate user before password change
      const credential = EmailAuthProvider.credential(
        auth.currentUser.email!,
        securityData.currentPassword
      );
      await reauthenticateWithCredential(auth.currentUser, credential);

      // Update password
      await updatePassword(auth.currentUser, securityData.newPassword);

      // Clear form
      setSecurityData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      });

      toast({
        title: "Password Updated",
        description: "Your password has been changed successfully.",
      });
    } catch (error: any) {
      console.error("Password update error:", error);
      let errorMessage = "Failed to update password. Please try again.";
      
      if (error.code === 'auth/wrong-password') {
        errorMessage = "Current password is incorrect.";
      } else if (error.code === 'auth/weak-password') {
        errorMessage = "Password is too weak.";
      }

      toast({
        title: "Password Update Failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-twende-beige via-white to-twende-skyblue/20 relative overflow-hidden">
      {/* Authentic WhatsApp-Style Travel Pattern Background */}
      <WorkingWhatsAppBackground opacity={0.03} />
      
      {/* Header */}
      <div className="bg-white/80 backdrop-blur border-b border-gray-200 sticky top-0 z-10">
        <div className="container max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4 relative">
            <div className="absolute -top-1 -right-1">
              <TravelDoodles.Passport className="w-6 h-7" color="#1A5F7A" />
            </div>
            <Link to="/dashboard" className="flex items-center gap-2 text-gray-600 hover:text-twende-teal transition-colors">
              <ArrowLeft className="h-5 w-5" />
              Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-900">Profile Settings</h1>
          </div>
        </div>
      </div>

      <div className="container max-w-6xl mx-auto py-8 px-4 relative z-10">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Profile Summary Card */}
          <div className="w-full lg:w-80 flex-shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white/90 backdrop-blur rounded-xl shadow-lg p-6 text-center sticky top-24 overflow-hidden"
            >
              {/* Travel doodles in profile card */}
              <div className="absolute top-2 right-2">
                <TravelDoodles.Globe className="w-6 h-6" color="#4D724D" />
              </div>
              <div className="absolute bottom-2 left-2">
                <TravelDoodles.Camera className="w-6 h-5" color="#FF7F50" />
              </div>
              
              <div className="relative mx-auto w-32 h-32 mb-6 z-10 group">
                <Avatar className="w-full h-full ring-4 ring-white shadow-lg">
                  <AvatarImage src={profileData.photoURL} alt={profileData.displayName || "User"} className="object-cover" />
                  <AvatarFallback className="text-2xl bg-twende-teal text-white">
                    {profileData.displayName?.charAt(0) || user?.email?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>
                
                {/* Upload/Camera Button */}
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="absolute bottom-0 right-0 bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                >
                  {isUploading ? (
                    <div className="w-4 h-4 rounded-full border-2 border-gray-300 border-t-twende-teal animate-spin"></div>
                  ) : (
                    <Camera className="h-4 w-4" />
                  )}
                </Button>

                {/* Remove Button - Show when image exists */}
                {profileData.photoURL && (
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="absolute bottom-0 left-0 bg-red-50 hover:bg-red-100 border-red-200 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 opacity-0 group-hover:opacity-100"
                    onClick={handleRemoveImage}
                    disabled={isUploading}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                )}

                {/* Upload overlay */}
                {isUploading && (
                  <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center">
                    <div className="text-white text-xs">Uploading...</div>
                  </div>
                )}
              </div>
              
              <h2 className="font-bold text-xl text-gray-900 mb-1">
                {profileData.displayName || "Update Your Name"}
              </h2>
              <p className="text-gray-500 text-sm mb-2">{user?.email}</p>
              
              {user?.emailVerified ? (
                <div className="flex items-center justify-center gap-1 text-green-600 text-xs">
                  <CheckCircle className="h-3 w-3" />
                  Verified Account
                </div>
              ) : (
                <div className="flex items-center justify-center gap-1 text-amber-600 text-xs">
                  <AlertCircle className="h-3 w-3" />
                  Unverified Email
                </div>
              )}
              
              <div className="mt-6 p-4 bg-twende-beige/30 rounded-lg">
                <p className="text-xs text-gray-600 mb-2">Member Since</p>
                <p className="font-semibold text-sm">January 2024</p>
              </div>
              
              {/* Navigation Tabs */}
              <Tabs 
                value={activeTab} 
                onValueChange={setActiveTab} 
                className="mt-6"
                orientation="vertical"
              >
                <TabsList className="flex flex-col h-auto items-stretch space-y-1 bg-gray-50">
                  <TabsTrigger value="profile" className="justify-start data-[state=active]:bg-twende-teal data-[state=active]:text-white">
                    <User className="h-4 w-4 mr-2" />
                    Profile Info
                  </TabsTrigger>
                  <TabsTrigger value="security" className="justify-start data-[state=active]:bg-twende-teal data-[state=active]:text-white">
                    <Key className="h-4 w-4 mr-2" />
                    Security
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="justify-start data-[state=active]:bg-twende-teal data-[state=active]:text-white">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </motion.div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              {/* Profile Information Tab */}
              <TabsContent value="profile">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-white/80 backdrop-blur shadow-lg relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <TravelDoodles.Suitcase className="w-8 h-6" color="#1A5F7A" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-twende-teal" />
                        Personal Information
                      </CardTitle>
                      <CardDescription>
                        Update your basic profile information and contact details.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="displayName">Full Name *</Label>
                          <Input
                            id="displayName"
                            value={profileData.displayName}
                            onChange={(e) => handleInputChange("displayName", e.target.value)}
                            placeholder="Enter your full name"
                            className={errors.displayName ? "border-red-500" : ""}
                          />
                          {errors.displayName && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.displayName}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email Address</Label>
                          <Input
                            id="email"
                            type="email"
                            value={profileData.email}
                            disabled
                            className="bg-gray-50"
                          />
                          <p className="text-xs text-gray-500">Email cannot be changed here</p>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Phone Number</Label>
                          <Input
                            id="phone"
                            value={profileData.phone}
                            onChange={(e) => handleInputChange("phone", e.target.value)}
                            placeholder="+1 (555) 123-4567"
                            className={errors.phone ? "border-red-500" : ""}
                          />
                          {errors.phone && (
                            <p className="text-sm text-red-500 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {errors.phone}
                            </p>
                          )}
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="dateOfBirth">Date of Birth</Label>
                          <Input
                            id="dateOfBirth"
                            type="date"
                            value={profileData.dateOfBirth}
                            onChange={(e) => handleInputChange("dateOfBirth", e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="nationality">Nationality</Label>
                          <Input
                            id="nationality"
                            value={profileData.nationality}
                            onChange={(e) => handleInputChange("nationality", e.target.value)}
                            placeholder="e.g., American, British, Ghanaian"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="city">City</Label>
                          <Input
                            id="city"
                            value={profileData.city}
                            onChange={(e) => handleInputChange("city", e.target.value)}
                            placeholder="Enter your city"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="country">Country</Label>
                          <Select 
                            value={profileData.country} 
                            onValueChange={(value) => handleInputChange("country", value)}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="us">United States</SelectItem>
                              <SelectItem value="uk">United Kingdom</SelectItem>
                              <SelectItem value="gh">Ghana</SelectItem>
                              <SelectItem value="ke">Kenya</SelectItem>
                              <SelectItem value="za">South Africa</SelectItem>
                              <SelectItem value="ng">Nigeria</SelectItem>
                              <SelectItem value="ca">Canada</SelectItem>
                              <SelectItem value="au">Australia</SelectItem>
                              <SelectItem value="de">Germany</SelectItem>
                              <SelectItem value="fr">France</SelectItem>
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="preferredCurrency">Preferred Currency</Label>
                          <Select 
                            value={profileData.preferredCurrency} 
                            onValueChange={(value) => handleInputChange("preferredCurrency", value)}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="USD">USD - US Dollar</SelectItem>
                              <SelectItem value="EUR">EUR - Euro</SelectItem>
                              <SelectItem value="GBP">GBP - British Pound</SelectItem>
                              <SelectItem value="GHS">GHS - Ghanaian Cedi</SelectItem>
                              <SelectItem value="KES">KES - Kenyan Shilling</SelectItem>
                              <SelectItem value="ZAR">ZAR - South African Rand</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">Bio</Label>
                        <Textarea
                          id="bio"
                          value={profileData.bio}
                          onChange={(e) => handleInputChange("bio", e.target.value)}
                          placeholder="Tell us about yourself and your travel interests..."
                          className="resize-none"
                          rows={4}
                        />
                        <p className="text-xs text-gray-500">
                          {profileData.bio.length}/500 characters
                        </p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="emergencyContact">Emergency Contact</Label>
                        <Input
                          id="emergencyContact"
                          value={profileData.emergencyContact}
                          onChange={(e) => handleInputChange("emergencyContact", e.target.value)}
                          placeholder="Name and phone number of emergency contact"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="travelPreferences">Travel Preferences</Label>
                        <Textarea
                          id="travelPreferences"
                          value={profileData.travelPreferences}
                          onChange={(e) => handleInputChange("travelPreferences", e.target.value)}
                          placeholder="Describe your travel style, preferences, dietary restrictions, etc."
                          className="resize-none"
                          rows={3}
                        />
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <div className="text-sm text-gray-500">
                          {hasChanges && (
                            <span className="flex items-center gap-1 text-amber-600">
                              <AlertCircle className="h-3 w-3" />
                              You have unsaved changes
                            </span>
                          )}
                        </div>
                        <Button 
                          onClick={handleSaveProfile}
                          disabled={isSaving || !hasChanges}
                          className="bg-twende-teal hover:bg-twende-teal/90"
                        >
                          {isSaving ? (
                            <>
                              <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin mr-2"></div>
                              Saving...
                            </>
                          ) : (
                            <>
                              <Save className="h-4 w-4 mr-2" />
                              Save Changes
                            </>
                          )}
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Security Tab */}
              <TabsContent value="security">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6"
                >
                  <Card className="bg-white/80 backdrop-blur shadow-lg relative overflow-hidden">
                    <div className="absolute top-2 right-2">
                      <TravelDoodles.Airplane className="w-8 h-6" color="#1A5F7A" />
                    </div>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Key className="h-5 w-5 text-twende-teal" />
                        Security Settings
                      </CardTitle>
                      <CardDescription>
                        Manage your account security and privacy.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Password Change Section */}
                      <div className="space-y-4">
                        <h3 className="text-lg font-medium">Change Password</h3>
                        <div className="grid grid-cols-1 gap-4 max-w-md">
                          <div className="space-y-2">
                            <Label htmlFor="currentPassword">Current Password</Label>
                            <Input
                              id="currentPassword"
                              type="password"
                              value={securityData.currentPassword}
                              onChange={(e) => setSecurityData(prev => ({ ...prev, currentPassword: e.target.value }))}
                              placeholder="Enter your current password"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="newPassword">New Password</Label>
                            <Input
                              id="newPassword"
                              type="password"
                              value={securityData.newPassword}
                              onChange={(e) => setSecurityData(prev => ({ ...prev, newPassword: e.target.value }))}
                              placeholder="Enter new password"
                            />
                            <p className="text-xs text-gray-500">Password must be at least 6 characters long</p>
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor="confirmPassword">Confirm New Password</Label>
                            <Input
                              id="confirmPassword"
                              type="password"
                              value={securityData.confirmPassword}
                              onChange={(e) => setSecurityData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                              placeholder="Confirm new password"
                            />
                          </div>
                          <Button 
                            onClick={handlePasswordUpdate}
                            className="bg-twende-teal hover:bg-twende-teal/90"
                            disabled={!securityData.currentPassword || !securityData.newPassword || !securityData.confirmPassword}
                          >
                            <Key className="h-4 w-4 mr-2" />
                            Update Password
                          </Button>
                        </div>
                      </div>

                      {/* Account Security Status */}
                      <div className="space-y-4 pt-6 border-t">
                        <h3 className="text-lg font-medium">Account Security Status</h3>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className={`w-3 h-3 rounded-full ${user?.emailVerified ? 'bg-green-500' : 'bg-yellow-500'}`}></div>
                              <div>
                                <h4 className="font-medium">Email Verification</h4>
                                <p className="text-sm text-gray-600">
                                  {user?.emailVerified ? 'Your email is verified' : 'Please verify your email address'}
                                </p>
                              </div>
                            </div>
                            {user?.emailVerified ? (
                              <CheckCircle className="h-5 w-5 text-green-500" />
                            ) : (
                              <Button variant="outline" size="sm">
                                Verify Email
                              </Button>
                            )}
                          </div>
                          
                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                              <div>
                                <h4 className="font-medium">Two-Factor Authentication</h4>
                                <p className="text-sm text-gray-600">Add an extra layer of security (Coming Soon)</p>
                              </div>
                            </div>
                            <Button variant="outline" size="sm" disabled>
                              Enable 2FA
                            </Button>
                          </div>

                          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-3 h-3 rounded-full bg-green-500"></div>
                              <div>
                                <h4 className="font-medium">Login Security</h4>
                                <p className="text-sm text-gray-600">Password protected account</p>
                              </div>
                            </div>
                            <CheckCircle className="h-5 w-5 text-green-500" />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>

              {/* Notifications Tab */}
              <TabsContent value="notifications">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <Card className="bg-white/80 backdrop-blur shadow-lg">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5 text-twende-teal" />
                        Notification Preferences
                      </CardTitle>
                      <CardDescription>
                        Control how and when you receive notifications.
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Email Notifications</Label>
                            <p className="text-sm text-gray-500">Receive emails about trips and updates</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>Push Notifications</Label>
                            <p className="text-sm text-gray-500">Receive push notifications on this device</p>
                          </div>
                          <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="space-y-0.5">
                            <Label>SMS Notifications</Label>
                            <p className="text-sm text-gray-500">Receive important updates via SMS</p>
                          </div>
                          <Switch />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
