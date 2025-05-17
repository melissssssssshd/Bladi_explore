import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";
import nodemailer from "nodemailer";

// GET: liste des utilisateurs
export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const users = await db
      .collection("users")
      .find({})
      .sort({ createdAt: -1 })
      .toArray();
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la récupération des utilisateurs" },
      { status: 500 }
    );
  }
}

// POST: ajout d'un utilisateur
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, phone, role, status, password } = body;
    if (!name || !email || !phone || !role || !status || !password) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const user = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim(),
      role,
      status,
      password, // à hasher côté prod !
      createdAt: new Date(),
    };
    const result = await db.collection("users").insertOne(user);

    // Envoi d'email via Mailtrap
    try {
      const transporter = nodemailer.createTransport({
        host: "smtp.mailtrap.io",
        port: 587,
        auth: {
          user: process.env.MAILTRAP_USER,
          pass: process.env.MAILTRAP_PASS,
        },
      });
      await transporter.sendMail({
        from: '"Bladi Tourisme" <no-reply@bladi.com>',
        to: email,
        subject: "Bienvenue sur Bladi Tourisme !",
        text: `Bonjour ${name},\n\nVotre compte a été créé sur Bladi Tourisme.\n\nIdentifiants :\nEmail : ${email}\nMot de passe : ${password}\n\nBonne découverte !`,
        html: `<p>Bonjour <b>${name}</b>,</p><p>Votre compte a été créé sur <b>Bladi Tourisme</b>.</p><p><b>Identifiants :</b><br>Email : ${email}<br>Mot de passe : <b>${password}</b></p><p>Bonne découverte !</p>`,
      });
    } catch (err) {
      // L'email n'est pas bloquant pour la création
      console.error("Erreur envoi mail:", err);
    }

    return NextResponse.json({ id: result.insertedId, ...user });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la création de l'utilisateur" },
      { status: 500 }
    );
  }
}
