import React from 'react';
import PageTransition from '@/components/PageTransition';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Destinations from '@/components/Destinations';

export default function DestinationsPage() {
  return (
    <PageTransition>
      <Header />
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold text-center mb-8">Browse Destinations</h1>
        <Destinations />
      </div>
      <Footer />
    </PageTransition>
  );
}
