"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function VerifyPage() {
  const [code, setCode] = useState("");
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();

  useEffect(() => {
    const emailFromUrl = searchParams.get("email");
    if (emailFromUrl) {
      setEmail(emailFromUrl);
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch("/api/auth/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, code }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          variant: "success",
          title: "Vérification réussie !",
          description: "Votre compte a été activé avec succès",
        });
        router.push("/login");
      } else {
        toast({
          variant: "error",
          title: "Erreur de vérification",
          description:
            data.message || "Une erreur est survenue lors de la vérification",
        });
      }
    } catch (error) {
      toast({
        variant: "error",
        title: "Erreur de vérification",
        description: "Une erreur est survenue lors de la vérification",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#DAD7CD]/20 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-6">
          <Link
            href="/login"
            className="text-sm font-medium text-[#588157] hover:text-[#3A5A40]"
          >
            Retour à la connexion
          </Link>
        </div>

        <Card className="border-none shadow-xl bg-white/80 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <div className="flex justify-center mb-2">
              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-[#588157] to-[#3A5A40] flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
            </div>
            <CardTitle className="text-2xl font-bold text-center text-[#344E41]">
              Vérification de l'email
            </CardTitle>
            <CardDescription className="text-center text-gray-600">
              Entrez le code de vérification envoyé à votre email
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code" className="text-[#344E41]">
                  Code de vérification
                </Label>
                <Input
                  id="code"
                  placeholder="123456"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  required
                  className="border-[#588157]/20 focus:border-[#588157] focus:ring-[#588157]/20"
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-[#588157] to-[#3A5A40] hover:from-[#3A5A40] hover:to-[#344E41]"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                    Vérification en cours...
                  </div>
                ) : (
                  "Vérifier"
                )}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-600">
              Vous n'avez pas reçu le code ?{" "}
              <button
                onClick={() => {
                  toast({
                    variant: "info",
                    title: "Renvoyer le code",
                    description: "Un nouveau code a été envoyé à votre email",
                  });
                }}
                className="text-[#588157] hover:text-[#3A5A40] font-medium"
              >
                Renvoyer
              </button>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
