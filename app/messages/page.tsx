"use client"

import { Sidebar } from "@/components/sidebar"
import { Header } from "@/components/header"
import { Search, Send } from "lucide-react"
import { useState } from "react"

const conversations = [
  {
    id: 1,
    name: "Ahmed Benali",
    lastMessage: "Bonjour, comment ça va ?",
    time: "10:30",
    unread: 2,
    online: true,
    avatar: "AB",
  },
  {
    id: 2,
    name: "Fatima Zahra",
    lastMessage: "J'ai adoré ton post sur Ghardaïa !",
    time: "Hier",
    unread: 0,
    online: false,
    avatar: "FZ",
  },
  {
    id: 3,
    name: "Karim Hadj",
    lastMessage: "Est-ce que vous recommandez un hôtel à Tamanrasset ?",
    time: "Lun",
    unread: 0,
    online: false,
    avatar: "KH",
  },
  {
    id: 4,
    name: "Amina Khelif",
    lastMessage: "Merci pour les conseils !",
    time: "23/04",
    unread: 0,
    online: false,
    avatar: "AK",
  },
]

const messages = [
  {
    id: 1,
    senderId: 1,
    text: "Bonjour, comment ça va ?",
    time: "10:30",
  },
  {
    id: 2,
    senderId: "me",
    text: "Salut Ahmed! Ça va bien, merci. Et toi ?",
    time: "10:32",
  },
  {
    id: 3,
    senderId: 1,
    text: "Très bien ! Je prépare un voyage à Tamanrasset le mois prochain.",
    time: "10:33",
  },
  {
    id: 4,
    senderId: "me",
    text: "Super! C'est une destination magnifique. Je peux te recommander quelques endroits à visiter si tu veux.",
    time: "10:35",
  },
]

export default function MessagesPage() {
  const [selectedConversation, setSelectedConversation] = useState(conversations[0])
  const [newMessage, setNewMessage] = useState("")

  const handleSendMessage = () => {
    if (newMessage.trim() === "") return
    // Ici, vous ajouteriez la logique pour envoyer le message
    setNewMessage("")
  }

  return (
    <div className="min-h-screen bg-[#DAD7CD]/20 flex">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
        <Header title="Messages" />

        <div className="bg-white rounded-xl shadow-md overflow-hidden flex h-[calc(100vh-12rem)]">
          {/* Liste des conversations */}
          <div className="w-1/3 border-r border-gray-200">
            <div className="p-4 border-b border-gray-200">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Rechercher des messages"
                  className="w-full pl-10 pr-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>
            </div>

            <div className="overflow-y-auto h-[calc(100%-4rem)]">
              {conversations.map((conversation) => (
                <div
                  key={conversation.id}
                  className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${
                    selectedConversation.id === conversation.id ? "bg-gray-50" : ""
                  }`}
                  onClick={() => setSelectedConversation(conversation)}
                >
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="h-10 w-10 rounded-full bg-[#588157] flex items-center justify-center text-white">
                        <span>{conversation.avatar}</span>
                      </div>
                      {conversation.online && (
                        <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                      )}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="text-sm font-medium text-gray-900">{conversation.name}</h3>
                        <span className="text-xs text-gray-500">{conversation.time}</span>
                      </div>
                      <p className="text-xs text-gray-500 truncate">{conversation.lastMessage}</p>
                    </div>
                    {conversation.unread > 0 && (
                      <div className="ml-2 bg-[#588157] text-white text-xs font-medium rounded-full h-5 w-5 flex items-center justify-center">
                        {conversation.unread}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Conversation active */}
          <div className="flex-1 flex flex-col">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <div className="relative">
                <div className="h-10 w-10 rounded-full bg-[#588157] flex items-center justify-center text-white">
                  <span>{selectedConversation.avatar}</span>
                </div>
                {selectedConversation.online && (
                  <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white"></div>
                )}
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-gray-900">{selectedConversation.name}</h3>
                <p className="text-xs text-gray-500">{selectedConversation.online ? "En ligne" : "Hors ligne"}</p>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`mb-4 flex ${message.senderId === "me" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs rounded-lg px-4 py-2 ${
                      message.senderId === "me" ? "bg-[#588157] text-white" : "bg-gray-200 text-gray-800"
                    }`}
                  >
                    <p>{message.text}</p>
                    <p className={`text-xs mt-1 ${message.senderId === "me" ? "text-white/70" : "text-gray-500"}`}>
                      {message.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <div className="p-4 border-t border-gray-200">
              <div className="flex items-center">
                <input
                  type="text"
                  placeholder="Écrivez un message..."
                  className="flex-1 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#588157] focus:border-transparent"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSendMessage()
                    }
                  }}
                />
                <button
                  className="ml-2 p-2 rounded-full bg-[#588157] text-white hover:bg-[#3A5A40] transition-colors"
                  onClick={handleSendMessage}
                >
                  <Send className="h-5 w-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
