
import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";
import { Card } from "@/components/ui/card";

interface ProfileData {
  name: string;
  role: string;
  skills: { name: string; level: number }[];
  education: { institution: string; degree: string; year: string }[];
}

interface SkillData {
  _id: string;
  name: string;
  level: number;
}

const About: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [skills, setSkills] = useState<SkillData[]>([]);
  const aboutRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    fetchProfileData();
    fetchSkills();
    
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
  
  const fetchProfileData = async () => {
    try {
      // Fetch admin user profile data for public display
      const response = await fetch('http://localhost:5000/api/auth/me', {
        headers: {
          'x-auth-token': localStorage.getItem('token') || ''
        }
      });
      
      // If user is not logged in, use default data
      if (!response.ok) {
        return;
      }
      
      const userData = await response.json();
      
      setProfile({
        name: userData.name,
        role: userData.role,
        skills: [], // We'll use the skills API instead
        education: userData.education || []
      });
      
    } catch (error) {
      console.error('Error fetching profile data:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/skills');
      
      if (response.ok) {
        const skillsData = await response.json();
        setSkills(skillsData);
      } else {
        // If there's an error or no data, use fallback skills
        setSkills([]);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      setSkills([]);
    }
  };

  // Generate color based on first letter of name
  const getColorFromName = (name: string): string => {
    // Define a color palette
    const colorPalette = [
      '#8E9196', // Neutral Gray
      '#9b87f5', // Primary Purple
      '#7E69AB', // Secondary Purple 
      '#6E59A5', // Tertiary Purple
      '#1A1F2C', // Dark Purple
      '#D6BCFA', // Light Purple
      '#F2FCE2', // Soft Green
      '#FEF7CD', // Soft Yellow
      '#FEC6A1', // Soft Orange
      '#E5DEFF', // Soft Purple
      '#FFDEE2', // Soft Pink
      '#FDE1D3', // Soft Peach
      '#D3E4FD', // Soft Blue
      '#F1F0FB', // Soft Gray
      '#8B5CF6', // Vivid Purple
      '#D946EF', // Magenta Pink
      '#F97316', // Bright Orange
      '#0EA5E9', // Ocean Blue
      '#403E43', // Charcoal Gray
      '#FFFFFF', // Pure White
      '#8A898C', // Medium Gray
      '#1EAEDB', // Bright Blue
      '#221F26', // Dark Charcoal
      '#C8C8C9', // Light Gray
      '#9F9EA1', // Silver Gray
      '#33C3F0', // Sky Blue
    ];
    
    if (!name || name.length === 0) {
      return colorPalette[0]; // Default to first color
    }
    
    // Get first letter and convert to uppercase
    const firstLetter = name.charAt(0).toUpperCase();
    
    // Convert letter to index (A=0, B=1, etc.)
    const letterIndex = firstLetter.charCodeAt(0) - 65;
    
    // Ensure index is within bounds of color palette
    const colorIndex = ((letterIndex % colorPalette.length) + colorPalette.length) % colorPalette.length;
    
    return colorPalette[colorIndex];
  };

  // Fallback skill levels (values from 0-100)
  const skillsWithLevels = skills.length > 0 ? skills : [
    { _id: "1", name: "React", level: 85 },
    { _id: "2", name: "TypeScript", level: 80 },
    { _id: "3", name: "JavaScript", level: 90 },
    { _id: "4", name: "HTML", level: 95 },
    { _id: "5", name: "CSS", level: 85 },
    { _id: "6", name: "Tailwind CSS", level: 80 },
    { _id: "7", name: "Node.js", level: 75 },
    { _id: "8", name: "Express", level: 70 },
    { _id: "9", name: "MongoDB", level: 65 },
    { _id: "10", name: "Git", level: 85 }
  ];

  // Get color based on user name
  const skillColor = getColorFromName(profile?.name || 'Portfolio');

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
            <div className="grid grid-cols-2 gap-x-6 gap-y-3">
              {skillsWithLevels.map((skill) => (
                <div key={skill._id || skill.name} className="space-y-1">
                  <span className="text-sm font-medium">{skill.name}</span>
                  <div className="h-2 w-full bg-secondary rounded-full">
                    <div 
                      className="h-2 rounded-full" 
                      style={{ 
                        width: `${skill.level}%`, 
                        backgroundColor: skillColor 
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
            
            <h3 className="text-2xl font-semibold mt-8 mb-4">Education</h3>
            <div className="space-y-4">
              {profile && profile.education && profile.education.length > 0 ? (
                profile.education.map((edu, index) => (
                  <div key={index} className="border-l-2 border-primary pl-4">
                    <h4 className="text-lg font-medium">{edu.degree}</h4>
                    <p className="text-muted-foreground">{edu.institution} • {edu.year}</p>
                  </div>
                ))
              ) : (
                <>
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="text-lg font-medium">Bachelor of Science in Computer Science</h4>
                    <p className="text-muted-foreground">University of Technology • 2019-2023</p>
                  </div>
                  
                  <div className="border-l-2 border-primary pl-4">
                    <h4 className="text-lg font-medium">Full Stack Web Development</h4>
                    <p className="text-muted-foreground">Tech Bootcamp • 2023</p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
