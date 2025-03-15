// Activity API Service

/**
 * Adds an activity to a trek
 * @param {string} trekId - The ID of the trek
 * @param {Object} activityData - The activity data to add
 * @returns {Promise<Object>} - The response from the API
 */
const addActivityToTrek = async (trekId, activityData) => {
  try {
    const token = localStorage.getItem("token");
    const response = await fetch(
      `http://localhost:8080/api/treks/${trekId}/activities`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(activityData),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to add activity. Status: ${response.status}`,
        data: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Activity added successfully",
      data,
    };
  } catch (error) {
    console.error("Error adding activity:", error);
    return {
      success: false,
      message: error.message || "An error occurred while adding the activity",
      data: null,
    };
  }
};

/**
 * Gets all activities for a trek
 * @param {string} trekId - The ID of the trek
 * @returns {Promise<Object>} - The response from the API
 */
const getTrekActivities = async (trekId) => {
  try {
     const response = await fetch(
      `http://localhost:8080/api/treks/${trekId}/activities`
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to fetch activities. Status: ${response.status}`,
        data: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Activities fetched successfully",
      data,
    };
  } catch (error) {
    console.error("Error fetching activities:", error);
    return {
      success: false,
      message: error.message || "An error occurred while fetching activities",
      data: null,
    };
  }
};

/**
 * Removes an activity from a trek
 * @param {string} trekId - The ID of the trek
 * @param {string} activityId - The ID of the activity to remove
 * @returns {Promise<Object>} - The response from the API
 */
const removeActivityFromTrek = async (trekId, activityId) => {
  try {
    const token = localStorage.getItem("token");  
    const response = await fetch(
      `http://localhost:8080/api/treks/${trekId}/activities/${activityId}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to remove activity. Status: ${response.status}`,
        data: null,
      };
    }

    return {
      success: true,
      message: "Activity removed successfully",
      data: null,
    };
  } catch (error) {
    console.error("Error removing activity:", error);
    return {
      success: false,
      message: error.message || "An error occurred while removing the activity",
      data: null,
    };
  }
};

/**
 * Updates an activity's order
 * @param {string} trekId - The ID of the trek
 * @param {string} activityId - The ID of the activity
 * @param {number} newOrder - The new order for the activity
 * @returns {Promise<Object>} - The response from the API
 */
const updateActivityOrder = async (trekId, activityId, newOrder) => {
  try {
    const response = await fetch(
      `http://localhost:8080/api/treks/${trekId}/activities/${activityId}/order`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ activityOrder: newOrder }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        message:
          errorData.message ||
          `Failed to update activity order. Status: ${response.status}`,
        data: null,
      };
    }

    const data = await response.json();
    return {
      success: true,
      message: "Activity order updated successfully",
      data,
    };
  } catch (error) {
    console.error("Error updating activity order:", error);
    return {
      success: false,
      message:
        error.message || "An error occurred while updating activity order",
      data: null,
    };
  }
};

const activityApi = {
  addActivityToTrek,
  getTrekActivities,
  removeActivityFromTrek,
  updateActivityOrder,
};

export default activityApi;
