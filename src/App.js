import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import './App.css';
import Navbar from './components/layout/Navbar';
import Hero from './components/layout/Hero';
import Categories from './components/layout/Categories';
import TrekCard from './components/common/TrekCard';
import AboutSection from './components/layout/About';

function App() {
  // Sample trek data
  const treks = [
    {
      imageUrl: "https://images.unsplash.com/photo-1519681393784-d120267933ba",
      type: "DAY TRIP",
      title: "From Marrakech: Ouzoud Waterfalls Guided Tour & Boat Ride",
      duration: "10 hours",
      pickup: "Pickup available",
      rating: 4.8,
      reviews: 8951,
      originalPrice: 220,
      discountedPrice: 176,
      currency: "MAD",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1542224566-6cf2c9d03c24",
      type: "FULL DAY",
      title: "Atlas Mountains & 4 Valleys Guided Day Tour from Marrakech",
      duration: "8 hours",
      pickup: "Hotel pickup",
      rating: 4.6,
      reviews: 5621,
      originalPrice: 180,
      discountedPrice: 145,
      currency: "MAD",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272",
      type: "PRIVATE",
      title: "Sahara Desert 3-Day Tour from Marrakech to Merzouga",
      duration: "3 days",
      pickup: "Included",
      rating: 4.9,
      reviews: 3254,
      originalPrice: 450,
      discountedPrice: 380,
      currency: "MAD",
    },
    {
      imageUrl: "https://images.unsplash.com/photo-1588668214407-6ea9a6d8c272",
      type: "PRIVATE",
      title: "Sahara Desert 3-Day Tour from Marrakech to Merzouga",
      duration: "3 days",
      pickup: "Included",
      rating: 4.9,
      reviews: 3254,
      originalPrice: 450,
      discountedPrice: 380,
      currency: "MAD",
    }
  ];

  return (
    <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-white dark:bg-gray-900">
          <Navbar />
          <Hero />
          <Categories />
          
          {/* Trek Cards Section */}
          <section className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {treks.map((trek, index) => (
                <TrekCard
                  key={index}
                  imageUrl={trek.imageUrl}
                  type={trek.type}
                  title={trek.title}
                  duration={trek.duration}
                  pickup={trek.pickup}
                  rating={trek.rating}
                  reviews={trek.reviews}
                  originalPrice={trek.originalPrice}
                  discountedPrice={trek.discountedPrice}
                  currency={trek.currency}
                />
              ))}
            </div>
          </section>

          {/* About Section */}
          <AboutSection />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;