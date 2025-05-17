"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function PaiementSuccess() {
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const router = useRouter();

  // Ici tu peux appeler une API pour valider la réservation côté serveur si besoin
  // (ex: POST /api/offres/[id]/confirmer-reservation)

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Paiement réussi !</h1>
      <p>
        Merci pour votre réservation. Un email de confirmation vous a été
        envoyé.
      </p>
      <button
        className="mt-6 px-4 py-2 bg-blue-600 text-white rounded"
        onClick={() => router.push("/")}
      >
        Retour à l'accueil
      </button>
    </div>
  );
}
