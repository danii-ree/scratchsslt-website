
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Clock, Star } from "lucide-react";

const LibraryProgress = () => {
  const location = useLocation();

  

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Library Still Under Development</h1>
        <p className="text-xl text-gray-600 mb-4">We are actively working on this feature. Please try coming back later.</p>
        <a href="/" className="text-blue-500 hover:text-blue-700 underline">
          Return to Home
        </a>
      </div>
    </div>
    </div>
  );
};

export default LibraryProgress;
