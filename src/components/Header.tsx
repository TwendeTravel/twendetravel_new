
import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';
import { useAuth } from '@/contexts/AuthContext';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleSignOut = async () => {
    try {
      await logout();
      navigate('/', { replace: true });
    } catch (error) {
      console.error('Error during sign out:', error);
    }
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-white/95 dark:bg-gray-900/95 backdrop-blur-md shadow-md py-3'
          : 'bg-transparent py-5'
      }`}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <span className={`text-2xl font-bold transition-colors duration-300 ${
            isScrolled
              ? 'text-twende-teal dark:text-twende-skyblue'
              : 'text-white'
          }`}>
            Twende<span className="text-twende-orange">Travel</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link
            to="/"
            className={`text-sm font-medium transition-colors hover:text-twende-teal ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white/90 hover:text-white'
            }`}
          >
            Home
          </Link>
          <Link
            to="/service-request"
            className={`text-sm font-medium transition-colors hover:text-twende-teal ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white/90 hover:text-white'
            }`}
          >
            Plan My Trip
          </Link>
          <Link
            to="/destinations"
            className={`text-sm font-medium transition-colors hover:text-twende-teal ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white/90 hover:text-white'
            }`}
          >
            Destinations
          </Link>
          <Link
            to="/about"
            className={`text-sm font-medium transition-colors hover:text-twende-teal ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white/90 hover:text-white'
            }`}
          >
            About Us
          </Link>
          <Link
            to="/chat"
            className={`text-sm font-medium transition-colors hover:text-twende-teal ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white/90 hover:text-white'
            }`}
          >
            24/7 Support
          </Link>
        </nav>

        {/* Right Side - Auth Buttons */}
        <div className="hidden md:flex items-center space-x-4">
          <ThemeToggle />
          
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className={`flex items-center space-x-2 p-1 rounded-full ${
                    isScrolled ? 'hover:bg-gray-100 dark:hover:bg-gray-800' : 'hover:bg-white/10'
                  }`}
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage 
                      src={user.photoURL || ''} 
                      alt={user.displayName || user.email || 'User'} 
                    />
                    <AvatarFallback className="bg-twende-teal text-white text-sm">
                      {user.displayName ? user.displayName.charAt(0).toUpperCase() : 
                       user.email ? user.email.charAt(0).toUpperCase() : 'U'}
                    </AvatarFallback>
                  </Avatar>
                  <span className={`hidden sm:inline text-sm ${
                    isScrolled ? 'text-gray-800 dark:text-gray-200' : 'text-white'
                  }`}>
                    {user.displayName || user.email?.split('@')[0]}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                  My Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/profile')}>
                  Profile Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/dashboard?tab=my-trips')}>
                  My Trips
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/dashboard?tab=new-request')}>
                  New Request
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/chat')}>
                  24/7 Support
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button
                onClick={() => navigate('/login')}
                variant="outline"
                className={`border-twende-teal text-twende-teal hover:bg-twende-teal/10 ${
                  isScrolled ? '' : 'border-white/80 text-white hover:bg-white/10'
                }`}
              >
                Log In
              </Button>
              <Button
                onClick={() => navigate('/signup')}
                className="bg-twende-teal hover:bg-twende-teal/90 text-white"
              >
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile menu button */}
        <div className="md:hidden flex items-center space-x-4">
          <ThemeToggle />
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`p-2 rounded-full ${
              isScrolled
                ? 'text-gray-800 dark:text-gray-200'
                : 'text-white'
            }`}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
          <div className="container mx-auto px-4 py-4 space-y-4">
            <Link
              to="/"
              className="block text-gray-800 dark:text-gray-200 hover:text-twende-teal py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/service-request"
              className="block text-gray-800 dark:text-gray-200 hover:text-twende-teal py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Plan My Trip
            </Link>
            <Link
              to="/destinations"
              className="block text-gray-800 dark:text-gray-200 hover:text-twende-teal py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              Destinations
            </Link>
            <Link
              to="/about"
              className="block text-gray-800 dark:text-gray-200 hover:text-twende-teal py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              About Us
            </Link>
            <Link
              to="/chat"
              className="block text-gray-800 dark:text-gray-200 hover:text-twende-teal py-2"
              onClick={() => setMobileMenuOpen(false)}
            >
              24/7 Support
            </Link>
            
            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
              {user ? (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    Signed in as {user.email}
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      onClick={() => {
                        navigate('/dashboard');
                        setMobileMenuOpen(false);
                      }}
                      className="w-full bg-twende-teal hover:bg-twende-teal/90 text-white"
                    >
                      Dashboard
                    </Button>
                    <Button
                      onClick={() => {
                        handleSignOut();
                        setMobileMenuOpen(false);
                      }}
                      variant="outline"
                      className="w-full border-twende-teal text-twende-teal hover:bg-twende-teal/10"
                    >
                      Sign Out
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col space-y-2">
                  <Button
                    onClick={() => {
                      navigate('/login');
                      setMobileMenuOpen(false);
                    }}
                    variant="outline"
                    className="w-full border-twende-teal text-twende-teal hover:bg-twende-teal/10"
                  >
                    Log In
                  </Button>
                  <Button
                    onClick={() => {
                      navigate('/signup');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-twende-teal hover:bg-twende-teal/90 text-white"
                  >
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
