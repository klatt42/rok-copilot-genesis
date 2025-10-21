import { createClient } from '@/lib/supabase/server'

export interface Conversation {
  id: string
  user_id: string
  title: string
  created_at: string
  updated_at: string
  metadata: Record<string, any>
}

export interface ConversationSummary extends Conversation {
  message_count: number
  last_message_at: string | null
}

export async function createConversation(
  userId: string,
  title: string,
  metadata: Record<string, any> = {}
): Promise<Conversation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .insert({
      user_id: userId,
      title,
      metadata,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating conversation:', error)
    return null
  }

  return data
}

export async function getConversations(
  userId: string
): Promise<ConversationSummary[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversation_summaries')
    .select('*')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) {
    console.error('Error fetching conversations:', error)
    return []
  }

  return data || []
}

export async function getConversation(
  id: string
): Promise<Conversation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .select('*')
    .eq('id', id)
    .single()

  if (error) {
    console.error('Error fetching conversation:', error)
    return null
  }

  return data
}

export async function updateConversation(
  id: string,
  updates: Partial<Pick<Conversation, 'title' | 'metadata'>>
): Promise<Conversation | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('conversations')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating conversation:', error)
    return null
  }

  return data
}

export async function deleteConversation(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from('conversations').delete().eq('id', id)

  if (error) {
    console.error('Error deleting conversation:', error)
    return false
  }

  return true
}
