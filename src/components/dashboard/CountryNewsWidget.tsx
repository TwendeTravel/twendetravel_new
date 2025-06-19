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
// Number of articles to fetch/cache per country
const CACHE_FETCH_COUNT = 25;

// Shuffle helper to pick random items
const shuffleArray = <T,>(arr: T[]): T[] => arr.sort(() => Math.random() - 0.5);

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
  const [searchTerm, setSearchTerm] = useState('');
  
  // Format country name for routing
  const countrySlug = country.toLowerCase().replace(/\s+/g, '-');
  const displayCountryName = country.split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      let articles: any[] | null = null;

      // Only use cache when not searching
      if (!searchTerm.trim()) {
        try {
          const { data: cacheRow, error: cacheErr } = await supabase
            .from('news_cache')
            .select('data, updated_at')
            .eq('country', country)
            .single();
          if (!cacheErr && cacheRow) {
            const age = Date.now() - new Date(cacheRow.updated_at).getTime();
            if (age < CACHE_TTL) {
              // Pick `limit` random articles from cache
              const cached = cacheRow.data as any[];
              setNews(shuffleArray(cached).slice(0, limit));
              setLoading(false);
              return;
            }
          }
        } catch (err) {
          console.error('Error reading news cache:', err);
        }
      }
      
      // No valid cache or on new search: fetch fresh search results
      try {
        const countryCode = COUNTRY_CODES[country.toLowerCase()];
        // Always use search endpoint: "travel CountryName [searchTerm]"
        const baseQuery = `travel ${displayCountryName}` + (searchTerm.trim() ? ` ${searchTerm.trim()}` : '');
        const encoded = encodeURIComponent(baseQuery);
        let url = `https://gnews.io/api/v4/search?q=${encoded}&lang=en`;
        if (countryCode) url += `&country=${countryCode}`;
        // Fetch CACHE_FETCH_COUNT for cache
        url += `&max=${CACHE_FETCH_COUNT}&apikey=${GNEWS_API_KEY}`;

        if (!articles) {
          const resp = await fetch(url);
          const json = await resp.json();
          articles = (json.articles ?? []).map((a: any) => ({
            id: a.url,
            title: a.title,
            summary: a.description,
            date: new Date(a.publishedAt).toLocaleDateString(),
            url: a.url,
            image: a.image
          }));
        }

        // Cache default headlines
        if (!searchTerm.trim()) {
          const { error: upsertErr } = await supabase
            .from('news_cache')
            .upsert({ country, data: articles }, { onConflict: 'country' });
          if (upsertErr) console.error('Error updating news cache:', upsertErr);
        }
      } catch (err) {
        console.error('Error fetching GNews:', err);
      }

      // Display random `limit` articles from fresh set
      setNews(shuffleArray(articles || []).slice(0, limit));
      setLoading(false);
    };

    fetchNewsData();
  }, [country, limit, searchTerm]);

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
        {/* Search box for travel news */}
        <div className="p-4">
          <input
            type="text"
            placeholder="Search travel news..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full px-3 py-2 border rounded-lg focus:ring focus:ring-twende-teal"
          />
        </div>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[1, 2].map(i => (
              <Skeleton key={i} className="h-40 w-full rounded-lg" />
            ))}
          </div>
        ) : (
          <motion.div 
            className="grid grid-cols-1 sm:grid-cols-2 gap-4"
            variants={containerVariants}
            initial="hidden"
            animate="show"
          >
            {news.map(item => (
              <motion.a
                key={item.id}
                href={item.url}
                target="_blank"
                rel="noopener noreferrer"
                variants={itemVariants}
                className="relative block rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-shadow bg-white dark:bg-gray-800"
              >
                {/* Background image or placeholder color */}
                <div
                  className="h-32 bg-center bg-cover bg-gray-200 dark:bg-gray-700"
                  style={item.image ? { backgroundImage: `url(${item.image})` } : {}}
                />
                <div className="p-4">
                  <h3 className="font-semibold text-base text-gray-900 dark:text-white line-clamp-2 mb-2">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-3 mb-3">
                    {item.summary}
                  </p>
                  <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Clock className="h-4 w-4 mr-1" />
                      {item.date}
                    </div>
                    <ArrowRight className="h-4 w-4 text-twende-orange" />
                  </div>
                </div>
              </motion.a>
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
