"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import Image from "next/image"
import Link from "next/link"
import { MapPin, Heart, ChevronRight } from "lucide-react"

const favoris = [
  {
    id: 1,
    type: "destination",
    name: "Tamanrasset",
    location: "Hoggar, Sud de l'Algérie",
    image: "/images/tassili.jpeg",
    description:
      "Abritant le massif du Hoggar, Tamanrasset est une destination incontournable pour les amateurs de désert.",
  },
  {
    id: 2,
    type: "destination",
    name: "Plage de Sidi Merouane",
    location: "Cap Ténès, Chlef",
    image: "/images/plage-sidi-merouane.jpeg",
    description: "Une plage paradisiaque aux eaux cristallines turquoise entourée de falaises majestueuses.",
  },
  {
    id: 3,
    type: "experience",
    name: "Randonnée dans le Hoggar",
    location: "Tamanrasset",
    image: "/images/tassili.jpeg",
    description: "Une expérience unique pour découvrir les paysages lunaires du massif du Hoggar.",
  },
  {
    id: 4,
    type: "destination",
    name: "La Casbah d'Alger",
    location: "Alger",
    image: "/images/casbah.jpeg",
    description:
      "Un quartier historique classé au patrimoine mondial de l'UNESCO avec ses ruelles étroites et son architecture traditionnelle.",
  },
]

export default function FavorisPage() {
  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Header title="Favoris" subtitle="Vos destinations et expériences préférées" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {favoris.map((favori) => (
            <div
              key={favori.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow"
            >
              <div className="flex flex-col md:flex-row h-full">
                <div className="relative w-full md:w-2/5 h-48 md:h-auto">
                  <Image src={favori.image || "/placeholder.svg"} alt={favori.name} fill className="object-cover" />
                  <button className="absolute top-2 right-2 p-2 bg-white/80 rounded-full hover:bg-white transition-colors">
                    <Heart className="h-5 w-5 text-red-500 fill-red-500" />
                  </button>
                </div>
                <div className="p-6 flex-1">
                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-[#588157] mr-1" />
                    <span className="text-sm text-gray-600">{favori.location}</span>
                  </div>
                  <h3 className="text-xl font-bold text-[#344E41] mb-2">{favori.name}</h3>
                  <p className="text-gray-600 mb-4 line-clamp-2">{favori.description}</p>
                  <div className="flex justify-between items-center">
                    <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded-full">
                      {favori.type === "destination" ? "Destination" : "Expérience"}
                    </span>
                    <Link
                      href={`/${favori.type}/${favori.id}`}
                      className="text-[#588157] hover:text-[#3A5A40] font-medium flex items-center"
                    >
                      Explorer
                      <ChevronRight className="h-4 w-4 ml-1" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
