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
import { Skeleton } from "@/components/ui/skeleton";
import PageTransition from "@/components/PageTransition";
import DashboardHeader from "@/components/dashboard/DashboardHeader";
import { auth } from '@/lib/firebase';
import { supabase } from '@/lib/temp-supabase-stubs';

// GNews API configuration
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY;
const CACHE_TTL = 24 * 60 * 60 * 1000;
const COUNTRY_CODES: Record<string,string> = { ghana:'gh', kenya:'ke', 'south africa':'za' };

const CountryNews = () => {
  const { countryId } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [articles, setArticles] = useState<any[]>([]);
  const [countryInput, setCountryInput] = useState(countryId || '');

  const countryName = countryInput.toLowerCase();
  const displayCountryName = countryName
    .split('-')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

  // Fetch articles with cache-first strategy
  useEffect(() => {
    const fetchArticles = async () => {
      setLoading(true);
      // Check cache
      try {
        const { data: cacheRow, error: cacheErr } = await supabase
          .from('news_cache')
          .select('data, updated_at')
          .eq('country', countryName)
          .single();
        if (!cacheErr && cacheRow) {
          const age = Date.now() - new Date(cacheRow.updated_at).getTime();
          if (age < CACHE_TTL) {
            setArticles(cacheRow.data);
            setLoading(false);
            return;
          }
        }
      } catch (err) {
        console.error('Error reading news cache:', err);
      }
      // Fetch fresh from API
      let fetched: any[] = [];
      try {
        const countryCode = COUNTRY_CODES[countryName];
        let url = `https://gnews.io/api/v4/top-headlines?lang=en`;
        if (countryCode) url += `&country=${countryCode}`;
        url += `&topic=travel&max=20&apikey=${GNEWS_API_KEY}`;
        const res = await fetch(url);
        const json = await res.json();
        fetched = (json.articles || []).map((a: any) => ({
          id: a.url,
          title: a.title,
          summary: a.description,
          date: new Date(a.publishedAt).toLocaleDateString(),
          url: a.url
        }));
      } catch (err) {
        console.error('Error fetching news:', err);
      }
      setArticles(fetched);
      setLoading(false);
      // Upsert new cache
      try {
        await supabase
          .from('news_cache')
          .upsert({ country: countryName, data: fetched }, { onConflict: 'country' });
      } catch (err) {
        console.error('Error updating news cache:', err);
      }
    };
    if (countryName) fetchArticles();
  }, [countryName]);

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

          <div className="p-4 flex gap-2">
            <input
              type="text"
              placeholder="Enter country..."
              value={countryInput}
              onChange={e => setCountryInput(e.target.value)}
              className="px-3 py-2 border rounded-lg flex-1"
            />
            <Button onClick={() => navigate(`/country-news/${countryInput.toLowerCase().replace(/\s+/g,'-')}`)}>
              Go
            </Button>
          </div>

          <div className="p-4">
            {loading ? (
              <Skeleton className="h-8 w-full mb-2" />
            ) : (
              articles.map(item => (
                <Card key={item.id} className="mb-4">
                  <CardHeader>
                    <CardTitle>{item.title}</CardTitle>
                    <CardDescription>{item.date}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p>{item.summary}</p>
                  </CardContent>
                  <CardFooter>
                    <Button asChild variant="link">
                      <a href={item.url} target="_blank">Read more</a>
                    </Button>
                  </CardFooter>
                </Card>
              ))
            )}
          </div>
        </main>
      </div>
    </PageTransition>
  );
};

export default CountryNews;
