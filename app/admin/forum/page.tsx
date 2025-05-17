"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, Trash2, Eye, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useRouter } from "next/navigation";

// Correction du typage Thread pour inclure createdAt
interface Thread {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
  replies?: {
    _id: string;
    content: string;
    author: string;
    createdAt: string;
  }[];
}

export default function AdminForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchThreads();
  }, []);

  const fetchThreads = async () => {
    const res = await fetch("/api/forum/threads");
    const data = await res.json();
    setThreads(data);
    setLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Supprimer ce sujet ?")) return;
    await fetch(`/api/forum/threads/${id}`, { method: "DELETE" });
    setThreads((threads) => threads.filter((t) => t._id !== id));
  };

  const filteredThreads = threads.filter((thread) =>
    thread.title.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9f5ee] py-8 px-2 md:px-0">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-[#588157] bg-[#588157]/10 p-2 rounded-full" />
            <h1 className="text-3xl font-bold text-[#344E41] tracking-tight">
              Gestion du Forum
            </h1>
          </div>
          <Button
            className="bg-[#588157] hover:bg-[#3A5A40] text-white font-semibold flex items-center gap-2"
            onClick={() => router.push("/forum/nouveau")}
          >
            <MessageCircle className="w-4 h-4" />
            Ajouter un sujet
          </Button>
        </div>
        <div className="bg-white rounded-xl shadow p-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div className="flex items-center gap-2 w-full md:w-1/3">
              <Search className="w-5 h-5 text-gray-400" />
              <Input
                placeholder="Rechercher un sujet..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="text-sm text-gray-500 mt-2 md:mt-0">
              {filteredThreads.length} sujet(s)
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#588157]/10">
                <tr>
                  <th className="p-3 text-left">Titre</th>
                  <th className="p-3 text-left">Auteur</th>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Réponses</th>
                  <th className="p-3 text-left">Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Chargement...
                    </td>
                  </tr>
                ) : filteredThreads.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="text-center py-12 text-gray-400">
                      Aucun sujet.
                    </td>
                  </tr>
                ) : (
                  filteredThreads.map((thread) => (
                    <tr key={thread._id} className="border-b last:border-b-0">
                      <td className="p-3 font-medium max-w-lg truncate">
                        <Link
                          href={`/forum/${thread._id}`}
                          className="text-[#588157] hover:underline flex items-center gap-2"
                        >
                          <Eye className="w-4 h-4" />
                          {thread.title}
                          {(!thread.replies || thread.replies.length === 0) && (
                            <Badge className="ml-2 bg-yellow-100 text-yellow-800">
                              Aucune réponse
                            </Badge>
                          )}
                        </Link>
                      </td>
                      <td className="p-3">{thread.author}</td>
                      <td className="p-3">
                        {new Date(thread.createdAt).toLocaleString()}
                      </td>
                      <td className="p-3">
                        {thread.replies ? thread.replies.length : 0}
                      </td>
                      <td className="p-3">
                        <div className="flex gap-2 flex-wrap">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => router.push(`/forum/${thread._id}`)}
                            className="border-[#588157] text-[#588157] hover:bg-[#e9f5ee] flex items-center gap-1"
                          >
                            <Eye className="w-4 h-4" /> Détail
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            onClick={() => handleDelete(thread._id)}
                            className="bg-red-500 hover:bg-red-600 text-white flex items-center gap-1"
                          >
                            <Trash2 className="w-4 h-4" /> Supprimer
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
