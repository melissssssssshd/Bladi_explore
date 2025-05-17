"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";

export default function AjouterOffrePage() {
  const [partenaires, setPartenaires] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    async function fetchPartenaires() {
      const res = await fetch("/api/partners");
      if (res.ok) {
        setPartenaires(await res.json());
      }
      setLoading(false);
    }
    fetchPartenaires();
  }, []);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    const formData = new FormData(e.currentTarget);
    const nom = formData.get("nom");
    const description = formData.get("description");
    const prix = Number(formData.get("prix"));
    const image = formData.get("image");
    const partenaireId = formData.get("partenaireId");
    if (!nom || !description || !prix || !partenaireId) {
      setError("Tous les champs obligatoires doivent être remplis.");
      return;
    }
    const res = await fetch("/api/offres", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nom, description, prix, image, partenaireId }),
    });
    if (res.ok) {
      setSuccess("Offre ajoutée avec succès !");
      if (formRef.current) formRef.current.reset();
    } else {
      setError("Erreur lors de l'ajout de l'offre.");
    }
  };

  if (loading) return <div>Chargement des partenaires...</div>;

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Ajouter une offre</h1>
      <form onSubmit={handleSubmit} ref={formRef} className="space-y-4">
        <div>
          <label className="block font-medium">Nom de l'offre *</label>
          <input name="nom" className="border rounded w-full p-2" required />
        </div>
        <div>
          <label className="block font-medium">Description *</label>
          <textarea
            name="description"
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">Prix (DZD) *</label>
          <input
            name="prix"
            type="number"
            min={1}
            className="border rounded w-full p-2"
            required
          />
        </div>
        <div>
          <label className="block font-medium">
            Image (URL ou vide pour placeholder)
          </label>
          <input name="image" className="border rounded w-full p-2" />
        </div>
        <div>
          <label className="block font-medium">Partenaire *</label>
          <select
            name="partenaireId"
            className="border rounded w-full p-2"
            required
          >
            <option value="">Sélectionner un partenaire</option>
            {partenaires.map((p) => (
              <option key={p._id} value={p._id}>
                {p.nom || p.name}
              </option>
            ))}
          </select>
        </div>
        <div className="flex gap-2">
          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Ajouter l'offre
          </button>
          <button
            type="button"
            className="bg-gray-400 text-white px-4 py-2 rounded"
            onClick={() => router.back()}
          >
            Retour
          </button>
        </div>
        {error && <div className="text-red-600">{error}</div>}
        {success && <div className="text-green-600">{success}</div>}
      </form>
    </div>
  );
}
