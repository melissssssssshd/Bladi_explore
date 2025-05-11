"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import Link from "next/link"
import Image from "next/image"
import { ArrowLeft } from "lucide-react"

const categories = [
  {
    id: "sud",
    name: "Sud de l'Algérie",
    image: "/images/tassili.jpeg",
    count: 6,
    description:
      "Découvrez les vastes étendues désertiques, les oasis verdoyantes et les formations rocheuses uniques du Sahara algérien.",
  },
  {
    id: "nord",
    name: "Nord de l'Algérie",
    image: "/images/casbah.jpeg",
    count: 6,
    description:
      "Explorez les villes côtières, les plages méditerranéennes et les montagnes verdoyantes du nord algérien.",
  },
  {
    id: "est",
    name: "Est de l'Algérie",
    image: "/images/plage-sidi-merouane.jpeg",
    count: 3,
    description: "Visitez les plages magnifiques, les sites historiques et les paysages montagneux de l'est algérien.",
  },
  {
    id: "ouest",
    name: "Ouest de l'Algérie",
    image: "/images/skikda.jpeg",
    count: 3,
    description: "Découvrez les plaines fertiles, les villes historiques et le littoral de l'ouest algérien.",
  },
]

export default function CategoriesPage() {
  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-2">
          <Link href="/explorer" className="text-[#588157] hover:text-[#3A5A40] flex items-center">
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à l'explorateur
          </Link>
        </div>

        <Header title="Catégories" subtitle="Explorez l'Algérie par régions géographiques" />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link key={category.id} href={`/categories/${category.id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                <div className="relative h-48">
                  <Image src={category.image || "/placeholder.svg"} alt={category.name} fill className="object-cover" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm">{category.count} wilayas</p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  )
}
