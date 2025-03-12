import React from 'react';
import { Facebook, Twitter, Instagram, YoutubeIcon as YouTube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LogoImage from '../../assets/images/logo.png';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  return (
    <footer className={`${
      theme === 'dark' 
        ? 'bg-gray-900 text-gray-100' 
        : 'bg-gray-50 text-gray-800'
    } py-16 transition-colors duration-200`}>
      <div className="container mx-auto px-4 max-w-7xl">
        {/* Main Footer Content */}
        <div className="grid md:grid-cols-4 gap-12">
          {/* About Section */}
          <div className="space-y-4">
            <div className="mb-6">
              <img 
                src={LogoImage} 
                alt="Ourika Travels" 
                className="h-12"
              />
            </div>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } leading-relaxed`}>
              Discover the magic of Morocco with our expertly curated tours and authentic experiences. Your journey begins with Ourika Travels.
            </p>
            <div className="flex space-x-4 pt-4">
              <a href="#" className={`${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } p-2 rounded-full transition-all duration-200 shadow-sm`}>
                <Facebook size={20} />
              </a>
              <a href="#" className={`${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } p-2 rounded-full transition-all duration-200 shadow-sm`}>
                <Twitter size={20} />
              </a>
              <a href="#" className={`${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } p-2 rounded-full transition-all duration-200 shadow-sm`}>
                <Instagram size={20} />
              </a>
              <a href="#" className={`${
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-300 hover:text-white' 
                  : 'bg-white hover:bg-gray-100 text-gray-600 hover:text-gray-900'
              } p-2 rounded-full transition-all duration-200 shadow-sm`}>
                <YouTube size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Tours', 'About Us', 'Contact', 'Blog', 'FAQs'].map((link) => (
                <li key={link}>
                  <a href="#" className={`${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  } transition-colors duration-200 flex items-center group`}>
                    <ArrowRight size={16} className={`mr-2 transition-transform duration-200 ${
                      theme === 'dark' ? 'group-hover:text-white' : 'group-hover:text-gray-900'
                    } group-hover:translate-x-2`} />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Contact Us</h3>
            <div className="space-y-4">
              <div className={`flex items-start space-x-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <MapPin size={20} className="mt-1 flex-shrink-0" />
                <p>123 Travel Street, Medina, Marrakech, Morocco</p>
              </div>
              <div className={`flex items-center space-x-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Phone size={20} />
                <p>+212 123 456 789</p>
              </div>
              <div className={`flex items-center space-x-3 ${
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              }`}>
                <Mail size={20} />
                <p>info@ourikatravels.com</p>
              </div>
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6">Newsletter</h3>
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            } mb-4`}>
              Subscribe to our newsletter for travel tips and special offers.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className={`w-full px-4 py-2 rounded-lg ${
                  theme === 'dark' 
                    ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500' 
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400'
                } border focus:outline-none focus:ring-2 focus:ring-blue-500`}
              />
              <button className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-200">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className={`mt-12 pt-8 ${
          theme === 'dark' ? 'border-gray-800' : 'border-gray-200'
        } border-t`}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className={`${
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            }`}>
              &copy; {currentYear} Ourika Travels. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className={`${
                    theme === 'dark' 
                      ? 'text-gray-400 hover:text-white' 
                      : 'text-gray-600 hover:text-gray-900'
                  } text-sm transition-colors duration-200`}
                >
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}