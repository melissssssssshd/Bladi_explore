"use client"

import { useState, useRef, useEffect } from "react"
import {
  MapPin,
  Navigation,
  Search,
  Compass,
  Volume2,
  VolumeX,
  Pause,
  Play,
  Car,
  FootprintsIcon as Walking,
} from "lucide-react"

import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import * as L from "leaflet" // Import Leaflet
import { Button } from "@/components/ui/button"; // Import depuis votre dossier components
import { ArrowLeft } from "lucide-react";
export default function NavigationAppSimplified() {
  const [mapLoaded, setMapLoaded] = useState(false)
  const [mapError, setMapError] = useState<string | null>(null)
  const [mapInstance, setMapInstance] = useState<any>(null)
  const mapContainer = useRef<HTMLDivElement>(null)
  const { toast } = useToast()
  const [destination, setDestination] = useState("")
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [directions, setDirections] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(false)
  const markerRefs = useRef<any[]>([])
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [currentStepIndex, setCurrentStepIndex] = useState<number | null>(null)
  const [transportMode, setTransportMode] = useState<"driving" | "walking">("walking")
  const [destinationFromUrl, setDestinationFromUrl] = useState<{
    name: string
    coordinates: [number, number] | null
  } | null>(null)

  // Référence pour stocker les instructions et l'état de la lecture
  const speakingStateRef = useRef<{
    isActive: boolean
    instructions: string[]
    currentIndex: number
  }>({
    isActive: false,
    instructions: [],
    currentIndex: 0,
  })

  // Référence au timeout
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  // Load Leaflet script dynamically
  useEffect(() => {
    if (typeof window === "undefined") return

    // Lire les paramètres d'URL pour voir si un lieu a été sélectionné
    const urlParams = new URLSearchParams(window.location.search)
    const lat = urlParams.get("lat")
    const lng = urlParams.get("lng")
    const name = urlParams.get("name")

    if (lat && lng && name) {
      setDestinationFromUrl({
        name,
        coordinates: [Number.parseFloat(lat), Number.parseFloat(lng)],
      })
    }

    // Continuer avec le chargement de Leaflet...
    const link = document.createElement("link")
    link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    link.rel = "stylesheet"
    link.integrity = "sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    link.crossOrigin = ""
    document.head.appendChild(link)

    // Add Leaflet script
    const script = document.createElement("script")
    script.src = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    script.integrity = "sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    script.crossOrigin = ""
    script.async = true

    script.onload = () => {
      initializeMap()
    }

    script.onerror = () => {
      setMapError("Failed to load Leaflet script. Please check your internet connection.")
      toast({
        title: "Map failed to load",
        description: "Failed to load Leaflet script. Please check your internet connection.",
        variant: "error",
      })
    }

    document.head.appendChild(script)

    return () => {
      // Clean up
      document.head.removeChild(link)
      if (document.head.contains(script)) {
        document.head.removeChild(script)
      }

      // Nettoyer speech synthesis et timeout
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }

      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  useEffect(() => {
    // Si nous avons une destination depuis l'URL et que la carte est chargée
    if (destinationFromUrl && mapInstance && userLocation) {
      // Définir le nom de la destination dans le champ de recherche
      setDestination(destinationFromUrl.name)

      // Créer un marqueur pour la destination
      // @ts-ignore - Leaflet is loaded via script
      const destinationMarker = L.marker(destinationFromUrl.coordinates, {
        // @ts-ignore - Leaflet is loaded via script
        icon: L.divIcon({
          className: "destination-marker",
          html: `<div style="width: 30px; height: 30px; background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"%23ef4444\\" stroke=\\"white\\" strokeWidth=\\"2\\"><path d=\\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\\"></path><circle cx=\\"12\\" cy=\\"10\\" r=\\"3\\"></circle></svg>'); background-size: cover;"></div>`,
          iconSize: [30, 30],
          iconAnchor: [15, 30],
        }),
      }).addTo(mapInstance)

      // Ajouter le marqueur à la liste des références
      markerRefs.current.push(destinationMarker)

      // Ajuster la vue de la carte pour montrer les deux points
      const bounds = [userLocation, destinationFromUrl.coordinates]
      // @ts-ignore - Leaflet is loaded via script
      mapInstance.fitBounds(bounds, {
        padding: [100, 100],
      })

      // Obtenir l'itinéraire vers la destination
     // getDirections(destinationFromUrl.coordinates)
     if (destinationFromUrl.coordinates) {
  const bounds = [userLocation, destinationFromUrl.coordinates];
  mapInstance.fitBounds(bounds, { padding: [100, 100] });
  getDirections(destinationFromUrl.coordinates);
}

      // Réinitialiser pour éviter de recalculer l'itinéraire à chaque rendu
      setDestinationFromUrl(null)
    }
  }, [destinationFromUrl, mapInstance, userLocation])

  const initializeMap = () => {
    if (!mapContainer.current) return

    try {
      // @ts-ignore - Leaflet is loaded via script
      const map = L.map(mapContainer.current).setView([48.8566, 2.3522], 13) // Default to Paris

      // @ts-ignore - Leaflet is loaded via script
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        maxZoom: 19,
      }).addTo(map)

      setMapInstance(map)
      setMapLoaded(true)

      toast({
        title: "Map loaded successfully",
        description: "The map has been initialized and is ready to use.",
      })

      // Get user location after map is loaded
      getUserLocation(map)
    } catch (error: any) {
      console.error("Error in map initialization:", error)
      setMapError(error.message || "Failed to initialize map")
      toast({
        title: "Map error",
        description: error.message || "Failed to initialize map",
        variant: "error",
      })
    }
  }

  const getUserLocation = (mapObj?: any) => {
    const map = mapObj || mapInstance
    if (!map) return

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { longitude, latitude } = position.coords
          setUserLocation([latitude, longitude])

          map.setView([latitude, longitude], 14)

          // Clear previous markers
          if (markerRefs.current.length > 0) {
            markerRefs.current.forEach((marker) => {
              if (map.hasLayer(marker)) {
                map.removeLayer(marker)
              }
            })
            markerRefs.current = []
          }

          // Add marker for user location
          // @ts-ignore - Leaflet is loaded via script
          const userMarker = L.marker([latitude, longitude], {
            // @ts-ignore - Leaflet is loaded via script
            icon: L.divIcon({
              className: "user-location-marker",
              html: `<div style="width: 20px; height: 20px; border-radius: 50%; background-color: #4F46E5; border: 3px solid white; box-shadow: 0 0 0 2px rgba(0,0,0,0.1);"></div>`,
              iconSize: [20, 20],
              iconAnchor: [10, 10],
            }),
          }).addTo(map)

          markerRefs.current.push(userMarker)

          toast({
            title: "Location found",
            description: "Your current location has been detected",
          })
        },
        (error) => {
          console.error("Error getting location:", error)
          toast({
            title: "Location error",
            description: "Unable to get your current location: " + error.message,
            variant: "error",
          })
        },
      )
    } else {
      toast({
        title: "Geolocation not supported",
        description: "Your browser doesn't support geolocation",
        variant: "error",
      })
    }
  }

  const searchDestination = async () => {
    if (!destination.trim()) return

    setIsLoading(true)
    setShowSearchResults(true)

    try {
      // Use Nominatim for geocoding (OpenStreetMap's free geocoding service)
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(destination)}`,
      )
      const data = await response.json()

      const results = data.map((item: any, index: number) => ({
        id: index,
        place_name: item.display_name,
        center: [Number.parseFloat(item.lat), Number.parseFloat(item.lon)],
        // Stocker les détails supplémentaires pour des repères plus précis
        details: {
          type: item.type,
          category: item.category,
          address: {
            road: item.address?.road,
            house_number: item.address?.house_number,
            city: item.address?.city,
            postcode: item.address?.postcode,
            neighbourhood: item.address?.neighbourhood,
            suburb: item.address?.suburb,
          },
        },
      }))

      setSearchResults(results)
      setIsLoading(false)
    } catch (error) {
      console.error("Search error:", error)
      toast({
        title: "Search failed",
        description: "Failed to search for destination. Please try again.",
        variant: "error",
      })
      setIsLoading(false)
    }
  }

  const selectDestination = (result: any) => {
    if (!mapInstance) return

    setDestination(result.place_name)
    setShowSearchResults(false)

    // Clear previous destination markers
    if (markerRefs.current.length > 1) {
      const destinationMarkers = markerRefs.current.slice(1)
      destinationMarkers.forEach((marker) => {
        if (mapInstance.hasLayer(marker)) {
          mapInstance.removeLayer(marker)
        }
      })
      markerRefs.current = [markerRefs.current[0]] // Keep only user location marker
    }

    // Add marker for destination
    // @ts-ignore - Leaflet is loaded via script
    const destinationMarker = L.marker(result.center, {
      // @ts-ignore - Leaflet is loaded via script
      icon: L.divIcon({
        className: "destination-marker",
        html: `<div style="width: 30px; height: 30px; background-image: url('data:image/svg+xml;charset=UTF-8,<svg xmlns=\\"http://www.w3.org/2000/svg\\" viewBox=\\"0 0 24 24\\" fill=\\"%23ef4444\\" stroke=\\"white\\" strokeWidth=\\"2\\"><path d=\\"M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z\\"></path><circle cx=\\"12\\" cy=\\"10\\" r=\\"3\\"></circle></svg>'); background-size: cover;"></div>`,
        iconSize: [30, 30],
        iconAnchor: [15, 30],
      }),
    }).addTo(mapInstance)

    markerRefs.current.push(destinationMarker)

    // Fit bounds to show both points if user location exists
    if (userLocation) {
      const bounds = [userLocation, result.center]
      // @ts-ignore - Leaflet is loaded via script
      mapInstance.fitBounds(bounds, {
        padding: [100, 100],
      })

      getDirections(result.center, result.details)
    } else {
      mapInstance.setView(result.center, 14)
    }
  }

  const getDirections = async (destinationCoords: [number, number], destinationDetails?: any) => {
    if (!userLocation) {
      toast({
        title: "Location required",
        description: "Please allow access to your current location first",
        variant: "error",
      })
      return
    }

    setIsLoading(true)

    try {
      // Use OSRM (Open Source Routing Machine) for directions
      // Note: This is using a public demo server - for production use, consider hosting your own OSRM instance
      const response = await fetch(
        `https://router.project-osrm.org/route/v1/${transportMode}/${userLocation[1]},${userLocation[0]};${destinationCoords[1]},${destinationCoords[0]}?overview=full&geometries=geojson&steps=true`,
      )
      const data = await response.json()

      if (data.code !== "Ok" || !data.routes || data.routes.length === 0) {
        throw new Error("No route found")
      }

      const route = data.routes[0]

      // Récupérer des informations sur les points d'intérêt le long de l'itinéraire
      const pointsOfInterest = await fetchPointsOfInterest(route.geometry.coordinates)

      // Format the directions data with humanized instructions
      const formattedDirections = {
        routes: [
          {
            geometry: route.geometry,
            legs: route.legs.map((leg: any) => ({
              steps: humanizeDirections(
                leg.steps,
                route.distance / 1000,
                transportMode,
                destinationDetails,
                pointsOfInterest,
              ),
            })),
            distance: route.distance / 1000, // Convert to km
            duration: route.duration, // In seconds
            transportMode,
          },
        ],
      }

      setDirections(formattedDirections)

      // Draw the route on the map
      if (mapInstance) {
        // Remove any existing route
        mapInstance.eachLayer((layer: any) => {
          if (layer._path && layer.options.className === "route-line") {
            mapInstance.removeLayer(layer)
          }
        })

        // @ts-ignore - Leaflet is loaded via script
L.geoJSON(route.geometry, {
  style: {
    color: transportMode === "walking" ? "#10B981" : "#4F46E5", // Vert pour marche, bleu pour conduite
    weight: 6,
    opacity: 0.8,
  },
} as L.PathOptions).addTo(mapInstance)
      }

      setIsLoading(false)
    } catch (error) {
      console.error("Directions error:", error)
      toast({
        title: "Directions failed",
        description: "Failed to get directions. Please try again.",
        variant: "error",
      })
      setIsLoading(false)

      // Fallback to mock directions if the API fails
      provideMockDirections(destinationCoords, destinationDetails)
    }
  }

  // Fonction pour récupérer des points d'intérêt le long de l'itinéraire
  const fetchPointsOfInterest = async (coordinates: number[][]) => {
    // Sélectionner quelques points le long de l'itinéraire pour rechercher des POI
    const samplePoints = coordinates.filter((_, index) => index % 10 === 0).slice(0, 5)

    try {
      // Pour chaque point, rechercher des POI à proximité
      const pois: any[] = []

      for (const point of samplePoints) {
        const [lon, lat] = point
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`,
        )
        const data = await response.json()

        if (data && data.address) {
          pois.push({
            name: data.name || data.display_name,
            type: data.type,
            address: data.address,
            location: [lat, lon],
          })
        }
      }

      return pois
    } catch (error) {
      console.error("Error fetching points of interest:", error)
      return []
    }
  }

  // Helper function to humanize directions from OSRM
  const humanizeDirections = (
    steps: any[],
    totalDistance: number,
    mode: string,
    destinationDetails?: any,
    pointsOfInterest: any[] = [],
  ) => {
    // If no steps, return empty array
    if (!steps || steps.length === 0) return []

    return steps.map((step: any, index: number) => {
      const isFirst = index === 0
      const isLast = index === steps.length - 1
      const distance = step.distance / 1000 // Convert to km
      const duration = step.duration // In seconds

      // Create a more human-like instruction
      let instruction = ""

      if (isFirst) {
        instruction = getFirstInstruction(step.name || "la rue", mode, step)
      } else if (isLast) {
        instruction = getLastInstruction(destinationDetails, mode)
      } else {
        instruction = humanizeInstruction(step, index, mode, pointsOfInterest)
      }

      return {
        maneuver: { instruction },
        distance,
        duration,
        isHighlighted: false,
      }
    })
  }

  const getFirstInstruction = (streetName: string, mode: string, step: any) => {
    if (mode === "walking") {
      const starters = [
        `D'accord, on va commencer à pied par ${streetName}. Regarde le trottoir à ta droite, c'est par là qu'on va passer.`,
        `Pour commencer notre balade, prends ${streetName} qui est juste devant toi. Tu devrais voir un passage piéton à quelques mètres.`,
        `On va débuter notre parcours à pied sur ${streetName}. Assure-toi d'être sur le trottoir et regarde bien les panneaux piétons.`,
        `Pour commencer cette promenade, suis ${streetName} tout droit. Il y a une zone piétonne bien indiquée.`,
      ]
      return starters[Math.floor(Math.random() * starters.length)]
    } else {
      const starters = [
        `Démarre le moteur, on va prendre ${streetName}. Assure-toi que ton GPS est bien fixé sur le tableau de bord.`,
        `Pour commencer notre trajet en voiture, engage-toi sur ${streetName}. Vérifie bien tes rétroviseurs avant de démarrer.`,
        `On va débuter notre route sur ${streetName}. Tu devrais voir un panneau de direction juste devant toi.`,
        `Pour commencer ce trajet, prends ${streetName} en direction ${step.driving_side === "right" ? "de la droite" : "de la gauche"}. Il y a une intersection à environ 100 mètres.`,
      ]
      return starters[Math.floor(Math.random() * starters.length)]
    }
  }

  const getLastInstruction = (destinationDetails: any, mode: string) => {
    // Extraire des détails précis sur la destination
    const buildingNumber = destinationDetails?.address?.house_number || ""
    const street = destinationDetails?.address?.road || ""
    const neighborhood = destinationDetails?.address?.neighbourhood || destinationDetails?.address?.suburb || ""
    const buildingType = destinationDetails?.type || ""

    let buildingDescription = ""
    if (buildingType === "building" || buildingType === "house") {
      buildingDescription = "le bâtiment"
    } else if (buildingType === "restaurant" || buildingType === "cafe") {
      buildingDescription = "le restaurant"
    } else if (buildingType === "shop" || buildingType === "store") {
      buildingDescription = "le magasin"
    } else {
      buildingDescription = "l'endroit"
    }

    if (mode === "walking") {
      const enders = [
        `Voilà, tu es arrivé ! ${buildingNumber ? `C'est le numéro ${buildingNumber}` : `C'est ${buildingDescription}`} ${street ? `sur ${street}` : ""}. ${neighborhood ? `Tu es dans le quartier ${neighborhood}.` : ""} Regarde le panneau à l'entrée.`,
        `Tu y es ! ${buildingNumber ? `Le numéro ${buildingNumber}` : buildingDescription} est juste devant toi${street ? ` sur ${street}` : ""}. Tu peux voir l'entrée principale avec les marches.`,
        `Parfait, on est arrivés à destination. ${buildingNumber ? `C'est le numéro ${buildingNumber}` : `C'est ${buildingDescription}`}${street ? ` sur ${street}` : ""}. Tu devrais voir une porte ${Math.random() > 0.5 ? "bleue" : "verte"} sur ta droite.`,
        `Et voilà ! Ta destination est juste là. ${neighborhood ? `Bienvenue dans le quartier ${neighborhood}.` : ""} ${buildingNumber ? `Cherche le numéro ${buildingNumber}` : "Cherche l'enseigne principale"} sur la façade.`,
      ]
      return enders[Math.floor(Math.random() * enders.length)]
    } else {
      const enders = [
        `Tu es arrivé à destination. ${buildingNumber ? `C'est le numéro ${buildingNumber}` : `C'est ${buildingDescription}`}${street ? ` sur ${street}` : ""}. ${Math.random() > 0.5 ? "Il y a un parking juste en face." : "Tu peux te garer sur le côté droit."}`,
        `Voilà, c'est ici ! ${buildingNumber ? `Le numéro ${buildingNumber}` : buildingDescription} est sur ta droite${street ? ` sur ${street}` : ""}. Ralentis et cherche une place pour te garer.`,
        `Parfait, on est arrivés. ${neighborhood ? `Tu es dans le quartier ${neighborhood}.` : ""} ${buildingNumber ? `C'est le bâtiment numéro ${buildingNumber}` : `C'est ${buildingDescription}`}. Il y a une zone de stationnement à proximité.`,
        `Et voilà ! Ta destination est juste là. ${Math.random() > 0.5 ? "Tu peux te garer dans la rue" : "Il y a un parking souterrain"} à côté de ${buildingNumber ? `l'immeuble numéro ${buildingNumber}` : buildingDescription}.`,
      ]
      return enders[Math.floor(Math.random() * enders.length)]
    }
  }

  const humanizeInstruction = (step: any, index: number, mode: string, pointsOfInterest: any[] = []) => {
    // Extract basic info
    const maneuver = step.maneuver || {}
    const type = maneuver.type || ""
    const modifier = maneuver.modifier || ""
    const name = step.name || "la rue"
    const distance = step.distance

    // Format distance in a human way
    const formattedDistance =
      distance < 100
        ? "quelques mètres"
        : distance < 1000
          ? `environ ${Math.round(distance / 100) * 100} mètres`
          : `environ ${(distance / 1000).toFixed(1)} kilomètres`

    // Trouver un point d'intérêt proche de cette étape si disponible
    const nearbyPOI = pointsOfInterest.find((poi) => {
      // Vérifier si le POI est proche de cette étape (logique simplifiée)
      return Math.random() > 0.7 // Simulation pour l'exemple
    })

    // Repères spécifiques au mode de transport
    const transportSpecificLandmarks =
      mode === "walking"
        ? [
            "le passage piéton",
            "le feu pour piétons",
            "la zone piétonne",
            "le banc public",
            "l'arrêt de bus",
            "la fontaine",
            "le kiosque",
            "l'aire de jeux",
            "le parc",
            "la terrasse du café",
          ]
        : [
            "le feu tricolore",
            "le panneau de signalisation",
            "le rond-point",
            "la station-service",
            "le radar",
            "la bretelle d'accès",
            "la borne kilométrique",
            "la zone de stationnement",
            "le péage",
          ]

    const landmark = nearbyPOI
      ? nearbyPOI.name ||
        nearbyPOI.type ||
        transportSpecificLandmarks[Math.floor(Math.random() * transportSpecificLandmarks.length)]
      : transportSpecificLandmarks[Math.floor(Math.random() * transportSpecificLandmarks.length)]

    // Random transition phrases
    const transitions = [
      "Ensuite, ",
      "Après ça, ",
      "Une fois là-bas, ",
      "Puis, ",
      "À ce moment-là, ",
      "Quand tu y seras, ",
    ]
    const transition = transitions[Math.floor(Math.random() * transitions.length)]

    // Observation plus précise basée sur le mode de transport
    const walkingObservations = [
      `Tu verras ${landmark} sur ta droite, c'est un bon repère.`,
      `Fais attention à ${landmark}, c'est juste après que tu devras tourner.`,
      `Il y a ${landmark} avec plusieurs personnes généralement, c'est un point de repère facile.`,
      `Tu passeras devant ${landmark}, continue tout droit après l'avoir dépassé.`,
    ]

    const drivingObservations = [
      `Tu verras ${landmark} sur le côté droit de la route, c'est un bon indicateur.`,
      `Fais attention à ${landmark}, c'est juste après que tu devras prendre la sortie.`,
      `Il y a ${landmark} bien visible depuis la route, c'est un point de repère facile.`,
      `Tu passeras devant ${landmark}, reste sur ta voie après l'avoir dépassé.`,
    ]

    const observations = mode === "walking" ? walkingObservations : drivingObservations
    const observation = " " + observations[Math.floor(Math.random() * observations.length)]

    // Build the instruction based on the maneuver type and mode of transport
    let instruction = ""

    if (type === "turn") {
      if (modifier === "left") {
        if (mode === "walking") {
          instruction = `${transition}tourne à gauche sur ${name} au niveau de ${landmark} et continue pour ${formattedDistance}.${observation}`
        } else {
          instruction = `${transition}prends à gauche sur ${name} après ${landmark} et continue pour ${formattedDistance}.${observation}`
        }
      } else if (modifier === "right") {
        if (mode === "walking") {
          instruction = `${transition}tourne à droite sur ${name} juste après ${landmark} et continue pour ${formattedDistance}.${observation}`
        } else {
          instruction = `${transition}prends à droite sur ${name} au niveau de ${landmark} et continue pour ${formattedDistance}.${observation}`
        }
      } else if (modifier === "straight") {
        if (mode === "walking") {
          instruction = `${transition}continue tout droit sur ${name} en passant devant ${landmark} pour ${formattedDistance}.${observation}`
        } else {
          instruction = `${transition}continue tout droit sur ${name} en dépassant ${landmark} pour ${formattedDistance}.${observation}`
        }
      } else {
        if (mode === "walking") {
          instruction = `${transition}prends ${name} en direction de ${landmark} et continue pour ${formattedDistance}.${observation}`
        } else {
          instruction = `${transition}engage-toi sur ${name} vers ${landmark} et continue pour ${formattedDistance}.${observation}`
        }
      }
    } else if (type === "new name") {
      if (mode === "walking") {
        instruction = `${transition}continue sur ${name} qui devient ${step.name || "une nouvelle rue"} pour ${formattedDistance}. Tu verras ${landmark} sur ton chemin.${observation}`
      } else {
        instruction = `${transition}reste sur la même route qui devient ${name} pour ${formattedDistance}. Tu passeras ${landmark} sur ta route.${observation}`
      }
    } else if (type === "depart") {
      if (mode === "walking") {
        instruction = `Commence à marcher sur ${name} en direction de ${landmark} et continue pour ${formattedDistance}.${observation}`
      } else {
        instruction = `Démarre sur ${name} en direction de ${landmark} et continue pour ${formattedDistance}.${observation}`
      }
    } else if (type === "arrive") {
      if (mode === "walking") {
        instruction = `Tu es arrivé à destination ! Regarde autour de toi, tu devrais voir l'entrée.`
      } else {
        instruction = `Tu es arrivé à destination ! Cherche une place pour te garer à proximité.`
      }
    } else if (type === "roundabout") {
      const exit = maneuver.exit || "la première"
      if (mode === "walking") {
        instruction = `${transition}au rond-point avec ${landmark} au centre, prends ${exit} sortie vers ${name} et continue pour ${formattedDistance}.${observation}`
      } else {
        instruction = `${transition}au rond-point, prends la ${exit} sortie vers ${name} (tu verras ${landmark} à la sortie) et continue pour ${formattedDistance}.${observation}`
      }
    } else {
      // Default case for other maneuver types
      if (mode === "walking") {
        instruction = `${transition}continue sur ${name} pour ${formattedDistance}. Tu passeras devant ${landmark}.${observation}`
      } else {
        instruction = `${transition}poursuis sur ${name} pour ${formattedDistance}. Tu verras ${landmark} sur ton trajet.${observation}`
      }
    }

    return instruction
  }

  const provideMockDirections = (destinationCoords: [number, number], destinationDetails?: any) => {
    if (!userLocation) return

    // Create mock directions data with humanized instructions adapted to transport mode
    const mockDirections = {
      routes: [
        {
          geometry: {
            type: "LineString",
            coordinates: [
              [userLocation[1], userLocation[0]],
              [destinationCoords[1], destinationCoords[0]],
            ],
          },
          legs: [
            {
              steps:
                transportMode === "walking"
                  ? [
                      {
                        maneuver: {
                          instruction:
                            "Pour commencer notre balade, prends l'Avenue des Champs-Élysées qui est juste devant toi. Tu devrais voir un passage piéton à environ 20 mètres avec un feu pour piétons. Assure-toi d'être sur le trottoir de droite.",
                        },
                        distance: 0.5,
                        duration: 360,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Après avoir marché environ 500 mètres, tourne à droite sur la Rue de Rivoli. Tu verras une boulangerie avec une enseigne rouge au coin, c'est exactement là qu'il faut tourner. Fais attention au passage piéton, attends que le feu soit vert.",
                        },
                        distance: 0.3,
                        duration: 240,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Continue tout droit sur la Rue de Rivoli. Tu vas passer devant un petit parc sur ta gauche avec des bancs verts. C'est un bon endroit pour faire une pause si tu es fatigué. Après le parc, tu verras une fontaine au milieu d'une petite place.",
                        },
                        distance: 0.7,
                        duration: 480,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Au grand carrefour avec le feu pour piétons, tourne à gauche sur le Boulevard Haussmann. Il y a une pharmacie avec une croix verte lumineuse juste à l'angle. Assure-toi de traverser au passage piéton, il y a beaucoup de circulation ici.",
                        },
                        distance: 0.4,
                        duration: 300,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Voilà, tu es arrivé ! C'est le bâtiment numéro 24 avec la porte bleue et les grandes fenêtres. Tu verras un interphone sur le côté droit de l'entrée. Le code est affiché sur le panneau à côté.",
                        },
                        distance: 0.1,
                        duration: 60,
                        isHighlighted: false,
                      },
                    ]
                  : [
                      {
                        maneuver: {
                          instruction:
                            "Démarre le moteur et engage-toi sur l'Avenue des Champs-Élysées. Reste sur la file de droite car tu devras tourner dans environ 500 mètres. Tu verras un grand panneau publicitaire sur ta gauche, c'est un bon repère.",
                        },
                        distance: 0.5,
                        duration: 180,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Au feu tricolore, tourne à droite sur la Rue de Rivoli. Fais attention, c'est une intersection très fréquentée. Il y a une station-service juste après le virage, c'est un bon indicateur que tu as pris la bonne direction.",
                        },
                        distance: 0.3,
                        duration: 120,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Continue tout droit sur la Rue de Rivoli. Tu vas passer sous un pont ferroviaire avec des graffitis colorés. Reste sur la file du milieu car il y a des voitures garées sur la droite. La limitation de vitesse est de 50 km/h ici.",
                        },
                        distance: 0.7,
                        duration: 240,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Au grand carrefour avec le feu tricolore et la caméra de surveillance, tourne à gauche sur le Boulevard Haussmann. Mets ton clignotant à l'avance, il y a souvent une file d'attente pour tourner. Tu verras un grand magasin avec des vitrines illuminées après le virage.",
                        },
                        distance: 0.4,
                        duration: 150,
                        isHighlighted: false,
                      },
                      {
                        maneuver: {
                          instruction:
                            "Tu es arrivé à destination ! C'est le bâtiment avec la façade grise sur ta droite. Il y a un parking souterrain avec entrée juste avant le bâtiment, ou tu peux te garer dans la rue si tu trouves une place. L'entrée principale est indiquée par un auvent rouge.",
                        },
                        distance: 0.1,
                        duration: 30,
                        isHighlighted: false,
                      },
                    ],
            },
          ],
          distance: transportMode === "walking" ? 2.0 : 2.0, // kilometers
          duration: transportMode === "walking" ? 1440 : 720, // seconds (walking is slower)
          transportMode,
        },
      ],
    }

    setDirections(mockDirections)

    // Draw the route on the map
    if (mapInstance) {
      // Remove any existing route
      mapInstance.eachLayer((layer: any) => {
        if (layer._path && layer.options.className === "route-line") {
          mapInstance.removeLayer(layer)
        }
      })

      // @ts-ignore - Leaflet is loaded via script
      L.polyline([userLocation, destinationCoords], {
        color: transportMode === "walking" ? "#10B981" : "#4F46E5", // Vert pour marche, bleu pour conduite
        weight: 6,
        opacity: 0.8,
        className: "route-line",
      }).addTo(mapInstance)
    }
  }

  // Fonction pour lire les instructions vocales
  const speakDirections = () => {
    // Vérifier si les directions sont disponibles
    if (!directions || !directions.routes[0].legs[0].steps) return

    // Si déjà en train de parler, arrêter
    if (isSpeaking) {
      // Annuler la synthèse vocale
      if (typeof window !== "undefined" && window.speechSynthesis) {
        window.speechSynthesis.cancel()
      }

      // Nettoyer timeout si existant
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }

      // Réinitialiser les états
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentStepIndex(null)
      speakingStateRef.current.isActive = false

      // Réinitialiser les étapes surlignées
      updateHighlightedStep(null)

      return
    }

    // Commencer une nouvelle lecture
    setIsSpeaking(true)
    setIsPaused(false)

    // Récupérer les instructions
    const steps = directions.routes[0].legs[0].steps

    // Préparer les instructions
    const instructions = steps.map((step: any) => step.maneuver.instruction)

    // Initialiser l'état de lecture
    speakingStateRef.current = {
      isActive: true,
      instructions: instructions,
      currentIndex: 0,
    }

    // Commencer la lecture du premier élément
    playNextInstruction()
  }

  // Fonction pour lire la prochaine instruction
  const playNextInstruction = () => {
    if (!speakingStateRef.current.isActive) return

    const { instructions, currentIndex } = speakingStateRef.current

    // Vérifier si toutes les instructions ont été lues
    if (currentIndex >= instructions.length) {
      // Terminer la lecture
      setIsSpeaking(false)
      setIsPaused(false)
      setCurrentStepIndex(null)
      speakingStateRef.current.isActive = false
      updateHighlightedStep(null)
      return
    }

    // Mettre à jour l'étape actuelle
    setCurrentStepIndex(currentIndex)
    updateHighlightedStep(currentIndex)

    // Créer la phrase à lire
    const text = instructions[currentIndex]

    // Créer un nouvel élément audio avec une voix française
    const msg = new SpeechSynthesisUtterance(text)
    msg.lang = "fr-FR"
    msg.rate = 0.9 // Un peu plus lent pour une meilleure compréhension

    // Configuration de l'événement de fin
    msg.onend = () => {
      // Vérifie si la lecture est toujours active
      if (speakingStateRef.current.isActive && !isPaused) {
        // Passer à l'instruction suivante après un délai
        timeoutRef.current = setTimeout(() => {
          speakingStateRef.current.currentIndex++
          playNextInstruction()
        }, 500) // Petit délai entre les instructions
      }
    }

    // Démarrer la lecture
    if (typeof window !== "undefined" && window.speechSynthesis) {
      try {
        window.speechSynthesis.speak(msg)
      } catch (error) {
        console.error("Error speaking:", error)
        // Afficher un message toast pour informer l'utilisateur
        toast({
          title: "Erreur de synthèse vocale",
          description:
            "Impossible de lire les instructions vocales. Veuillez vérifier les paramètres de votre navigateur.",
          variant: "error",
        })

        // Réinitialiser les états
        setIsSpeaking(false)
        setIsPaused(false)
        speakingStateRef.current.isActive = false
      }
    }
  }

  // Fonction pour mettre à jour l'étape surlignée
  const updateHighlightedStep = (highlightIndex: number | null) => {
    if (!directions || !directions.routes[0].legs[0].steps) return

    const updatedSteps = directions.routes[0].legs[0].steps.map((step: any, index: number) => ({
      ...step,
      isHighlighted: index === highlightIndex,
    }))

    setDirections({
      ...directions,
      routes: [
        {
          ...directions.routes[0],
          legs: [
            {
              ...directions.routes[0].legs[0],
              steps: updatedSteps,
            },
          ],
        },
      ],
    })
  }

  const pauseDirections = () => {
    if (isSpeaking && !isPaused && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.pause()
      setIsPaused(true)

      // Nettoyer timeout si existant
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
    }
  }

  const resumeDirections = () => {
    if (isSpeaking && isPaused && typeof window !== "undefined" && window.speechSynthesis) {
      window.speechSynthesis.resume()
      setIsPaused(false)

      // Si dans un état d'attente entre les instructions, continuer avec la prochaine
      if (timeoutRef.current === null && speakingStateRef.current.isActive) {
        timeoutRef.current = setTimeout(() => {
          if (!isPaused && speakingStateRef.current.isActive) {
            playNextInstruction()
          }
        }, 500)
      }
    }
  }

  // Changer le mode de transport et recalculer l'itinéraire si nécessaire
  const changeTransportMode = (mode: "driving" | "walking") => {
    if (transportMode === mode) return

    setTransportMode(mode)

    // Si un itinéraire est déjà calculé, le recalculer avec le nouveau mode
    if (directions && userLocation && markerRefs.current.length > 1) {
      const destinationMarker = markerRefs.current[1]
      if (destinationMarker) {
        const position = destinationMarker.getLatLng()
        getDirections([position.lat, position.lng])
      }
    }
  }

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    return `${minutes} min`
  }

  const formatDistance = (kilometers: number) => {
    return `${kilometers.toFixed(1)} km`
  }

  if (mapError) {
    return (
      <div className="flex flex-col h-screen">
        <header className="bg-white border-b p-4">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Navigation className="h-6 w-6 text-primary" />
            Application de Navigation
          </h1>
        </header>

        <div className="flex-1 p-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardContent className="p-6">
              <Alert variant="destructive" className="mb-4">
                <AlertTitle>Erreur de carte</AlertTitle>
                <AlertDescription>{mapError}</AlertDescription>
              </Alert>

              <p className="text-sm mb-4">Veuillez vérifier votre connexion internet et réessayer.</p>

              <Button className="w-full" onClick={() => window.location.reload()}>
                Réessayer
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen">
      <header className="bg-white border-b p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Navigation className="h-6 w-6 text-primary" />
             Navigation
          </h1>
          <Button 
  variant="outline" 
  className="gap-2" 
  onClick={() => (window.location.href = "/categories")}
>
      <ArrowLeft className="h-4 w-4" />
  <span>Retour</span>
</Button>
        </div>
      </header>

      <div className="flex flex-col md:flex-row h-full">
        {/* Map */}
        <div className="relative h-[50vh] md:h-auto md:flex-1">
          <div ref={mapContainer} className="absolute inset-0" />

          {!mapLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
              <div className="flex flex-col items-center">
                <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
                <p className="text-muted-foreground">Chargement de la carte...</p>
              </div>
            </div>
          )}

          <Card className="absolute top-4 left-4 right-4 md:left-auto md:right-4 md:w-80 z-[1000]">
            <CardContent className="p-4">
              <div className="relative">
                <div className="flex gap-2 mb-3">
                  <Input
                    placeholder="Où allez-vous?"
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && searchDestination()}
                    className="flex-1"
                  />
                  <Button onClick={searchDestination} disabled={isLoading}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>

                <Tabs
                  defaultValue="walking"
                  className="w-full"
                  onValueChange={(value) => changeTransportMode(value as "driving" | "walking")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="walking" className="flex items-center gap-1">
                      <Walking className="h-4 w-4" />À pied
                    </TabsTrigger>
                    <TabsTrigger value="driving" className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      En voiture
                    </TabsTrigger>
                  </TabsList>
                </Tabs>

                {showSearchResults && searchResults.length > 0 && (
                  <Card className="absolute top-full left-0 right-0 mt-1 z-10">
                    <CardContent className="p-0">
                      <ul className="py-2">
                        {searchResults.map((result) => (
                          <li
                            key={result.id}
                            className="px-4 py-2 hover:bg-muted cursor-pointer"
                            onClick={() => selectDestination(result)}
                          >
                            {result.place_name}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="absolute bottom-4 right-4 z-[1000]">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white shadow-md hover:bg-gray-100"
              onClick={() => getUserLocation()}
              disabled={!mapLoaded}
            >
              <MapPin className="h-5 w-5 text-primary" />
            </Button>
          </div>
        </div>

        {/* Sidebar */}
        <div className="w-full md:w-96 bg-white border-l flex flex-col">
          {directions && (
            <div className="flex-1 flex flex-col">
              <div className="p-4 bg-muted/30">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm text-muted-foreground">Distance totale</div>
                    <div className="font-medium">{formatDistance(directions.routes[0].distance)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Temps estimé</div>
                    <div className="font-medium">{formatDuration(directions.routes[0].duration)}</div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-1 text-sm">
                    <span className="font-medium">Mode:</span>
                    {directions.routes[0].transportMode === "walking" ? (
                      <span className="flex items-center gap-1 text-green-600">
                        <Walking className="h-4 w-4" /> À pied
                      </span>
                    ) : (
                      <span className="flex items-center gap-1 text-blue-600">
                        <Car className="h-4 w-4" /> En voiture
                      </span>
                    )}
                  </div>

                  {!isSpeaking ? (
                    <Button variant="outline" size="sm" onClick={speakDirections} className="flex items-center gap-1">
                      <Volume2 className="h-4 w-4" />
                      Écouter le guide
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={speakDirections}
                        className="flex items-center gap-1"
                      >
                        <VolumeX className="h-4 w-4" />
                        Arrêter
                      </Button>
                      {!isPaused ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={pauseDirections}
                          className="flex items-center gap-1"
                        >
                          <Pause className="h-4 w-4" />
                          Pause
                        </Button>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={resumeDirections}
                          className="flex items-center gap-1"
                        >
                          <Play className="h-4 w-4" />
                          Reprendre
                        </Button>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="flex-1 overflow-auto p-4">
                <h3 className="font-medium mb-4">Instructions de votre guide</h3>

                <ol className="space-y-4">
                  {directions.routes[0].legs[0].steps.map((step: any, index: number) => (
                    <li
                      key={index}
                      className={`flex gap-4 p-3 rounded-md transition-colors ${step.isHighlighted ? "bg-primary/10" : ""}`}
                    >
                      <div className="flex-shrink-0 w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                        {index + 1}
                      </div>
                      <div className="flex-1">
                        <p>{step.maneuver.instruction}</p>
                        <div className="flex gap-4 mt-1 text-sm text-muted-foreground">
                          <span>{formatDistance(step.distance)}</span>
                          <span>{formatDuration(step.duration)}</span>
                        </div>
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </div>
          )}

          {!directions && !isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-muted-foreground">
              <Compass className="h-12 w-12 mb-4 text-muted" />
              <h3 className="text-lg font-medium text-foreground">Prêt à naviguer</h3>
              <p className="mt-2">Recherchez une destination pour obtenir des instructions étape par étape</p>
              <div className="mt-4">
                <Tabs
                  defaultValue="walking"
                  className="w-full"
                  onValueChange={(value) => changeTransportMode(value as "driving" | "walking")}
                >
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="walking" className="flex items-center gap-1">
                      <Walking className="h-4 w-4" />À pied
                    </TabsTrigger>
                    <TabsTrigger value="driving" className="flex items-center gap-1">
                      <Car className="h-4 w-4" />
                      En voiture
                    </TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </div>
          )}

          {isLoading && (
            <div className="flex-1 flex flex-col items-center justify-center p-8">
              <div className="h-8 w-8 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              <p className="mt-4 text-muted-foreground">Chargement...</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}


