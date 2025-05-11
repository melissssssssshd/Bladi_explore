"use client"

import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import Image from "next/image"
import { useParams } from "next/navigation"
import { useState } from "react"
import { ArrowLeft, Search, MapPin, Phone, Mail, Star, ExternalLink } from "lucide-react"

// Données fictives pour les wilayas
const wilayasData = [
  {
    id: "1",
    name: "Tamanrasset",
    region: "Sud de l'Algérie",
  },
  // Autres wilayas...
]

// Données fictives pour les partenaires
const partnersData = {
  "1": [
    {
      id: 1,
      name: "Hôtel Hoggar",
      type: "Hébergement",
      category: "hotel",
      image: "/images/tassili.jpeg",
      rating: 4.8,
      reviews: 124,
      address: "Centre-ville, Tamanrasset",
      phone: "+213 123 456 789",
      email: "contact@hotelhoggar.com",
      website: "www.hotelhoggar.com",
      description:
        "Situé au cœur de Tamanrasset, l'Hôtel Hoggar offre un confort moderne tout en respectant l'architecture traditionnelle. Idéal pour les voyageurs en quête d'authenticité.",
      services: ["Wi-Fi gratuit", "Restaurant", "Piscine", "Climatisation", "Parking"],
      priceRange: "$$",
    },
    {
      id: 2,
      name: "Restaurant Tassili",
      type: "Restauration",
      category: "restaurant",
      image: "/images/casbah.jpeg",
      rating: 4.6,
      reviews: 87,
      address: "Rue principale, Tamanrasset",
      phone: "+213 234 567 890",
      email: "info@restauranttassili.com",
      website: "www.restauranttassili.com",
      description:
        "Le Restaurant Tassili vous propose une cuisine traditionnelle touareg dans un cadre authentique. Spécialités locales et plats internationaux.",
      services: ["Terrasse", "Climatisation", "Réservation", "Plats à emporter"],
      priceRange: "$$",
    },
    {
      id: 3,
      name: "Sahara Tours",
      type: "Agence de voyage",
      category: "agence",
      image: "/images/tassili.jpeg",
      rating: 4.9,
      reviews: 156,
      address: "Avenue de l'Indépendance, Tamanrasset",
      phone: "+213 345 678 901",
      email: "contact@saharatours.com",
      website: "www.saharatours.com",
      description:
        "Spécialiste des excursions dans le Hoggar et le Tassili n'Ajjer. Circuits personnalisés, guides expérimentés et équipement de qualité.",
      services: ["Excursions guidées", "Location de 4x4", "Circuits sur mesure", "Transferts aéroport"],
      priceRange: "$$$",
    },
    {
      id: 4,
      name: "Hoggar Adventures",
      type: "Guide touristique",
      category: "guide",
      image: "/images/plage-sidi-merouane.jpeg",
      rating: 4.7,
      reviews: 92,
      address: "Quartier Garet, Tamanrasset",
      phone: "+213 456 789 012",
      email: "info@hoggaradventures.com",
      website: "www.hoggaradventures.com",
      description:
        "Guides touaregs expérimentés pour des randonnées inoubliables dans le massif du Hoggar. Découvrez les secrets du désert avec des locaux.",
      services: ["Randonnées", "Bivouac", "Observation des étoiles", "Découverte culturelle"],
      priceRange: "$$",
    },
    {
      id: 5,
      name: "Assekrem Lodge",
      type: "Hébergement",
      category: "hotel",
      image: "/images/skikda.jpeg",
      rating: 4.5,
      reviews: 68,
      address: "Route de l'Assekrem, Tamanrasset",
      phone: "+213 567 890 123",
      email: "reservation@assekrem-lodge.com",
      website: "www.assekrem-lodge.com",
      description:
        "Situé à proximité du célèbre plateau de l'Assekrem, ce lodge offre une vue imprenable sur les montagnes du Hoggar et un accès privilégié pour admirer le lever du soleil.",
      services: ["Vue panoramique", "Restauration", "Excursions", "Transferts"],
      priceRange: "$$$",
    },
    {
      id: 6,
      name: "Café Tinhinan",
      type: "Restauration",
      category: "restaurant",
      image: "/images/jardin-essai.jpeg",
      rating: 4.4,
      reviews: 45,
      address: "Place du marché, Tamanrasset",
      phone: "+213 678 901 234",
      email: "cafe.tinhinan@gmail.com",
      website: "",
      description:
        "Café traditionnel proposant des pâtisseries locales et du thé à la menthe. Ambiance conviviale et décoration typique.",
      services: ["Terrasse", "Wi-Fi", "Pâtisseries maison"],
      priceRange: "$",
    },
  ],
  // Autres wilayas...
}

export default function PartenairesPage() {
  const params = useParams()
  const id = params.id as string
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null)

  // Trouver la wilaya correspondante
  const wilaya = wilayasData.find((w) => w.id === id) || { id: "1", name: "Tamanrasset", region: "Sud de l'Algérie" }

  // Récupérer les partenaires de cette wilaya
  const partners = partnersData[id as keyof typeof partnersData] || partnersData["1"]

  // Filtrer les partenaires
  const filteredPartners = partners.filter(
    (partner) =>
      (selectedCategory === "all" || partner.category === selectedCategory) &&
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const categories = [
    { id: "all", name: "Tous" },
    { id: "hotel", name: "Hôtels" },
    { id: "restaurant", name: "Restaurants" },
    { id: "agence", name: "Agences de voyage" },
    { id: "guide", name: "Guides touristiques" },
  ]

  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href={`/wilaya/${id}`} className="text-[#588157] hover:text-[#3A5A40] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à {wilaya.name}
          </Link>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-bold text-[#344E41]">Partenaires à {wilaya.name}</h1>
            <p className="text-gray-600">Découvrez les meilleurs hôtels, restaurants et services touristiques</p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
          <div className="relative max-w-md w-full">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Rechercher un partenaire..."
              className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2">
            {categories.map((category) => (
              <button
                key={category.id}
                className={`px-4 py-2 rounded-md whitespace-nowrap ${
                  selectedCategory === category.id
                    ? "bg-[#588157] text-white"
                    : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                }`}
                onClick={() => setSelectedCategory(category.id)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {selectedPartner !== null ? (
          <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="relative h-64">
              <Image
                src={partners[selectedPartner].image || "/placeholder.svg"}
                alt={partners[selectedPartner].name}
                fill
                className="object-cover"
              />
              <button
                onClick={() => setSelectedPartner(null)}
                className="absolute top-4 left-4 p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                <div className="flex items-center gap-2 text-white">
                  <span className="px-3 py-1 bg-[#588157]/80 rounded-full text-sm">
                    {partners[selectedPartner].type}
                  </span>
                  <div className="flex items-center ml-2">
                    <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                    <span className="ml-1">{partners[selectedPartner].rating}</span>
                    <span className="mx-1">•</span>
                    <span>{partners[selectedPartner].reviews} avis</span>
                  </div>
                </div>
                <h2 className="text-2xl font-bold text-white mt-2">{partners[selectedPartner].name}</h2>
              </div>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <h3 className="text-lg font-bold text-[#344E41] mb-3">À propos</h3>
                  <p className="text-gray-600 mb-6">{partners[selectedPartner].description}</p>

                  <h3 className="text-lg font-bold text-[#344E41] mb-3">Services</h3>
                  <div className="flex flex-wrap gap-2 mb-6">
                    {partners[selectedPartner].services.map((service, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-700">
                        {service}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg">
                  <h3 className="text-lg font-bold text-[#344E41] mb-3">Informations de contact</h3>
                  <div className="space-y-3">
                    <div className="flex items-start">
                      <MapPin className="h-5 w-5 text-[#588157] mr-2 mt-0.5" />
                      <span className="text-gray-600">{partners[selectedPartner].address}</span>
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-5 w-5 text-[#588157] mr-2" />
                      <span className="text-gray-600">{partners[selectedPartner].phone}</span>
                    </div>
                    <div className="flex items-center">
                      <Mail className="h-5 w-5 text-[#588157] mr-2" />
                      <span className="text-gray-600">{partners[selectedPartner].email}</span>
                    </div>
                    {partners[selectedPartner].website && (
                      <div className="flex items-center">
                        <ExternalLink className="h-5 w-5 text-[#588157] mr-2" />
                        <a
                          href={`https://${partners[selectedPartner].website}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-[#588157] hover:underline"
                        >
                          {partners[selectedPartner].website}
                        </a>
                      </div>
                    )}
                    <div className="mt-4 pt-4 border-t border-gray-200">
                      <p className="text-sm text-gray-500 mb-1">Gamme de prix</p>
                      <p className="font-medium text-[#344E41]">{partners[selectedPartner].priceRange}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPartners.map((partner, index) => (
              <div
                key={partner.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => setSelectedPartner(index)}
              >
                <div className="relative h-48">
                  <Image src={partner.image || "/placeholder.svg"} alt={partner.name} fill className="object-cover" />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 bg-[#588157]/80 text-white rounded-full text-sm">{partner.type}</span>
                  </div>
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="text-lg font-bold text-[#344E41]">{partner.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 text-yellow-400 fill-yellow-400" />
                      <span className="ml-1 font-medium">{partner.rating}</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span>{partner.address}</span>
                  </div>
                  <p className="text-gray-600 mb-4 line-clamp-2">{partner.description}</p>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {partner.services.slice(0, 3).map((service, index) => (
                      <span key={index} className="text-xs text-gray-500">
                        {service}
                        {index < Math.min(partner.services.length, 3) - 1 && " • "}
                      </span>
                    ))}
                    {partner.services.length > 3 && (
                      <span className="text-xs text-gray-500">+{partner.services.length - 3}</span>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2 pt-2 border-t border-gray-100">
                    <span className="text-sm text-gray-500">{partner.reviews} avis</span>
                    <span className="text-sm font-medium text-[#344E41]">{partner.priceRange}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  )
}
