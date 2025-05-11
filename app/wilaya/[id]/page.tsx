"use client"

import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"
import {
  MapPin,
  Star,
  Users,
  Bookmark,
  Share2,
  Calendar,
  Utensils,
  Clock,
  Sun,
  Info,
  Map,
  DollarSign,
  User,
  ThumbsUp,
  MessageSquare,
  ChevronRight,
  Filter,
  Search,
  Heart,
  Phone,
  Mail,
  Globe,
} from "lucide-react"

// Données fictives pour les wilayas
const wilayasData = [
  {
    id: "1",
    name: "Tamanrasset",
    region: "Sud de l'Algérie",
    image: "/images/tassili.jpeg",
    images: ["/images/tassili.jpeg", "/images/casbah.jpeg", "/images/plage-sidi-merouane.jpeg", "/images/skikda.jpeg"],
    location: "Hoggar, Sud de l'Algérie",
    rating: 4.9,
    visitors: "18 000",
    description:
      "Tamanrasset, située au cœur du massif du Hoggar, est une destination incontournable pour les amateurs de désert et d'aventure. Avec ses paysages lunaires, ses formations rocheuses spectaculaires et sa culture touareg authentique, cette wilaya offre une expérience unique au cœur du Sahara algérien.",
    weather: {
      current: { temp: 30, condition: "Ensoleillé" },
      forecast: [
        { day: "Lun", temp: 31, condition: "Ensoleillé" },
        { day: "Mar", temp: 32, condition: "Ensoleillé" },
        { day: "Mer", temp: 30, condition: "Ensoleillé" },
        { day: "Jeu", temp: 29, condition: "Ensoleillé" },
        { day: "Ven", temp: 30, condition: "Ensoleillé" },
      ],
    },
    bestPeriod: "Octobre à Mars",
    localCuisine: "Méchoui, Tagella (pain du désert), Thé à la menthe",
    culturalEvents: [
      { name: "Festival de l'Imzad", period: "janvier" },
      { name: "Sebiba de Djanet", period: "février" },
    ],
    travelTips: [
      "Prévoyez des vêtements chauds pour les nuits qui peuvent être très fraîches",
      "Emportez une protection solaire et beaucoup d'eau",
      "Respectez les coutumes locales et demandez la permission avant de photographier les habitants",
    ],
    attractions: [
      {
        name: "Massif du Hoggar",
        description: "Chaîne de montagnes volcaniques offrant des paysages spectaculaires.",
        image: "/images/tassili.jpeg",
      },
      {
        name: "Assekrem",
        description: "Point culminant du Hoggar, célèbre pour ses levers et couchers de soleil.",
        image: "/images/plage-sidi-merouane.jpeg",
      },
      {
        name: "Tassili n'Ajjer",
        description: "Site classé au patrimoine mondial de l'UNESCO avec des peintures rupestres préhistoriques.",
        image: "/images/tassili.jpeg",
      },
    ],
    activities: [
      {
        id: 1,
        name: "Trekking dans le Hoggar",
        description: "Randonnée guidée à travers les paysages lunaires du massif du Hoggar.",
        longDescription:
          "Partez à l'aventure dans le massif du Hoggar, l'un des plus beaux paysages désertiques au monde. Cette randonnée vous emmènera à travers des formations rocheuses spectaculaires, des vallées cachées et des panoramas à couper le souffle. Accompagné par des guides touaregs expérimentés, vous découvrirez la faune et la flore uniques de cette région, ainsi que son histoire géologique fascinante.",
        duration: "1 à 7 jours",
        price: "5000-25000 DZD",
        image: "/images/tassili.jpeg",
        rating: 4.9,
        reviews: 28,
        included: ["Guide touareg local", "Repas traditionnels", "Transport en 4x4", "Équipement de camping"],
        notIncluded: ["Vêtements personnels", "Sac de couchage", "Assurance voyage"],
        difficulty: "Modérée",
        startTimes: ["7h00", "8h00"],
        location: "Point de départ: Centre-ville de Tamanrasset",
        organizer: {
          name: "Hoggar Adventures",
          rating: 4.8,
          reviews: 156,
        },
        tags: ["Aventure", "Nature", "Culture"],
        bookingOptions: [
          { name: "Trekking 1 jour", price: "5000 DZD" },
          { name: "Trekking 3 jours", price: "15000 DZD" },
          { name: "Trekking 7 jours", price: "25000 DZD" },
        ],
      },
      {
        id: 2,
        name: "Lever de soleil à l'Assekrem",
        description: "Excursion pour admirer le spectaculaire lever de soleil depuis l'Assekrem.",
        longDescription:
          "Vivez une expérience inoubliable en admirant l'un des plus beaux levers de soleil au monde depuis le plateau de l'Assekrem. Cette excursion commence avant l'aube pour vous permettre d'atteindre le sommet à temps pour le spectacle. Lorsque le soleil se lève sur l'horizon, il illumine progressivement les pics volcaniques du Hoggar, créant un jeu de lumières et d'ombres absolument magique.",
        duration: "4 heures",
        price: "3000 DZD",
        image: "/images/plage-sidi-merouane.jpeg",
        rating: 4.8,
        reviews: 42,
        included: ["Transport en 4x4", "Guide local", "Thé à la menthe"],
        notIncluded: ["Repas", "Équipement photo"],
        difficulty: "Facile",
        startTimes: ["4h30"],
        location: "Départ de l'hôtel à Tamanrasset",
        organizer: {
          name: "Sahara Visions",
          rating: 4.9,
          reviews: 89,
        },
        tags: ["Photographie", "Nature", "Lever de soleil"],
        bookingOptions: [
          { name: "Excursion standard", price: "3000 DZD" },
          { name: "Excursion privée", price: "5000 DZD" },
        ],
      },
    ],
    partners: [
      {
        id: 1,
        name: "Hôtel Tahat",
        type: "Hébergement",
        description: "Hôtel confortable situé au centre de Tamanrasset avec vue sur les montagnes.",
        address: "Avenue du 1er Novembre, Tamanrasset",
        phone: "+213 123 456 789",
        email: "contact@hoteltahat.com",
        website: "www.hoteltahat.com",
        rating: 4.5,
        reviews: 78,
        image: "/images/casbah.jpeg",
        services: ["Wi-Fi gratuit", "Restaurant", "Climatisation", "Parking"],
        priceRange: "$$",
      },
      {
        id: 2,
        name: "Hoggar Adventures",
        type: "Agence de voyage",
        description: "Spécialiste des excursions et treks dans le massif du Hoggar depuis plus de 15 ans.",
        address: "Rue des Dunes 45, Tamanrasset",
        phone: "+213 234 567 890",
        email: "info@hoggaradventures.com",
        website: "www.hoggaradventures.com",
        rating: 4.8,
        reviews: 156,
        image: "/images/tassili.jpeg",
        services: ["Excursions guidées", "Location de matériel", "Transport", "Hébergement en bivouac"],
        priceRange: "$$$",
      },
      {
        id: 3,
        name: "Restaurant Tinhinane",
        type: "Restauration",
        description: "Restaurant traditionnel proposant des spécialités touarègues et des plats du Sud algérien.",
        address: "Place du Marché, Tamanrasset",
        phone: "+213 345 678 901",
        email: "reservation@tinhinane.com",
        website: "www.tinhinane.com",
        rating: 4.7,
        reviews: 92,
        image: "/images/casbah.jpeg",
        services: ["Cuisine traditionnelle", "Terrasse", "Soirées musicales", "Plats à emporter"],
        priceRange: "$$",
      },
      {
        id: 4,
        name: "Guides du Sahara",
        type: "Guide touristique",
        description: "Collectif de guides touaregs expérimentés pour des visites personnalisées du Hoggar.",
        address: "Rue des Artisans 12, Tamanrasset",
        phone: "+213 456 789 012",
        email: "contact@guidesdusahara.com",
        website: "www.guidesdusahara.com",
        rating: 4.9,
        reviews: 124,
        image: "/images/tassili.jpeg",
        services: ["Visites guidées", "Interprétation culturelle", "Photographie", "Excursions à dos de chameau"],
        priceRange: "$$",
      },
    ],
    reviews: [
      {
        id: 1,
        user: "Marie L.",
        date: "5 avril 2023",
        rating: 5,
        comment:
          "Le Hoggar est l'un des plus beaux endroits que j'ai visités. Les paysages sont à couper le souffle et l'hospitalité des Touaregs est exceptionnelle. Le lever de soleil à l'Assekrem vaut vraiment le détour !",
        likes: 42,
      },
      {
        id: 2,
        user: "Omar F.",
        date: "12 mars 2023",
        rating: 5,
        comment:
          "Une expérience inoubliable ! J'ai fait un trek de 3 jours dans le Hoggar et c'était magique. Les guides sont très professionnels et connaissent parfaitement la région.",
        likes: 28,
      },
      {
        id: 3,
        user: "Sophie M.",
        date: "20 février 2023",
        rating: 4,
        comment:
          "Magnifique région avec des paysages à couper le souffle. Seul bémol : la chaleur peut être difficile à supporter en journée. Pensez à bien vous hydrater !",
        likes: 15,
      },
    ],
    nearbyWilayas: [
      {
        id: 3,
        name: "Adrar",
        distance: "450 km",
        image: "/images/tassili.jpeg",
      },
      {
        id: 2,
        name: "Ghardaïa",
        distance: "650 km",
        image: "/images/jardin-essai.jpeg",
      },
    ],
  },
  // Autres wilayas...
]

export default function WilayaPage() {
  const params = useParams()
  const id = params.id as string
  const [activeTab, setActiveTab] = useState("apercu")
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [selectedActivity, setSelectedActivity] = useState<number | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [partnerTypeFilter, setPartnerTypeFilter] = useState("all")

  // Trouver la wilaya correspondante
  const wilaya = wilayasData.find((w) => w.id === id) || wilayasData[0]

  const tabs = [
    { id: "apercu", name: "Aperçu" },
    { id: "attractions", name: "Attractions" },
    { id: "activites", name: "Activités" },
    { id: "partenaires", name: "Partenaires" },
    { id: "avis", name: "Avis" },
    { id: "pratique", name: "Pratique" },
  ]

  // Filtrer les partenaires
  const filteredPartners = wilaya.partners.filter(
    (partner) =>
      (partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        partner.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (partnerTypeFilter === "all" || partner.type === partnerTypeFilter),
  )

  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1">
        <div className="relative">
          {/* Images carousel */}
          <div className="relative h-[50vh]">
            <Image
              src={wilaya.images[activeImageIndex] || "/placeholder.svg"}
              alt={wilaya.name}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-black/30"></div>

            {/* Navigation */}
            <div className="absolute top-8 left-8 flex items-center gap-2 text-white">
              <Link href="/categories" className="hover:text-gray-200 transition-colors">
                Accueil
              </Link>
              <span>›</span>
              <Link href="/categories" className="hover:text-gray-200 transition-colors">
                Catégories
              </Link>
              <span>›</span>
              <Link href={`/categories/sud`} className="hover:text-gray-200 transition-colors">
                {wilaya.region}
              </Link>
              <span>›</span>
              <span>{wilaya.name}</span>
            </div>

            {/* Actions */}
            <div className="absolute top-8 right-8 flex gap-2">
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Bookmark className="h-5 w-5 text-white" />
              </button>
              <button className="p-2 bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-colors">
                <Share2 className="h-5 w-5 text-white" />
              </button>
            </div>

            {/* Wilaya info */}
            <div className="absolute bottom-8 left-8 text-white">
              <h1 className="text-4xl font-bold mb-2">{wilaya.name}</h1>
              <div className="flex items-center gap-6">
                <div className="flex items-center gap-1">
                  <MapPin className="h-5 w-5" />
                  <span>{wilaya.region}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span>{wilaya.rating}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-5 w-5" />
                  <span>{wilaya.visitors} visiteurs</span>
                </div>
              </div>
            </div>

            {/* Image navigation dots */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
              {wilaya.images.map((_, index) => (
                <button
                  key={index}
                  className={`h-2 w-2 rounded-full ${
                    index === activeImageIndex ? "bg-white" : "bg-white/50"
                  } hover:bg-white transition-colors`}
                  onClick={() => setActiveImageIndex(index)}
                ></button>
              ))}
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-8">
              <div className="flex overflow-x-auto">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    className={`px-6 py-4 font-medium whitespace-nowrap ${
                      activeTab === tab.id
                        ? "text-[#588157] border-b-2 border-[#588157]"
                        : "text-gray-600 hover:text-[#588157]"
                    } transition-colors`}
                    onClick={() => setActiveTab(tab.id)}
                  >
                    {tab.name}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="max-w-7xl mx-auto px-8 py-8">
            {activeTab === "apercu" && (
              <div className="space-y-8">
                {/* Description */}
                <div>
                  <h2 className="text-2xl font-bold text-[#344E41] mb-4">À propos de {wilaya.name}</h2>
                  <p className="text-gray-600">{wilaya.description}</p>
                </div>

                {/* Météo */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <h3 className="text-xl font-bold text-[#344E41] mb-4">Météo</h3>
                  <div className="flex items-center mb-6">
                    <div className="bg-blue-50 rounded-full p-4 mr-4">
                      <Sun className="h-10 w-10 text-yellow-400" />
                    </div>
                    <div>
                      <p className="text-gray-600">{wilaya.weather.current.condition}</p>
                      <p className="text-4xl font-bold text-[#344E41]">{wilaya.weather.current.temp} °C</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-5 gap-4">
                    {wilaya.weather.forecast.map((day, index) => (
                      <div key={index} className="text-center">
                        <p className="text-gray-600">{day.day}</p>
                        <div className="flex justify-center my-2">
                          <Sun className="h-6 w-6 text-yellow-400" />
                        </div>
                        <p className="font-medium">{day.temp} °</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Informations pratiques */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#344E41] mb-4">Meilleure période</h3>
                    <div className="flex items-center">
                      <Calendar className="h-6 w-6 text-[#588157] mr-2" />
                      <span>{wilaya.bestPeriod}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#344E41] mb-4">Cuisine locale</h3>
                    <div className="flex items-center">
                      <Utensils className="h-6 w-6 text-[#588157] mr-2" />
                      <span>{wilaya.localCuisine}</span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#344E41] mb-4">Événements culturels</h3>
                    <div className="flex items-center">
                      <Calendar className="h-6 w-6 text-[#588157] mr-2" />
                      <span>
                        {wilaya.culturalEvents.map((event, index) => (
                          <span key={index}>
                            {event.name} ({event.period}){index < wilaya.culturalEvents.length - 1 ? ", " : ""}
                          </span>
                        ))}
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl shadow-sm p-6">
                    <h3 className="text-xl font-bold text-[#344E41] mb-4">Conseils de voyage</h3>
                    <ul className="space-y-2">
                      {wilaya.travelTips.map((tip, index) => (
                        <li key={index} className="flex items-start">
                          <Info className="h-5 w-5 text-[#588157] mr-2 mt-0.5 flex-shrink-0" />
                          <span className="text-gray-600">{tip}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Carte interactive */}
                <div className="bg-white rounded-xl shadow-sm p-6">
                  <div className="flex items-center mb-4">
                    <Map className="h-6 w-6 text-[#588157] mr-2" />
                    <h3 className="text-xl font-bold text-[#344E41]">Carte interactive de {wilaya.name}</h3>
                  </div>
                  <div className="bg-gray-200 h-80 rounded-lg flex items-center justify-center">
                    <p className="text-gray-500">Carte interactive</p>
                  </div>
                </div>

                {/* Wilayas à proximité */}
                <div>
                  <h3 className="text-xl font-bold text-[#344E41] mb-4">Wilayas à proximité</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {wilaya.nearbyWilayas.map((nearby) => (
                      <Link key={nearby.id} href={`/wilaya/${nearby.id}`}>
                        <div className="flex bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
                          <div className="relative w-24 h-24">
                            <Image
                              src={nearby.image || "/placeholder.svg"}
                              alt={nearby.name}
                              fill
                              className="object-cover"
                            />
                          </div>
                          <div className="p-4">
                            <h4 className="font-bold text-[#344E41]">{nearby.name}</h4>
                            <p className="text-sm text-gray-500">Distance : {nearby.distance}</p>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activeTab === "attractions" && (
              <div>
                <h2 className="text-2xl font-bold text-[#344E41] mb-6">Attractions à {wilaya.name}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {wilaya.attractions.map((attraction, index) => (
                    <div key={index} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="relative h-48">
                        <Image
                          src={attraction.image || "/placeholder.svg"}
                          alt={attraction.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="text-lg font-bold text-[#344E41] mb-2">{attraction.name}</h3>
                        <p className="text-gray-600">{attraction.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "activites" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#344E41]">Activités à faire</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher une activité..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <button className="flex items-center gap-1 px-3 py-2 bg-white rounded-lg border border-gray-300 text-gray-700">
                      <Filter className="h-4 w-4" />
                      <span>Filtres</span>
                    </button>
                  </div>
                </div>

                {selectedActivity !== null ? (
                  <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="relative h-80">
                      <Image
                        src={wilaya.activities[selectedActivity].image || "/placeholder.svg"}
                        alt={wilaya.activities[selectedActivity].name}
                        fill
                        className="object-cover"
                      />
                      <button
                        onClick={() => setSelectedActivity(null)}
                        className="absolute top-4 left-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                      >
                        <ChevronRight className="h-5 w-5 transform rotate-180" />
                      </button>
                      <div className="absolute top-4 right-4 flex gap-2">
                        <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                          <Heart className="h-5 w-5 text-gray-700" />
                        </button>
                        <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                          <Share2 className="h-5 w-5 text-gray-700" />
                        </button>
                      </div>
                    </div>

                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-2">
                        <div className="flex items-center">
                          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                          <span className="ml-1 font-medium">{wilaya.activities[selectedActivity].rating}</span>
                        </div>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-600">{wilaya.activities[selectedActivity].reviews} avis</span>
                      </div>

                      <h3 className="text-2xl font-bold text-[#344E41] mb-2">
                        {wilaya.activities[selectedActivity].name}
                      </h3>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {wilaya.activities[selectedActivity].tags.map((tag, index) => (
                          <span key={index} className="px-3 py-1 bg-[#DAD7CD] rounded-full text-sm text-[#344E41]">
                            {tag}
                          </span>
                        ))}
                      </div>

                      <p className="text-gray-600 mb-6">{wilaya.activities[selectedActivity].longDescription}</p>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        <div>
                          <h4 className="font-bold text-[#344E41] mb-3">Détails de l'activité</h4>
                          <ul className="space-y-3">
                            <li className="flex items-center">
                              <Clock className="h-5 w-5 text-[#588157] mr-2" />
                              <span className="text-gray-600">
                                Durée: {wilaya.activities[selectedActivity].duration}
                              </span>
                            </li>
                            <li className="flex items-center">
                              <DollarSign className="h-5 w-5 text-[#588157] mr-2" />
                              <span className="text-gray-600">Prix: {wilaya.activities[selectedActivity].price}</span>
                            </li>
                            <li className="flex items-center">
                              <MapPin className="h-5 w-5 text-[#588157] mr-2" />
                              <span className="text-gray-600">{wilaya.activities[selectedActivity].location}</span>
                            </li>
                            <li className="flex items-start">
                              <User className="h-5 w-5 text-[#588157] mr-2 mt-0.5" />
                              <div>
                                <span className="text-gray-600">
                                  Organisé par: {wilaya.activities[selectedActivity].organizer.name}
                                </span>
                                <div className="flex items-center mt-1">
                                  <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                  <span className="ml-1 text-sm">
                                    {wilaya.activities[selectedActivity].organizer.rating}
                                  </span>
                                  <span className="mx-1 text-gray-400">•</span>
                                  <span className="text-sm text-gray-500">
                                    {wilaya.activities[selectedActivity].organizer.reviews} avis
                                  </span>
                                </div>
                              </div>
                            </li>
                          </ul>
                        </div>

                        <div>
                          <h4 className="font-bold text-[#344E41] mb-3">Ce qui est inclus</h4>
                          <ul className="space-y-2 mb-4">
                            {wilaya.activities[selectedActivity].included.map((item, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                <svg
                                  className="h-5 w-5 text-green-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M5 13l4 4L19 7"
                                  />
                                </svg>
                                {item}
                              </li>
                            ))}
                          </ul>

                          <h4 className="font-bold text-[#344E41] mb-3">Non inclus</h4>
                          <ul className="space-y-2">
                            {wilaya.activities[selectedActivity].notIncluded.map((item, index) => (
                              <li key={index} className="flex items-center text-gray-600">
                                <svg
                                  className="h-5 w-5 text-red-500 mr-2"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                  stroke="currentColor"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M6 18L18 6M6 6l12 12"
                                  />
                                </svg>
                                {item}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="border-t border-gray-200 pt-6">
                        <h4 className="font-bold text-[#344E41] mb-4">Options de réservation</h4>
                        <div className="space-y-3">
                          {wilaya.activities[selectedActivity].bookingOptions.map((option, index) => (
                            <div
                              key={index}
                              className="flex justify-between items-center p-4 border border-gray-200 rounded-lg hover:border-[#588157] transition-colors"
                            >
                              <div>
                                <h5 className="font-medium text-[#344E41]">{option.name}</h5>
                                <p className="text-sm text-gray-500">Disponible aujourd'hui</p>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-[#344E41]">{option.price}</p>
                                <button className="mt-2 px-4 py-1 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors text-sm">
                                  Réserver
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {wilaya.activities.map((activity, index) => (
                      <div
                        key={activity.id}
                        className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                        onClick={() => setSelectedActivity(index)}
                      >
                        <div className="flex flex-col h-full">
                          <div className="relative h-48">
                            <Image
                              src={activity.image || "/placeholder.svg"}
                              alt={activity.name}
                              fill
                              className="object-cover"
                            />
                            <div className="absolute top-3 right-3 flex gap-2">
                              <button
                                className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                                onClick={(e) => {
                                  e.stopPropagation()
                                  // Logique pour ajouter aux favoris
                                }}
                              >
                                <Heart className="h-4 w-4 text-gray-700" />
                              </button>
                            </div>
                          </div>
                          <div className="p-4 flex-1 flex flex-col">
                            <div className="flex items-center gap-2 mb-2">
                              <div className="flex items-center">
                                <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                                <span className="ml-1 text-sm font-medium">{activity.rating}</span>
                              </div>
                              <span className="text-gray-400">•</span>
                              <span className="text-sm text-gray-600">{activity.reviews} avis</span>
                            </div>
                            <h3 className="text-lg font-bold text-[#344E41] mb-2">{activity.name}</h3>
                            <p className="text-gray-600 mb-4 line-clamp-2">{activity.description}</p>
                            <div className="mt-auto flex justify-between items-center">
                              <div className="flex items-center text-gray-600">
                                <Clock className="h-4 w-4 mr-1" />
                                <span className="text-sm">{activity.duration}</span>
                              </div>
                              <div className="font-bold text-[#344E41]">{activity.price}</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {activeTab === "partenaires" && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#344E41]">Partenaires à {wilaya.name}</h2>
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Rechercher un partenaire..."
                        className="pl-9 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    </div>
                    <select
                      className="px-4 py-2 bg-white border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
                      value={partnerTypeFilter}
                      onChange={(e) => setPartnerTypeFilter(e.target.value)}
                    >
                      <option value="all">Tous les types</option>
                      <option value="Hébergement">Hébergement</option>
                      <option value="Restauration">Restauration</option>
                      <option value="Agence de voyage">Agence de voyage</option>
                      <option value="Guide touristique">Guide touristique</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {filteredPartners.map((partner) => (
                    <div key={partner.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                      <div className="flex flex-col md:flex-row h-full">
                        <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                          <Image
                            src={partner.image || "/placeholder.svg"}
                            alt={partner.name}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute top-2 right-2">
                            <span className="bg-white/80 px-2 py-1 rounded-full text-xs font-medium text-[#344E41]">
                              {partner.type}
                            </span>
                          </div>
                        </div>
                        <div className="p-6 flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-[#344E41]">{partner.name}</h3>
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                              <span className="ml-1 font-medium">{partner.rating}</span>
                              <span className="ml-1 text-sm text-gray-500">({partner.reviews} avis)</span>
                            </div>
                          </div>
                          <p className="text-gray-600 mb-4">{partner.description}</p>
                          <div className="space-y-2 mb-4">
                            <div className="flex items-center text-gray-600">
                              <MapPin className="h-4 w-4 text-[#588157] mr-2" />
                              <span>{partner.address}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Phone className="h-4 w-4 text-[#588157] mr-2" />
                              <span>{partner.phone}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Mail className="h-4 w-4 text-[#588157] mr-2" />
                              <span>{partner.email}</span>
                            </div>
                            <div className="flex items-center text-gray-600">
                              <Globe className="h-4 w-4 text-[#588157] mr-2" />
                              <a href={`https://${partner.website}`} className="text-[#588157] hover:underline">
                                {partner.website}
                              </a>
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2 mb-4">
                            {partner.services.map((service, index) => (
                              <span key={index} className="px-2 py-1 bg-gray-100 rounded-full text-xs text-gray-600">
                                {service}
                              </span>
                            ))}
                          </div>
                          <div className="flex justify-between items-center">
                            <div className="flex items-center">
                              <span className="text-sm text-gray-500">Prix:</span>
                              <span className="ml-1 font-medium text-[#344E41]">
                                {partner.priceRange === "$" && "Économique"}
                                {partner.priceRange === "$$" && "Modéré"}
                                {partner.priceRange === "$$$" && "Élevé"}
                              </span>
                            </div>
                            <button className="px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors">
                              Contacter
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "avis" && (
              <div>
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-[#344E41]">Avis des voyageurs</h2>
                  <div className="flex items-center">
                    <Star className="h-6 w-6 text-yellow-400 fill-yellow-400 mr-2" />
                    <span className="text-2xl font-bold">{wilaya.rating}</span>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
                  <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-full bg-[#588157] flex items-center justify-center text-white">
                      <span>JD</span>
                    </div>
                    <div className="flex-1">
                      <input
                        type="text"
                        placeholder="Partagez votre expérience..."
                        className="w-full px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                      />
                    </div>
                    <button className="p-2 rounded-full bg-[#588157] text-white">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                      </svg>
                    </button>
                  </div>
                </div>

                <div className="space-y-6">
                  {wilaya.reviews.map((review) => (
                    <div key={review.id} className="bg-white rounded-xl shadow-sm p-6">
                      <div className="flex items-start gap-4">
                        <div className="h-12 w-12 rounded-full bg-gray-200 flex items-center justify-center text-gray-600">
                          <span>{review.user.charAt(0)}</span>
                        </div>
                        <div className="flex-1">
                          <div className="flex justify-between items-start">
                            <div>
                              <h3 className="font-bold text-[#344E41]">{review.user}</h3>
                              <p className="text-sm text-gray-500">{review.date}</p>
                            </div>
                            <div className="flex items-center">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-5 w-5 ${
                                    i < review.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-300"
                                  }`}
                                />
                              ))}
                            </div>
                          </div>
                          <p className="mt-2 text-gray-600">{review.comment}</p>
                          <div className="mt-2 flex items-center">
                            <button className="flex items-center text-gray-500 hover:text-[#588157]">
                              <ThumbsUp className="h-4 w-4 mr-1" />
                              <span>{review.likes}</span>
                            </button>
                            <button className="flex items-center text-gray-500 hover:text-[#588157] ml-4">
                              <MessageSquare className="h-4 w-4 mr-1" />
                              <span>Répondre</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === "pratique" && (
              <div className="space-y-8">
                <div>
                  <h2 className="text-2xl font-bold text-[#344E41] mb-4">Informations pratiques</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-[#344E41] mb-3">Comment s'y rendre</h3>
                      <p className="text-gray-600">
                        Tamanrasset est accessible par avion depuis Alger, avec des vols réguliers vers l'aéroport de
                        Tamanrasset. Il est également possible d'y accéder par la route, mais le trajet est long et
                        nécessite une bonne préparation.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-[#344E41] mb-3">Meilleure période</h3>
                      <p className="text-gray-600">
                        La meilleure période pour visiter Tamanrasset est d'octobre à mars, lorsque les températures
                        sont plus clémentes. Évitez l'été où les températures peuvent dépasser 45°C.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-[#344E41] mb-3">Où se loger</h3>
                      <p className="text-gray-600">
                        Tamanrasset dispose d'hôtels de différentes catégories, de maisons d'hôtes et de campements
                        touaregs. Pour une expérience authentique, optez pour un séjour chez l'habitant ou dans un
                        campement traditionnel.
                      </p>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm p-6">
                      <h3 className="text-lg font-bold text-[#344E41] mb-3">Sécurité</h3>
                      <p className="text-gray-600">
                        Il est recommandé de voyager avec un guide local et de se renseigner sur la situation
                        sécuritaire avant de partir. Certaines zones peuvent nécessiter des autorisations spéciales.
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-[#344E41] mb-4">Conseils de voyage</h3>
                  <ul className="space-y-2">
                    {wilaya.travelTips.map((tip, index) => (
                      <li key={index} className="flex items-start bg-white rounded-xl shadow-sm p-4">
                        <Info className="h-5 w-5 text-[#588157] mr-2 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{tip}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
