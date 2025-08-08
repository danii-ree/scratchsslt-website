import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { MainNav } from "./components/MainNav";
import { RootRedirect } from "./components/RootRedirect";
import Index from "./pages/Index";
import Practice from "./pages/Practice";
import LibraryProgress from "./pages/Library-progress";
import Create from "./pages/Create";
import Profile from "./pages/Profile";
import PracticeDetail from "./pages/PracticeDetail";
import NotFound from "./pages/NotFound";
import Auth from "./pages/Auth";
import LoginPage from "./app/(auth)/login/LoginPage";
import RegisterPage from "./app/(auth)/register/RegisterPage";
import { ProtectedRoute } from "./components/ProtectedRoute";

const queryClient = new QueryClient();

// Main App component with routing
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

// App content with conditional navbar
const AppContent = () => {
  const location = useLocation();
  const isAuthPage = ["/", "/auth", "/login", "/register"].includes(location.pathname);

  return (
    <>
      {!isAuthPage && <MainNav currentPath={location.pathname} />}
      <Routes>
        <Route path="/" element={<RootRedirect />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/home"
          element={
            <ProtectedRoute>
              <Index />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice"
          element={
            <ProtectedRoute>
              <Practice />
            </ProtectedRoute>
          }
        />
        <Route
          path="/practice/:id"
          element={
            <ProtectedRoute>
              <PracticeDetail />
            </ProtectedRoute>
          }
        />
        <Route
          path="/library"
          element={
            <ProtectedRoute>
              <LibraryProgress />
            </ProtectedRoute>
          }
        />
        <Route
          path="/create"
          element={
            <ProtectedRoute>
              <Create />
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
};

export default App;
