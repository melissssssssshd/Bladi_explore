import { NextResponse } from "next/server";
import { MongoClient, GridFSBucket, ObjectId } from "mongodb";
import { promises as fs } from "fs";
import path from "path";

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error("MONGODB_URI is not defined");
}

// Utiliser un client MongoDB partagé (singleton)
const client = new MongoClient(uri);

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    await client.connect();
    const db = client.db("bladi-tourisme");
    const bucket = new GridFSBucket(db);

    // Attendre params avant d'utiliser id
    const { id } = await Promise.resolve(params);
    let fileId: ObjectId;
    try {
      fileId = new ObjectId(id);
    } catch (e) {
      // Si l'ID n'est pas valide, retourner le placeholder
      return await servePlaceholder();
    }

    const files = await bucket.find({ _id: fileId }).toArray();

    if (files.length === 0) {
      return await servePlaceholder();
    }

    const file = files[0];
    const downloadStream = bucket.openDownloadStream(fileId);

    // Convertir le stream en buffer
    const chunks: Buffer[] = [];
    for await (const chunk of downloadStream) {
      chunks.push(chunk);
    }
    const buffer = Buffer.concat(chunks);

    // Retourner l'image avec le bon type MIME
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": file.metadata?.contentType || "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
    });
  } catch (error) {
    console.error("Erreur lors de la récupération de l'image:", error);
    return await servePlaceholder();
  }
  // Ne pas fermer la connexion ici !
}

// Sert le placeholder.jpg du dossier public
async function servePlaceholder() {
  try {
    const filePath = path.join(process.cwd(), "public", "placeholder.jpg");
    const buffer = await fs.readFile(filePath);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/jpeg",
        "Cache-Control": "public, max-age=31536000",
      },
      status: 404,
    });
  } catch (e) {
    return new NextResponse("Image not found", { status: 404 });
  }
}
