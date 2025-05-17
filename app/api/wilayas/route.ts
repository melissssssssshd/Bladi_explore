import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const search = url.searchParams.get("search")?.trim();
    const region = url.searchParams.get("region")?.trim();
    const limit = parseInt(url.searchParams.get("limit") || "20");
    const skip = parseInt(url.searchParams.get("skip") || "0");
    const sortParam = url.searchParams.get("sort") || "name";

    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const query: any = {};
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }
    if (region) {
      query["overview.region"] = region;
    }
    // Tri dynamique
    let sort: any = {};
    if (sortParam.startsWith("-")) {
      sort[sortParam.slice(1)] = -1;
    } else {
      sort[sortParam] = 1;
    }
    // Projection pour alléger la réponse (exemple)
    const projection = {
      name: 1,
      description: 1,
      imageUrl: 1,
      overview: 1,
      createdAt: 1,
    };
    const wilayas = await db
      .collection("wilayas")
      .find(query)
      .project(projection)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray();
    return NextResponse.json(wilayas);
  } catch (error) {
    console.error("Erreur lors de la récupération des wilayas:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération des wilayas" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, description, imageUrl, overview, attractions } = body;

    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Nom, description et image sont requis" },
        { status: 400 }
      );
    }

    // overview et attractions sont optionnels mais doivent être bien formés si présents
    let wilaya: any = {
      name: name.trim(),
      description: description.trim(),
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    if (overview) wilaya.overview = overview;
    if (attractions) wilaya.attractions = attractions;

    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const result = await db.collection("wilayas").insertOne(wilaya);
    return NextResponse.json({
      id: result.insertedId,
      ...wilaya,
    });
  } catch (error) {
    console.error("Erreur lors de la création de la wilaya:", error);
    return NextResponse.json(
      { error: "Erreur lors de la création de la wilaya" },
      { status: 500 }
    );
  }
}
