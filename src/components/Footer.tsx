
import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  
  return (
    <footer className="bg-secondary/50 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-foreground/70 mb-4 md:mb-0">
            © {currentYear} Developer Portfolio. All rights reserved.
          </p>
          
          <div className="flex space-x-6">
            <a href="#home" className="text-foreground/70 hover:text-primary transition-colors">Home</a>
            <a href="#about" className="text-foreground/70 hover:text-primary transition-colors">About</a>
            <a href="#projects" className="text-foreground/70 hover:text-primary transition-colors">Projects</a>
            <a href="#contact" className="text-foreground/70 hover:text-primary transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
