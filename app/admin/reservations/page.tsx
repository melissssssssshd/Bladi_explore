"use client";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function fetchReservations() {
      try {
        const res = await fetch("/api/reservations");
        if (res.ok) {
          setReservations(await res.json());
        } else {
          setError("Erreur lors du chargement des réservations.");
        }
      } catch {
        setError("Erreur lors du chargement des réservations.");
      }
      setLoading(false);
    }
    fetchReservations();
  }, []);

  return (
    <div className="p-8 bg-gradient-to-br from-[#f8fafc] to-[#e9ecef] min-h-screen">
      <h1 className="text-3xl font-bold mb-8 text-center text-[#344E41] drop-shadow">
        Gestion des réservations
      </h1>
      {loading ? (
        <div className="flex justify-center items-center h-64 text-lg font-semibold">
          Chargement des réservations...
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
                <th className="py-3 px-4 text-left">Utilisateur</th>
                <th className="py-3 px-4 text-left">ID Utilisateur</th>
                <th className="py-3 px-4 text-left">Offre</th>
                <th className="py-3 px-4 text-left">Date</th>
                <th className="py-3 px-4 text-left">Participants</th>
                <th className="py-3 px-4 text-left">Statut</th>
              </tr>
            </thead>
            <tbody>
              {reservations.map((r, idx) => (
                <tr
                  key={r._id ? String(r._id) : `resa-${idx}`}
                  className="border-b hover:bg-[#f1f3f5] transition"
                >
                  <td className="py-2 px-4 font-semibold text-[#344E41]">
                    {r.userName || "-"}
                  </td>
                  <td className="py-2 px-4 text-xs text-gray-500">
                    {r.userId || "-"}
                  </td>
                  <td className="py-2 px-4">{r.offreNom || "-"}</td>
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
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
