import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion, AnimatePresence } from "framer-motion";
import { Mail } from "lucide-react";

const slogans = [
  "Master the OSSLT with confidence",
  "Practice makes perfect",
  "Your path to literacy success",
  "Learn at your own pace",
  "Join thousands of successful students"
];

const Auth = () => {
  const navigate = useNavigate();
  const [activeSlogan, setActiveSlogan] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveSlogan((prev) => (prev + 1) % slogans.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleGoogle = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/home`, queryParams: { access_type: 'offline', prompt: 'consent' } }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-osslt-purple/10 to-osslt-dark-purple/10">
      <div className="w-full max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Motivating slogans with nested rotating squares */}
          <div className="hidden lg:block">
            <div className="relative h-[400px]">
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Nested rotating squares */}
                <div className="relative w-32 h-32 mb-14">
                  {/* Outer square */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 12,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-0 border-4 border-osslt-purple rounded-lg"
                  />
                  
                  {/* Middle square */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ 
                      duration: 8,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-5 border-4 border-osslt-dark-purple rounded-lg"
                  />
                  
                  {/* Inner square */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ 
                      duration: 6,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-9 border-4 border-osslt-light-purple rounded-lg"
                  />
                  
                  {/* Center square */}
                  <motion.div
                    initial={{ rotate: 0 }}
                    animate={{ rotate: -360 }}
                    transition={{ 
                      duration: 4,
                      repeat: Infinity,
                      ease: "linear"
                    }}
                    className="absolute inset-12 border-4 border-osslt-purple rounded-lg"
                  />
                </div>

                {/* Text content */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeSlogan}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center w-full max-w-md"
                  >
                    <h2 className="text-xl font-bold text-osslt-dark-gray mb-4 whitespace-nowrap">
                      {slogans[activeSlogan]}
                    </h2>
                    <p className="text-gray-600">
                      Join our community of learners and start your journey to success
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Right side - Demo login buttons */}
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-2xl font-bold text-center mb-5">ScratchSSLT</h2>
            <p className="text-gray-600 text-center mb-5">
              Prepare for the Ontario Secondary School Literacy Test with interactive practice exercises and comprehensive learning tools.
            </p>
            
            <Tabs defaultValue="demo" className="w-full">
              <TabsContent value="demo">
                <div className="space-y-4">
                  <Button onClick={handleGoogle} className="w-full bg-osslt-purple hover:bg-osslt-dark-purple">
                    <Mail className="w-4 h-4 mr-2" /> Continue with Google 
                  </Button>
                  <p className="text-xs text-center text-gray-500 mt-4">Secure authentication powered by Supabase</p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
