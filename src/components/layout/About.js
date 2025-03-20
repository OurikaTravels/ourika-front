"use client"
import { ArrowRight, Mountain, Users, Utensils, MapPin } from "lucide-react"
import AboutImage from "../../assets/images/about.jpg"

export default function AboutSection() {
  const features = [
    {
      icon: Mountain,
      title: "Adventure Tours",
      description: "Discover breathtaking waterfalls and hiking trails in the Atlas Mountains",
    },
    {
      icon: Users,
      title: "Cultural Immersion",
      description: "Connect with local Berber communities and experience traditional lifestyles",
    },
    {
      icon: Utensils,
      title: "Culinary Journeys",
      description: "Experience authentic Moroccan flavors and traditional cooking methods",
    },
  ]

  return (
    <section className="py-24 relative bg-[#FFF8F8] overflow-hidden">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-20 -left-20 w-80 h-80 rounded-full bg-[#ff5d5d]/5"></div>
        <div className="absolute bottom-40 -right-20 w-96 h-96 rounded-full bg-[#ff5d5d]/5"></div>
        <div className="absolute top-1/2 left-1/3 w-64 h-64 rounded-full bg-[#ff5d5d]/3"></div>
      </div>

      <div className="container mx-auto px-6 relative z-10">
        <div className="max-w-xl mx-auto text-center mb-16">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#ff5d5d]/10 mb-4">
            <MapPin className="h-8 w-8 text-[#ff5d5d]" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-gray-900">
            Discover <span className="text-[#ff5d5d]">Ourika</span> Travels
          </h2>
          <p className="text-lg text-gray-600">Your gateway to authentic Moroccan adventures</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-24 h-24 rounded-full bg-[#ff5d5d]/10 z-0"></div>
            <div className="absolute -bottom-4 -right-4 w-32 h-32 rounded-full bg-[#ff5d5d]/10 z-0"></div>

            <img
              src={AboutImage || "/placeholder.svg?height=500&width=600"}
              alt="Ourika Valley"
              className="relative rounded-2xl w-full object-cover h-[500px] shadow-xl z-10"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = "/placeholder.svg?height=500&width=600"
              }}
            />

            <div className="absolute -bottom-6 -right-6 bg-white rounded-lg p-4 shadow-lg z-20">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full bg-[#ff5d5d]/10 flex items-center justify-center">
                  <span className="text-[#ff5d5d] font-bold text-xl">10+</span>
                </div>
                <div>
                  <p className="text-gray-900 font-medium">Years of</p>
                  <p className="text-gray-900 font-medium">Experience</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="space-y-6">
              <p className="text-lg leading-relaxed text-gray-700">
                OurikaTravels is your gateway to unforgettable adventures in the breathtaking Ourika Valley and beyond.
                We specialize in curating authentic experiences that showcase the natural beauty, rich culture, and warm
                hospitality of Morocco.
              </p>

              <p className="text-lg leading-relaxed text-gray-700">
                From exhilarating hikes to serene waterfalls, immersive cultural exchanges with local Berber
                communities, to mouthwatering culinary journeys, we offer a diverse range of tours tailored to every
                traveler's interests.
              </p>
            </div>

            <div className="grid sm:grid-cols-3 gap-6">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="p-6 rounded-xl bg-white shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
                >
                  <div className="w-12 h-12 rounded-full bg-[#ff5d5d]/10 flex items-center justify-center mb-4">
                    <feature.icon className="h-6 w-6 text-[#ff5d5d]" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-gray-900">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              ))}
            </div>

            <a
              href="/about"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#ff5d5d] to-[#ff7b7b] text-white rounded-full font-medium shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
            >
              Learn More About Us
              <ArrowRight className="h-5 w-5 transition-transform duration-200 group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}

