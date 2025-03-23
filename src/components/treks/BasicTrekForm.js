"use client";
import { Link } from "react-router-dom";
import { Save, Loader, Clock, DollarSign, MapPin } from "lucide-react";
import DurationPicker from "react-duration-picker";

export function BasicTrekForm({
  basicInfo,
  onBasicInfoChange,
  onSubmit,
  categories,
  isLoadingCategories,
  errors,
  isSubmitting,
  isEditMode = false,
}) {
  // Function to parse both API duration format and formatted duration
  const parseDuration = (duration) => {
    if (!duration) return { hours: "", minutes: "" };
    
    // Handle API format (PT240H)
    if (duration.startsWith('PT')) {
      const hoursMatch = duration.match(/PT(\d+)H/);
      return {
        hours: hoursMatch ? hoursMatch[1] : "",
        minutes: "0"
      };
    }
    
    // Handle formatted duration (240H0M)
    const hoursMatch = duration.match(/(\d+)H/);
    const minutesMatch = duration.match(/(\d+)M/);
    
    return {
      hours: hoursMatch ? hoursMatch[1] : "",
      minutes: minutesMatch ? minutesMatch[1] : "0"
    };
  };

  // Get the current duration values
  const currentDuration = isEditMode 
    ? parseDuration(basicInfo.duration || basicInfo.formattedDuration)
    : { hours: "", minutes: "0" };

  // Function to format duration for API request (e.g., hours and minutes -> "PT240H")
  const formatDurationForRequest = (hours, minutes) => {
    const totalHours = parseInt(hours) + (parseInt(minutes || 0) / 60);
    return `PT${Math.floor(totalHours)}H`;
  };

  // Modified handleDurationChange
  const handleDurationChange = (e) => {
    const { name, value } = e.target;
    
    // Update the hours or minutes based on which input changed
    let hours = name === 'hours' ? value : currentDuration.hours;
    let minutes = name === 'minutes' ? value : currentDuration.minutes;

    // Ensure we have valid numbers
    hours = hours || "0";
    minutes = minutes || "0";
    
    // Create both formats
    const apiDuration = `PT${hours}H`;
    const formattedDuration = `${hours}H${minutes}M`;

    // Update the form state with both formats
    onBasicInfoChange({
      target: {
        name: 'duration',
        value: apiDuration,
        formattedValue: formattedDuration,
        hours: hours,
        minutes: minutes
      }
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
        {isEditMode ? "Update Trek Information" : "Basic Trek Information"}
      </h2>

      <form onSubmit={onSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Title */}
          <div className="col-span-2">
            <label
              htmlFor="title"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Trek Title <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={basicInfo.title}
              onChange={onBasicInfoChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.title
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
              placeholder="Enter trek title"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.title}
              </p>
            )}
          </div>

          {/* Short Description */}
          <div className="col-span-2">
            <label
              htmlFor="description"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Short Description <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={basicInfo.description}
              onChange={onBasicInfoChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.description
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
              placeholder="Brief description of the trek"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.description}
              </p>
            )}
          </div>

          {/* Duration Fields */}
          <div>
            <label
              htmlFor="duration"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Duration <span className="text-red-500">*</span>
            </label>
            <div className="flex gap-4">
              <div className="flex-1">
                <label
                  htmlFor="hours"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Hours
                </label>
                <input
                  type="number"
                  id="hours"
                  name="hours"
                  value={currentDuration.hours}
                  onChange={handleDurationChange}
                  min="0"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.duration
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                  placeholder="e.g., 1"
                />
              </div>
              <div className="flex-1">
                <label
                  htmlFor="minutes"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                >
                  Minutes
                </label>
                <input
                  type="number"
                  id="minutes"
                  name="minutes"
                  value={currentDuration.minutes}
                  onChange={handleDurationChange}
                  min="0"
                  max="59"
                  className={`w-full px-4 py-2 rounded-lg border ${
                    errors.duration
                      ? "border-red-500 dark:border-red-500"
                      : "border-gray-300 dark:border-gray-600"
                  } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                  placeholder="e.g., 30"
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              Example: 1 hour and 30 minutes
            </p>
            {errors.duration && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.duration}
              </p>
            )}
          </div>

          {/* Price */}
          <div>
            <label
              htmlFor="price"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Price <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <DollarSign className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="number"
                id="price"
                name="price"
                value={basicInfo.price}
                onChange={onBasicInfoChange}
                min="0"
                step="0.01"
                className={`w-full pl-10 px-4 py-2 rounded-lg border ${
                  errors.price
                    ? "border-red-500 dark:border-red-500"
                    : "border-gray-300 dark:border-gray-600"
                } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
                placeholder="0.00"
              />
            </div>
            {errors.price && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.price}
              </p>
            )}
          </div>

          {/* Location Fields */}
          <LocationFields
            basicInfo={basicInfo}
            onBasicInfoChange={onBasicInfoChange}
            errors={errors}
          />

          {/* Category Selection */}
          <div className="col-span-2">
            <label
              htmlFor="categoryId"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Category <span className="text-red-500">*</span>
            </label>
            <select
              id="categoryId"
              name="categoryId"
              value={basicInfo.categoryId}
              onChange={onBasicInfoChange}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.categoryId
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
            >
              <option value="">Select a category</option>
              {isLoadingCategories ? (
                <option disabled>Loading categories...</option>
              ) : (
                categories.map((category) => (
                  <option key={category.id} value={category.id.toString()}>
                    {category.name}
                  </option>
                ))
              )}
            </select>
            {errors.categoryId && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.categoryId}
              </p>
            )}
          </div>

          {/* Full Description */}
          <div className="col-span-2">
            <label
              htmlFor="fullDescription"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
            >
              Full Description <span className="text-red-500">*</span>
            </label>
            <textarea
              id="fullDescription"
              name="fullDescription"
              value={basicInfo.fullDescription}
              onChange={onBasicInfoChange}
              rows={6}
              className={`w-full px-4 py-2 rounded-lg border ${
                errors.fullDescription
                  ? "border-red-500 dark:border-red-500"
                  : "border-gray-300 dark:border-gray-600"
              } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
              placeholder="Detailed description of the trek experience"
            />
            {errors.fullDescription && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.fullDescription}
              </p>
            )}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
          <Link
            to="/admin/treks/all-treks"
            className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            Cancel
          </Link>
          <button
            type="submit"
            disabled={isSubmitting}
            className="flex items-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
                {isEditMode ? "Updating..." : "Saving..."}
              </>
            ) : (
              <>
                <Save className="w-5 h-5 mr-2" />
                {isEditMode ? "Update & Continue" : "Save & Continue"}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

// Location Fields Component
function LocationFields({ basicInfo, onBasicInfoChange, errors }) {
  return (
    <>
      <div>
        <label
          htmlFor="startLocation"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          Start Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="startLocation"
            name="startLocation"
            value={basicInfo.startLocation}
            onChange={onBasicInfoChange}
            className={`w-full pl-10 px-4 py-2 rounded-lg border ${
              errors.startLocation
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
            placeholder="Starting point of the trek"
          />
        </div>
        {errors.startLocation && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.startLocation}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="endLocation"
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
        >
          End Location <span className="text-red-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            id="endLocation"
            name="endLocation"
            value={basicInfo.endLocation}
            onChange={onBasicInfoChange}
            className={`w-full pl-10 px-4 py-2 rounded-lg border ${
              errors.endLocation
                ? "border-red-500 dark:border-red-500"
                : "border-gray-300 dark:border-gray-600"
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#ff5c5c] focus:border-transparent`}
            placeholder="Ending point of the trek"
          />
        </div>
        {errors.endLocation && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.endLocation}
          </p>
        )}
      </div>
    </>
  );
}
