import { createClient } from '@/lib/supabase/server'

export interface Message {
  id: string
  conversation_id: string
  role: 'user' | 'assistant' | 'system'
  content: string
  model_used: string | null
  tokens: number | null
  cost: number | null
  created_at: string
}

export async function createMessage(
  conversationId: string,
  role: 'user' | 'assistant' | 'system',
  content: string,
  modelUsed?: string,
  tokens?: number,
  cost?: number
): Promise<Message | null> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .insert({
      conversation_id: conversationId,
      role,
      content,
      model_used: modelUsed,
      tokens,
      cost,
    })
    .select()
    .single()

  if (error) {
    console.error('Error creating message:', error)
    return null
  }

  return data
}

export async function getMessages(
  conversationId: string
): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: true })

  if (error) {
    console.error('Error fetching messages:', error)
    return []
  }

  return data || []
}

export async function getRecentMessages(
  conversationId: string,
  limit: number = 20
): Promise<Message[]> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('messages')
    .select('*')
    .eq('conversation_id', conversationId)
    .order('created_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent messages:', error)
    return []
  }

  // Return in chronological order
  return (data || []).reverse()
}

export async function deleteMessage(id: string): Promise<boolean> {
  const supabase = await createClient()

  const { error } = await supabase.from('messages').delete().eq('id', id)

  if (error) {
    console.error('Error deleting message:', error)
    return false
  }

  return true
}

export async function getMessageCount(conversationId: string): Promise<number> {
  const supabase = await createClient()

  const { count, error } = await supabase
    .from('messages')
    .select('*', { count: 'exact', head: true })
    .eq('conversation_id', conversationId)

  if (error) {
    console.error('Error getting message count:', error)
    return 0
  }

  return count || 0
}
