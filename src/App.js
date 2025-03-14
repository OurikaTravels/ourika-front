"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import "./App.css"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import Categories from "./components/layout/Categories"
import TrekCard from "./components/common/TrekCard"
import AboutSection from "./components/layout/About"
import Footer from "./components/layout/Footer"
import WishlistPage from "./pages/Wishlist/index"
import Login from "./pages/Auth/Login"
import AdminDashboard from "./pages/Dashboard/Admin/index"
import GuideDashboard from "./pages/Dashboard/Guide/index"
import AllCategories from "./pages/Dashboard/Admin/Categories/AllCategories"
import AddCategory from "./pages/Dashboard/Admin/Categories/AddCategory"
import { useAuth } from "./context/AuthContext"
import ProfilePage from "./pages/Profile"
import ServiceManagement from "./pages/Dashboard/Admin/Treks/ServiceManagement"
import HighlightsManagement from "./pages/Dashboard/Admin/Treks/HighlightsManagement"

// Protected Route Component
function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/Auth/Login" replace />
  }

  if (requiredRole && user.role !== requiredRole) {
    if (user.role === "admin") {
      return <Navigate to="/Dashboard/Admin" replace />
    } else if (user.role === "guide") {
      return <Navigate to="/Dashboard/Guide" replace />
    } else {
      return <Navigate to="/" replace />
    }
  }

  return children
}

// Component to handle conditional rendering of Navbar and Footer
function AppContent({ treks }) {
  const location = useLocation()
  const isLoginPage = location.pathname === "/Auth/Login"
  const isDashboardPage =
    location.pathname.includes("/Dashboard") ||
    location.pathname.includes("/admin/categories") ||
    location.pathname.includes("/admin/treks/service-management") ||
    location.pathname.includes("/admin/treks/highlights-management") ||
    location.pathname.includes("/admin/treks/add-trek")

  return (
    <>
      {!isLoginPage && !isDashboardPage && <Navbar />}
      <div className="flex-grow">
        <Routes>
          {/* Home Route */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Categories />

                {/* Trek Cards Section */}
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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

                {/* About Section */}
                <AboutSection />
              </>
            }
          />

          {/* Auth Routes */}
          <Route path="/Auth/Login" element={<Login />} />

          {/* Dashboard Routes */}
          <Route
            path="Dashboard/Admin"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="Dashboard/Guide"
            element={
              <ProtectedRoute requiredRole="guide">
                <GuideDashboard />
              </ProtectedRoute>
            }
          />

          {/* Category Management Routes */}
          <Route
            path="admin/categories/all-categories"
            element={
              <ProtectedRoute requiredRole="admin">
                <AllCategories />
              </ProtectedRoute>
            }
          />
          <Route
            path="admin/categories/add-category"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddCategory />
              </ProtectedRoute>
            }
          />

          {/* Service Management Route */}
          <Route
            path="admin/treks/service-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <ServiceManagement />
              </ProtectedRoute>
            }
          />

          {/* Highlights Management Route */}
          <Route
            path="admin/treks/highlights-management"
            element={
              <ProtectedRoute requiredRole="admin">
                <HighlightsManagement />
              </ProtectedRoute>
            }
          />
        

          {/* Wishlist Route */}
          <Route path="/wishlist" element={<WishlistPage />} />

          {/* Profile Route */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute requiredRole="tourist">
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
      {!isLoginPage && !isDashboardPage && <Footer />}
    </>
  )
}

function App() {
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
  ]

  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <AppContent treks={treks} />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

