"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { MessageCircle, UserCircle } from "lucide-react";

interface Reply {
  _id: string;
  content: string;
  author: string;
  createdAt: string;
}

interface Thread {
  _id: string;
  title: string;
  content: string;
  author: string;
  createdAt: string;
  replies: Reply[];
}

export default function ForumThreadPage() {
  const { id } = useParams();
  const [thread, setThread] = useState<Thread | null>(null);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState("");
  const [replyAuthor, setReplyAuthor] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    fetch(`/api/forum/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setThread(data);
        setLoading(false);
      });
  }, [id]);

  const handleReply = async (e: React.FormEvent) => {
    e.preventDefault();
    setPosting(true);
    await fetch(`/api/forum/${id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: replyContent, author: replyAuthor }),
    });
    setReplyContent("");
    setReplyAuthor("");
    // Refresh thread
    fetch(`/api/forum/${id}`)
      .then((res) => res.json())
      .then((data) => setThread(data));
    setPosting(false);
  };

  if (loading)
    return <div className="text-center py-16 text-gray-400">Chargement...</div>;
  if (!thread)
    return (
      <div className="text-center py-16 text-red-400">Sujet introuvable</div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9f5ee] py-8 px-2 md:px-0">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center gap-3 mb-8">
          <Link href="/forum" className="text-[#588157] hover:underline">
            ← Retour au forum
          </Link>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8 border border-gray-100">
          <div className="flex items-center gap-2 mb-2">
            <MessageCircle className="w-5 h-5 text-[#588157]" />
            <h2 className="text-2xl font-bold text-[#344E41] line-clamp-2">
              {thread.title}
            </h2>
          </div>
          <div className="text-gray-700 mb-4 whitespace-pre-line">
            {thread.content}
          </div>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <UserCircle className="w-4 h-4 text-[#588157]" />
            <span className="font-medium text-[#588157]">{thread.author}</span>
            <span>•</span>
            <span>{new Date(thread.createdAt).toLocaleString()}</span>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#344E41] mb-4">
            Réponses
          </h3>
          <div className="space-y-4">
            {thread.replies && thread.replies.length > 0 ? (
              thread.replies.map((reply) => (
                <div
                  key={reply._id}
                  className="bg-white rounded-lg shadow p-4 flex gap-3 border border-gray-100"
                >
                  <UserCircle className="w-8 h-8 text-[#588157] flex-shrink-0" />
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#588157]">
                        {reply.author}
                      </span>
                      <span className="text-xs text-gray-400">
                        {new Date(reply.createdAt).toLocaleString()}
                      </span>
                    </div>
                    <div className="text-gray-700 whitespace-pre-line">
                      {reply.content}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-gray-400 text-center">
                Aucune réponse pour l'instant.
              </div>
            )}
          </div>
        </div>
        <form
          onSubmit={handleReply}
          className="bg-white rounded-xl shadow p-6 border border-gray-100 space-y-4"
        >
          <h4 className="text-lg font-semibold text-[#344E41]">
            Ajouter une réponse
          </h4>
          <input
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#588157]/30"
            placeholder="Votre nom"
            value={replyAuthor}
            onChange={(e) => setReplyAuthor(e.target.value)}
            required
          />
          <textarea
            className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#588157]/30"
            placeholder="Votre réponse..."
            value={replyContent}
            onChange={(e) => setReplyContent(e.target.value)}
            required
            rows={3}
          />
          <button
            type="submit"
            className="bg-[#588157] hover:bg-[#3A5A40] text-white font-semibold px-6 py-2 rounded-lg transition w-full"
            disabled={posting}
          >
            {posting ? "Envoi..." : "Envoyer la réponse"}
          </button>
        </form>
      </div>
    </div>
  );
}
