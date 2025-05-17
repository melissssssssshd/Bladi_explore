"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Pencil, Trash2, Plus, XCircle } from "lucide-react";
import SafeImage from "@/components/SafeImage";

export default function AdminOffresPage() {
  const [offres, setOffres] = useState<any[]>([]);
  const [partenaires, setPartenaires] = useState<any[]>([]);
  const [wilayas, setWilayas] = useState<any[]>([]);
  const [selectedPartenaire, setSelectedPartenaire] = useState("");
  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [newOffre, setNewOffre] = useState({
    nom: "",
    description: "",
    prix: 0,
    image: "",
    partenaireId: "",
    placesRestantes: 10,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchAll() {
      try {
        const [offresRes, partenairesRes, wilayasRes] = await Promise.all([
          fetch("/api/offres"),
          fetch("/api/partners"),
          fetch("/api/wilayas"),
        ]);
        setOffres(await offresRes.json());
        setPartenaires(await partenairesRes.json());
        setWilayas(await wilayasRes.json());
      } catch {
        setError("Erreur lors du chargement des données.");
      }
      setLoading(false);
    }
    fetchAll();
  }, [success]);

  const handleAddOffre = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");
    if (
      !newOffre.nom ||
      !newOffre.description ||
      !newOffre.prix ||
      !newOffre.partenaireId
    ) {
      setError("Tous les champs obligatoires doivent être remplis.");
      setLoading(false);
      return;
    }
    const res = await fetch("/api/offres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOffre),
    });
    if (res.ok) {
      setSuccess("Offre ajoutée avec succès !");
      setShowForm(false);
      setNewOffre({
        nom: "",
        description: "",
        prix: 0,
        image: "",
        partenaireId: "",
        placesRestantes: 10,
      });
      // Supprimer toute tentative d'utiliser await dans setOffres (erreur de syntaxe)
      // L'ajout d'offre doit se faire via la page d'ajout dédiée, pas ici
      // On ne gère ici que l'affichage, le filtrage et la suppression
    } else {
      setError("Erreur lors de l'ajout de l'offre.");
    }
    setLoading(false);
  };

  // Correction suppression : on refetch après suppression pour éviter l'erreur d'await
  const handleDelete = async (id: string) => {
    if (!window.confirm("Supprimer cette offre ?")) return;
    const res = await fetch(`/api/offres/${id}`, { method: "DELETE" });
    if (res.ok) {
      setSuccess("Offre supprimée.");
      // On refetch toutes les offres pour garder la liste à jour
      setLoading(true);
      const offresRes = await fetch("/api/offres");
      setOffres(await offresRes.json());
    } else {
      setError("Erreur lors de la suppression.");
    }
  };

  // Filtrage par partenaire et wilaya
  const filteredOffres = offres.filter((offre) => {
    const byPartenaire =
      selectedPartenaire && selectedPartenaire !== "Tous les partenaires"
        ? offre.partenaireId === selectedPartenaire
        : true;
    const byWilaya =
      selectedWilaya && selectedWilaya !== "Toutes les wilayas"
        ? partenaires.find((p) => p._id === offre.partenaireId)?.wilayaId ===
          selectedWilaya
        : true;
    return byPartenaire && byWilaya;
  });

  return (
    <div className="p-8 bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#344E41] drop-shadow">
        Gestion des offres
      </h1>
      <div className="flex flex-col md:flex-row gap-4 mb-6 items-center justify-between">
        <div className="flex gap-2 w-full md:w-auto">
          <select
            className="border rounded p-2 min-w-[180px]"
            value={selectedPartenaire}
            onChange={(e) => setSelectedPartenaire(e.target.value)}
          >
            <option value="">Tous les partenaires</option>
            {partenaires.map((p) => (
              <option key={p._id} value={p._id}>
                {p.name}
              </option>
            ))}
          </select>
          <select
            className="border rounded p-2 min-w-[180px]"
            value={selectedWilaya}
            onChange={(e) => setSelectedWilaya(e.target.value)}
          >
            <option value="">Toutes les wilayas</option>
            {wilayas.map((w) => (
              <option key={w._id} value={w._id}>
                {w.name}
              </option>
            ))}
          </select>
        </div>
        <Button
          className="bg-[#588157] hover:bg-[#3A5A40] text-white px-6 py-2 rounded-lg"
          onClick={() => setShowForm(true)}
        >
          <Plus className="h-5 w-5 mr-2" /> Ajouter une offre
        </Button>
      </div>
      {loading ? (
        <div className="flex justify-center items-center h-64 text-lg font-semibold">
          Chargement des offres...
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : filteredOffres.length === 0 ? (
        <div className="text-center text-gray-500">Aucune offre trouvée.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredOffres.map((offre, idx) => {
            const partenaire = partenaires.find(
              (p) => p._id === offre.partenaireId
            );
            const wilaya = wilayas.find(
              (w) => w._id === (partenaire?.wilayaId || "")
            );
            return (
              <div
                key={offre._id ? String(offre._id) : `offre-${idx}`}
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
                <div className="flex items-center justify-between mt-2 mb-2">
                  <span className="text-lg font-bold text-[#344E41]">
                    {offre.prix ? offre.prix + " DZD" : "-"}
                  </span>
                  <span className="text-xs bg-[#e9ecef] text-[#588157] px-3 py-1 rounded-full">
                    Places : {offre.placesRestantes ?? "-"}
                  </span>
                </div>
                <div className="flex flex-col gap-1 mb-2">
                  <span className="text-xs text-gray-500">
                    Partenaire : {partenaire?.name || "-"}
                  </span>
                  <span className="text-xs text-gray-500">
                    Wilaya : {wilaya?.name || "-"}
                  </span>
                </div>
                <div className="flex gap-2 mt-2">
                  <Link
                    href={`/admin/offres/${offre._id}/edit`}
                    className="px-3 py-1 bg-yellow-500 text-white rounded"
                  >
                    Modifier
                  </Link>
                  <button
                    onClick={() => handleDelete(offre._id)}
                    className="px-3 py-1 bg-red-600 text-white rounded"
                  >
                    Supprimer
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
      {/* Modal ajout offre */}
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl relative max-h-[80vh] overflow-y-auto p-8">
            <button
              className="absolute top-4 right-4"
              onClick={() => setShowForm(false)}
            >
              <XCircle className="h-6 w-6 text-gray-400 hover:text-gray-600" />
            </button>
            <h2 className="text-xl font-bold mb-6 text-[#344E41]">
              Ajouter une offre
            </h2>
            <form onSubmit={handleAddOffre} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  placeholder="Nom de l'offre"
                  value={newOffre.nom}
                  onChange={(e) =>
                    setNewOffre({ ...newOffre, nom: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Description"
                  value={newOffre.description}
                  onChange={(e) =>
                    setNewOffre({ ...newOffre, description: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Prix (DZD)"
                  type="number"
                  min={1}
                  value={newOffre.prix}
                  onChange={(e) =>
                    setNewOffre({ ...newOffre, prix: Number(e.target.value) })
                  }
                  required
                />
                <Input
                  placeholder="Image (URL ou vide pour placeholder)"
                  value={newOffre.image}
                  onChange={(e) =>
                    setNewOffre({ ...newOffre, image: e.target.value })
                  }
                />
                <Input
                  placeholder="ID du partenaire"
                  value={newOffre.partenaireId}
                  onChange={(e) =>
                    setNewOffre({ ...newOffre, partenaireId: e.target.value })
                  }
                  required
                />
                <Input
                  placeholder="Places restantes"
                  type="number"
                  min={1}
                  value={newOffre.placesRestantes}
                  onChange={(e) =>
                    setNewOffre({
                      ...newOffre,
                      placesRestantes: Number(e.target.value),
                    })
                  }
                />
              </div>
              <div className="flex justify-end mt-4">
                <Button
                  type="submit"
                  className="bg-[#588157] hover:bg-[#3A5A40] text-white px-8 py-2 rounded-lg shadow"
                >
                  Ajouter
                </Button>
              </div>
              {error && <div className="text-red-600 mt-2">{error}</div>}
              {success && <div className="text-green-600 mt-2">{success}</div>}
            </form>
          </div>
        </div>
      )}
      {success && <div className="text-green-600 mt-4">{success}</div>}
    </div>
  );
}
