import api from "./axiosConfig";

const addActivityToTrek = async (trekId, activityData) => {
  try {
    const response = await api.post(`/treks/${trekId}/activities`, activityData);
    return {
      success: true,
      message: "Activity added successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while adding the activity",
      data: null,
    };
  }
};

const getTrekActivities = async (trekId) => {
  try {
    const response = await api.get(`/treks/${trekId}/activities`);
    return {
      success: true,
      message: "Activities fetched successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching activities",
      data: null,
    };
  }
};

const removeActivityFromTrek = async (trekId, activityId) => {
  try {
    await api.delete(`/treks/${trekId}/activities/${activityId}`);
    return {
      success: true,
      message: "Activity removed successfully",
      data: null,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while removing the activity",
      data: null,
    };
  }
};

const updateActivityOrder = async (trekId, activityId, newOrder) => {
  try {
    const response = await api.patch(`/treks/${trekId}/activities/${activityId}/order`, {
      activityOrder: newOrder,
    });
    return {
      success: true,
      message: "Activity order updated successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while updating activity order",
      data: null,
    };
  }
};

const getActivityById = async (activityId) => {
  try {
    const response = await api.get(`/activities/${activityId}`);
    return {
      success: true,
      message: "Activity fetched successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while fetching the activity",
      data: null,
    };
  }
};

const updateActivity = async (activityId, activityData) => {
  try {
    const response = await api.put(`/activities/${activityId}`, activityData);
    return {
      success: true,
      message: "Activity updated successfully",
      data: response.data,
    };
  } catch (error) {
    return {
      success: false,
      message: error.response?.data?.message || "An error occurred while updating the activity",
      data: null,
    };
  }
};

const activityApi = {
  addActivityToTrek,
  getTrekActivities,
  removeActivityFromTrek,
  updateActivityOrder,
  getActivityById,
  updateActivity,
};

export default activityApi;