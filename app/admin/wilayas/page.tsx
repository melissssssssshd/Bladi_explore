"use client"

import { useState } from "react"
import Image from "next/image"
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Eye, MapPin, Star } from "lucide-react"

// Données fictives pour les wilayas
const wilayasData = [
  {
    id: 1,
    name: "Tamanrasset",
    region: "Sud",
    attractions: 12,
    activities: 8,
    rating: 4.9,
    image: "/images/tassili.jpeg",
    status: "Publié",
  },
  {
    id: 2,
    name: "Alger",
    region: "Centre",
    attractions: 25,
    activities: 15,
    rating: 4.7,
    image: "/images/casbah.jpeg",
    status: "Publié",
  },
  {
    id: 3,
    name: "Oran",
    region: "Ouest",
    attractions: 18,
    activities: 10,
    rating: 4.6,
    image: "/images/skikda.jpeg",
    status: "Publié",
  },
  {
    id: 4,
    name: "Constantine",
    region: "Est",
    attractions: 15,
    activities: 9,
    rating: 4.8,
    image: "/images/tassili.jpeg",
    status: "Publié",
  },
  {
    id: 5,
    name: "Béjaïa",
    region: "Centre",
    attractions: 14,
    activities: 12,
    rating: 4.7,
    image: "/images/plage-sidi-merouane.jpeg",
    status: "Publié",
  },
  {
    id: 6,
    name: "Ghardaïa",
    region: "Sud",
    attractions: 10,
    activities: 6,
    rating: 4.5,
    image: "/images/jardin-essai.jpeg",
    status: "Publié",
  },
  {
    id: 7,
    name: "Annaba",
    region: "Est",
    attractions: 12,
    activities: 8,
    rating: 4.6,
    image: "/images/skikda.jpeg",
    status: "Brouillon",
  },
  {
    id: 8,
    name: "Tlemcen",
    region: "Ouest",
    attractions: 16,
    activities: 9,
    rating: 4.7,
    image: "/images/casbah.jpeg",
    status: "Publié",
  },
  {
    id: 9,
    name: "Djanet",
    region: "Sud",
    attractions: 8,
    activities: 5,
    rating: 4.8,
    image: "/images/tassili.jpeg",
    status: "Brouillon",
  },
]

export default function WilayasPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedWilayas, setSelectedWilayas] = useState<number[]>([])
  const itemsPerPage = 6

  // Filtrer les wilayas en fonction du terme de recherche
  const filteredWilayas = wilayasData.filter(
    (wilaya) =>
      wilaya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      wilaya.region.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastWilaya = currentPage * itemsPerPage
  const indexOfFirstWilaya = indexOfLastWilaya - itemsPerPage
  const currentWilayas = filteredWilayas.slice(indexOfFirstWilaya, indexOfLastWilaya)
  const totalPages = Math.ceil(filteredWilayas.length / itemsPerPage)

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des wilayas</h1>
          <p className="text-gray-600">Gérez les wilayas et leurs contenus sur la plateforme Bladi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors">
          <Plus className="h-5 w-5" />
          <span>Ajouter une wilaya</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher une wilaya..."
            className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 text-gray-500" />
            <span>Filtres</span>
          </button>
          <select className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <option value="">Toutes les régions</option>
            <option value="nord">Nord</option>
            <option value="sud">Sud</option>
            <option value="est">Est</option>
            <option value="ouest">Ouest</option>
            <option value="centre">Centre</option>
          </select>
        </div>
      </div>

      {/* Cards des wilayas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentWilayas.map((wilaya) => (
          <div key={wilaya.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="relative h-48">
              <Image src={wilaya.image || "/placeholder.svg"} alt={wilaya.name} fill className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
              <div className="absolute bottom-0 left-0 p-4 text-white">
                <h3 className="text-xl font-bold">{wilaya.name}</h3>
                <div className="flex items-center">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span className="text-sm">{wilaya.region}</span>
                </div>
              </div>
              <div className="absolute top-2 right-2">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    wilaya.status === "Publié" ? "bg-green-100 text-green-800" : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {wilaya.status}
                </span>
              </div>
            </div>
            <div className="p-4">
              <div className="flex justify-between items-center mb-4">
                <div className="flex items-center">
                  <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
                  <span className="ml-1 font-medium">{wilaya.rating}</span>
                </div>
                <div className="flex gap-2">
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Eye className="h-5 w-5 text-gray-500" />
                  </button>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Edit className="h-5 w-5 text-blue-500" />
                  </button>
                  <button className="p-1 rounded-md hover:bg-gray-100">
                    <Trash2 className="h-5 w-5 text-red-500" />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Attractions</p>
                  <p className="text-lg font-semibold">{wilaya.attractions}</p>
                </div>
                <div className="bg-gray-50 p-3 rounded-md">
                  <p className="text-sm text-gray-500">Activités</p>
                  <p className="text-lg font-semibold">{wilaya.activities}</p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">
          Affichage de {indexOfFirstWilaya + 1} à {Math.min(indexOfLastWilaya, filteredWilayas.length)} sur{" "}
          {filteredWilayas.length} wilayas
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={`px-3 py-1 rounded-md ${
                currentPage === page ? "bg-[#588157] text-white" : "text-gray-500 hover:bg-gray-100"
              }`}
            >
              {page}
            </button>
          ))}
          <button
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <ChevronRight className="h-5 w-5 text-gray-500" />
          </button>
        </div>
      </div>
    </div>
  )
}
