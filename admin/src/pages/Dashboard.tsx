
import React, { useState, useEffect } from 'react';
import { Navigate, Outlet, useNavigate, useLocation } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const Dashboard: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(!!localStorage.getItem('token'));
  const navigate = useNavigate();
  const location = useLocation();

  // Get active tab based on current path
  const getActiveTab = () => {
    const path = location.pathname.split('/').pop() || 'contacts';
    return ['contacts', 'projects', 'profile'].includes(path) ? path : 'contacts';
  };

  useEffect(() => {
    // Check if token exists
    const token = localStorage.getItem('token');
    if (!token) {
      setIsAuthenticated(false);
    }
  }, []);

  const handleTabChange = (value: string) => {
    navigate(`/dashboard/${value}`);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <header className="border-b border-border p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <div className="flex space-x-4">
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-4">
        <Tabs defaultValue={getActiveTab()} value={getActiveTab()} className="w-full" onValueChange={handleTabChange}>
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="contacts">
              Contact Messages
            </TabsTrigger>
            <TabsTrigger value="projects">
              Projects
            </TabsTrigger>
            <TabsTrigger value="profile">
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
