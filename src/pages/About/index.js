import React from 'react';
import { Mountain, Users, Utensils, CheckCircle } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AboutImage from '../../assets/images/about.jpg';

export default function About() {
  const { theme } = useTheme();
  const isDark = theme === 'dark';

  const features = [
    {
      icon: Mountain,
      title: "Adventure Tours",
      description: "Discover breathtaking waterfalls and hiking trails in the Atlas Mountains, offering unforgettable experiences for all skill levels."
    },
    {
      icon: Users,
      title: "Cultural Immersion",
      description: "Connect with local Berber communities and experience authentic Moroccan traditions, customs, and daily life."
    },
    {
      icon: Utensils,
      title: "Culinary Journeys",
      description: "Experience authentic Moroccan flavors through traditional cooking classes and food tours with local experts."
    }
  ];

  const stats = [
    { label: "Happy Travelers", value: "10K+" },
    { label: "Local Guides", value: "50+" },
    { label: "Tours Completed", value: "1000+" },
    { label: "Years Experience", value: "10+" }
  ];

  const values = [
    {
      title: "Authenticity",
      description: "We provide genuine Moroccan experiences, connecting travelers with local culture and traditions."
    },
    {
      title: "Sustainability",
      description: "Committed to responsible tourism that benefits local communities and preserves natural environments."
    },
    {
      title: "Excellence",
      description: "Delivering exceptional service and unforgettable experiences through attention to detail."
    },
    {
      title: "Community",
      description: "Building meaningful connections between travelers and local communities."
    }
  ];

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
      {/* Hero Section */}
      <section className={`relative py-16 sm:py-20 lg:py-24 ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6 ${isDark ? 'text-white' : 'text-gray-900'}`}>
              About <span className="text-[#ff5d5d]">Ourika</span> Travels
            </h1>
            <p className={`text-lg sm:text-xl leading-relaxed ${isDark ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
              Your trusted partner for authentic Moroccan adventures, connecting travelers with the heart and soul of the Atlas Mountains.
            </p>
          </div>
        </div>
      </section>

      {/* Image and Mission Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#ff5d5d]/10 z-0"></div>
              <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#ff5d5d]/10 z-0"></div>
              <img
                src={AboutImage}
                alt="Ourika Valley"
                className="relative rounded-2xl w-full h-[300px] sm:h-[400px] lg:h-[500px] object-cover shadow-xl z-10"
              />
            </div>
            <div className="space-y-6">
              <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold ${isDark ? 'text-white' : 'text-gray-900'}`}>
                Our Mission
              </h2>
              <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                At Ourika Travels, we're passionate about creating authentic, sustainable, and unforgettable experiences 
                that showcase the best of Morocco's natural beauty and cultural heritage.
              </p>
              <p className={`text-base sm:text-lg ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                Our team of experienced local guides and travel experts work tirelessly to ensure every journey with us 
                is not just a trip, but a life-enriching adventure.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            What We Offer
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {features.map((feature, index) => (
              <div 
                key={index}
                className={`p-6 sm:p-8 rounded-xl transform transition-all duration-300 hover:-translate-y-1 ${
                  isDark 
                    ? 'bg-gray-800 hover:bg-gray-700' 
                    : 'bg-white hover:shadow-xl border border-gray-100'
                }`}
              >
                <div className="w-12 h-12 rounded-full bg-[#ff5d5d]/10 flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-[#ff5d5d]" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                  {feature.title}
                </h3>
                <p className={`${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center p-6 rounded-xl bg-[#ff5d5d]/5">
                <div className="text-2xl sm:text-3xl font-bold mb-2 text-[#ff5d5d]">
                  {stat.value}
                </div>
                <div className={`text-sm sm:text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className={`py-16 lg:py-24 ${isDark ? 'bg-gray-800/50' : 'bg-gray-50'}`}>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className={`text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-12 ${isDark ? 'text-white' : 'text-gray-900'}`}>
            Our Values
          </h2>
          <div className="grid md:grid-cols-2 gap-6 sm:gap-8">
            {values.map((value, index) => (
              <div 
                key={index}
                className={`flex items-start space-x-4 p-6 sm:p-8 rounded-xl transform transition-all duration-300 hover:-translate-y-1 ${
                  isDark ? 'bg-gray-800 hover:bg-gray-700' : 'bg-white hover:shadow-xl border border-gray-100'
                }`}
              >
                <CheckCircle className="w-6 h-6 text-[#ff5d5d] flex-shrink-0 mt-1" />
                <div>
                  <h3 className={`text-lg sm:text-xl font-bold mb-3 ${isDark ? 'text-white' : 'text-gray-900'}`}>
                    {value.title}
                  </h3>
                  <p className={`text-base ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
                    {value.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
