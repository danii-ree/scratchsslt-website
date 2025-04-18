
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Trophy, BookOpen, Clock, CheckCircle2, BarChart3, Award } from "lucide-react";

const Profile = () => {
  const location = useLocation();
  
  // Sample data for user statistics
  const userStats = {
    practiceCompleted: 42,
    questionsAnswered: 312,
    accuracy: 76,
    streak: 7,
    timeSpent: "24h 42m",
    joinDate: "February 12, 2025"
  };
  
  // Sample data for recent activity
  const recentActivity = [
    {
      id: "1",
      title: "Understanding Themes in Short Stories",
      date: "April 18, 2025",
      score: 85,
      type: "Multiple Choice"
    },
    {
      id: "2",
      title: "Analyzing Character Motivations",
      date: "April 17, 2025",
      score: 70,
      type: "Short Answer"
    },
    {
      id: "3",
      title: "Paragraph Writing: Organizing Ideas",
      date: "April 15, 2025",
      score: 90,
      type: "Paragraph"
    }
  ];
  
  // Sample data for achievements
  const achievements = [
    {
      id: "1",
      title: "Reading Master",
      description: "Completed 20 reading comprehension exercises",
      icon: BookOpen,
      date: "April 12, 2025",
      color: "bg-blue-100 text-blue-800"
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintained a 7-day practice streak",
      icon: CalendarDays,
      date: "April 18, 2025",
      color: "bg-green-100 text-green-800"
    },
    {
      id: "3",
      title: "Perfect Score",
      description: "Achieved 100% on a practice test",
      icon: Trophy,
      date: "April 5, 2025",
      color: "bg-yellow-100 text-yellow-800"
    },
  ];
  
  // Sample data for performance by question type
  const performanceByType = [
    { type: "Multiple Choice", correct: 145, total: 180, color: "bg-blue-500" },
    { type: "Short Answer", correct: 62, total: 84, color: "bg-purple-500" },
    { type: "Paragraph", correct: 28, total: 32, color: "bg-indigo-500" },
    { type: "Matching", correct: 12, total: 16, color: "bg-pink-500" }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src="" />
              <AvatarFallback className="text-3xl bg-osslt-purple text-white">DP</AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-osslt-dark-gray">David Parker</h1>
              <p className="text-gray-600">Grade 10 · Maple Ridge Secondary School</p>
              <div className="flex items-center mt-2 flex-wrap gap-2">
                <Badge variant="outline" className="bg-osslt-yellow/50 text-osslt-dark-gray border-none">
                  <CalendarDays className="h-3 w-3 mr-1" />
                  {userStats.streak} day streak
                </Badge>
                <Badge variant="outline" className="bg-osslt-purple/10 text-osslt-dark-purple border-none">
                  <Trophy className="h-3 w-3 mr-1" />
                  3 achievements
                </Badge>
                <Badge variant="outline" className="bg-green-100 text-green-800 border-none">
                  <BookOpen className="h-3 w-3 mr-1" />
                  {userStats.practiceCompleted} practices completed
                </Badge>
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Practices Completed</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 text-green-500 mr-2" />
                  <span className="text-2xl font-bold">{userStats.practiceCompleted}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Questions Answered</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <BarChart3 className="h-5 w-5 text-blue-500 mr-2" />
                  <span className="text-2xl font-bold">{userStats.questionsAnswered}</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Average Accuracy</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Award className="h-5 w-5 text-yellow-500 mr-2" />
                  <span className="text-2xl font-bold">{userStats.accuracy}%</span>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm text-muted-foreground">Time Spent</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center">
                  <Clock className="h-5 w-5 text-red-500 mr-2" />
                  <span className="text-2xl font-bold">{userStats.timeSpent}</span>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <Tabs defaultValue="progress" className="w-full">
            <TabsList className="mb-8">
              <TabsTrigger value="progress" className="text-base">Progress</TabsTrigger>
              <TabsTrigger value="activity" className="text-base">Recent Activity</TabsTrigger>
              <TabsTrigger value="achievements" className="text-base">Achievements</TabsTrigger>
            </TabsList>
            
            <TabsContent value="progress">
              <Card>
                <CardHeader>
                  <CardTitle>Performance by Question Type</CardTitle>
                  <CardDescription>
                    Your accuracy across different question formats
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {performanceByType.map((item, index) => (
                      <div key={index} className="space-y-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{item.type}</span>
                          <span className="text-muted-foreground">
                            {Math.round((item.correct / item.total) * 100)}% ({item.correct}/{item.total})
                          </span>
                        </div>
                        <Progress 
                          value={(item.correct / item.total) * 100} 
                          className="h-2" 
                          indicatorClassName={item.color}
                        />
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activity">
              <div className="space-y-4">
                {recentActivity.map((activity) => (
                  <Card key={activity.id}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-base">{activity.title}</CardTitle>
                          <CardDescription>{activity.date}</CardDescription>
                        </div>
                        <Badge variant="outline" className={
                          activity.score >= 80 
                            ? "bg-green-100 text-green-800" 
                            : activity.score >= 60 
                              ? "bg-yellow-100 text-yellow-800" 
                              : "bg-red-100 text-red-800"
                        }>
                          {activity.score}%
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="outline" className="bg-gray-100 text-gray-800">
                          {activity.type}
                        </Badge>
                        <Progress 
                          value={activity.score} 
                          className="w-36 h-2" 
                          indicatorClassName={
                            activity.score >= 80 
                              ? "bg-green-500" 
                              : activity.score >= 60 
                                ? "bg-yellow-500" 
                                : "bg-red-500"
                          }
                        />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            <TabsContent value="achievements">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {achievements.map((achievement) => (
                  <Card key={achievement.id} className="overflow-hidden">
                    <CardHeader className={`${achievement.color} pb-2 border-b`}>
                      <div className="flex items-center">
                        <achievement.icon className="h-5 w-5 mr-2" />
                        <CardTitle className="text-base">{achievement.title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-4">
                      <CardDescription className="text-base mb-2">
                        {achievement.description}
                      </CardDescription>
                      <p className="text-xs text-muted-foreground">
                        Earned on {achievement.date}
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Profile;
