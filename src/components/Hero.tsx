
import React from 'react';
import { Button } from "@/components/ui/button";
import { ArrowDown } from "lucide-react";
import { useProfile } from '@/contexts/ProfileContext';

const Hero: React.FC = () => {
  const { profile, loading } = useProfile();

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDownloadResume = () => {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    }
  };

  return (
    <section className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-secondary/30 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-20 left-20 w-32 h-32 bg-primary rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-48 h-48 bg-purple-500 rounded-full blur-xl animate-pulse animation-delay-200"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 bg-blue-500 rounded-full blur-xl animate-pulse animation-delay-400"></div>
      </div>

      <div className="container mx-auto px-4 text-center relative z-10">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6">
            Hi, I'm{' '}
            <span className="text-gradient">
              {loading ? 'Loading...' : profile.name}
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            {profile.role}
          </p>
          
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto leading-relaxed">
            Welcome to my digital space where creativity meets functionality. 
            I craft beautiful, responsive, and user-friendly web applications.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-white px-8 py-3"
              onClick={() => scrollToSection('projects')}
            >
              View My Work
            </Button>
            
            <Button 
              variant="outline" 
              size="lg" 
              className="border-primary text-primary hover:bg-primary hover:text-white px-8 py-3"
              onClick={() => scrollToSection('contact')}
            >
              Get In Touch
            </Button>
            
            {profile.resumeUrl && (
              <Button 
                variant="outline" 
                size="lg" 
                className="border-secondary text-secondary hover:bg-secondary hover:text-white px-8 py-3"
                onClick={handleDownloadResume}
              >
                Resume
              </Button>
            )}
          </div>
          
          <div className="animate-bounce">
            <Button 
              variant="ghost" 
              size="sm" 
              className="rounded-full p-3"
              onClick={() => scrollToSection('about')}
            >
              <ArrowDown className="h-6 w-6" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
