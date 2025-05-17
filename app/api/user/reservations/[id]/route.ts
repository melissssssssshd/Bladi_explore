import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const { id } = params;
    // On ne supprime pas, on marque comme annulée pour garder l'historique
    const result = await db
      .collection("reservations")
      .updateOne(
        { _id: new ObjectId(id) },
        { $set: { status: "Annulée", cancelledAt: new Date() } }
      );
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Réservation non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'annulation" },
      { status: 500 }
    );
  }
}
