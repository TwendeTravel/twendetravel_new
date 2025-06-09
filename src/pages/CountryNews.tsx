
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { 
  Globe, 
  AlertTriangle, 
  Sun, 
  DollarSign, 
  Clock, 
  Newspaper,
  ArrowLeft 
} from "lucide-react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

// Mock news data - in a real app, this would come from an API
const mockNewsData = {
  "ghana": {
    "general": [
      {
        id: 1,
        title: "Ghana celebrates 65 years of independence",
        summary: "The West African nation marks its 65th independence anniversary with cultural displays and parades.",
        source: "Global News Network",
        date: "2 days ago",
        url: "#"
      },
      {
        id: 2,
        title: "New eco-tourism initiative launched in Ghana",
        summary: "A sustainable tourism program aims to protect Ghana's forest reserves while boosting local economy.",
        source: "Travel Weekly",
        date: "1 week ago",
        url: "#"
      }
    ],
    "weather": [
      {
        id: 1,
        title: "Seasonal rains arrive early in Accra",
        summary: "Meteorologists predict heavier than usual rainfall across coastal regions this month.",
        source: "Weather Update",
        date: "3 days ago",
        url: "#"
      }
    ],
    "safety": [
      {
        id: 1,
        title: "Ghana maintains strong safety record for tourists",
        summary: "The country continues to be one of the safer destinations in West Africa according to international reports.",
        source: "Travel Advisory Network",
        date: "1 month ago",
        url: "#"
      }
    ],
    "cost": [
      {
        id: 1,
        title: "Cost of living remains stable in major cities",
        summary: "Despite global inflation, Ghana's urban centers show moderate price increases in accommodation and dining.",
        source: "Economic Times",
        date: "2 weeks ago",
        url: "#"
      }
    ]
  },
  "kenya": {
    "general": [
      {
        id: 1,
        title: "Kenya hosts international wildlife conservation conference",
        summary: "Experts gather in Nairobi to discuss strategies for protecting endangered species in East Africa.",
        source: "Wildlife Today",
        date: "5 days ago",
        url: "#"
      }
    ],
    "weather": [
      {
        id: 1,
        title: "Drought concerns ease after rainfall in northern regions",
        summary: "Recent precipitation brings relief to farmers and wildlife in previously dry areas.",
        source: "Climate Monitor",
        date: "1 week ago",
        url: "#"
      }
    ],
    "safety": [
      {
        id: 1,
        title: "Enhanced security measures implemented at popular tourist sites",
        summary: "Authorities increase presence at national parks and cultural landmarks to ensure visitor safety.",
        source: "Tourism Weekly",
        date: "2 weeks ago",
        url: "#"
      }
    ],
    "cost": [
      {
        id: 1,
        title: "Safari prices expected to increase slightly next season",
        summary: "Tour operators cite rising fuel costs and conservation fees for moderate price adjustments.",
        source: "Travel Economics",
        date: "1 month ago",
        url: "#"
      }
    ]
  },
  "south africa": {
    "general": [
      {
        id: 1,
        title: "Cape Town named top cultural destination",
        summary: "International travel magazine recognizes the city's diverse cultural offerings and vibrant arts scene.",
        source: "Culture Trips",
        date: "1 week ago",
        url: "#"
      }
    ],
    "weather": [
      {
        id: 1,
        title: "Mild winter predicted for coastal regions",
        summary: "Meteorological data suggests warmer than average temperatures for the upcoming winter season.",
        source: "Weather Update",
        date: "3 days ago",
        url: "#"
      }
    ],
    "safety": [
      {
        id: 1,
        title: "New tourism safety initiative launches in Johannesburg",
        summary: "Local government partners with private sector to enhance security in popular tourist areas.",
        source: "Urban Safety Monitor",
        date: "2 weeks ago",
        url: "#"
      }
    ],
    "cost": [
      {
        id: 1,
        title: "Value of rand affects tourist purchasing power",
        summary: "Currency fluctuations create both challenges and opportunities for international visitors.",
        source: "Financial Observer",
        date: "1 month ago",
        url: "#"
      }
    ]
  }
};

// News categories with their corresponding icons
const newsCategories = [
  { id: "general", label: "General", icon: Newspaper },
  { id: "weather", label: "Weather", icon: Sun },
  { id: "safety", label: "Safety", icon: AlertTriangle },
  { id: "cost", label: "Cost of Living", icon: DollarSign }
];

const CountryNews = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [countryNews, setCountryNews] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState("general");
  
  // Format country name for display and data lookup
  const countryName = countryId?.toLowerCase() || "";
  const displayCountryName = countryName.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    // Simulate API call with a delay
    const fetchNewsData = async () => {
      setLoading(true);
      try {
        // In a real app, this would be an API call
        setTimeout(() => {
          // Find an exact match or default to first country
          const data = mockNewsData[countryName as keyof typeof mockNewsData] || 
                     Object.values(mockNewsData)[0];
          setCountryNews(data);
          setLoading(false);
        }, 1500);
      } catch (error) {
        console.error("Error fetching news:", error);
        setLoading(false);
      }
    };

    fetchNewsData();
  }, [countryName]);

  // Animation settings
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15
      }
    }
  };

  const handleBackClick = () => {
    navigate(-1); // Go back to previous page
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader />
        <main className="container mx-auto px-4 py-8">
          <Button 
            variant="ghost" 
            className="mb-6 flex items-center"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>

          <div className="flex items-center gap-4 mb-8">
            <div className="p-3 rounded-full bg-gradient-to-br from-twende-teal to-twende-skyblue/70 text-white">
              <Globe className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                {displayCountryName || "Country"} Travel News
              </h1>
              <p className="text-gray-500 dark:text-gray-400">
                Stay updated with the latest news affecting your travel destination
              </p>
            </div>
          </div>

          <Tabs 
            value={selectedCategory} 
            onValueChange={setSelectedCategory}
            className="space-y-8"
          >
            <TabsList className="grid grid-cols-4 max-w-lg">
              {newsCategories.map(category => (
                <TabsTrigger 
                  key={category.id} 
                  value={category.id}
                  className="flex items-center gap-2"
                >
                  <category.icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{category.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {newsCategories.map(category => (
              <TabsContent key={category.id} value={category.id}>
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <Card key={i} className="overflow-hidden">
                        <CardHeader>
                          <Skeleton className="h-8 w-3/4 mb-2" />
                          <Skeleton className="h-4 w-1/4" />
                        </CardHeader>
                        <CardContent>
                          <Skeleton className="h-20 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <motion.div 
                    className="space-y-4"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    {countryNews && countryNews[category.id]?.length > 0 ? (
                      countryNews[category.id].map((news: any) => (
                        <motion.div key={news.id} variants={itemVariants}>
                          <Card className="overflow-hidden hover:shadow-md transition-shadow duration-300">
                            <CardHeader>
                              <CardTitle>{news.title}</CardTitle>
                              <CardDescription className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {news.date}
                              </CardDescription>
                            </CardHeader>
                            <CardContent>
                              <p className="text-gray-700 dark:text-gray-300">
                                {news.summary}
                              </p>
                            </CardContent>
                            <CardFooter className="flex justify-between">
                              <span className="text-sm text-gray-500">
                                Source: {news.source}
                              </span>
                              <Button variant="outline" size="sm" asChild>
                                <a href={news.url} target="_blank" rel="noopener noreferrer">
                                  Read More
                                </a>
                              </Button>
                            </CardFooter>
                          </Card>
                        </motion.div>
                      ))
                    ) : (
                      <Card>
                        <CardContent className="pt-6">
                          <div className="flex flex-col items-center justify-center py-12 text-center">
                            <category.icon className="h-12 w-12 text-gray-400 mb-4" />
                            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                              No {category.label.toLowerCase()} news available
                            </h3>
                            <p className="text-gray-500 dark:text-gray-400 max-w-md">
                              We don't have any {category.label.toLowerCase()} news for {displayCountryName} at the moment. 
                              Please check back later for updates.
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    )}
                  </motion.div>
                )}
              </TabsContent>
            ))}
          </Tabs>
        </main>
      </div>
    </PageTransition>
  );
};

export default CountryNews;
