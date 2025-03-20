import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LogoImage from '../../assets/images/logo.png';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-slate-900 text-white py-16">
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="mb-6">
              <img 
                src={LogoImage} 
                alt="Ourika Travels" 
                className="h-12"
              />
            </div>
            <p className="text-slate-300 leading-relaxed">
              Discover the magic of Morocco with our expertly curated tours and authentic experiences. Your journey begins with Ourika Travels.
            </p>
            <div className="flex space-x-4 pt-4">
              {[Facebook, Twitter, Instagram, Youtube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="p-2 rounded-full bg-slate-800 text-white hover:bg-red-500 hover:text-white transition-all duration-200"
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {[
                { name: 'Home', path: '/' },
                { name: 'Community', path: '/community' },
                { name: 'About Us', path: '/about' },
                { name: 'Support', path: '/support' }
              ].map((link) => (
                <li key={link.name}>
                  <Link 
                    to={link.path}
                    className="text-slate-300 hover:text-red-500 transition-colors duration-200 flex items-center group"
                  >
                    <ArrowRight 
                      size={16} 
                      className="mr-2 transition-transform duration-200 group-hover:translate-x-2" 
                    />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              {[
                { Icon: MapPin, text: '123 Travel Street, Medina, Marrakech, Morocco' },
                { Icon: Phone, text: '+212 123 456 789' },
                { Icon: Mail, text: 'info@ourikatravels.com' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3 text-slate-300">
                  <item.Icon size={20} className="mt-1 flex-shrink-0" />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-slate-800">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-slate-400">
              &copy; {currentYear} Ourika Travels. All rights reserved.
            </p>
            <div className="flex space-x-6">
              <Link
                to="/legal/privacy-policy"
                className="text-sm text-slate-400 hover:text-red-500 transition-colors duration-200"
              >
                Privacy Policy
              </Link>
              <Link
                to="/legal/terms-of-service"
                className="text-sm text-slate-400 hover:text-red-500 transition-colors duration-200"
              >
                Terms of Service
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
