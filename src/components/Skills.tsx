
import React, { useState, useEffect } from 'react';
import { Slider } from "@/components/ui/slider";
import axios from 'axios';

interface Skill {
  _id: string;
  name: string;
  level: number;
}

const Skills: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/skills/public');
      
      if (response.status === 200) {
        setSkills(response.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
      // Fallback skills if backend is not available
      setSkills([
        { _id: '1', name: 'React', level: 90 },
        { _id: '2', name: 'TypeScript', level: 85 },
        { _id: '3', name: 'Node.js', level: 80 },
        { _id: '4', name: 'MongoDB', level: 75 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="skills-container">
        <div className="animate-pulse">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="skill-item">
              <div className="h-4 bg-gray-300 rounded mb-2"></div>
              <div className="h-2 bg-gray-300 rounded"></div>
            </div>
          ))}
        </div>
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
          <Slider
            value={[skill.level]}
            max={100}
            step={1}
            className="w-full"
            disabled
          />
        </div>
      ))}
    </div>
  );
};

export default Skills;
