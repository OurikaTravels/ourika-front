"use client"

import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom"
import { ThemeProvider } from "./context/ThemeContext"
import { AuthProvider } from "./context/AuthContext"
import { useEffect, useState } from "react" // Import useEffect and useState
import "./App.css"
import Navbar from "./components/layout/Navbar"
import Hero from "./components/layout/Hero"
import Categories from "./components/layout/Categories"
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
import TrekCardsSection from "./components/layout/TrekCardsSection"
import AddTrek from "./pages/Dashboard/Admin/Treks/AddTrek"
import TrekPreview from "./pages/Dashboard/Admin/Treks/TrekPreview" // Import the TrekPreview component
import trekApi from "./services/trekApi" // Import the trekApi

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
function AppContent() {
  const location = useLocation()
  const isLoginPage = location.pathname === "/Auth/Login"
  const isDashboardPage =
    location.pathname.includes("/Dashboard") ||
    location.pathname.includes("/admin/categories") ||
    location.pathname.includes("/admin/treks/service-management") ||
    location.pathname.includes("/admin/treks/highlights-management") ||
    location.pathname.includes("/admin/treks/add-trek") ||
    (location.pathname.includes("/admin/treks/") && location.pathname.includes("/preview")) // Add preview page to dashboard pages

  const [treks, setTreks] = useState([]) // State to store treks
  const [loading, setLoading] = useState(true) // State to track loading
  const [error, setError] = useState(null) // State to store errors

  // Fetch treks from the API
  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await trekApi.getAllTreks()
        if (response.success) {
          setTreks(response.data) // Set the fetched treks
        } else {
          setError(response.message) // Set error message
        }
      } catch (err) {
        setError(err.message) // Set error message
      } finally {
        setLoading(false) // Stop loading
      }
    }

    fetchTreks()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading treks...</div> // Show loading message
  }

  if (error) {
    return <div className="text-center py-8 text-red-500">Error: {error}</div> // Show error message
  }

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
                <TrekCardsSection treks={treks} />
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

          {/* Trek Management Routes */}
          <Route
            path="admin/treks/add-trek"
            element={
              <ProtectedRoute requiredRole="admin">
                <AddTrek />
              </ProtectedRoute>
            }
          />

          {/* Trek Preview Route */}
          <Route
            path="admin/treks/:id/preview"
            element={
              <ProtectedRoute requiredRole="admin">
                <TrekPreview />
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
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <div className="min-h-screen flex flex-col bg-white dark:bg-gray-900 transition-colors duration-200">
            <AppContent />
          </div>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App

