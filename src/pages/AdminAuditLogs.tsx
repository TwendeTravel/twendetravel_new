import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

export default function AdminAuditLogs() {
  return (
    <div className="container mx-auto py-8 px-4">
      <Button variant="outline" asChild className="mb-6">
        <Link to="/admin">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Dashboard
        </Link>
      </Button>
      <h1 className="text-3xl font-bold mb-6">Audit Logs</h1>
      <p className="text-muted-foreground mb-4">Audit log and activity tracking coming soon.</p>
    </div>
  );
}
