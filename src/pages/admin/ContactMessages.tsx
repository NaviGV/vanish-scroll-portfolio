
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import axios from 'axios';

interface ContactMessage {
  _id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'pending' | 'responded' | 'completed';
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
      const response = await axios.get('http://localhost:5000/api/contacts', {
        headers: {
          'x-auth-token': token || ''
        }
      });
      
      if (response.status === 200) {
        setMessages(response.data);
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

  const updateStatus = async (id: string, status: 'pending' | 'responded' | 'completed') => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.patch(`http://localhost:5000/api/contacts/${id}/status`, 
        { status },
        {
          headers: {
            'Content-Type': 'application/json',
            'x-auth-token': token || ''
          }
        }
      );
      
      if (response.status === 200) {
        setMessages(messages.map(msg => 
          msg._id === id ? { ...msg, status } : msg
        ));
        
        toast({
          title: "Status updated",
          description: `Message marked as ${status}`
        });
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
      case 'pending':
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
                    <CardTitle className="text-lg font-semibold mb-2">{message.subject}</CardTitle>
                    <CardDescription className="space-y-1">
                      <div><strong>Name:</strong> {message.name}</div>
                      <div><strong>Email:</strong> {message.email}</div>
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
                <div className="mt-2">
                  <strong>Message:</strong>
                  <p className="whitespace-pre-wrap mt-1">{message.message}</p>
                </div>
              </CardContent>
              
              <CardFooter className="flex justify-end space-x-2">
                {message.status === 'pending' && (
                  <>
                    <Button 
                      variant="outline" 
                      onClick={() => updateStatus(message._id, 'responded')}
                    >
                      Mark as Responded
                    </Button>
                    <Button 
                      onClick={() => updateStatus(message._id, 'completed')}
                    >
                      Mark as Completed
                    </Button>
                  </>
                )}
                
                {message.status === 'responded' && (
                  <Button 
                    onClick={() => updateStatus(message._id, 'completed')}
                  >
                    Mark as Completed
                  </Button>
                )}
                
                {message.status === 'completed' && (
                  <Button 
                    variant="outline"
                    onClick={() => updateStatus(message._id, 'responded')}
                  >
                    Mark as Incomplete
                  </Button>
                )}
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default ContactMessages;
