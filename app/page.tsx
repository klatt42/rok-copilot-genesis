import { ChatInterface } from '@/components/chat/chat-interface'

export default function Home() {
  return (
    <div className="min-h-screen bg-background p-4">
      <header className="max-w-4xl mx-auto mb-4">
        <h1 className="text-3xl font-bold text-center">ROK Copilot</h1>
        <p className="text-center text-muted-foreground">Your Genesis-powered AI assistant</p>
      </header>
      <ChatInterface />
    </div>
  )
}
