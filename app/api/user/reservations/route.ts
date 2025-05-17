import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// Pour la démo, on récupère l'email depuis le query param (à remplacer par l'auth réelle)
export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const userId = url.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ error: "userId requis" }, { status: 400 });
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const reservations = await db
      .collection("reservations")
      .find({ userId })
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des réservations utilisateur" },
      { status: 500 }
    );
  }
}
