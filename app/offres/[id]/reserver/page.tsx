"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import SafeImage from "@/components/SafeImage";

export default function ReservationPage({
  params,
}: {
  params: { id: string };
}) {
  const [disponible, setDisponible] = useState<null | boolean>(null);
  const [loading, setLoading] = useState(true);
  const [offre, setOffre] = useState<any>(null);
  const router = useRouter();
  const [paiementLoading, setPaiementLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchDisponibilite() {
      const { id } = await Promise.resolve(params);
      const res = await fetch(`/api/offres/${id}/disponibilite`);
      if (res.ok) {
        const data = await res.json();
        setDisponible(data.disponible);
      } else {
        setDisponible(false);
      }
      setLoading(false);
    }
    async function fetchOffre() {
      const { id } = await Promise.resolve(params);
      const res = await fetch(`/api/offres/${id}`);
      if (res.ok) {
        setOffre(await res.json());
      }
    }
    fetchDisponibilite();
    fetchOffre();
  }, [params]);

  // Simuler l'authentification utilisateur (à remplacer par vrai check)
  const isAuthenticated = true; // À remplacer par ton vrai hook/auth

  // Formulaire de réservation avec Stripe
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setPaiementLoading(true);
    setError("");
    const formData = new FormData(e.currentTarget);
    const date = formData.get("date");
    const participants = Number(formData.get("participants"));
    const userEmail = "test@example.com";
    // Correction : unwrap params avec React.use() (future proof)
    const { id } = params;
    try {
      const res = await fetch("/api/paiement/checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          offreId: id,
          offreNom: offre?.nom || "Offre",
          prix: offre?.prix || 100,
          userEmail,
          date,
          participants,
        }),
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors de la création du paiement");
      }
    } catch (err) {
      setError("Erreur lors de la connexion à Stripe");
    } finally {
      setPaiementLoading(false);
    }
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64 text-lg font-semibold">
        Chargement...
      </div>
    );
  if (disponible === false)
    return (
      <div className="flex justify-center items-center h-64 text-xl text-red-600 font-bold">
        Offre complète
      </div>
    );

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="text-lg">Vous devez être connecté pour réserver.</p>
        <button
          onClick={() => router.push("/login")}
          className="px-4 py-2 bg-[#588157] text-white rounded-lg font-semibold"
        >
          Se connecter
        </button>
      </div>
    );
  }

  // Formulaire de réservation simplifié
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] py-10 px-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg w-full flex flex-col items-center border border-[#e0e4e7]">
        <h1 className="text-2xl font-bold mb-4 text-[#344E41] drop-shadow">
          Réserver l'offre
        </h1>
        {offre && (
          <>
            <SafeImage
              src={offre.image}
              alt={offre.nom}
              width={400}
              height={250}
              className="mb-4 rounded-xl object-cover w-full h-56"
            />
            <h2 className="text-xl font-semibold mb-2 text-[#588157]">
              {offre.nom}
            </h2>
            <p className="mb-2 text-gray-700 text-center">
              {offre.description}
            </p>
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-lg font-bold text-[#344E41]">
                {offre.prix ? offre.prix + " DZD" : "-"}
              </span>
              <span className="text-xs bg-[#e9ecef] text-[#588157] px-3 py-1 rounded-full">
                Places : {offre.placesRestantes ?? "-"}
              </span>
            </div>
          </>
        )}
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 mt-2"
        >
          <label className="flex flex-col gap-1 font-medium">
            Dates :
            <input
              type="date"
              name="date"
              required
              className="border rounded p-2"
            />
          </label>
          <label className="flex flex-col gap-1 font-medium">
            Participants :
            <input
              type="number"
              name="participants"
              min={1}
              required
              className="border rounded p-2"
            />
          </label>
          <button
            type="submit"
            disabled={paiementLoading}
            className="px-4 py-2 bg-gradient-to-r from-[#588157] to-[#344E41] text-white rounded-lg shadow font-semibold hover:from-[#3A5A40] hover:to-[#344E41] transition-colors"
          >
            {paiementLoading
              ? "Redirection vers paiement..."
              : "Procéder au paiement"}
          </button>
          {error && (
            <div className="text-red-600 text-center font-semibold">
              {error}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
