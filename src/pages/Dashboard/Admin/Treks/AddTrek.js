"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../../../context/AuthContext"
import { Link } from "react-router-dom"
import { ArrowLeft, Info } from "lucide-react"
import { toast } from "react-hot-toast"

import DashboardHeader from "../../../../components/dashboard/DashboardHeader"
import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import { TrekProgressSteps } from "../../../../components/treks/TrekProgressSteps"
import { BasicTrekForm } from "../../../../components/treks/BasicTrekForm"
import { StepContainer } from "../../../../components/treks/StepContainer"
import { StepNavigation } from "../../../../components/treks/StepNavigation"
import { ActivityForm } from "../../../../components/treks/ActivityForm"
import ServiceSelector from "../../../../components/treks/ServiceSelector"
import HighlightSelector from "../../../../components/treks/HighlightSelector"
import { ImageUploadForm } from "../../../../components/treks/ImageUploadForm"
import imageApi from "../../../../services/imageApi"

import trekApi from "../../../../services/trekApi"
import categoryApi from "../../../../services/categoryApi"
import highlightApi from "../../../../services/highlightApi"
import serviceApi from "../../../../services/serviceApi"
import activityApi from "../../../../services/activityApi"

// Steps configuration
const STEPS = [
  { id: 1, name: "Basic Information", description: "Trek details and category" },
  { id: 2, name: "Services", description: "Included services" },
  { id: 3, name: "Highlights", description: "Key attractions" },
  { id: 4, name: "Activities", description: "Trek activities and transportation" },
  { id: 5, name: "Images", description: "Trek photos and gallery" },
]

export default function AddTrek() {
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [redirectToList, setRedirectToList] = useState(false)

  // Trek Data States
  const [trekId, setTrekId] = useState(null)
  const [basicInfo, setBasicInfo] = useState({
    title: "",
    description: "",
    duration: "",
    startLocation: "",
    endLocation: "",
    fullDescription: "",
    price: "",
    categoryId: "",
  })

  // Categories State
  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  // Services State
  const [availableServices, setAvailableServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  // Highlights State
  const [availableHighlights, setAvailableHighlights] = useState([])
  const [selectedHighlights, setSelectedHighlights] = useState([])
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(false)

  // Activities State
  const [activities, setActivities] = useState([])

  // Add state for images
  const [trekImages, setTrekImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  // Form validation errors
  const [errors, setErrors] = useState({})

  // Effects
  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (redirectToList) {
      window.location.href = "/admin/treks/all-treks"
    }
  }, [redirectToList])

  useEffect(() => {
    if (trekId) {
      console.log("Trek ID set:", trekId)
    }
  }, [trekId])

  // API Calls
  const fetchCategories = async () => {
    setIsLoadingCategories(true)
    try {
      const response = await categoryApi.getAllCategories()
      if (response.success) {
        setCategories(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch categories")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching categories"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingCategories(false)
    }
  }

  const fetchServices = async () => {
    setIsLoadingServices(true)
    try {
      const response = await serviceApi.getAllServices()
      if (response.success) {
        setAvailableServices(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch services")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching services"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingServices(false)
    }
  }

  const fetchHighlights = async () => {
    setIsLoadingHighlights(true)
    try {
      const response = await highlightApi.getAllHighlights()
      if (response.success) {
        setAvailableHighlights(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch highlights")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching highlights"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingHighlights(false)
    }
  }

  const fetchActivities = async () => {
    if (!trekId) return

    try {
      const response = await activityApi.getTrekActivities(trekId)
      if (response.success) {
        setActivities(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch activities")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching activities"
      setError(errorMessage)
      toast.error(errorMessage)
    }
  }

  // Add function to fetch images
  const fetchTrekImages = async () => {
    if (!trekId) return

    setIsLoadingImages(true)
    try {
      const response = await imageApi.getTrekImages(trekId)
      if (response.success) {
        setTrekImages(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch images")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching images"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingImages(false)
    }
  }

  // Event Handlers
  const handleBasicInfoChange = (e) => {
    const { name, value } = e.target
    const newValue = name === "price" ? (value === "" ? "" : Number.parseFloat(value)) : value

    setBasicInfo((prev) => ({
      ...prev,
      [name]: newValue,
    }))

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateBasicInfo = () => {
    const newErrors = {}
    const requiredFields = [
      "title",
      "description",
      "duration",
      "startLocation",
      "endLocation",
      "fullDescription",
      "categoryId",
    ]

    requiredFields.forEach((field) => {
      if (!basicInfo[field]?.toString().trim()) {
        newErrors[field] = `${field.charAt(0).toUpperCase() + field.slice(1)} is required`
      }
    })

    if (basicInfo.price === "" || isNaN(basicInfo.price)) {
      newErrors.price = "Price must be a valid number"
    } else if (Number.parseFloat(basicInfo.price) <= 0) {
      newErrors.price = "Price must be greater than zero"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmitBasicInfo = async (e) => {
    e.preventDefault()

    if (!validateBasicInfo()) {
      toast.error("Please fill in all required fields correctly")
      return
    }

    setIsSubmitting(true)

    try {
      const response = await trekApi.createTrek(basicInfo)

      if (response.success) {
        const newTrekId = response.data.id
        if (!newTrekId) {
          throw new Error("Trek ID not found in the response")
        }

        setTrekId(newTrekId)
        toast.success("Trek basic information saved successfully!")
        setCurrentStep(2)
        fetchServices()
      } else {
        throw new Error(response.message || "Failed to create trek")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while creating the trek"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  // Update handleCompleteActivitiesStep
  const handleCompleteActivitiesStep = () => {
    setCurrentStep(5)
    fetchTrekImages()
    toast.success("Activities saved successfully!")
  }

  // Add handler for completing images step
  const handleCompleteImagesStep = () => {
    toast.success("Trek created successfully!")
    // Redirect to preview page instead of list
    window.location.href = `/admin/treks/${trekId}/preview`
  }

  // Add handler for when images are uploaded
  const handleImagesUploaded = (newImages) => {
    setTrekImages((prev) => [...prev, ...newImages])
  }

  const handleCompleteServicesStep = async () => {
    setCurrentStep(3)
    fetchHighlights()
    toast.success("Services saved successfully!")
  }

  const handleCompleteHighlightsStep = () => {
    setCurrentStep(4)
    fetchActivities()
    toast.success("Highlights saved successfully!")
  }

  const handleActivityAdded = (activity) => {
    setActivities([...activities, activity])
    toast.success(`${activity.type === "TRANSPORTATION" ? "Transportation" : "Activity"} added successfully!`)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  return (
    <div className="min-h-screen bg-[#191b20] text-white flex">
      <DashboardSidebar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
        activeSection={activeSection}
        setActiveSection={setActiveSection}
      />

      <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
        <DashboardHeader user={user} notifications={notifications} />

        <main className="p-6">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link to="/admin/treks/all-treks" className="mr-4 p-2 rounded-full hover:bg-[#232630] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Add New Trek</h1>
            </div>
            <p className="text-gray-400">Create a new trek experience for your customers</p>
          </div>

          {/* Progress Steps */}
          <TrekProgressSteps steps={STEPS} currentStep={currentStep} />

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          {/* Step Content */}
          {currentStep === 1 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <BasicTrekForm
                basicInfo={basicInfo}
                onBasicInfoChange={handleBasicInfoChange}
                onSubmit={handleSubmitBasicInfo}
                categories={categories}
                isLoadingCategories={isLoadingCategories}
                errors={errors}
                isSubmitting={isSubmitting}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer title="Trek Services" isLoading={isLoadingServices} loadingText="Loading services...">
                <ServiceSelector
                  trekId={trekId}
                  availableServices={availableServices}
                  selectedServices={selectedServices}
                  setSelectedServices={setSelectedServices}
                />
                <StepNavigation
                  onPrevStep={handlePrevStep}
                  onNextStep={handleCompleteServicesStep}
                  isSubmitting={isSubmitting}
                />
              </StepContainer>
            </div>
          )}

          {currentStep === 3 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer
                title="Trek Highlights"
                isLoading={isLoadingHighlights}
                loadingText="Loading highlights..."
              >
                <HighlightSelector
                  trekId={trekId}
                  availableHighlights={availableHighlights}
                  selectedHighlights={selectedHighlights}
                  setSelectedHighlights={setSelectedHighlights}
                />
                <StepNavigation
                  onPrevStep={handlePrevStep}
                  onNextStep={handleCompleteHighlightsStep}
                  isSubmitting={isSubmitting}
                />
              </StepContainer>
            </div>
          )}

          {currentStep === 4 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer title="Trek Activities">
                <ActivityForm trekId={trekId} onActivityAdded={handleActivityAdded} />
                <StepNavigation
                  onPrevStep={handlePrevStep}
                  onNextStep={handleCompleteActivitiesStep}
                  isSubmitting={isSubmitting}
                />
              </StepContainer>
            </div>
          )}

          {/* Add the Images step */}
          {currentStep === 5 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer title="Trek Images" isLoading={isLoadingImages} loadingText="Loading images...">
                <ImageUploadForm trekId={trekId} onImagesUploaded={handleImagesUploaded} />
                <StepNavigation
                  onPrevStep={handlePrevStep}
                  onNextStep={handleCompleteImagesStep}
                  isSubmitting={isSubmitting}
                  isLastStep
                />
              </StepContainer>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

