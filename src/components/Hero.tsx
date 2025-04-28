
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowRight } from 'lucide-react';

const Hero = () => {
  return (
    <section id="home" className="bg-gradient-to-br from-blue-50 via-blue-100 to-white py-20 md:py-32">
      <div className="container mx-auto px-4 md:px-6 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-primary-dark to-primary">
          Advanced Skin Disease Detection
        </h1>
        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Upload a photo of your skin condition and get instant AI-powered analysis, causes, and treatment recommendations.
        </p>
        <Button size="lg" className="group bg-primary hover:bg-primary-dark text-white font-medium text-lg px-8 py-6">
          Analyze Your Skin Now
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </div>
    </section>
  );
};

export default Hero;
