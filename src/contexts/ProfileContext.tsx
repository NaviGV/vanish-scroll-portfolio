
import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

interface Skill {
  _id: string;
  name: string;
  level: number;
}

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

interface ProfileContextType {
  profile: UserProfile | null;
  skills: Skill[];
  loading: boolean;
  fetchProfile: () => void;
  fetchSkills: () => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
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
      console.error('Failed to fetch profile:', error);
    }
  };

  const fetchSkills = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/skills/public');
      if (response.status === 200) {
        setSkills(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch skills:', error);
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
    <ProfileContext.Provider value={{ 
      profile, 
      skills, 
      loading, 
      fetchProfile, 
      fetchSkills 
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
