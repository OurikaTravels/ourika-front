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
        return <Navigate to="/guide/profile/edit-profile" replace />
      case "TOURIST":
        return <Navigate to="/tourist/profile" replace />
      default:
        return <Navigate to="/" replace />
    }
  }

  return children
}

