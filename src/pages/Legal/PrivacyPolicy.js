import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl font-bold mb-12 text-center relative">
          <span className="relative z-10">Privacy Policy</span>
          <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-[#16bb40]"></span>
        </h1>
        
        <div className="space-y-12">
          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#16bb40] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#16bb40] mr-2">1.</span> 
              <span>Information We Collect</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We collect information that you provide directly to us, including but not limited to:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Name and contact information',
                'Account credentials',
                'Profile information',
                'Payment information',
                'Communication preferences'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#16bb40] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#16bb40] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#16bb40] mr-2">2.</span> 
              <span>How We Use Your Information</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We use the information we collect to:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Provide and maintain our services',
                'Process your bookings and transactions',
                'Send you important updates and notifications',
                'Improve our services and develop new features',
                'Ensure the security of your account'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#16bb40] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#16bb40] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#16bb40] mr-2">3.</span> 
              <span>Information Sharing</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              We do not sell your personal information to third parties. We may share your information with:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Service providers and partners',
                'Legal authorities when required by law',
                'Other users as part of the normal operation of our services'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#16bb40] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>

          <section className="bg-white rounded-lg shadow-sm p-8 border-l-4 border-[#16bb40] hover:shadow-md transition-shadow duration-300">
            <h2 className="text-2xl font-semibold mb-4 flex items-center">
              <span className="text-[#16bb40] mr-2">4.</span> 
              <span>Your Rights</span>
            </h2>
            <p className="text-gray-600 leading-relaxed">
              You have the right to:
            </p>
            <ul className="mt-4 space-y-2">
              {[
                'Access your personal information',
                'Correct inaccurate information',
                'Request deletion of your information',
                'Opt-out of marketing communications'
              ].map((item, index) => (
                <li key={index} className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#16bb40] rounded-full mt-2 mr-3"></span>
                  <span className="text-gray-600">{item}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>
        
        <div className="mt-12 text-center">
          <button className="bg-[#16bb40] text-white px-8 py-3 rounded-full hover:bg-[#177035] transition-colors duration-300 font-medium shadow-md hover:shadow-lg">
            Accept Privacy Policy
          </button>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;