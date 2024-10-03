import { useState, useRef } from 'react'
import { SendHorizontal, Settings2 } from 'lucide-react'
import { cn } from '~/utils/utils'
import MiniButton from './MiniButton'
import * as sessionActions from '../stores/session_actions'
import { useSetAtom } from 'jotai'
import * as atoms from '../stores/atoms'
import { SessionType, createMessage } from '../types/index'

export interface Props {
    currentSessionId: string
    currentSessionType: SessionType
}

export default function InputBox(props: Props) {
    const setChatConfigDialogSession = useSetAtom(atoms.chatConfigDialogAtom)
    const [messageInput, setMessageInput] = useState('')
    const inputRef = useRef<HTMLTextAreaElement | null>(null)

    const handleSubmit = (needGenerating = true) => {
        if (messageInput.trim() === '') {
            return
        }
        const newMessage = createMessage('user', messageInput)
        sessionActions.submitNewUserMessage({
            currentSessionId: props.currentSessionId,
            newUserMsg: newMessage,
            needGenerating,
        })
        setMessageInput('')
    }

    const minTextareaHeight = 66
    const maxTextareaHeight = 96

    const onMessageInput = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        const input = event.target.value
        setMessageInput(input)
    }

    const onKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (
            event.key === 'Enter' &&
            !event.shiftKey &&
            !event.ctrlKey &&
            !event.altKey &&
            !event.metaKey
        ) {
            event.preventDefault()
            handleSubmit()
            return
        }
        if (event.key === 'Enter' && event.ctrlKey) {
            event.preventDefault()
            handleSubmit(false)
            return
        }
    }

    return (
        <div className="px-4 py-3 border-t border-gray-200 bg-background">
            <div className="w-full mx-auto flex flex-col">
                <div className="flex flex-row flex-nowrap justify-between items-center mb-2">
                    <MiniButton
                        className="text-text hover:text-primary transition-colors"
                        onClick={() =>
                            setChatConfigDialogSession(sessionActions.getCurrentSession())
                        }
                        tooltipPlacement="top"
                    >
                        <Settings2 className="w-5 h-5" />
                    </MiniButton>
                    <MiniButton
                        className="w-8 bg-primary text-background hover:bg-primary/90 transition-colors"
                        tooltipPlacement="top"
                        onClick={() => handleSubmit()}
                    >
                        <SendHorizontal className="w-5 h-5" />
                    </MiniButton>
                </div>
                <div className="w-full">
                    <textarea
                        className={cn(
                            `w-full max-h-[${maxTextareaHeight}px]`,
                            'overflow-y-auto resize-none border border-gray-200 rounded-md',
                            'outline-none bg-background px-3 py-2 text-text placeholder-gray-400',
                            'font-sans text-base focus:ring-2 focus:ring-primary/50 transition-all',
                            'box-border'  
                        )}
                        value={messageInput}
                        onChange={onMessageInput}
                        onKeyDown={onKeyDown}
                        ref={inputRef}
                        style={{
                            height: 'auto',
                            minHeight: `${minTextareaHeight}px`,
                        }}
                        placeholder={'Type your question here...'}
                    />
                </div>
            </div>
        </div>
    )
}
