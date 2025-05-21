import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import axios from 'axios';

interface Education {
  institution: string;
  degree: string;
  year: string;
}

interface UserProfile {
  name: string;
  email: string;
  role: string;
  location: string;
  social: {
    github: string;
    twitter: string;
    linkedin: string;
  };
  skills: string[];
  education: Education[];
  resumeUrl: string;
  profilePicture: string;
}

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    role: '',
    location: '',
    social: {
      github: '',
      twitter: '',
      linkedin: ''
    },
    skills: [],
    education: [{
      institution: '',
      degree: '',
      year: ''
    }],
    resumeUrl: '',
    profilePicture: ''
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`${backendUrl}/api/auth/me`, {
        headers: {
          'x-auth-token': token || ''
        }
      });
      
      const data = response.data;
      setProfile({
        name: data.name || '',
        email: data.email || '',
        role: data.role || '',
        location: data.location || '',
        social: data.social || {
          github: '',
          twitter: '',
          linkedin: ''
        },
        skills: data.skills || [],
        education: data.education?.length > 0 ? data.education : [{
          institution: '',
          degree: '',
          year: ''
        }],
        resumeUrl: data.resumeUrl || '',
        profilePicture: data.profilePicture || ''
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load profile data",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    
    // Handle nested social fields
    if (name.startsWith('social.')) {
      const socialField = name.split('.')[1];
      setProfile({
        ...profile,
        social: {
          ...profile.social,
          [socialField]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };
  
  const handleSkillsChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const skillsString = e.target.value;
    setProfile({
      ...profile,
      skills: skillsString.split(',').map(skill => skill.trim())
    });
  };
  
  const handleEducationChange = (
    index: number,
    field: keyof Education,
    value: string
  ) => {
    const updatedEducation = [...profile.education];
    updatedEducation[index] = {
      ...updatedEducation[index],
      [field]: value
    };
    
    setProfile({
      ...profile,
      education: updatedEducation
    });
  };
  
  const addEducationEntry = () => {
    setProfile({
      ...profile,
      education: [
        ...profile.education,
        { institution: '', degree: '', year: '' }
      ]
    });
  };
  
  const removeEducationEntry = (index: number) => {
    if (profile.education.length <= 1) return;
    
    const updatedEducation = profile.education.filter((_, i) => i !== index);
    setProfile({
      ...profile,
      education: updatedEducation
    });
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      await axios.patch(
        `${backendUrl}/api/profile`, 
        profile,
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update profile",
        variant: "destructive"
      });
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }
  
  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Edit Profile</h2>
      
      <form onSubmit={handleSubmit}>
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Profile Picture</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col items-center space-y-4">
              <Avatar className="w-32 h-32">
                <AvatarImage src={profile.profilePicture} alt={profile.name} />
                <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
              </Avatar>
              
              <div className="w-full">
                <label htmlFor="profilePicture" className="text-sm font-medium block mb-1">Profile Picture URL</label>
                <Input
                  id="profilePicture"
                  name="profilePicture"
                  value={profile.profilePicture}
                  onChange={handleInputChange}
                  placeholder="https://example.com/profile.jpg"
                />
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="name" className="text-sm font-medium block mb-1">Name</label>
              <Input
                id="name"
                name="name"
                value={profile.name}
                onChange={handleInputChange}
                placeholder="Your Full Name"
                required
              />
            </div>
            
            <div>
              <label htmlFor="email" className="text-sm font-medium block mb-1">Email</label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profile.email}
                onChange={handleInputChange}
                placeholder="your.email@example.com"
                required
              />
            </div>
            
            <div>
              <label htmlFor="role" className="text-sm font-medium block mb-1">Role/Title</label>
              <Input
                id="role"
                name="role"
                value={profile.role}
                onChange={handleInputChange}
                placeholder="Software Developer"
                required
              />
            </div>
            
            <div>
              <label htmlFor="location" className="text-sm font-medium block mb-1">Location</label>
              <Input
                id="location"
                name="location"
                value={profile.location}
                onChange={handleInputChange}
                placeholder="City, Country"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Social Links</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="github" className="text-sm font-medium block mb-1">GitHub</label>
              <Input
                id="github"
                name="social.github"
                value={profile.social.github}
                onChange={handleInputChange}
                placeholder="https://github.com/yourusername"
              />
            </div>
            
            <div>
              <label htmlFor="twitter" className="text-sm font-medium block mb-1">Twitter</label>
              <Input
                id="twitter"
                name="social.twitter"
                value={profile.social.twitter}
                onChange={handleInputChange}
                placeholder="https://twitter.com/yourusername"
              />
            </div>
            
            <div>
              <label htmlFor="linkedin" className="text-sm font-medium block mb-1">LinkedIn</label>
              <Input
                id="linkedin"
                name="social.linkedin"
                value={profile.social.linkedin}
                onChange={handleInputChange}
                placeholder="https://linkedin.com/in/yourusername"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Skills & Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label htmlFor="skills" className="text-sm font-medium block mb-1">Skills (comma-separated)</label>
              <Textarea
                id="skills"
                value={profile.skills.join(', ')}
                onChange={handleSkillsChange}
                placeholder="React, TypeScript, Node.js, MongoDB"
              />
            </div>
            
            <div>
              <label htmlFor="resumeUrl" className="text-sm font-medium block mb-1">Resume URL</label>
              <Input
                id="resumeUrl"
                name="resumeUrl"
                value={profile.resumeUrl}
                onChange={handleInputChange}
                placeholder="https://example.com/your-resume.pdf"
              />
            </div>
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Education</CardTitle>
            <Button type="button" variant="outline" size="sm" onClick={addEducationEntry}>
              Add Education
            </Button>
          </CardHeader>
          <CardContent className="space-y-6">
            {profile.education.map((edu, index) => (
              <div key={index} className="p-4 border border-border rounded-md">
                <div className="flex justify-between mb-4">
                  <h3 className="text-lg font-medium">Education #{index + 1}</h3>
                  {profile.education.length > 1 && (
                    <Button 
                      type="button" 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => removeEducationEntry(index)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-1">Institution</label>
                    <Input
                      value={edu.institution}
                      onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                      placeholder="University/College/School Name"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Degree/Certificate</label>
                    <Input
                      value={edu.degree}
                      onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                      placeholder="Bachelor's in Computer Science"
                    />
                  </div>
                  
                  <div>
                    <label className="text-sm font-medium block mb-1">Year</label>
                    <Input
                      value={edu.year}
                      onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                      placeholder="2018-2022"
                    />
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
        
        <div className="flex justify-end">
          <Button type="submit" disabled={saving}>
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ProfileEdit;
