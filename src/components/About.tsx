
import React from 'react';
import Skills from './Skills';

const About = () => {
  return (
    <section id="about" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">About Me</h2>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed">
                I'm a passionate software developer with a love for creating innovative web applications. 
                With years of experience in modern web technologies, I enjoy turning complex problems into 
                simple, beautiful, and intuitive solutions.
              </p>
              
              <p className="text-lg leading-relaxed">
                When I'm not coding, you can find me exploring new technologies, contributing to open-source 
                projects, or sharing knowledge with the developer community. I believe in continuous learning 
                and staying up-to-date with the latest industry trends.
              </p>
              
              <div className="flex flex-wrap gap-4">
                <div className="bg-primary/10 px-4 py-2 rounded-md">
                  <span className="font-medium">Experience:</span> 5+ Years
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-md">
                  <span className="font-medium">Projects:</span> 50+ Completed
                </div>
                <div className="bg-primary/10 px-4 py-2 rounded-md">
                  <span className="font-medium">Focus:</span> Full-Stack Development
                </div>
              </div>
            </div>
            
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-semibold mb-6">Skills & Expertise</h3>
                <Skills />
              </div>
              
              <div>
                <h3 className="text-2xl font-semibold mb-6">Education</h3>
                <div className="space-y-4">
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg">Bachelor of Computer Science</h4>
                    <p className="text-muted-foreground">University of Technology</p>
                    <p className="text-sm text-muted-foreground">2018 - 2022</p>
                  </div>
                  <div className="bg-card p-4 rounded-lg border">
                    <h4 className="font-semibold text-lg">Full Stack Development Certification</h4>
                    <p className="text-muted-foreground">Tech Academy</p>
                    <p className="text-sm text-muted-foreground">2022</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
