"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { MessageCircle, ArrowLeft } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";

interface Thread {
  _id: string;
  title: string;
  author: string;
  createdAt: string;
}

export default function ForumPage() {
  const [threads, setThreads] = useState<Thread[]>([]);
  const searchParams = useSearchParams();
  const router = useRouter();

  useEffect(() => {
    fetch("/api/forum/threads")
      .then((res) => res.json())
      .then(setThreads);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#f8fafc] to-[#e9f5ee] py-8 px-2 md:px-0">
      <div className="max-w-3xl mx-auto">
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
        {/* Header forum */}
        <div className="flex items-center gap-3 mb-8">
          <div className="bg-[#588157]/10 p-3 rounded-full">
            <MessageCircle className="w-8 h-8 text-[#588157]" />
          </div>
          <h1 className="text-4xl font-extrabold text-[#344E41] tracking-tight">
            Forum
          </h1>
        </div>
        <div className="relative mb-8">
          <Link href="/forum/nouveau" className="absolute right-0 -top-2">
            <button className="flex items-center gap-2 bg-[#588157] hover:bg-[#3A5A40] text-white font-semibold px-5 py-2 rounded-full shadow transition-all">
              <MessageCircle className="w-5 h-5" />
              Nouveau sujet
            </button>
          </Link>
        </div>
        <div className="space-y-6">
          {threads.length === 0 && (
            <div className="text-center py-16 text-gray-500 text-lg bg-white rounded-xl shadow">
              Aucun sujet pour l'instant.
            </div>
          )}
          {threads.map((thread) => (
            <Link
              key={thread._id}
              href={`/forum/${thread._id}`}
              className="block"
            >
              <div className="bg-white rounded-xl shadow hover:shadow-lg transition p-6 border border-gray-100 hover:border-[#588157]/40 cursor-pointer">
                <div className="flex items-center gap-2 mb-2">
                  <MessageCircle className="w-4 h-4 text-[#588157]" />
                  <span className="text-lg font-semibold text-[#344E41] line-clamp-1">
                    {thread.title}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>
                    Par{" "}
                    <span className="font-medium text-[#588157]">
                      {thread.author}
                    </span>
                  </span>
                  <span>{new Date(thread.createdAt).toLocaleString()}</span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
