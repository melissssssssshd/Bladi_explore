import { NextRequest, NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import nodemailer from "nodemailer";

interface VerifyRequestBody {
  email?: string;
  code?: string;
}

// Configuration du transporteur d'email avec Mailtrap
const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: "ea8d4a05cc46cf",
    pass: "9ef3e96772733f",
  },
});

export async function POST(req: NextRequest) {
  try {
    const { email, code } = (await req.json()) as VerifyRequestBody;

    // Validation des données
    if (!email || !code) {
      return NextResponse.json(
        { error: "Email et code de vérification requis" },
        { status: 400 }
      );
    }

    if (!email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      return NextResponse.json(
        { error: "Format d'email invalide" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    const users = db.collection("users");

    // Recherche de l'utilisateur
    const user = await users.findOne({
      email,
      verificationCode: code,
      emailVerified: false,
    });

    if (!user) {
      return NextResponse.json(
        { error: "Code de vérification invalide ou email déjà vérifié" },
        { status: 400 }
      );
    }

    // Mise à jour de l'utilisateur
    const result = await users.updateOne(
      { email },
      {
        $set: {
          emailVerified: true,
          verifiedAt: new Date(),
          updatedAt: new Date(),
        },
        $unset: { verificationCode: "" },
      }
    );

    if (!result.acknowledged) {
      throw new Error("Échec de la mise à jour de l'utilisateur");
    }

    // Envoi de l'email de confirmation
    const mailOptions = {
      from: process.env.EMAIL_FROM || "Bladi Tourisme <bladiexplore@gmail.com>",
      to: email,
      subject: "Bladi Tourisme - Email Vérifié",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eee; border-radius: 5px;">
          <h2 style="color: #2563eb; text-align: center;">Email Vérifié avec Succès</h2>
          <p>Bonjour ${user.firstName || ""},</p>
          <p>Votre adresse email a été vérifiée avec succès. Vous pouvez maintenant vous connecter à votre compte Bladi Tourisme.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.NEXTAUTH_URL || "http://localhost:3000"}/login" style="background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
              Se connecter
            </a>
          </div>
          <p>Merci de faire confiance à Bladi Tourisme !</p>
          <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
          <p style="color: #666; font-size: 12px; text-align: center;">
            Cet email a été envoyé automatiquement, merci de ne pas y répondre.
          </p>
        </div>
      `,
    };

    try {
      await transporter.sendMail(mailOptions);
      console.log(`✅ Email de confirmation envoyé à ${email}`);
    } catch (mailError) {
      console.error("❌ Erreur lors de l'envoi de l'email:", mailError);
      // On continue même si l'email échoue
    }

    return NextResponse.json(
      {
        message: "Email vérifié avec succès",
        userId: user._id,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Erreur de vérification:", error);
    return NextResponse.json(
      { error: "Erreur lors de la vérification. Veuillez réessayer." },
      { status: 500 }
    );
  }
}
