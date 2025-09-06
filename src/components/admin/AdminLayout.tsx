import { ReactNode, useEffect } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AdminSidebar } from "./AdminSidebar";
import { Button } from "@/components/ui/button";
import { Home, LogOut, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAdminAuth } from "@/contexts/AdminAuthContext";

interface AdminLayoutProps {
  children: ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const { logout } = useAdminAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const getPageTitle = (pathname: string) => {
    switch (pathname) {
      case '/admin':
        return 'Dashboard';
      case '/admin/drinks':
        return 'Drinks';
      case '/admin/news':
        return 'News';
      case '/admin/settings':
        return 'Settings';
      default:
        return 'Admin Panel';
    }
  };

  const handleGoBack = () => {
    if (location.pathname === '/admin') {
      // If we're on dashboard, go to main site
      navigate('/');
    } else {
      // Otherwise go back to dashboard
      navigate('/admin');
    }
  };

  // Auto logout after 30 minutes of inactivity
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const resetTimeout = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        logout();
      }, 30 * 60 * 1000); // 30 minutes
    };

    const events = ['mousedown', 'mousemove', 'keypress', 'scroll', 'touchstart'];
    
    events.forEach((event) => {
      document.addEventListener(event, resetTimeout, true);
    });

    resetTimeout();

    return () => {
      clearTimeout(timeout);
      events.forEach((event) => {
        document.removeEventListener(event, resetTimeout, true);
      });
    };
  }, [logout]);

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        {/* Header */}
        <header className="fixed top-0 right-0 left-0 z-50 h-14 flex items-center justify-between bg-background border-b px-4">
          <div className="flex items-center gap-4">
            <SidebarTrigger />
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={handleGoBack}
              className="p-1"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h2 className="text-lg font-semibold text-foreground">
              {getPageTitle(location.pathname)}
            </h2>
          </div>
          
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" asChild>
              <Link to="/">
                <Home className="h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="sm" onClick={logout}>
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <AdminSidebar />
        <main className="flex-1 overflow-auto pt-14">
          <div className="container mx-auto p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}