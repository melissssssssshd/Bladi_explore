import { useRouter } from "next/navigation";

export default function PaiementCancel() {
  const router = useRouter();
  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded shadow">
      <h1 className="text-2xl font-bold mb-4">Paiement annulé</h1>
      <p>
        Votre paiement a été annulé. Vous pouvez réessayer ou revenir à
        l'accueil.
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
