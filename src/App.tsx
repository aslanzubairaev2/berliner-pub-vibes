import React from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { LanguageProvider } from "./contexts/LanguageContext";
import { AdminAuthProvider } from "./contexts/AdminAuthContext";
import Layout from "./components/Layout";
import { AdminLayout } from "./components/admin/AdminLayout";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import News from "./pages/News";
import NewsDetail from "./pages/NewsDetail";
import Reviews from "./pages/Reviews";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminDrinks from "./pages/admin/AdminDrinks";
import AdminNews from "./pages/admin/AdminNews";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminAnalytics from "./pages/admin/AdminAnalytics";
import { useAdminAuth } from "./contexts/AdminAuthContext";

const queryClient = new QueryClient();

// Protected Admin Route Component
const ProtectedAdminRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAdminAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-accent mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <AdminLogin />;
  }
  
  return <AdminLayout>{children}</AdminLayout>;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AdminAuthProvider>
      <LanguageProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/menu" element={<Layout><Menu /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/news" element={<Layout><News /></Layout>} />
            <Route path="/news/:slug" element={<Layout><NewsDetail /></Layout>} />
            <Route path="/reviews" element={<Layout><Reviews /></Layout>} />
            <Route path="/contact" element={<Layout><Contact /></Layout>} />
            
            {/* Admin Routes */}
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/admin" element={
              <ProtectedAdminRoute>
                <AdminDashboard />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/drinks" element={
              <ProtectedAdminRoute>
                <AdminDrinks />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/news" element={
              <ProtectedAdminRoute>
                <AdminNews />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/settings" element={
              <ProtectedAdminRoute>
                <AdminSettings />
              </ProtectedAdminRoute>
            } />
            <Route path="/admin/analytics" element={
              <ProtectedAdminRoute>
                <AdminAnalytics />
              </ProtectedAdminRoute>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<Layout><NotFound /></Layout>} />
          </Routes>
        </BrowserRouter>
      </LanguageProvider>
    </AdminAuthProvider>
  </QueryClientProvider>
);

export default App;
