/*import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import bcrypt from "bcryptjs";

// GET /api/user/profile
export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } } // Exclure le mot de passe
    );

    if (!user) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(user);
  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(req: Request) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { firstName, lastName, phone, location, bio } = await req.json();
    const { db } = await connectToDatabase();

    const updateData: any = {};
    if (firstName) updateData.firstName = firstName;
    if (lastName) updateData.lastName = lastName;
    if (phone) updateData.phone = phone;
    if (location) updateData.location = location;
    if (bio) updateData.bio = bio;

    const result = await db
      .collection("users")
      .updateOne({ email: session.user.email }, { $set: updateData });

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profil mis à jour avec succès" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}*/
import { NextRequest, NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { ObjectId } from "mongodb";

// Fonction de validation des données
function validateProfileData(data: any) {
  const errors: string[] = [];

  if ("firstName" in data) {
    if (typeof data.firstName !== "string" || data.firstName.trim().length === 0) {
      errors.push("Prénom invalide");
    }
  }
  
  if ("lastName" in data) {
    if (typeof data.lastName !== "string" || data.lastName.trim().length === 0) {
      errors.push("Nom invalide");
    }
  }

  if ("phone" in data) {
    if (typeof data.phone !== "string" || data.phone.trim().length < 6) {
      errors.push("Téléphone invalide");
    }
  }

  if ("location" in data && typeof data.location !== "string") {
    errors.push("Localisation invalide");
  }

  if ("bio" in data && typeof data.bio !== "string") {
    errors.push("Biographie invalide");
  }

  return errors;
}

// GET /api/user/profile
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const { client } = await connectToDatabase();
    const db = client.db("bladi-tourisme");

    const user = await db.collection("users").findOne(
      { email: session.user.email },
      { projection: { password: 0 } }
    );

    if (!user) {
      return NextResponse.json({ message: "Utilisateur non trouvé" }, { status: 404 });
    }

    const { _id, ...responseUser } = {
      ...user,
      userId: user._id.toString(),
    };

    return NextResponse.json(responseUser);

  } catch (error) {
    console.error("Erreur lors de la récupération du profil:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}

// PUT /api/user/profile
export async function PUT(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      return NextResponse.json({ message: "Non autorisé" }, { status: 401 });
    }

    const data = await req.json();
    const errors = validateProfileData(data);

    if (errors.length > 0) {
      return NextResponse.json(
        { message: "Données invalides", errors },
        { status: 400 }
      );
    }

    const updateData: Record<string, any> = {
      updatedAt: new Date().toISOString()
    };

    // Sanitization des données
    const fields = ['firstName', 'lastName', 'phone', 'location', 'bio'];
    fields.forEach(field => {
      if (data[field]) updateData[field] = data[field].trim();
    });

    const { client } = await connectToDatabase();
    const db = client.db("bladi-tourisme");

    const result = await db.collection("users").updateOne(
      { email: session.user.email },
      { $set: updateData }
    );

    if (result.matchedCount === 0) {
      return NextResponse.json(
        { message: "Utilisateur non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Profil mis à jour avec succès" },
      { status: 200 }
    );

  } catch (error) {
    console.error("Erreur lors de la mise à jour du profil:", error);
    return NextResponse.json(
      { message: "Une erreur est survenue" },
      { status: 500 }
    );
  }
}