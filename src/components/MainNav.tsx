import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface MainNavProps {
  currentPath: string;
}

export function MainNav({ currentPath }: MainNavProps) {
  const { user, signOut } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut();
      // Redirect to login page after successful logout
      window.location.href = '/auth';
    } catch (error) {
      console.error('Logout error:', error);
      toast.error("Failed to logout");
    }
  };

  const toggleMenu = () => {
    if (!isAnimating) {
      setIsAnimating(true);
      setIsOpen(!isOpen);
    }
  };

  useEffect(() => {
    if (isAnimating) {
      const timer = setTimeout(() => {
        setIsAnimating(false);
      }, 500); // Match this with your animation duration
      return () => clearTimeout(timer);
    }
  }, [isAnimating]);

  return (
    <nav className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-white/90 backdrop-blur-sm rounded-full shadow-lg px-8 py-3 border border-osslt-purple/20">
      <div className="flex justify-between items-center space-x-8">
        <div className="flex items-center">
          <Link to="/home" className="flex items-center">
            <span className="text-xl font-bold text-osslt-purple">ScratchSSLT</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-6">
          <Link
            to="/home"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentPath === "/home"
                ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
            }`}
          >
            Home
          </Link>
          <Link
            to="/practice"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentPath.startsWith("/practice")
                ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
            }`}
          >
            Practice
          </Link>
          <Link
            to="/create"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentPath === "/create"
                ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
            }`}
          >
            Create 
          </Link>
          <Link
            to="/profile"
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors duration-200 ${
              currentPath === "/profile"
                ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
            }`}
          >
            Profile
          </Link>
          <Button
            variant="ghost"
            onClick={handleLogout}
            className="text-osslt-dark-purple hover:text-white hover:bg-red-500/90 rounded-full transition-colors duration-200"
          >
            Logout
          </Button>
        </div>

        {/* Mobile Navigation Button */}
        <div className="md:hidden flex items-center">
            <Button 
              variant="ghost" 
            onClick={toggleMenu}
            className="text-osslt-purple hover:text-white hover:bg-osslt-purple/80 rounded-full transition-colors duration-200"
            >
            <svg
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              {isOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
            </Button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <AnimatePresence>
        {isOpen && (
          <div className="md:hidden absolute top-full left-0 right-0 mt-2 bg-white/95 backdrop-blur-sm rounded-lg shadow-lg overflow-hidden border border-osslt-purple/20">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <Link
                to="/home"
                className={`block px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  currentPath === "/home"
                    ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                    : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                to="/practice"
                className={`block px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  currentPath.startsWith("/practice")
                    ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                    : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Practice
              </Link>
              <Link
                to="/create"
                className={`block px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  currentPath === "/create"
                    ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                    : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Create
              </Link>
              <Link
                to="/profile"
                className={`block px-4 py-2 rounded-full text-base font-medium transition-colors duration-200 ${
                  currentPath === "/profile"
                    ? "text-white bg-gradient-to-r from-osslt-purple to-osslt-dark-purple shadow-sm"
                    : "text-osslt-dark-purple hover:text-white hover:bg-osslt-purple/80"
                }`}
                onClick={() => setIsOpen(false)}
              >
                Profile
              </Link>
              <Button
                variant="ghost"
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-osslt-dark-purple hover:text-white hover:bg-red-500/90 rounded-full transition-colors duration-200"
              >
                Logout
              </Button>
            </div>
          </div>
        )}
      </AnimatePresence>
    </nav>
  );
}
