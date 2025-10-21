'use client'

import { cn } from '@/lib/utils'

interface MessageProps {
  role: 'user' | 'assistant' | 'system'
  content: string
  timestamp?: Date
}

export function Message({ role, content, timestamp }: MessageProps) {
  const isUser = role === 'user'

  return (
    <div
      className={cn(
        'flex w-full mb-4',
        isUser ? 'justify-end' : 'justify-start'
      )}
    >
      <div
        className={cn(
          'max-w-[80%] rounded-lg px-4 py-3',
          isUser
            ? 'bg-primary text-primary-foreground'
            : 'bg-muted text-foreground'
        )}
      >
        <div className="text-sm whitespace-pre-wrap break-words">
          {content}
        </div>
        {timestamp && (
          <div className={cn(
            'text-xs mt-1',
            isUser ? 'text-primary-foreground/70' : 'text-muted-foreground'
          )}>
            {timestamp.toLocaleTimeString()}
          </div>
        )}
      </div>
    </div>
  )
}
