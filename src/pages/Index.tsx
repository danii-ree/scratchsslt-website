import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, FilePlus, LibraryBig, Trophy, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { FeaturedPractice } from "@/components/FeaturedPractice";
import { MainNav } from "@/components/MainNav";
import { supabase } from "@/integrations/supabase/client";
import { seedDemoData } from "@/utils/seedDemoData";
import { PracticeSlider } from "@/components/home/PracticeSlider";

const Index = () => {
  const location = useLocation();

  const features = [
    {
      title: "Practice Exercises",
      description: "Access OSSLT practice exercises with various question types including multiple choice, short answer, paragraph, and matching questions.",
      icon: BookOpen,
      link: "/practice",
      badge: "Practice"
    },
    {
      title: "Resource Library",
      description: "Browse our collection of reading materials and practice problems created by teachers and students.",
      icon: LibraryBig,
      link: "/library",
      badge: "Library"
    },
    {
      title: "Create Content",
      description: "Teachers can create custom practice problems and reading passages for their students.",
      icon: FilePlus,
      link: "/create",
      badge: "Create"
    },
    {
      title: "Track Progress",
      description: "Monitor your improvement, track practice sessions, and identify areas for growth with detailed analytics.",
      icon: Trophy,
      link: "/profile",
      badge: "Progress"
    }
  ];

  const [seeding, setSeeding] = useState(false);

  const ensureDemo = async () => {
    try {
      setSeeding(true);
      const { data } = await supabase.from('practice_content').select('id').limit(1);
      if (!data || data.length === 0) {
        await seedDemoData();
      }
    } finally {
      setSeeding(false);
    }
  };

  const featureCards = useMemo(() => features, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto space-y-16">
          {/* Hero Section */}
          <section className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-osslt-dark-gray">ScratchSSLT</h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Prepare for the Ontario Secondary School Literacy Test with interactive practice exercises and comprehensive learning tools.
            </p>
          </section>

          {/* Featured Practice Section */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-osslt-dark-gray">Featured Practice</h2>
            <div className="max-w-lg mx-auto mb-6">
              <FeaturedPractice />
            </div>
          </section>

          {/* Practice Problems Slider */}
          <section>
            <h2 className="text-2xl font-bold mb-6 text-osslt-dark-gray">Current Practice Problems</h2>
            <PracticeSlider />
          </section>
          
          {/* Features Section */}
          <section>
            <h2 className="text-2xl font-bold mb-8 text-osslt-dark-gray">Get Started</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featureCards.map((feature, index) => (
                <Card key={index} className="flex flex-col h-full hover:shadow-lg transition-shadow duration-200">
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="p-2 bg-osslt-purple/10 rounded-lg">
                        <feature.icon className="h-6 w-6 text-osslt-purple" />
                      </div>
                      <Badge variant="outline" className="bg-blue-100 text-blue-800">
                        {feature.badge}
                      </Badge>
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent className="flex-grow pb-4">
                    <CardDescription className="text-sm leading-relaxed">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button asChild className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                      <Link to={feature.link} className="flex items-center gap-2">
                        Explore
                        <ArrowRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
