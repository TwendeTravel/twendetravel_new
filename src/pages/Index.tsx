import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useRole } from '@/hooks/useRole';
import { toast } from '@/hooks/use-toast';
import Header from '../components/Header';
import Hero from '../components/Hero';
import Destinations from '../components/Destinations';
import Features from '../components/Features';
import ExperienceSection from '../components/ExperienceSection';
import TripPlanner from '../components/TripPlanner';
import Testimonials from '../components/Testimonials';
import AboutSection from '../components/AboutSection';
import FeaturedCountry from '../components/FeaturedCountry';
import CTASection from '../components/CTASection';
import Footer from '../components/Footer';
import MapExplorer from '../components/MapExplorer';
import AppDownload from '../components/AppDownload';
import PageTransition from '@/components/PageTransition';

const Index = () => {
  const { user } = useAuth();
  const { isAdmin, isLoading: roleLoading } = useRole();
  const navigate = useNavigate();
  
  useEffect(() => {
    // If user is logged out and was redirected here, show them a message
    const searchParams = new URLSearchParams(window.location.search);
    const loggedOut = searchParams.get('logged_out');
    
    if (loggedOut === 'true') {
      toast({
        title: "Logged out successfully",
        description: "You have been logged out of your account.",
      });
      
      // Clean up the URL
      const newUrl = window.location.pathname;
      window.history.replaceState({}, document.title, newUrl);
    }
    
    // If user is already logged in, redirect to dashboard
    if (user && !roleLoading) {
      navigate('/dashboard');
      return;
    }
  }, [user, isAdmin, roleLoading, navigate]);
  
  if (!roleLoading && isAdmin) {
    // Admin should not see traveler homepage
    return null;
  }

  return (
    <PageTransition>
      <div className="min-h-screen">
        <Header />
        <Hero />
        <Destinations />
        <FeaturedCountry />
        <Features />
        <MapExplorer />
        <ExperienceSection />
        <TripPlanner />
        <AboutSection />
        <Testimonials />
  <AppDownload />
  {/* ContactSection removed per request */}
  <CTASection />
        <Footer />
      </div>
    </PageTransition>
  );
};

export default Index;
