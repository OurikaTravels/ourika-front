"use client"

import { createContext, useContext, useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { authApi } from "../services/api"

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()


  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem("token")
      const userData = localStorage.getItem("user")

      if (token && userData) {
        if (!authApi.isTokenExpired(token)) {
          setUser(JSON.parse(userData))
        } else {
          localStorage.removeItem("token")
          localStorage.removeItem("user")
          setUser(null)
        }
      }
      setLoading(false)
    }

    checkAuth()
  }, [])

  const login = async (email, password) => {
    try {
      const response = await authApi.login(email, password);

      if (response.success) {
        const { token, role, email, id, lastName } = response.data; 

        const userData = {
          id, 
          email,
          role: role.toLowerCase(),
          token,
          lastName,
        };

        localStorage.setItem("token", token);
        localStorage.setItem("user", JSON.stringify(userData));
        localStorage.setItem("guideId", id); 

        setUser(userData);

        if (role === "ADMIN") {
          navigate("/Dashboard/Admin");
        } else if (role === "GUIDE") {
          navigate("/guide/profile/edit-profile");  // This path is correct
        }

        return { success: true };
      } else {
        throw new Error(response.message || "Login failed");
      }
    } catch (error) {
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
    navigate("/Auth/Login")
  }

  const hasRole = (role) => {
    return user && user.role.toLowerCase() === role.toLowerCase()
  }

  const value = {
    user,
    loading,
    login,
    logout,
    hasRole,
    isAuthenticated: !!user,
    token: user?.token,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

