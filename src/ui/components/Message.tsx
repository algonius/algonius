import { useEffect, useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
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
  const { t } = useTranslation()
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
        'px-2',
        msg.generating ? 'rendering' : 'render-done',
        {
          user: 'user-msg',
          system: 'system-msg',
          assistant: 'assistant-msg',
        }[msg?.role || 'user'],
        className,
      )}
    >
      <div className="flex items-center"> 
        <div className="w-6 h-6 rounded-full bg-blue-500 flex items-center justify-center mr-2">
          <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C3 19.03 4.168 19.5 7.5 19.5s4.168-.47 4.5 1V6.253z" /></svg>
        </div>
        <p className="text-gray-700">
          {msg.content}
        </p>
      </div>
    </div>
  )
}
