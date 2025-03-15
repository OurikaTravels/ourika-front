const API_BASE_URL = "http://localhost:8080/api";

const imageApi = {
  // Upload multiple images for a trek in bulk
  uploadTrekImages: async (trekId, files, onProgress) => {
    try {
      const token = localStorage.getItem("token");

      // Create FormData object
      const formData = new FormData();

      // Append each file to the FormData
      files.forEach((file) => {
        formData.append("file", file); // Field name must be "file"
      });

      // Explicitly set isPrimary to false for all images
      formData.append("isPrimary", "false"); // Field name must be "isPrimary"

      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();

        xhr.open("POST", `${API_BASE_URL}/treks/${trekId}/images/bulk`);

        // Set authorization header if token exists
        if (token) {
          xhr.setRequestHeader("Authorization", `Bearer ${token}`);
        }

        // Handle response
        xhr.onload = () => {
          if (xhr.status >= 200 && xhr.status < 300) {
            try {
              const data = JSON.parse(xhr.responseText);
              resolve({
                success: true,
                message: "Images uploaded successfully",
                data,
              });
            } catch (error) {
              reject({
                success: false,
                message: "Error parsing response",
                data: null,
              });
            }
          } else {
            try {
              const errorData = JSON.parse(xhr.responseText);
              reject({
                success: false,
                message: errorData.message || `Failed to upload images. Status: ${xhr.status}`,
                data: null,
              });
            } catch (error) {
              reject({
                success: false,
                message: `Failed to upload images. Status: ${xhr.status}`,
                data: null,
              });
            }
          }
        };

        // Handle network errors
        xhr.onerror = () => {
          reject({
            success: false,
            message: "Network error occurred during upload",
            data: null,
          });
        };

        // Handle progress if callback provided
        if (typeof onProgress === "function") {
          xhr.upload.onprogress = (event) => {
            if (event.lengthComputable) {
              const percentComplete = Math.round((event.loaded / event.total) * 100);
              onProgress(percentComplete);
            }
          };
        }

        // Send the request
        xhr.send(formData);
      });
    } catch (error) {
      console.error("Error uploading images:", error);
      return {
        success: false,
        message: error.message || "An error occurred while uploading images",
        data: null,
      };
    }
  },

  // Other methods remain unchanged...
};

export default imageApi;