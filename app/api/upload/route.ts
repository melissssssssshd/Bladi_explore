import { NextResponse } from "next/server"
import { MongoClient, GridFSBucket } from "mongodb"
import { Readable } from "stream"

const uri = process.env.MONGODB_URI
if (!uri) {
  throw new Error("MONGODB_URI is not defined")
}

const client = new MongoClient(uri)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json(
        { error: "Aucun fichier n'a été fourni" },
        { status: 400 }
      )
    }

    await client.connect()
    const db = client.db()
    const bucket = new GridFSBucket(db)

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    const stream = Readable.from(buffer)

    // Créer un nom de fichier unique
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`
    const filename = `${uniqueSuffix}-${file.name}`

    // Uploader le fichier dans GridFS
    const uploadStream = bucket.openUploadStream(filename, {
      metadata: {
        contentType: file.type,
      },
    })

    await new Promise((resolve, reject) => {
      stream.pipe(uploadStream)
        .on("error", reject)
        .on("finish", resolve)
    })

    // Retourner l'ID du fichier
    const fileId = uploadStream.id.toString()
    return NextResponse.json({ url: `/api/images/${fileId}` })
  } catch (error) {
    console.error("Erreur lors de l'upload:", error)
    return NextResponse.json(
      { error: "Erreur lors de l'upload du fichier" },
      { status: 500 }
    )
  } finally {
    await client.close()
  }
} 