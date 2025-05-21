
import React, { useEffect, useRef, useState } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink?: string;
  codeLink?: string;
}

const Projects: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [openPopover, setOpenPopover] = useState<string | null>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await axios.get('/api/projects');
        setProjects(response.data);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProjects();
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (!projectsRef.current) return;
      
      const scrollPosition = window.scrollY;
      const viewportHeight = window.innerHeight;
      const elementPosition = projectsRef.current.getBoundingClientRect().top + window.scrollY;
      
      // Start showing when the element is 60% of viewport height from bottom
      const startShow = elementPosition - viewportHeight * 0.9;
      const fullyVisible = elementPosition - viewportHeight * 0.6;
      
      if (scrollPosition > startShow) {
        const opacity = (scrollPosition - startShow) / (fullyVisible - startShow);
        setVisible(true);
        if (projectsRef.current) {
          projectsRef.current.style.opacity = Math.min(1, opacity).toString();
          projectsRef.current.style.transform = `translateY(${Math.max(0, 20 - opacity * 20)}px)`;
        }
      } else {
        setVisible(false);
        if (projectsRef.current) {
          projectsRef.current.style.opacity = '0';
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    // Trigger once on component mount to set initial state
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Fallback projects data
  const fallbackProjects: Project[] = [
    {
      _id: '1',
      title: "E-commerce Platform",
      description: "A full-stack e-commerce platform with product listings, shopping cart, and payment integration.",
      image: "https://images.unsplash.com/photo-1551232864-3f0890e580d9?q=80&w=2076&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["React", "Node.js", "MongoDB", "Express", "Stripe"],
      liveLink: "#",
      codeLink: "#"
    },
    {
      _id: '2',
      title: "Task Management App",
      description: "A responsive task management application with storage for YouTube and Twitter links.",
      image: "https://images.unsplash.com/photo-1579403124614-197f69d8187b?q=80&w=2564&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["React", "TypeScript", "Firebase", "Tailwind CSS", "YouTube API", "Twitter API"],
      liveLink: "#",
      codeLink: "#"
    },
    {
      _id: '3',
      title: "Weather Dashboard",
      description: "An interactive weather dashboard that displays current and forecasted weather conditions.",
      image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=2672&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      tags: ["React", "JavaScript", "Weather API", "CSS"],
      liveLink: "#",
      codeLink: "#"
    }
  ];

  const displayProjects = projects.length > 0 ? projects : fallbackProjects;

  // Toggle popover for a specific project
  const togglePopover = (projectId: string) => {
    setOpenPopover(openPopover === projectId ? null : projectId);
  };

  return (
    <section id="projects" className="py-16 md:py-24 bg-secondary/30">
      <div 
        ref={projectsRef}
        className={cn(
          "container mx-auto px-4 transition-all duration-700",
          visible ? "opacity-100" : "opacity-0"
        )}
      >
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">My Projects</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Here are some of my recent projects that showcase my skills and experience.
          </p>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {displayProjects.map((project) => (
              <Card key={project._id} className="overflow-hidden border border-primary/20 bg-secondary/50 hover:bg-secondary/80 transition-colors group">
                <div className="h-48 overflow-hidden">
                  <img 
                    src={project.image} 
                    alt={project.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                
                <CardHeader>
                  <CardTitle className="mb-3">{project.title}</CardTitle>
                  <div className="flex flex-wrap gap-2 mt-4">
                    {project.tags.slice(0, 3).map((tag, i) => (
                      <Badge key={i} variant="secondary" className="bg-primary/20 hover:bg-primary/30">{tag}</Badge>
                    ))}
                    
                    {project.tags.length > 3 && (
                      <Popover 
                        open={openPopover === project._id} 
                        onOpenChange={() => togglePopover(project._id)}
                      >
                        <PopoverTrigger asChild>
                          <Badge 
                            variant="outline" 
                            className="cursor-pointer hover:bg-primary/10"
                            onClick={() => togglePopover(project._id)}
                          >
                            +{project.tags.length - 3}
                          </Badge>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-2">
                          <div className="flex flex-wrap gap-2">
                            {project.tags.slice(3).map((tag, i) => (
                              <Badge key={i} variant="secondary" className="bg-primary/20">{tag}</Badge>
                            ))}
                          </div>
                        </PopoverContent>
                      </Popover>
                    )}
                  </div>
                </CardHeader>
                
                <CardContent>
                  <CardDescription className="text-foreground/70">{project.description}</CardDescription>
                </CardContent>
                
                <CardFooter className="flex justify-between">
                  {project.liveLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    </Button>
                  )}
                  {project.codeLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.codeLink} target="_blank" rel="noopener noreferrer">View Code</a>
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Projects;
