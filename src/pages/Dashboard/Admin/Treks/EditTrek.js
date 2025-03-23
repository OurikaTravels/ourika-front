"use client"

import { useState, useEffect } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { useAuth } from "../../../../context/AuthContext"
import { Link } from "react-router-dom"
import { ArrowLeft, Info, Loader } from "lucide-react"
import { toast } from "react-hot-toast"

import DashboardSidebar from "../../../../components/dashboard/DashboardSidebar"
import { TrekProgressSteps } from "../../../../components/treks/TrekProgressSteps"
import { BasicTrekForm } from "../../../../components/treks/BasicTrekForm"
import { StepContainer } from "../../../../components/treks/StepContainer"
import { StepNavigation } from "../../../../components/treks/StepNavigation"
import ServiceSelector from "../../../../components/treks/ServiceSelector"
import HighlightSelector from "../../../../components/treks/HighlightSelector"
import { ActivityForm } from "../../../../components/treks/ActivityForm"
import imageApi from "../../../../services/imageApi"
import { ImageUploadForm } from "../../../../components/treks/ImageUploadForm"

import trekApi from "../../../../services/trekApi"
import categoryApi from "../../../../services/categoryApi"
import highlightApi from "../../../../services/highlightApi"
import serviceApi from "../../../../services/serviceApi"
import activityApi from "../../../../services/activityApi"


const STEPS = [
  { id: 1, name: "Basic Information", description: "Trek details and category" },
  { id: 2, name: "Services", description: "Included services" },
  { id: 3, name: "Highlights", description: "Key attractions" },
  { id: 4, name: "Activities", description: "Trek activities and transportation" },
  { id: 5, name: "Images", description: "Trek photos and gallery" },
]

export default function EditTrek() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [activeSection, setActiveSection] = useState("treks")
  const [notifications] = useState(3)
  const [currentStep, setCurrentStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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

  const [categories, setCategories] = useState([])
  const [isLoadingCategories, setIsLoadingCategories] = useState(true)

  const [availableServices, setAvailableServices] = useState([])
  const [selectedServices, setSelectedServices] = useState([])
  const [isLoadingServices, setIsLoadingServices] = useState(false)

  const [availableHighlights, setAvailableHighlights] = useState([])
  const [selectedHighlights, setSelectedHighlights] = useState([])
  const [isLoadingHighlights, setIsLoadingHighlights] = useState(false)

  const [activities, setActivities] = useState([])
  const [isLoadingActivities, setIsLoadingActivities] = useState(false)

  const [trekImages, setTrekImages] = useState([])
  const [isLoadingImages, setIsLoadingImages] = useState(false)

  const [errors, setErrors] = useState({})

  const [hours, setHours] = useState("")
  const [minutes, setMinutes] = useState("")

  const parseDuration = (formattedDuration) => {
    if (!formattedDuration) return { hours: "", minutes: "" }
    
    const hoursMatch = formattedDuration.match(/(\d+)H/)
    const minutesMatch = formattedDuration.match(/(\d+)M/)
    
    return {
      hours: hoursMatch ? hoursMatch[1] : "",
      minutes: minutesMatch ? minutesMatch[1] : ""
    }
  }


  useEffect(() => {
    fetchCategories()
    fetchTrekData()
  }, [id])

  const fetchTrekData = async () => {
    setIsLoading(true)
    try {
      const response = await trekApi.getTrekById(id)
      if (response.success) {
        const trek = response.data
        

        const { hours, minutes } = parseDuration(trek.formattedDuration)


        setBasicInfo({
          title: trek.title || "",
          description: trek.description || "",
          duration: trek.formattedDuration || "",
          hours: hours,
          minutes: minutes,
          startLocation: trek.startLocation || "",
          endLocation: trek.endLocation || "",
          fullDescription: trek.fullDescription || "",
          price: trek.price || "",
          categoryId: trek.categoryId?.toString() || "", 
        })

 
        if (trek.services && trek.services.length > 0) {
          setSelectedServices(trek.services)
        }

        if (trek.highlights && trek.highlights.length > 0) {
          setSelectedHighlights(trek.highlights)
        }
      } else {
        throw new Error(response.message || "Failed to fetch trek data")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching trek data"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

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
    if (!id) return

    setIsLoadingActivities(true)
    try {
      const response = await activityApi.getTrekActivities(id)
      if (response.success) {
        setActivities(response.data)
      } else {
        throw new Error(response.message || "Failed to fetch activities")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while fetching activities"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsLoadingActivities(false)
    }
  }

  const fetchTrekImages = async () => {
    if (!id) return

    setIsLoadingImages(true)
    try {
      const response = await imageApi.getTrekImages(id)
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

  const handleBasicInfoChange = (e) => {
    const { name, value, formattedValue, hours, minutes } = e.target;
    
    if (name === 'duration') {
      setBasicInfo(prev => ({
        ...prev,
        duration: value, 
        formattedDuration: formattedValue, 
        hours: hours,
        minutes: minutes
      }));
    } else {
      const newValue = name === "price" ? (value === "" ? "" : Number.parseFloat(value)) : value;
      setBasicInfo(prev => ({
        ...prev,
        [name]: newValue,
      }));
    }

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: "",
      }));
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
      const response = await trekApi.updateTrek(id, basicInfo)

      if (response.success) {
        toast.success("Trek basic information updated successfully!")
        setCurrentStep(2)
        fetchServices()
      } else {
        throw new Error(response.message || "Failed to update trek")
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while updating the trek"
      setError(errorMessage)
      toast.error(errorMessage)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleCompleteServicesStep = async () => {
    setCurrentStep(3)
    fetchHighlights()
    toast.success("Services updated successfully!")
  }

  const handleCompleteHighlightsStep = () => {
    setCurrentStep(4)
    fetchActivities()
    toast.success("Highlights updated successfully!")
  }

  const handleCompleteActivitiesStep = () => {
    setCurrentStep(5)
    fetchTrekImages()
    toast.success("Activities updated successfully!")
  }

  const handleCompleteImagesStep = () => {
    toast.success("Images updated successfully!")
    navigate(`/admin/treks/${id}/preview`)
  }

  const handlePrevStep = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleActivityAdded = (activity) => {
    setActivities([...activities, activity])
    toast.success(`${activity.type === "TRANSPORTATION" ? "Transportation" : "Activity"} added successfully!`)
  }

  const handleActivityUpdated = (updatedActivity) => {
    setActivities(activities.map((activity) => (activity.id === updatedActivity.id ? updatedActivity : activity)))
    toast.success(`${updatedActivity.type === "TRANSPORTATION" ? "Transportation" : "Activity"} updated successfully!`)
  }

  const handleImagesUploaded = (newImages) => {
    setTrekImages((prev) => [...prev, ...newImages])
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#191b20] text-white flex">
        <DashboardSidebar
          isSidebarOpen={isSidebarOpen}
          setIsSidebarOpen={setIsSidebarOpen}
          activeSection={activeSection}
          setActiveSection={setActiveSection}
        />
        <div className={`flex-1 ${isSidebarOpen ? "ml-64" : "ml-20"} transition-all duration-300`}>
          <main className="p-6 flex justify-center items-center h-[calc(100vh-64px)]">
            <div className="flex flex-col items-center">
              <Loader className="w-12 h-12 text-[#fe5532] animate-spin mb-4" />
              <p className="text-gray-400">Loading trek data...</p>
            </div>
          </main>
        </div>
      </div>
    )
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

        <main className="p-6">

          <div className="mb-8">
            <div className="flex items-center mb-4">
              <Link to="/admin/treks/all-treks" className="mr-4 p-2 rounded-full hover:bg-[#232630] transition-colors">
                <ArrowLeft className="w-5 h-5 text-gray-300" />
              </Link>
              <h1 className="text-2xl font-bold text-white">Edit Trek</h1>
            </div>
            <p className="text-gray-400">Update trek information</p>
          </div>

 
          <TrekProgressSteps steps={STEPS} currentStep={currentStep} />

    
          {error && (
            <div className="mb-6 p-4 bg-[#fe5532]/10 border-l-4 border-[#fe5532] text-[#fe5532] rounded">
              <div className="flex items-center">
                <Info className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

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
                isEditMode={true}
              />
            </div>
          )}

          {currentStep === 2 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer title="Trek Services" isLoading={isLoadingServices} loadingText="Loading services...">
                <ServiceSelector
                  trekId={id}
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
                  trekId={id}
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
              <StepContainer
                title="Trek Activities"
                isLoading={isLoadingActivities}
                loadingText="Loading activities..."
              >
                <ActivityForm
                  trekId={id}
                  onActivityAdded={handleActivityAdded}
                  onActivityUpdated={handleActivityUpdated}
                />
                <StepNavigation
                  onPrevStep={handlePrevStep}
                  onNextStep={handleCompleteActivitiesStep}
                  isSubmitting={isSubmitting}
                />
              </StepContainer>
            </div>
          )}

          {currentStep === 5 && (
            <div className="bg-[#232630] rounded-lg shadow-md p-6 border border-gray-800">
              <StepContainer title="Trek Images" isLoading={isLoadingImages} loadingText="Loading images...">
                <ImageUploadForm trekId={id} onImagesUploaded={handleImagesUploaded} />
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

