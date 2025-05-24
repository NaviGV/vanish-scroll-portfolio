
import React, { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { Edit, Trash2 } from "lucide-react";
import axios from 'axios';

interface Project {
  _id: string;
  title: string;
  description: string;
  image: string;
  tags: string[];
  liveLink?: string;
  codeLink?: string;
}

const ProjectsList: React.FC = () => {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    image: '',
    tags: '',
    liveLink: '',
    codeLink: ''
  });
  const [editProject, setEditProject] = useState<Project | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      if (response.status === 200) {
        setProjects(response.data);
      } else {
        throw new Error('Failed to fetch projects');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load projects",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, isEdit = false) => {
    if (isEdit && editProject) {
      setEditProject({
        ...editProject,
        [e.target.name]: e.target.value
      });
    } else {
      setNewProject({
        ...newProject,
        [e.target.name]: e.target.value
      });
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
    }
  };
  
  const handleAddProject = async () => {
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      let projectData = { ...newProject };

      // If an image file is selected, upload it first
      if (imageFile) {
        const formData = new FormData();
        formData.append('projectImage', imageFile);
        
        const uploadResponse = await axios.post('http://localhost:5000/api/projects/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token || ''
          }
        });

        if (uploadResponse.data.imageUrl) {
          projectData.image = uploadResponse.data.imageUrl;
        }
      }

      const response = await axios.post('http://localhost:5000/api/projects', 
        projectData,
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );
      
      if (response.status === 201) {
        const project = response.data;
        setProjects([...projects, project]);
        setNewProject({
          title: '',
          description: '',
          image: '',
          tags: '',
          liveLink: '',
          codeLink: ''
        });
        setImageFile(null);
        setIsAddDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Project added successfully"
        });
      } else {
        throw new Error('Failed to add project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not add project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditProject = async () => {
    if (!editProject) return;
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      let projectData = { 
        ...editProject,
        tags: Array.isArray(editProject.tags) ? editProject.tags.join(', ') : editProject.tags
      };

      const response = await axios.put(`http://localhost:5000/api/projects/${editProject._id}`, 
        projectData,
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );
      
      if (response.status === 200) {
        const updatedProject = response.data;
        setProjects(projects.map(p => p._id === updatedProject._id ? updatedProject : p));
        setEditProject(null);
        setIsEditDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Project updated successfully"
        });
      } else {
        throw new Error('Failed to update project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update project",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openEditDialog = (project: Project) => {
    setEditProject({
      ...project,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags
    });
    setIsEditDialogOpen(true);
  };
  
  const confirmDeleteProject = (id: string) => {
    setDeleteProjectId(id);
  };
  
  const handleDeleteProject = async () => {
    if (!deleteProjectId) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await axios.delete(`http://localhost:5000/api/projects/${deleteProjectId}`, {
        headers: {
          'x-auth-token': token || ''
        }
      });
      
      if (response.status === 200) {
        setProjects(projects.filter(project => project._id !== deleteProjectId));
        setDeleteProjectId(null);
        
        toast({
          title: "Success",
          description: "Project deleted successfully"
        });
      } else {
        throw new Error('Failed to delete project');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not delete project",
        variant: "destructive"
      });
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
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button>Add New Project</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[550px]">
            <DialogHeader>
              <DialogTitle>Add New Project</DialogTitle>
              <DialogDescription>
                Create a new project to showcase in your portfolio.
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="title" className="text-sm font-medium block mb-1">Title</label>
                <Input 
                  id="title" 
                  name="title" 
                  value={newProject.title} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="Project Title"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="description" className="text-sm font-medium block mb-1">Description</label>
                <Textarea 
                  id="description" 
                  name="description" 
                  value={newProject.description} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="Project description..."
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="image" className="text-sm font-medium block mb-1">Image URL</label>
                <Input 
                  id="image" 
                  name="image" 
                  value={newProject.image} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              <div>
                <label htmlFor="imageFile" className="text-sm font-medium block mb-1">Or Upload Image</label>
                <Input 
                  id="imageFile" 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                />
              </div>
              
              <div>
                <label htmlFor="tags" className="text-sm font-medium block mb-1">Tags (comma-separated)</label>
                <Input 
                  id="tags" 
                  name="tags" 
                  value={newProject.tags} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="React, TypeScript, Tailwind CSS"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="liveLink" className="text-sm font-medium block mb-1">Live Demo URL (optional)</label>
                <Input 
                  id="liveLink" 
                  name="liveLink" 
                  value={newProject.liveLink} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="https://example.com" 
                />
              </div>
              
              <div>
                <label htmlFor="codeLink" className="text-sm font-medium block mb-1">Code Repository URL (optional)</label>
                <Input 
                  id="codeLink" 
                  name="codeLink" 
                  value={newProject.codeLink} 
                  onChange={(e) => handleInputChange(e, false)} 
                  placeholder="https://github.com/username/repo" 
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button onClick={handleAddProject} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      {/* Project List */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.length > 0 ? (
          projects.map((project) => (
            <Card key={project._id} className="border border-primary/10">
              <div className="h-48 overflow-hidden">
                <img 
                  src={project.image} 
                  alt={project.title} 
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardHeader>
                <CardTitle>{project.title}</CardTitle>
                <div className="flex flex-wrap gap-2 mt-2">
                  {project.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="bg-primary/20">{tag}</Badge>
                  ))}
                </div>
              </CardHeader>
              
              <CardContent>
                <CardDescription className="text-foreground/70">{project.description}</CardDescription>
              </CardContent>
              
              <CardFooter className="flex justify-between">
                <div className="flex space-x-2">
                  {project.liveLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.liveLink} target="_blank" rel="noopener noreferrer">Live Demo</a>
                    </Button>
                  )}
                  
                  {project.codeLink && (
                    <Button variant="outline" size="sm" asChild>
                      <a href={project.codeLink} target="_blank" rel="noopener noreferrer">View Code</a>
                    </Button>
                  )}
                </div>
                
                <div className="flex space-x-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => openEditDialog(project)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    onClick={() => confirmDeleteProject(project._id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardFooter>
            </Card>
          ))
        ) : (
          <div className="col-span-2">
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-muted-foreground">No projects yet. Click "Add New Project" to create your first project.</p>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Edit Project Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Edit Project</DialogTitle>
            <DialogDescription>
              Update the project details.
            </DialogDescription>
          </DialogHeader>
          
          {editProject && (
            <div className="space-y-4 py-4">
              <div>
                <label htmlFor="edit-title" className="text-sm font-medium block mb-1">Title</label>
                <Input 
                  id="edit-title" 
                  name="title" 
                  value={editProject.title} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="Project Title"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="edit-description" className="text-sm font-medium block mb-1">Description</label>
                <Textarea 
                  id="edit-description" 
                  name="description" 
                  value={editProject.description} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="Project description..."
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="edit-image" className="text-sm font-medium block mb-1">Image URL</label>
                <Input 
                  id="edit-image" 
                  name="image" 
                  value={editProject.image} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="https://example.com/image.jpg"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="edit-tags" className="text-sm font-medium block mb-1">Tags (comma-separated)</label>
                <Input 
                  id="edit-tags" 
                  name="tags" 
                  value={editProject.tags} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="React, TypeScript, Tailwind CSS"
                  required 
                />
              </div>
              
              <div>
                <label htmlFor="edit-liveLink" className="text-sm font-medium block mb-1">Live Demo URL (optional)</label>
                <Input 
                  id="edit-liveLink" 
                  name="liveLink" 
                  value={editProject.liveLink || ''} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="https://example.com" 
                />
              </div>
              
              <div>
                <label htmlFor="edit-codeLink" className="text-sm font-medium block mb-1">Code Repository URL (optional)</label>
                <Input 
                  id="edit-codeLink" 
                  name="codeLink" 
                  value={editProject.codeLink || ''} 
                  onChange={(e) => handleInputChange(e, true)} 
                  placeholder="https://github.com/username/repo" 
                />
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button onClick={handleEditProject} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!deleteProjectId} onOpenChange={() => setDeleteProjectId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this project from your portfolio.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteProject}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogFooter>
      </AlertDialog>
    </div>
  );
};

export default ProjectsList;
