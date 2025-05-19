
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

const Hero: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Begin fading out at 10% of viewport height and complete by 50%
      const fadeOutThreshold = viewportHeight * 0.1;
      const fadeOutComplete = viewportHeight * 0.5;
      
      if (scrollPosition > fadeOutThreshold) {
        const opacity = 1 - (scrollPosition - fadeOutThreshold) / (fadeOutComplete - fadeOutThreshold);
        if (profileRef.current) {
          profileRef.current.style.opacity = Math.max(0, opacity).toString();
          profileRef.current.style.transform = `translateY(${scrollPosition * 0.2}px)`;
        }
        
        if (scrollPosition > fadeOutComplete) {
          setScrolled(true);
        } else {
          setScrolled(false);
        }
      } else {
        if (profileRef.current) {
          profileRef.current.style.opacity = '1';
          profileRef.current.style.transform = 'translateY(0)';
        }
        setScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <section id="home" className="min-h-screen flex flex-col justify-center items-center relative pt-16 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div 
            ref={profileRef} 
            className="profile-container mx-auto md:mx-0 md:ml-auto order-1 md:order-2 transition-all duration-500"
          >
            <div className="dynamic-circle profile-circle-1 animate-spin-slow"></div>
            <div className="dynamic-circle profile-circle-2 animate-spin-slow animation-delay-200" style={{ animationDirection: 'reverse' }}></div>
            <div className="dynamic-circle profile-circle-3 animate-pulse-gentle"></div>
            <div className="relative z-10 w-64 h-64 mx-auto overflow-hidden rounded-full border-4 border-primary/30">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Developer" 
                className="w-full h-full object-cover"
              />
            </div>
          </div>
          
          <div className="text-center md:text-left order-2 md:order-1">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
              <span>Hi, I'm </span>
              <span className="text-gradient">John Doe</span>
            </h1>
            <h2 className="text-2xl md:text-3xl font-medium mb-6 text-muted-foreground">Software Developer</h2>
            <p className="text-lg mb-8 max-w-lg mx-auto md:mx-0">
              Passionate about crafting clean, user-friendly web applications with cutting-edge technologies.
            </p>
            <div className="flex flex-wrap gap-4 justify-center md:justify-start">
              <a 
                href="#contact"
                className="px-6 py-3 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
              >
                Contact Me
              </a>
              <a 
                href="#projects"
                className="px-6 py-3 border border-primary/50 text-foreground rounded-md hover:bg-primary/10 transition-colors"
              >
                View Projects
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
