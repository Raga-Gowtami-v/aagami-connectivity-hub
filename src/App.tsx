
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import RoleSelection from "./pages/RoleSelection";
import StudentDashboard from "./pages/StudentDashboard";
import PathguiderDashboard from "./pages/PathguiderDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import RequestService from "./pages/student/RequestService";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/role-selection" element={<RoleSelection />} />
            <Route path="/student-dashboard" element={<StudentDashboard />} />
            <Route path="/student-dashboard/request-service" element={<RequestService />} />
            <Route path="/student-dashboard/*" element={<StudentDashboard />} />
            <Route path="/pathguider-dashboard" element={<PathguiderDashboard />} />
            <Route path="/pathguider-dashboard/*" element={<PathguiderDashboard />} />
            <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
            <Route path="/teacher-dashboard/*" element={<TeacherDashboard />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
