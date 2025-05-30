import { NextResponse } from "next/server"
import clientPromise from "@/lib/mongodb"
import { ObjectId } from "mongodb"

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const client = await clientPromise
    const db = client.db()
    const result = await db.collection("attractions").deleteOne({ _id: new ObjectId(params.id) })
    if (result.deletedCount === 0) {
      return NextResponse.json({ error: "Attraction non trouvée" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la suppression" }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const client = await clientPromise
    const db = client.db()
    const { id } = params
    const update = { ...body, updatedAt: new Date() }
    delete update._id
    const result = await db.collection("attractions").updateOne(
      { _id: new ObjectId(id) },
      { $set: update }
    )
    if (result.matchedCount === 0) {
      return NextResponse.json({ error: "Attraction non trouvée" }, { status: 404 })
    }
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: "Erreur lors de la mise à jour" }, { status: 500 })
  }
} 