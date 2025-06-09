
import { ServiceRequestForm } from "@/components/ServiceRequestForm";
import PageTransition from "@/components/PageTransition";

export default function ServiceRequestPage() {
  return (
    <PageTransition>
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Request Travel Service</h1>
        <ServiceRequestForm />
      </div>
    </PageTransition>
  );
}
