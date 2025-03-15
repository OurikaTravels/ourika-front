"use client"

import { useState, useRef, useEffect } from "react"
import { Upload, X, Trash, Loader, ImageIcon } from "lucide-react"
import { toast } from "react-hot-toast"
import imageApi from "../../services/imageApi"

export function ImageUploadForm({ trekId, onImagesUploaded }) {
  const [selectedFiles, setSelectedFiles] = useState([])
  const [uploadedImages, setUploadedImages] = useState([])
  const [isPrimary, setIsPrimary] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [isLoadingImages, setIsLoadingImages] = useState(false)
  const [isSettingPrimary, setIsSettingPrimary] = useState(false)
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
        setUploadedImages(response.data)
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
    event.currentTarget.classList.add("border-[#ff5c5c]")
  }

  const handleDragLeave = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove("border-[#ff5c5c]")
  }

  const handleDrop = (event) => {
    event.preventDefault()
    event.currentTarget.classList.remove("border-[#ff5c5c]")

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

  const handleSetImageAsPrimary = async (imageId) => {
    setIsSettingPrimary(false)
    try {
      const response = await imageApi.setImageAsPrimary(trekId, imageId)

      if (response.success) {
        // Update the local state to reflect the change
        setUploadedImages((prevImages) =>
          prevImages.map((img) => ({
            ...img,
            isPrimary: img.id === imageId,
          })),
        )
        toast.success("Primary image updated successfully")
      } else {
        throw new Error(response.message)
      }
    } catch (error) {
      console.error("Error setting primary image:", error)
      toast.error(error.message || "Failed to set primary image")
    } finally {
      setIsSettingPrimary(false)
    }
  }

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      toast.error("Please select at least one image")
      return
    }

    setIsUploading(true)
    setUploadProgress(0)

    try {
      // Create a map of which file is primary
      const primaryMap = selectedFiles.map((_, idx) => idx === isPrimary)

      const response = await imageApi.uploadTrekImages(
        trekId,
        selectedFiles,
        primaryMap, // Pass the primary map instead of a single boolean
        (progress) => setUploadProgress(progress),
      )

      if (!response.success) {
        throw new Error(response.message)
      }

      toast.success("Images uploaded successfully")
      setSelectedFiles([])
      setIsPrimary(null) // Reset primary selection

      // Refresh the images list to get the updated data
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
    // We don't need this function anymore as we've integrated the preview with primary selection
    return null
  }

  const renderUploadedImage = (image) => {
    return (
      <div
        key={image.id}
        className={`relative group rounded-lg overflow-hidden border-2 ${
          image.isPrimary ? "border-[#ff5c5c]" : "border-gray-200 dark:border-gray-700"
        }`}
      >
        <img
          src={`http://localhost:8080/api/images/${image.path}`}
          alt={`Trek image ${image.id}`}
          className="w-full h-32 object-cover"
          onError={(e) => {
            e.target.onerror = null
            e.target.src = "/placeholder.svg"
          }}
        />
        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
          {!image.isPrimary && (
            <button
              onClick={() => handleSetImageAsPrimary(image.id)}
              disabled={isSettingPrimary}
              className="p-1 rounded-full bg-white text-gray-800 hover:bg-[#ff5c5c] hover:text-white transition-colors"
              title="Set as Primary Image"
            >
              <ImageIcon className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={() => handleDeleteUploadedImage(image.id)}
            disabled={isSettingPrimary}
            className="p-1 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-colors"
            title="Delete Image"
          >
            <Trash className="w-4 h-4" />
          </button>
        </div>
        {image.isPrimary && (
          <span className="absolute top-2 left-2 px-2 py-1 bg-[#ff5c5c] text-white text-xs rounded-full">Primary</span>
        )}
      </div>
    )
  }

  return (
    <div className="space-y-6">
      
      <div className="mb-4">
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Select Primary Image</h3>
        {selectedFiles.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {selectedFiles.map((file, index) => (
              <div
                key={`${file.name}-${index}`}
                className={`relative group rounded-lg overflow-hidden border-2 ${
                  isPrimary === index ? "border-[#ff5c5c]" : "border-gray-200 dark:border-gray-700"
                } cursor-pointer`}
                onClick={() => setIsPrimary(index)}
              >
                <img
                  src={URL.createObjectURL(file) || "/placeholder.svg"}
                  alt={`Preview ${index + 1}`}
                  className="w-full h-32 object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                  <input
                    type="radio"
                    checked={isPrimary === index}
                    onChange={() => setIsPrimary(index)}
                    className="form-radio h-5 w-5 text-[#ff5c5c]"
                  />
                </div>
                {isPrimary === index && (
                  <span className="absolute top-2 left-2 px-2 py-1 bg-[#ff5c5c] text-white text-xs rounded-full">
                    Primary
                  </span>
                )}
                <div className="absolute bottom-2 right-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleRemoveFile(index)
                    }}
                    className="p-1 rounded-full bg-white text-gray-800 hover:bg-red-500 hover:text-white transition-colors"
                    title="Remove Image"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 dark:text-gray-400">Upload images to select a primary image</p>
        )}
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
        <p className="mt-1 text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 5MB</p>
      </div>

      {/* Upload Progress */}
      {isUploading && (
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5 mb-4">
          <div
            className="bg-[#ff5c5c] h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${uploadProgress}%` }}
          ></div>
        </div>
      )}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        disabled={isUploading}
        className="w-full flex items-center justify-center px-4 py-2 bg-[#ff5c5c] text-white rounded-md hover:bg-[#ff4040] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
      >
        {isUploading ? (
          <>
            <Loader className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" />
            Uploading...
          </>
        ) : (
          <>
            <Upload className="w-5 h-5 mr-2" />
            Upload {selectedFiles.length} {selectedFiles.length === 1 ? "Image" : "Images"}
          </>
        )}
      </button>

      {/* Uploaded Images */}
      {isLoadingImages ? (
        <div className="flex justify-center items-center p-6">
          <Loader className="animate-spin h-8 w-8 text-[#ff5c5c]" />
          <span className="ml-2 text-gray-600 dark:text-gray-300">Loading images...</span>
        </div>
      ) : (
        uploadedImages.length > 0 && (
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Uploaded Images</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {uploadedImages.map((image) => renderUploadedImage(image))}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              <p>
                <span className="font-medium">Tip:</span> Hover over an image and click the{" "}
                <ImageIcon className="inline-block w-4 h-4" /> icon to set it as the primary image.
              </p>
            </div>
          </div>
        )
      )}
    </div>
  )
}

