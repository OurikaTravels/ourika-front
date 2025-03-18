"use client";

import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Star,
  Clock,
  MapPin,
  Bus,
  Activity,
  Check,
  X,
  Calendar,
  Heart,
  Share2,
  Users,
  Globe,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import trekApi from "../../services/trekApi";
import wishlistApi from "../../services/wishlistApi";
import reservationApi from "../../services/reservationApi";
import { toast } from "react-hot-toast";

const TrekDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showAllImages, setShowAllImages] = useState(false);
  const [inWishlist, setInWishlist] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [isReserving, setIsReserving] = useState(false);

  useEffect(() => {
    const fetchTrekDetails = async () => {
      try {
        const response = await trekApi.getTrekById(id);
        if (response.success) {
          setTrek(response.data);

          // Check if trek is in user's wishlist
          if (user?.id) {
            const wishlistResponse = await wishlistApi.getTouristWishlist(
              user.id
            );
            if (
              wishlistResponse.success &&
              Array.isArray(wishlistResponse.data)
            ) {
              const isInWishlist = wishlistResponse.data.some(
                (item) => item.trek?.id === Number.parseInt(id)
              );
              setInWishlist(isInWishlist);
            }
          }
        } else {
          toast.error(response.message || "Failed to fetch trek details");
        }
      } catch (error) {
        toast.error("Failed to load trek details");
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    fetchTrekDetails();
  }, [id, user?.id]);

  const formatDuration = (isoDuration) => {
    try {
      const hourMatch = isoDuration.match(/PT(\d+)H/);
      const minuteMatch = isoDuration.match(/(\d+)M/);
      const dayMatch = isoDuration.match(/P(\d+)D/);

      let result = "";

      if (dayMatch) {
        result += `${dayMatch[1]} day${dayMatch[1] > 1 ? "s" : ""} `;
      }

      if (hourMatch) {
        result += `${hourMatch[1]} hour${hourMatch[1] > 1 ? "s" : ""} `;
      }

      if (minuteMatch) {
        result += `${minuteMatch[1]} min`;
      }

      return result.trim() || "Duration not specified";
    } catch (error) {
      console.error("Error formatting duration:", error);
      return isoDuration;
    }
  };

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Please login to add to wishlist");
      return;
    }

    try {
      if (inWishlist) {
        const response = await wishlistApi.removeFromWishlist(user.id, trek.id);
        if (response.success) {
          setInWishlist(false);
          toast.success("Removed from wishlist");
        } else {
          toast.error(response.message || "Failed to remove from wishlist");
        }
      } else {
        const response = await wishlistApi.addToWishlist(user.id, trek.id);
        if (response.success) {
          setInWishlist(true);
          toast.success("Added to wishlist");
        } else {
          toast.error(response.message || "Failed to add to wishlist");
        }
      }
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  const handleReservation = async () => {
    if (!user) {
      toast.error("Please login to make a reservation");
      return;
    }

    if (!startDate || !endDate) {
      toast.error("Please select both start and end dates");
      return;
    }

    setIsReserving(true);
    try {
      const reservationData = {
        trekId: Number(id),
        startDate: new Date(startDate).toISOString(),
        endDate: new Date(endDate).toISOString()
      };

      const response = await reservationApi.createReservation(user.id, reservationData);
      
      if (response.success) {
        toast.success("Reservation created successfully!");
        setStartDate('');
        setEndDate('');
      } else {
        toast.error(response.message || "Failed to create reservation");
      }
    } catch (error) {
      toast.error("An error occurred while creating the reservation");
      console.error(error);
    } finally {
      setIsReserving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Trek not found
      </div>
    );
  }

  const originalPrice = Math.round(trek.price * 1.2);

  return (
    <div
      className={`min-h-screen ${
        theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      }`}
    >
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="px-4 py-4">
          <div className="text-sm uppercase font-medium mb-1">
            {trek.categoryId === 1 ? "DAY TRIP" : "MULTI-DAY"}
          </div>
          <h1 className="text-2xl font-bold mb-2">{trek.title}</h1>

          {/* Rating */}
          <div className="flex items-center gap-2 mb-4">
            <div className="flex">
              {[1, 2, 3, 4, 5].map((star) => (
                <Star
                  key={star}
                  className={`w-4 h-4 ${
                    star <= 4.5
                      ? "text-yellow-400"
                      : "text-yellow-400 fill-current opacity-50"
                  }`}
                  fill={star <= 4 ? "currentColor" : "none"}
                />
              ))}
            </div>
            <span className="font-medium">4.6</span>
            <span className="text-gray-500">
              ({Math.floor(Math.random() * 10000)} reviews)
            </span>

            {/* Wishlist and Share buttons */}
            <div className="ml-auto flex gap-4">
              <button
                onClick={toggleWishlist}
                className="flex items-center gap-1"
              >
                <Heart
                  className={`w-5 h-5 ${
                    inWishlist ? "text-red-500 fill-current" : ""
                  }`}
                />
                <span className="hidden sm:inline">
                  {inWishlist ? "Added to wishlist" : "Add to wishlist"}
                </span>
              </button>
              <button className="flex items-center gap-1">
                <Share2 className="w-5 h-5" />
                <span className="hidden sm:inline">Share</span>
              </button>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="grid grid-cols-12 gap-1 mb-4">
          <div className="col-span-8 aspect-[4/3] overflow-hidden">
            <img
              src={
                trek.images[activeImage]?.path
                  ? `http://localhost:8080/api/treks/${id}/images/${trek.images[activeImage]?.path}`
                  : "/placeholder.svg"
              }
              alt={trek.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="col-span-4 grid grid-rows-3 gap-1">
            {trek.images.slice(1, 4).map((image, index) => (
              <div
                key={image.id}
                className="aspect-[4/3] overflow-hidden cursor-pointer"
                onClick={() => setActiveImage(index + 1)}
              >
                <img
                  src={`http://localhost:8080/api/treks/${id}/images/${image.path}`}
                  alt={`${trek.title} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
            {trek.images.length > 4 && (
              <div className="absolute bottom-4 right-4">
                <button
                  className="bg-white/80 backdrop-blur-sm text-black px-3 py-1 rounded-full text-sm font-medium"
                  onClick={() => setShowAllImages(true)}
                >
                  +{trek.images.length - 4}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Description */}
        <div className="px-4 mb-6">
          <p
            className={`${
              theme === "dark" ? "text-gray-300" : "text-gray-600"
            }`}
          >
            {trek.description}
          </p>
        </div>

        {/* Main content and booking section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Trek details */}
          <div className="lg:col-span-2 px-4">
            {/* About this activity */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4 flex items-center">
                <span className="inline-flex items-center justify-center w-6 h-6 bg-gray-200 text-gray-800 rounded-full mr-2">
                  <span className="text-sm">ℹ️</span>
                </span>
                About this activity
              </h2>

              <div className="space-y-4">
                {/* Free cancellation */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Free cancellation</div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Cancel up to 24 hours in advance for a full refund
                    </div>
                  </div>
                </div>

                {/* Reserve now & pay later */}
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Reserve now & pay later</div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Keep your travel plans flexible — book your spot and pay
                      nothing today
                    </div>
                  </div>
                </div>

                {/* Duration */}
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">
                      Duration {formatDuration(trek.duration)}
                    </div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      Check availability to see starting times
                    </div>
                  </div>
                </div>

                {/* Live tour guide */}
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Live tour guide</div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      English, French, Spanish
                    </div>
                  </div>
                </div>

                {/* Pickup included */}
                <div className="flex items-start gap-3">
                  <Bus className="w-5 h-5 flex-shrink-0 mt-0.5" />
                  <div>
                    <div className="font-medium">Pickup included</div>
                    <div
                      className={`text-sm ${
                        theme === "dark" ? "text-gray-400" : "text-gray-500"
                      }`}
                    >
                      You will receive an email with the exact pickup time the
                      day before the tour. Please make sure you check your
                      emails and spam.
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* Highlights from other travelers 
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Highlights from other travelers</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">
                    "Amazing experience! The waterfalls were breathtaking and our guide was great!"
                  </p>
                  <div className="text-xs text-gray-500">Sarah P, United States</div>
                </div>

                <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-800" : "bg-gray-100"}`}>
                  <div className="flex mb-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className="w-3 h-3 text-yellow-400" fill="currentColor" />
                    ))}
                  </div>
                  <p className="text-sm mb-2">
                    "Well organized tour with beautiful scenery. The boat ride was the highlight for me. Would
                    definitely recommend!"
                  </p>
                  <div className="text-xs text-gray-500">Michael T, Germany</div>
                </div>
              </div>
            </section>
            */}

            {/* Itinerary */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Itinerary</h2>
              <div className="flex mb-4">
                <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3411.814884045622!2d-7.680870361721009!3d31.225857645509954!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xdbaaf678f9d1039%3A0xd968147e4179658d!2sSetti-Fatma!5e0!3m2!1sfr!2sma!4v1742309184312!5m2!1sfr!2sma"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                  ></iframe>
                </div>
              </div>

              <div className="relative">
                {/* Timeline */}
                <div className="absolute left-2.5 top-0 bottom-0 w-0.5 bg-red-500"></div>

                {/* Itinerary items */}
                <div className="space-y-6 ml-10">
                  {/* Pickup location */}
                  <div className="relative">
                    <div className="absolute -left-10 mt-1">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <MapPin className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Pickup location:</h3>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {trek.startLocation}
                      </p>
                    </div>
                  </div>

                  {/* Activities from API */}
                  {trek.activities
                    .sort((a, b) => a.activityOrder - b.activityOrder)
                    .map((activity) => (
                      <div key={activity.id} className="relative">
                        <div className="absolute -left-10 mt-1">
                          {activity.type === "TRANSPORTATION" ? (
                            <div className="w-5 h-5 rounded-full bg-gray-300 flex items-center justify-center text-gray-700">
                              <Bus className="w-3 h-3" />
                            </div>
                          ) : (
                            <div className="w-5 h-5 rounded-full bg-blue-500 flex items-center justify-center text-white">
                              <Activity className="w-3 h-3" />
                            </div>
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{activity.title}</h3>
                            {activity.isOptional && (
                              <span className="px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                                Optional
                              </span>
                            )}
                          </div>
                          {activity.description && (
                            <p
                              className={`text-sm ${
                                theme === "dark"
                                  ? "text-gray-300"
                                  : "text-gray-600"
                              }`}
                            >
                              {activity.description}
                            </p>
                          )}
                          {activity.type === "TRANSPORTATION" &&
                            activity.transportDuration && (
                              <p
                                className={`text-sm ${
                                  theme === "dark"
                                    ? "text-gray-300"
                                    : "text-gray-600"
                                }`}
                              >
                                {formatDuration(activity.transportDuration)}
                              </p>
                            )}
                        </div>
                      </div>
                    ))}

                  {/* Arrive back */}
                  <div className="relative">
                    <div className="absolute -left-10 mt-1">
                      <div className="w-5 h-5 rounded-full bg-red-500 flex items-center justify-center text-white">
                        <MapPin className="w-3 h-3" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-medium">Arrive back at:</h3>
                      <p
                        className={`text-sm ${
                          theme === "dark" ? "text-gray-300" : "text-gray-600"
                        }`}
                      >
                        {trek.endLocation}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-4 text-xs text-gray-500">
                For reference only. Itineraries are subject to change.
              </div>
            </section>

            {/* Highlights */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Highlights</h2>

              <ul className="space-y-2">
                {trek.highlights.map((highlight) => (
                  <li key={highlight.id} className="flex items-start gap-2">
                    <div className="mt-1 text-red-500">•</div>
                    <div className="text-sm">{highlight.content}</div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Full description */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Full description</h2>

              <div className="text-sm space-y-3">
                <p>
                  {trek.fullDescription}
                </p>
              </div>
            </section>

            {/* Includes */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Includes</h2>

              <ul className="space-y-2">
                {trek.services.map((service) => (
                  <li key={service.id} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm">{service.name}</div>
                  </li>
                ))}
              </ul>
            </section>

            {/* Not suitable for */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Not suitable for</h2>

              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-red-500">•</div>
                  <div className="text-sm">Pregnant women</div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-red-500">•</div>
                  <div className="text-sm">
                    People with mobility impairments
                  </div>
                </li>
                <li className="flex items-start gap-2">
                  <div className="mt-1 text-red-500">•</div>
                  <div className="text-sm">Wheelchair users</div>
                </li>
              </ul>
            </section>

            {/* Important information */}
            <section className="mb-8">
              <h2 className="text-lg font-bold mb-4">Important information</h2>

              <div className="space-y-4">
                <div>
                  <h3 className="font-medium mb-2">What to bring</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">Comfortable shoes</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">Sunglasses</div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">Sunscreen</div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Not allowed</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">Pets</div>
                    </li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-medium mb-2">Know before you go</h3>
                  <ul className="space-y-1">
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">
                        Please bring sunscreen, comfortable shoes, and your
                        camera
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">
                        Explore Ouzoud Falls with a convenient 7:30am pick up
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">
                        Comfortable air-conditioned vehicle
                      </div>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="mt-1 text-red-500">•</div>
                      <div className="text-sm">
                        Witnessing the river's flow towards the stunning
                        waterfalls
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </section>
          </div>

          {/* Right column - Booking section */}
          <div className="lg:col-span-1 px-4">
            <div
              className={`sticky top-4 ${
                theme === "dark" ? "bg-gray-800" : "bg-white"
              } rounded-lg shadow-lg p-4`}
            >
              {/* Price section */}
              <div className="mb-4">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl font-bold text-red-500">
                    {trek.price} MAD
                  </span>
                  <span className="text-gray-500 line-through text-sm">
                    {originalPrice} MAD
                  </span>
                  <span className="bg-red-100 text-red-800 text-xs font-medium px-2 py-0.5 rounded">
                    Save up to 20%
                  </span>
                </div>
                <div className="text-xs text-gray-500">per person</div>
              </div>

              {/* Booking form */}
              <div className="mb-4">
                <h3 className="text-base font-bold mb-3">Select dates</h3>

                <div className="space-y-2">
                  {/* Date inputs */}
                  <div className={`p-4 rounded-lg ${theme === "dark" ? "bg-gray-700" : "bg-gray-100"}`}>
                    <div className="space-y-3">
                      <div>
                        <label htmlFor="startDate" className="block text-sm font-medium mb-1">
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                          disabled={isReserving}
                        />
                      </div>
                      
                      <div>
                        <label htmlFor="endDate" className="block text-sm font-medium mb-1">
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 rounded border bg-white dark:bg-gray-800"
                          disabled={isReserving}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Reserve button */}
                  <button 
                    onClick={handleReservation}
                    disabled={isReserving || !user}
                    className="w-full bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReserving ? "Creating Reservation..." : "Reserve Now"}
                  </button>
                </div>
              </div>

              {/* Reserve now & pay later */}
              <div className="mt-3 flex items-center gap-2 text-sm">
                <Calendar className="w-4 h-4 text-blue-500" />
                <div className="text-blue-500">Reserve now & pay later</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TrekDetails;
