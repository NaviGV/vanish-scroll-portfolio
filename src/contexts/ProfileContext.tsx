import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import axios from 'axios';

interface ProfileData {
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
  profile: ProfileData;
  loading: boolean;
  refreshProfile: () => void;
}

const defaultProfile: ProfileData = {
  name: 'John Doe',
  email: 'hello@johndoe.com',
  role: 'Software Developer',
  location: 'San Francisco, California',
  profilePicture: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?q=80&w=2574&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fA%3D%3D',
  resumeUrl: '',
  social: {
    github: 'https://github.com',
    twitter: 'https://twitter.com',
    linkedin: 'https://linkedin.com'
  }
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [profile, setProfile] = useState<ProfileData>(defaultProfile);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/profile/public');
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (error) {
      console.error('Error fetching public profile:', error);
      // Keep default profile if backend is not available
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const refreshProfile = () => {
    setLoading(true);
    fetchProfile();
  };

  return (
    <ProfileContext.Provider value={{ profile, loading, refreshProfile }}>
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
