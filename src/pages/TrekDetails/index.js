"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
  ChevronLeft,
  ChevronRight,
  Info,
  AlertCircle,
  Sun,
  Navigation,
  Compass,
  CheckCircle,
  ArrowRight
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import { useAuth } from "../../context/AuthContext";
import { useWishlist } from "../../context/WishlistContext";
import trekApi from "../../services/trekApi";
import wishlistApi from "../../services/wishlistApi";
import reservationApi from "../../services/reservationApi";
import { toast } from "react-hot-toast";

const TrekDetails = () => {
  const { id } = useParams();
  const { theme } = useTheme();
  const { user } = useAuth();
  const { updateWishlistCount } = useWishlist();
  const [trek, setTrek] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [showGalleryModal, setShowGalleryModal] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [inWishlist, setInWishlist] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [adultCount, setAdultCount] = useState(1);
  const [childCount, setChildCount] = useState(0);
  const [endDate, setEndDate] = useState("");
  const [isReserving, setIsReserving] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const itineraryRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrekDetails = async () => {
      try {
        const response = await trekApi.getTrekById(id);
        if (response.success) {
          setTrek(response.data);

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
          updateWishlistCount(response.count); // Update the global count
          toast.success("Removed from wishlist");
        } else {
          toast.error(response.message || "Failed to remove from wishlist");
        }
      } else {
        const response = await wishlistApi.addToWishlist(user.id, trek.id);
        if (response.success) {
          setInWishlist(true);
          updateWishlistCount(response.count); // Update the global count
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
        adultCount: Number(adultCount),
        childCount: Number(childCount),
        endDate: new Date(endDate).toISOString(),
      };

      const response = await reservationApi.createReservation(
        user.id,
        reservationData
      );

      if (response.success) {
        setShowSuccessModal(true);
        setStartDate("");
        setEndDate("");
        setAdultCount(1);
        setChildCount(0);
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

  const scrollToItinerary = () => {
    itineraryRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const nextGalleryImage = () => {
    setGalleryIndex((prev) => (prev === trek.images.length - 1 ? 0 : prev + 1));
  };

  const prevGalleryImage = () => {
    setGalleryIndex((prev) => (prev === 0 ? trek.images.length - 1 : prev - 1));
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  if (!trek) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4">
        <div className="text-4xl text-emerald-500 mb-4">
          <Compass />
        </div>
        <h2 className="text-2xl font-bold mb-2">Trek Not Found</h2>
        <p className="text-gray-600 mb-6">
          We couldn't find the trek you're looking for.
        </p>
        <a
          href="/treks"
          className="px-6 py-3 bg-emerald-600 text-white rounded-full hover:bg-emerald-700 transition-colors"
        >
          Browse All Treks
        </a>
      </div>
    );
  }

  const originalPrice = Math.round(trek.price * 1.2);

  return (
    <>
      <div
        className={`min-h-screen ${
          theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"
        }`}
      >
        {/* Hero Section with Title */}
        <div className="relative bg-gradient-to-r from-emerald-900 to-teal-800 text-white">
          <div className="absolute inset-0 opacity-20 bg-pattern"></div>
          <div className="max-w-7xl mx-auto px-4 py-12 sm:py-16 relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <div className="inline-flex items-center px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-sm font-medium mb-4">
                  {trek.categoryId === 1 ? (
                    <>
                      <Clock className="w-4 h-4 mr-1" /> DAY TRIP
                    </>
                  ) : (
                    <>
                      <Calendar className="w-4 h-4 mr-1" /> MULTI-DAY
                    </>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 leading-tight">
                  {trek.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="flex">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <Star
                          key={star}
                          className={`w-4 h-4 ${
                            star <= 4.5
                              ? "text-amber-400"
                              : "text-amber-400 fill-current opacity-50"
                          }`}
                          fill={star <= 4 ? "currentColor" : "none"}
                        />
                      ))}
                    </div>
                    <span className="font-medium">4.6</span>
                    <span className="text-white/80">
                      ({Math.floor(Math.random() * 10000)} reviews)
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    <span>{formatDuration(trek.duration)}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{trek.startLocation}</span>
                  </div>
                </div>
              </div>

              <div className="mt-6 md:mt-0 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={toggleWishlist}
                  className={`flex items-center justify-center gap-2 px-4 py-2 rounded-full transition-all ${
                    inWishlist
                      ? "bg-white text-emerald-700"
                      : "bg-white/20 hover:bg-white/30 text-white"
                  }`}
                >
                  <Heart
                    className={`w-5 h-5 ${inWishlist ? "fill-emerald-700" : ""}`}
                  />
                  <span>
                    {inWishlist ? "Saved to Wishlist" : "Add to Wishlist"}
                  </span>
                </button>

                <button
                  onClick={scrollToItinerary}
                  className="flex items-center justify-center gap-2 px-4 py-2 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white transition-all"
                >
                  <Navigation className="w-5 h-5" />
                  <span>View Itinerary</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery */}
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="grid grid-cols-12 gap-2">
            {/* Main large image */}
            <div
              className="col-span-12 md:col-span-8 aspect-[16/9] rounded-xl overflow-hidden cursor-pointer"
              onClick={() => {
                setShowGalleryModal(true);
                setGalleryIndex(activeImage);
              }}
            >
              <img
                src={
                  trek.images[activeImage]?.path
                    ? `http://localhost:8080/api/treks/${id}/images/${trek.images[activeImage]?.path}`
                    : "/placeholder.svg"
                }
                alt={trek.title}
                className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
              />
            </div>

            {/* Smaller images grid */}
            <div className="col-span-12 md:col-span-4 grid grid-cols-2 gap-2">
              {trek.images.slice(1, 5).map((image, index) => (
                <div
                  key={image.id}
                  className="aspect-[4/3] rounded-xl overflow-hidden cursor-pointer relative group"
                  onClick={() => setActiveImage(index + 1)}
                >
                  <img
                    src={`http://localhost:8080/api/treks/${id}/images/${image.path}`}
                    alt={`${trek.title} ${index + 1}`}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  {index === 3 && trek.images.length > 5 && (
                    <div
                      className="absolute inset-0 bg-black/50 flex items-center justify-center group-hover:bg-black/70 transition-all"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowGalleryModal(true);
                        setGalleryIndex(4);
                      }}
                    >
                      <div className="text-white text-center">
                        <p className="text-2xl font-bold">
                          +{trek.images.length - 4}
                        </p>
                        <p className="text-sm">More Photos</p>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Main content and booking section */}
        <div className="max-w-7xl mx-auto px-4 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left column - Trek details */}
            <div className="lg:col-span-2">
              {/* Description Card */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">Overview</h2>
                <p className="text-gray-700 leading-relaxed">
                  {trek.description}
                </p>
              </div>

              {/* About this activity */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-600" />
                  About this activity
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Free cancellation */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Free cancellation
                      </div>
                      <div className="text-sm text-gray-600">
                        Cancel up to 24 hours in advance for a full refund
                      </div>
                    </div>
                  </div>

                  {/* Reserve now & pay later */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Reserve now & pay later
                      </div>
                      <div className="text-sm text-gray-600">
                        Keep your travel plans flexible — book your spot and pay
                        nothing today
                      </div>
                    </div>
                  </div>

                  {/* Duration */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Duration {formatDuration(trek.duration)}
                      </div>
                      <div className="text-sm text-gray-600">
                        Check availability to see starting times
                      </div>
                    </div>
                  </div>

                  {/* Live tour guide */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Users className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Live tour guide
                      </div>
                      <div className="text-sm text-gray-600">
                        English, French, Spanish
                      </div>
                    </div>
                  </div>

                  {/* Pickup included */}
                  <div className="flex items-start gap-3 md:col-span-2">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                      <Bus className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="font-medium text-gray-900">
                        Pickup included
                      </div>
                      <div className="text-sm text-gray-600">
                        You will receive an email with the exact pickup time the
                        day before the tour. Please make sure you check your
                        emails and spam.
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Itinerary */}
              <div
                ref={itineraryRef}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8"
              >
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <Navigation className="w-5 h-5 mr-2 text-emerald-600" />
                  Itinerary
                </h2>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Map */}
                  <div className="rounded-xl overflow-hidden shadow-md h-[350px] md:h-auto">
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

                  {/* Timeline */}
                  <div className="relative pl-8">
                    {/* Timeline line */}
                    <div className="absolute left-3 top-0 bottom-0 w-1 bg-gradient-to-b from-emerald-500 to-teal-500 rounded-full"></div>

                    {/* Itinerary items */}
                    <div className="space-y-8">
                      {/* Pickup location */}
                      <div className="relative">
                        <div className="absolute -left-8 mt-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                            <MapPin className="w-3 h-3" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Pickup location:
                          </h3>
                          <p className="text-gray-600 mt-1">
                            {trek.startLocation}
                          </p>
                        </div>
                      </div>

                      {/* Activities from API */}
                      {trek.activities
                        .sort((a, b) => a.activityOrder - b.activityOrder)
                        .map((activity) => (
                          <div key={activity.id} className="relative">
                            <div className="absolute -left-8 mt-1">
                              {activity.type === "TRANSPORTATION" ? (
                                <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center text-white">
                                  <Bus className="w-3 h-3" />
                                </div>
                              ) : (
                                <div className="w-6 h-6 rounded-full bg-teal-500 flex items-center justify-center text-white">
                                  <Activity className="w-3 h-3" />
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <h3 className="font-bold text-gray-900">
                                  {activity.title}
                                </h3>
                                {activity.isOptional && (
                                  <span className="px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 rounded-full">
                                    Optional
                                  </span>
                                )}
                              </div>
                              {activity.description && (
                                <p className="text-gray-600 mt-1">
                                  {activity.description}
                                </p>
                              )}
                              {activity.type === "TRANSPORTATION" &&
                                activity.transportDuration && (
                                  <p className="text-gray-500 text-sm mt-1 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatDuration(activity.transportDuration)}
                                  </p>
                                )}
                            </div>
                          </div>
                        ))}

                      {/* Arrive back */}
                      <div className="relative">
                        <div className="absolute -left-8 mt-1">
                          <div className="w-6 h-6 rounded-full bg-emerald-600 flex items-center justify-center text-white">
                            <MapPin className="w-3 h-3" />
                          </div>
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900">
                            Arrive back at:
                          </h3>
                          <p className="text-gray-600 mt-1">{trek.endLocation}</p>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 text-xs text-gray-500 italic">
                      For reference only. Itineraries are subject to change.
                    </div>
                  </div>
                </div>
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <Star className="w-5 h-5 mr-2 text-emerald-600" />
                  Highlights
                </h2>

                <div className="grid md:grid-cols-2 gap-4">
                  {trek.highlights.map((highlight) => (
                    <div key={highlight.id} className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Check className="w-4 h-4 text-emerald-600" />
                      </div>
                      <div className="text-gray-700">{highlight.content}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Full description */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <h2 className="text-xl font-bold mb-4 text-gray-900">
                  Full description
                </h2>
                <div className="prose prose-emerald max-w-none text-gray-700">
                  <p>{trek.fullDescription}</p>
                </div>
              </div>

              {/* Includes & Not Suitable */}
              <div className="grid md:grid-cols-2 gap-6 mb-8">
                {/* Includes */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                    <Check className="w-5 h-5 mr-2 text-emerald-600" />
                    Includes
                  </h2>

                  <ul className="space-y-3">
                    {trek.services.map((service) => (
                      <li key={service.id} className="flex items-start gap-3">
                        <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-4 h-4 text-emerald-600" />
                        </div>
                        <div className="text-gray-700">{service.name}</div>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Not suitable for */}
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                  <h2 className="text-xl font-bold mb-4 text-gray-900 flex items-center">
                    <AlertCircle className="w-5 h-5 mr-2 text-amber-500" />
                    Not suitable for
                  </h2>

                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-gray-700">Pregnant women</div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-gray-700">
                        People with mobility impairments
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-6 h-6 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                        <X className="w-4 h-4 text-amber-600" />
                      </div>
                      <div className="text-gray-700">Wheelchair users</div>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Important information */}
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <h2 className="text-xl font-bold mb-6 text-gray-900 flex items-center">
                  <Info className="w-5 h-5 mr-2 text-emerald-600" />
                  Important information
                </h2>

                <div className="grid md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <Sun className="w-4 h-4 mr-2 text-amber-500" />
                      What to bring
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-gray-700">Comfortable shoes</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-gray-700">Sunglasses</div>
                      </li>
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0">
                          <Check className="w-3 h-3 text-amber-600" />
                        </div>
                        <div className="text-gray-700">Sunscreen</div>
                      </li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                      <X className="w-4 h-4 mr-2 text-red-500" />
                      Not allowed
                    </h3>
                    <ul className="space-y-2">
                      <li className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                          <X className="w-3 h-3 text-red-600" />
                        </div>
                        <div className="text-gray-700">Pets</div>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="font-bold text-gray-900 mb-3 flex items-center">
                    <Info className="w-4 h-4 mr-2 text-emerald-600" />
                    Know before you go
                  </h3>
                  <ul className="space-y-2">
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Info className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="text-gray-700">
                        Please bring sunscreen, comfortable shoes, and your camera
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Info className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="text-gray-700">
                        Explore Ouzoud Falls with a convenient 7:30am pick up
                      </div>
                    </li>
                    <li className="flex items-start gap-3">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center flex-shrink-0">
                        <Info className="w-3 h-3 text-emerald-600" />
                      </div>
                      <div className="text-gray-700">
                        Comfortable air-conditioned vehicle
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Right column - Booking section */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* Price header */}
                  <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-6">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold">{trek.price} MAD</span>
                      <span className="line-through text-white/70 text-sm">
                        {originalPrice} MAD
                      </span>
                      <span className="bg-white/20 backdrop-blur-sm text-white text-xs font-medium px-2 py-1 rounded-full">
                        Save 20%
                      </span>
                    </div>
                    <div className="text-sm text-white/80">per person</div>
                  </div>

                  {/* Booking form */}
                  <div className="p-6">
                    <h3 className="text-lg font-bold mb-4 text-gray-900">
                      Book Your Adventure
                    </h3>

                    <div className="space-y-4">
                      {/* Date inputs */}
                      <div>
                        <label
                          htmlFor="startDate"
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          Start Date
                        </label>
                        <input
                          type="date"
                          id="startDate"
                          value={startDate}
                          onChange={(e) => setStartDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          disabled={isReserving}
                        />
                      </div>

                      <div>
                        <label
                          htmlFor="endDate"
                          className="block text-sm font-medium mb-1 text-gray-700"
                        >
                          End Date
                        </label>
                        <input
                          type="date"
                          id="endDate"
                          value={endDate}
                          onChange={(e) => setEndDate(e.target.value)}
                          className="w-full px-3 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all"
                          disabled={isReserving}
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label
                            htmlFor="adultCount"
                            className="block text-sm font-medium mb-1 text-gray-700"
                          >
                            Adults
                          </label>
                          <div className="flex">
                            <button
                              className="px-3 py-2 bg-gray-100 rounded-l-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                              onClick={() =>
                                setAdultCount(Math.max(1, adultCount - 1))
                              }
                              disabled={adultCount <= 1 || isReserving}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              id="adultCount"
                              value={adultCount}
                              onChange={(e) =>
                                setAdultCount(
                                  Math.max(
                                    1,
                                    Number.parseInt(e.target.value) || 1
                                  )
                                )
                              }
                              className="w-full px-3 py-2 border-y border-gray-300 text-center"
                              min="1"
                              disabled={isReserving}
                            />
                            <button
                              className="px-3 py-2 bg-gray-100 rounded-r-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                              onClick={() => setAdultCount(adultCount + 1)}
                              disabled={isReserving}
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div>
                          <label
                            htmlFor="childCount"
                            className="block text-sm font-medium mb-1 text-gray-700"
                          >
                            Children
                          </label>
                          <div className="flex">
                            <button
                              className="px-3 py-2 bg-gray-100 rounded-l-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                              onClick={() =>
                                setChildCount(Math.max(0, childCount - 1))
                              }
                              disabled={childCount <= 0 || isReserving}
                            >
                              -
                            </button>
                            <input
                              type="number"
                              id="childCount"
                              value={childCount}
                              onChange={(e) =>
                                setChildCount(
                                  Math.max(
                                    0,
                                    Number.parseInt(e.target.value) || 0
                                  )
                                )
                              }
                              className="w-full px-3 py-2 border-y border-gray-300 text-center"
                              min="0"
                              disabled={isReserving}
                            />
                            <button
                              className="px-3 py-2 bg-gray-100 rounded-r-lg border border-gray-300 hover:bg-gray-200 transition-colors"
                              onClick={() => setChildCount(childCount + 1)}
                              disabled={isReserving}
                            >
                              +
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Total price calculation */}
                      <div className="bg-gray-50 p-4 rounded-lg mt-4">
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-700">
                            Adults ({adultCount})
                          </span>
                          <span className="font-medium">
                            {(trek.price * adultCount).toLocaleString()} MAD
                          </span>
                        </div>
                        {childCount > 0 && (
                          <div className="flex justify-between mb-2">
                            <span className="text-gray-700">
                              Children ({childCount})
                            </span>
                            <span className="font-medium">
                              {(trek.price * 0.7 * childCount).toLocaleString()}{" "}
                              MAD
                            </span>
                          </div>
                        )}
                        <div className="border-t border-gray-200 my-2 pt-2 flex justify-between">
                          <span className="font-bold text-gray-900">Total</span>
                          <span className="font-bold text-emerald-600">
                            {(
                              trek.price * adultCount +
                              trek.price * 0.7 * childCount
                            ).toLocaleString()}{" "}
                            MAD
                          </span>
                        </div>
                      </div>

                      {/* Reserve button */}
                      <button
                        onClick={handleReservation}
                        disabled={isReserving || !user}
                        className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white font-medium py-3 px-4 rounded-lg transition-colors text-base disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        {isReserving ? (
                          <>
                            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                            Creating Reservation...
                          </>
                        ) : (
                          <>Reserve Now</>
                        )}
                      </button>

                      {!user && (
                        <div className="text-sm text-amber-600 text-center">
                          Please login to make a reservation
                        </div>
                      )}
                    </div>

                    {/* Reserve now & pay later */}
                    <div className="mt-4 flex items-center gap-2 text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                      <Calendar className="w-4 h-4" />
                      <div className="font-medium">Reserve now & pay later</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Image Gallery Modal */}
        {showGalleryModal && (
          <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center">
            <div className="relative w-full max-w-4xl p-4">
              <button
                onClick={() => setShowGalleryModal(false)}
                className="absolute top-4 right-4 z-10 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>

              <div className="relative">
                <img
                  src={
                    trek.images[galleryIndex]?.path
                      ? `http://localhost:8080/api/treks/${id}/images/${trek.images[galleryIndex]?.path}`
                      : "/placeholder.svg"
                  }
                  alt={`${trek.title} - Image ${galleryIndex + 1}`}
                  className="w-full h-auto max-h-[80vh] object-contain"
                />

                <button
                  onClick={prevGalleryImage}
                  className="absolute left-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <button
                  onClick={nextGalleryImage}
                  className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2 bg-black/50 rounded-full text-white hover:bg-black/70 transition-colors"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              <div className="text-center text-white mt-4">
                Image {galleryIndex + 1} of {trek.images.length}
              </div>

              <div className="mt-4 flex justify-center gap-2 overflow-x-auto pb-4">
                {trek.images.map((image, index) => (
                  <button
                    key={image.id}
                    onClick={() => setGalleryIndex(index)}
                    className={`w-16 h-16 rounded-md overflow-hidden flex-shrink-0 border-2 transition-all ${
                      galleryIndex === index
                        ? "border-emerald-500 scale-110"
                        : "border-transparent opacity-70 hover:opacity-100"
                    }`}
                  >
                    <img
                      src={`http://localhost:8080/api/treks/${id}/images/${image.path}`}
                      alt={`Thumbnail ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Success Modal */}
      {showSuccessModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-6 transform animate-fadeIn">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="w-10 h-10 text-emerald-600" />
              </div>
              
              <h3 className="text-2xl font-bold text-gray-900 mb-2">
                Booking Confirmed!
              </h3>
              
              <p className="text-gray-600 mb-6">
                Your trek reservation has been successfully created. You can view all the details in your bookings page.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 w-full">
                <button
                  onClick={() => navigate('/bookings')}
                  className="flex-1 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2"
                >
                  View Booking
                  <ArrowRight className="w-4 h-4" />
                </button>
                
                <button
                  onClick={() => setShowSuccessModal(false)}
                  className="flex-1 px-6 py-3 rounded-lg font-medium border border-gray-200 hover:bg-gray-50 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default TrekDetails;
