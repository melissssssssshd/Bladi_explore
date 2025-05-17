"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import SafeImage from "@/components/SafeImage";

export default function OffresPage() {
  const [offres, setOffres] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOffres() {
      const res = await fetch("/api/offres");
      if (res.ok) {
        setOffres(await res.json());
      }
      setLoading(false);
    }
    fetchOffres();
  }, []);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Chargement des offres...
      </div>
    );

  return (
    <div className="p-8 bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#344E41] drop-shadow">
        Toutes les offres
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {offres.length === 0 && (
          <div className="col-span-3 text-center text-gray-500">
            Aucune offre disponible.
          </div>
        )}
        {offres.map((offre, idx) => (
          <div
            key={
              offre._id
                ? String(offre._id)
                : offre.id
                  ? String(offre.id)
                  : `offre-${idx}`
            }
            className="bg-white rounded-2xl shadow-lg p-6 flex flex-col hover:scale-[1.025] transition-transform border border-[#e0e4e7]"
          >
            <SafeImage
              src={offre.image}
              alt={offre.nom}
              width={400}
              height={220}
              className="mb-4 rounded-xl object-cover w-full h-48"
            />
            <h2 className="text-xl font-semibold mb-2 text-[#588157]">
              {offre.nom}
            </h2>
            <p className="mb-2 text-gray-700 line-clamp-3">
              {offre.description}
            </p>
            <div className="flex items-center justify-between mt-2 mb-4">
              <span className="text-lg font-bold text-[#344E41]">
                {offre.prix ? offre.prix + " DZD" : "-"}
              </span>
              <span className="text-xs bg-[#e9ecef] text-[#588157] px-3 py-1 rounded-full">
                Places : {offre.placesRestantes ?? "-"}
              </span>
            </div>
            <Link
              href={`/offres/${offre._id ? offre._id : offre.id}/reserver`}
              className="mt-auto px-4 py-2 bg-gradient-to-r from-[#588157] to-[#344E41] text-white rounded-lg shadow hover:from-[#3A5A40] hover:to-[#344E41] text-center font-semibold transition-colors"
            >
              Réserver
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
