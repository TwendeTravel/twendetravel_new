import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
// ...existing code...
// Removed Supabase import; using AuthContext login
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';
import PageTransition from '@/components/PageTransition';
import { useAuth } from '@/contexts/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { login, user } = useAuth();
  
  useEffect(() => {
    if (user) {
      // After login, always go to unified dashboard (role-based view)
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate, location]);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      // After login, always redirect to dashboard
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Login failed';
      setError(message);
      toast({
        variant: 'destructive',
        title: 'Login failed',
        description: message,
      });
    }
  };
  
  return (
    <PageTransition>
      <div className="min-h-screen flex flex-col md:flex-row">
        <div className="hidden md:block md:w-1/2 bg-cover bg-center bg-no-repeat relative overflow-hidden" 
          style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=1200&q=80)' }}>
          <div className="absolute inset-0 bg-gradient-to-r from-twende-teal/90 to-twende-teal/60"></div>
          
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute -top-10 -left-10 w-40 h-40 rounded-full bg-white/10"
              animate={{
                x: [0, 30, 0],
                y: [0, 50, 0],
              }}
              transition={{
                duration: 20,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute top-1/4 -right-20 w-80 h-80 rounded-full bg-twende-orange/20"
              animate={{
                x: [0, -40, 0],
                y: [0, 60, 0],
              }}
              transition={{
                duration: 25,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-10 left-20 w-60 h-60 rounded-full bg-white/5"
              animate={{
                x: [0, 50, 0],
                y: [0, -30, 0],
              }}
              transition={{
                duration: 18,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="absolute top-1/3 left-1/3 w-4 h-4 rounded-full bg-white/40"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.7, 0.2, 0.7],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div
              className="absolute top-2/3 right-1/4 w-3 h-3 rounded-full bg-white/30"
              animate={{
                scale: [1, 1.8, 1],
                opacity: [0.5, 0.1, 0.5],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 1
              }}
            />
            <motion.div
              className="absolute bottom-1/4 left-1/4 w-5 h-5 rounded-full bg-white/20"
              animate={{
                scale: [1, 1.6, 1],
                opacity: [0.6, 0.2, 0.6],
              }}
              transition={{
                duration: 5,
                repeat: Infinity,
                repeatType: "reverse",
                delay: 2
              }}
            />
          </div>
          
          <div className="absolute inset-0 flex items-center justify-center p-12 z-10">
            <motion.div 
              className="text-white max-w-md"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
            >
              <h2 className="text-4xl font-bold mb-4">Welcome Back</h2>
              <p className="text-white/90 mb-6">
                Sign in to access your Twende Travel account and manage your upcoming adventures.
              </p>
              <div className="flex space-x-3">
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse" }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white/50"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 0.5 }}
                />
                <motion.div 
                  className="w-2 h-2 rounded-full bg-white/50"
                  animate={{ scale: [1, 1.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity, repeatType: "reverse", delay: 1 }}
                />
              </div>
            </motion.div>
          </div>
        </div>
        
        <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-800">
          <motion.div 
            className="w-full max-w-md glass-card dark:dark-card p-8 rounded-2xl backdrop-blur-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <Link to="/" className="inline-block">
                <motion.span 
                  className="text-3xl font-bold font-montserrat text-twende-teal dark:text-twende-skyblue"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  Twende<span className="text-twende-orange">Travel</span>
                </motion.span>
              </Link>
            </div>
            
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">Sign In</h2>
              <p className="text-gray-600 dark:text-gray-300">
                Don't have an account? <Link to="/signup" className="text-twende-teal dark:text-twende-skyblue hover:underline">Create one</Link>
              </p>
            </div>
            
            {error && (
              <motion.div 
                className="mb-6 p-3 bg-red-50 border border-red-200 rounded-md flex items-start dark:bg-red-900/20 dark:border-red-800"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
              >
                <AlertCircle className="text-red-500 mt-0.5 mr-2 flex-shrink-0" size={16} />
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </motion.div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    id="email"
                    type="email"
                    className="input-field pl-10 transition-all duration-200 focus:ring-twende-teal dark:focus:ring-twende-skyblue dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Password
                  </label>
                  <Link to="/forgot-password" className="text-sm text-twende-teal dark:text-twende-skyblue hover:underline">
                    Forgot password?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500" size={18} />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    className="input-field pl-10 pr-10 transition-all duration-200 focus:ring-twende-teal dark:focus:ring-twende-skyblue dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:text-gray-500 dark:hover:text-gray-300"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
              
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  className="h-4 w-4 text-twende-teal focus:ring-twende-teal border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                  Remember me
                </label>
              </div>
              
              <div>
                <motion.button
                  type="submit"
                  className="btn-primary w-full py-3 relative overflow-hidden"
                  // disabled={isLoading}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  {/* {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Signing In...
                    </span>
                  ) : ( */}
                    Sign In
                  {/* )} */}
                </motion.button>
              </div>
            </form>
            
            <div className="mt-8">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300 dark:border-gray-700"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 dark:bg-gray-800 dark:text-gray-400">Or continue with</span>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-2 gap-3">
                <motion.button
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(249, 250, 251, 1)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'google',
                        options: {
                          redirectTo: `${window.location.origin}/dashboard`,
                        },
                      });
                      if (error) throw error;
                    } catch (err) {
                      console.error('Google login error:', err);
                      toast({
                        variant: "destructive",
                        title: "Google login failed",
                        description: "Failed to login with Google. Please try again.",
                      });
                    }
                  }}
                >
                  <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12.545 10.239v3.821h5.445c-.712 2.315-2.647 3.972-5.445 3.972-3.332 0-6.033-2.701-6.033-6.032s2.701-6.032 6.033-6.032c1.498 0 2.866.554 3.921 1.465l2.814-2.814A9.996 9.996 0 0 0 12.545 2C7.021 2 2.543 6.477 2.543 12s4.478 10 10.002 10c8.396 0 10.249-7.85 9.426-11.748l-9.426-.013z" />
                  </svg>
                  Google
                </motion.button>
                <motion.button
                  type="button"
                  className="flex justify-center items-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-700 hover:bg-gray-50 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 dark:hover:bg-gray-700"
                  whileHover={{ scale: 1.03, backgroundColor: "rgba(249, 250, 251, 1)" }}
                  whileTap={{ scale: 0.97 }}
                  transition={{ type: "spring", stiffness: 400, damping: 17 }}
                  onClick={async () => {
                    try {
                      const { error } = await supabase.auth.signInWithOAuth({
                        provider: 'facebook',
                        options: {
                          redirectTo: `${window.location.origin}/dashboard`,
                        },
                      });
                      if (error) throw error;
                    } catch (err) {
                      console.error('Facebook login error:', err);
                      toast({
                        variant: "destructive",
                        title: "Facebook login failed",
                        description: "Failed to login with Facebook. Please try again.",
                      });
                    }
                  }}
                >
                  <svg className="h-5 w-5 mr-2" aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                  Facebook
                </motion.button>
              </div>
            </div>
            
            <div className="mt-8 text-center text-sm text-gray-600 dark:text-gray-400">
              <p>By signing in, you agree to our <a href="/terms" className="text-twende-teal dark:text-twende-skyblue hover:underline">Terms of Service</a> and <a href="/privacy" className="text-twende-teal dark:text-twende-skyblue hover:underline">Privacy Policy</a>.</p>
            </div>
          </motion.div>
        </div>
      </div>
    </PageTransition>
  );
};

export default Login;
