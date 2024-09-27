import { v4 as uuidv4 } from 'uuid'

export const MessageRoleEnum = {
  System: 'system',
  User: 'user',
  Assistant: 'assistant',
} as const

export type MessageRole = (typeof MessageRoleEnum)[keyof typeof MessageRoleEnum]

export interface Message {
  id: string

  role: MessageRole
  content: string
  name?: string

  cancel?: () => void
  generating?: boolean

  model?: string

  errorCode?: number
  error?: string
  errorExtra?: {
      [key: string]: any
  }

  wordCount?: number
  tokenCount?: number
  tokensUsed?: number
  timestamp?: number
}

export type SettingWindowTab = 'ai' | 'display' | 'chat' | 'advanced'

export type SessionType = 'chat'

export function isChatSession(session: Session) {
  return session.type === 'chat' || !session.type
}

export interface Session {
  id: string
  type?: SessionType
  name: string
  picUrl?: string
  messages: Message[]
  copilotId?: string
}

export function createMessage(role: MessageRole = MessageRoleEnum.User, content: string = ''): Message {
  return {
      id: uuidv4(),
      content: content,
      role: role,
      timestamp: new Date().getTime(),
  }
}
