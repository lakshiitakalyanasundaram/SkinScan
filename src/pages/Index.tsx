
import React from 'react';
import Header from '@/components/Header';
import Hero from '@/components/Hero';
import SkinAnalysis from '@/components/SkinAnalysis';
import AppointmentForm from '@/components/AppointmentForm';
import Footer from '@/components/Footer';
import ChatBot from '@/components/ChatBot';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <Hero />
      <SkinAnalysis />
      <AppointmentForm />
      <Footer />
      <ChatBot />
    </div>
  );
};

export default Index;
