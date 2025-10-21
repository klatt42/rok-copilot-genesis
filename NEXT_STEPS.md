# Next Steps for ROK Copilot

## Immediate Actions (Today)

### 1. Set Up Supabase Project (20 minutes)

1. Go to https://supabase.com/dashboard
2. Click "New Project"
3. Fill in details:
   - Name: `rok-copilot`
   - Database Password: (generate and save securely)
   - Region: Choose closest to you
   - Plan: Free tier

4. Once created, go to Settings > API and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon/Public Key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service Role Key → `SUPABASE_SERVICE_ROLE_KEY`

5. Go to SQL Editor and run the schema from README.md (Supabase Setup section)

### 2. Configure Environment Variables (5 minutes)

```bash
cd ~/projects/rok-copilot-genesis
cp .env.local.example .env.local
```

Edit `.env.local` with your favorite editor and add:
- Supabase credentials from step 1
- Your Anthropic API key
- GitHub token (from https://github.com/settings/tokens)

### 3. Test the Application (10 minutes)

```bash
cd ~/projects/rok-copilot-genesis
npm run dev
```

Open http://localhost:3000 and:
1. Send a test message: "Hello, ROK Copilot!"
2. Verify you get a response from Claude
3. Send 5-10 more messages to test conversation flow
4. Check for any console errors

### 4. Verify Supabase Storage (5 minutes)

Currently, messages are only stored in memory. We need to wire up Supabase for persistence.

Check the Supabase dashboard:
- Go to Table Editor
- Verify `conversations` and `messages` tables exist
- Check RLS policies are enabled

## This Week (October 20-26)

### Database Integration (2-3 hours)

Create the following files to connect chat to Supabase:

1. **lib/db/conversations.ts**
   - `createConversation(userId, title)`
   - `getConversations(userId)`
   - `getConversation(id)`

2. **lib/db/messages.ts**
   - `createMessage(conversationId, role, content)`
   - `getMessages(conversationId)`

3. **Update components/chat/chat-interface.tsx**
   - Load messages from database
   - Save new messages to database
   - Handle conversation creation

### Voice Provider Research (3-4 hours)

**Wispr Flow Trial**
1. Visit https://wisprflow.ai
2. Start 2-week free trial
3. Download app
4. Test with 20+ voice inputs
5. Note accuracy, speed, and UX

**Voxtral Evaluation**
1. Review https://mistral.ai/news/voxtral
2. Test API endpoint with sample audio
3. Compare accuracy with Wispr Flow
4. Check pricing and rate limits

**Decision Criteria:**
- Accuracy on your voice
- Latency (real-time vs batch)
- Cost per minute
- Cross-platform support
- Privacy (local vs cloud)

### TTS Provider Testing (2 hours)

1. **OpenAI TTS** (GPT-4o-mini audio)
   - Test voice quality
   - Measure latency
   - Check pricing

2. **Smallest.ai**
   - Sign up for API access
   - Test voice quality
   - Compare with OpenAI

3. Document findings in PROGRESS.md

## Next Week (October 27 - November 2)

### Phase 2: Voice Interface

1. **Audio Recording Component**
   ```
   components/voice/audio-recorder.tsx
   - Voice activity detection
   - Recording controls
   - Waveform visualization
   ```

2. **STT Integration**
   ```
   app/api/transcribe/route.ts
   - Accept audio file
   - Send to STT provider
   - Return transcription
   ```

3. **TTS Integration**
   ```
   app/api/synthesize/route.ts
   - Accept text
   - Generate audio
   - Return audio file
   ```

4. **Voice Chat UI**
   ```
   components/chat/voice-chat.tsx
   - Push-to-talk button
   - Audio playback
   - Visual feedback
   ```

## Common Issues & Solutions

### Build Errors

```bash
# Clear Next.js cache
rm -rf .next

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Rebuild
npm run dev
```

### Supabase Connection Issues

1. Check environment variables are set correctly
2. Verify Supabase project is not paused (free tier)
3. Check RLS policies allow your operations
4. Look at Supabase logs in dashboard

### TypeScript Errors

```bash
# Regenerate Supabase types (future step)
npm run generate-types

# Check TypeScript version
npx tsc --version
```

## Quick Reference Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Build for production
npm run lint             # Run ESLint

# Git
git status              # Check changes
git add .               # Stage all changes
git commit -m "msg"     # Commit changes
git push                # Push to GitHub

# Database (future)
npm run migrate         # Run migrations
npm run seed            # Seed database
npm run generate-types  # Generate Supabase types
```

## Resources

### Documentation
- Next.js: https://nextjs.org/docs
- Supabase: https://supabase.com/docs
- Anthropic: https://docs.anthropic.com
- shadcn/ui: https://ui.shadcn.com

### APIs
- Wispr Flow: https://wisprflow.ai/docs
- Voxtral: https://docs.mistral.ai
- OpenAI Audio: https://platform.openai.com/docs/guides/audio

### Tools
- Supabase Dashboard: https://supabase.com/dashboard
- GitHub Repos:
  - Main: https://github.com/klatt42/rok-copilot-genesis
  - History: https://github.com/klatt42/rok-copilot-history

## Success Metrics

By end of Week 1:
- [ ] Chat works end-to-end with Claude
- [ ] Messages persist in Supabase
- [ ] 10+ test conversations completed
- [ ] STT provider selected
- [ ] TTS provider selected

By end of Week 2:
- [ ] Voice recording works
- [ ] STT integration complete
- [ ] TTS integration complete
- [ ] Full voice conversation tested
- [ ] Basic error handling in place

## Getting Help

If you run into issues:

1. Check console errors in browser DevTools
2. Check terminal output from `npm run dev`
3. Check Supabase logs in dashboard
4. Review relevant documentation
5. Search GitHub issues for similar problems

## Celebrate Progress!

Remember:
- Phase 1 is complete!
- You have a working chat interface
- Claude integration is functional
- Supabase is configured
- You're ready to build Phase 2

Take breaks, test often, and enjoy the process!
