import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";

export async function GET(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  const thread = await db
    .collection("forum_threads")
    .findOne({ _id: new ObjectId(id) });
  if (!thread)
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(thread);
}

export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const { content, author } = await req.json();
  if (!content || !author) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  const reply = {
    _id: new ObjectId(),
    content,
    author,
    createdAt: new Date(),
  };
  const result = await db
    .collection("forum_threads")
    .updateOne({ _id: new ObjectId(id) }, { $push: { replies: reply as any } });
  if (result.modifiedCount === 0) {
    return NextResponse.json({ error: "Sujet non trouvé" }, { status: 404 });
  }
  return NextResponse.json(reply);
}
