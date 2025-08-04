
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="py-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Company Info */}
          <div>
            <h3 className="text-xl font-bold font-montserrat mb-6">
              Twende<span className="text-twende-orange">Travel</span>
            </h3>
            <p className="text-gray-400 mb-6">
              Your personal African travel concierge. We handle every detail so you can focus on creating unforgettable memories across Ghana, Kenya, and South Africa.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
            </div>
          </div>
          
          {/* Services */}
          <div>
            <h4 className="text-lg font-bold mb-6">Our Services</h4>
            <ul className="space-y-3">
              <FooterLink href="/service-request" label="Plan My Trip" />
              <FooterLink href="/destinations" label="Destinations" />
              <FooterLink href="/chat" label="24/7 Concierge Support" />
              <FooterLink href="/dashboard" label="My Dashboard" />
              <FooterLink href="/about" label="About Our Service" />
              <FooterLink href="/login" label="Access My Account" />
            </ul>
          </div>
          
          {/* Support */}
          <div>
            <h4 className="text-lg font-bold mb-6">Support & Info</h4>
            <ul className="space-y-3">
              <FooterLink href="/how-it-works" label="How It Works" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/visa-info" label="Visa Assistance" />
              <FooterLink href="/travel-insurance" label="Travel Insurance" />
              <FooterLink href="/terms" label="Terms & Conditions" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </ul>
          </div>
          
          {/* 24/7 Concierge Contact */}
          <div>
            <h4 className="text-lg font-bold mb-6">24/7 Concierge</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">concierge@twendetravel.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  WhatsApp: +233 53 086 2072<br />
                  Kenya: +254 76 854 3581
                </span>
              </div>
              <div className="flex items-start">
                <MapPin className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  Local offices in Accra, Nairobi & Cape Town
                </span>
              </div>
              <div className="mt-4 p-3 bg-twende-teal/20 rounded-lg">
                <p className="text-sm text-twende-orange font-medium">
                  🟢 Always Available - Your personal travel assistant
                </p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Concierge Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h4 className="text-xl font-bold mb-3">Get Exclusive Travel Insights</h4>
            <p className="text-gray-400 mb-6">
              Join our community for insider tips, destination guides, and special concierge offers from our African travel experts
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-lg bg-gray-800 border border-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-twende-teal"
                required
              />
              <button type="submit" className="px-6 py-3 bg-twende-teal hover:bg-twende-teal/90 text-white rounded-lg font-medium transition-colors whitespace-nowrap">
                Join Community
              </button>
            </form>
          </div>
        </div>
        
        {/* Bottom Footer */}
        <div className="py-6 border-t border-gray-800 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} Twende Travel. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

// Social Media Link Component
const SocialLink = ({ href, icon }: { href: string; icon: React.ReactNode }) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="w-9 h-9 rounded-full bg-gray-800 flex items-center justify-center hover:bg-twende-orange transition-colors duration-300"
    >
      {icon}
    </a>
  );
};

// Footer Link Component
const FooterLink = ({ href, label }: { href: string; label: string }) => {
  return (
    <li>
      <a
        href={href}
        className="text-gray-400 hover:text-white transition-colors duration-300"
      >
        {label}
      </a>
    </li>
  );
};

export default Footer;
