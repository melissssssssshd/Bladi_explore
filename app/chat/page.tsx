import ChatBox from '@/components/ChatBox';

export default function ChatPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-8 text-gray-800">
          Chatbox Intelligente
        </h1>
        <ChatBox />
      </div>
    </main>
  );
} 