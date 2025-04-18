
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bookmark, Clock, Star } from "lucide-react";

const Library = () => {
  const location = useLocation();

  // Sample data for saved and recent items
  const savedItems = [
    {
      id: "1",
      title: "Understanding Themes in Short Stories",
      description: "Practice identifying themes and main ideas in short literary texts.",
      type: "Multiple Choice",
      lastAccessed: "2 days ago",
      savedAt: "Apr 10, 2025"
    },
    {
      id: "3",
      title: "Paragraph Writing: Organizing Ideas",
      description: "Learn to write well-organized paragraphs with clear topic sentences.",
      type: "Paragraph",
      lastAccessed: "1 week ago",
      savedAt: "Mar 28, 2025"
    },
    {
      id: "5",
      title: "Comprehending News Articles",
      description: "Practice reading and understanding informational texts from news sources.",
      type: "Multiple Choice",
      lastAccessed: "3 days ago",
      savedAt: "Apr 15, 2025"
    }
  ];
  
  const recentItems = [
    {
      id: "2",
      title: "Analyzing Character Motivations",
      description: "Explore character development and motivations in narrative texts.",
      type: "Short Answer",
      lastAccessed: "Today",
    },
    {
      id: "4",
      title: "Identifying Literary Devices",
      description: "Match literary devices with their examples from various texts.",
      type: "Matching",
      lastAccessed: "Yesterday",
    },
    {
      id: "1",
      title: "Understanding Themes in Short Stories",
      description: "Practice identifying themes and main ideas in short literary texts.",
      type: "Multiple Choice",
      lastAccessed: "2 days ago",
    }
  ];

  const createdItems = [
    {
      id: "7",
      title: "News Media Analysis",
      description: "Practice analyzing bias and perspective in news articles.",
      type: "Short Answer",
      createdAt: "Apr 12, 2025",
      usedCount: 23
    },
    {
      id: "8",
      title: "Poetry Interpretation",
      description: "Answer questions about themes and literary devices in poetry.",
      type: "Multiple Choice",
      createdAt: "Apr 5, 2025",
      usedCount: 45
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-osslt-dark-gray mb-2">My Library</h1>
            <p className="text-gray-600">
              Access your saved, recent, and created practice materials in one place.
            </p>
          </div>
          
          <Tabs defaultValue="saved" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="saved" className="text-base">
                <Bookmark className="mr-2 h-4 w-4" />
                Saved
              </TabsTrigger>
              <TabsTrigger value="recent" className="text-base">
                <Clock className="mr-2 h-4 w-4" />
                Recent
              </TabsTrigger>
              <TabsTrigger value="created" className="text-base">
                <Star className="mr-2 h-4 w-4" />
                Created
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="saved">
              {savedItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {savedItems.map(item => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {item.type}</p>
                          <p>Last accessed: {item.lastAccessed}</p>
                          <p>Saved on: {item.savedAt}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                          Start Practice
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No saved items yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Bookmark your favorite practice materials to access them quickly.
                  </p>
                  <Button asChild>
                    <a href="/practice">Browse Practice Materials</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="recent">
              {recentItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentItems.map(item => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {item.type}</p>
                          <p>Last accessed: {item.lastAccessed}</p>
                        </div>
                      </CardContent>
                      <CardFooter>
                        <Button className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                          Continue Practice
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">No recent activity</h3>
                  <p className="text-muted-foreground mb-4">
                    Start practicing to see your recent activities here.
                  </p>
                  <Button asChild>
                    <a href="/practice">Start Practicing</a>
                  </Button>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="created">
              {createdItems.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {createdItems.map(item => (
                    <Card key={item.id}>
                      <CardHeader>
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                        <CardDescription>{item.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <div className="text-sm text-muted-foreground">
                          <p>Type: {item.type}</p>
                          <p>Created on: {item.createdAt}</p>
                          <p>Used by {item.usedCount} students</p>
                        </div>
                      </CardContent>
                      <CardFooter className="flex justify-between gap-2">
                        <Button variant="outline" className="flex-1">
                          Edit
                        </Button>
                        <Button className="flex-1 bg-osslt-purple hover:bg-osslt-dark-purple">
                          View
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <h3 className="text-lg font-medium mb-2">You haven't created any content yet</h3>
                  <p className="text-muted-foreground mb-4">
                    Create your own practice materials to share with other students.
                  </p>
                  <Button asChild>
                    <a href="/create">Create Practice Content</a>
                  </Button>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Library;
