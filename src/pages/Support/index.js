import { Mail, Phone, Clock, MapPin, HelpCircle, Calendar, AlertCircle, User, Send } from "lucide-react"

const Support = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-white py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#049769]/10 mb-4">
            <HelpCircle className="h-8 w-8 text-[#049769]" />
          </div>
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-3">Support Center</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">
            We're here to help you with any questions or issues you might have about your Moroccan adventure
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 mb-12">

          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#049769]/5 rounded-full -mr-16 -mt-16"></div>

            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <MapPin className="h-6 w-6 text-[#049769] mr-2" />
              Contact Us
            </h2>

            <p className="text-gray-600 mb-8">
              If you need assistance or have any questions, please don't hesitate to reach out to our support team.
            </p>

            <div className="space-y-6">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <Mail className="h-5 w-5 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Email</h3>
                  <a href="mailto:support@ourika.com" className="text-[#049769] hover:underline">
                    support@ourika.com
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <Phone className="h-5 w-5 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Phone</h3>
                  <a href="tel:+212-5XX-XXXXXX" className="text-gray-600 hover:text-[#049769]">
                    +212 (0) 5XX-XXXXXX
                  </a>
                </div>
              </div>

              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-10 h-10 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800">Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 9:00 AM - 6:00 PM (GMT+1)</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form Card */}
          <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-8 border border-gray-100">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
              <Send className="h-6 w-6 text-[#049769] mr-2" />
              Send a Message
            </h2>

            <form className="space-y-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#049769]/20 focus:border-[#049769] transition-colors"
                  placeholder="Enter your name"
                />
              </div>

              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#049769]/20 focus:border-[#049769] transition-colors"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                  Message
                </label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#049769]/20 focus:border-[#049769] transition-colors"
                  placeholder="How can we help you?"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full py-3 px-4 bg-gradient-to-r from-[#049769] to-[#049769] text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
              >
                <Send className="h-5 w-5 mr-2" />
                Send Message
              </button>
            </form>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="bg-white shadow-md hover:shadow-lg transition-shadow duration-300 rounded-2xl p-8 border border-gray-100 relative overflow-hidden">
          <div className="absolute bottom-0 left-0 w-40 h-40 bg-[#049769]/5 rounded-full -ml-20 -mb-20"></div>

          <h2 className="text-2xl font-bold text-gray-800 mb-8 flex items-center">
            <HelpCircle className="h-6 w-6 text-[#049769] mr-2" />
            Frequently Asked Questions
          </h2>

          <div className="space-y-8 relative z-10">
            <div className="p-6 rounded-xl bg-gray-50 hover:bg-[#049769]/5 transition-colors duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <Calendar className="h-4 w-4 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How do I book a trek?</h3>
                  <p className="text-gray-600">
                    You can book a trek by browsing our available treks, selecting your preferred date, and following
                    the booking process. Make sure you're logged in to complete the booking.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 hover:bg-[#049769]/5 transition-colors duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <AlertCircle className="h-4 w-4 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">What's your cancellation policy?</h3>
                  <p className="text-gray-600">
                    Our cancellation policy varies depending on the trek and timing. Generally, full refunds are
                    available if cancelled 48 hours before the trek start time.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-6 rounded-xl bg-gray-50 hover:bg-[#049769]/5 transition-colors duration-300 border border-gray-100">
              <div className="flex items-start">
                <div className="flex-shrink-0 mt-1">
                  <div className="w-8 h-8 rounded-full bg-[#049769]/10 flex items-center justify-center">
                    <User className="h-4 w-4 text-[#049769]" />
                  </div>
                </div>
                <div className="ml-4">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">How can I become a guide?</h3>
                  <p className="text-gray-600">
                    To become a guide, you need to register as a guide on our platform and complete our verification
                    process. This includes submitting required documentation and passing our quality checks.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <a href="#" className="inline-flex items-center text-[#049769] font-medium hover:underline">
              View all FAQs
              <svg
                className="ml-2 w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path>
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support

