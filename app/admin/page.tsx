"use client"

import { Users, Map, FileText, Handshake, Eye, ArrowUpRight } from "lucide-react"
import Link from "next/link"

export default function AdminDashboard() {
  // Données fictives pour le tableau de bord
  const stats = [
    {
      title: "Utilisateurs",
      value: "1,248",
      change: "+12.5%",
      increasing: true,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      href: "/admin/utilisateurs",
    },
    {
      title: "Partenaires",
      value: "86",
      change: "+5.2%",
      increasing: true,
      icon: <Handshake className="h-6 w-6 text-green-500" />,
      href: "/admin/partenaires",
    },
    {
      title: "Wilayas",
      value: "48",
      change: "0%",
      increasing: false,
      icon: <Map className="h-6 w-6 text-amber-500" />,
      href: "/admin/wilayas",
    },
    {
      title: "Publications",
      value: "352",
      change: "+8.1%",
      increasing: true,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      href: "/admin/publications",
    },
  ]

  const recentUsers = [
    { id: 1, name: "Ahmed Benali", email: "ahmed.benali@example.com", date: "Il y a 2 heures", status: "actif" },
    { id: 2, name: "Fatima Zahra", email: "fatima.zahra@example.com", date: "Il y a 5 heures", status: "actif" },
    { id: 3, name: "Karim Hadj", email: "karim.hadj@example.com", date: "Il y a 1 jour", status: "inactif" },
    { id: 4, name: "Amina Khelif", email: "amina.khelif@example.com", date: "Il y a 2 jours", status: "actif" },
    { id: 5, name: "Mohammed Saïd", email: "mohammed.said@example.com", date: "Il y a 3 jours", status: "actif" },
  ]

  const recentPublications = [
    {
      id: 1,
      title: "Les plages cachées de Béjaïa",
      author: "Ahmed Benali",
      date: "Il y a 3 heures",
      views: 245,
      status: "publié",
    },
    {
      id: 2,
      title: "Guide de randonnée dans le Hoggar",
      author: "Karim Hadj",
      date: "Il y a 1 jour",
      views: 189,
      status: "publié",
    },
    {
      id: 3,
      title: "Les meilleurs restaurants d'Alger",
      author: "Fatima Zahra",
      date: "Il y a 2 jours",
      views: 312,
      status: "en attente",
    },
    {
      id: 4,
      title: "Découverte de la Casbah",
      author: "Amina Khelif",
      date: "Il y a 3 jours",
      views: 178,
      status: "publié",
    },
    {
      id: 5,
      title: "Les oasis du Sud algérien",
      author: "Mohammed Saïd",
      date: "Il y a 4 jours",
      views: 203,
      status: "en attente",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">Bienvenue dans l'interface d'administration de Bladi</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">{stat.icon}</div>
            </div>
            <div className="flex items-center mt-4">
              <span
                className={`text-xs font-medium ${
                  stat.increasing ? "text-green-600" : stat.change === "0%" ? "text-gray-500" : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">depuis le mois dernier</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-semibold">Utilisateurs récents</h2>
            <Link href="/admin/utilisateurs" className="text-[#588157] hover:text-[#3A5A40] flex items-center">
              Voir tout
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nom
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Inscrit
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{user.name}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{user.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "actif" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {user.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Publications */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-semibold">Publications récentes</h2>
            <Link href="/admin/publications" className="text-[#588157] hover:text-[#3A5A40] flex items-center">
              Voir tout
              <ArrowUpRight className="h-4 w-4 ml-1" />
            </Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Titre
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Auteur
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Vues
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Statut
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPublications.map((publication) => (
                  <tr key={publication.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">{publication.title}</div>
                      <div className="text-xs text-gray-500">{publication.date}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">{publication.author}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-gray-500">
                        <Eye className="h-4 w-4 mr-1" />
                        {publication.views}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          publication.status === "publié"
                            ? "bg-green-100 text-green-800"
                            : "bg-yellow-100 text-yellow-800"
                        }`}
                      >
                        {publication.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
