"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function EditOffrePage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params as { id: string };
  const [offre, setOffre] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function fetchOffre() {
      if (!id) return;
      const res = await fetch(`/api/offres/${id}`);
      if (res.ok) {
        setOffre(await res.json());
      } else {
        setError("Offre introuvable");
      }
      setLoading(false);
    }
    fetchOffre();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setOffre({ ...offre, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const res = await fetch(`/api/offres/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(offre),
    });
    if (res.ok) {
      setSuccess("Offre modifiée avec succès !");
      router.push("/admin/offres");
    } else {
      setError("Erreur lors de la modification.");
    }
  };

  if (loading) return <div className="p-8">Chargement...</div>;
  if (error) return <div className="p-8 text-red-600">{error}</div>;
  if (!offre) return <div className="p-8">Aucune offre à éditer.</div>;

  return (
    <div className="max-w-xl mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6 text-[#344E41]">
        Modifier l'offre
      </h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          name="nom"
          value={offre.nom || ""}
          onChange={handleChange}
          placeholder="Nom de l'offre"
          required
        />
        <Input
          name="description"
          value={offre.description || ""}
          onChange={handleChange}
          placeholder="Description"
          required
        />
        <Input
          name="prix"
          type="number"
          value={offre.prix || 0}
          onChange={handleChange}
          placeholder="Prix (DZD)"
          required
        />
        <Input
          name="image"
          value={offre.image || ""}
          onChange={handleChange}
          placeholder="Image (URL)"
        />
        <Input
          name="placesRestantes"
          type="number"
          value={offre.placesRestantes || 0}
          onChange={handleChange}
          placeholder="Places restantes"
        />
        <div className="flex gap-2 mt-4">
          <Button type="submit" className="bg-[#588157] text-white">
            Enregistrer
          </Button>
          <Button type="button" variant="outline" onClick={() => router.back()}>
            Annuler
          </Button>
        </div>
        {error && <div className="text-red-600 mt-2">{error}</div>}
        {success && <div className="text-green-600 mt-2">{success}</div>}
      </form>
    </div>
  );
}
