import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const offres = await db
      .collection("offres")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    // Adapter le format pour le front
    const result = offres.map((offre) => ({
      id: offre._id,
      nom: offre.nom,
      description: offre.description,
      prix: offre.prix,
      image: offre.image,
      placesRestantes: offre.placesRestantes,
    }));
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, description, prix, image, partenaireId } = body;
    if (!nom || !description || !prix || !partenaireId) {
      return NextResponse.json(
        { error: "Champs obligatoires manquants" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const offre = {
      nom,
      description,
      prix,
      image: image && image.trim() !== "" ? image : "/placeholder.jpg",
      partenaireId,
      createdAt: new Date(),
      placesRestantes: 10,
    };
    const result = await db.collection("offres").insertOne(offre);
    return NextResponse.json({ id: result.insertedId, ...offre });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de l'ajout de l'offre" },
      { status: 500 }
    );
  }
}
