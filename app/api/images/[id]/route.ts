import { NextResponse } from "next/server"
import { MongoClient, GridFSBucket, ObjectId } from "mongodb"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined")
}

const client = new MongoClient(uri)

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect()
    const db = client.db()
    const bucket = new GridFSBucket(db)

    // Attendre que params soit résolu
    const id = await Promise.resolve(params.id)
    const fileId = new ObjectId(id)
    
    const files = await bucket.find({ _id: fileId }).toArray()
    
    if (files.length === 0) {
      return new NextResponse("Image not found", { status: 404 })
    }

    const file = files[0]
    const downloadStream = bucket.openDownloadStream(fileId)

    // Convertir le stream en buffer
    const chunks: Buffer[] = []
    for await (const chunk of downloadStream) {
      chunks.push(chunk)
    }
    const buffer = Buffer.concat(chunks)

    // Retourner l'image avec le bon type MIME
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error)
    return new NextResponse("Error retrieving image", { status: 500 })
  } finally {
    await client.close()
  }
} 