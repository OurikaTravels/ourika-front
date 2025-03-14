"use client"

import { useState, useEffect } from "react"
import TrekCard from "./TrekCard" // Adjust the import path as necessary
import trekApi from "../../services/trekApi" // Adjust the import path as necessary

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
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
      {treks.map((trek) => (
        <TrekCard
          key={trek.id}
          imageUrl={trek.imageUrl}
          type={trek.type}
          title={trek.title}
          duration={trek.duration}
          pickup={trek.pickup}
          rating={trek.rating}
          reviews={trek.reviews}
          price={trek.price}
          currency={trek.currency}
          isFavorite={trek.isFavorite}
        />
      ))}
    </div>
  )
}

export default TreksList