import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(
  request: Request,
  context: { params: { id: string } }
) {
  try {
    const client = await clientPromise;
    // Correction : attendre params avant d'utiliser id
    const { id } = await Promise.resolve(context.params);
    const wilaya = await client
      .db("bladi-tourisme")
      .collection("wilayas")
      .findOne({
        _id: new ObjectId(id),
      });
    if (!wilaya) {
      return NextResponse.json(
        { error: "Wilaya non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json(wilaya);
  } catch (error) {
    console.error("Erreur lors de la récupération de la wilaya:", error);
    return NextResponse.json(
      { error: "Erreur lors de la récupération de la wilaya" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const client = await clientPromise;

    const result = await client
      .db()
      .collection("wilayas")
      .deleteOne({
        _id: new ObjectId(params.id),
      });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Wilaya non trouvée" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Erreur lors de la suppression de la wilaya:", error);
    return NextResponse.json(
      { error: "Erreur lors de la suppression de la wilaya" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const client = await clientPromise;
    const { id } = params; // Utilisation directe de params (pas context)
    if (!id) {
      return NextResponse.json(
        { error: "Paramètre id manquant" },
        { status: 400 }
      );
    }
    const update = { ...body, updatedAt: new Date() };
    delete update._id;
    const result = await client
      .db("bladi-tourisme")
      .collection("wilayas")
      .updateOne({ _id: new ObjectId(id) }, { $set: update });
    if (result.matchedCount === 0) {
      return NextResponse.json(
        { error: "Wilaya non trouvée" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la mise à jour" },
      { status: 500 }
    );
  }
}
