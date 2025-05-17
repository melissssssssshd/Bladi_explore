"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Star, Share2, Heart } from "lucide-react";
import ChatBox from "../../components/ChatBot";
import AuthCheck from "@/components/AuthCheck";

interface Wilaya {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
  overview?: {
    image?: string;
    description?: string;
    region?: string;
    weather?: string;
    bestPeriod?: string;
    localCuisine?: string;
    culturalEvents?: string;
    travelTips?: string;
  };
  createdAt?: string;
  updatedAt?: string;
}

export default function ExplorerPage() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [regionFilter, setRegionFilter] = useState<string>("");
  // Gestion des favoris (API)
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchFavorites() {
      const token = localStorage.getItem("token");
      if (!token) return;
      const res = await fetch("/api/user/favorites", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const favs = await res.json();
        setFavorites(favs.map((f: any) => f.itemId));
      }
    }
    fetchFavorites();
    fetchWilayas();
  }, []);

  const fetchWilayas = async () => {
    try {
      const response = await fetch("/api/wilayas");
      const data = await response.json();
      setWilayas(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les wilayas",
        variant: "error",
      });
    }
  };

  const regions = Array.from(
    new Set(wilayas.map((w) => w.overview?.region).filter(Boolean))
  );

  const filteredWilayas = wilayas.filter(
    (wilaya) =>
      (wilaya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        wilaya.description.toLowerCase().includes(searchTerm.toLowerCase())) &&
      (!regionFilter || wilaya.overview?.region === regionFilter)
  );

  const isFavorite = (id: string) => favorites.includes(id);

  const toggleFavorite = async (id: string) => {
    const token = localStorage.getItem("token");
    if (!token) return;
    if (isFavorite(id)) {
      // Supprimer des favoris
      await fetch("/api/user/favorites", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: id }),
      });
      setFavorites((prev) => prev.filter((fid) => fid !== id));
    } else {
      // Ajouter aux favoris
      await fetch("/api/user/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ itemId: id, type: "wilaya" }),
      });
      setFavorites((prev) => [...prev, id]);
    }
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6 text-[#588157]">
              Explorer les Wilayas
            </h1>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <div className="relative max-w-md w-full">
                <Input
                  placeholder="Rechercher une wilaya..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-gray-200 focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition-all duration-200 shadow-sm"
                />
                <svg
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <select
                value={regionFilter}
                onChange={(e) => setRegionFilter(e.target.value)}
                className="rounded-lg border-2 border-gray-200 px-4 py-2 focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition-all duration-200 shadow-sm bg-white text-gray-700"
              >
                <option value="">Toutes les régions</option>
                {regions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWilayas.map((wilaya) => (
              <Card
                key={wilaya._id}
                className="h-full flex flex-col rounded-2xl shadow-xl overflow-hidden relative bg-white group transition-transform duration-200 hover:scale-[1.025] hover:shadow-2xl border border-gray-100"
              >
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={wilaya.imageUrl}
                    alt={wilaya.name}
                    fill
                    className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow transition">
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      className={`bg-white/80 hover:bg-white p-2 rounded-full shadow transition ${
                        isFavorite(wilaya._id)
                          ? "text-red-500"
                          : "text-gray-700"
                      }`}
                      onClick={() => toggleFavorite(wilaya._id)}
                      aria-label={
                        isFavorite(wilaya._id)
                          ? "Retirer des favoris"
                          : "Ajouter aux favoris"
                      }
                      type="button"
                    >
                      <Heart
                        className={`h-5 w-5 transition-all duration-200 ${
                          isFavorite(wilaya._id) ? "fill-red-500 scale-110" : ""
                        }`}
                      />
                    </button>
                  </div>
                  {wilaya.overview?.region && (
                    <span className="absolute bottom-3 left-3 bg-[#588157]/90 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
                      {wilaya.overview.region}
                    </span>
                  )}
                </div>
                <CardContent className="flex-1 flex flex-col p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">
                    {wilaya.name}
                  </h2>
                  <p className="text-gray-700 mb-4 line-clamp-2 flex-1">
                    {wilaya.description}
                  </p>
                  <Link
                    href={`/explorer/wilaya/${wilaya._id}`}
                    className="mt-auto"
                  >
                    <button className="bg-gradient-to-r from-[#588157] to-[#3A5A40] hover:from-[#3A5A40] hover:to-[#344E41] text-white font-semibold px-6 py-2 rounded-lg transition w-full shadow-md">
                      Explorer
                    </button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredWilayas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Aucune wilaya trouvée</p>
            </div>
          )}
        </div>
      </main>
      <AuthCheck>
        <ChatBox />
      </AuthCheck>
    </div>
  );
}
