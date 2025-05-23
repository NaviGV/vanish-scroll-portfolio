
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface UserProfile {
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

const ProfileEdit = () => {
  const [profile, setProfile] = useState<UserProfile>({
    name: '',
    email: '',
    role: '',
    location: '',
    profilePicture: '',
    resumeUrl: '',
    social: {
      github: '',
      twitter: '',
      linkedin: ''
    }
  });
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [resumeFileName, setResumeFileName] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProfile();
  }, []);
  
  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return;
      }
      
      const response = await axios.get('http://localhost:5000/api/profile/me', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.status === 200) {
        setProfile(response.data);
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch profile data",
        variant: "destructive"
      });
      console.error("Profile fetch error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    
    if (name.includes('.')) {
      // Handle nested object properties (like social.github)
      const [object, property] = name.split('.');
      setProfile({
        ...profile,
        [object]: {
          ...profile[object as keyof UserProfile] as Record<string, string>,
          [property]: value
        }
      });
    } else {
      setProfile({
        ...profile,
        [name]: value
      });
    }
  };
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setImageFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onload = () => {
      setImagePreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setResumeFile(file);
    setResumeFileName(file.name);
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Authentication token not found');
      }
      
      // First update profile data
      await axios.patch('http://localhost:5000/api/profile', profile, {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      });
      
      // Upload profile image if selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('profileImage', imageFile);
        
        await axios.post('http://localhost:5000/api/profile/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          }
        });
      }
      
      // Upload resume file if selected
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resumeFile', resumeFile);
        
        const resumeResponse = await axios.post('http://localhost:5000/api/profile/upload-resume', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token
          }
        });
        
        // Update the profile with the new resume URL from the response
        if (resumeResponse.data && resumeResponse.data.resumeUrl) {
          setProfile({
            ...profile,
            resumeUrl: resumeResponse.data.resumeUrl
          });
        }
      }
      
      toast({
        title: "Success",
        description: "Profile updated successfully"
      });
      
      // Refresh profile data
      fetchProfile();
      
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive"
      });
      console.error("Profile update error:", error);
    } finally {
      setSaving(false);
    }
  };
  
  if (loading) {
    return <div className="flex justify-center p-8">Loading profile...</div>;
  }
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Edit Profile</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex flex-col md:flex-row gap-6">
            <div className="flex-1 space-y-4">
              {/* Profile Image */}
              <div>
                <label className="block text-sm font-medium mb-2">Profile Picture</label>
                <div className="flex items-center space-x-4">
                  <img 
                    src={imagePreview || profile.profilePicture || 'https://via.placeholder.com/150'} 
                    alt="Profile" 
                    className="w-24 h-24 rounded-full object-cover border"
                  />
                  <Input 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="max-w-xs"
                  />
                </div>
              </div>
              
              {/* Basic Info */}
              <div>
                <label htmlFor="name" className="block text-sm font-medium mb-2">Name</label>
                <Input
                  id="name"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium mb-2">Email</label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="role" className="block text-sm font-medium mb-2">Job Title / Role</label>
                <Input
                  id="role"
                  name="role"
                  value={profile.role}
                  onChange={handleInputChange}
                  required
                />
              </div>
              
              <div>
                <label htmlFor="location" className="block text-sm font-medium mb-2">Location</label>
                <Input
                  id="location"
                  name="location"
                  value={profile.location}
                  onChange={handleInputChange}
                />
              </div>
            </div>
            
            <div className="flex-1 space-y-4">
              {/* Resume upload/link options */}
              <div>
                <label className="block text-sm font-medium mb-2">Resume</label>
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs text-muted-foreground mb-2">Upload Resume File</label>
                    <Input 
                      type="file" 
                      accept=".pdf,.doc,.docx" 
                      onChange={handleResumeChange}
                    />
                    {resumeFileName && (
                      <p className="text-xs mt-1 text-muted-foreground">Selected: {resumeFileName}</p>
                    )}
                  </div>
                  
                  <div>
                    <label htmlFor="resumeUrl" className="block text-xs text-muted-foreground mb-2">
                      Or Enter Resume URL (used if no file is uploaded)
                    </label>
                    <Input
                      id="resumeUrl"
                      name="resumeUrl"
                      value={profile.resumeUrl}
                      onChange={handleInputChange}
                      placeholder="https://example.com/my-resume.pdf"
                    />
                    {profile.resumeUrl && !resumeFile && (
                      <p className="text-xs mt-1 text-muted-foreground">Current resume: 
                        <a 
                          href={profile.resumeUrl} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="ml-1 text-primary hover:underline"
                        >
                          View
                        </a>
                      </p>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium mb-2">Social Links</label>
                
                <div className="space-y-3">
                  <div>
                    <label htmlFor="github" className="block text-xs text-muted-foreground mb-1">GitHub</label>
                    <Input
                      id="github"
                      name="social.github"
                      value={profile.social.github}
                      onChange={handleInputChange}
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="twitter" className="block text-xs text-muted-foreground mb-1">Twitter</label>
                    <Input
                      id="twitter"
                      name="social.twitter"
                      value={profile.social.twitter}
                      onChange={handleInputChange}
                      placeholder="https://twitter.com/yourusername"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="linkedin" className="block text-xs text-muted-foreground mb-1">LinkedIn</label>
                    <Input
                      id="linkedin"
                      name="social.linkedin"
                      value={profile.social.linkedin}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourusername"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button type="submit" disabled={saving}>
              {saving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};

export default ProfileEdit;
