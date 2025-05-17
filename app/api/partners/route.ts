import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

// GET: liste tous les partenaires, possibilité de filtrer par wilayaId ou type
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const { searchParams } = new URL(request.url);
    const wilayaId = searchParams.get("wilayaId");
    const type = searchParams.get("type");
    const filter: any = {};
    if (wilayaId) filter.wilayaId = wilayaId;
    if (type) filter.type = type;
    const partners = await db
      .collection("partners")
      .find(filter)
      .sort({ name: 1 })
      .toArray();
    return NextResponse.json(partners);
  } catch (error) {
    console.error("Erreur lors de la récupération des partenaires:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des partenaires" },
      { status: 500 }
    );
  }
}

// POST: ajoute un partenaire
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      name,
      type,
      status,
      city,
      wilayaId,
      email,
      phone,
      website,
      address,
      description,
      image,
      services,
      priceRange,
      rating,
      reviews,
    } = body;
    if (!name || !type || !wilayaId) {
      return NextResponse.json(
        { error: "Champs requis : nom, type, wilayaId" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const partner = {
      name: name.trim(),
      type: type.trim(),
      status: status || "Actif",
      city: city || "",
      wilayaId,
      email: email || "",
      phone: phone || "",
      website: website || "",
      address: address || "",
      description: description || "",
      image: image || "",
      services: Array.isArray(services) ? services : [],
      priceRange: priceRange || "",
      rating: typeof rating === "number" ? rating : null,
      reviews: typeof reviews === "number" ? reviews : null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("partners").insertOne(partner);
    return NextResponse.json({ id: result.insertedId, ...partner });
  } catch (error) {
    console.error("Erreur lors de la création du partenaire:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création du partenaire" },
      { status: 500 }
    );
  }
}
