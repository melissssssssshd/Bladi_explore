"use client";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";

export default function MesReservationsPage() {
  // À remplacer par l'ID de l'utilisateur connecté (auth réelle)
  const userId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReservations() {
      if (!userId) {
        setError("Utilisateur non connecté");
        setLoading(false);
        return;
      }
      try {
        const res = await fetch(
          `/api/user/reservations?userId=${encodeURIComponent(userId)}`
        );
        if (res.ok) {
          setReservations(await res.json());
        } else {
          setError("Erreur lors du chargement de vos réservations.");
        }
      } catch {
        setError("Erreur lors du chargement de vos réservations.");
      }
      setLoading(false);
    }
    fetchReservations();
  }, [userId]);

  const handleCancel = async (id: string) => {
    if (!window.confirm("Annuler cette réservation ?")) return;
    try {
      const res = await fetch(`/api/user/reservations/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setReservations((prev) => prev.filter((r) => r._id !== id));
      } else {
        alert("Erreur lors de l'annulation.");
      }
    } catch {
      alert("Erreur lors de l'annulation.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] min-h-screen">
      <h1 className="text-2xl font-bold mb-8 text-center text-[#344E41] drop-shadow">
        Mes réservations
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64 text-lg font-semibold">
          Chargement...
        </div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : reservations.length === 0 ? (
        <div className="text-center text-gray-500">
          Aucune réservation trouvée.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow-lg">
            <thead>
              <tr className="bg-[#e9ecef] text-[#344E41]">
                <th className="py-3 px-4 text-left">Offre</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Participants</th>
                <th className="py-3 px-4 text-left">Statut</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, idx) => (
                <tr
                  key={r._id ? String(r._id) : `resa-${idx}`}
                  className="border-b hover:bg-[#f1f3f5] transition"
                >
                  <td className="py-2 px-4 font-semibold text-[#344E41]">
                    {r.offreNom || "-"}
                  </td>
                  <td className="py-2 px-4">
                    {r.date ? new Date(r.date).toLocaleDateString() : "-"}
                  </td>
                  <td className="py-2 px-4">{r.participants ?? "-"}</td>
                  <td className="py-2 px-4">
                    <span
                      className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        r.status === "Annulée"
                          ? "bg-red-100 text-red-600"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status || "Validée"}
                    </span>
                  </td>
                  <td className="py-2 px-4 text-right">
                    {r.status !== "Annulée" && (
                      <Button
                        variant="destructive"
                        size="sm"
                        className="text-xs px-3 py-1"
                        onClick={() => handleCancel(r._id)}
                      >
                        Annuler
                      </Button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
