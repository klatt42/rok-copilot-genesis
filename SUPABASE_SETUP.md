# Supabase Setup Guide for ROK Copilot

## Step 1: Run the Database Schema

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/nvlumjwaooloycfeafvb

2. Click on **SQL Editor** in the left sidebar

3. Click **New Query**

4. Copy the contents of `supabase/schema.sql` and paste it into the query editor

5. Click **Run** (or press Ctrl/Cmd + Enter)

6. You should see a success message indicating:
   - Tables created: conversations, messages, context_embeddings
   - RLS policies enabled
   - Indexes created
   - View created

## Step 2: Verify Table Creation

1. Click on **Table Editor** in the left sidebar

2. You should see three tables:
   - `conversations`
   - `messages`
   - `context_embeddings`

3. Click on each table to verify the columns:

   **conversations:**
   - id (uuid)
   - user_id (uuid)
   - title (text)
   - created_at (timestamp)
   - updated_at (timestamp)
   - metadata (jsonb)

   **messages:**
   - id (uuid)
   - conversation_id (uuid)
   - role (text)
   - content (text)
   - model_used (text)
   - tokens (integer)
   - cost (decimal)
   - created_at (timestamp)

## Step 3: Disable RLS Temporarily for Testing

Since we haven't set up authentication yet, we need to temporarily disable RLS to test the chat:

1. Go to **SQL Editor**
2. Run this query:

```sql
-- Temporarily disable RLS for testing
ALTER TABLE conversations DISABLE ROW LEVEL SECURITY;
ALTER TABLE messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE context_embeddings DISABLE ROW LEVEL SECURITY;
```

**IMPORTANT:** We'll re-enable this when we add authentication in a later phase.

## Step 4: Environment Variables

Your `.env.local` file has been created with the following values:

```
NEXT_PUBLIC_SUPABASE_URL=https://nvlumjwaooloycfeafvb.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGci...
```

## Step 5: Add Your Anthropic API Key

You still need to add your Anthropic API key to `.env.local`:

1. Go to https://console.anthropic.com/settings/keys
2. Create a new API key or copy an existing one
3. Edit `.env.local` and replace `your_anthropic_api_key` with your actual key

Example:
```
ANTHROPIC_API_KEY=sk-ant-api03-xxx
```

## Step 6: Test the Connection

Run the following command to test your setup:

```bash
cd ~/projects/rok-copilot-genesis
npm run dev
```

Open http://localhost:3000 in your browser and try sending a message!

## Troubleshooting

### "relation does not exist" error
- Make sure you ran the schema.sql file completely
- Check the Table Editor to verify tables exist

### "permission denied" error
- Make sure you disabled RLS as shown in Step 3
- Verify your Supabase keys are correct in .env.local

### "Invalid API key" from Claude
- Make sure your ANTHROPIC_API_KEY is set correctly
- Verify the key is active in the Anthropic console

### Messages not persisting
- Check the browser console for errors
- Check Supabase logs: Dashboard > Logs > Postgres Logs
- Verify the tables exist and RLS is disabled

## Next Steps

After basic functionality is working:

1. **Enable Authentication:**
   - Set up Supabase Auth
   - Re-enable RLS policies
   - Add login/signup flow

2. **Test Message Persistence:**
   - Send several messages
   - Check Supabase Table Editor to see stored messages
   - Verify conversations are created

3. **Add Conversation List:**
   - Create sidebar to show all conversations
   - Allow switching between conversations
   - Show message count and last message time

## Useful Queries

Check if tables exist:
```sql
SELECT table_name
FROM information_schema.tables
WHERE table_schema = 'public';
```

View all conversations:
```sql
SELECT * FROM conversations ORDER BY created_at DESC LIMIT 10;
```

View all messages:
```sql
SELECT * FROM messages ORDER BY created_at DESC LIMIT 20;
```

Count messages per conversation:
```sql
SELECT
  c.title,
  COUNT(m.id) as message_count
FROM conversations c
LEFT JOIN messages m ON m.conversation_id = c.id
GROUP BY c.id, c.title;
```

## Database Backup

Your data is automatically backed up by Supabase, but you can also:

1. Go to **Database** > **Backups** in Supabase dashboard
2. Free tier includes 7 days of backups
3. You can also export data manually via SQL queries

## Security Notes

- Never commit `.env.local` to git (already in .gitignore)
- Keep your Service Role key secret
- Re-enable RLS when adding authentication
- Use environment variables for all secrets
