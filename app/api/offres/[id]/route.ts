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
      return NextResponse.json({ error: "Offre introuvable" }, { status: 404 });
    }
    return NextResponse.json({
      id: offre._id,
      nom: offre.nom,
      description: offre.description,
      prix: offre.prix,
      image: offre.image,
      placesRestantes: offre.placesRestantes,
    });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const { id } = await Promise.resolve(params);
    const result = await db
      .collection("offres")
      .deleteOne({ _id: new ObjectId(id) });
    if (result.deletedCount === 1) {
      return NextResponse.json({ success: true });
    } else {
      return NextResponse.json({ error: "Offre non trouvée" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la suppression" },
      { status: 500 }
    );
  }
}
