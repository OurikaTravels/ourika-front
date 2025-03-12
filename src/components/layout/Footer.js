import React from 'react';
import { Facebook, Twitter, Instagram, YoutubeIcon as YouTube, Phone, Mail, MapPin, ArrowRight } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import LogoImage from '../../assets/images/logo.png';

export default function Footer() {
  const { theme } = useTheme();
  const currentYear = new Date().getFullYear();

  // Brand colors
  const primaryColor = '#ff5c5c';
  const darkModeSecondary = '#111926';
  const lightModeSecondary = '#ffffff';

  const footerBgColor = '#1d2536';
  const footerTextColor = '#ffffff'; 
  const footerSecondaryTextColor = '#c0c5ce'; 
  const footerAccentColor = primaryColor; 

  return (
    <footer className="py-16 transition-colors duration-200" style={{ backgroundColor: footerBgColor, color: footerTextColor }}>
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
            <p className="leading-relaxed" style={{ color: footerSecondaryTextColor }}>
              Discover the magic of Morocco with our expertly curated tours and authentic experiences. Your journey begins with Ourika Travels.
            </p>
            <div className="flex space-x-4 pt-4">
              {[Facebook, Twitter, Instagram, YouTube].map((Icon, index) => (
                <a 
                  key={index} 
                  href="#" 
                  className="p-2 rounded-full transition-all duration-200 shadow-sm"
                  style={{ 
                    backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    color: footerTextColor
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.backgroundColor = footerAccentColor;
                    e.currentTarget.style.color = '#ffffff';
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
                    e.currentTarget.style.color = footerTextColor;
                  }}
                >
                  <Icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6" style={{ color: footerTextColor }}>Quick Links</h3>
            <ul className="space-y-3">
              {['Home', 'Tours', 'About Us', 'Contact', 'Blog', 'FAQs'].map((link) => (
                <li key={link}>
                  <a 
                    href="#" 
                    className="transition-colors duration-200 flex items-center group"
                    style={{ color: footerSecondaryTextColor }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = footerAccentColor;
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = footerSecondaryTextColor;
                    }}
                  >
                    <ArrowRight 
                      size={16} 
                      className="mr-2 transition-transform duration-200 group-hover:translate-x-2" 
                      style={{ color: 'inherit' }}
                    />
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6" style={{ color: footerTextColor }}>Contact Us</h3>
            <div className="space-y-4">
              {[
                { Icon: MapPin, text: '123 Travel Street, Medina, Marrakech, Morocco' },
                { Icon: Phone, text: '+212 123 456 789' },
                { Icon: Mail, text: 'info@ourikatravels.com' }
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-3" style={{ color: footerSecondaryTextColor }}>
                  <item.Icon size={20} className={`mt-1 flex-shrink-0 ${item.Icon === MapPin ? 'mt-1' : ''}`} />
                  <p>{item.text}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold mb-6" style={{ color: footerTextColor }}>Newsletter</h3>
            <p className="mb-4" style={{ color: footerSecondaryTextColor }}>
              Subscribe to our newsletter for travel tips and special offers.
            </p>
            <div className="space-y-3">
              <input
                type="email"
                placeholder="Your email address"
                className="w-full px-4 py-2 rounded-lg border focus:outline-none focus:ring-2"
                style={{ 
                  backgroundColor: 'rgba(255, 255, 255, 0.1)', 
                  borderColor: 'rgba(255, 255, 255, 0.2)', 
                  color: footerTextColor,
                  placeholderColor: footerSecondaryTextColor 
                }}
              />
              <button 
                className="w-full px-4 py-2 text-white rounded-lg transition-colors duration-200"
                style={{ 
                  backgroundColor: footerAccentColor,
                }}
                onMouseOver={(e) => {
                  e.currentTarget.style.backgroundColor = '#ff7373'; // Lighter version of primary
                }}
                onMouseOut={(e) => {
                  e.currentTarget.style.backgroundColor = footerAccentColor;
                }}
              >
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t" style={{ borderColor: 'rgba(255, 255, 255, 0.1)' }}>
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p style={{ color: footerSecondaryTextColor }}>
              &copy; {currentYear} Ourika Travels. All rights reserved.
            </p>
            <div className="flex space-x-6">
              {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map((link) => (
                <a
                  key={link}
                  href="#"
                  className="text-sm transition-colors duration-200"
                  style={{ color: footerSecondaryTextColor }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = footerAccentColor;
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = footerSecondaryTextColor;
                  }}
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