
import { Compass } from 'lucide-react';

interface LoaderProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const Loader = ({ message = 'Loading Twende Travel...', size = 'md' }: LoaderProps) => {
  const sizeClasses = {
    sm: 'text-twende-teal',
    md: 'text-twende-teal',
    lg: 'text-twende-teal',
  };

  const iconSizes = {
    sm: 32,
    md: 48,
    lg: 64,
  };

  return (
    <div className="fixed inset-0 bg-white bg-opacity-70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
      <div className="animate-spin-slow text-twende-teal">
        <Compass size={iconSizes[size]} />
      </div>
      <p className="mt-4 text-twende-teal font-medium font-montserrat">{message}</p>
    </div>
  );
};

// Also provide as default export for backward compatibility
export default Loader;
