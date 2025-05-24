
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'new' | 'responded' | 'completed';
  createdAt: string;
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/contacts', {
        headers: {
          'x-auth-token': token || ''
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setMessages(data);
      } else {
        throw new Error('Failed to fetch messages');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not load contact messages",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: string, currentStatus: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/contacts/${id}/toggle-status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        }
      });
      
      if (response.ok) {
        const updatedMessage = await response.json();
        // Update local state
        setMessages(messages.map(msg => 
          msg._id === id ? updatedMessage : msg
        ));
        
        toast({
          title: "Status updated",
          description: `Message marked as ${updatedMessage.status}`
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update message status",
        variant: "destructive"
      });
    }
  };

  const updateStatus = async (id: string, status: 'new' | 'responded' | 'completed') => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/contacts/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token || ''
        },
        body: JSON.stringify({ status })
      });
      
      if (response.ok) {
        // Update local state
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, status } : msg
        ));
        
        toast({
          title: "Status updated",
          description: `Message marked as ${status}`
        });
      } else {
        throw new Error('Failed to update status');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Could not update message status",
        variant: "destructive"
      });
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge className="bg-blue-500">New</Badge>;
      case 'responded':
        return <Badge className="bg-yellow-500">Responded</Badge>;
      case 'completed':
        return <Badge className="bg-green-500">Completed</Badge>;
      default:
        return <Badge>Unknown</Badge>;
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
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
      <h2 className="text-2xl font-bold mb-6">Contact Messages</h2>
      
      {messages.length === 0 ? (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-muted-foreground">No contact messages yet.</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {messages.map((message) => (
            <Card key={message._id} className="border border-primary/10">
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle>{message.subject}</CardTitle>
                    <CardDescription className="mt-2">
                      From: {message.name} ({message.email})
                    </CardDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    {getStatusBadge(message.status)}
                    <span className="text-xs text-muted-foreground mt-1">
                      {formatDate(message.createdAt)}
                    </span>
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <p className="whitespace-pre-wrap">{message.message}</p>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                {message.status !== 'responded' && (
                  <Button 
                    variant="outline" 
                    onClick={() => updateStatus(message._id, 'responded')}
                  >
                    Mark as Responded
                  </Button>
                )}
                
                <Button 
                  onClick={() => toggleStatus(message._id, message.status)}
                >
                  {message.status === 'completed' ? 'Mark as Incomplete' : 'Mark as Completed'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
