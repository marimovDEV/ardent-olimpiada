import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage";
import LessonView from "./pages/LessonView";
import OlympiadsPage from "./pages/OlympiadsPage";
import OlympiadDetailPage from "./pages/OlympiadDetailPage";
import TestPage from "./pages/TestPage";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLayout from "./components/AdminLayout";
import AdminUsersPage from "./pages/admin/AdminUsersPage";
import AdminCoursesPage from "./pages/admin/AdminCoursesPage";

import AdminOlympiadsPage from "./pages/admin/AdminOlympiadsPage";
import AdminFinancePage from "./pages/admin/AdminFinancePage";
import AdminSupportPage from "./pages/admin/AdminSupportPage";
import AdminSettingsPage from "./pages/admin/AdminSettingsPage";
import AdminCertificatesPage from "./pages/admin/AdminCertificatesPage";
import CertificateVerify from "./pages/CertificateVerify";
import ResultsPage from "./pages/ResultsPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./components/DashboardLayout";
import PublicWinnersPage from "./pages/PublicWinnersPage";
import PublicOlympiadsPage from "./pages/PublicOlympiadsPage";
import PublicCoursesPage from "./pages/PublicCoursesPage";
import SubjectsPage from "./pages/SubjectsPage";
import AboutPage from "./pages/AboutPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/auth/login" element={<AuthPage mode="login" />} />
          <Route path="/auth/register" element={<AuthPage mode="register" />} />
          <Route path="/auth/recover" element={<AuthPage mode="recover" />} />
          <Route path="/auth" element={<Navigate to="/auth/login" replace />} />


          <Route path="/winners" element={<PublicWinnersPage />} />
          <Route path="/all-olympiads" element={<PublicOlympiadsPage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/all-courses" element={<PublicCoursesPage />} />
          <Route path="/about" element={<AboutPage />} />

          {/* Dashboard Layout Routes */}
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/course/:id" element={<CourseDetailPage />} />
            <Route path="/olympiads" element={<OlympiadsPage />} />
            <Route path="/olympiad/:id" element={<OlympiadDetailPage />} />
            <Route path="/results" element={<ResultsPage />} />
          </Route>

          <Route path="/course/:id/lesson/:lessonId" element={<LessonView />} />
          <Route path="/test" element={<TestPage />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboard />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="courses" element={<AdminCoursesPage />} />
            <Route path="olympiads" element={<AdminOlympiadsPage />} />
            <Route path="finance" element={<AdminFinancePage />} />
            <Route path="support" element={<AdminSupportPage />} />
            <Route path="certificates" element={<AdminCertificatesPage />} />
            <Route path="settings" element={<AdminSettingsPage />} />
            {/* Redirect /admin to /admin/dashboard */}
            <Route index element={<AdminDashboard />} />
          </Route>

          <Route path="/verify/:id" element={<CertificateVerify />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
