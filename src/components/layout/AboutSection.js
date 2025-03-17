"use client"

export default function AboutSection() {
  return (
    <section className="py-16 bg-white dark:bg-gray-900">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
            About Ourika Falls
          </h2>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-8">
            Discover the breathtaking beauty of Ourika Falls, nestled in the heart of the Atlas Mountains. 
            Our platform connects adventure seekers with experienced local guides for unforgettable trekking experiences.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Expert Guides
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Our certified local guides ensure safe and enriching adventures.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Scenic Routes
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Explore carefully curated trails showcasing the region's natural beauty.
              </p>
            </div>
            <div className="p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Local Experience
              </h3>
              <p className="text-gray-600 dark:text-gray-300">
                Immerse yourself in the rich culture and traditions of the Atlas Mountains.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}