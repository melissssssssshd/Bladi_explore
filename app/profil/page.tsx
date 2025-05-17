"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Edit,
  MapPin,
  Calendar,
  Mail,
  Phone,
  LogOut,
  Heart,
  Activity,
  ArrowLeft,
  Briefcase,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import AvatarUpload from "@/components/profile/avatar-upload";
import { fetchWithAuth } from "@/utils/api";
import Image from "next/image";

interface UserProfile {
  userId: string; // Ajout de userId
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

interface Wilaya {
  _id: string;
  name: string;
  description: string;
  imageUrl: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [favoriteWilayas, setFavoriteWilayas] = useState<Wilaya[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        console.log("Fetching profile with Authorization header");
        const userData = await fetchWithAuth("/api/user/profile");
        setUserData(userData);
        setIsLoading(false);
      } catch (error) {
        toast.error("Impossible de charger votre profil");
        router.push("/login");
      }
    }
    async function fetchFavorites() {
      try {
        const token = localStorage.getItem("token");
        if (!token) return;
        // 1. Récupérer la liste des favoris (itemId)
        const res = await fetch("/api/user/favorites", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) throw new Error("Erreur lors du chargement des favoris");
        const favs = await res.json();
        const ids = favs.map((f: any) => f.itemId);
        if (ids.length === 0) {
          setFavoriteWilayas([]);
          return;
        }
        // 2. Récupérer les wilayas correspondantes
        const wilayaRes = await fetch(`/api/wilayas?limit=1000`);
        const allWilayas = await wilayaRes.json();
        setFavoriteWilayas(allWilayas.filter((w: any) => ids.includes(w._id)));
      } catch (error) {
        toast.error("Impossible de charger vos favoris");
      }
    }
    fetchProfile();
    fetchFavorites();
  }, [router]);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUserData((prev) => {
      if (prev) {
        const updatedUser = { ...prev, avatar: newAvatarUrl };
        localStorage.setItem("user", JSON.stringify(updatedUser)); // Optionnel
        return updatedUser;
      }
      return prev;
    });
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin h-8 w-8 border-4 border-[#588157] border-t-transparent rounded-full"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Erreur</h2>
          <p className="mt-2 text-gray-600">
            Impossible de charger votre profil. Veuillez réessayer.
          </p>
          <Button onClick={() => router.push("/login")} className="mt-4">
            Retour à la connexion
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <Button
          variant="ghost"
          className="flex items-center gap-2 text-gray-600 hover:text-green-600 hover:bg-gray-100 transition duration-200 ease-in-out"
          onClick={() => router.push("/explorer")}
        >
          <ArrowLeft className="h-5 w-5" /> Revenir à la page d'accueil
        </Button>
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3">
          <Card className="overflow-hidden shadow-lg">
            <div className="relative h-36 bg-gradient-to-r from-green-500 to-green-700 rounded-t-lg">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <AvatarUpload
                  currentAvatar={userData?.avatar}
                  onAvatarChange={handleAvatarChange}
                />
              </div>
            </div>
            <CardContent className="pt-20 pb-6 bg-gray-50 rounded-b-lg">
              <div className="text-center mb-6">
                <h2 className="text-3xl font-extrabold text-gray-900">
                  {userData?.firstName} {userData?.lastName}
                </h2>
                {userData?.location && (
                  <p className="text-gray-600 flex items-center justify-center mt-2">
                    <MapPin className="h-5 w-5 mr-2 text-green-600" />{" "}
                    {userData.location}
                  </p>
                )}
              </div>

              <div className="space-y-6">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center border-gray-300 hover:border-green-600 hover:text-green-600 transition duration-200 ease-in-out"
                  onClick={() => router.push("/profil/edit")}
                >
                  <Edit className="mr-2 h-5 w-5" /> Modifier le profil
                </Button>

                <Separator className="bg-gray-300" />

                <div className="space-y-4">
                  <div className="flex items-center text-base">
                    <Mail className="h-5 w-5 mr-3 text-gray-500" />
                    <span>{userData?.email}</span>
                  </div>
                  {userData?.phone && (
                    <div className="flex items-center text-base">
                      <Phone className="h-5 w-5 mr-3 text-gray-500" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-base">
                    <Calendar className="h-5 w-5 mr-3 text-gray-500" />
                    <span>
                      Membre depuis{" "}
                      {new Date(userData?.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <Separator className="bg-gray-300" />

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50 transition duration-200 ease-in-out"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-5 w-5" /> Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 rounded-lg shadow-md">
              <TabsTrigger
                value="info"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition duration-200 ease-in-out"
              >
                <Edit className="h-5 w-5" /> Informations
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition duration-200 ease-in-out"
              >
                <Heart className="h-5 w-5" /> Favoris
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition duration-200 ease-in-out"
              >
                <Activity className="h-5 w-5" /> Activités
              </TabsTrigger>
              <TabsTrigger
                value="reservations"
                className="flex items-center gap-2 text-gray-700 hover:text-green-600 transition duration-200 ease-in-out"
                onClick={() => router.push("/profil/mes-reservations")}
              >
                <Briefcase className="h-5 w-5" /> Mes réservations
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card className="shadow-lg bg-white rounded-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-800">
                    À propos de moi
                  </h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {userData?.bio || "Aucune description pour le moment."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <Card className="shadow-lg bg-white rounded-lg">
                <CardHeader>
                  <h3 className="text-xl font-semibold text-gray-800">
                    Mes favoris
                  </h3>
                </CardHeader>
                <CardContent>
                  {favoriteWilayas.length === 0 ? (
                    <p className="text-gray-500">
                      Aucun favori pour le moment.
                    </p>
                  ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {favoriteWilayas.map((wilaya) => (
                        <Card
                          key={wilaya._id}
                          className="flex flex-row items-center gap-4 p-4"
                        >
                          <Image
                            src={
                              wilaya.imageUrl && wilaya.imageUrl !== ""
                                ? wilaya.imageUrl
                                : "/placeholder.svg"
                            }
                            alt={wilaya.name || "Wilaya"}
                            width={80}
                            height={80}
                            className="rounded-md object-cover"
                          />
                          <div>
                            <h4 className="font-medium">{wilaya.name}</h4>
                            <p className="text-sm text-muted-foreground line-clamp-2">
                              {wilaya.description}
                            </p>
                          </div>
                        </Card>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            {/* Section Activités */}
          </Tabs>
        </div>
      </div>
    </div>
  );
}
