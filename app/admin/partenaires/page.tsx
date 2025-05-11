"use client"

import { useState } from "react"
import { Search, Filter, Plus, ChevronLeft, ChevronRight, Edit, Trash2, Eye, MapPin, Phone, Mail } from "lucide-react"

// Données fictives pour les partenaires
const partnersData = [
  {
    id: 1,
    name: "Hôtel El Djazaïr",
    type: "Hébergement",
    location: "Alger",
    contact: "contact@eldjazair.com",
    phone: "+213 123 456 789",
    status: "Actif",
    joinDate: "10/01/2023",
  },
  {
    id: 2,
    name: "Agence Sahara Tours",
    type: "Agence de voyage",
    location: "Tamanrasset",
    contact: "info@saharatours.com",
    phone: "+213 234 567 890",
    status: "Actif",
    joinDate: "15/01/2023",
  },
  {
    id: 3,
    name: "Restaurant Casbah",
    type: "Restauration",
    location: "Alger",
    contact: "reservation@casbah.com",
    phone: "+213 345 678 901",
    status: "Inactif",
    joinDate: "20/01/2023",
  },
  {
    id: 4,
    name: "Tassili Aventures",
    type: "Guide touristique",
    location: "Djanet",
    contact: "info@tassiliaventures.com",
    phone: "+213 456 789 012",
    status: "Actif",
    joinDate: "25/01/2023",
  },
  {
    id: 5,
    name: "Hôtel Les Zianides",
    type: "Hébergement",
    location: "Tlemcen",
    contact: "reservation@zianides.com",
    phone: "+213 567 890 123",
    status: "Actif",
    joinDate: "01/02/2023",
  },
  {
    id: 6,
    name: "Bejaia Découverte",
    type: "Guide touristique",
    location: "Béjaïa",
    contact: "contact@bejaiadécouverte.com",
    phone: "+213 678 901 234",
    status: "Actif",
    joinDate: "05/02/2023",
  },
  {
    id: 7,
    name: "Restaurant Hoggar",
    type: "Restauration",
    location: "Tamanrasset",
    contact: "info@hoggar-restaurant.com",
    phone: "+213 789 012 345",
    status: "Inactif",
    joinDate: "10/02/2023",
  },
  {
    id: 8,
    name: "Oran City Tours",
    type: "Agence de voyage",
    location: "Oran",
    contact: "contact@orancitytours.com",
    phone: "+213 890 123 456",
    status: "Actif",
    joinDate: "15/02/2023",
  },
]

export default function PartnersPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPartners, setSelectedPartners] = useState<number[]>([])
  const itemsPerPage = 6

  // Filtrer les partenaires en fonction du terme de recherche
  const filteredPartners = partnersData.filter(
    (partner) =>
      partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      partner.location.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  // Pagination
  const indexOfLastPartner = currentPage * itemsPerPage
  const indexOfFirstPartner = indexOfLastPartner - itemsPerPage
  const currentPartners = filteredPartners.slice(indexOfFirstPartner, indexOfLastPartner)
  const totalPages = Math.ceil(filteredPartners.length / itemsPerPage)

  // Gestion des sélections
  const toggleSelectAll = () => {
    if (selectedPartners.length === currentPartners.length) {
      setSelectedPartners([])
    } else {
      setSelectedPartners(currentPartners.map((partner) => partner.id))
    }
  }

  const toggleSelectPartner = (partnerId: number) => {
    if (selectedPartners.includes(partnerId)) {
      setSelectedPartners(selectedPartners.filter((id) => id !== partnerId))
    } else {
      setSelectedPartners([...selectedPartners, partnerId])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des partenaires</h1>
          <p className="text-gray-600">Gérez les partenaires de la plateforme Bladi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors">
          <Plus className="h-5 w-5" />
          <span>Ajouter un partenaire</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
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
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            <Filter className="h-4 w-4 text-gray-500" />
            <span>Filtres</span>
          </button>
          <button className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
            Exporter
          </button>
        </div>
      </div>

      {/* Cards des partenaires */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentPartners.map((partner) => (
          <div key={partner.id} className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-start">
                <div className="flex items-center">
                  <div className="h-12 w-12 rounded-full bg-[#588157] flex items-center justify-center text-white">
                    <span>{partner.name.charAt(0)}</span>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-lg font-semibold text-gray-900">{partner.name}</h3>
                    <p className="text-sm text-gray-500">{partner.type}</p>
                  </div>
                </div>
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    partner.status === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {partner.status}
                </span>
              </div>

              <div className="mt-4 space-y-2">
                <div className="flex items-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{partner.location}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Mail className="h-4 w-4 mr-2" />
                  <span>{partner.contact}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Phone className="h-4 w-4 mr-2" />
                  <span>{partner.phone}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-gray-200 flex justify-between items-center">
                <span className="text-xs text-gray-500">Depuis le {partner.joinDate}</span>
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
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-3 bg-white rounded-lg shadow-sm">
        <div className="text-sm text-gray-500">
          Affichage de {indexOfFirstPartner + 1} à {Math.min(indexOfLastPartner, filteredPartners.length)} sur{" "}
          {filteredPartners.length} partenaires
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
