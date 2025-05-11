"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Link from "next/link";

interface HeaderProps {
  title: string;
  subtitle?: string;
}

export function Header({ title, subtitle }: HeaderProps) {
  return (
    <header className="fixed top-0 right-0 left-64 h-16 bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between h-full px-6">
        <div className="flex-1 max-w-2xl">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              type="search"
              placeholder="Rechercher une destination..."
              className="pl-10 w-full"
            />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/profil">
            <div className="h-10 w-10 rounded-full bg-[#588157] flex items-center justify-center text-white">
              <span>JD</span>
            </div>
          </Link>
        </div>
      </div>
    </header>
  );
}
