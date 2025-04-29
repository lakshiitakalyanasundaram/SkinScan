import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { supabase } from '@/lib/supabase';

const Header = () => {
  const [user, setUser] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Check initial auth state
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto py-4 px-4 md:px-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary text-2xl font-bold">
            <img src="https://img.icons8.com/color/96/000000/dermatology.png" alt="DermaScan Logo" className="h-10 w-10" />
            DermaScan
          </div>
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="text-gray-600 hover:text-primary transition-colors font-medium">Home</Link>
            <a href="#prediction" className="text-gray-600 hover:text-primary transition-colors font-medium">Skin Analysis</a>
            <a href="#chatbot" className="text-gray-600 hover:text-primary transition-colors font-medium">AI Assistant</a>
            <a href="#appointment" className="text-gray-600 hover:text-primary transition-colors font-medium">Appointments</a>
            <a href="#about" className="text-gray-600 hover:text-primary transition-colors font-medium">About Us</a>
          </div>
          <div className="flex items-center gap-3">
            {user ? (
              <Button onClick={handleLogout} className="font-medium bg-primary hover:bg-primary-dark text-white">
                Logout
              </Button>
            ) : (
              <>
                <Link to="/login">
                  <Button variant="outline" className="font-medium border-primary text-primary hover:bg-primary hover:text-white">Login</Button>
                </Link>
                <Link to="/signup">
                  <Button className="font-medium bg-primary hover:bg-primary-dark text-white">Sign Up</Button>
                </Link>
              </>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Header;