import { NextResponse } from "next/server";
import clientPromise from "@/lib/mongodb";
import { sendEmail } from "@/lib/email";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    // Création automatique de la réservation en base (simulation)
    const {
      offreId,
      offreNom,
      prix,
      userId,
      userName,
      userEmail,
      date,
      participants,
    } = body;
    if (!offreId || !userId || !userName) {
      return NextResponse.json(
        { error: "Paramètres manquants" },
        { status: 400 }
      );
    }
    const client = await clientPromise;
    const db = client.db("bladi-tourisme");
    await db.collection("reservations").insertOne({
      offreId,
      offreNom,
      prix,
      userId,
      userName,
      userEmail,
      date: date || new Date(),
      participants: participants || 1,
      status: "Validée",
      createdAt: new Date(),
    });
    // Envoi d'un email de confirmation via Mailtrap
    await sendEmail({
      to: userEmail,
      subject: `Confirmation de votre réservation - ${offreNom}`,
      html: `<h2>Merci pour votre réservation !</h2>
        <p>Votre réservation pour <b>${offreNom}</b> a bien été prise en compte.</p>
        <ul>
          <li><b>Date :</b> ${date ? new Date(date).toLocaleDateString() : "-"}</li>
          <li><b>Participants :</b> ${participants || 1}</li>
          <li><b>Prix :</b> ${prix} DZD</li>
        </ul>
        <p>Vous recevrez un email de rappel avant l'événement.</p>`,
    });
    // Simulation du paiement : on retourne une URL de succès sans appeler Stripe
    return NextResponse.json({ url: "/paiement/success?simu=1" });
  } catch (error) {
    return NextResponse.json(
      { error: "Erreur lors de la simulation du paiement" },
      { status: 500 }
    );
  }
}
