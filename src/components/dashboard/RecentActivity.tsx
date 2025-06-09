
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { CalendarClock, MapPin, Star, Heart } from 'lucide-react';
import { userActivityService, type UserActivity } from '@/services/user-activities';
import { Loader } from '@/components/Loader';

const ACTIVITY_ICONS = {
  'booking': CalendarClock,
  'save': Heart,
  'review': Star,
  'default': MapPin
};

const RecentActivity = () => {
  const [activities, setActivities] = useState<UserActivity[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchActivities = async () => {
      setIsLoading(true);
      try {
        const data = await userActivityService.getCurrentUserActivities();
        setActivities(data);
      } catch (error) {
        console.error('Error fetching activities:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  if (isLoading) {
    return <Loader />;
  }

  if (activities.length === 0) {
    return <p className="text-gray-500 dark:text-gray-400">No recent activity</p>;
  }

  return (
    <motion.div 
      className="space-y-4"
      variants={container}
      initial="hidden"
      animate="show"
    >
      {activities.map((activity) => {
        const IconComponent = ACTIVITY_ICONS[activity.type as keyof typeof ACTIVITY_ICONS] || ACTIVITY_ICONS.default;
        
        return (
          <motion.div 
            key={activity.id} 
            className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors duration-200"
            variants={item}
            whileHover={{ x: 5, backgroundColor: "rgba(249, 250, 251, 0.8)" }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <div className="p-2 rounded-full bg-gradient-to-br from-twende-teal to-twende-skyblue/70 dark:from-twende-skyblue dark:to-twende-teal/70 text-white shadow-sm">
              <IconComponent className="h-4 w-4" />
            </div>
            <div>
              <p className="text-sm font-medium dark:text-white">{activity.text}</p>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {new Date(activity.time).toLocaleDateString()}
              </p>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default RecentActivity;
