import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function GET() {
  try {
    const client = await clientPromise
    const db = client.db()
    const wilayas = await db.collection("wilayas").find({}).sort({ name: 1 }).toArray()
    return NextResponse.json(wilayas)
  } catch (error) {
    console.error("Erreur lors de la récupération des wilayas:", error)
    return NextResponse.json(
      { error: "Erreur lors de la récupération des wilayas" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, description, imageUrl, overview, attractions } = body

    if (!name || !description || !imageUrl) {
      return NextResponse.json(
        { error: "Nom, description et image sont requis" },
        { status: 400 }
      )
    }

    // overview et attractions sont optionnels mais doivent être bien formés si présents
    let wilaya: any = {
      name: name.trim(),
      description: description.trim(),
      imageUrl,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
    if (overview) wilaya.overview = overview
    if (attractions) wilaya.attractions = attractions

    const client = await clientPromise
    const db = client.db()
    const result = await db.collection("wilayas").insertOne(wilaya)
    return NextResponse.json({
      id: result.insertedId,
      ...wilaya
    })
  } catch (error) {
    console.error("Erreur lors de la création de la wilaya:", error)
    return NextResponse.json(
      { error: "Erreur lors de la création de la wilaya" },
      { status: 500 }
    )
  }
} 