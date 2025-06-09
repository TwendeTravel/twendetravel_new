
import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
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

  const tripTypes = [
    { name: 'Leisure', value: stats.leisure_trips_percent || 0, color: '#1A5F7A' },
    { name: 'Business', value: stats.business_trips_percent || 0, color: '#FF7F50' },
    { name: 'Family', value: stats.family_trips_percent || 0, color: '#4D724D' },
  ];

  const destinations = [
    { name: 'Ghana', value: stats.ghana_trips_percent || 0, color: '#1A5F7A' },
    { name: 'Kenya', value: stats.kenya_trips_percent || 0, color: '#FF7F50' },
    { name: 'Other', value: stats.other_trips_percent || 0, color: '#F2D2BD' },
  ];

  const statsDisplay = [
    { label: 'Countries', value: stats.countries_visited?.toString() || '0' },
    { label: 'Cities', value: stats.cities_visited?.toString() || '0' },
    { label: 'Total Trips', value: stats.total_trips?.toString() || '0' },
    { label: 'Days Traveled', value: stats.days_traveled?.toString() || '0' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 gap-4">
        {statsDisplay.map((stat) => (
          <div key={stat.label} className="bg-muted/50 p-3 rounded-lg">
            <p className="text-sm text-muted-foreground">{stat.label}</p>
            <p className="text-xl font-bold text-foreground">{stat.value}</p>
          </div>
        ))}
      </div>
      
      <div className="flex justify-between items-start gap-4">
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Trip Types</h4>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={tripTypes}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                >
                  {tripTypes.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {tripTypes.map((type) => (
              <div key={type.name} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: type.color }}
                ></div>
                <span className="text-muted-foreground">{type.name}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="flex-1">
          <h4 className="text-sm font-medium mb-2 text-muted-foreground">Destinations</h4>
          <div className="h-24">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={destinations}
                  cx="50%"
                  cy="50%"
                  innerRadius={25}
                  outerRadius={40}
                  dataKey="value"
                >
                  {destinations.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value}%`} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="flex justify-center gap-4 text-xs">
            {destinations.map((dest) => (
              <div key={dest.name} className="flex items-center">
                <div 
                  className="w-3 h-3 mr-1 rounded-full" 
                  style={{ backgroundColor: dest.color }}
                ></div>
                <span className="text-muted-foreground">{dest.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TravelStats;
