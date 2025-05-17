import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET() {
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  const threads = await db
    .collection("forum_threads")
    .find({})
    .sort({ createdAt: -1 })
    .toArray();
  return NextResponse.json(threads);
}

export async function POST(req: NextRequest) {
  const { title, content, author } = await req.json();
  if (!title || !content || !author) {
    return NextResponse.json({ error: "Champs manquants" }, { status: 400 });
  }
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  const thread = {
    title,
    content,
    author,
    createdAt: new Date(),
    replies: [],
  };
  const result = await db.collection("forum_threads").insertOne(thread);
  return NextResponse.json({ ...thread, _id: result.insertedId });
}
