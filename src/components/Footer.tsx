
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
              Transforming journeys into effortless, meaningful experiences through personalized planning, local expertise, and technology-enhanced convenience.
            </p>
            <div className="flex space-x-4">
              <SocialLink href="https://facebook.com" icon={<Facebook size={18} />} />
              <SocialLink href="https://twitter.com" icon={<Twitter size={18} />} />
              <SocialLink href="https://instagram.com" icon={<Instagram size={18} />} />
              <SocialLink href="https://linkedin.com" icon={<Linkedin size={18} />} />
            </div>
          </div>
          
          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold mb-6">Quick Links</h4>
            <ul className="space-y-3">
              <FooterLink href="#destinations" label="Destinations" />
              <FooterLink href="#plan" label="Plan Your Trip" />
              <FooterLink href="#experiences" label="Experiences" />
              <FooterLink href="#about" label="About Us" />
              <FooterLink href="#contact" label="Contact" />
              <FooterLink href="/login" label="Sign In / Register" />
            </ul>
          </div>
          
          {/* Resources */}
          <div>
            <h4 className="text-lg font-bold mb-6">Resources</h4>
            <ul className="space-y-3">
              <FooterLink href="/blog" label="Travel Blog" />
              <FooterLink href="/faq" label="FAQ" />
              <FooterLink href="/visa-info" label="Visa Information" />
              <FooterLink href="/health-safety" label="Health & Safety" />
              <FooterLink href="/terms" label="Terms & Conditions" />
              <FooterLink href="/privacy" label="Privacy Policy" />
            </ul>
          </div>
          
          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-bold mb-6">Contact Us</h4>
            <div className="space-y-4">
              <div className="flex items-start">
                <Mail className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">twendetravel@gmail.com</span>
              </div>
              <div className="flex items-start">
                <Phone className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  0530862072 (Ghana)<br />
                  0768543581 (Kenya)
                </span>
              </div>
              <div className="flex items-start">
                <MapPin className="text-twende-orange mr-3 mt-1 flex-shrink-0" size={18} />
                <span className="text-gray-400">
                  Accra, Ghana <br />
                  Nairobi, Kenya
                </span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Newsletter */}
        <div className="py-8 border-t border-gray-800">
          <div className="max-w-3xl mx-auto text-center">
            <h4 className="text-xl font-bold mb-3">Subscribe to Our Newsletter</h4>
            <p className="text-gray-400 mb-6">
              Get travel inspiration, tips, and exclusive offers right in your inbox
            </p>
            <form className="flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Your email address"
                className="input-field flex-grow text-gray-800"
                required
              />
              <button type="submit" className="btn-secondary whitespace-nowrap">
                Subscribe
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
