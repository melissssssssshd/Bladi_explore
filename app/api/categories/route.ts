import clientPromise from "@/lib/mongodb";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db();
    const categories = await db
      .collection("categories")
      .aggregate([
        {
          $lookup: {
            from: "wilayas",
            localField: "wilayas",
            foreignField: "_id",
            as: "wilayas",
          },
        },
        { $sort: { name: 1 } },
      ])
      .toArray();
    return NextResponse.json(categories);
  } catch (error) {
    console.error("Erreur lors de la récupération des catégories:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des catégories" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl } = body;
    if (!name || typeof name !== "string" || name.trim() === "") {
      return NextResponse.json(
        { error: "Nom de catégorie requis et doit être une chaîne non vide" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db();
    // Vérifier si la catégorie existe déjà
    const existing = await db
      .collection("categories")
      .findOne({ name: { $regex: `^${name}$`, $options: "i" } });
    if (existing) {
      return NextResponse.json(
        { error: "Une catégorie avec ce nom existe déjà" },
        { status: 400 }
      );
    }
    const result = await db.collection("categories").insertOne({
      name: name.trim(),
      description: description || "",
      imageUrl: imageUrl || "",
      wilayas: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    return NextResponse.json({
      _id: result.insertedId,
      name,
      description,
      imageUrl,
      wilayas: [],
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de la catégorie" },
      { status: 500 }
    );
  }
}
