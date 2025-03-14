const API_BASE_URL = "http://localhost:8080/api"

const categoryApi = {
  // Get all categories
  getAllCategories: async () => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      const data = await response.json()
      return data
    } catch (error) {
      throw { success: false, message: "Failed to fetch categories" }
    }
  },

  // Create a new category
  createCategory: async (categoryData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/categories`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      throw { success: false, message: "Failed to create category" }
    }
  },

  // Update a category
  updateCategory: async (id, categoryData) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(categoryData),
      })

      const data = await response.json()
      return data
    } catch (error) {
      throw { success: false, message: "Failed to update category" }
    }
  },

  // Delete a category
  deleteCategory: async (id) => {
    try {
      const token = localStorage.getItem("token")
      const response = await fetch(`${API_BASE_URL}/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      })

      const data = await response.json()
      return data
    } catch (error) {
      throw { success: false, message: "Failed to delete category" }
    }
  },
}

export default categoryApi

