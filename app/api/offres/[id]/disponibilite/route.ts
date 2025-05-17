import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const { id } = await Promise.resolve(params);
    const offre = await db
      .collection("offres")
      .findOne({ _id: new ObjectId(id) });
    if (!offre) {
      return NextResponse.json(
        { disponible: false, message: "Offre introuvable" },
        { status: 404 }
      );
    }
    // Supposons qu'il y a un champ 'placesRestantes'
    const disponible = (offre.placesRestantes ?? 0) > 0;
    return NextResponse.json({ disponible });
  } catch (error) {
    return NextResponse.json(
      { disponible: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}
