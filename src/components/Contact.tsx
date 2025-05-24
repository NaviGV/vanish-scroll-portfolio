
import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Github, Linkedin, Twitter, Mail, MapPin } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useProfile } from '@/contexts/ProfileContext';

const Contact: React.FC = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  const { profile } = useProfile();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('http://localhost:5000/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast({
          title: "Message sent!",
          description: "Thank you for your message. I'll get back to you soon!",
        });
        setFormData({ name: '', email: '', subject: '', message: '' });
      } else {
        throw new Error('Failed to send message');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="py-16 md:py-24 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Get In Touch</h2>
          <div className="w-20 h-1 bg-primary mx-auto"></div>
          <p className="text-muted-foreground mt-4 max-w-2xl mx-auto">
            Have a project in mind or just want to chat? I'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="border border-primary/20 bg-background/80 backdrop-blur-sm">
            <CardHeader>
              <CardTitle>Send me a message</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="text-sm font-medium block mb-1">Name</label>
                    <Input
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      required
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label htmlFor="email" className="text-sm font-medium block mb-1">Email</label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      required
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                
                <div>
                  <label htmlFor="subject" className="text-sm font-medium block mb-1">Subject</label>
                  <Input
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleInputChange}
                    required
                    placeholder="What's this about?"
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="text-sm font-medium block mb-1">Message</label>
                  <Textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    placeholder="Tell me about your project..."
                    rows={5}
                  />
                </div>
                
                <Button type="submit" disabled={isSubmitting} className="w-full">
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Contact Info */}
          <div className="space-y-6">
            <Card className="border border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <Mail className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Email</h3>
                    <p className="text-muted-foreground">{profile.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-4">
                  <MapPin className="h-6 w-6 text-primary" />
                  <div>
                    <h3 className="font-semibold">Location</h3>
                    <p className="text-muted-foreground">{profile.location}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Follow me</h3>
                <div className="flex space-x-4">
                  {profile.social.github && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.social.github} target="_blank" rel="noopener noreferrer">
                        <Github className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  
                  {profile.social.linkedin && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.social.linkedin} target="_blank" rel="noopener noreferrer">
                        <Linkedin className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                  
                  {profile.social.twitter && (
                    <Button variant="outline" size="icon" asChild>
                      <a href={profile.social.twitter} target="_blank" rel="noopener noreferrer">
                        <Twitter className="h-5 w-5" />
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="border border-primary/20 bg-background/80 backdrop-blur-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Let's work together</h3>
                <p className="text-muted-foreground mb-4">
                  I'm always interested in new opportunities and exciting projects. 
                  Whether you have a specific project in mind or just want to connect, 
                  I'd love to hear from you.
                </p>
                {profile.resumeUrl && (
                  <Button variant="outline" asChild>
                    <a href={profile.resumeUrl} target="_blank" rel="noopener noreferrer">
                      Download Resume
                    </a>
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;
