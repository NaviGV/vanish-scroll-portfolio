
import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { Upload } from "lucide-react";
import axios from 'axios';

interface Profile {
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
  education: {
    institution: string;
    degree: string;
    year: string;
  }[];
  resumeUrl?: string;
  profilePicture?: string;
}

const ProfileEdit: React.FC = () => {
  const [profile, setProfile] = useState<Profile>({
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
    education: [{ institution: '', degree: '', year: '' }]
  });
  
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [education, setEducation] = useState([{ institution: '', degree: '', year: '' }]);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const profileImageInputRef = useRef<HTMLInputElement>(null);
  const resumeInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive"
        });
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/profile/me', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.status === 200) {
        const fetchedProfile = response.data;
        setProfile(fetchedProfile);
        
        // Set education if it exists
        if (fetchedProfile.education && fetchedProfile.education.length > 0) {
          setEducation(fetchedProfile.education);
        }
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch profile",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      toast({
        title: "Error",
        description: "Failed to fetch profile",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    // Handle nested social properties
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
  
  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEducation = [...education];
    newEducation[index] = {
      ...newEducation[index],
      [field]: value
    };
    setEducation(newEducation);
  };
  
  const addEducation = () => {
    setEducation([...education, { institution: '', degree: '', year: '' }]);
  };
  
  const removeEducation = (index: number) => {
    if (education.length <= 1) return;
    
    const newEducation = [...education];
    newEducation.splice(index, 1);
    setEducation(newEducation);
  };
  
  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };
  
  const handleResumeFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setResumeFile(e.target.files[0]);
    }
  };
  
  const triggerProfileImageInput = () => {
    profileImageInputRef.current?.click();
  };
  
  const triggerResumeInput = () => {
    resumeInputRef.current?.click();
  };
  
  const saveProfile = async () => {
    setUpdating(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast({
          title: "Error",
          description: "Authentication required",
          variant: "destructive"
        });
        return;
      }
      
      // First, update the basic profile info
      const updatedProfile = {
        ...profile,
        education: education
      };
      
      const response = await axios.put(
        'http://localhost:5000/api/profile',
        updatedProfile,
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token
          }
        }
      );
      
      // Handle image upload if a file is selected
      if (profileImageFile) {
        const formData = new FormData();
        formData.append('profileImage', profileImageFile);
        
        await axios.post(
          'http://localhost:5000/api/profile/upload-image',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': token
            }
          }
        );
      }
      
      // Handle resume upload if a file is selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        
        await axios.post(
          'http://localhost:5000/api/profile/upload-resume',
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              'x-auth-token': token
            }
          }
        );
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      // Refresh profile data
      fetchProfile();
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
    } finally {
      setUpdating(false);
      // Clear file selections
      setProfileImageFile(null);
      setResumeFile(null);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Basic Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Profile Picture</label>
            <div className="flex items-center space-x-4">
              <div className="w-24 h-24 rounded-full overflow-hidden bg-secondary">
                {(profile.profilePicture || profileImageFile) && (
                  <img 
                    src={profileImageFile ? URL.createObjectURL(profileImageFile) : profile.profilePicture} 
                    alt="Profile" 
                    className="w-full h-full object-cover"
                  />
                )}
              </div>
              <div>
                <input 
                  type="file"
                  ref={profileImageInputRef}
                  onChange={handleProfileImageChange}
                  accept="image/*"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={triggerProfileImageInput}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Image
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Upload a profile picture (recommended size: 200x200px)
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <label htmlFor="name" className="text-sm font-medium block mb-1">Name</label>
            <Input
              id="name"
              name="name"
              value={profile.name}
              onChange={handleInputChange}
              placeholder="Your Name"
            />
          </div>
          
          <div>
            <label htmlFor="email" className="text-sm font-medium block mb-1">Email</label>
            <Input
              id="email"
              name="email"
              value={profile.email}
              onChange={handleInputChange}
              placeholder="your.email@example.com"
            />
          </div>
          
          <div>
            <label htmlFor="role" className="text-sm font-medium block mb-1">Role/Position</label>
            <Input
              id="role"
              name="role"
              value={profile.role}
              onChange={handleInputChange}
              placeholder="e.g. Software Developer"
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
      
      <Card>
        <CardHeader>
          <CardTitle>Resume</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium block mb-1">Resume File</label>
            <div className="flex flex-col gap-4">
              <div>
                <input 
                  type="file"
                  ref={resumeInputRef}
                  onChange={handleResumeFileChange}
                  accept=".pdf,.doc,.docx"
                  className="hidden"
                />
                <Button 
                  type="button" 
                  variant="outline"
                  onClick={triggerResumeInput}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Resume
                </Button>
                {resumeFile && (
                  <span className="ml-3 text-sm text-muted-foreground">
                    {resumeFile.name}
                  </span>
                )}
              </div>
              
              <div>
                <label htmlFor="resumeUrl" className="text-sm font-medium block mb-1">Resume URL</label>
                <Input
                  id="resumeUrl"
                  name="resumeUrl"
                  value={profile.resumeUrl || ''}
                  onChange={handleInputChange}
                  placeholder="https://example.com/your-resume.pdf"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Enter a direct link to your resume, or upload a file above (upload takes priority if both are provided).
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card>
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
              placeholder="https://github.com/username"
            />
          </div>
          
          <div>
            <label htmlFor="twitter" className="text-sm font-medium block mb-1">Twitter</label>
            <Input
              id="twitter"
              name="social.twitter"
              value={profile.social.twitter}
              onChange={handleInputChange}
              placeholder="https://twitter.com/username"
            />
          </div>
          
          <div>
            <label htmlFor="linkedin" className="text-sm font-medium block mb-1">LinkedIn</label>
            <Input
              id="linkedin"
              name="social.linkedin"
              value={profile.social.linkedin || ''}
              onChange={handleInputChange}
              placeholder="https://linkedin.com/in/username"
            />
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Education</CardTitle>
          <Button variant="outline" size="sm" onClick={addEducation}>
            Add Education
          </Button>
        </CardHeader>
        <CardContent>
          {education.map((edu, index) => (
            <div key={index} className="mb-6">
              {index > 0 && <Separator className="my-4" />}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="text-sm font-medium block mb-1">Institution</label>
                  <Input
                    value={edu.institution}
                    onChange={(e) => handleEducationChange(index, 'institution', e.target.value)}
                    placeholder="University/College Name"
                  />
                </div>
                
                <div>
                  <label className="text-sm font-medium block mb-1">Year</label>
                  <Input
                    value={edu.year}
                    onChange={(e) => handleEducationChange(index, 'year', e.target.value)}
                    placeholder="e.g. 2018-2022"
                  />
                </div>
              </div>
              
              <div className="mb-2">
                <label className="text-sm font-medium block mb-1">Degree/Program</label>
                <Input
                  value={edu.degree}
                  onChange={(e) => handleEducationChange(index, 'degree', e.target.value)}
                  placeholder="e.g. Bachelor of Science in Computer Science"
                />
              </div>
              
              {education.length > 1 && (
                <Button 
                  variant="destructive"
                  size="sm"
                  onClick={() => removeEducation(index)}
                  className="mt-2"
                >
                  Remove
                </Button>
              )}
            </div>
          ))}
        </CardContent>
      </Card>
      
      <div className="flex justify-end">
        <Button onClick={saveProfile} disabled={updating}>
          {updating ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  );
};

export default ProfileEdit;
