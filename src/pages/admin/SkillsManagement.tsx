
import React, { useState, useEffect } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Trash2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import axios from 'axios';

interface Skill {
  _id: string;
  name: string;
  level: number;
}

const SkillsManagement: React.FC = () => {
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState({ name: '', level: 75 });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<{ name: string; } | null>(null);
  const [nameColor, setNameColor] = useState<string>('#9b87f5'); // Default color
  const { toast } = useToast();

  useEffect(() => {
    fetchSkills();
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;
      
      const response = await axios.get('http://localhost:5000/api/profile/me', {
        headers: {
          'x-auth-token': token
        }
      });
      
      if (response.status === 200) {
        setUser(response.data);
        if (response.data.name) {
          setNameColor(getColorFromName(response.data.name));
        }
      }
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const getColorFromName = (name: string): string => {
    if (!name || name.length === 0) return '#9b87f5';
    
    // Get first letter and calculate a color based on it
    const firstLetter = name.charAt(0).toUpperCase();
    const letterPosition = firstLetter.charCodeAt(0) - 65; // A=0, B=1, etc.
    
    // Color palette - can be expanded
    const colors = [
      '#9b87f5', '#7E69AB', '#6E59A5', '#8B5CF6', '#D946EF', 
      '#F97316', '#0EA5E9', '#10B981', '#F59E0B', '#EC4899',
      '#06B6D4', '#8B5CF6', '#F43F5E', '#D946EF', '#14B8A6',
      '#6366F1', '#F97316', '#8B5CF6', '#10B981', '#F59E0B',
      '#EC4899', '#06B6D4', '#F43F5E', '#14B8A6', '#6366F1',
      '#D946EF'
    ];
    
    const colorIndex = letterPosition % colors.length;
    return colors[colorIndex];
  };

  const fetchSkills = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('http://localhost:5000/api/skills', {
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (response.status === 200) {
        setSkills(response.data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch skills",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Fetch skills error:', error);
      toast({
        title: "Error",
        description: "Failed to fetch skills",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newSkill.name.trim()) {
      toast({
        title: "Error",
        description: "Skill name is required",
        variant: "destructive"
      });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.post('http://localhost:5000/api/skills', 
        {
          name: newSkill.name,
          level: newSkill.level
        },
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );

      if (response.status === 201) {
        setSkills([...skills, response.data]);
        setNewSkill({ name: '', level: 75 });
        toast({
          title: "Success",
          description: "Skill added successfully"
        });
      } else {
        throw new Error('Failed to add skill');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to add skill",
        variant: "destructive"
      });
    }
  };

  const handleUpdateSkill = async (id: string, name: string, level: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(`http://localhost:5000/api/skills/${id}`,
        {
          name,
          level
        },
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );

      if (response.status === 200) {
        const updatedSkill = response.data;
        setSkills(skills.map(skill => skill._id === id ? updatedSkill : skill));
        toast({
          title: "Success",
          description: "Skill updated successfully"
        });
      } else {
        throw new Error('Failed to update skill');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update skill",
        variant: "destructive"
      });
    }
  };

  const handleDeleteSkill = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/skills/${id}`, {
        headers: {
          'x-auth-token': token || ''
        }
      });

      if (response.status === 200) {
        setSkills(skills.filter(skill => skill._id !== id));
        toast({
          title: "Success",
          description: "Skill deleted successfully"
        });
      } else {
        throw new Error('Failed to delete skill');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to delete skill",
        variant: "destructive"
      });
    }
  };

  const handleNameChange = (id: string, name: string) => {
    setSkills(skills.map(skill => 
      skill._id === id ? { ...skill, name } : skill
    ));
  };

  const handleLevelChange = (id: string, level: number[]) => {
    setSkills(skills.map(skill => 
      skill._id === id ? { ...skill, level: level[0] } : skill
    ));
  };

  if (loading) {
    return <div className="flex justify-center p-8">Loading skills...</div>;
  }

  return (
    <div>
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add New Skill</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddSkill} className="space-y-4">
            <div>
              <label htmlFor="skillName" className="text-sm font-medium block mb-1">Skill Name</label>
              <Input
                id="skillName"
                value={newSkill.name}
                onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                placeholder="Enter skill name"
                className="mb-4"
              />
            </div>
            
            <div>
              <label htmlFor="skillLevel" className="text-sm font-medium block mb-1">
                Proficiency Level: {newSkill.level}%
              </label>
              <Slider
                id="skillLevel"
                value={[newSkill.level]}
                min={0}
                max={100}
                step={1}
                className="mb-4"
                onValueChange={(value) => setNewSkill({ ...newSkill, level: value[0] })}
                style={{
                  '--slider-color': nameColor
                } as React.CSSProperties}
              />
            </div>
            
            <Button type="submit">Add Skill</Button>
          </form>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Manage Skills</CardTitle>
        </CardHeader>
        <CardContent>
          {skills.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No skills added yet</p>
          ) : (
            <div className="space-y-6">
              {skills.map((skill) => (
                <div key={skill._id} className="border p-4 rounded-md">
                  <div className="flex items-center justify-between gap-4 mb-2">
                    <Input
                      value={skill.name}
                      onChange={(e) => handleNameChange(skill._id, e.target.value)}
                      onBlur={() => handleUpdateSkill(skill._id, skill.name, skill.level)}
                    />
                    
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="icon">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Skill</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete "{skill.name}"? This action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteSkill(skill._id)}>Delete</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                  
                  <div>
                    <span className="text-sm text-muted-foreground block mb-1">
                      Proficiency Level: {skill.level}%
                    </span>
                    <Slider
                      value={[skill.level]}
                      min={0}
                      max={100}
                      step={1}
                      onValueChange={(value) => handleLevelChange(skill._id, value)}
                      onValueCommit={() => handleUpdateSkill(skill._id, skill.name, skill.level)}
                      style={{
                        '--slider-color': nameColor
                      } as React.CSSProperties}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SkillsManagement;
