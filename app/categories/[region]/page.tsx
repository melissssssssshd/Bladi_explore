"use client"

import { Sidebar } from "@/components/sidebar"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft, Search, Share2, Heart } from "lucide-react"
import { useParams } from "next/navigation"
import { useState } from "react"

const regionData = {
  sud: {
    name: "Sud de l'Algérie",
    description:
      "Explorez les vastes étendues désertiques et les oasis luxuriantes du Sud algérien, une région riche en culture et en paysages à couper le souffle.",
  },
  nord: {
    name: "Nord de l'Algérie",
    description:
      "Découvrez les villes côtières, les plages méditerranéennes et les montagnes verdoyantes du nord algérien.",
  },
  est: {
    name: "Est de l'Algérie",
    description: "Visitez les plages magnifiques, les sites historiques et les paysages montagneux de l'est algérien.",
  },
  ouest: {
    name: "Ouest de l'Algérie",
    description: "Explorez les plaines fertiles, les villes historiques et le littoral de l'ouest algérien.",
  },
}

const wilayasData = {
  sud: [
    {
      id: 1,
      name: "Tamanrasset",
      image: "/images/tassili.jpeg",
      location: "Hoggar",
      rating: 4.9,
      description:
        "Abritant le massif du Hoggar, Tamanrasset offre des paysages lunaires et une culture touareg authentique.",
      popular: true,
    },
    {
      id: 2,
      name: "Ghardaïa",
      image: "/images/jardin-essai.jpeg",
      location: "M'zab",
      rating: 4.8,
      description: "Célèbre pour sa vallée du M'Zab classée au patrimoine mondial de l'UNESCO.",
      popular: true,
    },
    {
      id: 3,
      name: "Adrar",
      image: "/images/tassili.jpeg",
      location: "Sud-Ouest",
      rating: 4.7,
      description: "Continuez pour ses oasis et ses ksour traditionnels.",
      popular: true,
    },
    {
      id: 4,
      name: "Ouargla",
      image: "/images/skikda.jpeg",
      location: "Sud-Est",
      rating: 4.7,
      description:
        "Connue comme la « capitale du Sahara algérien », avec ses palmeraies et son architecture traditionnelle.",
      popular: false,
    },
    {
      id: 5,
      name: "Béchar",
      image: "/images/plage-sidi-merouane.jpeg",
      location: "Sud-Ouest",
      rating: 4.6,
      description: "Porte du désert avec ses palmeraies et ses dunes de sable.",
      popular: false,
    },
    {
      id: 6,
      name: "Tindouf",
      image: "/images/casbah.jpeg",
      location: "Sud-Ouest",
      rating: 4.5,
      description: "Région frontalière connue pour ses paysages désertiques et son histoire.",
      popular: false,
    },
  ],
  nord: [
    {
      id: 7,
      name: "Alger",
      image: "/images/casbah.jpeg",
      location: "Centre-Nord",
      rating: 4.8,
      description: "La capitale avec sa célèbre Casbah et sa baie magnifique.",
      popular: true,
    },
    {
      id: 8,
      name: "Oran",
      image: "/images/jardin-essai.jpeg",
      location: "Nord-Ouest",
      rating: 4.7,
      description: "Deuxième ville du pays connue pour son ambiance et son patrimoine.",
      popular: true,
    },
    {
      id: 9,
      name: "Béjaïa",
      image: "/images/plage-sidi-merouane.jpeg",
      location: "Kabylie",
      rating: 4.8,
      description: "Ville côtière avec des plages magnifiques et des montagnes.",
      popular: true,
    },
    {
      id: 10,
      name: "Tizi Ouzou",
      image: "/images/casbah.jpeg",
      location: "Kabylie",
      rating: 4.6,
      description: "Cœur de la Kabylie avec ses villages de montagne pittoresques.",
      popular: false,
    },
    {
      id: 11,
      name: "Tipaza",
      image: "/images/skikda.jpeg",
      location: "Centre-Nord",
      rating: 4.7,
      description: "Connue pour ses ruines romaines et ses plages.",
      popular: false,
    },
    {
      id: 12,
      name: "Boumerdès",
      image: "/images/plage-sidi-merouane.jpeg",
      location: "Centre-Nord",
      rating: 4.5,
      description: "Ville côtière avec de belles plages et une nature préservée.",
      popular: false,
    },
  ],
  est: [
    {
      id: 13,
      name: "Constantine",
      image: "/images/casbah.jpeg",
      location: "Nord-Est",
      rating: 4.8,
      description: "La ville des ponts suspendus avec son patrimoine historique.",
      popular: true,
    },
    {
      id: 14,
      name: "Annaba",
      image: "/images/plage-sidi-merouane.jpeg",
      location: "Nord-Est",
      rating: 4.7,
      description: "Ville côtière avec des plages et des sites historiques.",
      popular: true,
    },
    {
      id: 15,
      name: "Skikda",
      image: "/images/skikda.jpeg",
      location: "Nord-Est",
      rating: 4.6,
      description: "Connue pour ses plages magnifiques et ses criques.",
      popular: true,
    },
  ],
  ouest: [
    {
      id: 16,
      name: "Tlemcen",
      image: "/images/casbah.jpeg",
      location: "Nord-Ouest",
      rating: 4.7,
      description: "Ville historique avec un riche patrimoine culturel.",
      popular: true,
    },
    {
      id: 17,
      name: "Mostaganem",
      image: "/images/plage-sidi-merouane.jpeg",
      location: "Nord-Ouest",
      rating: 4.6,
      description: "Ville côtière avec de belles plages et une corniche.",
      popular: true,
    },
    {
      id: 18,
      name: "Sidi Bel Abbès",
      image: "/images/jardin-essai.jpeg",
      location: "Nord-Ouest",
      rating: 4.5,
      description: "Ville connue pour ses jardins et son patrimoine.",
      popular: true,
    },
  ],
}

export default function RegionPage() {
  const params = useParams()
  const region = params.region as string
  const [searchTerm, setSearchTerm] = useState("")

  const regionInfo = regionData[region as keyof typeof regionData] || {
    name: "Région",
    description: "Description de la région",
  }

  const wilayas = wilayasData[region as keyof typeof wilayasData] || []

  const filteredWilayas = wilayas.filter((wilaya) => wilaya.name.toLowerCase().includes(searchTerm.toLowerCase()))

  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/categories" className="text-[#588157] hover:text-[#3A5A40] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour aux catégories
          </Link>
          <span className="text-gray-400 mx-2">›</span>
          <span className="text-gray-600">{regionInfo.name}</span>
        </div>

        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-[#344E41]">Wilayas : {regionInfo.name}</h1>
            <p className="text-gray-600 mt-2">{regionInfo.description}</p>
          </div>
          <div className="flex items-center">
            <button className="px-4 py-2 bg-white rounded-lg shadow-sm border border-gray-200 flex items-center gap-2 text-gray-700">
              <span>Filtres</span>
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
                <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
              </svg>
            </button>
          </div>
        </div>

        <div className="relative mb-8">
          <input
            type="text"
            placeholder="Rechercher une wilaya..."
            className="w-full px-4 py-3 pl-10 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredWilayas.map((wilaya) => (
            <div
              key={wilaya.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="relative">
                <Link href={`/wilaya/${wilaya.id}`}>
                  <div className="relative h-48">
                    <Image src={wilaya.image || "/placeholder.svg"} alt={wilaya.name} fill className="object-cover" />
                    {wilaya.popular && (
                      <div className="absolute top-3 left-3 bg-[#588157] text-white text-xs font-medium px-2 py-1 rounded">
                        Populaire
                      </div>
                    )}
                    <div className="absolute top-3 right-3 flex gap-2">
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Share2 className="h-4 w-4 text-gray-700" />
                      </button>
                      <button className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                        <Heart className="h-4 w-4 text-gray-700" />
                      </button>
                    </div>
                  </div>
                </Link>
                <div className="p-4">
                  <div className="flex items-center gap-1 mb-2">
                    <span className="text-yellow-500">★</span>
                    <span className="font-medium">{wilaya.rating}</span>
                  </div>
                  <Link href={`/wilaya/${wilaya.id}`}>
                    <h3 className="text-xl font-bold text-[#344E41] hover:text-[#588157] transition-colors">
                      {wilaya.name}
                    </h3>
                  </Link>
                  <p className="text-gray-500 text-sm mb-2">{wilaya.location}</p>
                  <p className="text-gray-600 mb-4 line-clamp-2">{wilaya.description}</p>
                  <Link
                    href={`/wilaya/${wilaya.id}`}
                    className="inline-block px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
                  >
                    Explorer
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
