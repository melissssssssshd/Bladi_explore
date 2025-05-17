import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

// GET: liste toutes les attractions, possibilité de filtrer par wilayaId
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get("wilayaId");
    const filter = wilayaId ? { wilayaId } : {};
    const attractions = await db
      .collection("attractions")
      .find(filter)
      .sort({ name: 1 })
      .toArray();
    // Ajout d'un placeholder si image manquante ou vide
    const placeholder = "/placeholder.jpg";
    const attractionsWithImage = attractions.map((a) => ({
      ...a,
      image:
        a.image && typeof a.image === "string" && a.image.trim() !== ""
          ? a.image
          : placeholder,
      images:
        Array.isArray(a.images) && a.images.length > 0
          ? a.images
          : [a.image && a.image.trim() !== "" ? a.image : placeholder],
    }));
    return NextResponse.json(attractionsWithImage);
  } catch (error) {
    console.error("Erreur lors de la récupération des attractions:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des attractions" },
      { status: 500 }
    );
  }
}

// POST: ajoute une attraction
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, image, images, wilayaId } = body;
    const placeholder = "/placeholder.jpg";
    if (
      !name ||
      !description ||
      (!image && (!images || images.length === 0)) ||
      !wilayaId
    ) {
      return NextResponse.json(
        {
          error:
            "Tous les champs sont requis (nom, description, au moins une image, wilayaId)",
        },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const mainImage =
      image && image.trim() !== ""
        ? image
        : images && images[0] && images[0].trim() !== ""
          ? images[0]
          : placeholder;
    const imagesArray =
      images && images.length > 0
        ? (images as string[]).filter((img: string) => img && img.trim() !== "")
        : mainImage
          ? [mainImage]
          : [placeholder];
    const attraction = {
      name: name.trim(),
      description: description.trim(),
      image: mainImage,
      images: imagesArray,
      wilayaId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("attractions").insertOne(attraction);
    return NextResponse.json({ id: result.insertedId, ...attraction });
  } catch (error) {
    console.error("Erreur lors de la création de l'attraction:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de l'attraction" },
      { status: 500 }
    );
  }
}
