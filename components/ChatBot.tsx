import { useState } from 'react';
import { bejaiaChatData } from '@/utils/chatbotData';
import { MessageCircle, Send, X } from 'lucide-react';

interface Message {
  text: string;
  isBot: boolean;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: "Bonjour! Je suis votre guide virtuel pour Bejaia. Je peux vous renseigner sur la localisation de Bejaia, ses attractions touristiques, ses plages, et son climat. Comment puis-je vous aider?", isBot: true }
  ]);
  const [input, setInput] = useState("");

  const findAnswer = (question: string): string => {
    const normalizedQuestion = question.toLowerCase().trim();
    
    // Vérifier d'abord les salutations
    if (bejaiaChatData[0].question.some(q => normalizedQuestion.includes(q))) {
      return bejaiaChatData[0].answer;
    }
    
    // Vérifier les autres questions
    for (const data of bejaiaChatData) {
      for (const q of data.question) {
        // Vérifier si la question contient des mots clés de la question de référence
        const keywords = q.split(' ');
        const matchCount = keywords.filter(keyword => 
          normalizedQuestion.includes(keyword.toLowerCase())
        ).length;
        
        // Si plus de 50% des mots clés correspondent, on considère que c'est une correspondance
        if (matchCount >= keywords.length * 0.5) {
          return data.answer;
        }
      }
    }
    
    return "Je ne suis pas sûr de comprendre votre question. Vous pouvez me demander des informations sur :\n- La localisation de Bejaia\n- Les attractions et sites touristiques\n- Les plages\n- Le climat et la meilleure période pour visiter\n- Le mont Yemma Gouraya";
  };

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = { text: input, isBot: false };
    const botMessage: Message = { text: findAnswer(input), isBot: true };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInput("");
  };

  return (
    <div className="fixed bottom-20 right-4 z-50">
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-[#588157] hover:bg-[#3A5A40] text-white rounded-full p-3 shadow-lg transition-colors duration-200"
        >
          <MessageCircle size={24} />
        </button>
      )}

      {isOpen && (
        <div className="bg-white rounded-lg shadow-xl w-80 h-96 flex flex-col">
          <div className="bg-[#588157] text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Guide IA</h3>
            <button onClick={() => setIsOpen(false)} className="hover:text-gray-200 transition-colors duration-200">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.isBot ? 'justify-start' : 'justify-end'}`}
              >
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.isBot
                      ? 'bg-gray-100 text-gray-800'
                      : 'bg-[#588157] text-white'
                  }`}
                >
                  {message.text.split('\n').map((line, i) => (
                    <p key={i} className={i > 0 ? 'mt-1' : ''}>
                      {line}
                    </p>
                  ))}
                </div>
              </div>
            ))}
          </div>

          <div className="border-t p-4 flex gap-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Posez votre question..."
              className="flex-1 border rounded-lg px-3 py-2 focus:outline-none focus:border-[#588157] focus:ring-2 focus:ring-[#588157]/20 transition-all duration-200"
            />
            <button
              onClick={handleSend}
              className="bg-[#588157] hover:bg-[#3A5A40] text-white rounded-lg p-2 transition-colors duration-200"
            >
              <Send size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
} 