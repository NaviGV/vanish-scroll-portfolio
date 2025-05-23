
import React, { useState, useEffect } from 'react';
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";

const Navbar: React.FC = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      setIsScrolled(scrollPosition > 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { href: "#home", label: "Home" },
    { href: "#about", label: "About" },
    { href: "#projects", label: "Projects" },
    { href: "#contact", label: "Contact" },
  ];

  const NavLink = ({ href, label }: { href: string, label: string }) => (
    <a 
      href={href} 
      className="text-sm text-foreground/70 hover:text-primary transition-colors"
      onClick={() => setMobileMenuOpen(false)}
    >
      {label}
    </a>
  );

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300 px-4 py-3 md:px-8",
      isScrolled ? "bg-background/90 backdrop-blur-md shadow-md" : "bg-transparent"
    )}>
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center">
          <Home className="h-5 w-5 mr-2 text-primary" />
          <span className="font-bold text-lg">Dev<span className="text-primary">Portfolio</span></span>
        </div>
        
        <div className="hidden md:flex items-center gap-8">
          {navLinks.map(link => (
            <NavLink key={link.href} href={link.href} label={link.label} />
          ))}
        </div>
        
        <Button variant="outline" className="hidden md:block">Resume</Button>
        
        <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
          <SheetTrigger asChild>
            <button className="md:hidden text-foreground" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[240px] pt-12">
            <div className="flex flex-col space-y-6">
              {navLinks.map(link => (
                <NavLink key={link.href} href={link.href} label={link.label} />
              ))}
              <Button variant="outline" className="mt-4 w-full">Resume</Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
};

export default Navbar;
