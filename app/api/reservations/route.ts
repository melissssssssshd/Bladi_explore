import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";

export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const reservations = await db
      .collection("reservations")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(reservations);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors du chargement des réservations" },
      { status: 500 }
    );
  }
}
