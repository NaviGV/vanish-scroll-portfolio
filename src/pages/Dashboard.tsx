
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const navigate = useNavigate();

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/admin');
  };

  if (!isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button variant="ghost" onClick={() => navigate('/')}>
              View Site
            </Button>
            <Button variant="destructive" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue="contacts" className="w-full">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="contacts" onClick={() => navigate('/admin/dashboard/contacts')}>
              Contact Messages
            </TabsTrigger>
            <TabsTrigger value="projects" onClick={() => navigate('/admin/dashboard/projects')}>
              Projects
            </TabsTrigger>
            <TabsTrigger value="profile" onClick={() => navigate('/admin/dashboard/profile')}>
              My Profile
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="contacts">
            <Outlet />
          </TabsContent>
          <TabsContent value="projects">
            <Outlet />
          </TabsContent>
          <TabsContent value="profile">
            <Outlet />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default Dashboard;
