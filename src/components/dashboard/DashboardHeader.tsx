
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { 
  Bell, 
  Search, 
  User, 
  Settings, 
  LogOut, 
  Menu,
  MessageSquare,
  X,
  Home,
  Map as MapIcon,
  Calendar,
  BookOpen
} from 'lucide-react';

import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from '@/components/ThemeToggle';

const DashboardHeader = () => {
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSignOut = async () => {
    await signOut();
    navigate('/?logged_out=true', { replace: true });
  };

  const userName = user?.user_metadata?.name || 'User';
  const userInitial = userName.charAt(0).toUpperCase();
  const userEmail = user?.email || '';

  return (
    <header className="sticky top-0 z-50 bg-card/80 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo & Navigation */}
          <div className="flex items-center">
            <button 
              onClick={() => setShowMobileMenu(!showMobileMenu)}
              className="mr-3 md:hidden text-foreground hover:bg-muted rounded-lg p-2"
            >
              {showMobileMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
            
            <Link to="/" className="flex items-center">
              <span className="text-xl font-bold text-twende-teal dark:text-twende-skyblue">Twende
                <span className="text-twende-orange">Travel</span>
              </span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-2 md:space-x-4">
            {/* Search - Hidden on mobile */}
            <div className="hidden md:flex relative">
              <input
                type="text"
                placeholder="Search destinations..."
                className="bg-muted text-muted-foreground pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-twende-teal/50 dark:focus:ring-twende-skyblue/50 w-48 lg:w-64"
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
            </div>
            
            {/* Mobile Actions */}
            <div className="flex items-center space-x-2">
              <button onClick={() => navigate('/chat')} className="md:hidden p-2 rounded-full hover:bg-muted transition">
                <MessageSquare className="text-muted-foreground" size={20} />
              </button>
              
              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center">
                    <Avatar className="h-8 w-8 md:h-9 md:w-9 cursor-pointer ring-1 ring-border">
                      <AvatarImage src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?fit=crop&w=80&h=80" />
                      <AvatarFallback className="bg-twende-teal text-white dark:bg-twende-skyblue dark:text-black">
                        {user?.user_metadata?.name?.charAt(0) || user?.email?.charAt(0) || 'U'}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                
                <DropdownMenuContent align="end" className="w-56 bg-card border border-border text-foreground">
                  <div className="p-2 border-b border-border">
                    <p className="font-medium">{user?.user_metadata?.name || user?.email?.split('@')[0] || 'User'}</p>
                    <p className="text-xs text-muted-foreground">{user?.email}</p>
                  </div>
                  
                  <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={() => navigate('/profile')}>
                    <User className="mr-2" size={16} />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem className="hover:bg-muted cursor-pointer" onClick={() => navigate('/settings')}>
                    <Settings className="mr-2" size={16} />
                    <span>Settings</span>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator className="bg-border" />
                  
                  <DropdownMenuItem className="hover:bg-muted cursor-pointer text-red-400" onClick={handleSignOut}>
                    <LogOut className="mr-2" size={16} />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
        
        {/* Mobile Menu */}
        {showMobileMenu && (
          <div className="fixed inset-0 top-[57px] z-50 bg-background/95 backdrop-blur-sm">
            <nav className="flex flex-col p-4 space-y-4">
              <Link to="/dashboard" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <Home size={20} className="text-twende-teal dark:text-twende-skyblue" />
                <span>Dashboard</span>
              </Link>
              <Link to="/destination" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <MapIcon size={20} className="text-twende-teal dark:text-twende-skyblue" />
                <span>Destinations</span>
              </Link>
              <Link to="/trip" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <Calendar size={20} className="text-twende-teal dark:text-twende-skyblue" />
                <span>My Trips</span>
              </Link>
              <Link to="/assistant" className="flex items-center space-x-2 p-3 rounded-lg hover:bg-muted">
                <BookOpen size={20} className="text-twende-teal dark:text-twende-skyblue" />
                <span>Travel Assistant</span>
              </Link>
              
              <div className="relative mt-2 mx-3">
                <input
                  type="text"
                  placeholder="Search destinations..."
                  className="w-full bg-muted text-muted-foreground pl-10 pr-4 py-2 rounded-lg border border-border focus:outline-none focus:ring-1 focus:ring-twende-teal/50 dark:focus:ring-twende-skyblue/50"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
};

export default DashboardHeader;
