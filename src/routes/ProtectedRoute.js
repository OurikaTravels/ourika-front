"use client"

import { Navigate } from "react-router-dom"
import { useAuth } from "../context/AuthContext"

export default function ProtectedRoute({ children, requiredRole }) {
  const { user, isAuthenticated } = useAuth()

  if (!isAuthenticated) {
    return <Navigate to="/Auth/Login" replace />
  }

  if (requiredRole && user.role.toUpperCase() !== requiredRole.toUpperCase()) {
    
    switch (user.role.toUpperCase()) {
      case "ADMIN":
        return <Navigate to="/Dashboard/Admin" replace />
      case "GUIDE":
        return <Navigate to="/Dashboard/Guide" replace />
      case "TOURIST":
        return <Navigate to="/profile" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return children
}

