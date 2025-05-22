
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";

const About: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      
      // Only show About section after hero has been scrolled past
      // Start showing at 40% of viewport height and fully visible by 70%
      const startShow = viewportHeight * 0.4;
      const fullyVisible = viewportHeight * 0.7;
      
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
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Skill levels (values from 0-100)
  const skillsWithLevels = [
    { name: "React", level: 85 },
    { name: "TypeScript", level: 80 },
    { name: "JavaScript", level: 90 },
    { name: "HTML", level: 95 },
    { name: "CSS", level: 85 },
    { name: "Tailwind CSS", level: 80 },
    { name: "Node.js", level: 75 },
    { name: "Express", level: 70 },
    { name: "MongoDB", level: 65 },
    { name: "Git", level: 85 }
  ];

  return (
    <section id="about" className="py-16 md:py-24">
      <div 
        ref={aboutRef}
        className={cn(
          "container mx-auto px-4 transition-all duration-700",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">About Me</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <h3 className="text-2xl font-semibold mb-4">Who I Am</h3>
            <p className="text-muted-foreground mb-4">
              I'm a recent computer science graduate with a passion for building elegant, efficient, and user-friendly web applications. With a strong foundation in software development principles and modern tech stacks, I'm eager to tackle challenging projects and continue growing as a developer.
            </p>
            <p className="text-muted-foreground mb-4">
              My journey in programming began during my undergraduate studies where I discovered my love for solving complex problems through code. Since then, I've dedicated myself to mastering front-end and back-end technologies, with a particular focus on React and Node.js ecosystems.
            </p>
            <p className="text-muted-foreground">
              When I'm not coding, you'll find me contributing to open-source projects, attending tech meetups, or exploring the latest industry trends through blogs and tutorials.
            </p>
          </div>
          
          <div>
            <h3 className="text-2xl font-semibold mb-6">My Skills</h3>
            <div className="grid grid-cols-2 gap-x-6 gap-y-4">
              {skillsWithLevels.map((skill) => (
                <div key={skill.name} className="space-y-1">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <Slider 
                    value={[skill.level]} 
                    max={100} 
                    step={1}
                    className="cursor-default"
                    disabled
                  />
                </div>
              ))}
            </div>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">Education</h3>
            <div className="space-y-4">
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-lg font-medium">Bachelor of Science in Computer Science</h4>
                <p className="text-muted-foreground">University of Technology • 2019-2023</p>
              </div>
              
              <div className="border-l-2 border-primary pl-4">
                <h4 className="text-lg font-medium">Full Stack Web Development</h4>
                <p className="text-muted-foreground">Tech Bootcamp • 2023</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
