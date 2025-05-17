import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { validateToken } from "@/lib/auth";
import { ObjectId } from "mongodb";

// GET: Récupérer les favoris de l'utilisateur connecté ou d'un userId passé en query
export async function GET(req: NextRequest) {
  const decoded = await validateToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  // Permettre de récupérer les favoris d'un autre utilisateur si userId passé en query (optionnel)
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get("userId") || decoded.userId;
  const { client } = await connectToDatabase();
  const db = client.db("bladi-tourisme");
  // Optionnel : filtrer par type
  const type = searchParams.get("type");
  const query: any = { userId };
  if (type) query.type = type;
  const favorites = await db.collection("favorites").find(query).toArray();
  return NextResponse.json(favorites, { status: 200 });
}

// POST: Ajouter un favori
export async function POST(req: NextRequest) {
  const decoded = await validateToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const userId = decoded.userId;
  const { itemId, type } = await req.json();
  const { client } = await connectToDatabase();
  const db = client.db("bladi-tourisme");
  // Empêcher les doublons
  const exists = await db.collection("favorites").findOne({ userId, itemId });
  if (exists) {
    return NextResponse.json({ message: "Déjà en favori" }, { status: 409 });
  }
  const result = await db.collection("favorites").insertOne({
    userId,
    itemId,
    type,
    addedAt: new Date(),
  });
  return NextResponse.json({ insertedId: result.insertedId }, { status: 201 });
}

// DELETE: Supprimer un favori
export async function DELETE(req: NextRequest) {
  const decoded = await validateToken(req);
  if (!decoded) {
    return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
  }
  const userId = decoded.userId;
  const { itemId } = await req.json();
  const { client } = await connectToDatabase();
  const db = client.db("bladi-tourisme");
  await db.collection("favorites").deleteOne({ userId, itemId });
  return NextResponse.json({ message: "Favori supprimé" }, { status: 200 });
}
