"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Mail, Phone, MapPin, Calendar, User, Edit, Trash2 } from "lucide-react"

// Données fictives pour les utilisateurs
const usersData = [
  {
    id: "1",
    firstName: "Ahmed",
    lastName: "Benali",
    email: "ahmed.benali@example.com",
    phone: "+213 123 456 789",
    role: "Utilisateur",
    status: "Actif",
    joinDate: "12/04/2023",
    address: "123 Rue des Oliviers, Alger",
    bio: "Passionné de voyages et de découvertes culturelles",
    avatar: "/placeholder.svg",
    publications: 12,
    commentaires: 45,
    favoris: 8,
  },
  {
    id: "2",
    firstName: "Fatima",
    lastName: "Zahra",
    email: "fatima.zahra@example.com",
    phone: "+213 234 567 890",
    role: "Utilisateur",
    status: "Actif",
    joinDate: "15/04/2023",
    address: "45 Avenue de l'Indépendance, Oran",
    bio: "Photographe amateur et amoureuse de la nature",
    avatar: "/placeholder.svg",
    publications: 8,
    commentaires: 23,
    favoris: 15,
  },
  {
    id: "3",
    firstName: "Karim",
    lastName: "Hadj",
    email: "karim.hadj@example.com",
    phone: "+213 345 678 901",
    role: "Utilisateur",
    status: "Inactif",
    joinDate: "20/04/2023",
    address: "78 Rue des Palmiers, Constantine",
    bio: "Guide touristique professionnel",
    avatar: "/placeholder.svg",
    publications: 5,
    commentaires: 12,
    favoris: 3,
  },
]

export default function UserDetailPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string
  const [showDeleteModal, setShowDeleteModal] = useState(false)

  // Trouver l'utilisateur correspondant
  const user = usersData.find((u) => u.id === userId)

  if (!user) {
    return (
      <div className="p-8 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Utilisateur non trouvé</h2>
        <p className="text-gray-600 mb-6">L'utilisateur que vous recherchez n'existe pas.</p>
        <Link
          href="/admin/utilisateurs"
          className="px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40] transition-colors"
        >
          Retour à la liste des utilisateurs
        </Link>
      </div>
    )
  }

  const handleDelete = () => {
    // Logique de suppression ici
    console.log(`Suppression de l'utilisateur ${userId}`)
    setShowDeleteModal(false)
    router.push("/admin/utilisateurs")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/admin/utilisateurs" className="text-[#588157] hover:text-[#3A5A40] flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour à la liste des utilisateurs
        </Link>
      </div>

      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            {user.firstName} {user.lastName}
          </h1>
          <p className="text-gray-600">{user.role}</p>
        </div>
        <div className="flex gap-2">
          <Link
            href={`/admin/utilisateurs/edit/${userId}`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4" />
            <span>Modifier</span>
          </Link>
          <button
            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            onClick={() => setShowDeleteModal(true)}
          >
            <Trash2 className="h-4 w-4" />
            <span>Supprimer</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Informations principales */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Informations personnelles</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <Mail className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-800">{user.email}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Phone className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Téléphone</p>
                <p className="text-gray-800">{user.phone}</p>
              </div>
            </div>
            <div className="flex items-start">
              <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Adresse</p>
                <p className="text-gray-800">{user.address}</p>
              </div>
            </div>
            <div className="flex items-start">
              <Calendar className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Date d'inscription</p>
                <p className="text-gray-800">{user.joinDate}</p>
              </div>
            </div>
            <div className="flex items-start">
              <User className="h-5 w-5 text-gray-500 mr-3 mt-0.5" />
              <div>
                <p className="text-sm text-gray-500">Biographie</p>
                <p className="text-gray-800">{user.bio}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Statistiques */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-semibold mb-4">Statistiques</h2>
          <div className="space-y-4">
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Statut</p>
              <div className="flex items-center mt-1">
                <span
                  className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    user.status === "Actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {user.status}
                </span>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Publications</p>
              <p className="text-xl font-semibold text-gray-800">{user.publications}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Commentaires</p>
              <p className="text-xl font-semibold text-gray-800">{user.commentaires}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-md">
              <p className="text-sm text-gray-500">Favoris</p>
              <p className="text-xl font-semibold text-gray-800">{user.favoris}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Modal de confirmation de suppression */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Confirmer la suppression</h2>
            <p className="text-gray-600 mb-6">
              Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible.
            </p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
                onClick={() => setShowDeleteModal(false)}
              >
                Annuler
              </button>
              <button className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={handleDelete}>
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
