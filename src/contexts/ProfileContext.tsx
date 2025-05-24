
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface UserProfile {
  _id: string;
  name: string;
  email: string;
  role: string;
  location: string;
  profilePicture: string;
  resumeUrl: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
}

interface Skill {
  _id: string;
  name: string;
  level: number;
}

interface ProfileContextType {
  profile: UserProfile | null;
  skills: Skill[];
  loading: boolean;
  fetchProfile: () => Promise<void>;
  fetchSkills: () => Promise<void>;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile/public');
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/skills/public');
      if (response.status === 200) {
        setSkills(response.data);
      }
    } catch (error) {
      console.error('Error fetching skills:', error);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchProfile(), fetchSkills()]);
      setLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, skills, loading, fetchProfile, fetchSkills }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};
