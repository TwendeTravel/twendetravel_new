
import { Smartphone, Apple, Monitor } from 'lucide-react';

const AppDownload = () => {
  return (
    <section className="py-20 bg-white dark:bg-gray-900/95">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          {/* Content Side */}
          <div>
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-twende-teal dark:text-white">
              Take Twende With You
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-8 text-lg">
              Download the Twende Travel app to manage your trip on-the-go, access offline maps, and get instant support whenever you need it.
            </p>
            
            {/* App Features */}
            <div className="space-y-6 mb-8">
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-twende-beige dark:bg-twende-teal/20 mr-4 mt-1">
                  <Smartphone className="h-5 w-5 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Offline Access</h3>
                  <p className="text-gray-600 dark:text-gray-300">Access your itinerary, bookings, and essential travel information even without internet connection.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-twende-beige dark:bg-twende-teal/20 mr-4 mt-1">
                  <Smartphone className="h-5 w-5 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Instant Support</h3>
                  <p className="text-gray-600 dark:text-gray-300">Connect with our 24/7 customer service team with a single tap for immediate assistance.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="p-2 rounded-full bg-twende-beige dark:bg-twende-teal/20 mr-4 mt-1">
                  <Smartphone className="h-5 w-5 text-twende-teal dark:text-twende-skyblue" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 dark:text-white mb-1">Real-time Updates</h3>
                  <p className="text-gray-600 dark:text-gray-300">Receive important notifications about your trip, from flight delays to weather alerts.</p>
                </div>
              </div>
            </div>
            
            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="flex items-center justify-center bg-gray-900 dark:bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors hover-lift">
                <Apple className="mr-2 h-6 w-6" />
                <div className="text-left">
                  <div className="text-xs opacity-75">Download on the</div>
                  <div className="text-lg font-semibold">App Store</div>
                </div>
              </button>
              
              <button className="flex items-center justify-center bg-gray-900 dark:bg-gray-800 text-white py-3 px-6 rounded-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition-colors hover-lift">
                <svg className="mr-2 h-6 w-6" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M3.14 8.753l1.653-2.866c.07-.122.192-.202.33-.222a.38.38 0 0 1 .363.125l3.57 3.575-4.188 2.384-1.728-2.996zm15.442 2.83L21 9.308a.386.386 0 0 0-.011-.552l-1.736-1.746-3.988 2.339 3.316 1.236zm-6.198-3.293L7.705 3.706a.381.381 0 0 0-.531.011l-1.686 1.697 6.339 3.663 2.557-1.787zm9.448 5.147l-2.283-1.339-2.09 3.631h3.303a1.144 1.144 0 0 0 1.143-1.143 1.146 1.146 0 0 0-.073-.402zM7.308 8.294L2.31 11.318a1.134 1.134 0 0 0-.45.494l3.382 5.862H16.11l2.39-4.143-11.193-5.237z" />
                </svg>
                <div className="text-left">
                  <div className="text-xs opacity-75">GET IT ON</div>
                  <div className="text-lg font-semibold">Google Play</div>
                </div>
              </button>
            </div>
          </div>
          
          {/* Phone Mockup Side */}
          <div className="relative">
            <div className="relative mx-auto max-w-xs">
              <div className="bg-gray-900 dark:bg-gray-800 rounded-[60px] p-2 shadow-xl">
                <div className="bg-twende-teal dark:bg-twende-skyblue rounded-[56px] p-1 overflow-hidden">
                  <div className="relative rounded-[52px] overflow-hidden bg-white dark:bg-gray-900 aspect-[9/19.5]">
                    {/* Phone camera notch */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-1/3 h-7 bg-black rounded-b-2xl z-10"></div>
                    
                    {/* App Screen Content */}
                    <div className="absolute inset-0 overflow-hidden">
                      {/* App Header */}
                      <div className="pt-8 px-5 pb-3 bg-twende-teal dark:bg-twende-skyblue text-white">
                        <div className="text-center font-bold">Twende Travel</div>
                      </div>
                      
                      {/* App Content */}
                      <div className="h-full relative">
                        {/* Background Map */}
                        <div className="absolute inset-0">
                          <img
                            src="https://images.unsplash.com/photo-1482938289607-e9573fc25ebb?auto=format&fit=crop&w=600&q=80"
                            alt="Map view"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        
                        {/* Card overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800/95 rounded-t-3xl p-4">
                          <div className="w-10 h-1 bg-gray-300 dark:bg-gray-600 rounded-full mx-auto mb-3"></div>
                          <h4 className="text-sm font-bold mb-2 dark:text-white">Your Trip to Accra</h4>
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Flight confirmed</span>
                          </div>
                          <div className="flex items-center mb-2">
                            <div className="w-2 h-2 bg-twende-orange rounded-full mr-2"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Hotel check-in: 3pm</span>
                          </div>
                          <div className="flex items-center">
                            <div className="w-2 h-2 bg-gray-400 rounded-full mr-2"></div>
                            <span className="text-xs text-gray-600 dark:text-gray-300">Airport pickup: Confirmed</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute -right-10 -top-10 w-20 h-20 bg-twende-orange/20 dark:bg-twende-orange/10 rounded-full blur-xl"></div>
              <div className="absolute -left-8 -bottom-8 w-16 h-16 bg-twende-teal/20 dark:bg-twende-skyblue/10 rounded-full blur-xl"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AppDownload;
