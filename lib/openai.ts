import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) {
  throw new Error(
    'La clé API OpenAI n\'est pas configurée. Veuillez créer un fichier .env.local à la racine du projet et ajouter :\nOPENAI_API_KEY=votre_clé_api_ici'
  );
}

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
  dangerouslyAllowBrowser: true,
});

export async function getAIResponse(
  userMessage: string,
  context: { places: any[]; itineraries: any[] }
): Promise<string> {
  try {
    console.log('Envoi de la requête à l\'API...');
    const response = await fetch('/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        message: userMessage,
        context,
      }),
    });

    console.log('Statut de la réponse:', response.status);
    
    if (!response.ok) {
      let errorMessage = 'Erreur lors de l\'appel à l\'API';
      try {
        const errorData = await response.json();
        console.error('Erreur API (JSON):', errorData);
        errorMessage = errorData.error || errorMessage;
      } catch (jsonError) {
        // Si la réponse n'est pas un JSON valide, on essaie de lire le texte brut
        const errorText = await response.text();
        console.error('Erreur API (texte):', errorText);
        errorMessage = errorText || errorMessage;
      }
      throw new Error(errorMessage);
    }

    let data;
    try {
      data = await response.json();
      console.log('Réponse reçue:', data);
    } catch (jsonError) {
      console.error('Erreur lors du parsing de la réponse:', jsonError);
      throw new Error('Réponse invalide du serveur');
    }

    if (!data || !data.response) {
      throw new Error('Format de réponse invalide');
    }

    return data.response;
  } catch (error) {
    console.error('Erreur détaillée:', error);
    if (error instanceof Error) {
      return `Erreur: ${error.message}`;
    }
    return "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.";
  }
} 