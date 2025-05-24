
import React from 'react';
import { useProfile } from '@/contexts/ProfileContext';

const Skills: React.FC = () => {
  const { skills, loading } = useProfile();

  if (loading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (skills.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-muted-foreground">No skills available</p>
      </div>
    );
  }

  return (
    <div className="skills-container">
      {skills.map((skill) => (
        <div key={skill._id} className="skill-item">
          <div className="flex justify-between items-center mb-2">
            <span className="font-medium">{skill.name}</span>
            <span className="text-sm text-muted-foreground">{skill.level}%</span>
          </div>
          <div className="w-full bg-secondary rounded-full h-2">
            <div
              className="h-2 rounded-full john-doe-gradient"
              style={{ width: `${skill.level}%` }}
            ></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Skills;
