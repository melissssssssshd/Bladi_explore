"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, MessageCircle } from "lucide-react";

export default function NouveauSujet() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [author, setAuthor] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/forum/threads", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, content, author }),
    });
    setLoading(false);
    router.push("/forum");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9f5ee] py-8 px-2 md:px-0">
      <div className="max-w-xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center gap-2 text-[#588157] hover:underline font-medium"
          >
            <ArrowLeft className="w-5 h-5" />
            Revenir à la page précédente
          </button>
        </div>
        <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-6">
            <MessageCircle className="w-6 h-6 text-[#588157]" />
            <h1 className="text-2xl font-bold text-[#344E41]">Nouveau sujet</h1>
          </div>
          <form onSubmit={handleSubmit} className="space-y-5">
            <input
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#588157]/30 text-lg"
              placeholder="Titre du sujet"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#588157]/30 text-base min-h-[100px]"
              placeholder="Contenu du sujet..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
            <input
              className="border rounded px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#588157]/30 text-base"
              placeholder="Votre nom"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              required
            />
            <button
              type="submit"
              className="bg-[#588157] hover:bg-[#3A5A40] text-white font-semibold px-6 py-2 rounded-lg transition w-full"
              disabled={loading}
            >
              {loading ? "Création..." : "Créer le sujet"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
