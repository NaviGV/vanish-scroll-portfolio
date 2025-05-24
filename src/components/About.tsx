
import React, { useEffect, useRef, useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Skills from './Skills';
import { useProfile } from '@/contexts/ProfileContext';

const About: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  const { profile, loading } = useProfile();
  
  useEffect(() => {
    const handleScroll = () => {
      if (!aboutRef.current) return;
      
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const elementPosition = aboutRef.current.getBoundingClientRect().top + window.scrollY;
      
      const startShow = elementPosition - viewportHeight * 0.9;
      const fullyVisible = elementPosition - viewportHeight * 0.6;
      
      if (scrollPosition > startShow) {
        const opacity = (scrollPosition - startShow) / (fullyVisible - startShow);
        setVisible(true);
        if (aboutRef.current) {
          aboutRef.current.style.opacity = Math.min(1, opacity).toString();
          aboutRef.current.style.transform = `translateY(${Math.max(0, 20 - opacity * 20)}px)`;
        }
      } else {
        setVisible(false);
        if (aboutRef.current) {
          aboutRef.current.style.opacity = '0';
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleDownloadResume = () => {
    if (profile.resumeUrl) {
      window.open(profile.resumeUrl, '_blank');
    } else {
      console.log('No resume available');
    }
  };

  return (
    <section id="about" className="py-16 md:py-24 bg-background">
      <div 
        ref={aboutRef}
        className={cn(
          "container mx-auto px-4 transition-all duration-700",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="flex flex-col lg:flex-row gap-12 items-center">
          {/* Profile Image */}
          <div className="profile-container relative">
            <div className="profile-circle-1 dynamic-circle animate-spin-slow"></div>
            <div className="profile-circle-2 dynamic-circle animate-pulse-gentle animation-delay-200"></div>
            <div className="profile-circle-3 dynamic-circle animate-spin-slow animation-delay-400"></div>
            <img 
              src={profile.profilePicture}
              alt={profile.name}
              className="w-64 h-64 md:w-80 md:h-80 rounded-full object-cover border-4 border-white/10 relative z-10"
            />
          </div>
          
          {/* Content */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">About Me</h2>
            <div className="w-20 h-1 bg-primary mx-auto lg:mx-0 mb-6"></div>
            
            <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
              I'm a passionate {profile.role.toLowerCase()} based in {profile.location}. 
              I love creating digital experiences that are not only functional but also beautiful and user-friendly. 
              My journey in tech has been driven by curiosity and a constant desire to learn and grow.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
              <Card className="border border-primary/20 bg-secondary/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Skills & Expertise</h3>
                  <Skills />
                </CardContent>
              </Card>
              
              <Card className="border border-primary/20 bg-secondary/50">
                <CardContent className="p-6">
                  <h3 className="text-xl font-semibold mb-4">Education & Experience</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium">Bachelor's in Computer Science</h4>
                      <p className="text-sm text-muted-foreground">University of Technology</p>
                      <p className="text-sm text-muted-foreground">2018-2022</p>
                    </div>
                    <div>
                      <h4 className="font-medium">Full Stack Developer</h4>
                      <p className="text-sm text-muted-foreground">Tech Solutions Inc.</p>
                      <p className="text-sm text-muted-foreground">2022-Present</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <Button onClick={handleDownloadResume} size="lg" className="bg-primary hover:bg-primary/90">
              Download Resume
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
