'use client';

import { useState, useRef, useEffect } from 'react';
import { Send } from 'lucide-react';
import Image from 'next/image';
import { searchPlaces, getPlaceInfo, findItineraryByCategory, getQuickQuestions, places, itineraries } from '@/lib/touristData';
import { getAIResponse } from '@/lib/openai';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  imageUrl?: string;
}

export default function ChatBox() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [quickQuestions, setQuickQuestions] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setQuickQuestions(getQuickQuestions());
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const processUserMessage = async (message: string): Promise<{ text: string; imageUrl?: string }> => {
    console.log('Traitement du message:', message);
    const lowerMessage = message.toLowerCase();

    // Recherche d'informations sur un lieu spécifique
    if (lowerMessage.includes('où est') || lowerMessage.includes('comment aller à')) {
      const placeName = message.split('à')[1]?.trim() || message.split('est')[1]?.trim();
      console.log('Recherche du lieu:', placeName);
      const place = getPlaceInfo(placeName);
      if (place) {
        return {
          text: `${place.name} : ${place.description}\nHoraires : ${place.openingHours}\nTransport : ${place.transport}\nPrix : ${place.price}\nNote : ${place.rating}/5\n${place.historicalInfo ? `\nInfo historique : ${place.historicalInfo}` : ''}`,
          imageUrl: place.imageUrl
        };
      }
    }

    // Recherche d'itinéraires par catégorie
    if (lowerMessage.includes('itinéraire')) {
      if (lowerMessage.includes('nature')) {
        const natureItineraries = findItineraryByCategory('nature');
        return {
          text: `Voici un itinéraire nature :\n${natureItineraries.map(it => 
            `- ${it.name} : ${it.description}\n  Durée : ${it.duration}\n  Difficulté : ${it.difficulty}\n  Prix : ${it.price}`
          ).join('\n')}`
        };
      }
      if (lowerMessage.includes('culture')) {
        const cultureItineraries = findItineraryByCategory('culture');
        return {
          text: `Voici un itinéraire culturel :\n${cultureItineraries.map(it => 
            `- ${it.name} : ${it.description}\n  Durée : ${it.duration}\n  Difficulté : ${it.difficulty}\n  Prix : ${it.price}`
          ).join('\n')}`
        };
      }
      if (lowerMessage.includes('gastronomie')) {
        const gastronomyItineraries = findItineraryByCategory('gastronomie');
        return {
          text: `Voici un itinéraire gastronomique :\n${gastronomyItineraries.map(it => 
            `- ${it.name} : ${it.description}\n  Durée : ${it.duration}\n  Difficulté : ${it.difficulty}\n  Prix : ${it.price}`
          ).join('\n')}`
        };
      }
    }

    // Recherche générale
    const searchResults = searchPlaces(message);
    if (searchResults.length > 0) {
      return {
        text: `Voici ce que j'ai trouvé :\n${searchResults.map(place => 
          `- ${place.name} : ${place.description}\n  Prix : ${place.price}\n  Note : ${place.rating}/5`
        ).join('\n')}`,
        imageUrl: searchResults[0].imageUrl
      };
    }

    // Si aucune correspondance directe n'est trouvée, utiliser l'IA
    try {
      console.log('Appel à l\'IA pour le message:', message);
      const aiResponse = await getAIResponse(message, { places, itineraries });
      console.log('Réponse de l\'IA:', aiResponse);
      return { text: aiResponse };
    } catch (error) {
      console.error('Erreur lors de l\'appel à l\'IA:', error);
      return {
        text: "Je peux vous aider à trouver des lieux à visiter, des itinéraires personnalisés, ou vous donner des informations sur les horaires et les transports. Que souhaitez-vous savoir ?"
      };
    }
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    console.log('Envoi du message:', input);
    
    // Ajouter le message de l'utilisateur
    const userMessage: Message = {
      id: Date.now(),
      text: input,
      sender: 'user',
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Traiter le message et générer une réponse
      const botResponse = await processUserMessage(input);
      console.log('Réponse du bot:', botResponse);
      
      // Ajouter la réponse du bot
      const botMessage: Message = {
        id: Date.now() + 1,
        text: botResponse.text,
        sender: 'bot',
        timestamp: new Date(),
        imageUrl: botResponse.imageUrl
      };
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error('Erreur lors du traitement du message:', error);
      const errorMessage: Message = {
        id: Date.now() + 1,
        text: "Désolé, je rencontre des difficultés techniques. Veuillez réessayer plus tard.",
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleQuickQuestion = (question: string) => {
    setInput(question);
    handleSend();
  };

  return (
    <div className="flex flex-col h-[600px] w-full max-w-2xl mx-auto bg-white rounded-lg shadow-lg">
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            <div
              className={`max-w-[70%] rounded-lg p-3 ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              <p className="text-sm whitespace-pre-line">{message.text}</p>
              {message.imageUrl && (
                <div className="mt-2 relative w-full h-48">
                  <Image
                    src={message.imageUrl}
                    alt="Lieu"
                    fill
                    className="rounded-lg object-cover"
                  />
                </div>
              )}
              <span className="text-xs opacity-70">
                {message.timestamp.toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 text-gray-800 rounded-lg p-3">
              <div className="flex space-x-2">
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-100" />
                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce delay-200" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="border-t p-4">
        <div className="flex flex-wrap gap-2 mb-4">
          {quickQuestions.map((question, index) => (
            <button
              key={index}
              onClick={() => handleQuickQuestion(question)}
              className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 px-3 py-1 rounded-full transition-colors"
            >
              {question}
            </button>
          ))}
        </div>
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Posez votre question sur les lieux à visiter..."
            className="flex-1 p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            className={`bg-blue-500 text-white p-2 rounded-lg transition-colors ${
              isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-600'
            }`}
            disabled={isLoading}
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
} 