import api from "./axiosConfig";

const imageApi = {
  uploadTrekImages: async (trekId, files, onProgress) => {
    try {
      const formData = new FormData();
      files.forEach((file) => formData.append("file", file));
      formData.append("isPrimary", "false");

      const response = await api.post(`/treks/${trekId}/images/bulk`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        onUploadProgress: (progressEvent) => {
          if (typeof onProgress === "function" && progressEvent.lengthComputable) {
            const percentComplete = Math.round((progressEvent.loaded / progressEvent.total) * 100);
            onProgress(percentComplete);
          }
        },
      });

      return {
        success: true,
        message: "Images uploaded successfully",
        data: response.data,
      };
    } catch (error) {
      let errorMessage = error.response?.data?.message || "An error occurred while uploading images";
      if (error.response?.status === 400 && errorMessage.includes("At least")) {
        errorMessage = "At least 4 files are required for upload.";
      }
      return {
        success: false,
        message: errorMessage,
        data: null,
      };
    }
  },

  getTrekImages: async (trekId) => {
    try {
      const response = await api.get(`/treks/${trekId}/images`);
      const imagesArray = Array.isArray(response.data) ? response.data : response.data?.data || [];
      return { success: true, data: imagesArray };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while fetching images",
        data: null,
      };
    }
  },

  deleteTrekImage: async (trekId, imageId) => {
    try {
      await api.delete(`/treks/${trekId}/images/${imageId}`);
      return { success: true, message: "Image deleted successfully" };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while deleting image",
      };
    }
  },

  toggleImagePrimaryStatus: async (trekId, imageId) => {
    try {
      const response = await api.put(`/treks/${trekId}/images/${imageId}/primary`);
      return {
        success: true,
        message: "Image primary status toggled successfully",
        data: response.data,
      };
    } catch (error) {
      return {
        success: false,
        message: error.response?.data?.message || "An error occurred while toggling primary status",
        data: null,
      };
    }
  },
};

export default imageApi;