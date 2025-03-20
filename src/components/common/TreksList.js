"use client"

import { useState, useEffect } from "react"
import TrekCard from "./TrekCard"
import trekApi from "../../services/trekApi"

const TreksList = () => {
  const [treks, setTreks] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchTreks = async () => {
      try {
        const response = await trekApi.getAllTreks()
        if (response.success) {
          setTreks(response.data)
          console.log(response.data.imageUrl)
        } else {
          setError(response.message)
        }
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchTreks()
  }, [])

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>Error: {error}</div>
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6 bg-white">
      {loading ? (
        <div className="text-gray-600">Loading...</div>
      ) : error ? (
        <div className="text-gray-600">Error: {error}</div>
      ) : (
        treks.map((trek) => (
          <TrekCard
            key={trek.id}
            trekId={trek.id}
            images={trek.images || []}
            title={trek.title}
            type={trek.type}
            duration={trek.duration}
            pickup={trek.pickup}
            rating={trek.rating || 0}
            reviews={trek.reviews || 0}
            price={trek.price || 0}
            currency={trek.currency || 'MAD'}
          />
        ))
      )}
    </div>
  )
}

export default TreksList
