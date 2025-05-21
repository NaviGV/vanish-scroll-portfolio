import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

const Login: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';
  
  useEffect(() => {
    // Check if already logged in
    const token = localStorage.getItem('token');
    if (token) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await axios.post(`${backendUrl}/api/auth/login`, {
        username, 
        password
      });
      
      localStorage.setItem('token', response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      toast({
        title: "Login successful",
        description: "Welcome to the admin dashboard!"
      });
      
      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Login failed",
        description: axios.isAxiosError(error) && error.response?.data?.message
          ? error.response.data.message
          : "Invalid credentials",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md p-8 border border-primary/20">
        <h1 className="text-3xl font-bold mb-6 text-center">Portfolio Admin</h1>
        
        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium block mb-1">Username</label>
              <Input 
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                required
              />
            </div>
            
            <div>
              <label htmlFor="password" className="text-sm font-medium block mb-1">Password</label>
              <Input 
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Login;
