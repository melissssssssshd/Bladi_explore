"use client"

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
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
  region?: string;
  rating?: number;
  isPopular?: boolean;
}

const regionMap: Record<string, string> = {
  "Alger": "Centre-Nord",
  "Oran": "Nord-Ouest",
  "Béjaïa": "Kabylie",
};
const ratingMap: Record<string, number> = {
  "Alger": 4.8,
  "Oran": 4.7,
  "Béjaïa": 4.8,
};
const popularWilayas = ["Alger", "Oran", "Béjaïa"];

export default function FavorisPage() {
  const [wilayas, setWilayas] = useState<Wilaya[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    const favs = localStorage.getItem("wilaya_favorites");
    if (favs) setFavorites(JSON.parse(favs));
    fetchWilayas();
  }, []);

  const fetchWilayas = async () => {
    try {
      const response = await fetch("/api/wilayas");
      let data = await response.json();
      data = data.map((w: Wilaya) => ({
        ...w,
        region: regionMap[w.name] || "",
        rating: ratingMap[w.name] || 4.5,
        isPopular: popularWilayas.includes(w.name),
      }));
      setWilayas(data);
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Impossible de charger les wilayas",
        variant: "error",
      });
    }
  };

  const favoriteWilayas = wilayas.filter((w) => favorites.includes(w._id));

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="flex-1 ml-64">
        <div className="p-8">
          <h1 className="text-4xl font-bold mb-8 text-[#588157]">Mes Favoris</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {favoriteWilayas.map((wilaya) => (
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
                  {wilaya.isPopular && (
                    <span className="absolute top-3 left-3 bg-green-700 text-white text-xs font-semibold px-3 py-1 rounded-lg shadow">
                      Populaire
                    </span>
                  )}
                  <div className="absolute top-3 right-3 flex gap-2">
                    <button className="bg-white/80 hover:bg-white p-2 rounded-full shadow transition">
                      <Share2 className="h-4 w-4 text-gray-700" />
                    </button>
                    <button className="bg-white/80 p-2 rounded-full shadow text-red-500" disabled>
                      <Heart className="h-4 w-4 fill-red-500" />
                    </button>
                  </div>
                </div>
                <CardContent className="flex-1 flex flex-col p-6">
                  <div className="flex items-center gap-1 mb-2">
                    <Star className="h-4 w-4 text-yellow-500 fill-yellow-400" />
                    <span className="font-semibold text-gray-800 text-sm">{wilaya.rating?.toFixed(1)}</span>
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-1">{wilaya.name}</h2>
                  <div className="text-sm text-gray-500 mb-2">{wilaya.region}</div>
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
          {favoriteWilayas.length === 0 && (
            <div className="text-center py-16">
              <p className="text-gray-500 text-lg">Aucun favori pour le moment.</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
