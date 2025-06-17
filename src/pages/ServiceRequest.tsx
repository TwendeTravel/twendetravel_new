
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import PageTransition from "@/components/PageTransition";
import { useEffect } from 'react';
import { useRole } from '@/hooks/useRole';
import { useNavigate } from 'react-router-dom';

export default function ServiceRequestPage() {
  const { isAdmin, isLoading } = useRole();
  const navigate = useNavigate();
  useEffect(() => {
    if (!isLoading && isAdmin) {
      navigate('/admin');
    }
  }, [isAdmin, isLoading, navigate]);
  
  if (isAdmin) return null; // don't render for admins
  
  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Request Travel Service</h1>
        <ServiceRequestForm />
      </div>
    </PageTransition>
  );
}
