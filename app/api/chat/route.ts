import Anthropic from '@anthropic-ai/sdk'
import { NextRequest, NextResponse } from 'next/server'
import { createMessage } from '@/lib/db/messages'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function POST(request: NextRequest) {
  try {
    const { messages, conversationId } = await request.json()

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Invalid messages format' },
        { status: 400 }
      )
    }

    // Convert messages to Anthropic format
    const anthropicMessages = messages.map((msg: { role: string; content: string }) => ({
      role: msg.role === 'user' ? 'user' : 'assistant',
      content: msg.content,
    }))

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 4096,
      messages: anthropicMessages,
      system: 'You are ROK Copilot, a helpful AI assistant built with Genesis patterns. You are knowledgeable, concise, and friendly.',
    })

    const content = response.content[0]
    if (content.type !== 'text') {
      throw new Error('Unexpected response type')
    }

    // Save assistant message to database if conversationId is provided
    if (conversationId) {
      const cost = (response.usage.input_tokens * 0.003 + response.usage.output_tokens * 0.015) / 1000
      await createMessage(
        conversationId,
        'assistant',
        content.text,
        response.model,
        response.usage.input_tokens + response.usage.output_tokens,
        cost
      )
    }

    return NextResponse.json({
      content: content.text,
      model: response.model,
      usage: response.usage,
    })
  } catch (error) {
    console.error('Error in chat API:', error)
    return NextResponse.json(
      { error: 'Failed to process chat request' },
      { status: 500 }
    )
  }
}
