"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Home, Map, Compass, Heart, User, LogOut } from "lucide-react";

const navigation = [
  { name: "Accueil", href: "/", icon: Home },
  { name: "Explorer", href: "/explorer", icon: Compass }, // Changé vers la route générale
  { name: "Carte", href: "/page-simplified", icon: Map },
  { name: "Favoris", href: "/favoris", icon: Heart },
  { name: "Profil", href: "/profil", icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();

  // Suppression de la logique de récupération de la première wilaya
  const handleExplorerClick = (e: React.MouseEvent) => {
    e.preventDefault();
    router.push("/explorer"); // Redirection vers la page générale d'exploration
  };

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200">
      <div className="flex flex-col h-full">
        {/* En-tête */}
        <div className="flex items-center justify-center h-16 border-b border-gray-200">
          <Link href="/" className="text-2xl font-bold text-[#344E41]">
            Bladi Tourisme
          </Link>
        </div>

        {/* Navigation principale */}
        <nav className="flex-1 px-4 py-6 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center px-4 py-2 text-sm font-medium rounded-lg ${
                pathname.startsWith(item.href)
                  ? "bg-[#588157] text-white"
                  : "text-gray-600 hover:bg-gray-100"
              }`}
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>

        {/* Bouton de déconnexion */}
        <div className="p-4 border-t border-gray-200">
          <button
            onClick={() => {
              localStorage.removeItem("token");
              window.location.href = "/login";
            }}
            className="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Déconnexion
          </button>
        </div>
      </div>
    </div>
  );
}