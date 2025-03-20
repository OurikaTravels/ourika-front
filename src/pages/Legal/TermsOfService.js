import React from 'react';

const TermsOfService = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center relative">
          <span className="relative z-10">Terms of Service</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#FF5C5C]"></span>
        </h1>
        
        <div className="space-y-12">
          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#FF5C5C] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#FF5C5C] mr-2">1.</span> 
              <span>Acceptance of Terms</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              By accessing and using our services, you agree to be bound by these Terms of Service and all applicable laws and regulations.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#FF5C5C] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#FF5C5C] mr-2">2.</span> 
              <span>User Accounts</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              When you create an account with us, you must provide accurate and complete information. You are responsible for maintaining the security of your account and password.
            </p>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#FF5C5C] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#FF5C5C] mr-2">3.</span> 
              <span>Booking and Cancellation</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              All bookings are subject to availability and confirmation. Cancellation policies vary by trek and are specified during the booking process.
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Full refund if cancelled 48 hours before the trek',
                '50% refund if cancelled 24 hours before the trek',
                'No refund for last-minute cancellations'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#FF5C5C] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#FF5C5C] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#FF5C5C] mr-2">4.</span> 
              <span>User Conduct</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You agree not to:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Violate any applicable laws or regulations',
                'Interfere with or disrupt our services',
                'Harass or harm other users',
                'Submit false or misleading information'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#FF5C5C] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#FF5C5C] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#FF5C5C] mr-2">5.</span> 
              <span>Limitation of Liability</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We strive to provide reliable services but cannot guarantee uninterrupted access. We are not liable for any indirect, incidental, or consequential damages.
            </p>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-[#FF5C5C] text-white px-8 py-3 rounded-full hover:bg-[#ff4747] transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
            Accept Terms
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService;