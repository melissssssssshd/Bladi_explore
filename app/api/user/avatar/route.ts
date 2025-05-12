/*import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier fourni" },
        { status: 400 }
      );
    }

    // Vérifier le type de fichier
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { message: "Le fichier doit être une image" },
        { status: 400 }
      );
    }

    // Vérifier la taille du fichier (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      return NextResponse.json(
        { message: "L'image ne doit pas dépasser 5MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Générer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const path = join(process.cwd(), "public/uploads/avatars", filename);

    // Sauvegarder le fichier
    await writeFile(path, buffer);

    // Mettre à jour l'URL de l'avatar dans la base de données
    const { db } = await connectToDatabase();
    const avatarUrl = `/uploads/avatars/${filename}`;

    await db
      .collection("users")
      .updateOne(
        { email: session.user.email },
        { $set: { avatar: avatarUrl } }
      );

    return NextResponse.json({ avatarUrl });
  } catch (error) {
    console.error("Erreur lors de la mise à jour de l'avatar:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}*/
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import { join } from "path";
import { ObjectId } from "mongodb";

// Constants
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_MIME_TYPES = ["image/jpeg", "image/png", "image/webp"];
const AVATARS_UPLOAD_DIR = join(process.cwd(), "public/uploads/avatars");

export async function POST(req: NextRequest) {
  try {
    // Authentication
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json(
        { message: "Non autorisé" }, 
        { status: 401 }
      );
    }

    console.log("🔑 Utilisateur authentifié:", session.user.email);

    // File validation
    const formData = await req.formData();
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { message: "Aucun fichier reçu" },
        { status: 400 }
      );
    }

    // Check file type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        { message: "Type de fichier non autorisé" },
        { status: 400 }
      );
    }

    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { message: "Fichier trop volumineux (max 5MB)" },
        { status: 400 }
      );
    }

    // Generate unique filename
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const filename = `${uniqueSuffix}-${file.name}`;
    const filePath = join(AVATARS_UPLOAD_DIR, filename);

    // Save file to disk
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(filePath, buffer);
    console.log("✅ Fichier enregistré:", filePath);

    // Update database
    const { client } = await connectToDatabase();
    const db = client.db("bladi-tourisme");
    const avatarUrl = `/uploads/avatars/${filename}`;

    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: { avatar: avatarUrl } }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Avatar mis à jour", avatarUrl },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur:", error);
    return NextResponse.json(
      { message: "Erreur interne du serveur" },
      { status: 500 }
    );
  }
}