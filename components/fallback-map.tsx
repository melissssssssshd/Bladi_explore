"use client"

import { useEffect, useRef } from "react"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

export default function MapComponent({ initialCoordinates }: { 
  initialCoordinates: [number, number] 
}) {
  const mapRef = useRef<L.Map | null>(null)
  const markerRef = useRef<L.Marker | null>(null)

  useEffect(() => {
    // Initialiser la carte
    if (typeof window !== "undefined") {
      const map = L.map("map").setView(initialCoordinates, 13)
      
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '© OpenStreetMap'
      }).addTo(map)

      // Ajouter le marqueur
      markerRef.current = L.marker(initialCoordinates)
        .addTo(map)
        .bindPopup(initialCoordinates.join(", "))

      mapRef.current = map

      return () => {
        map.remove()
      }
    }
  }, [initialCoordinates])

  return <div id="map" className="h-full w-full" />
}