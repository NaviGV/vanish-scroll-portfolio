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
  const [editingProject, setEditingProject] = useState<{
    _id: string;
    title: string;
    description: string;
    image: string;
    tags: string;
    liveLink?: string;
    codeLink?: string;
  } | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteProjectId, setDeleteProjectId] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const { toast } = useToast();
  
  useEffect(() => {
    fetchProjects();
  }, []);
  
  const fetchProjects = async () => {
    try {
      const response = await axios.get('http://localhost:5000/api/projects');
      if (response.status === 200) {
        setProjects(response.data);
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
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (editingProject) {
      setEditingProject({
        ...editingProject,
        [name]: value
      });
    } else {
      setNewProject({
        ...newProject,
        [name]: value
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
      let imageUrl = newProject.image;
      
      // Upload image if file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await axios.post('http://localhost:5000/api/projects/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token || ''
          }
        });
        
        if (uploadResponse.data.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }
      
      const response = await axios.post('http://localhost:5000/api/projects', 
        { ...newProject, image: imageUrl },
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );
      
      if (response.status === 201) {
        setProjects([...projects, response.data]);
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
    if (!editingProject) return;
    setIsSubmitting(true);
    
    try {
      const token = localStorage.getItem('token');
      let imageUrl = editingProject.image;
      
      // Upload image if file is selected
      if (imageFile) {
        const formData = new FormData();
        formData.append('image', imageFile);
        
        const uploadResponse = await axios.post('http://localhost:5000/api/projects/upload-image', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
            'x-auth-token': token || ''
          }
        });
        
        if (uploadResponse.data.imageUrl) {
          imageUrl = uploadResponse.data.imageUrl;
        }
      }
      
      const projectData = {
        ...editingProject,
        image: imageUrl,
        tags: editingProject.tags.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
      };
      
      const response = await axios.put(`http://localhost:5000/api/projects/${editingProject._id}`, 
        projectData,
        {
          headers: {
            'x-auth-token': token || ''
          }
        }
      );
      
      if (response.status === 200) {
        setProjects(projects.map(project => 
          project._id === editingProject._id ? response.data : project
        ));
        setEditingProject(null);
        setImageFile(null);
        setIsEditDialogOpen(false);
        
        toast({
          title: "Success",
          description: "Project updated successfully"
        });
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
    setEditingProject({
      _id: project._id,
      title: project.title,
      description: project.description,
      image: project.image,
      tags: Array.isArray(project.tags) ? project.tags.join(', ') : project.tags,
      liveLink: project.liveLink,
      codeLink: project.codeLink
    });
    setImageFile(null);
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

  const renderProjectForm = (isEdit: boolean) => {
    const currentProject = isEdit ? editingProject : newProject;
    if (!currentProject) return null;

    return (
      <div className="space-y-4 py-4">
        <div>
          <label htmlFor="title" className="text-sm font-medium block mb-1">Title</label>
          <Input 
            id="title" 
            name="title" 
            value={currentProject.title} 
            onChange={handleInputChange} 
            placeholder="Project Title"
            required 
          />
        </div>
        
        <div>
          <label htmlFor="description" className="text-sm font-medium block mb-1">Description</label>
          <Textarea 
            id="description" 
            name="description" 
            value={currentProject.description} 
            onChange={handleInputChange} 
            placeholder="Project description..."
            required 
          />
        </div>
        
        <div>
          <label htmlFor="image" className="text-sm font-medium block mb-1">Image URL</label>
          <Input 
            id="image" 
            name="image" 
            value={currentProject.image} 
            onChange={handleInputChange} 
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
            value={currentProject.tags} 
            onChange={handleInputChange} 
            placeholder="React, TypeScript, Tailwind CSS"
            required 
          />
        </div>
        
        <div>
          <label htmlFor="liveLink" className="text-sm font-medium block mb-1">Live Demo URL (optional)</label>
          <Input 
            id="liveLink" 
            name="liveLink" 
            value={currentProject.liveLink || ''} 
            onChange={handleInputChange} 
            placeholder="https://example.com" 
          />
        </div>
        
        <div>
          <label htmlFor="codeLink" className="text-sm font-medium block mb-1">Code Repository URL (optional)</label>
          <Input 
            id="codeLink" 
            name="codeLink" 
            value={currentProject.codeLink || ''} 
            onChange={handleInputChange} 
            placeholder="https://github.com/username/repo" 
          />
        </div>
      </div>
    );
  };
  
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
            
            {renderProjectForm(false)}
            
            <DialogFooter>
              <Button onClick={handleAddProject} disabled={isSubmitting}>
                {isSubmitting ? 'Adding...' : 'Add Project'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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
          
          {renderProjectForm(true)}
          
          <DialogFooter>
            <Button onClick={handleEditProject} disabled={isSubmitting}>
              {isSubmitting ? 'Updating...' : 'Update Project'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ProjectsList;
