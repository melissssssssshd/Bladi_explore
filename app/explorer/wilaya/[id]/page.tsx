"use client"

import { useState, useEffect, useRef, useCallback } from "react"
import { useParams } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Link from "next/link"
import { ArrowLeft, Sun, Calendar, Utensils, Info, X, ChevronLeft, ChevronRight } from "lucide-react"

interface Attraction {
  _id: string
  name: string
  description: string
  image: string
  images?: string[]
  wilayaId: string
}

interface Wilaya {
  _id: string
  name: string
  description: string
  imageUrl: string
  overview?: {
    image: string
    description: string
    weather?: string
    bestPeriod?: string
    localCuisine?: string
    culturalEvents?: string
    travelTips?: string
  }
  createdAt: string
  updatedAt: string
}

interface Partner {
  _id: string
  name: string
  type: string
  status: string
  city: string
  wilayaId: string
  email: string
  phone: string
  website: string
  address: string
  description: string
  image: string
  services: string[]
  priceRange: string
  rating: number | null
  reviews: number | null
  createdAt: string
  updatedAt: string
}

const tabs = [
  { id: "apercu", name: "Aperçu" },
  { id: "attractions", name: "Attractions" },
  { id: "activites", name: "Activités" },
  { id: "partenaires", name: "Partenaires" },
  { id: "avis", name: "Avis" },
  { id: "pratique", name: "Pratique" },
]

export default function WilayaPage() {
  const params = useParams()
  const [wilaya, setWilaya] = useState<Wilaya | null>(null)
  const [attractions, setAttractions] = useState<Attraction[]>([])
  const [partners, setPartners] = useState<Partner[]>([])
  const [activeTab, setActiveTab] = useState("apercu")
  const [showCarousel, setShowCarousel] = useState(false)
  const [carouselIndex, setCarouselIndex] = useState(0)
  const [carouselImages, setCarouselImages] = useState<string[]>([])
  const carouselRef = useRef<HTMLDivElement>(null)
  const { toast } = useToast()

  useEffect(() => {
    fetchWilaya()
  }, [params.id])

  useEffect(() => {
    if (wilaya?._id) {
      fetchAttractions(wilaya._id)
      fetchPartners(wilaya._id)
    }
  }, [wilaya])

  const fetchWilaya = async () => {
    try {
      const response = await fetch(`/api/wilayas/${params.id}`)
      if (!response.ok) throw new Error("Wilaya non trouvée")
      const data = await response.json()
      setWilaya(data)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les détails de la wilaya",
        variant: "error",
      })
    }
  }

  const fetchAttractions = async (wilayaId: string) => {
    try {
      const response = await fetch(`/api/attractions?wilayaId=${wilayaId}`)
      const data = await response.json()
      setAttractions(data)
    } catch (error) {
      setAttractions([])
    }
  }

  const fetchPartners = async (wilayaId: string) => {
    try {
      const response = await fetch(`/api/partners?wilayaId=${wilayaId}`)
      const data = await response.json()
      setPartners(data)
    } catch (error) {
      setPartners([])
    }
  }

  const openCarousel = (images: string[] = []) => {
    setCarouselImages(images)
    setCarouselIndex(0)
    setShowCarousel(true)
  }

  const closeCarousel = () => {
    setShowCarousel(false)
    setCarouselImages([])
    setCarouselIndex(0)
  }

  const nextImage = () => {
    setCarouselIndex((prev) => (prev + 1) % carouselImages.length)
  }
  const prevImage = () => {
    setCarouselIndex((prev) => (prev - 1 + carouselImages.length) % carouselImages.length)
  }

  // Gestion clavier et fermeture sur fond
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!showCarousel) return
    if (e.key === "ArrowRight") nextImage()
    if (e.key === "ArrowLeft") prevImage()
    if (e.key === "Escape") closeCarousel()
  }, [showCarousel, carouselImages])

  useEffect(() => {
    if (showCarousel) {
      window.addEventListener("keydown", handleKeyDown)
    } else {
      window.removeEventListener("keydown", handleKeyDown)
    }
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [showCarousel, handleKeyDown])

  // Swipe mobile (optionnel)
  useEffect(() => {
    if (!showCarousel || !carouselRef.current) return
    let startX = 0
    let endX = 0
    const handleTouchStart = (e: TouchEvent) => {
      startX = e.touches[0].clientX
    }
    const handleTouchMove = (e: TouchEvent) => {
      endX = e.touches[0].clientX
    }
    const handleTouchEnd = () => {
      if (startX - endX > 50) nextImage()
      if (endX - startX > 50) prevImage()
    }
    const node = carouselRef.current
    node.addEventListener("touchstart", handleTouchStart)
    node.addEventListener("touchmove", handleTouchMove)
    node.addEventListener("touchend", handleTouchEnd)
    return () => {
      node.removeEventListener("touchstart", handleTouchStart)
      node.removeEventListener("touchmove", handleTouchMove)
      node.removeEventListener("touchend", handleTouchEnd)
    }
  }, [showCarousel, carouselImages, carouselIndex])

  if (!wilaya) {
    return (
      <div className="container mx-auto py-10">
        <div className="text-center">
          <p>Chargement...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-10">
      <div className="mb-6">
        <Link
          href="/explorer"
          className="text-[#588157] hover:text-[#3A5A40] flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à l'explorateur
        </Link>
      </div>

      {/* Header visuel */}
      <div className="relative rounded-xl overflow-hidden shadow-lg mb-8">
        <div className="relative h-[320px] sm:h-[400px]">
          <Image
            src={wilaya.overview?.image || wilaya.imageUrl}
            alt={wilaya.name}
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          <div className="absolute left-0 bottom-0 p-8 text-white">
            <h1 className="text-4xl font-bold mb-2 drop-shadow-lg">{wilaya.name}</h1>
            <div className="flex flex-wrap gap-6 items-center text-lg">
              {wilaya.overview?.weather && (
                <span className="flex items-center gap-2"><Sun className="h-5 w-5" /> {wilaya.overview.weather}</span>
              )}
              {wilaya.overview?.bestPeriod && (
                <span className="flex items-center gap-2"><Calendar className="h-5 w-5" /> {wilaya.overview.bestPeriod}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Onglets */}
      <div className="border-b mb-8 flex gap-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`pb-2 px-2 text-lg font-medium border-b-2 transition-colors ${activeTab === tab.id ? "border-[#588157] text-[#588157]" : "border-transparent text-gray-600 hover:text-[#588157]"}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.name}
          </button>
        ))}
      </div>

      {/* Contenu de l'onglet */}
      {activeTab === "apercu" && (
        <div>
          <h2 className="text-2xl font-bold mb-4 text-[#344E41]">À propos de {wilaya.name}</h2>
          <p className="mb-8 text-gray-700 text-lg">{wilaya.overview?.description || wilaya.description}</p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Météo */}
            {wilaya.overview?.weather && (
              <div className="bg-[#F6F7F2] rounded-xl p-6 flex flex-col items-center">
                <Sun className="h-10 w-10 text-yellow-400 mb-2" />
                <div className="text-2xl font-bold mb-1">{wilaya.overview.weather}</div>
                <div className="flex gap-4 mt-2 text-gray-600 text-lg">Météo</div>
              </div>
            )}
            {/* Meilleure période */}
            {wilaya.overview?.bestPeriod && (
              <div className="bg-[#F6F7F2] rounded-xl p-6">
                <Calendar className="h-6 w-6 text-[#588157] mb-2" />
                <div className="font-semibold text-lg mb-1">Meilleure période</div>
                <div className="text-gray-700">{wilaya.overview.bestPeriod}</div>
              </div>
            )}
            {/* Cuisine locale */}
            {wilaya.overview?.localCuisine && (
              <div className="bg-[#F6F7F2] rounded-xl p-6">
                <Utensils className="h-6 w-6 text-[#588157] mb-2" />
                <div className="font-semibold text-lg mb-1">Cuisine locale</div>
                <div className="text-gray-700">{wilaya.overview.localCuisine}</div>
              </div>
            )}
            {/* Événements culturels */}
            {wilaya.overview?.culturalEvents && (
              <div className="bg-[#F6F7F2] rounded-xl p-6">
                <Calendar className="h-6 w-6 text-[#588157] mb-2" />
                <div className="font-semibold text-lg mb-1">Événements culturels</div>
                <div className="text-gray-700">{wilaya.overview.culturalEvents}</div>
              </div>
            )}
            {/* Conseils de voyage */}
            {wilaya.overview?.travelTips && (
              <div className="bg-[#F6F7F2] rounded-xl p-6">
                <Info className="h-6 w-6 text-[#588157] mb-2" />
                <div className="font-semibold text-lg mb-1">Conseils de voyage</div>
                <div className="text-gray-700 whitespace-pre-line">{wilaya.overview.travelTips}</div>
              </div>
            )}
          </div>
        </div>
      )}

      {activeTab === "attractions" && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#344E41]">Attractions à découvrir</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {attractions.length > 0 ? attractions.map((attr) => (
              <div
                key={attr._id}
                className="bg-white rounded-xl shadow p-4 flex flex-col cursor-pointer hover:shadow-lg transition"
                onClick={() => openCarousel(attr.images && attr.images.length > 0 ? attr.images : [attr.image])}
              >
                <div className="relative h-40 w-full mb-4 rounded-lg overflow-hidden">
                  <Image src={attr.image} alt={attr.name} fill className="object-cover" />
                </div>
                <div className="font-bold text-lg mb-1">{attr.name}</div>
                <div className="text-gray-600 flex-1 mb-2">{attr.description}</div>
              </div>
            )) : (
              <div className="text-gray-500">Aucune attraction renseignée.</div>
            )}
          </div>
        </div>
      )}

      {activeTab === "partenaires" && (
        <div>
          <h2 className="text-2xl font-bold mb-6 text-[#344E41]">Partenaires à {wilaya.name}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {partners.length > 0 ? partners.map((partner) => (
              <div key={partner._id} className="bg-white rounded-xl shadow p-6 flex flex-col md:flex-row gap-6 items-center">
                {partner.image && (
                  <div className="relative w-40 h-40 rounded-lg overflow-hidden flex-shrink-0">
                    <Image src={partner.image} alt={partner.name} fill className="object-cover" />
                    <span className="absolute top-2 left-2 bg-[#E9ECE5] text-xs px-3 py-1 rounded-full font-medium">{partner.type}</span>
                  </div>
                )}
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold text-xl text-[#344E41]">{partner.name}</span>
                    {partner.rating && (
                      <span className="flex items-center gap-1 text-yellow-600 font-semibold ml-2">
                        ★ {partner.rating.toFixed(1)}
                        {partner.reviews && <span className="text-gray-500 text-sm">({partner.reviews} avis)</span>}
                      </span>
                    )}
                  </div>
                  <div className="text-gray-700 mb-2">{partner.description}</div>
                  <div className="text-sm text-gray-600 mb-2 flex flex-col gap-1">
                    {partner.address && <div>📍 {partner.address}</div>}
                    {partner.phone && <div>📞 {partner.phone}</div>}
                    {partner.email && <div>✉️ {partner.email}</div>}
                    {partner.website && <div>🌐 <a href={partner.website} target="_blank" rel="noopener noreferrer" className="underline text-[#588157]">{partner.website}</a></div>}
                  </div>
                  {partner.services && partner.services.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-2">
                      {partner.services.map((s, idx) => (
                        <span key={idx} className="bg-[#E9ECE5] px-3 py-1 rounded-full text-sm">{s}</span>
                      ))}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-2">
                    {partner.priceRange && <span className="text-sm">Prix: <span className="font-semibold">{partner.priceRange}</span></span>}
                    <a href={`mailto:${partner.email}`} className="bg-[#588157] hover:bg-[#3A5A40] text-white px-4 py-2 rounded-lg font-semibold text-sm transition">Contacter</a>
                  </div>
                </div>
              </div>
            )) : (
              <div className="text-gray-500">Aucun partenaire renseigné.</div>
            )}
          </div>
        </div>
      )}

      {/* Modal/carrousel d'image */}
      {showCarousel && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          onClick={closeCarousel}
          role="dialog"
          aria-modal="true"
        >
          <div
            ref={carouselRef}
            className="relative bg-white rounded-xl shadow-2xl max-w-2xl w-full p-6 flex flex-col items-center"
            onClick={e => e.stopPropagation()}
          >
            <button
              className="absolute top-4 right-4 p-2 rounded-full bg-gray-200 hover:bg-gray-300 shadow-lg z-10"
              onClick={closeCarousel}
              aria-label="Fermer"
            >
              <X className="h-6 w-6 text-gray-700" />
            </button>
            <div className="relative w-full h-80 mb-4 flex items-center justify-center select-none">
              <Image
                src={carouselImages[carouselIndex]}
                alt={`Attraction image ${carouselIndex + 1}`}
                fill
                className="object-contain rounded-lg bg-gray-100"
                draggable={false}
              />
              {carouselImages.length > 1 && (
                <>
                  <button
                    className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg border border-gray-200"
                    onClick={prevImage}
                    aria-label="Image précédente"
                  >
                    <ChevronLeft className="h-6 w-6 text-gray-700" />
                  </button>
                  <button
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-2 rounded-full shadow-lg border border-gray-200"
                    onClick={nextImage}
                    aria-label="Image suivante"
                  >
                    <ChevronRight className="h-6 w-6 text-gray-700" />
                  </button>
                </>
              )}
            </div>
            {/* Dots */}
            {carouselImages.length > 1 && (
              <div className="flex gap-2 mb-4">
                {carouselImages.map((_, idx) => (
                  <button
                    key={idx}
                    className={`w-3 h-3 rounded-full ${idx === carouselIndex ? "bg-[#588157]" : "bg-gray-300"}`}
                    onClick={() => setCarouselIndex(idx)}
                    aria-label={`Aller à l'image ${idx + 1}`}
                  />
                ))}
              </div>
            )}
            <div className="text-lg font-semibold mb-2">
              {attractions.find(a => (a.images || [a.image])[carouselIndex] === carouselImages[carouselIndex])?.name || ""}
            </div>
            <div className="text-gray-600 text-center">
              {attractions.find(a => (a.images || [a.image])[carouselIndex] === carouselImages[carouselIndex])?.description || ""}
            </div>
          </div>
        </div>
      )}

      {/* Préparation pour les autres onglets */}
      {activeTab === "activites" && (
        <div className="text-gray-500">Section Activités à venir…</div>
      )}
      {activeTab === "avis" && (
        <div className="text-gray-500">Section Avis à venir…</div>
      )}
      {activeTab === "pratique" && (
        <div className="text-gray-500">Section Pratique à venir…</div>
      )}
    </div>
  )
} 