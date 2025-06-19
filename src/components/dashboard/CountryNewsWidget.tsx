import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Globe, Newspaper, Clock, ArrowRight } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { supabase } from '@/lib/supabaseClient';
// GNews API key from env
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const CACHE_TTL = 24 * 60 * 60 * 1000; // 24h cache

// Map country names to GNews country codes
const COUNTRY_CODES: Record<string,string> = {
  ghana: 'gh',
  kenya: 'ke',
  'south africa': 'za'
};

interface CountryNewsWidgetProps {
  country?: string;
  limit?: number;
}


const CountryNewsWidget = ({ country = "ghana", limit = 2 }: CountryNewsWidgetProps) => {
  const [loading, setLoading] = useState(true);
  const [news, setNews] = useState<any[]>([]);
  
  // Format country name for routing
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const displayCountryName = country.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      // Try fetching cached news from Supabase
      let articles: any[] | null = null;
      try {
        const { data: cacheRow, error: cacheErr } = await supabase
          .from('news_cache')
          .select('data, updated_at')
          .eq('country', country)
          .single();
        if (!cacheErr && cacheRow) {
          const age = Date.now() - new Date(cacheRow.updated_at).getTime();
          if (age < CACHE_TTL) {
            articles = cacheRow.data;
          }
        }
      } catch (err) {
        console.error('Error reading news cache:', err);
      }
      // If no valid cache, fetch fresh and update Supabase
      if (!articles) {
        try {
          const query = encodeURIComponent(`travel ${displayCountryName}`);
          const countryCode = COUNTRY_CODES[country.toLowerCase()];
          // Build GNews search URL
          let url = `https://gnews.io/api/v4/search?q=${query}&lang=en`;
          if (countryCode) url += `&country=${countryCode}`;
          url += `&max=${limit}&apikey=${GNEWS_API_KEY}`;
          const resp = await fetch(url);
          const json = await resp.json();
          articles = (json.articles ?? []).map((a: any) => ({
            id: a.url,
            title: a.title,
            summary: a.description,
            date: new Date(a.publishedAt).toLocaleDateString(),
            url: a.url
          }));
          // Upsert to Supabase cache
          const { error: upsertErr } = await supabase
            .from('news_cache')
            .upsert({ country, data: articles });
          if (upsertErr) console.error('Error updating news cache:', upsertErr);
        } catch (err) {
          console.error('Error fetching GNews:', err);
        }
      }
      setNews(articles || []);
      setLoading(false);
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
