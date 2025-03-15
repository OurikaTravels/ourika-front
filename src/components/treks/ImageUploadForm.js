"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Trash, Loader, ImageIcon, AlertCircle, Check } from "lucide-react"
import { toast } from "react-hot-toast"
import imageApi from "../../services/imageApi"

export function ImageUploadForm({ trekId, onImagesUploaded }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [isSettingPrimary, setIsSettingPrimary] = useState(false)
  const [primaryImageId, setPrimaryImageId] = useState(null)
  const [showConfirmDialog, setShowConfirmDialog] = useState(false)
  const [imageToSetAsPrimary, setImageToSetAsPrimary] = useState(null)
  const fileInputRef = useRef(null)

  useEffect(() => {
    if (trekId) {
      fetchTrekImages()
    }
  }, [trekId])

  const fetchTrekImages = async () => {
    if (!trekId) return

    setIsLoadingImages(true)
    try {
      const response = await imageApi.getTrekImages(trekId)
      if (response.success) {
        const images = response.data
        setUploadedImages(images)

        // Find primary image if any
        const primaryImage = images.find((img) => img.isPrimary)
        if (primaryImage) {
          setPrimaryImageId(primaryImage.id)
        } else {
          setPrimaryImageId(null)
        }
      } else {
        toast.error(response.message || "Failed to fetch images")
      }
    } catch (error) {
      console.error("Error fetching images:", error)
      toast.error("An error occurred while fetching images")
    } finally {
      setIsLoadingImages(false)
    }
  }

  const handleFileSelect = (event) => {
    const files = Array.from(event.target.files)
    validateAndSetFiles(files)
  }

  const validateAndSetFiles = (files) => {
    const validFiles = files.filter((file) => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} is not an image file`)
        return false
      }

      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} is too large (max 5MB)`)
        return false
      }

      return true
    })

    setSelectedFiles((prevFiles) => [...prevFiles, ...validFiles])
  }

  const handleDragOver = (event) => {
    event.preventDefault()
    event.currentTarget.classList.add("border-[#ff5c5c]", "bg-red-50", "dark:bg-red-900/10")
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove("border-[#ff5c5c]", "bg-red-50", "dark:bg-red-900/10")
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove("border-[#ff5c5c]", "bg-red-50", "dark:bg-red-900/10")

    const files = Array.from(event.dataTransfer.files)
    validateAndSetFiles(files)
  }

  const handleRemoveFile = (index) => {
    setSelectedFiles((prevFiles) => {
      const newFiles = [...prevFiles]
      newFiles.splice(index, 1)
      return newFiles
    })
  }

  const handleDeleteUploadedImage = async (imageId) => {
    // Don't allow deleting the primary image
    const imageToDelete = uploadedImages.find((img) => img.id === imageId)
    if (imageToDelete?.isPrimary) {
      toast.error("Cannot delete the primary image. Please set another image as primary first.")
      return
    }

    if (!window.confirm("Are you sure you want to delete this image? This action cannot be undone.")) {
      return
    }

    try {
      const response = await imageApi.deleteTrekImage(trekId, imageId)

      if (response.success) {
        setUploadedImages((prevImages) => prevImages.filter((img) => img.id !== imageId))
        toast.success("Image deleted successfully")
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error deleting image:", error)
      toast.error(error.message || "Failed to delete image")
    }
  }

  // Show confirmation dialog before setting an image as primary
  const confirmSetImageAsPrimary = (imageId) => {
    // No need to check if image is already primary - the API will handle the toggle
    setImageToSetAsPrimary(imageId)
    setShowConfirmDialog(true)
  }

  // Replace handleSetImageAsPrimary function with handleToggleImagePrimary
  // Remove the handleRemovePrimaryStatus function entirely

  // Replace this function:
  // const handleSetImageAsPrimary = async () => { ... }

  // With this new function:
  const handleToggleImagePrimary = async () => {
    if (!imageToSetAsPrimary) return

    setIsSettingPrimary(true)
    setShowConfirmDialog(false)

    try {
      const response = await imageApi.toggleImagePrimaryStatus(trekId, imageToSetAsPrimary)

      if (response.success) {
        // Refresh the images to get the updated primary status
        await fetchTrekImages()
        toast.success("Image primary status updated successfully")
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error toggling primary image:", error)
      toast.error(error.message || "Failed to update primary image status")
    } finally {
      setIsSettingPrimary(false)
      setImageToSetAsPrimary(null)
    }
  }

  // Handle upload of images
  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image")
      return
    }

    // Check minimum file requirement
    if (selectedFiles.length < 4) {
      toast.error("At least 4 images are required for upload")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      const response = await imageApi.uploadTrekImages(trekId, selectedFiles, (progress) => setUploadProgress(progress))

      if (!response.success) {
        throw new Error(response.message)
      }

      toast.success("Images uploaded successfully")
      setSelectedFiles([])

      // Refresh the images list
      fetchTrekImages()

      if (onImagesUploaded) {
        onImagesUploaded(response.data)
      }
    } catch (error) {
      console.error("Error uploading images:", error)
      toast.error(error.message || "Failed to upload images")
    } finally {
      setIsUploading(false)
      setUploadProgress(0)
    }
  }

  const renderPreview = (file, index) => {
    return (
      <div
        key={`${file.name}-${index}`}
        className="relative group rounded-lg overflow-hidden border-2 border-gray-200 dark:border-gray-700 shadow-sm hover:shadow-md transition-all duration-200"
      >
        <div className="aspect-square">
          <img
            src={URL.createObjectURL(file) || "/placeholder.svg?height=200&width=200"}
            alt={`Preview ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center">
          <button
            onClick={() => handleRemoveFile(index)}
            className="p-2 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-colors transform scale-0 group-hover:scale-100 duration-200"
            title="Remove Image"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs px-2 py-1 truncate">
          {file.name}
        </div>
      </div>
    )
  }

  const renderUploadedImage = (image) => {
    const isPrimary = image.isPrimary || image.id === primaryImageId

    return (
      <div
        key={image.id}
        className={`relative group rounded-lg overflow-hidden border-2 ${
          isPrimary ? "border-[#ff5c5c] ring-2 ring-[#ff5c5c] ring-opacity-50" : "border-gray-200 dark:border-gray-700"
        } shadow-sm hover:shadow-md transition-all duration-200`}
      >
        <div className="aspect-square">
          <img
            src={`http://localhost:8080/api/treks/${trekId}/images/${image.path}`}
            alt={`Trek image ${image.id}`}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.onerror = null
              e.target.src = "/placeholder.svg?height=200&width=200"
            }}
          />
        </div>
        <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-40 transition-all duration-200 flex items-center justify-center gap-3">
          <button
            onClick={() => confirmSetImageAsPrimary(image.id)}
            disabled={isSettingPrimary}
            className={`p-2 rounded-full bg-white text-gray-800 ${
              isPrimary ? "hover:bg-yellow-500" : "hover:bg-[#ff5c5c]"
            } hover:text-white transition-colors transform scale-0 group-hover:scale-100 duration-200`}
            title="Toggle Primary Image Status"
          >
            <ImageIcon className="w-5 h-5" />
          </button>
          <button
            onClick={() => handleDeleteUploadedImage(image.id)}
            disabled={isSettingPrimary || isPrimary}
            className={`p-2 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-colors transform scale-0 group-hover:scale-100 duration-200 ${
              isPrimary ? "opacity-50 cursor-not-allowed" : ""
            }`}
            title={isPrimary ? "Cannot delete primary image" : "Delete Image"}
          >
            <Trash className="w-5 h-5" />
          </button>
        </div>
        {isPrimary && (
          <div className="absolute top-2 left-2 px-2 py-1 bg-[#ff5c5c] text-white text-xs rounded-full flex items-center">
            <Check className="w-3 h-3 mr-1" />
            Primary
          </div>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Confirmation Dialog for Setting Primary Image */}
      {showConfirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full shadow-xl">
            <div className="flex items-start mb-4">
              <AlertCircle className="w-6 h-6 text-amber-500 mr-3 flex-shrink-0" />
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">Update Primary Image</h3>
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  This will toggle the primary status of this image. The primary image is used as the main image for
                  this trek.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleToggleImagePrimary}
                className="px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors"
              >
                Update Primary Status
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 p-4 rounded-r-md">
        <div className="flex">
          <div className="flex-shrink-0">
            <AlertCircle className="h-5 w-5 text-blue-500" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">Image Requirements</h3>
            <div className="mt-2 text-sm text-blue-700 dark:text-blue-400">
              <ul className="list-disc pl-5 space-y-1">
                <li>You must upload at least 4 images</li>
                <li>Each image must be less than 5MB</li>
                <li>Supported formats: JPG, PNG, GIF</li>
                <li>One image must be set as the primary image</li>
                <li>You can toggle an image's primary status by clicking the image icon</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-8 text-center cursor-pointer hover:border-[#ff5c5c] transition-colors"
      >
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileSelect}
          className="hidden"
        />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
          Drag and drop your images here, or click to select files
        </p>
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">
          PNG, JPG, GIF up to 5MB. At least 4 images required.
        </p>
      </div>

      {/* Selected Files Preview */}
      {selectedFiles.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Selected Images</h3>
            <span
              className={`text-sm font-medium ${selectedFiles.length >= 4 ? "text-green-600 dark:text-green-400" : "text-amber-600 dark:text-amber-400"}`}
            >
              {selectedFiles.length} of 4 required
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {selectedFiles.map((file, index) => renderPreview(file, index))}
          </div>

          {/* Upload Progress */}
          {isUploading && (
            <div className="mt-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Uploading...</span>
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{uploadProgress}%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                <div
                  className="bg-[#ff5c5c] h-2.5 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                ></div>
              </div>
            </div>
          )}

          {/* Upload Button */}
          <button
            onClick={handleUpload}
            disabled={isUploading || selectedFiles.length < 4}
            className="w-full flex items-center justify-center px-4 py-3 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isUploading ? (
              <>
                <Loader className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-5 h-5 mr-2" />
                Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Image" : "Images"}
              </>
            )}
          </button>

          {selectedFiles.length < 4 && (
            <p className="text-sm text-amber-600 dark:text-amber-400 text-center">
              Please select at least 4 images to upload
            </p>
          )}
        </div>
      )}

      {/* Uploaded Images */}
      {isLoadingImages ? (
        <div className="flex justify-center items-center p-8 bg-white dark:bg-gray-800 rounded-lg shadow-sm">
          <Loader className="animate-spin h-8 w-8 text-[#ff5c5c]" />
          <span className="ml-3 text-gray-600 dark:text-gray-300">Loading images...</span>
        </div>
      ) : (
        uploadedImages.length > 0 && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Trek Images</h3>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {uploadedImages.length} {uploadedImages.length === 1 ? "image" : "images"}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {uploadedImages.map((image) => renderUploadedImage(image))}
            </div>

            <div className="bg-gray-50 dark:bg-gray-700/30 rounded-md p-4 mt-4">
              <div className="flex items-start">
                <ImageIcon className="w-5 h-5 text-gray-500 dark:text-gray-400 mt-0.5 mr-2" />
                <div>
                  <h4 className="text-sm font-medium text-gray-900 dark:text-white">Managing Images</h4>
                  <ul className="mt-1 text-sm text-gray-500 dark:text-gray-400 space-y-1">
                    <li>• Hover over an image to see available actions</li>
                    <li>
                      • Click the <ImageIcon className="inline-block w-3 h-3" /> icon to toggle primary status
                    </li>
                    <li>• The primary image cannot be deleted</li>
                    <li>• You can remove primary status from an image and set another as primary</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )
      )}
    </div>
  )
}

