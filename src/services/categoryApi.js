import api from "./axiosConfig";

const categoryApi = {
  getAllCategories: async () => {
    try {
      const response = await api.get("/categories");
      return response.data;
    } catch (error) {
      throw { success: false, message: "Failed to fetch categories" };
    }
  },

  createCategory: async (categoryData) => {
    try {
      const response = await api.post("/categories", categoryData);
      return response.data;
    } catch (error) {
      throw { success: false, message: "Failed to create category" };
    }
  },

  updateCategory: async (id, categoryData) => {
    try {
      const response = await api.put(`/categories/${id}`, categoryData);
      return response.data;
    } catch (error) {
      throw { success: false, message: "Failed to update category" };
    }
  },

  deleteCategory: async (id) => {
    try {
      const response = await api.delete(`/categories/${id}`);
      return response.data;
    } catch (error) {
      throw { success: false, message: "Failed to delete category" };
    }
  },
};

export default categoryApi;