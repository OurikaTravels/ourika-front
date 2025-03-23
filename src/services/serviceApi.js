import api from "./axiosConfig";

const serviceApi = {
  getAllServices: async () => {
    try {
      const response = await api.get("/services");
      return { success: true, data: response.data };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to fetch services" };
    }
  },

  createService: async (serviceData) => {
    try {
      const response = await api.post("/services", serviceData);
      return { success: true, data: response.data, message: "Service created successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to create service" };
    }
  },

  updateService: async (id, serviceData) => {
    try {
      const response = await api.put(`/services/${id}`, serviceData);
      return { success: true, data: response.data, message: "Service updated successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to update service" };
    }
  },

  deleteService: async (id) => {
    try {
      await api.delete(`/services/${id}`);
      return { success: true, message: "Service deleted successfully" };
    } catch (error) {
      return { success: false, message: error.response?.data?.message || "Failed to delete service" };
    }
  },

  addServiceToTrek: async (trekId, serviceId) => {
    try {
      const response = await api.post(`/treks/${trekId}/services/${serviceId}`);
      return { success: true, message: "Service added to trek successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to add service to trek",
        error,
      };
    }
  },

  removeServiceFromTrek: async (trekId, serviceId) => {
    try {
      await api.delete(`/treks/${trekId}/services/${serviceId}`);
      return { success: true, message: "Service removed from trek successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "Failed to remove service from trek",
        error,
      };
    }
  },
};

export default serviceApi;