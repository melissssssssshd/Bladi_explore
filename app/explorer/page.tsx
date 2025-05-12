"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Image from "next/image";
import Link from "next/link";
import { Sidebar } from "@/components/sidebar";
import { Star, Share2, Heart } from "lucide-react";

interface Wilaya {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function ExplorerPage() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [favorites, setFavorites] = useState<string[]>([]); // Liste des IDs favoris
  const { toast } = useToast();

  useEffect(() => {
    const favs = localStorage.getItem("wilaya_favorites");
    if (favs) setFavorites(JSON.parse(favs));
    fetchWilayas();
  }, []);

  useEffect(() => {
    localStorage.setItem("wilaya_favorites", JSON.stringify(favorites));
  }, [favorites]);

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

  const filteredWilayas = wilayas.filter((wilaya) =>
    wilaya.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    wilaya.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Gestion des favoris
  const isFavorite = (id: string) => favorites.includes(id);
  const toggleFavorite = (id: string) => {
    setFavorites((prev) =>
      prev.includes(id) ? prev.filter((fid) => fid !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-6 text-[#588157]">Explorer les Wilayas</h1>
            <div className="relative max-w-md">
              <Input
                placeholder="Rechercher une wilaya..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 w-full rounded-lg border-2 border-gray-200 focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition-all duration-200"
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
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredWilayas.map((wilaya) => (
              <Card
                key={wilaya._id}
                className="h-full flex flex-col rounded-2xl shadow-lg overflow-hidden relative bg-white"
              >
                <div className="relative h-48">
                  <Image
                    src={wilaya.imageUrl}
                    alt={wilaya.name}
                    fill
                    className="object-cover w-full h-full"
                  />
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow transition">
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button
                      className={`bg-white/80 hover:bg-white p-2 rounded-full shadow transition ${isFavorite(wilaya._id) ? "text-red-500" : "text-gray-700"}`}
                      onClick={() => toggleFavorite(wilaya._id)}
                      aria-label={isFavorite(wilaya._id) ? "Retirer des favoris" : "Ajouter aux favoris"}
                      type="button"
                    >
                      <Heart className={`h-4 w-4 ${isFavorite(wilaya._id) ? "fill-red-500" : ""}`} />
                    </button>
                  </div>
                </div>
                <CardContent className="flex-1 flex flex-col p-6">
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{wilaya.name}</h2>
                  <p className="text-gray-700 mb-4 line-clamp-2 flex-1">{wilaya.description}</p>
                  <Link href={`/explorer/wilaya/${wilaya._id}`} className="mt-auto">
                    <button className="bg-[#588157] hover:bg-[#3A5A40] text-white font-semibold px-6 py-2 rounded-lg transition w-full">
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
    </div>
  );
}