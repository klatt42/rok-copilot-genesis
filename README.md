# ROK Copilot

Your Genesis-powered personal AI assistant with voice interface and multi-LLM routing.

## Features

- **Chat Interface**: Clean, responsive chat UI with real-time messaging
- **Claude Sonnet 4.5**: Powered by Anthropic's latest model
- **Multi-LLM Routing**: (Coming Soon) Intelligent routing between different AI models
- **Voice Interface**: (Coming Soon) STT/TTS integration for voice conversations
- **Conversation History**: Persistent storage with Supabase
- **GitHub Sync**: (Coming Soon) Automatic backup to GitHub repository

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **UI**: React 19, Tailwind CSS, shadcn/ui
- **Database**: Supabase (PostgreSQL + Realtime)
- **AI**: Anthropic Claude API
- **Deployment**: Netlify (Coming Soon)

## Getting Started

### Prerequisites

- Node.js 20+
- npm or pnpm
- Supabase account
- Anthropic API key

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/klatt42/rok-copilot-genesis.git
   cd rok-copilot-genesis
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   ```bash
   cp .env.local.example .env.local
   ```

   Edit `.env.local` and add your credentials:
   - `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key
   - `SUPABASE_SERVICE_ROLE_KEY`: Your Supabase service role key
   - `ANTHROPIC_API_KEY`: Your Anthropic API key

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Supabase Setup

Run the following SQL in your Supabase SQL editor:

```sql
-- Conversations table
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  title TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

-- Messages table
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  tokens INTEGER,
  cost DECIMAL(10, 6),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- Basic RLS policies
CREATE POLICY "Users can view own conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own messages"
  ON messages FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM conversations
      WHERE conversations.id = messages.conversation_id
      AND conversations.user_id = auth.uid()
    )
  );
```

## Project Structure

```
rok-copilot-genesis/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Claude API integration
│   ├── globals.css               # Global styles with theme
│   ├── layout.tsx                # Root layout
│   └── page.tsx                  # Home page
├── components/
│   ├── chat/
│   │   ├── chat-interface.tsx    # Main chat component
│   │   └── message.tsx           # Message display component
│   └── ui/                       # shadcn/ui components
│       ├── button.tsx
│       ├── card.tsx
│       └── input.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser client
│   │   ├── server.ts             # Server client
│   │   └── middleware.ts         # Auth middleware
│   └── utils.ts                  # Utility functions
└── middleware.ts                 # Next.js middleware
```

## Development Roadmap

### Phase 1: Foundation (Completed)
- [x] Next.js 15 setup
- [x] Supabase integration
- [x] Basic chat interface
- [x] Claude Sonnet 4.5 integration

### Phase 2: Voice Interface (In Progress)
- [ ] STT provider integration (Wispr Flow/Voxtral)
- [ ] TTS provider integration
- [ ] Voice activity detection
- [ ] Audio playback controls

### Phase 3: Multi-LLM Router
- [ ] LLM router implementation
- [ ] Cost tracking
- [ ] Model selection UI
- [ ] Performance metrics

### Phase 4: Advanced Features
- [ ] Conversation search
- [ ] Context management
- [ ] Export/import conversations
- [ ] Custom prompts/personas

### Phase 5: GitHub Integration
- [ ] Automatic history sync
- [ ] Version control for conversations
- [ ] Markdown export

## Contributing

This is a personal project, but suggestions and ideas are welcome! Feel free to open an issue.

## License

MIT

## Acknowledgments

- Built with [Project Genesis](https://github.com/project-genesis) patterns
- Powered by [Anthropic Claude](https://anthropic.com)
- UI components from [shadcn/ui](https://ui.shadcn.com)
