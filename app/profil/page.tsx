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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { signOut } from "next-auth/react";
import AvatarUpload from "@/components/profile/avatar-upload";

interface UserProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  location?: string;
  bio?: string;
  avatar?: string;
  createdAt: string;
}

export default function ProfilePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("info");
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile");
        if (!response.ok) {
          throw new Error("Erreur lors de la récupération du profil");
        }
        const data = await response.json();
        setUserData(data);
      } catch (error) {
        toast.error("Erreur lors du chargement du profil");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut({ redirect: false });
      router.push("/login");
    } catch (error) {
      toast.error("Erreur lors de la déconnexion");
    }
  };

  const handleAvatarChange = (newAvatarUrl: string) => {
    setUserData((prev) => (prev ? { ...prev, avatar: newAvatarUrl } : null));
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
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar avec informations de profil */}
        <div className="w-full md:w-1/3">
          <Card className="overflow-hidden">
            <div className="relative h-32 bg-gradient-to-r from-[#588157] to-[#3A5A40]">
              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <AvatarUpload
                  currentAvatar={userData.avatar}
                  onAvatarChange={handleAvatarChange}
                />
              </div>
            </div>
            <CardContent className="pt-20 pb-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-bold">
                  {userData.firstName} {userData.lastName}
                </h2>
                {userData.location && (
                  <p className="text-gray-500 flex items-center justify-center mt-1">
                    <MapPin className="h-4 w-4 mr-1" /> {userData.location}
                  </p>
                )}
              </div>

              <div className="space-y-4">
                <Button
                  variant="outline"
                  className="w-full flex items-center justify-center"
                  onClick={() => router.push("/profil/edit")}
                >
                  <Edit className="mr-2 h-4 w-4" />
                  Modifier le profil
                </Button>

                <Separator />

                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Mail className="h-4 w-4 mr-2 text-gray-500" />
                    <span>{userData.email}</span>
                  </div>
                  {userData.phone && (
                    <div className="flex items-center text-sm">
                      <Phone className="h-4 w-4 mr-2 text-gray-500" />
                      <span>{userData.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center text-sm">
                    <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                    <span>
                      Membre depuis{" "}
                      {new Date(userData.createdAt).toLocaleDateString(
                        "fr-FR",
                        {
                          month: "long",
                          year: "numeric",
                        }
                      )}
                    </span>
                  </div>
                </div>

                <Separator />

                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-center text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={handleSignOut}
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Contenu principal */}
        <div className="w-full md:w-2/3">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="w-full"
          >
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="info" className="flex items-center gap-2">
                <Edit className="h-4 w-4" />À propos
              </TabsTrigger>
              <TabsTrigger
                value="favorites"
                className="flex items-center gap-2"
              >
                <Heart className="h-4 w-4" />
                Favoris
              </TabsTrigger>
              <TabsTrigger
                value="activities"
                className="flex items-center gap-2"
              >
                <Activity className="h-4 w-4" />
                Activités
              </TabsTrigger>
            </TabsList>

            <TabsContent value="info" className="mt-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">À propos de moi</h3>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-700">
                    {userData.bio || "Aucune description pour le moment."}
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="favorites" className="mt-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">Mes lieux favoris</h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Vous n'avez pas encore de lieux favoris.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => router.push("/explorer")}
                    >
                      Découvrir des lieux
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="activities" className="mt-6">
              <Card>
                <CardHeader>
                  <h3 className="text-lg font-semibold">
                    Mes activités récentes
                  </h3>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-8">
                    <Activity className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">
                      Vous n'avez pas encore d'activités récentes.
                    </p>
                    <Button
                      variant="outline"
                      className="mt-4"
                      onClick={() => router.push("/explorer")}
                    >
                      Explorer les activités
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
