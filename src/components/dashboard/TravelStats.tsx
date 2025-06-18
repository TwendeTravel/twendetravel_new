import { useEffect, useState } from 'react';
import { userStatsService, type UserStats } from '@/services/user-stats';
import { Loader } from '@/components/Loader';

const TravelStats = () => {
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await userStatsService.getCurrentUserStats();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  if (!stats) {
    return <p className="text-muted-foreground">No stats available</p>;
  }

  // Display only available stats
  const statsList = [
    { label: 'Total Requests', value: stats.total_requests ?? 0 },
    { label: 'Unique Origins', value: stats.unique_origins ?? 0 },
    { label: 'Unique Destinations', value: stats.unique_destinations ?? 0 }
  ];

  return (
    <div className="grid grid-cols-3 gap-4">
      {statsList.map((item) => (
        <div key={item.label} className="bg-muted/50 p-4 rounded-lg text-center">
          <p className="text-sm text-muted-foreground">{item.label}</p>
          <p className="text-2xl font-bold text-foreground">{item.value}</p>
        </div>
      ))}
    </div>
  );
};

export default TravelStats;
