"use client";

import {
  Users,
  Map,
  FileText,
  Handshake,
  Eye,
  ArrowUpRight,
  MessageCircle,
} from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function AdminDashboard() {
  const [stats, setStats] = useState({
    users: 0,
    partners: 0,
    wilayas: 0,
    publications: 0,
    forum: 0,
  });
  const [recentUsers, setRecentUsers] = useState<any[]>([]);
  const [recentPublications, setRecentPublications] = useState<any[]>([]);
  const [forumChange, setForumChange] = useState("+0%");
  const [forumIncreasing, setForumIncreasing] = useState(true);
  const [wilayas, setWilayas] = useState<any[]>([]);

  useEffect(() => {
    // Récupère les stats dynamiquement
    fetchStats();
    fetchRecentUsers();
    fetchRecentPublications();
    fetchForumChange();
    fetchWilayas();
  }, []);

  const fetchStats = async () => {
    // Remplace les endpoints par tes vraies API si besoin
    const [users, partners, wilayas, publications, forum] = await Promise.all([
      fetch("/api/users").then((r) => r.json()),
      fetch("/api/partners").then((r) => r.json()),
      fetch("/api/wilayas").then((r) => r.json()),
      fetch("/api/publications").then((r) => r.json()),
      fetch("/api/forum/threads").then((r) => r.json()),
    ]);
    setStats({
      users: users.length,
      partners: partners.length,
      wilayas: wilayas.length,
      publications: publications.length,
      forum: forum.length,
    });
  };

  const fetchRecentUsers = async () => {
    const users = await fetch("/api/users?limit=5&sort=-createdAt").then((r) =>
      r.json()
    );
    setRecentUsers(users.slice(0, 5));
  };

  const fetchRecentPublications = async () => {
    const pubs = await fetch("/api/publications?limit=5&sort=-createdAt").then(
      (r) => r.json()
    );
    setRecentPublications(pubs.slice(0, 5));
  };

  const fetchForumChange = async () => {
    // Optionnel : calcule l'évolution du nombre de sujets forum (exemple sur 30 jours)
    // Ici, on laisse statique pour l'exemple
    setForumChange("+3.7%");
    setForumIncreasing(true);
  };

  const fetchWilayas = async () => {
    const data = await fetch("/api/wilayas").then((r) => r.json());
    setWilayas(data);
  };

  const statsArray = [
    {
      title: "Utilisateurs",
      value: stats.users,
      change: "+12.5%", // à rendre dynamique si besoin
      increasing: true,
      icon: <Users className="h-6 w-6 text-blue-500" />,
      href: "/admin/utilisateurs",
    },
    {
      title: "Partenaires",
      value: stats.partners,
      change: "+5.2%",
      increasing: true,
      icon: <Handshake className="h-6 w-6 text-green-500" />,
      href: "/admin/partenaires",
    },
    {
      title: "Wilayas",
      value: stats.wilayas,
      change: "0%",
      increasing: false,
      icon: <Map className="h-6 w-6 text-amber-500" />,
      href: "/admin/wilayas",
    },
    {
      title: "Publications",
      value: stats.publications,
      change: "+8.1%",
      increasing: true,
      icon: <FileText className="h-6 w-6 text-purple-500" />,
      href: "/admin/publications",
    },
    {
      title: "Forum",
      value: stats.forum,
      change: forumChange,
      increasing: forumIncreasing,
      icon: <MessageCircle className="h-6 w-6 text-pink-500" />,
      href: "/admin/forum",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Tableau de bord</h1>
        <p className="text-gray-600">
          Bienvenue dans l'interface d'administration de Bladi
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        {statsArray.map((stat) => (
          <Link
            key={stat.title}
            href={stat.href}
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="text-sm font-medium text-gray-500">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold mt-1">{stat.value}</p>
              </div>
              <div className="p-2 rounded-md bg-gray-50">{stat.icon}</div>
            </div>
            <div className="flex items-center mt-4">
              <span
                className={`text-xs font-medium ${
                  stat.increasing
                    ? "text-green-600"
                    : stat.change === "0%"
                      ? "text-gray-500"
                      : "text-red-600"
                }`}
              >
                {stat.change}
              </span>
              <span className="text-xs text-gray-500 ml-2">
                depuis le mois dernier
              </span>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Users */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-lg font-semibold">Utilisateurs récents</h2>
            <Link
              href="/admin/utilisateurs"
              className="text-[#588157] hover:text-[#3A5A40] flex items-center"
            >
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
                  <tr key={user._id || user.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-medium text-gray-900">
                        {user.name || user.firstName + " " + user.lastName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.email}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                      {user.createdAt
                        ? new Date(user.createdAt).toLocaleString()
                        : user.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.status === "actif" || user.status === "Actif"
                            ? "bg-green-100 text-green-800"
                            : "bg-gray-100 text-gray-800"
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
            <Link
              href="/admin/publications"
              className="text-[#588157] hover:text-[#3A5A40] flex items-center"
            >
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
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Wilaya
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {recentPublications.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="text-center py-8 text-gray-400">
                      Aucune publication récente
                    </td>
                  </tr>
                ) : (
                  recentPublications.map((publication) => (
                    <tr
                      key={publication._id || publication.id}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                        {publication.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-600 max-w-xs truncate">
                        {publication.description}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {publication.createdAt
                          ? new Date(publication.createdAt).toLocaleDateString()
                          : "-"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                        {wilayas.find((w) => w._id === publication.wilayaId)
                          ?.name || "-"}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
