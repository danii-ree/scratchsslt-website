
import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { MainNav } from "@/components/MainNav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Clock, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface UserStats {
  total_practice_sessions: number;
  total_questions_answered: number;
  total_correct_answers: number;
  total_time_spent_seconds: number;
  current_streak_days: number;
  longest_streak_days: number;
  last_practice_date: string | null;
}

const Profile = () => {
  const location = useLocation();
  const { user, profile, refreshProfile } = useAuth();
  const [userStats, setUserStats] = useState<UserStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchUserData();
    }
  }, [user]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch user stats
      const { data: statsData } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user?.id)
        .single();

      setUserStats(statsData);

    } catch (error) {
      console.error('Error fetching user data:', error);
      toast.error('Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const formatTimeSpent = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    return `${hours}h ${minutes}m`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get Google profile data
  const googleProfile = user?.user_metadata;
  const profilePicture = googleProfile?.avatar_url || profile?.profile_picture_url;
  const displayName = googleProfile?.full_name || `${profile?.first_name} ${profile?.last_name}`;
  const email = user?.email;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MainNav currentPath={location.pathname} />
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-osslt-purple"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <MainNav currentPath={location.pathname} />
      
      <main className="container px-4 py-24 mx-auto">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 flex flex-col md:flex-row items-start md:items-center gap-6">
            <Avatar className="h-24 w-24 border-4 border-white shadow-md">
              <AvatarImage src={profilePicture || ""} />
              <AvatarFallback className="text-3xl bg-osslt-purple text-white">
                {displayName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-osslt-dark-gray">
                {displayName}
              </h1>
              <p className="text-gray-600">{email}</p>
              {profile?.school && (
                <p className="text-gray-600">
                  {profile.grade && `${profile.grade} · `}
                  {profile.school}
                </p>
              )}
              {profile?.bio && (
                <p className="text-gray-600 mt-2">{profile.bio}</p>
              )}
              <div className="flex items-center mt-2 flex-wrap gap-2">
                <Badge variant="outline" className="bg-osslt-purple/10 text-osslt-dark-purple">
                  Member since {formatDate(profile?.created_at || '')}
                </Badge>
                {userStats && (
                  <Badge variant="outline" className="bg-green-100 text-green-800">
                    {userStats.current_streak_days} day streak
                  </Badge>
                )}
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Total Time Spent on Website</CardTitle>
                <Clock className="h-6 w-6 text-osslt-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-osslt-purple">
                  {userStats ? formatTimeSpent(userStats.total_time_spent_seconds) : '0h 0m'}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total time spent practicing and learning
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-lg font-medium">Practice Sessions Done</CardTitle>
                <BookOpen className="h-6 w-6 text-osslt-purple" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-osslt-purple">
                  {userStats?.total_practice_sessions || 0}
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Total practice sessions completed
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Overview */}
          <Card>
            <CardHeader>
              <CardTitle>Learning Progress</CardTitle>
              <CardDescription>
                Your learning journey and current streak
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium mb-2">Current Streak</h4>
                  <p className="text-3xl font-bold text-osslt-purple">
                    {userStats?.current_streak_days || 0} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Keep up the great work!
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Longest Streak</h4>
                  <p className="text-3xl font-bold text-osslt-purple">
                    {userStats?.longest_streak_days || 0} days
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Your best streak so far
                  </p>
                </div>
              </div>
              
              {userStats && userStats.total_practice_sessions > 0 && (
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Practice Completion Rate</span>
                    <span>
                      {Math.round((userStats.total_practice_sessions / (userStats.total_practice_sessions + 5)) * 100)}%
                    </span>
                  </div>
                  <Progress 
                    value={(userStats.total_practice_sessions / (userStats.total_practice_sessions + 5)) * 100} 
                    className="h-3" 
                  />
                  <p className="text-xs text-muted-foreground mt-2">
                    Based on your practice sessions
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Profile;
