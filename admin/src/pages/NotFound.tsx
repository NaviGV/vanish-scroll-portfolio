
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const NotFound = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
      <h1 className="text-6xl font-bold mb-4">404</h1>
      <p className="text-2xl font-medium mb-6">Page not found</p>
      <p className="text-muted-foreground mb-8 max-w-md">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <Button asChild>
        <Link to="/">Go back to login</Link>
      </Button>
    </div>
  );
};

export default NotFound;
