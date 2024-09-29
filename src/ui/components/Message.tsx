import { useEffect, useState, useRef } from 'react'
import { Message, SessionType } from '../types/index'
import { cn } from '~/utils/utils'

export interface Props {
  id?: string
  sessionId: string
  sessionType: SessionType
  msg: Message
  className?: string
  collapseThreshold?: number
  hiddenButtonGroup?: boolean
  small?: boolean
}

export default function Message(props: Props) {
  const ref = useRef<HTMLDivElement>(null)

  const { msg, className, collapseThreshold, hiddenButtonGroup, small } = props

  return (
    <div
      ref={ref}
      id={props.id}
      key={msg.id}
      className={cn(
        'group/message',
        'msg-block',
        'px-4 py-3 mb-4 rounded-lg',
        msg.generating ? 'animate-pulse' : '',
        {
          'bg-primary/10 text-text': msg.role === 'user',
          'bg-secondary/10 text-text': msg.role === 'system',
          'bg-background text-text': msg.role === 'assistant',
        },
        className,
      )}
    >
      <div className="flex items-start">
        <div className={cn(
          "w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mr-3",
          {
            'bg-primary text-background': msg.role === 'user',
            'bg-secondary text-background': msg.role === 'system',
            'bg-text text-background': msg.role === 'assistant',
          }
        )}>
          {msg.role === 'user' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          )}
          {msg.role === 'system' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          )}
          {msg.role === 'assistant' && (
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>
          )}
        </div>
        <div className="flex-grow text-text">
          {msg.content}
        </div>
      </div>
    </div>
  )
}
