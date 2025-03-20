import React from 'react';

const Support = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Support Center</h1>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Contact Us</h2>
          <p className="text-gray-600 mb-4">
            If you need assistance or have any questions, please don't hesitate to reach out to our support team.
          </p>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium text-gray-800">Email</h3>
              <p className="text-gray-600">support@ourika.com</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Phone</h3>
              <p className="text-gray-600">+212 (0) 5XX-XXXXXX</p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">Hours</h3>
              <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM (GMT+1)</p>
            </div>
          </div>
        </div>

        <div className="bg-white shadow rounded-lg p-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
          <div className="space-y-6">
            <div>
              <h3 className="font-medium text-gray-800">How do I book a trek?</h3>
              <p className="text-gray-600">
                You can book a trek by browsing our available treks, selecting your preferred date, and following the booking process. Make sure you're logged in to complete the booking.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">What's your cancellation policy?</h3>
              <p className="text-gray-600">
                Our cancellation policy varies depending on the trek and timing. Generally, full refunds are available if cancelled 48 hours before the trek start time.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-gray-800">How can I become a guide?</h3>
              <p className="text-gray-600">
                To become a guide, you need to register as a guide on our platform and complete our verification process. This includes submitting required documentation and passing our quality checks.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Support;