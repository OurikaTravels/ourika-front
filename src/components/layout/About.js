"use client"
import React from 'react';
import { ArrowRight, Mountain, Users, Utensils } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';
import AboutImage from "../../assets/images/about.jpg"
export default function AboutSection() {
  const { theme } = useTheme();
  
  const features = [
    {
      icon: Mountain,
      title: "Adventure Tours",
      description: "Discover breathtaking waterfalls and hiking trails"
    },
    {
      icon: Users,
      title: "Cultural Immersion",
      description: "Connect with local Berber communities"
    },
    {
      icon: Utensils,
      title: "Culinary Journeys",
      description: "Experience authentic Moroccan flavors"
    }
  ];

  return (
    <section className={`py-24 ${
      theme === 'dark'
        ? 'bg-gradient-to-b from-gray-900 to-gray-800'
        : 'bg-gradient-to-b from-white to-gray-50'
    }`}>
      <div className="container mx-auto px-6">
        <div className="max-w-xl mx-auto text-center mb-16">
          <h2 className={`text-4xl font-bold mb-4 ${
            theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
          }`}>
            Discover OurikaTravels
          </h2>
          <p className={`text-lg ${
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          }`}>
            Your gateway to authentic Moroccan adventures
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className={`absolute -top-4 -left-4 w-24 h-24 rounded-full opacity-60 blur-2xl ${
              theme === 'dark' ? 'bg-[#ff5d5d]/30' : 'bg-[#ff5d5d]/20'
            }`} />
            <div className={`absolute -bottom-4 -right-4 w-32 h-32 rounded-full opacity-60 blur-2xl ${
              theme === 'dark' ? 'bg-[#ff5d5d]/30' : 'bg-[#ff5d5d]/20'
            }`} />
            
            <img 
              src={AboutImage} 
              alt="Ourika Valley" 
              className={`relative rounded-2xl w-full object-cover h-[500px] ${
                theme === 'dark' 
                  ? 'shadow-2xl shadow-[#ff5d5d]/5' 
                  : 'shadow-xl shadow-[#ff5d5d]/10'
              }`}
            />
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                OurikaTravels is your gateway to unforgettable adventures in the breathtaking Ourika Valley and beyond. We specialize in curating authentic experiences that showcase the natural beauty, rich culture, and warm hospitality of Morocco.
              </p>
              
              <p className={`text-lg leading-relaxed ${
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              }`}>
                From exhilarating hikes to serene waterfalls, immersive cultural exchanges with local Berber communities, to mouthwatering culinary journeys, we offer a diverse range of tours tailored to every traveler's interests.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`p-4 rounded-xl transition-all duration-200 ${
                    theme === 'dark'
                      ? 'bg-gray-800 hover:bg-gray-700 shadow-lg shadow-black/20'
                      : 'bg-white hover:shadow-md shadow-sm'
                  }`}
                >
                  <feature.icon className="h-6 w-6 mb-2 text-[#ff5d5d]" />
                  <h3 className={`font-semibold mb-1 ${
                    theme === 'dark' ? 'text-gray-100' : 'text-gray-900'
                  }`}>
                    {feature.title}
                  </h3>
                  <p className={`text-sm ${
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  }`}>
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>

            <button className="group inline-flex items-center gap-2 px-6 py-3 bg-[#ff5d5d] text-white rounded-full font-medium hover:bg-[#ff4040] transition-all duration-200 hover:shadow-lg hover:shadow-[#ff5d5d]/20">
              Learn More About Us
              <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}