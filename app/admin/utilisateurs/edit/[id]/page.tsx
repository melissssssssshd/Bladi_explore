"use client"

import type React from "react"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

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
  },
]

export default function EditUserPage() {
  const params = useParams()
  const router = useRouter()
  const userId = params.id as string

  // Trouver l'utilisateur correspondant
  const user = usersData.find((u) => u.id === userId)

  const [formData, setFormData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: user?.phone || "",
    role: user?.role || "Utilisateur",
    status: user?.status || "Actif",
    address: user?.address || "",
    bio: user?.bio || "",
  })

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Logique de mise à jour ici
    console.log("Données mises à jour:", formData)
    router.push(`/admin/utilisateurs/${userId}`)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2 mb-6">
        <Link href={`/admin/utilisateurs/${userId}`} className="text-[#588157] hover:text-[#3A5A40] flex items-center">
          <ArrowLeft className="h-4 w-4 mr-1" />
          Retour au profil de l'utilisateur
        </Link>
      </div>

      <div>
        <h1 className="text-2xl font-bold text-gray-800">Modifier l'utilisateur</h1>
        <p className="text-gray-600">
          Modifiez les informations de {user.firstName} {user.lastName}
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-sm p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                Prénom
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                Nom
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Téléphone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
                Rôle
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              >
                <option value="Utilisateur">Utilisateur</option>
                <option value="Modérateur">Modérateur</option>
                <option value="Administrateur">Administrateur</option>
              </select>
            </div>
            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Statut
              </label>
              <select
                id="status"
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
              >
                <option value="Actif">Actif</option>
                <option value="Inactif">Inactif</option>
              </select>
            </div>
          </div>

          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
              Adresse
            </label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
            />
          </div>

          <div>
            <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">
              Biographie
            </label>
            <textarea
              id="bio"
              name="bio"
              rows={4}
              value={formData.bio}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#588157]"
            ></textarea>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Link
              href={`/admin/utilisateurs/${userId}`}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Annuler
            </Link>
            <button type="submit" className="px-4 py-2 bg-[#588157] text-white rounded-md hover:bg-[#3A5A40]">
              Enregistrer les modifications
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
