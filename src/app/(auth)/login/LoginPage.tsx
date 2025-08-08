import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export default function LoginPage() {
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // If already authenticated, go straight to home
    (async () => {
      const { data } = await supabase.auth.getSession();
      if (data.session) {
        window.location.replace("/home");
      }
    })();
  }, []);

  const handleGoogle = async () => {
    try {
      setLoading(true);
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/home`,
          queryParams: { access_type: 'offline', prompt: 'consent' }
        }
      });
      if (error) throw error;
      // Redirect happens automatically by Supabase
    } catch (err) {
      console.error(err);
      toast.error('Google sign-in failed');
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col justify-center items-center bg-gradient-to-br from-white to-gray-100 p-4">
      <div className="w-full max-w-md">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-xl rounded-2xl p-8 border border-osslt-purple/20"
        >
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-osslt-purple mb-2">Sign in</h1>
            <p className="text-gray-500">Use your Google account</p>
          </div>

          <Button onClick={handleGoogle} disabled={loading} className="w-full h-10">
            {loading ? 'Redirecting...' : 'Continue with Google'}
          </Button>
        </motion.div>
      </div>
    </div>
  );
}