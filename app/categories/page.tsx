"use client";

import { Sidebar } from "@/components/sidebar";
import { Header } from "@/components/header";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import clientPromise from "@/lib/mongodb";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchCategories() {
      try {
        const res = await fetch("/api/categories");
        if (!res.ok)
          throw new Error("Erreur lors du chargement des catégories");
        const data = await res.json();
        setCategories(data);
      } catch (e: any) {
        setError(e.message || "Erreur inconnue");
      } finally {
        setLoading(false);
      }
    }
    fetchCategories();
  }, []);

  if (loading) return <div className="ml-64 p-8">Chargement...</div>;
  if (error) return <div className="ml-64 p-8 text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <div className="mb-2">
          <Link
            href="/explorer"
            className="text-[#588157] hover:text-[#3A5A40] flex items-center"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Retour à l'explorateur
          </Link>
        </div>

        <Header
          title="Catégories"
          subtitle="Explorez l'Algérie par régions géographiques"
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {categories.map((category) => (
            <Link key={category._id} href={`/categories/${category._id}`}>
              <div className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow h-full">
                <div className="relative h-48">
                  <Image
                    src={category.imageUrl || "/placeholder.svg"}
                    alt={category.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-4 text-white">
                    <h3 className="text-xl font-bold">{category.name}</h3>
                    <p className="text-sm">
                      {category.wilayas?.length || 0} wilayas
                    </p>
                  </div>
                </div>
                <div className="p-4">
                  <p className="text-gray-600">{category.description}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
