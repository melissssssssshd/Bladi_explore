import { NextResponse } from 'next/server';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not configured');
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  try {
    console.log('Requête reçue dans la route API');
    
    let body;
    try {
      body = await request.json();
    } catch (error) {
      console.error('Erreur lors du parsing de la requête:', error);
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      );
    }

    const { message, context } = body;

    if (!message) {
      console.error('Message manquant dans la requête');
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    if (!context || !context.places || !context.itineraries) {
      console.error('Contexte invalide dans la requête');
      return NextResponse.json(
        { error: 'Contexte invalide' },
        { status: 400 }
      );
    }

    console.log('Message reçu:', message);
    console.log('Contexte:', context);

    const systemPrompt = `Tu es un assistant touristique intelligent pour la ville de Bladi. 
    Tu as accès aux informations suivantes sur les lieux et itinéraires disponibles :

    Lieux disponibles :
    ${context.places.map((place: any) => `
    - ${place.name} (${place.category})
      Description: ${place.description}
      Adresse: ${place.address}
      Horaires: ${place.hours}
      Contact: ${place.contact}
    `).join('\n')}

    Itinéraires disponibles :
    ${context.itineraries.map((itinerary: any) => `
    - ${itinerary.name} (${itinerary.category})
      Description: ${itinerary.description}
      Durée: ${itinerary.duration}
      Lieux: ${itinerary.places.join(', ')}
    `).join('\n')}

    Utilise ces informations pour répondre aux questions des utilisateurs de manière précise et personnalisée.
    Si tu ne trouves pas d'information pertinente dans le contexte, indique-le poliment.`;

    console.log('Envoi de la requête à OpenAI...');
    const completion = await openai.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: message }
      ],
      model: "gpt-3.5-turbo",
      temperature: 0.7,
      max_tokens: 500,
    });

    console.log('Réponse OpenAI reçue');
    const response = completion.choices[0]?.message?.content || "Désolé, je n'ai pas pu générer une réponse.";

    return NextResponse.json({ response });
  } catch (error) {
    console.error('Erreur dans la route API:', error);
    const errorMessage = error instanceof Error ? error.message : 'Une erreur est survenue';
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
} 