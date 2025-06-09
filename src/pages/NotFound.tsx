
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";
import PageTransition from "@/components/PageTransition";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <PageTransition>
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4 dark:bg-gray-900">
        <div className="max-w-md w-full text-center">
          <div className="mb-8">
            <span className="inline-block text-6xl font-bold text-twende-teal animate-floating dark:text-twende-skyblue">404</span>
          </div>
          <h1 className="text-3xl font-bold mb-2 text-gray-800 dark:text-white">Page Not Found</h1>
          <p className="text-gray-600 mb-8 dark:text-gray-300">
            The page you're looking for doesn't exist or has been moved.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              to="/"
              className="btn-primary flex items-center justify-center"
            >
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Link>
            <button 
              onClick={() => window.history.back()}
              className="flex items-center justify-center px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600"
            >
              <ArrowLeft className="mr-2 h-5 w-5" />
              Go Back
            </button>
          </div>
        </div>
      </div>
    </PageTransition>
  );
};

export default NotFound;
