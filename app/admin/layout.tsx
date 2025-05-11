"use client";

import type React from "react";

import { useState, Suspense, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Users,
  Map,
  FileText,
  Handshake,
  LogOut,
  Menu,
  X,
  Bell,
  Search,
  Globe,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const navItems = [
    {
      name: "Tableau de bord",
      href: "/admin",
      icon: <FileText className="h-5 w-5" />,
    },
    {
      name: "Utilisateurs",
      href: "/admin/utilisateurs",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Partenaires",
      href: "/admin/partenaires",
      icon: <Handshake className="h-5 w-5" />,
    },
    {
      name: "Wilayas",
      href: "/admin/wilayas",
      icon: <Map className="h-5 w-5" />,
    },
    {
      name: "Publications",
      href: "/admin/publications",
      icon: <FileText className="h-5 w-5" />,
    },
  ];

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.log("❌ Pas de token trouvé");
          router.push("/login");
          return;
        }

        const response = await fetch("/api/auth/verify-token", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const data = await response.json();
        console.log("📦 Réponse de vérification:", data);

        if (!data.valid || data.role !== "admin") {
          console.log("❌ Token invalide ou rôle non admin");
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }

        console.log("✅ Token valide et rôle admin");
        setIsLoading(false);
      } catch (error) {
        console.error("❌ Erreur de vérification:", error);
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    checkAuth();
  }, [router]);

  const handleLogout = async () => {
    try {
      console.log("🔵 Déconnexion en cours...");
      const token = localStorage.getItem("token");

      // Appel à l'API de déconnexion
      const response = await fetch("/api/auth/logout", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la déconnexion");
      }

      // Suppression du token du localStorage
      localStorage.removeItem("token");
      console.log("✅ Déconnexion réussie");

      // Redirection vers la page de connexion
      router.push("/login");
    } catch (error) {
      console.error("❌ Erreur lors de la déconnexion:", error);
      // En cas d'erreur, on force quand même la déconnexion
      localStorage.removeItem("token");
      router.push("/login");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Sidebar for mobile */}
      <div
        className={cn(
          "fixed inset-0 z-50 bg-black/80 lg:hidden",
          sidebarOpen ? "block" : "hidden"
        )}
        onClick={() => setSidebarOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[#344E41] text-white transform transition-transform duration-200 ease-in-out lg:translate-x-0",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between p-4 border-b border-[#3A5A40]">
          <Link href="/admin" className="flex items-center gap-2">
            <Globe className="h-6 w-6" />
            <span className="text-xl font-bold tracking-widest">
              Bladi Admin
            </span>
          </Link>
          <button
            className="p-1 rounded-md hover:bg-[#3A5A40] lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <nav className="p-4 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md transition-colors",
                pathname === item.href
                  ? "bg-[#588157] text-white"
                  : "text-white/80 hover:bg-[#3A5A40] hover:text-white"
              )}
            >
              {item.icon}
              <span>{item.name}</span>
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-[#3A5A40]">
          <button
            className="flex items-center gap-3 px-3 py-2 rounded-md text-white/80 hover:bg-[#3A5A40] hover:text-white transition-colors w-full"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span>Déconnexion</span>
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:pl-64">
        {/* Header */}
        <header className="sticky top-0 z-30 flex items-center justify-between h-16 px-4 border-b bg-white shadow-sm">
          <button
            className="p-1 rounded-md hover:bg-gray-100 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>

          <div className="flex-1 lg:ml-4">
            <div className="relative max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Rechercher..."
                className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button className="relative p-1 rounded-md hover:bg-gray-100">
              <Bell className="h-6 w-6 text-gray-600" />
              <span className="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
            </button>

            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-full bg-[#588157] flex items-center justify-center text-white">
                <span>SA</span>
              </div>
              <div className="hidden md:block">
                <p className="text-sm font-medium">Super Admin</p>
                <p className="text-xs text-gray-500">admin@bladi.com</p>
              </div>
              <ChevronDown className="h-4 w-4 text-gray-500" />
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="p-6">
          <Suspense fallback={<div>Loading...</div>}>{children}</Suspense>
        </main>
      </div>
    </div>
  );
}
