import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    console.log("🔵 ===== DÉBUT DE LA DÉCONNEXION =====");

    // La déconnexion côté serveur consiste simplement à renvoyer une réponse réussie
    // Le client s'occupera de supprimer le token du localStorage

    console.log("✅ ===== FIN DE LA DÉCONNEXION =====");

    return NextResponse.json(
      { message: "Déconnexion réussie" },
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur lors de la déconnexion:", error);
    return NextResponse.json(
      { message: "Erreur lors de la déconnexion" },
      { status: 500 }
    );
  }
}
