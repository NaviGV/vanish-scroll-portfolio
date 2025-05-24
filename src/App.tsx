
import React from 'react';
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ProfileProvider } from "@/contexts/ProfileContext";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Admin from "./pages/Admin";
import Dashboard from "./pages/Dashboard";
import ContactMessages from "./pages/admin/ContactMessages";
import ProjectsList from "./pages/admin/ProjectsList";
import ProfileEdit from "./pages/admin/ProfileEdit";
import SkillsManagement from "./pages/admin/SkillsManagement";

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
    },
  },
});

const App = () => {
  return (
    <React.StrictMode>
      <QueryClientProvider client={queryClient}>
        <ProfileProvider>
          <TooltipProvider>
            <Toaster />
            <Sonner />
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/admin" element={<Admin />} />
                <Route path="/admin/dashboard" element={<Dashboard />}>
                  <Route index element={<ContactMessages />} />
                  <Route path="contacts" element={<ContactMessages />} />
                  <Route path="projects" element={<ProjectsList />} />
                  <Route path="skills" element={<SkillsManagement />} />
                  <Route path="profile" element={<ProfileEdit />} />
                </Route>
                <Route path="*" element={<NotFound />} />
              </Routes>
            </BrowserRouter>
          </TooltipProvider>
        </ProfileProvider>
      </QueryClientProvider>
    </React.StrictMode>
  );
};

export default App;
