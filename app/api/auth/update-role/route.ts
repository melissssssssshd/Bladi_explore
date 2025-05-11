import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function POST(req: NextRequest) {
  try {
    console.log("🔵 ===== DÉBUT DE LA MISE À JOUR DU RÔLE =====");
    const { email, newRole } = await req.json();
    console.log("📧 Email reçu:", email);
    console.log("👤 Nouveau rôle:", newRole);

    if (!email || !newRole) {
      console.log("❌ Données manquantes");
      return NextResponse.json(
        { message: "Email et nouveau rôle requis" },
        { status: 400 }
      );
    }

    console.log("🔌 Connexion à la base de données...");
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const users = db.collection("users");
    console.log("✅ Base de données connectée");

    // Recherche de l'utilisateur
    console.log("🔍 Recherche de l'utilisateur...");
    const user = await users.findOne({ email });
    console.log("📦 Utilisateur trouvé:", {
      id: user?._id,
      email: user?.email,
      role: user?.role,
    });

    if (!user) {
      console.log("❌ Utilisateur non trouvé");
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    // Mise à jour du rôle
    console.log("🔄 Mise à jour du rôle...");
    const result = await users.updateOne(
      { email },
      { $set: { role: newRole, updatedAt: new Date() } }
    );

    if (!result.acknowledged) {
      console.log("❌ Échec de la mise à jour");
      return NextResponse.json(
        { message: "Échec de la mise à jour du rôle" },
        { status: 500 }
      );
    }

    console.log("✅ Rôle mis à jour avec succès");
    console.log("✅ ===== FIN DE LA MISE À JOUR DU RÔLE =====");

    return NextResponse.json({
      message: "Rôle mis à jour avec succès",
      role: newRole,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour du rôle:", error);
    return NextResponse.json(
      { message: "Erreur lors de la mise à jour du rôle" },
      { status: 500 }
    );
  }
}
