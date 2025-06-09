
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Newspaper, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

interface CountryNewsWidgetProps {
  country?: string;
  limit?: number;
}

// Sample news data for the widget
const sampleNewsData = {
  "ghana": [
    {
      id: 1,
      title: "Ghana celebrates 65 years of independence",
      summary: "The West African nation marks its 65th independence anniversary.",
      date: "2 days ago",
    },
    {
      id: 2,
      title: "New eco-tourism initiative launched in Ghana",
      summary: "A sustainable tourism program aims to protect Ghana's forests.",
      date: "1 week ago",
    }
  ],
  "kenya": [
    {
      id: 1,
      title: "Kenya hosts wildlife conservation conference",
      summary: "Experts gather to discuss protecting endangered species.",
      date: "5 days ago",
    },
    {
      id: 2,
      title: "Drought concerns ease after rainfall",
      summary: "Recent precipitation brings relief to northern regions.",
      date: "1 week ago",
    }
  ],
  "south africa": [
    {
      id: 1,
      title: "Cape Town named top cultural destination",
      summary: "International recognition for the city's cultural offerings.",
      date: "1 week ago",
    },
    {
      id: 2,
      title: "Mild winter predicted for coastal regions",
      summary: "Warmer than average temperatures expected this season.",
      date: "3 days ago",
    }
  ]
};

const CountryNewsWidget = ({ country = "ghana", limit = 2 }: CountryNewsWidgetProps) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  
  // Format country name for routing
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const displayCountryName = country.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    // Simulate API call with a delay
    const fetchNewsData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          const newsItems = sampleNewsData[country.toLowerCase() as keyof typeof sampleNewsData] || 
                         sampleNewsData.ghana;
          setNews(newsItems.slice(0, limit));
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [country, limit]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15
      }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { 
      opacity: 1, 
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Newspaper className="h-5 w-5 text-twende-orange" />
          {displayCountryName} News
        </CardTitle>
        <CardDescription>Latest travel updates</CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-4">
            {[1, 2].map(i => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-5 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
                <Skeleton className="h-3 w-1/4" />
              </div>
            ))}
          </div>
        ) : (
          <motion.div 
            className="space-y-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {news.map(item => (
              <motion.div 
                key={item.id} 
                className="border-b border-gray-100 dark:border-gray-800 pb-3 last:border-0 last:pb-0"
                variants={itemVariants}
              >
                <h3 className="font-medium text-sm mb-1">{item.title}</h3>
                <p className="text-gray-500 dark:text-gray-400 text-xs mb-1">{item.summary}</p>
                <div className="flex items-center text-xs text-gray-400">
                  <Clock className="h-3 w-3 mr-1" />
                  {item.date}
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </CardContent>
      <CardFooter>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full justify-between"
          asChild
        >
          <Link to={`/country-news/${countrySlug}`}>
            <span>View all news</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default CountryNewsWidget;
