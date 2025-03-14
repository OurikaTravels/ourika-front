import React from "react";
import TrekCard from "../common/TrekCard"; // Assuming TrekCard is a separate component

const TrekCardsSection = ({ treks }) => {
  return (
    <section className="container mx-auto px-4 py-12">
      <div className="space-y-8">
        {/* Section Header */}
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4 transition-colors duration-200">
            Popular Tours
          </h2>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-200">
            Discover our most popular adventures and experiences
          </p>
        </div>

        {/* Trek Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {treks.map((trek, index) => (
            <div
              key={index}
              className="transform transition-all duration-300 hover:-translate-y-1 bg-gray-50 dark:bg-gray-800 rounded-lg shadow-md dark:shadow-gray-700/20"
            >
              <TrekCard
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
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TrekCardsSection;