import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/db";

export async function GET(req: NextRequest) {
  const client = await clientPromise;
  const db = client.db("bladi-tourisme");
  // On suppose que les publications sont dans la collection "attractions"
  // On gère la pagination et le tri si besoin
  const url = new URL(req.url!);
  const limit = parseInt(url.searchParams.get("limit") || "0");
  const sort = url.searchParams.get("sort") || "-createdAt";
  const sortObj: any = {};
  if (sort.startsWith("-")) {
    sortObj[sort.slice(1)] = -1;
  } else {
    sortObj[sort] = 1;
  }
  let cursor = db.collection("attractions").find({}).sort(sortObj);
  if (limit > 0) cursor = cursor.limit(limit);
  const data = await cursor.toArray();
  return NextResponse.json(data);
}
