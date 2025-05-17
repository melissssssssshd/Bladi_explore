import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import clientPromise from "@/lib/db";

export async function DELETE(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = context.params;
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  const result = await db
    .collection("forum_threads")
    .deleteOne({ _id: new ObjectId(id) });
  if (result.deletedCount === 0) {
    return NextResponse.json({ error: "Sujet non trouvé" }, { status: 404 });
  }
  return NextResponse.json({ success: true });
}
