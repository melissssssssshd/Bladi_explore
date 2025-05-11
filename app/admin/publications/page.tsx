"use client"

import { useState } from "react"
import Image from "next/image"
import {
  Search,
  Filter,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
  Eye,
  Calendar,
  User,
  MessageSquare,
  Heart,
} from "lucide-react"

// Données fictives pour les publications
const publicationsData = [
  {
    id: 1,
    title: "Les plages cachées de Béjaïa",
    excerpt: "Découvrez les criques secrètes et les plages paradisiaques de la région de Béjaïa...",
    author: "Ahmed Benali",
    date: "12/05/2023",
    image: "/images/plage-sidi-merouane.jpeg",
    likes: 245,
    comments: 32,
    status: "Publié",
  },
  {
    id: 2,
    title: "Guide de randonnée dans le Hoggar",
    excerpt: "Tout ce que vous devez savoir pour préparer votre trek dans le massif du Hoggar...",
    author: "Karim Hadj",
    date: "10/05/2023",
    image: "/images/tassili.jpeg",
    likes: 189,
    comments: 24,
    status: "Publié",
  },
  {
    id: 3,
    title: "Les meilleurs restaurants d'Alger",
    excerpt: "Notre sélection des meilleures adresses pour déguster la cuisine algérienne traditionnelle...",
    author: "Fatima Zahra",
    date: "08/05/2023",
    image: "/images/casbah.jpeg",
    likes: 312,
    comments: 45,
    status: "En attente",
  },
  {
    id: 4,
    title: "Découverte de la Casbah",
    excerpt: "Visite guidée de ce quartier historique d'Alger classé au patrimoine mondial de l'UNESCO...",
    author: "Amina Khelif",
    date: "05/05/2023",
    image: "/images/casbah.jpeg",
    likes: 178,
    comments: 19,
    status: "Publié",
  },
  {
    id: 5,
    title: "Les oasis du Sud algérien",
    excerpt: "Un voyage à travers les plus belles oasis du Sahara algérien...",
    author: "Mohammed Saïd",
    date: "03/05/2023",
    image: "/images/tassili.jpeg",
    likes: 203,
    comments: 27,
    status: "En attente",
  },
  {
    id: 6,
    title: "Week-end à Oran",
    excerpt: "Que faire et que voir lors d'un court séjour dans la ville d'Oran...",
    author: "Leila Bensalem",
    date: "01/05/2023",
    image: "/images/skikda.jpeg",
    likes: 156,
    comments: 18,
    status: "Publié",
  },
  {
    id: 7,
    title: "Les traditions du M'Zab",
    excerpt: "Immersion dans la culture et les traditions de la vallée du M'Zab...",
    author: "Omar Ferhat",
    date: "28/04/2023",
    image: "/images/jardin-essai.jpeg",
    likes: 134,
    comments: 15,
    status: "Brouillon",
  },
  {
    id: 8,
    title: "Artisanat de Kabylie",
    excerpt: "À la découverte des artisans et des savoir-faire traditionnels de Kabylie...",
    author: "Samira Messaoudi",
    date: "25/04/2023",
    image: "/images/plage-sidi-merouane.jpeg",
    likes: 167,
    comments: 21,
    status: "Publié",
  },
]

export default function PublicationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [selectedPublications, setSelectedPublications] = useState<number[]>([])
  const [statusFilter, setStatusFilter] = useState("all")
  const itemsPerPage = 6

  // Filtrer les publications en fonction du terme de recherche et du statut
  const filteredPublications = publicationsData.filter(
    (publication) =>
      (publication.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        publication.author.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (statusFilter === "all" || publication.status.toLowerCase() === statusFilter.toLowerCase()),
  )

  // Pagination
  const indexOfLastPublication = currentPage * itemsPerPage
  const indexOfFirstPublication = indexOfLastPublication - itemsPerPage
  const currentPublications = filteredPublications.slice(indexOfFirstPublication, indexOfLastPublication)
  const totalPages = Math.ceil(filteredPublications.length / itemsPerPage)

  // Gestion des sélections
  const toggleSelectAll = () => {
    if (selectedPublications.length === currentPublications.length) {
      setSelectedPublications([])
    } else {
      setSelectedPublications(currentPublications.map((publication) => publication.id))
    }
  }

  const toggleSelectPublication = (publicationId: number) => {
    if (selectedPublications.includes(publicationId)) {
      setSelectedPublications(selectedPublications.filter((id) => id !== publicationId))
    } else {
      setSelectedPublications([...selectedPublications, publicationId])
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Gestion des publications</h1>
          <p className="text-gray-600">Gérez les publications et les contenus sur la plateforme Bladi</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors">
          <Plus className="h-5 w-5" />
          <span>Créer une publication</span>
        </button>
      </div>

      {/* Filtres et recherche */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between">
        <div className="relative max-w-md w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <input
            type="text"
            placeholder="Rechercher une publication..."
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
          <select
            className="px-4 py-2 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">Tous les statuts</option>
            <option value="publié">Publié</option>
            <option value="en attente">En attente</option>
            <option value="brouillon">Brouillon</option>
          </select>
        </div>
      </div>

      {/* Table des publications */}
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50">
                <th className="px-6 py-3 text-left">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      className="h-4 w-4 text-[#588157] border-gray-300 rounded focus:ring-[#588157]"
                      checked={
                        selectedPublications.length === currentPublications.length && currentPublications.length > 0
                      }
                      onChange={toggleSelectAll}
                    />
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Publication
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Auteur
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Engagement
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentPublications.map((publication) => (
                <tr key={publication.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        className="h-4 w-4 text-[#588157] border-gray-300 rounded focus:ring-[#588157]"
                        checked={selectedPublications.includes(publication.id)}
                        onChange={() => toggleSelectPublication(publication.id)}
                      />
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="h-12 w-12 flex-shrink-0 rounded-md overflow-hidden">
                        <Image
                          src={publication.image || "/placeholder.svg"}
                          alt={publication.title}
                          width={48}
                          height={48}
                          className="h-full w-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <div className="font-medium text-gray-900">{publication.title}</div>
                        <div className="text-sm text-gray-500 line-clamp-1">{publication.excerpt}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{publication.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-600">{publication.date}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center">
                        <Heart className="h-4 w-4 text-red-500 mr-1" />
                        <span className="text-gray-600">{publication.likes}</span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-blue-500 mr-1" />
                        <span className="text-gray-600">{publication.comments}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        publication.status === "Publié"
                          ? "bg-green-100 text-green-800"
                          : publication.status === "En attente"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {publication.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-3 border-t border-gray-200">
          <div className="text-sm text-gray-500">
            Affichage de {indexOfFirstPublication + 1} à {Math.min(indexOfLastPublication, filteredPublications.length)}{" "}
            sur {filteredPublications.length} publications
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
    </div>
  )
}
